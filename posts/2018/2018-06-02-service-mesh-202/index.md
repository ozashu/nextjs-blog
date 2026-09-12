---
title: "# 202-service-mesh"
date: "2018-06-02"
---

Istioも0.8がリリースされたので、Istioの公式ドキュメントからサンプルアプリケーションを動かしたほうがよいです。
それでは続きをしていきます。

# Service Mesh integration with Kubernetes

Service Mesh[コンポーネント](http://d.hatena.ne.jp/keyword/%A5%B3%A5%F3%A5%DD%A1%BC%A5%CD%A5%F3%A5%C8)をKubernetes[クラスタ](http://d.hatena.ne.jp/keyword/%A5%AF%A5%E9%A5%B9%A5%BF)に統合する方法を示します。
Service Meshは、マイクロサービス間の通信を管理するレイヤーで、[クラウド](http://d.hatena.ne.jp/keyword/%A5%AF%A5%E9%A5%A6%A5%C9)ネイティブアプリケーションにとって普及している
サービス検出、負荷分散、自動再試行、回路遮断器、収集要求/応答メトリック、トレース情報などの重要な機能があります。

2つのよく知られているサービスメッシュ統合について検討します。

- Linkerd
- Istio

こちらも[あわせて読みたい](http://d.hatena.ne.jp/keyword/%A4%A2%A4%EF%A4%BB%A4%C6%C6%C9%A4%DF%A4%BF%A4%A4)です。 [Service meshとは何か](https://deeeet.com/writing/2018/05/22/service-mesh/)

## LinkerdとKubernetesの使用

[Linkerd](https://linkerd.io/)は、HTTP、Thrift、Mux、HTTP/2、およびgRPC経由で[トラフィック](http://d.hatena.ne.jp/keyword/%A5%C8%A5%E9%A5%D5%A5%A3%A5%C3%A5%AF)をルーティングおよびロードバランスするレイヤ5/7のプロキシです。
それはFinagle（[Twitter](http://d.hatena.ne.jp/keyword/Twitter)で構築）に基づいており、2017年1月にlinkerdがKubernetesとともに[CNCF](https://www.cncf.io/)のメンバーになりました。

Linkerdは、回路破壊、待ち時間を考慮したロードバランシング、最終的に一貫した（「アドバイザリ」）サービス発見、デッドライン伝播、トレーシングと計測など、幅広い強力なテクニックを使用して、可視性、制御、および信頼性をアプリケーションに追加します。
今回Kubernetes[クラスタ](http://d.hatena.ne.jp/keyword/%A5%AF%A5%E9%A5%B9%A5%BF)ーで実行されているサービスの可視性に焦点を当てます。
k8s[クラスタ](http://d.hatena.ne.jp/keyword/%A5%AF%A5%E9%A5%B9%A5%BF)にlinkerdをインストールし、いくつかの簡単なマイクロサービスを実行し、linkerdが成功率、要求量、待ち時間などのトップラインサービスメトリクスをどのように取得するかを行います。
Linkerdの次のような機能をいくつか見ていきます。

1. Service Mesh内の[トラフィック](http://d.hatena.ne.jp/keyword/%A5%C8%A5%E9%A5%D5%A5%A3%A5%C3%A5%AF)の監視
2. リク[エス](http://d.hatena.ne.jp/keyword/%A5%A8%A5%B9)トごとのルーティング

## Kubernetes[クラスタ](http://d.hatena.ne.jp/keyword/%A5%AF%A5%E9%A5%B9%A5%BF)を作成する

3つのマスターノードと5つのワーカーノードを持つ[クラスタ](http://d.hatena.ne.jp/keyword/%A5%AF%A5%E9%A5%B9%A5%BF)を用意

## Linkerdをインストールする

`kubectl` でインストールします。
デフォルトのKubernetes[名前空間](http://d.hatena.ne.jp/keyword/%CC%BE%C1%B0%B6%F5%B4%D6)で動作するDaemonSet（つまり、ホストごとに1つの[インスタンス](http://d.hatena.ne.jp/keyword/%A5%A4%A5%F3%A5%B9%A5%BF%A5%F3%A5%B9)）としてlinkerdがインストールされます。

```
kubectl apply -f https://raw.githubusercontent.com/linkerd/linkerd-examples/master/\
k8s-daemonset/k8s/linkerd.yml
configmap "l5d-config" created
daemonset "l5d" created
service "l5d" created
```

linkerd（l5dという名前の）ポッドが実行されていることを確認します。

```
$ kubectl get pods
NAME        READY     STATUS    RESTARTS   AGE
l5d-b8pht   2/2       Running   0          48s
l5d-jlpcl   2/2       Running   0          48s
l5d-kl98n   2/2       Running   0          48s
l5d-mp4vn   2/2       Running   0          48s
l5d-nnxqz   2/2       Running   0          48s
```

これは、5ワーカーノード[クラスタ](http://d.hatena.ne.jp/keyword/%A5%AF%A5%E9%A5%B9%A5%BF)からの出力です。
linkerdサービスが実行されていることを確認します。

```
$ kubectl get svc
NAME         TYPE           CLUSTER-IP      EXTERNAL-IP        PORT(S)                                        AGE
kubernetes   ClusterIP      100.64.0.1      <none>             443/TCP                                        5m
l5d          LoadBalancer   100.67.155.17   a8ac6926260d4...   4140:32573/TCP,4141:31565/TCP,9990:30298/TCP   2m
```

linkerdサービスの詳細もみてみます。

```
$ kubectl describe svc/l5d
Name:                     l5d
Namespace:                default
Labels:                   <none>
Annotations:              kubectl.kubernetes.io/last-applied-configuration={"apiVersion":"v1","kind":"Service","metadata":{"annotations":{},"name":"l5d","namespace":"default"},"spec":{"ports":[{"name":"outgoing","port":4140},{...
Selector:                 app=l5d
Type:                     LoadBalancer
IP:                       100.70.56.141
LoadBalancer Ingress:     abf44db7dbe1211e7a7d00220684043f-1319890531.eu-central-1.elb.amazonaws.com
Port:                     outgoing  4140/TCP
TargetPort:               4140/TCP
NodePort:                 outgoing  30108/TCP
Endpoints:                100.96.3.2:4140,100.96.4.2:4140,100.96.5.4:4140 + 2 more...
Port:                     incoming  4141/TCP
TargetPort:               4141/TCP
NodePort:                 incoming  31209/TCP
Endpoints:                100.96.3.2:4141,100.96.4.2:4141,100.96.5.4:4141 + 2 more...
Port:                     admin  9990/TCP
TargetPort:               9990/TCP
NodePort:                 admin  32117/TCP
Endpoints:                100.96.3.2:9990,100.96.4.2:9990,100.96.5.4:9990 + 2 more...
Session Affinity:         None
External Traffic Policy:  Cluster
Events:
  Type    Reason                Age   From                Message
  ----    ------                ----  ----                -------
  Normal  CreatingLoadBalancer  3m    service-controller  Creating load balancer
  Normal  CreatedLoadBalancer   3m    service-controller  Created load balancer
```

Linkerdの管理ページ（ELB：9990）に行ってインストールを確認することができます。
ELB [DNS](http://d.hatena.ne.jp/keyword/DNS)が利用可能になるには、1〜2分かかります。
ロードバランサエンドポイントにアクセスする際に問題が発生した場合は、[ファイアウォール](http://d.hatena.ne.jp/keyword/%A5%D5%A5%A1%A5%A4%A5%A2%A5%A6%A5%A9%A1%BC%A5%EB)または[VPN](http://d.hatena.ne.jp/keyword/VPN)がポート9990へのアクセスを妨げている可能性があります。

```
LINKERD_ELB=$(kubectl get svc l5d -o jsonpath="{.status.loadBalancer.ingress[0].*}")
open http://$LINKERD_ELB:9990
```

openコマンドがだめだったらブラウザからURLを入力していけます。

[ダッシュ](http://d.hatena.ne.jp/keyword/%A5%C0%A5%C3%A5%B7%A5%E5)ボードを確認しましょう。

## サンプルのmicroservicesアプリケーションをインストールする

[linkerd examplesリポジトリ](https://github.com/linkerd/linkerd-examples/tree/master/k8s-daemonset/k8s)に「hello」と「world」という2つのマイクロサービスアプリがあります。
それらはお互いに通信してリク[エス](http://d.hatena.ne.jp/keyword/%A5%A8%A5%B9)トを完了します。このコマンドを実行すると、デフォルトの[名前空間](http://d.hatena.ne.jp/keyword/%CC%BE%C1%B0%B6%F5%B4%D6)にこれらのアプリがインストールされます。

```
$ kubectl apply -f https://raw.githubusercontent.com/linkerd/linkerd-examples/master/\
k8s-daemonset/k8s/hello-world.yml
replicationcontroller "hello" created
service "hello" created
replicationcontroller "world-v1" created
service "world-v1" created
```

次のコマンドを実行して[トラフィック](http://d.hatena.ne.jp/keyword/%A5%C8%A5%E9%A5%D5%A5%A3%A5%C3%A5%AF)を生成します。

```
http_proxy=$LINKERD_ELB:4140 curl -s http://hello
```

Linkerdは、提供されているリク[エス](http://d.hatena.ne.jp/keyword/%A5%A8%A5%B9)ト数、接続数、豊富なデータを表示します。

## Install linkerd-viz

[linkerd-viz](https://github.com/linkerd/linkerd-viz)は、PrometheusとGrafanaに基づく監視アプリケーションです。
k8s[クラスタ](http://d.hatena.ne.jp/keyword/%A5%AF%A5%E9%A5%B9%A5%BF)にインストールされているリンカー[インスタンス](http://d.hatena.ne.jp/keyword/%A5%A4%A5%F3%A5%B9%A5%BF%A5%F3%A5%B9)とサービスを自動的に検索できます。

```
$ kubectl apply -f https://raw.githubusercontent.com/linkerd/linkerd-viz/master/k8s/linkerd-viz.yml
replicationcontroller "linkerd-viz" created
service "linkerd-viz" created
```

linkerd-viz ELBを開いて[ダッシュ](http://d.hatena.ne.jp/keyword/%A5%C0%A5%C3%A5%B7%A5%E5)ボードを表示できます

```
LINKERD_VIZ_ELB=$(kubectl get svc linkerd-viz -o jsonpath="{.status.loadBalancer.ingress[0].*}")
open http://$LINKERD_VIZ_ELB
```

前の例と同様に、ELB [DNS](http://d.hatena.ne.jp/keyword/DNS)が利用可能になるには1〜2分かかることがあります。

## リク[エス](http://d.hatena.ne.jp/keyword/%A5%A8%A5%B9)トごとのルーティング

上記の例で使用したのと同じ「hello-world」アプリケーションを使用しますが、今回は「world」マイクロサービスのバージョン2をデプロイし、要求ごとにリク[エス](http://d.hatena.ne.jp/keyword/%A5%A8%A5%B9)トでv1かv2を使用するかどうかを指定します
「hello-world」アプリケーションをまだ配備していない場合は、今すぐデプロイしてください。

```
kubectl apply -f https：//raw.githubusercontent.com/linkerd/linkerd-examples/master/ \
k8s-daemonset / k8s / hello-world.yml
```

以前のリンカーのDaemonsetを削除してください。ConfigMapを更新して新しいものをインストールします

```
$ kubectl delete ds/l5d
```

アプリケーションに外部からアクセスできるようにlinkerd [ingress](http://d.hatena.ne.jp/keyword/ingress)をデプロイします。

```
$ kubectl apply -f https://raw.githubusercontent.com/linkerd/linkerd-examples/master/\
k8s-daemonset/k8s/linkerd-ingress.yml
configmap "l5d-config" configured
daemonset "l5d" configured
service "l5d" configured
```

今、バージョン2の「world」マイクロサービスを導入してください。

```
$ kubectl apply -f https://raw.githubusercontent.com/linkerd/linkerd-examples/master/\
k8s-daemonset/k8s/world-v2.yml
replicationcontroller "world-v2" created
service "world-v2" created
```

サービスのv1にリク[エス](http://d.hatena.ne.jp/keyword/%A5%A8%A5%B9)トを送信します。それは '[Hello world](http://d.hatena.ne.jp/keyword/Hello%20world)'と返信する必要があります。

```
INGRESS_LB=$(kubectl get svc l5d -o jsonpath="{.status.loadBalancer.ingress[0].*}")
curl -H 'Host: www.hello.world' $INGRESS_LB
```

1〜2分後、次の[Hello world](http://d.hatena.ne.jp/keyword/Hello%20world)ように返信する必要があります。

```
Hello (100.96.1.12) world (100.96.1.14)
```

要求のヘッダーを変更して、サービスのv2に要求を送信します。

```
Hello (100.96.1.11) earth (100.96.2.14)
```

次のように「Hello Earth」と返信する必要があります

```
Hello (100.96.1.11) earth (100.96.2.14)
```

これは、worldサービスのv1とv2が[クラスタ](http://d.hatena.ne.jp/keyword/%A5%AF%A5%E9%A5%B9%A5%BF)内で実行されていることを示しています。
また、要求ヘッダーに個々の要求をルーティングするサービスのバージョンを指定できます。
これでおしまい！
linkerdの設定ファイルを[linkerdの例](https://github.com/linkerd/linkerd-examples/tree/master/k8s-daemonset/k8s)で見ることができます。

## Cleanup

インストールした[コンポーネント](http://d.hatena.ne.jp/keyword/%A5%B3%A5%F3%A5%DD%A1%BC%A5%CD%A5%F3%A5%C8)の削除

```
kubectl delete -f install/kubernetes/addons/servicegraph.yaml
kubectl delete -f install/kubernetes/addons/prometheus.yaml
kubectl delete -f install/kubernetes/istio-auth.yaml
kubectl delete -f install/kubernetes/istio.yaml
./samples/bookinfo/kube/cleanup.sh
```

```
kubectl get all
kubectl get all --namespace istio-system
```

## IstioとKubernetesの併用

Istioは、HTTP、WebSocket、HTTP/2、gRPC経由で[トラフィック](http://d.hatena.ne.jp/keyword/%A5%C8%A5%E9%A5%D5%A5%A3%A5%C3%A5%AF)のルーティングとロードを行い、MongoDBやRedisなどのアプリケーション[プロトコル](http://d.hatena.ne.jp/keyword/%A5%D7%A5%ED%A5%C8%A5%B3%A5%EB)をサポートするレイヤ4/7プロキシです。
IstioはEnvoyプロキシを使用して、サービスメッシュ内のすべての着信/発信[トラフィック](http://d.hatena.ne.jp/keyword/%A5%C8%A5%E9%A5%D5%A5%A3%A5%C3%A5%AF)を管理します。
Envoyは[Lyft](https://www.lyft.com/)によって建設され、2017年9月EnvoyはKubernetesと共にCNCFのメンバーになった。
Istioは、[Google](http://d.hatena.ne.jp/keyword/Google)、[IBM](http://d.hatena.ne.jp/keyword/IBM)、[Lyft](http://d.hatena.ne.jp/keyword/Lyft)の共同開発です。

Istioには、A/Bテスト、段階的/カナリ・ロールアウト、障害回復、回路遮断器、レイヤー7ルーティング、ポリシー施行（すべてEnvoyプロキシによって提供される）など、アプリケーションコードの外にあるさまざまな[トラフィック](http://d.hatena.ne.jp/keyword/%A5%C8%A5%E9%A5%D5%A5%A3%A5%C3%A5%AF)管理機能があります。
また、IstioはMixer[コンポーネント](http://d.hatena.ne.jp/keyword/%A5%B3%A5%F3%A5%DD%A1%BC%A5%CD%A5%F3%A5%C8)を使用して、[ACL](http://d.hatena.ne.jp/keyword/ACL)、レート制限、クォータ、認証、要求トレース、テレメトリ収集をサポートしています。
Istioプロジェクトの目標は、アプリケーションの変更を必要とせずに[トラフィック](http://d.hatena.ne.jp/keyword/%A5%C8%A5%E9%A5%D5%A5%A3%A5%C3%A5%AF)管理とマイクロサービスのセキュリティをサポートすることです。
これは、すべてのネットワーク通信を処理するside-carをポッドに注入することで行います。

この演習では、Istioが提供する次のような機能をいくつか見ていきます。

- 加重ルーティング
- 分散トレース
- 相互[TLS](http://d.hatena.ne.jp/keyword/TLS)認証

### Kubernetes[クラスタ](http://d.hatena.ne.jp/keyword/%A5%AF%A5%E9%A5%B9%A5%BF)を作成

3つのマスターノードと5つのワーカーノードを持つ[クラスタ](http://d.hatena.ne.jp/keyword/%A5%AF%A5%E9%A5%B9%A5%BF)を使用

### Istioをインストールする

Istioは、Envoy(side-car proxy)の[サイドカー](http://d.hatena.ne.jp/keyword/%A5%B5%A5%A4%A5%C9%A5%AB%A1%BC)をポッドに挿入するためにマシンにバイナリをインストールする必要があります。
つまり、Istioをダウンロードする必要があります。Istioは自動的にside-carを注入することもできます。
詳細は[Istioクイックスタート](https://istio.io/docs/setup/kubernetes/quick-start)をご覧ください

```
curl -L  https://git.io/getLatestIstio | sh -
cd istio-*
export PATH=$PWD/bin:$PATH
```

これで、`istioctl` [CLI](http://d.hatena.ne.jp/keyword/CLI) を実行できるはずです

```
$ istioctl version
Version: 0.8.0
GitRevision: 6f9f420f0c7119ff4fa6a1966a6f6d89b1b4db84
User: root@48d5ddfd72da
Hub: docker.io/istio
GolangVersion: go1.10.1
BuildStatus: Clean
```

kubectlを使用してIstioをインストールします。
これにより、Istioが独自の[名前空間](http://d.hatena.ne.jp/keyword/%CC%BE%C1%B0%B6%F5%B4%D6) `istio-system` にインストールされます。
上記の手順でIstioをダウンロードした[ディレクト](http://d.hatena.ne.jp/keyword/%A5%C7%A5%A3%A5%EC%A5%AF%A5%C8)リに移動します。
side-car 間の相互[TLS](http://d.hatena.ne.jp/keyword/TLS)認証を有効にせずにIstioをインストールします。
既存のアプリケーションを持つ[クラスタ](http://d.hatena.ne.jp/keyword/%A5%AF%A5%E9%A5%B9%A5%BF)、Istioside-carを持つサービスが他の非Istio Kubernetesサービスと通信できる必要があるアプリケーション、生存度と準備性のプローブ、ヘッドレスサービス、またはStatefulSet を使用するアプリケーションには、このオプションを選択します。

```
kubectl apply -f install/kubernetes/istio-demo.yaml
```

Istioがインストールされていることを確認します。
Istioは独自の[名前空間](http://d.hatena.ne.jp/keyword/%CC%BE%C1%B0%B6%F5%B4%D6)にインストールされています。

```
$ kubectl get all --namespace istio-system
NAME                   DESIRED   CURRENT   UP-TO-DATE   AVAILABLE   AGE
deploy/istio-ca        1         1         1            1           1m
deploy/istio-egress    1         1         1            1           1m
deploy/istio-ingress   1         1         1            1           1m
deploy/istio-mixer     1         1         1            1           2m
deploy/istio-pilot     1         1         1            1           1m

NAME                          DESIRED   CURRENT   READY     AGE
rs/istio-ca-2651333813        1         1         1         1m
rs/istio-egress-2836352731    1         1         1         1m
rs/istio-ingress-2873642151   1         1         1         1m
rs/istio-mixer-1999632368     1         1         1         2m
rs/istio-pilot-1811250569     1         1         1         1m

NAME                   DESIRED   CURRENT   UP-TO-DATE   AVAILABLE   AGE
deploy/istio-ca        1         1         1            1           1m
deploy/istio-egress    1         1         1            1           1m
deploy/istio-ingress   1         1         1            1           1m
deploy/istio-mixer     1         1         1            1           2m
deploy/istio-pilot     1         1         1            1           1m

NAME                                READY     STATUS    RESTARTS   AGE
po/istio-ca-2651333813-pcr1f        1/1       Running   0          1m
po/istio-egress-2836352731-sfj7j    1/1       Running   0          1m
po/istio-ingress-2873642151-vzfxr   1/1       Running   0          1m
po/istio-mixer-1999632368-nz0mw     2/2       Running   0          2m
po/istio-pilot-1811250569-mmfdg     1/1       Running   0          1m
```

## サンプルアプリケーションのデプロイ

私たちは、Istioチームが開発した[サンプルアプリケーション](https://istio.io/docs/guides/bookinfo/)を使用して、Istioの機能をチェックします。
Envoy(side-car proxy)をアプリケーションに手動で注入する方法を使用しているので、以下のように `istioctl` を使用する必要があります。

```
kubectl apply -f <(istioctl kube-inject -f samples/bookinfo/kube/bookinfo.yaml)
```

これによりBookInfoアプリケーションが展開されます。
これは4つのマイクロサービスで構成され、それぞれが異なる言語で書かれており、共同して書籍の製品情報、書籍の詳細、書籍のレビューを表示します。
各マイクロサービスは専用ポッドに配置され、エンボイプロキシはポッドに注入されます。
Envoyは、ポッド間のすべてのネットワーク通信を引き継ぐようになります。
すべての[コンポーネント](http://d.hatena.ne.jp/keyword/%A5%B3%A5%F3%A5%DD%A1%BC%A5%CD%A5%F3%A5%C8)がインストールされていることを確認しましょう

```
$ kubectl get all
NAME                    DESIRED   CURRENT   UP-TO-DATE   AVAILABLE   AGE
deploy/details-v1       1         1         1            1           3h
deploy/productpage-v1   1         1         1            1           3h
deploy/ratings-v1       1         1         1            1           3h
deploy/reviews-v1       1         1         1            1           3h
deploy/reviews-v2       1         1         1            1           3h
deploy/reviews-v3       1         1         1            1           3h

NAME                           DESIRED   CURRENT   READY     AGE
rs/details-v1-39705650         1         1         1         3h
rs/productpage-v1-1382449686   1         1         1         3h
rs/ratings-v1-3906799406       1         1         1         3h
rs/reviews-v1-2953083044       1         1         1         3h
rs/reviews-v2-348355652        1         1         1         3h
rs/reviews-v3-4088116596       1         1         1         3h

NAME                    DESIRED   CURRENT   UP-TO-DATE   AVAILABLE   AGE
deploy/details-v1       1         1         1            1           3h
deploy/productpage-v1   1         1         1            1           3h
deploy/ratings-v1       1         1         1            1           3h
deploy/reviews-v1       1         1         1            1           3h
deploy/reviews-v2       1         1         1            1           3h
deploy/reviews-v3       1         1         1            1           3h

NAME                                 READY     STATUS    RESTARTS   AGE
po/details-v1-39705650-vc2x0         2/2       Running   0          3h
po/productpage-v1-1382449686-b7frw   2/2       Running   0          3h
po/ratings-v1-3906799406-11pcn       2/2       Running   0          3h
po/reviews-v1-2953083044-sktvt       2/2       Running   0          3h
po/reviews-v2-348355652-xbbbv        2/2       Running   0          3h
po/reviews-v3-4088116596-pkkjk       2/2       Running   0          3h
```

すべての[コンポーネント](http://d.hatena.ne.jp/keyword/%A5%B3%A5%F3%A5%DD%A1%BC%A5%CD%A5%F3%A5%C8)が正常にインストールされている場合は、製品ページを表示できるはずです。
これには、最初に[Ingress](http://d.hatena.ne.jp/keyword/Ingress)が作成されるのに1〜2分かかる場合があります。
また、[Ingress](http://d.hatena.ne.jp/keyword/Ingress)が公開するサービスに接続する場合もあります。
予約商品ページが表示されるまでブラウザを更新してください。

```
ISTIO_INGRESS=$(kubectl get -n istio-system svc istio-ingressgateway -o jsonpath="{.status.loadBalancer.ingress[0].*}")      
open http://$ISTIO_INGRESS/productpage
```

## 加重ルーティング

サンプルアプリケーションは非常に便利です。
上記のコマンド`kubectl get all` では、複数の「レビュー」マイクロサービスのバージョンが展開されていることがわかります。
重み付けされたルーティングを使用して、[トラフィック](http://d.hatena.ne.jp/keyword/%A5%C8%A5%E9%A5%D5%A5%A3%A5%C3%A5%AF)の50％をレビューマイクロサービスのv3にルーティングします。
v3ではレビューごとに星が表示されますが、v1では表示されません。
次に、bookinfoの商品ページに数回問い合わせを行い、評価のために星を含むレビューページが表示された回数を数えます。
これは、レビューページのv3にルーティングされていることを示します。

```
$ kubectl create -f samples/bookinfo/kube/route-rule-all-v1.yaml
routerule "productpage-default" created
routerule "reviews-default" created
routerule "ratings-default" created
routerule "details-default" created
$ kubectl replace -f samples/bookinfo/kube/route-rule-reviews-50-v3.yaml
routerule "reviews-default" replaced
```

エンボイプロキシは、異なるバージョンのマイクロサービスへのルーティングを[ラウンドロビン](http://d.hatena.ne.jp/keyword/%A5%E9%A5%A6%A5%F3%A5%C9%A5%ED%A5%D3%A5%F3)しません。
したがって、製品ページに2回アクセスすると、1つのリク[エス](http://d.hatena.ne.jp/keyword/%A5%A8%A5%B9)トでレビューのv1が使用される可能性は低くなり、2回目のリク[エス](http://d.hatena.ne.jp/keyword/%A5%A8%A5%B9)トではv3が使用されます。
しかし、100件を超えるリク[エス](http://d.hatena.ne.jp/keyword/%A5%A8%A5%B9)トのうち50％はレビューページのv3にルーティングする必要があります。以下の[スクリプト](http://d.hatena.ne.jp/keyword/%A5%B9%A5%AF%A5%EA%A5%D7%A5%C8)を使用してこれをテストできます。
mfileこれを実行する前に、現在のフォルダで呼び出されているファイルがないことを確認してください。
この[スクリプト](http://d.hatena.ne.jp/keyword/%A5%B9%A5%AF%A5%EA%A5%D7%A5%C8)[curl](http://d.hatena.ne.jp/keyword/curl)はbookinfo製品ページに100回のリク[エス](http://d.hatena.ne.jp/keyword/%A5%A8%A5%B9)トを送信します。
約30秒かかる場合があり、レスポンスに星があるものを数えます。製品ページhtmlには2人のレビューアが含まれているため、2人で区切られています。
curlsレビューページで「完全な星」を返しました。100本のカールのうち、50本は「完全な星」を含むと予想しています。

```
ISTIO_INGRESS=$(kubectl get -n istio-system svc istio-ingressgateway -o jsonpath="{.status.loadBalancer.ingress[0].*}")   
for((i=1;i<=100;i+=1));do curl  -s http://$ISTIO_INGRESS/productpage >> mfile; done;
a=$(grep 'full stars' mfile | wc -l) && echo Number of calls to v3 of reviews service "$(($a / 2))"
```

出力は次のように表示されます。

```
Number of calls to v3 of reviews service 72
```

最後に、一時ファイルを削除します。

```
rm mfile
```

この重み付きルーティングは、Istioがバージョン間の[トラフィック](http://d.hatena.ne.jp/keyword/%A5%C8%A5%E9%A5%D5%A5%A3%A5%C3%A5%AF)をルーティングし、[トラフィック](http://d.hatena.ne.jp/keyword/%A5%C8%A5%E9%A5%D5%A5%A3%A5%C3%A5%AF)の負荷に対応するためにレビューマイクロサービスをスケーリングすることによって処理されました。

## 分散トレース

Istioは各サイドポッドにside-car proxyとして配備されています。
つまり、マイクロサービス間のすべての[トラフィック](http://d.hatena.ne.jp/keyword/%A5%C8%A5%E9%A5%D5%A5%A3%A5%C3%A5%AF)フローを表示および監視し、メッシュ[トラフィック](http://d.hatena.ne.jp/keyword/%A5%C8%A5%E9%A5%D5%A5%A3%A5%C3%A5%AF)のグラフィカルな表現を生成できます。
前の手順でデプロイしたbookinfoアプリケーションを使用してこれを実演します。

まず、Prometheusをインストールします。
これはIstioから必要なメトリクスを取得します

```
$ kubectl apply -f install/kubernetes/addons/prometheus.yaml
configmap "prometheus" created
service "prometheus" created
deployment "prometheus" created
```

Prometheusが動作していることを確認してください.

```
$ kubectl -n istio-system get svc prometheus
NAME         TYPE        CLUSTER-IP       EXTERNAL-IP   PORT(S)    AGE
prometheus   ClusterIP   100.69.199.148   <none>        9090/TCP   47s
```

Servicegraphアドオンをインストールします。
Servicegraphは、Istioからのメッシュ[トラフィック](http://d.hatena.ne.jp/keyword/%A5%C8%A5%E9%A5%D5%A5%A3%A5%C3%A5%AF)フローの詳細を取得するPrometheusをクエリします。

```
$ kubectl apply -f install/kubernetes/addons/servicegraph.yaml
deployment "servicegraph" created
service "servicegraph" created
```

Servicegraphが展開されたことを確認します。

```
$ kubectl -n istio-system get svc servicegraph
NAME           TYPE        CLUSTER-IP    EXTERNAL-IP   PORT(S)    AGE
servicegraph   ClusterIP   100.65.77.1   <none>        8088/TCP   5m
```

bookinfoアプリケーションへの[トラフィック](http://d.hatena.ne.jp/keyword/%A5%C8%A5%E9%A5%D5%A5%A3%A5%C3%A5%AF)を生成。

```
ISTIO_INGRESS=$(kubectl get ingress gateway -o jsonpath="{.status.loadBalancer.ingress[0].*}")
open http://$ISTIO_INGRESS/productpage
```

サービスグラフUIを表示する - ポート[フォワ](http://d.hatena.ne.jp/keyword/%A5%D5%A5%A9%A5%EF)ーディングを使用してこれにアクセスします。

```
kubectl -n istio-system port-forward $(kubectl -n istio-system get pod -l app=servicegraph -o jsonpath='{.items[0].metadata.name}') 8088:8088 &
open http://localhost:8088/dotviz
```

このような形の分散トレースが表示されます。
Servicegraphが利用可能になるまで数秒かかる場合がありますので、応答がない場合はブラウザを更新してください。

## side-car 間の相互[TLS](http://d.hatena.ne.jp/keyword/TLS)認証を有効にする

[Istio-auth](https://istio.io/docs/concepts/security/mutual-tls) は、サイドキャストプロキシ間の相互[TLS](http://d.hatena.ne.jp/keyword/TLS)通信を強制することによって、マイクロサービス間の安全な通信を可能にします。
これを実装するのは簡単です。
相互[TLS](http://d.hatena.ne.jp/keyword/TLS)を有効にしてIstioをインストールするだけです。

上記の例を実行した場合は、Istioをアンインストールします。

```
kubectl delete -f install/kubernetes/istio.yaml
```

Authモジュールを有効にして再インストールする.
デフォルトでは、Istioをインストールし、side-car 間で相互[TLS](http://d.hatena.ne.jp/keyword/TLS)認証を実施します。
このオプションは、新しく展開されたワークロードでIstio-side-car がインストールされていることが保証されている新しいkubernetes[クラスタ](http://d.hatena.ne.jp/keyword/%A5%AF%A5%E9%A5%B9%A5%BF)でのみ使用してください。

```
kubectl apply -f install/kubernetes/istio-demo-auth.yaml
```

マイクロサービス間のすべての[トラフィック](http://d.hatena.ne.jp/keyword/%A5%C8%A5%E9%A5%D5%A5%A3%A5%C3%A5%AF)が暗号化されます。

## Cleanup

インストールされている[コンポーネント](http://d.hatena.ne.jp/keyword/%A5%B3%A5%F3%A5%DD%A1%BC%A5%CD%A5%F3%A5%C8)を削除する

```
kubectl delete -f install/kubernetes/addons/servicegraph.yaml
kubectl delete -f install/kubernetes/addons/prometheus.yaml
kubectl delete -f install/kubernetes/istio-auth.yaml
kubectl delete -f install/kubernetes/istio.yaml
./samples/bookinfo/kube/cleanup.sh
```

`default` 上記のクリーンアップ[スクリプト](http://d.hatena.ne.jp/keyword/%A5%B9%A5%AF%A5%EA%A5%D7%A5%C8)の[名前空間](http://d.hatena.ne.jp/keyword/%CC%BE%C1%B0%B6%F5%B4%D6)を受け入れます。

Istioを削除すると、出力にエラーが表示されることがあります。
これらはインストールしていないIstio[コンポーネント](http://d.hatena.ne.jp/keyword/%A5%B3%A5%F3%A5%DD%A1%BC%A5%CD%A5%F3%A5%C8)に関連しているので、これらについては心配する必要はありません。
すべてがアンインストールされたことを確認するには、次のようにします。
IstioまたはBookinfoの[コンポーネント](http://d.hatena.ne.jp/keyword/%A5%B3%A5%F3%A5%DD%A1%BC%A5%CD%A5%F3%A5%C8)は残る必要はありません。

```
kubectl get all
kubectl get all --namespace istio-system
```
