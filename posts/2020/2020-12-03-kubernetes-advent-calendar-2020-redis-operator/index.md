---
title: "Kubernetes2 Advent Calendar 2020 3日目: redis-operatorの導入"
date: "2020-12-03"
---

この記事は [Kubernetes2 Advent Calendar 2020](https://qiita.com/advent-calendar/2020/kubernetes2) の 3 日目です。

直前に空きが出ていたので光速で書きました。
枠が勿体無いですからね。がんばりました。

[2日目がCRD](https://qiita.com/Hiroyuki_OSAKI/items/6319ed09be72ba8ac1d1)だったのでOperatorの話にしました。

> 直前でアレなのですが書く時間を確保できなさそうなので12/3の枠を解放しました🙏  
>   
> どなたか代わりにぜひ〜  
>   
> / "Kubernetes2 Advent Calendar 2020 - Qiita" <https://t.co/izWa5v7Ysa>
>
> — ポジティブな Tori (@toricls) [2020年12月2日](https://twitter.com/toricls/status/1334102191871647744?ref_src=twsrc%5Etfw)

# これはなに?

フルマネージドサービスを使わずにHA構成のRedisを[k8s](http://d.hatena.ne.jp/keyword/k8s)上で動かして運用したい人向け。

HA構成なのでシャーディング使いたい人向けではないです。

redis-operatorは色々ありますが[こちら](https://github.com/spotahome/redis-operator)を使います。

master/slave + sentinelsのRedis HAが[爆誕](http://d.hatena.ne.jp/keyword/%C7%FA%C3%C2)します。

# この記事の動機

金食い虫のRedisのマネージドサービスからの脱却

みんなで導入して運用の知見を高め隊

# 導入の流れ

Namespaceはお好きに作成しておいて以下の流れです。

1. redis-operatorをapply
2. CRをapply
3. おしまい!

## 主な特徴

- master/slave + sentinelsのRedis HAが[爆誕](http://d.hatena.ne.jp/keyword/%C7%FA%C3%C2)
- Redisエンドポイントも[爆誕](http://d.hatena.ne.jp/keyword/%C7%FA%C3%C2)
- Read Replicaのスケールが容易
- [クラスタ](http://d.hatena.ne.jp/keyword/%A5%AF%A5%E9%A5%B9%A5%BF)内アクセス想定
- Sentinelなのでシャーディングは使えない

# Operatorの復習

Operator知らずにとりあえずインストールしたらどうしたらいいかわからなくなったので、

概念理解に参考になりそうな[記事](https://www.redhat.com/ja/topics/containers/what-is-a-kubernetes-operator)を置いておきます。

OperatorはCRDとCustomControllerを実装したもので、それにCRを食わせると定義したものを[爆誕](http://d.hatena.ne.jp/keyword/%C7%FA%C3%C2)させる奴と理解しました。

# Sentinelの復習

そもそもRedisには高可用性の設定以下があって今回はSentinelの話。

- Replication: マスターとレプリカの[レプリケーション](http://d.hatena.ne.jp/keyword/%A5%EC%A5%D7%A5%EA%A5%B1%A1%BC%A5%B7%A5%E7%A5%F3)
- Sentinel: 死活監視と自動フェイルオーバーを行ってくれて、ReplicationをHAにしてくれる。
- Cluster: マルチマスター構成。データを複数サーバに分散するシャーディングでwriteがscaleする奴。

Sentinelはquorum(多数決)を取るので3台以上必要になります。

多数決でフェイルオーバーを行うかどうかを決めます。

ノードのDOWNにも2つあって、自身が検知したSDOWN (Subjectively Down),quorumの数に達したODOWN (Objectively Down)があります。

# Operatorのインストール

公式で[Helm Chart](https://github.com/spotahome/redis-operator#using-the-helm-chart)が用意されているので、それを使うだけでインストールできます。
サービスではhelmfileで入れています。

デフォルトのvalues.[yaml](http://d.hatena.ne.jp/keyword/yaml)ではRBACが作られないので `rbac.install = true`で専用のRBACを作るようにします。Namespaceも区切りました。

# Redisのインストール

RedisFailoverリソースを定義します。

redisはStatefulSet, sentinelsはDeploymentとしてPodが起動します。

`rfr-` が `redis` で `rfs-` は `sentinel`になります。

```
kgp -n redis
NAME                                READY   STATUS    RESTARTS   AGE
rfr-redisfailover-0                 1/1     Running   0          141m
rfr-redisfailover-1                 1/1     Running   0          145m
rfr-redisfailover-2                 1/1     Running   0          21h
rfs-redisfailover-7d6869df6-7k5gt   1/1     Running   0          137m
rfs-redisfailover-7d6869df6-82785   1/1     Running   0          3h9m
rfs-redisfailover-7d6869df6-wlxz7   1/1     Running   0          139m
```

EndpointもClusterIPができあがります。

```
NAME                TYPE        CLUSTER-IP    EXTERNAL-IP   PORT(S)     AGE
rfs-redisfailover   ClusterIP   10.36.2.254   <none>        26379/TCP   46h
```

## 対マイクロサービス

マイクロサービスでKeyが衝突しないようにデータベースを分けて使います。

# 設定例

RedisFailoverというCRDを使ってリソースを作成します。

公式で[設定例集](https://github.com/spotahome/redis-operator/tree/master/example/redisfailover)があり色んなパターンがあるので参考になります。

また[custom-config](https://github.com/spotahome/redis-operator/blob/v1.0.0/example/redisfailover/custom-config.yaml#L10)でredisの設定を書くことも可能です。

- imageのupdate

updateStrategyは[OnDelete type](https://github.com/spotahome/redis-operator/blob/b3dad57f5c4c94fe48824deacf391ab82232b3d5/operator/redisfailover/service/generator.go#L257)でした。更新をapplyしたあとにPodが削除される振る舞いでrollingupdateとは違った振る舞いです。

- 高可用性の設定

Sentinelとredisはそれぞれ同じノードに乗らないようにすることで可用性が高まります。

podAntiAffinityを指定して相乗りしないようにするのがおすすめです。

podAntiAffinityの設定の書き方の場合は[これ](https://github.com/spotahome/redis-operator/blob/master/example/redisfailover/pod-anti-affinity.yaml)とか参考になります。

app.[kubernetes](http://d.hatena.ne.jp/keyword/kubernetes).io/nameやapp.[kubernetes](http://d.hatena.ne.jp/keyword/kubernetes).io/componentは[redis-operationで管理されているLabel](https://github.com/spotahome/redis-operator#control-of-label-propagation)なのでこれを活用するとよいです。

- failoverの設定

down-after-milliseconds: Master/SlaveのDOWNN検知後、SDOWNに移行するまでの時間で、デフォルトが5秒です。

failover-timeout: failoverのtimeoutです。(ms)

- 実行ユーザの変更

root実行ではなく実行ユーザの情報が変更されていることを確認

```
$ k exec -it rfs-redisfailover-7d6869df6-4nfxl -n redis -- id
uid=1000 gid=1000 groups=1000
```

全体の設定のsample

```
sentinel:
    replicas: 3
    image: redis:6.0.9
    resources:
      requests:
        cpu: 100m
        memory: 100Mi
      limits:
        cpu: 100m
        memory: 100Mi
    customConfig:
      - "down-after-milliseconds 2000"
      - "failover-timeout 3000"
    securityContext:
      runAsUser: 1000
      runAsGroup: 1000
      fsGroup: 1000
    affinity:
      podAntiAffinity:
        preferredDuringSchedulingIgnoredDuringExecution:
        - weight: 100
          podAffinityTerm:
            labelSelector:
              matchLabels:
                app.kubernetes.io/name: redisfailover
                app.kubernetes.io/component: sentinel
            topologyKey: kubernetes.io/hostname
  # redis(master/slave) pods
  redis:
    replicas: 3
    image: redis:6.0.9
    resources:
      requests:
        cpu: 100m
        memory: 200Mi
      limits:
        cpu: 100m
        memory: 200Mi
    securityContext:
      runAsUser: 1000
      runAsGroup: 1000
      fsGroup: 1000
    affinity:
      podAntiAffinity:
        preferredDuringSchedulingIgnoredDuringExecution:
        - weight: 100
          podAffinityTerm:
            labelSelector:
              matchLabels:
                app.kubernetes.io/name: redisfailover
                app.kubernetes.io/component: redis
            topologyKey: kubernetes.io/hostname
```

# 監視

Datadogでとれるredisのメトリクス一覧は[こちら](https://github.com/spotahome/redis-operator/blob/b3dad57f5c4c94fe48824deacf391ab82232b3d5/operator/redisfailover/service/generator.go#L257)。

以下のメトリクスでreplicationとEvictionとメモリ使用量の監視をしました。

他に監視したほうがいいものがあれば

- redis.replication.last\_io\_seconds\_ago
- redis.keys.evicted
- redis.mem.used

# 障害対応

基本はPod数かmemoryのresourceを増やす

# 動作確認

まずRedisのMasterでSet/Getできるか確認

```
$ kubectl exec -ti rfs-redisfailover-7d6869df6-h7fwr -n redis -- redis-cli -h 10.36.2.254 -p 26379
10.36.2.254:26379> SENTINEL get-master-addr-by-name mymaster
1) "10.32.4.8"
2) "6379"
$ kubectl exec -ti rfs-redisfailover-7d6869df6-h7fwr -n redis -- redis-cli -h 10.32.4.8
10.32.4.8:6379> set hello world
OK
10.32.4.8:6379> get hello
"world"
```

次にフェイルオーバーも確認していきます。

このコマンドで30秒間スリープしてmasterに[access](http://d.hatena.ne.jp/keyword/access)できないようにします。

masterが何かの理由でhung状態になる状況を想定した動作検証です。

```
$ kubectl exec -ti rfs-redisfailover-7d6869df6-h7fwr -n redis -- redis-cli -h 10.36.2.254 -p 26379
```

`SENTINEL get-master-addr-by-name <master name>` はmasterのipとport番号を名前と一緒に返します。masterが `10.32.4.8` から `10.32.13.4` になったのがわかります。

```
$ kubectl exec -ti rfs-redisfailover-7d6869df6-h7fwr -n redis -- redis-cli -h 10.36.2.254 -p 26379
10.36.2.254:26379> SENTINEL get-master-addr-by-name mymaster
1) "10.32.4.8"
2) "6379"
10.36.2.254:26379> SENTINEL get-master-addr-by-name mymaster
1) "10.32.13.4"
2) "6379"
```

ここでsentinelのログからフェイルオーバーの動作を見ていきます。

ログから以下のアクションがわかります。

1. 各Sentinelはマスタが `+sdown` イベントでダウンしたことを検知します。
2. このイベントは後で `+odown` に昇格されます。それは複数のSentinelがマスタが到達不可能である事実に同意したことを意味します。
3. Sentinel は最初フェイルオーバーの試行を開始するSentinelに投票します。
4. フェイルオーバーが発生します。

sentinelのログ

```
rfs-redisfailover-7d6869df6-4nfxl sentinel 1:X 25 Nov 2020 06:45:10.831 # +set master mymaster 10.32.4.8 6379 failover-timeout 3000
rfs-redisfailover-7d6869df6-4nfxl sentinel 1:X 25 Nov 2020 06:45:25.503 # +new-epoch 10
rfs-redisfailover-7d6869df6-4nfxl sentinel 1:X 25 Nov 2020 06:45:25.508 # +vote-for-leader 5051f1baca46e38724a816c720439f2960ff00e8 10
rfs-redisfailover-7d6869df6-4nfxl sentinel 1:X 25 Nov 2020 06:45:25.623 # +sdown master mymaster 10.32.4.8 6379
rfs-redisfailover-7d6869df6-4nfxl sentinel 1:X 25 Nov 2020 06:45:25.678 # +odown master mymaster 10.32.4.8 6379 #quorum 3/2
rfs-redisfailover-7d6869df6-4nfxl sentinel 1:X 25 Nov 2020 06:45:25.678 # Next failover delay: I will not start a failover before Wed Nov 25 06
:45:32 2020
rfs-redisfailover-7d6869df6-4nfxl sentinel 1:X 25 Nov 2020 06:45:26.631 # +config-update-from sentinel 5051f1baca46e38724a816c720439f2960ff00e8
 10.32.1.9 26379 @ mymaster 10.32.4.8 6379
rfs-redisfailover-7d6869df6-4nfxl sentinel 1:X 25 Nov 2020 06:45:26.631 # +switch-master mymaster 10.32.4.8 6379 10.32.13.4 6379
rfs-redisfailover-7d6869df6-4nfxl sentinel 1:X 25 Nov 2020 06:45:26.631 * +slave slave 10.32.7.11:6379 10.32.7.11 6379 @ mymaster 10.32.13.4 63
79
```

先程書き込めた `10.32.4.8` がリードレプリカとなって書き込めないのも確認できます。

```
10.32.4.8:6379> set hey you
(error) READONLY You can't write against a read only replica.
```

# プリエンプティブ(スポット)[インスタンス](http://d.hatena.ne.jp/keyword/%A5%A4%A5%F3%A5%B9%A5%BF%A5%F3%A5%B9)を使用している場合

いつノードが落ちるかわからないのでプリエンプティブ(スポット)[インスタンス](http://d.hatena.ne.jp/keyword/%A5%A4%A5%F3%A5%B9%A5%BF%A5%F3%A5%B9)上では起動させたくない場合はNodeAffinityを導入するとよいです。GKEの場合は、requiredDuringSchedulingIgnoredDuringExecutionで [`cloud.google.com/gke-preeptible`](http://cloud.google.com/gke-preeptible)ラベルが表示されるノードにはPodがスケジュールされないようにします。

- requiredDuringSchedulingIgnoredDuringExecution

```
affinity:
  nodeAffinity:
    requiredDuringSchedulingIgnoredDuringExecution:
      nodeSelectorTerms:
      - matchExpressions:
        - key: cloud.google.com/gke-preemptible
          operator: DoesNotExist
```

また、preferredDuringSchedulingIgnoredDuringExecutionで [`cloud.google.com/gke-preemptible`](http://cloud.google.com/gke-preemptible) ラベルが表示されるノードに可能ならスケジュール、そうでなければ他にスケジュールするといった設定も可能です。

- preferredDuringSchedulingIgnoredDuringExecution

```
affinity:
  nodeAffinity:
    preferredDuringSchedulingIgnoredDuringExecution:
    - preference:
        matchExpressions:
        - key: cloud.google.com/gke-preemptible
          operator: Exists
      weight: 100
```

以上がredis-operatorの導入になります。
その他にこうした方がいいなどありましたらブログのコメントにください。

明日の [Kubernetes2 Advent Calendar 2020](https://qiita.com/advent-calendar/2020/kubernetes2) 4日目は [@iaoiui](https://qiita.com/iaoiui) さんの「KubeCon NA参加してみたので[Kubernetes](http://d.hatena.ne.jp/keyword/Kubernetes)の今後を予測してみる」です！お楽しみに！

# 参考

[Redisのドキュメント](http://mogile.web.fc2.com/redis/documentation.html)

[Sentinelのドキュメント](http://mogile.web.fc2.com/redis/topics/sentinel.html)

[Redisのレプリケーションのドキュメント](http://mogile.web.fc2.com/redis/topics/replication.html)

[redis-cli、Redisコマンドライン インタフェース](http://mogile.web.fc2.com/redis/topics/rediscli.html)

[Kubernates上でKVSをマネージドっぽく使いたい!](https://speakerdeck.com/zuiurs/managed-kvs-on-kubernetes)

[spotahome/redis-operator](https://github.com/spotahome/redis-operator)

[ステートフル ワークロードを実行する GKE クラスタのアップグレード](https://cloud.google.com/kubernetes-engine/docs/tutorials/upgrading-stateful-workload?hl=ja#top_of_page)
