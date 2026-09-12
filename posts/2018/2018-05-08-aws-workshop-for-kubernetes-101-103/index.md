---
title: "aws-workshop-for-kubernetes(101〜103)"
date: "2018-05-08"
---

# 101-start-here

## Kubernetes - Cloud9開発環境の設定

[aws](http://d.hatena.ne.jp/keyword/aws)-workshop-for-kubernetesの[101-start-here](https://github.com/aws-samples/aws-workshop-for-kubernetes/tree/master/01-path-basics/101-start-here)

Cloud9を使うために[バージニア](http://d.hatena.ne.jp/keyword/%A5%D0%A1%BC%A5%B8%A5%CB%A5%A2)リージョンを選び、CloudFormationで既存の[VPC](http://d.hatena.ne.jp/keyword/VPC)を選び
サブネットを選択して、次へを押せば、
k8s-workshopというスタックができ、出力タブにCloud9のURLが表示され
Cloud9に接続できるようになった。

Cloud9IDEで以下の[スクリプト](http://d.hatena.ne.jp/keyword/%A5%B9%A5%AF%A5%EA%A5%D7%A5%C8)を実行。

```
aws s3 cp s3://aws-kubernetes-artifacts/lab-ide-build.sh . && \
chmod +x lab-ide-build.sh && \
. ./lab-ide-build.sh
```

これで`kubectl`コマンドなどがインストールされました。

```
$ kubectl get nodes
The connection to the server localhost:8080 was refused - did you specify the right host or port?
```

Cloud9 [IDE](http://d.hatena.ne.jp/keyword/IDE)が割り当てられたIAM[インスタンス](http://d.hatena.ne.jp/keyword/%A5%A4%A5%F3%A5%B9%A5%BF%A5%F3%A5%B9)プロファイルを使用するためには、
「[AWS](http://d.hatena.ne.jp/keyword/AWS) Cloud9」メニューを開き、「Preferences」に移動し、「[AWS](http://d.hatena.ne.jp/keyword/AWS) Settings」に移動し、「[AWS](http://d.hatena.ne.jp/keyword/AWS) managed temporary credentials」を無効にする。

これで、ワークショップを続ける準備が整いました！

# 102-your-first-cluster

## kopsを使ってKubernetes[クラスタ](http://d.hatena.ne.jp/keyword/%A5%AF%A5%E9%A5%B9%A5%BF)を作成する

複数のマスターノードとワーカーノードを複数の可用性ゾーンに分散して、可用性の高い[クラスタ](http://d.hatena.ne.jp/keyword/%A5%AF%A5%E9%A5%B9%A5%BF)を作成する。
[クラスタ](http://d.hatena.ne.jp/keyword/%A5%AF%A5%E9%A5%B9%A5%BF)内のマスタノードとワーカーノードは、名前解決に[DNS](http://d.hatena.ne.jp/keyword/DNS)またはWeave Meshの ゴシップ[プロトコル](http://d.hatena.ne.jp/keyword/%A5%D7%A5%ED%A5%C8%A5%B3%A5%EB)を使用できる。
[ゴシッププロトコル](https://ja.wikipedia.org/wiki/%E3%82%B4%E3%82%B7%E3%83%83%E3%83%97%E3%83%97%E3%83%AD%E3%83%88%E3%82%B3%E3%83%AB)ベースの
[クラスタ](http://d.hatena.ne.jp/keyword/%A5%AF%A5%E9%A5%B9%A5%BF)はセットアップが簡単で簡単で、[ドメイン](http://d.hatena.ne.jp/keyword/%A5%C9%A5%E1%A5%A4%A5%F3)、[サブドメイン](http://d.hatena.ne.jp/keyword/%A5%B5%A5%D6%A5%C9%A5%E1%A5%A4%A5%F3)、またはRoute53ホストゾーンを登録する必要がない。

ゴシップ[プロトコル](http://d.hatena.ne.jp/keyword/%A5%D7%A5%ED%A5%C8%A5%B3%A5%EB)を使用して[クラスタ](http://d.hatena.ne.jp/keyword/%A5%AF%A5%E9%A5%B9%A5%BF)を作成するには、接尾辞が `.k8s.local` になります。

シングルマスター[クラスタ](http://d.hatena.ne.jp/keyword/%A5%AF%A5%E9%A5%B9%A5%BF)とマルチマスター[クラスタ](http://d.hatena.ne.jp/keyword/%A5%AF%A5%E9%A5%B9%A5%BF)のどちらを作成するかを選択できるが、
[ローリングアップデート](http://e-words.jp/w/%E3%83%AD%E3%83%BC%E3%83%AA%E3%83%B3%E3%82%B0%E3%82%A2%E3%83%83%E3%83%97%E3%83%87%E3%83%BC%E3%83%88.html)を実演するなどもあるので、マルチマスター[クラスタ](http://d.hatena.ne.jp/keyword/%A5%AF%A5%E9%A5%B9%A5%BF)を作成するほうがよい。

## マルチマスター[クラスタ](http://d.hatena.ne.jp/keyword/%A5%AF%A5%E9%A5%B9%A5%BF)ー

次のコマンドでマルチマスター、マルチノード、およびmulti-az構成で[クラスタ](http://d.hatena.ne.jp/keyword/%A5%AF%A5%E9%A5%B9%A5%BF)ーを作成します。

```
$ kops create cluster \
  --name example.cluster.k8s.local \
  --master-count 3 \
  --node-count 5 \
  --zones $AWS_AVAILABILITY_ZONES \
  --yes

(中略)
kops has set your kubectl context to example.cluster.k8s.local

Cluster is starting.  It should be ready in a few minutes.

Suggestions:
 * validate cluster: kops validate cluster
 * list nodes: kubectl get nodes --show-labels
 * ssh to the master: ssh -i ~/.ssh/id_rsa admin@api.example.cluster.k8s.local
 * the admin user is specific to Debian. If not using Debian please use the appropriate user based on
```

`--master-count` オプションを使用し、マスターノードの数を指定することにより、マルチマスター[クラスタ](http://d.hatena.ne.jp/keyword/%A5%AF%A5%E9%A5%B9%A5%BF)を作成できます。奇数値を推奨します。
デフォルトでは、マスターノードは `--zones` オプションを使用して指定されたAZに分散されます。
`--master-zones` オプションを使用して、マスターノードのゾーンを明示的に指定することもできます。
`--zones` オプションは、ワーカーノードの配布にも使用されます。
`--node-count` オプションを使用して、ワーカーの数が指定されます。

[クラスタ](http://d.hatena.ne.jp/keyword/%A5%AF%A5%E9%A5%B9%A5%BF)は `kops validate cluster` でします。

```
$ kops validate cluster
(中略)

Validation Failed
```

[クラスタ](http://d.hatena.ne.jp/keyword/%A5%AF%A5%E9%A5%B9%A5%BF)の作成には時間がかかりますね。ワーカーnodeがなく、`Validation Failed` になってました。
すべてのマスターが異なるAZにまたがっていることは確認できました。

20分ぐらいでワーカーノードもすべて起動しました。

```
Your cluster example.cluster.k8s.local is ready
```

## Kubernetes Cluster Context

kubectl（Kubernetes [CLI](http://d.hatena.ne.jp/keyword/CLI)）を使用して、複数のKubernetes[クラスタ](http://d.hatena.ne.jp/keyword/%A5%AF%A5%E9%A5%B9%A5%BF)を管理できます。
各[クラスタ](http://d.hatena.ne.jp/keyword/%A5%AF%A5%E9%A5%B9%A5%BF)の構成は、「kubeconfigファイル」と呼ばれる構成ファイルに格納されています。
デフォルトでは、kubectl configは[ディレクト](http://d.hatena.ne.jp/keyword/%A5%C7%A5%A3%A5%EC%A5%AF%A5%C8)リ内で指定されたファイルを探します `~/.kube`。
kubectl [CLI](http://d.hatena.ne.jp/keyword/CLI)は、kubeconfigファイルを使用して、[クラスタ](http://d.hatena.ne.jp/keyword/%A5%AF%A5%E9%A5%B9%A5%BF)を選択し、[クラスタ](http://d.hatena.ne.jp/keyword/%A5%AF%A5%E9%A5%B9%A5%BF)の[API](http://d.hatena.ne.jp/keyword/API)サーバと通信するために必要な情報を検索します。

これでコンテキストを変更するだけで、さまざまな環境にアプリケーションを展開できる。
アプリケーション開発の典型的なフローは次のようになります。

1. 開発環境を使用してアプリケーションを構築する（おそらくラップトップにローカルに）
2. コンテキストを[AWS](http://d.hatena.ne.jp/keyword/AWS)上に作成されたテスト[クラスタ](http://d.hatena.ne.jp/keyword/%A5%AF%A5%E9%A5%B9%A5%BF)に変更する
3. 同じコマンドを使用してテスト環境にデプロイする
4. 一度満足すれば、コンテキストを[AWS](http://d.hatena.ne.jp/keyword/AWS)の実動[クラスタ](http://d.hatena.ne.jp/keyword/%A5%AF%A5%E9%A5%B9%A5%BF)に再度変更してください
5. もう一度、同じコマンドを使用して運用環境に展開します

利用可能なコンテキストの概要を取得

```
$ kubectl config get-contexts
kubectl config get-contexts
CURRENT   NAME                        CLUSTER                     AUTHINFO                    NAMESPACE
*         example.cluster.k8s.local   example.cluster.k8s.local   example.cluster.k8s.local
```

出力には、[クラスタ](http://d.hatena.ne.jp/keyword/%A5%AF%A5%E9%A5%B9%A5%BF)ごとに1つずつ、kubectlで利用可能な別のコンテキストが表示されます。
NAME列にはコンテキスト名が表示され、\* は現在のコンテキストを示す。

現在のコンテキストを表示

```
$ kubectl config current-context
example.cluster.k8s.local
```

複数の[クラスタ](http://d.hatena.ne.jp/keyword/%A5%AF%A5%E9%A5%B9%A5%BF)が存在する場合は、コンテキストを変更できます。

```
$ kubectl config use-context <config-name>
```

# 103-kubernetes-concepts

## Kubernetesの概念

## 前提

[クラスタ](http://d.hatena.ne.jp/keyword/%A5%AF%A5%E9%A5%B9%A5%BF)が稼動しているので、Kubernetes [CLI](http://d.hatena.ne.jp/keyword/CLI)をkubectl（「キューブコン[トロール](http://d.hatena.ne.jp/keyword/%A5%C8%A5%ED%A1%BC%A5%EB)」）コマンドで探索することができる。
kubectl は[クラスタ](http://d.hatena.ne.jp/keyword/%A5%AF%A5%E9%A5%B9%A5%BF)内のマスターノード上で動作するKubernetes [API](http://d.hatena.ne.jp/keyword/API) Serverと対話します。

プラットフォームとしてのKubernetesには、[API](http://d.hatena.ne.jp/keyword/API)オブジェクトにマップされる多数の抽象的な要素があります。
これらのKubernetes [API](http://d.hatena.ne.jp/keyword/API)オブジェクトは、実行中のアプリケーションやワークロード、コンテナイメージ、ネットワークリソースなどの情報を含む、
[クラスタ](http://d.hatena.ne.jp/keyword/%A5%AF%A5%E9%A5%B9%A5%BF)の望ましい状態を記述するために使用できます。
このセクションでは、最もよく使用されるKubernetes [API](http://d.hatena.ne.jp/keyword/API)の概念と、それを介して相互作用する方法について説明する。

## 前提条件

さきほど作成した、3つのマスターノードと5つのワーカーノードを持つ[クラスタ](http://d.hatena.ne.jp/keyword/%A5%AF%A5%E9%A5%B9%A5%BF)を使用します。
`01-path-basics/103-kubernetes-concepts/templates` に必要な設定ファイルが置いてあります。

`$ cd 01-path-basics/103-kubernetes-concepts/templates`

## ノードを表示

`$ kubectl get nodes`

以下の様に[クラスタ](http://d.hatena.ne.jp/keyword/%A5%AF%A5%E9%A5%B9%A5%BF)が出力されます。

```
NAME                             STATUS    ROLES     AGE       VERSION
ip-172-20-109-34.ec2.internal    Ready     master    1h        v1.9.3
ip-172-20-122-230.ec2.internal   Ready     node      1h        v1.9.3
ip-172-20-136-202.ec2.internal   Ready     node      1h        v1.9.3
ip-172-20-165-37.ec2.internal    Ready     node      1h        v1.9.3
ip-172-20-41-45.ec2.internal     Ready     node      1h        v1.9.3
ip-172-20-61-47.ec2.internal     Ready     master    1h        v1.9.3
ip-172-20-79-150.ec2.internal    Ready     node      1h        v1.9.3
ip-172-20-86-242.ec2.internal    Ready     master    1h        v1.9.3
```

```
$ kubectl run nginx --image=nginx
deployment "nginx" created
```

### Podの作成

Nginxコンテナを[クラスタ](http://d.hatena.ne.jp/keyword/%A5%AF%A5%E9%A5%B9%A5%BF)に作成する

```
$ kubectl run nginx --image=nginx
deployment "nginx" created
```

deploymentsのリストをみる

```
$ kubectl get deployments
NAME      DESIRED   CURRENT   UP-TO-DATE   AVAILABLE   AGE
nginx     1         1         1            1           14s
```

Runnningの[pods](http://d.hatena.ne.jp/keyword/pods)を表示

```
$ kubectl get pods
NAME                   READY     STATUS    RESTARTS   AGE
nginx-8586cf59-bjsgp   1/1       Running   0          53s
```

以上でわかったpodの名前から、次のようにポッドの追加情報を取得します。

```
$ kubectl describe pod/nginx-8586cf59-bjsgp
Name:           nginx-8586cf59-bjsgp
Namespace:      default
Node:           ip-172-20-165-37.ec2.internal/172.20.165.37
Start Time:     Mon, 30 Apr 2018 14:52:42 +0000
Labels:         pod-template-hash=41427915
                run=nginx
Annotations:    kubernetes.io/limit-ranger=LimitRanger plugin set: cpu request for container nginx
Status:         Running
IP:             100.96.4.2
Controlled By:  ReplicaSet/nginx-8586cf59
Containers:
  nginx:
    Container ID:   docker://85d3dec6833b185416a9e45cc07f87437ff7ab21064a531a14a71b1f60b89a7c
    Image:          nginx
    Image ID:       docker-pullable://nginx@sha256:0edf702c890e9518b95b2da01286509cd437eb994b8d22460e40d72f6b79be49
    Port:           <none>
    Host Port:      <none>
    State:          Running
      Started:      Mon, 30 Apr 2018 14:52:47 +0000
    Ready:          True
    Restart Count:  0
    Requests:
      cpu:        100m
    Environment:  <none>
    Mounts:
      /var/run/secrets/kubernetes.io/serviceaccount from default-token-nqfr5 (ro)
Conditions:
  Type           Status
  Initialized    True 
  Ready          True 
  PodScheduled   True 
Volumes:
  default-token-nqfr5:
    Type:        Secret (a volume populated by a Secret)
    SecretName:  default-token-nqfr5
    Optional:    false
QoS Class:       Burstable
Node-Selectors:  <none>
Tolerations:     node.kubernetes.io/not-ready:NoExecute for 300s
                 node.kubernetes.io/unreachable:NoExecute for 300s
Events:
  Type    Reason                 Age   From                                    Message
  ----    ------                 ----  ----                                    -------
  Normal  Scheduled              2m    default-scheduler                       Successfully assigned nginx-8586cf59-bjsgp to ip-172-20-165-37.ec2.internal
  Normal  SuccessfulMountVolume  2m    kubelet, ip-172-20-165-37.ec2.internal  MountVolume.SetUp succeeded for volume "default-token-nqfr5"
  Normal  Pulling                2m    kubelet, ip-172-20-165-37.ec2.internal  pulling image "nginx"
  Normal  Pulled                 2m    kubelet, ip-172-20-165-37.ec2.internal  Successfully pulled image "nginx"
  Normal  Created                2m    kubelet, ip-172-20-165-37.ec2.internal  Created container
  Normal  Started                2m    kubelet, ip-172-20-165-37.ec2.internal  Started container
  ```

  デフォルトでは、ポッドはdefaultというnamespaceに作成されます。さらに、kube-systemというnamespaceはKubernetesのシステムのポッド用に予約されています。
  kube-systemという名前空間内のすべてのポッドのリストは、次のように表示できます。

  ```
  $ kubectl get pods --namespace kube-system
NAME                                                    READY     STATUS    RESTARTS   AGE
dns-controller-769b5f68b6-mcg59                         1/1       Running   0          1h
etcd-server-events-ip-172-20-109-34.ec2.internal        1/1       Running   1          1h
etcd-server-events-ip-172-20-61-47.ec2.internal         1/1       Running   0          1h
etcd-server-events-ip-172-20-86-242.ec2.internal        1/1       Running   0          1h
etcd-server-ip-172-20-109-34.ec2.internal               1/1       Running   0          1h
etcd-server-ip-172-20-61-47.ec2.internal                1/1       Running   0          1h
etcd-server-ip-172-20-86-242.ec2.internal               1/1       Running   0          1h
kube-apiserver-ip-172-20-109-34.ec2.internal            1/1       Running   0          1h
kube-apiserver-ip-172-20-61-47.ec2.internal             1/1       Running   0          1h
kube-apiserver-ip-172-20-86-242.ec2.internal            1/1       Running   1          1h
kube-controller-manager-ip-172-20-109-34.ec2.internal   1/1       Running   0          1h
kube-controller-manager-ip-172-20-61-47.ec2.internal    1/1       Running   0          1h
kube-controller-manager-ip-172-20-86-242.ec2.internal   1/1       Running   0          1h
kube-dns-7785f4d7dc-4vg2m                               3/3       Running   0          1h
kube-dns-7785f4d7dc-zt74c                               3/3       Running   0          1h
kube-dns-autoscaler-787d59df8f-mvt9d                    1/1       Running   0          1h
kube-proxy-ip-172-20-109-34.ec2.internal                1/1       Running   0          1h
kube-proxy-ip-172-20-122-230.ec2.internal               1/1       Running   0          1h
kube-proxy-ip-172-20-136-202.ec2.internal               1/1       Running   0          1h
kube-proxy-ip-172-20-165-37.ec2.internal                1/1       Running   0          1h
kube-proxy-ip-172-20-41-45.ec2.internal                 1/1       Running   0          1h
kube-proxy-ip-172-20-61-47.ec2.internal                 1/1       Running   0          1h
kube-proxy-ip-172-20-79-150.ec2.internal                1/1       Running   0          1h
kube-proxy-ip-172-20-86-242.ec2.internal                1/1       Running   0          1h
kube-scheduler-ip-172-20-109-34.ec2.internal            1/1       Running   0          1h
kube-scheduler-ip-172-20-61-47.ec2.internal             1/1       Running   0          1h
kube-scheduler-ip-172-20-86-242.ec2.internal            1/1       Running   0          1h
```

### ポッドからログを取得

ポッドからのログを取得することができます（新しいnginxにはログがありません - サービスにアクセスした後にもう一度確認）

`kubectl logs <pod-name> --namespace <namespace-name>`

```
kubectl logs nginx-8586cf59-bjsgp --namespace default
```

# @# 実行中のポッドでシェルを実行

ポッド内のシェルへのTTYを開く

```
$ kubectl get pods
$ kubectl exec -it <pod-name> /bin/bash
```

```
$ kubectl get pods
NAME                   READY     STATUS    RESTARTS   AGE
nginx-8586cf59-bjsgp   1/1       Running   0          11m
$ kubectl exec -it nginx-8586cf59-bjsgp /bin/bash
root@nginx-8586cf59-bjsgp:/# ls
bin  boot  dev  etc  home  lib  lib64  media  mnt  opt  proc  root  run  sbin  srv  sys  tmp  usr  var
```

これで[bash](http://d.hatena.ne.jp/keyword/bash)シェルが開き、コンテナの[ファイルシステム](http://d.hatena.ne.jp/keyword/%A5%D5%A5%A1%A5%A4%A5%EB%A5%B7%A5%B9%A5%C6%A5%E0)を見ることができる

### 掃除

これまでに作成されたKubernetesリソースをすべて削除

```
$ kubectl delete deployment/nginx
deployment.extensions "nginx" deleted
```

## ポッド

ポッドは、作成、スケジュール設定、および管理が可能な最小の展開可能なユニットです。
これは、アプリケーションに属するコンテナの論理的な集合です。
ポッドは[名前空間](http://d.hatena.ne.jp/keyword/%CC%BE%C1%B0%B6%F5%B4%D6)に作成されます。
ポッド内のすべてのコンテナは、[名前空間](http://d.hatena.ne.jp/keyword/%CC%BE%C1%B0%B6%F5%B4%D6)、ボリューム、およびネットワーキングスタックを共有します。
これにより、`localhost`を使ってポッド内のコンテナ同士が互いを「見つける」ことができる。

## ポッドの作成

Kubernetesの各リソースは、構成ファイルを使用して定義できます。たとえば、Nginxポッドは次のような設定ファイルで定義できます。

```
$ cat pod.yaml
apiVersion: v1
kind: Pod
metadata:
  name: nginx-pod
  labels:
    name: nginx-pod
spec:
  containers:
  - name: nginx
    image: nginx:latest
    ports:
```

次のようにポッドを作成します。

```
$ kubectl apply -f pod.yaml
pod "nginx-pod" created
```

ポッドのリストを取得

```
$ kubectl get pods
NAME        READY     STATUS    RESTARTS   AGE
nginx-pod   1/1       Running   0          22s
```

ポッドが正常に起動したことを確認します（ポート8080で実行中のものがないことを確認してください）。

```
kubectl -n default port-forward $(kubectl -n default get pod -l name=nginx-pod -o jsonpath='{.items[0].metadata.name}') 8080:80
```

Cloud9 [IDE](http://d.hatena.ne.jp/keyword/IDE)でプレビューと実行中のアプリケーションのプレビューをクリック。プレビュータブが開き、NGINXのメインページが表示されるのを確認。

ポッド内のコンテナがログを生成する場合は、次のコマンドを使用して表示できます。

```
$kubectl logs nginx-pod
127.0.0.1 - - [30/Apr/2018:15:14:10 +0000] "GET / HTTP/1.1" 200 612 "https://us-east-1.console.aws.amazon.com/cloud9/ide/a776f598fd54453fb848b088e8bce324?region=us-east-1" "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36" "49.129.246.233"
ec2-user:~/environment/aws-workshop-for-kubernetes/01-path-basics/103-kubernetes-concepts/templates (master) $
```

もしくは

```
$ kubectl logs nginx-pod  --namespace default                                                                                                                                                               
127.0.0.1 - - [30/Apr/2018:15:14:10 +0000] "GET / HTTP/1.1" 200 612 "https://us-east-1.console.aws.amazon.com/cloud9/ide/a776f598fd54453fb848b088e8bce324?region=us-east-1" "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36" "49.129.246.233"
ec2-user:~/environment/aws-workshop-for-kubernetes/01-path-basics/103-kubernetes-concepts/templates (master) $
```

## メモリおよびCPUリソースリク[エス](http://d.hatena.ne.jp/keyword/%A5%A8%A5%B9)ト

ポッド内のコンテナには、メモリとCPUのリク[エス](http://d.hatena.ne.jp/keyword/%A5%A8%A5%B9)トと制限を割り当てることができる。
リク[エス](http://d.hatena.ne.jp/keyword/%A5%A8%A5%B9)トは、Kubernetesがコンテナに与えるメモリ/CPUの最小量で、
制限は、コンテナが使用できるメモリ/CPUの最大量。
Podのメモリ/CPUリク[エス](http://d.hatena.ne.jp/keyword/%A5%A8%A5%B9)トおよび制限は、Pod内のすべてのコンテナのメモリ/CPUリク[エス](http://d.hatena.ne.jp/keyword/%A5%A8%A5%B9)トおよび制限の合計。
要求が指定されていない場合、デフォルトに制限されます。制限のデフォルト値はノードの容量。

PodのメモリとCPUリク[エス](http://d.hatena.ne.jp/keyword/%A5%A8%A5%B9)トが満たされている場合、ノード上でPodをスケジュールすることができる
スケジューリングにはメモリとCPUの制限は考慮されていない。

ポッド内のコンテナがメモリ要求を超えていない場合、ノードはノード上で操作を継続できる。
ポッド内のコンテナがメモリ要求を超えると、ノードがメモリ不足になるたびに追い出し対象になる。
ポッド内のコンテナがメモリの制限を超えると、それらは終了する。
Podを再起動できる場合、他のタイプのランタイムエラーと同様に、kubeletはそれを再起動する。
コンテナは、長時間にわたってCPU制限を超えてもしなくてもよい。
しかし、過度の使用のために殺されることはない

メモリとCPUのリク[エス](http://d.hatena.ne.jp/keyword/%A5%A8%A5%B9)ト/制限は、以下を使用して指定可能。

| タイプ | フィールド |
| --- | --- |
| メモリリク[エス](http://d.hatena.ne.jp/keyword/%A5%A8%A5%B9)ト | spec.containers.resources.requests.memory |
| メモリ制限 | spec.containers.resources.limits.memory |
| CPU要求 | spec.containers.resources.requests.cpu |
| CPU制限 | spec.containers.resources.limits.cpu |

メモリリソースはバイト単位で要求される。
接尾辞の一つで整数または小数でそれらを指定することができ `E`,`P`,`T`,`G`,`M`,`K`。
また、電源の-2当量で表すことができ`Ei`,`Pi`,`Ti`,`Gi`,`Mi`,`Ki`。

CPUはCPU単位で要求できます。1 cpuユニットは同等の1 [AWS](http://d.hatena.ne.jp/keyword/AWS) vCPU。それはまた、0.5やる500メートルなどのmillicpuを分数や小数単位で要求することができる。

### デフォルトメモリとCPU

デフォルトでは、ポッド内のコンテナにはメモリ要求/制限と100m CPU要求が割り当てられず、制限はない。これは、以前に開始したポッドを使用して確認できる。

```
$ kubectl get pod/nginx-pod -o jsonpath={.spec.containers[].resources}
map[requests:map[cpu:100m]]
```

### メモリとCPUを割り当てる

以下の設定ファイルを使用して、Podにメモリ要求と制限を割り当てる。

```
$ cat pod-resources.yaml
apiVersion: v1
kind: Pod
metadata:
  name: nginx-pod2
  labels:
    name: nginx-pod
spec:
  containers:
  - name: nginx
    image: nginx:latest
    resources:
      limits:
        memory: "200Mi"
        cpu: 2
      requests:
        memory: "100Mi"
        cpu: 1
    ports:
    - containerPort: 80
```

この設定ファイルの唯一の変更は`spec.containers[].resources`セクションの追加です。
制限はlimitsセクションで指定され、要求はrequestsセクションで指定される。

Podを作成

```
kubectl apply -f pod-resources.yaml
pod "nginx-pod2" created
```

リク[エス](http://d.hatena.ne.jp/keyword/%A5%A8%A5%B9)トと制限の詳細を取得。

```
$ kubectl get pod/nginx-pod2 -o jsonpath={.spec.containers[].resources}
map[limits:map[cpu:2 memory:200Mi] requests:map[cpu:1 memory:100Mi]]
```

NGINXコンテナは、メモリとCPUがかなり少なくて済みます。
したがって、これらの要求数と制限数は正常に機能し、ポッドは正しく開始されます。今
度は、同様の番号を使って[WildFly](http://d.hatena.ne.jp/keyword/WildFly)ポッドを開始しようとしましょう。
同じ設定ファイルが表示されます。

```
$ cat pod-resources1.yaml
apiVersion: v1
kind: Pod
metadata:
  name: wildfly-pod
  labels:
    name: wildfly-pod
spec:
  containers:
  - name: wildfly
    image: jboss/wildfly:11.0.0.Final
    resources:
      limits:
        memory: "200Mi"
        cpu: 2
      requests:
        memory: "100Mi"
        cpu: 1
    ports:
    - containerPort: 8080
```

このポッド内の[WildFly](http://d.hatena.ne.jp/keyword/WildFly)コンテナに割り当てられるメモリの最大量は200MBに制限されています。
このポッドを作成してみよう。

```
$ kubectl apply -f pod-resources1.yaml
pod "wildfly-pod" created
```

ポッドの状態を確認。

```
$ kubectl get pods -w
NAME          READY     STATUS              RESTARTS   AGE
wildfly-pod   0/1       ContainerCreating   0          5s
wildfly-pod   1/1       Running   0         26s
wildfly-pod   0/1       OOMKilled   0         29s
wildfly-pod   1/1       Running   1         31s
wildfly-pod   0/1       OOMKilled   1         34s
wildfly-pod   0/1       CrashLoopBackOff   1         45s
wildfly-pod   1/1       Running   2         46s
wildfly-pod   0/1       OOMKilled   2         49s
wildfly-pod   0/1       CrashLoopBackOff   2         1m
wildfly-pod   1/1       Running   3         1m
wildfly-pod   0/1       OOMKilled   3         1m
```

`OOMKilled`でコンテナがメモリ不足で終了したことを示します。
`pod-resources2.yaml`で`spec.containers[].resources.limits.memory`の値を`300Mi`に変更します。
既存のPodを削除し、新しいPodを作成します。

```
$ kubectl delete -f pod-resources1.yaml
pod "wildfly-pod" deleted
$ kubectl apply -f pod-resources2.yaml
pod "wildfly-pod" created
$ kubectl get -w pod/wildfly-pod
NAME          READY     STATUS              RESTARTS   AGE
wildfly-pod   0/1       ContainerCreating   0          3s
wildfly-pod   1/1       Running   0         25s
```

これで、Podが正常に開始されます。
Podに割り当てられたリソースの詳細を取得。

```
$ kubectl get pod/wildfly-pod -o jsonpath={.spec.containers[].resources}
map[limits:map[cpu:2 memory:300Mi] requests:map[cpu:1 memory:100Mi]
```

## Quality of service

Kubernetesは、コンテナによって使用されていない場合、要求と制限の差を便宜的に排除します。
これにより、Kubernetesがノードをオーバーサブスクライブできるようになり、使用率が向上すると同時に、保証が必要なコンテナのリソース保証が維持されます。

Kubernetesは、[QoS](http://d.hatena.ne.jp/keyword/QoS)クラスの1つをPodに割り当てます。

1. Guaranteed
2. Burstable
3. BestEffort

[QoS](http://d.hatena.ne.jp/keyword/QoS)クラスは、KubernetesによってPodのスケジュール設定と撤回に使用されます。

ポッド内のすべてのコンテナにメモリとCPUの制限が与えられ、オプションで非ゼロの要求が与えられ、それらが完全に一致すると、PodはGuaranteedQoS でスケジュールされます。これが最優先事項です。

ポッドがBurstableQoSを満たさずGuaranteed、少なくとも1つのコンテナにメモリまたはCPU要求がある場合、ポッドには[QoS](http://d.hatena.ne.jp/keyword/QoS)クラスが与えられます。これは中間的な優先事項です。

ポッド内の任意のコンテナにメモリとCPUの要求または制限が割り当てられていない場合、ポッドはBestEffortQoS でスケジュールされます。これが最も低く、デフォルトの優先順位です。

起床が必要なポッドは、GuaranteedQoS を要求できます。あまり厳しくない要件のポッドは、より弱い[QoS](http://d.hatena.ne.jp/keyword/QoS)を使用することも、[QoS](http://d.hatena.ne.jp/keyword/QoS)を使用しないこともあります。

### Guaranteed

GuaranteedQoS を備えたPodの例。

```
$ cat pod-guaranteed.yaml
apiVersion: v1
kind: Pod
metadata:
  name: nginx-pod-guaranteed
  labels:
    name: nginx-pod
spec:
  containers:
  - name: nginx
    image: nginx:latest
    resources:
      limits:
        memory: "200Mi"
        cpu: 1
    ports:
    - containerPort: 80
```

ここでは要求値は指定されておらず、デフォルト値はlimitになる。

このポッドを作成

```
$ kubectl apply -f pod-guaranteed.yaml
pod "nginx-pod-guaranteed" created
```

リソースを確認

```
$ kubectl get pod/nginx-pod-guaranteed -o jsonpath={.spec.containers[].resources}
map[limits:map[cpu:1 memory:200Mi] requests:map[cpu:1 memory:200Mi]]
```

[QoS](http://d.hatena.ne.jp/keyword/QoS)を確認

```
$ kubectl get pod/nginx-pod-guaranteed -o jsonpath={.status.qosClass}
Guaranteed
```

制限と要求の明示的な値を持つ別のポッドが表示さ

```
$ cat pod-guaranteed2.yaml
apiVersion: v1
kind: Pod
metadata:
  name: nginx-pod-guaranteed2
  labels:
    name: nginx-pod
spec:
  containers:
  - name: nginx
    image: nginx:latest
    resources:
      limits:
        memory: "200Mi"
        cpu: 1
      requests:
        memory: "200Mi"
        cpu: 1
    ports:
    - containerPort: 80
```

このポッドを作成

```
$ kubectl apply -f pod-guaranteed2.yaml
pod "nginx-pod-guaranteed2" created
```

リソースを確認

```
$ kubectl get pod/nginx-pod-guaranteed2 -o jsonpath={.spec.containers[].resources}
map[limits:map[cpu:1 memory:200Mi] requests:map[cpu:1 memory:200Mi]]
```

[QoS](http://d.hatena.ne.jp/keyword/QoS)を確認

```
$ kubectl get pod/nginx-pod-guaranteed2 -o jsonpath={.status.qosClass}
Guaranteed
```

### `Burstable`

次は、`Burstable` [QoS](http://d.hatena.ne.jp/keyword/QoS) を備えたPodの例

```
$ cat pod-burstable.yaml
apiVersion: v1
kind: Pod
metadata:
  name: nginx-pod-burstable
  labels:
    name: nginx-pod
spec:
  containers:
  - name: nginx
    image: nginx:latest
    resources:
      limits:
        memory: "200Mi"
        cpu: 1
      requests:
        memory: "100Mi"
        cpu: 1
    ports:
    - containerPort: 80
```

ここでは、リク[エス](http://d.hatena.ne.jp/keyword/%A5%A8%A5%B9)ト値と制限値の両方を指定しました。

このポッドを作成。

```
$ kubectl apply -f pod-burstable.yaml
pod "nginx-pod-burstable" created
```

リソースを確認

```
$ kubectl get pod/nginx-pod-burstable -o jsonpath={.spec.containers[].resources}
map[limits:map[cpu:1 memory:200Mi] requests:map[cpu:1 memory:100Mi]]
```

[QoS](http://d.hatena.ne.jp/keyword/QoS)を確認

```
$ kubectl get pod/nginx-pod-burstable -o jsonpath={.status.qosClass}
Burstable
```

### BestEffort

リソースを確認

```
$ kubectl get pod/nginx-pod -o jsonpath={.spec.containers[].resources}
map[requests:map[cpu:100m]]
```

[QoS](http://d.hatena.ne.jp/keyword/QoS)を確認

```
$ kubectl get pod/nginx-pod -o jsonpath={.status.qosClass}
Burstable
```

これは `BestEffort` になるべき [kubernetes#55278](https://github.com/kubernetes/kubernetes/issues/55278)

## ポッドの削除

実行中のすべてのポッドを取得

```
$ kubectl get pods
NAME                    READY     STATUS    RESTARTS   AGE
nginx-pod               1/1       Running   0          6m
nginx-pod-burstable     1/1       Running   0          9m
nginx-pod-guaranteed    1/1       Running   0          23m
nginx-pod-guaranteed2   1/1       Running   0          12m
nginx-pod2              1/1       Running   0          6m
wildfly-pod             1/1       Running   0          6m
```

ポッドを削除

```
$ kubectl delete $(kubectl get pods -o=name)
pod "nginx-pod" deleted
pod "nginx-pod-burstable" deleted
pod "nginx-pod-guaranteed" deleted
pod "nginx-pod-guaranteed2" deleted
pod "nginx-pod2" deleted
pod "wildfly-pod" deleted
$ kubectl get pods
No resources found.
```

## Deployment

ポッドの4つのレプリカなどの「望ましい状態」は、Deploymentオブジェクトに記述することができます。
Kubernetes[クラスタ](http://d.hatena.ne.jp/keyword/%A5%AF%A5%E9%A5%B9%A5%BF)内のDeploymentコントローラは、望まれた状態と実際の状態が一致していることを確認します。
ワーカーノードに障害が発生したり再起動したりすると、Deploymentによってポッドが再作成されます。
ポッドが死ぬと、新しいポッドが開始されて、望ましい状態とと実際の状態のマッチが確実に行われます。
また、レプリカ数のアップスケーリングとダウンスケーリングが可能です。
これは、ReplicaSetを使用して実現されます。
Deploymentはレプリカセットを管理し、それらのポッドに更新を提供します。

### Deploymentの作成

次の例では、NGINXベースイメージの3つのレプリカでDeploymentを作成する。
以下のテンプレートを確認して、試してみる。

```
 $ cat deployment.yaml
apiVersion: extensions/v1beta1
kind: Deployment # kubernetes object type
metadata:
  name: nginx-deployment # deployment name
spec:
  replicas: 3 # number of replicas
  template:
    metadata:
      labels:
        app: nginx # pod labels
    spec:
      containers:
      - name: nginx # container name
        image: nginx:1.12.1 # nginx image
        imagePullPolicy: IfNotPresent # if exists, will not pull new image
        ports: # container and host port assignments
        - containerPort: 80
        - containerPort: 443
```

このDeploymentでは、NGINXイメージの[インスタンス](http://d.hatena.ne.jp/keyword/%A5%A4%A5%F3%A5%B9%A5%BF%A5%F3%A5%B9)が3つ作成されます。
次のコマンドを実行してDeploymentを作成

```
$ kubectl create -f deployment.yaml --record
deployment "nginx-deployment" created
```

この--recordフラグは、各リビジョンの変更を追跡します。
deploymentのdeployment状況を監視するには：

```
$ kubectl rollout status deployment/nginx-deployment
deployment "nginx-deployment" successfully rolled out
```

デプロイメントはレプリカの数を管理するレプリカセットを作成します。
既存のデプロイメントとレプリカセットを見てみましょう。
デプロイメント情報を確認

```
$ kubectl get deployments
NAME               DESIRED   CURRENT   UP-TO-DATE   AVAILABLE   AGE
nginx-deployment   3         3         3            3           25s
```

deployment用のレプリカセットを取得

```
$ kubectl get replicaset
NAME                          DESIRED   CURRENT   READY     AGE
nginx-deployment-3441592026   3         3         3         1m
```

実行中のポッドのリストを取得

```
$ kubectl get pods
NAME                                READY     STATUS    RESTARTS   AGE
nginx-deployment-3441592026-ddpf0   1/1       Running   0          2m
nginx-deployment-3441592026-kkp8h   1/1       Running   0          2m
nginx-deployment-3441592026-lx304   1/1       Running   0          2m
```

### デプロイメントのスケーリング

Deploymentのレプリカ数は、次のコマンドを使用してスケーリングできる。

```
$ kubectl scale --replicas=5 deployment/nginx-deployment
deployment "nginx-deployment" scaled
```

deploymentを確認

```
$ kubectl get deployments
NAME               DESIRED   CURRENT   UP-TO-DATE   AVAILABLE   AGE
nginx-deployment   5         5         5            5           2m
```

deployment内のポッドを確認

```
$ kubectl get pods
NAME                                READY     STATUS    RESTARTS   AGE
nginx-deployment-3441592026-36957   1/1       Running   0          44s
nginx-deployment-3441592026-8wch5   1/1       Running   0          44s
nginx-deployment-3441592026-ddpf0   1/1       Running   0          3m
nginx-deployment-3441592026-kkp8h   1/1       Running   0          3m
nginx-deployment-3441592026-lx304   1/1       Running   0          3m
```

### デプロイメントのアップデート

Podの仕様を編集することで、Deploymentのより一般的なアップデートを行うことができます。
この例では、最新のnginxイメージに変更しましょう。

最初に、次のように入力して[テキストエディタ](http://d.hatena.ne.jp/keyword/%A5%C6%A5%AD%A5%B9%A5%C8%A5%A8%A5%C7%A5%A3%A5%BF)を開きます。

```
$ kubectl edit deployment/nginx-deployment
```

次に、imageを`nginx:1.12.1`から`nginx:latest`に変更します。

これにより、展開のロール更新が実行されます。
リビジョン、イメージのバージョン、ポートなどの展開の詳細を追跡するには、次のように入力します。

```
$ kubectl describe deployments
Name:                   nginx-deployment
Namespace:              default
CreationTimestamp:      Mon, 23 Oct 2017 09:14:36 -0400
Labels:                 app=nginx
Annotations:            deployment.kubernetes.io/revision=2
                        kubernetes.io/change-cause=kubectl edit deployment/nginx-deployment
Selector:               app=nginx
Replicas:               5 desired | 5 updated | 5 total | 5 available | 0 unavailable
StrategyType:           RollingUpdate
MinReadySeconds:        0
RollingUpdateStrategy:  1 max unavailable, 1 max surge
Pod Template:
  Labels:  app=nginx
  Containers:
   nginx:
    Image:        nginx:latest
    Ports:        80/TCP, 443/TCP
    Environment:  <none>
    Mounts:       <none>
  Volumes:        <none>
Conditions:
  Type           Status  Reason
  ----           ------  ------
  Available      True    MinimumReplicasAvailable
OldReplicaSets:  <none>
NewReplicaSet:   nginx-deployment-886641336 (5/5 replicas created)
Events:
  Type    Reason             Age                From                   Message
  ----    ------             ----               ----                   -------
  Normal  ScalingReplicaSet  4m                 deployment-controller  Scaled up replica set nginx-deployment-3441592026 to 3
  Normal  ScalingReplicaSet  1m                 deployment-controller  Scaled up replica set nginx-deployment-3441592026 to 5
  Normal  ScalingReplicaSet  32s                deployment-controller  Scaled up replica set nginx-deployment-886641336 to 1
  Normal  ScalingReplicaSet  32s                deployment-controller  Scaled down replica set nginx-deployment-3441592026 to 4
  Normal  ScalingReplicaSet  32s                deployment-controller  Scaled up replica set nginx-deployment-886641336 to 2
  Normal  ScalingReplicaSet  29s                deployment-controller  Scaled down replica set nginx-deployment-3441592026 to 3
  Normal  ScalingReplicaSet  29s                deployment-controller  Scaled up replica set nginx-deployment-886641336 to 3
  Normal  ScalingReplicaSet  28s                deployment-controller  Scaled down replica set nginx-deployment-3441592026 to 2
  Normal  ScalingReplicaSet  28s                deployment-controller  Scaled up replica set nginx-deployment-886641336 to 4
  Normal  ScalingReplicaSet  25s (x3 over 26s)  deployment-controller  (combined from similar events): Scaled down replica set nginx-deployment-3441592026 to 0
```

### デプロイメントの[ロールバック](http://d.hatena.ne.jp/keyword/%A5%ED%A1%BC%A5%EB%A5%D0%A5%C3%A5%AF)

以前のバージョンに[ロールバック](http://d.hatena.ne.jp/keyword/%A5%ED%A1%BC%A5%EB%A5%D0%A5%C3%A5%AF)するには、まず更新履歴を確認します。

```
$ kubectl rollout history deployment/nginx-deployment
deployments "nginx-deployment"
REVISION  CHANGE-CAUSE
1         kubectl scale deployment/nginx-deployment --replicas=5
2         kubectl edit deployment/nginx-deployment
```

前のリビジョンにのみ[ロールバック](http://d.hatena.ne.jp/keyword/%A5%ED%A1%BC%A5%EB%A5%D0%A5%C3%A5%AF)する場合は、次のコマンドを入力します。

```
$ kubectl rollout undo deployment/nginx-deployment
deployment "nginx-deployment" rolled back
```

Deploymentを[ロールバック](http://d.hatena.ne.jp/keyword/%A5%ED%A1%BC%A5%EB%A5%D0%A5%C3%A5%AF)して`nginx:1.12.1`イメージを使用します。イメージ名を確認してください

```
$ kubectl describe deployments | grep Image
   Image:        nginx:1.12.1
```

特定のリビジョンに[ロールバック](http://d.hatena.ne.jp/keyword/%A5%ED%A1%BC%A5%EB%A5%D0%A5%C3%A5%AF)する場合は、次のように入力します。

```
$ kubectl rollout undo deployment/nginx-deployment --to-revision=<version>
```

### デプロイメントの削除

```
$ kubectl delete -f deployment.yaml
deployment "nginx-deployment" deleted
```

## Service

ポッドは一時的です。各ポッドには一意の[IPアドレス](http://d.hatena.ne.jp/keyword/IP%A5%A2%A5%C9%A5%EC%A5%B9)が割り当てられます。
複製コントローラに属するポッドが消滅した場合は、再作成され、異なる[IPアドレス](http://d.hatena.ne.jp/keyword/IP%A5%A2%A5%C9%A5%EC%A5%B9)が与えられます。
さらに、DeploymentまたはReplica Setを使用して追加のポッドを作成することもできます。
これにより、[WildFly](http://d.hatena.ne.jp/keyword/WildFly)などの[アプリケーションサーバ](http://d.hatena.ne.jp/keyword/%A5%A2%A5%D7%A5%EA%A5%B1%A1%BC%A5%B7%A5%E7%A5%F3%A5%B5%A1%BC%A5%D0)ーが、その[IPアドレス](http://d.hatena.ne.jp/keyword/IP%A5%A2%A5%C9%A5%EC%A5%B9)を使用して[MySQL](http://d.hatena.ne.jp/keyword/MySQL)などのデータベースにアクセスすることが困難になります。

サービスとは、論理的なポッドセットとそのポッドにアクセスするためのポリシーを定義する抽象化です。
サービスに割り当てられた[IPアドレス](http://d.hatena.ne.jp/keyword/IP%A5%A2%A5%C9%A5%EC%A5%B9)は時間の経過とともに変化しないため、他のポッドに依存することができます。
通常、サービスに属するポッドは、ラベル[セレクタ](http://d.hatena.ne.jp/keyword/%A5%BB%A5%EC%A5%AF%A5%BF)によって定義されます。
これは、ポッドがレプリカセットにどのように属しているかと同様のメ[カニ](http://d.hatena.ne.jp/keyword/%A5%AB%A5%CB)ズムです。

ラベルを使用してポッドを選択するというこの抽象化は、[疎結合](http://d.hatena.ne.jp/keyword/%C1%C2%B7%EB%B9%E7)を可能にする。
デプロイメント内のポッドの数は拡大または縮小されますが、[アプリケーションサーバ](http://d.hatena.ne.jp/keyword/%A5%A2%A5%D7%A5%EA%A5%B1%A1%BC%A5%B7%A5%E7%A5%F3%A5%B5%A1%BC%A5%D0)ーはそのサービスを使用して引き続きデータベースにアクセスできます。

Kubernetesサービスは、論理的なポッドセットを定義し、マイクロサービスを介してそれらにアクセスできるようにします。

### ServiceのDeploymentを作成

Podは、ラベルがPodに接続されている[疎結合](http://d.hatena.ne.jp/keyword/%C1%C2%B7%EB%B9%E7)モデルを使用してServiceに属し、Serviceはそれらのラベルを使用してPodを選択します。

最初にDeploymentを作成して、ポッドの3つのレプリカを作成しましょう。

```
 $ cat echo-deployment.yaml
apiVersion: extensions/v1beta1
kind: Deployment
metadata:
  name: echo-deployment
spec:
  replicas: 3
  template:
    metadata:
      labels:
        app: echo-pod
    spec:
      containers:
      - name: echoheaders
        image: gcr.io/google_containers/echoserver:1.4
        imagePullPolicy: IfNotPresent
        ports:
        - containerPort: 8080
```

この例では、Elastic Load BalancerのHTTPヘッダーで応答するechoアプリケーションを作成します。
デプロイメントを作成するには、次のように入力します。

```
$ kubectl create -f echo-deployment.yaml --record
```

`kubectl describe deployment` コマンドを使って `echo-app`がデプロイされたことを確認する

```
  $ kubectl describe deployment
Name:                   echo-deployment
Namespace:              default
CreationTimestamp:      Mon, 23 Oct 2017 10:07:47 -0400
Labels:                 app=echo-pod
Annotations:            deployment.kubernetes.io/revision=1
                        kubernetes.io/change-cause=kubectl create --filename=templates/echo-deployment.yaml --record=true
Selector:               app=echo-pod
Replicas:               3 desired | 3 updated | 3 total | 3 available | 0 unavailable
StrategyType:           RollingUpdate
MinReadySeconds:        0
RollingUpdateStrategy:  1 max unavailable, 1 max surge
Pod Template:
  Labels:  app=echo-pod
  Containers:
   echoheaders:
    Image:        gcr.io/google_containers/echoserver:1.4
    Port:         8080/TCP
    Environment:  <none>
    Mounts:       <none>
  Volumes:        <none>
Conditions:
  Type           Status  Reason
  ----           ------  ------
  Available      True    MinimumReplicasAvailable
OldReplicaSets:  <none>
NewReplicaSet:   echo-deployment-3396249933 (3/3 replicas created)
Events:
  Type    Reason             Age   From                   Message
  ----    ------             ----  ----                   -------
  Normal  ScalingReplicaSet  10s   deployment-controller  Scaled up replica set echo-deployment-3396249933 to 3
```

Podのリストを取得

```
$ kubectl get pods
NAME                               READY     STATUS    RESTARTS   AGE
echo-deployment-3396249933-8slzp   1/1       Running   0          1m
echo-deployment-3396249933-bjwqj   1/1       Running   0          1m
echo-deployment-3396249933-r05nr   1/1       Running   0          1m
```

Podのラベルを確認

```
$ kubectl describe pods/echo-deployment-3396249933-8slzp | grep Label
Labels:         app=echo-pod
```

### Serviceの作成

次の例では、`echo-service`サービスを作成

```
$ cat service.yaml
apiVersion: v1
kind: Service
metadata:
  name: echo-service
spec:
  selector:
    app: echo-pod
  ports:
  - name: http
    protocol: TCP
    port: 80
    targetPort: 8080
  type: LoadBalancer
```

サービスの対象となるポッドのセットは、サービスに`app: echo-pod`と添付されているラベルによって決定されます。
また、コンテナ上の8080のターゲットポートへのインバウンドポート80を定義します。

Kubernetesは、[TCP](http://d.hatena.ne.jp/keyword/TCP)[プロトコル](http://d.hatena.ne.jp/keyword/%A5%D7%A5%ED%A5%C8%A5%B3%A5%EB)と[UDP](http://d.hatena.ne.jp/keyword/UDP)[プロトコル](http://d.hatena.ne.jp/keyword/%A5%D7%A5%ED%A5%C8%A5%B3%A5%EB)の両方をサポートしています。

### Serviceを公開する

`type`属性を使用して外部IPにサービスを公開することができます。この属性は、次のいずれかの値をとります。

1. `ClusterIP`: [クラスタ](http://d.hatena.ne.jp/keyword/%A5%AF%A5%E9%A5%B9%A5%BF)内の[IPアドレス](http://d.hatena.ne.jp/keyword/IP%A5%A2%A5%C9%A5%EC%A5%B9)で公開されるサービス。これがデフォルト動作
2. `NodePort`: 定義されたポートで各ノードの[IPアドレス](http://d.hatena.ne.jp/keyword/IP%A5%A2%A5%C9%A5%EC%A5%B9)に公開されるサービス。
3. `LoadBalancer`: [クラウド](http://d.hatena.ne.jp/keyword/%A5%AF%A5%E9%A5%A6%A5%C9)にデプロイされている場合は、[クラウド](http://d.hatena.ne.jp/keyword/%A5%AF%A5%E9%A5%A6%A5%C9)固有のロードバランサを使用して外部に公開される。
4. `ExternalName`: `externalName`フィールドにサービスが添付されています。値を持つCNAMEにマップされます。

ロードバランサのserviceを公開してサービスを公開し、LoadBalancerのtypeフィールドを追加してみましょう

このテンプレートはElastic Load Balancer（ELB）上に`echo-app`サービスを公​​開します。

```
$ cat service.yaml
apiVersion: v1
kind: Service
metadata:
  name: echo-service
spec:
  selector:
    app: echo-pod
  ports:
  - name: http
    protocol: TCP
    port: 80
    targetPort: 8080
  type: LoadBalancer
```

次のコマンドを実行してサービスを作成します。

```
$ kubectl create -f service.yaml --record
```

サービスの詳細を取得

```
$ kubectl get service
NAME           TYPE           CLUSTER-IP       EXTERNAL-IP        PORT(S)        AGE
echo-service   LoadBalancer   100.66.161.199   ad0b47976b7fe...   80:30125/TCP   40s
kubernetes     ClusterIP      100.64.0.1       <none>             443/TCP        1h
$ kubectl describe service echo-service
Name:                     echo-service
Namespace:                default
Labels:                   <none>
Annotations:              kubernetes.io/change-cause=kubectl create --filename=templates/service.yaml --record=true
Selector:                 app=echo-pod
Type:                     LoadBalancer
IP:                       100.66.161.199
LoadBalancer Ingress:     ad0b47976b7fe11e7a8870e55a29a6a9-1770422890.us-east-1.elb.amazonaws.com
Port:                     http  80/TCP
TargetPort:               8080/TCP
NodePort:                 http  30125/TCP
Endpoints:                100.96.3.8:8080,100.96.4.9:8080,100.96.5.9:8080
Session Affinity:         None
External Traffic Policy:  Cluster
Events:
  Type    Reason                Age   From                Message
  ----    ------                ----  ----                -------
  Normal  CreatingLoadBalancer  58s   service-controller  Creating load balancer
  Normal  CreatedLoadBalancer   56s   service-controller  Created load balancer
```

出力は`LoadBalancer Ingress`をElastic Load Balancer（ELB）のアドレスとして表示されます。
ELBがプロビジョニングされ、利用可能になるまでには約2〜3分かかるので数分待ってからサービスにアクセスするとよい。

```
$ curl http://ad0b47976b7fe11e7a8870e55a29a6a9-1770422890.us-east-1.elb.amazonaws.com
CLIENT VALUES:
client_address=172.20.45.253
command=GET
real path=/
query=nil
request_version=1.1
request_uri=http://ad0b47976b7fe11e7a8870e55a29a6a9-1770422890.us-east-1.elb.amazonaws.com:8080/

SERVER VALUES:
server_version=nginx: 1.10.0 - lua: 10001

HEADERS RECEIVED:
accept=*/*
host=ad0b47976b7fe11e7a8870e55a29a6a9-1770422890.us-east-1.elb.amazonaws.com
user-agent=curl/7.51.0
BODY:
-no body in request-
```

出力に示されている`client_address`の値に注意してください。
これは、リク[エス](http://d.hatena.ne.jp/keyword/%A5%A8%A5%B9)トを処理するポッドの[IPアドレス](http://d.hatena.ne.jp/keyword/IP%A5%A2%A5%C9%A5%EC%A5%B9)です。
このコマンドを複数回呼び出すと、この属性に異なる値が表示されます。

これで、deploymentのポッドの数を増減できます。
または、ポッドが終了して別のホストで再起動することがあります。
しかし、Serviceは、ポッドに付いているラベルがServiceによって使用されているため、それらのポッドを対象とすることができます。

### サービスの削除

サービスを削除するには、次のコマンドを実行します。

```
$ kubectl delete -f service.yaml
```

バックエンドの展開も明示的に削除する必要があります。

```
$ kubectl delete -f echo-deployment.yaml
```

## デーモンセット

デーモンセットは、Podのコピーが選択されたノードセットで実行されるようにします。
デフォルトでは、[クラスタ](http://d.hatena.ne.jp/keyword/%A5%AF%A5%E9%A5%B9%A5%BF)内のすべてのノードが選択されます。
選択基準を指定して、限られた数のノードを選択することができる。

新しいノードが[クラスタ](http://d.hatena.ne.jp/keyword/%A5%AF%A5%E9%A5%B9%A5%BF)に追加されると、ポッドが[クラスタ](http://d.hatena.ne.jp/keyword/%A5%AF%A5%E9%A5%B9%A5%BF)上で開始されます。
ノードが削除されると、[ガベージコレクション](http://d.hatena.ne.jp/keyword/%A5%AC%A5%D9%A1%BC%A5%B8%A5%B3%A5%EC%A5%AF%A5%B7%A5%E7%A5%F3)によってポッドが削除されます。

### デーモンセットを作成する

次は、Prometheusコンテナを実行するDaemonSetの例です。テンプレートから始めましょう。

```
$ cat daemonset.yaml
apiVersion: extensions/v1beta1
kind: DaemonSet
metadata:
  name: prometheus-daemonset
spec:
  template:
    metadata:
      labels:
        tier: monitoring
        name: prometheus-exporter
    spec:
      containers:
      - name: prometheus
        image: prom/node-exporter
        ports:
        - containerPort: 80
```

次のコマンドを実行することでReplicaSetと[pods](http://d.hatena.ne.jp/keyword/pods)が作成されます。

```
$ kubectl create -f daemonset.yaml --record
```

`--record`フラグは各リビジョンの変更を追跡します。

```
$ kubectl get daemonsets/prometheus-daemonset
NAME                   DESIRED   CURRENT   READY     UP-TO-DATE   AVAILABLE   NODE SELECTOR   AGE
prometheus-daemonset   5         5         5         5            5           <none>          7s
```

DaemonSetの詳細を取得

```
$ kubectl describe daemonset/prometheus-daemonset
Name:           prometheus-daemonset
Selector:       name=prometheus-exporter,tier=monitoring
Node-Selector:  <none>
Labels:         name=prometheus-exporter
                tier=monitoring
Annotations:    kubernetes.io/change-cause=kubectl create --filename=templates/daemonset.yaml --record=true
Desired Number of Nodes Scheduled: 5
Current Number of Nodes Scheduled: 5
Number of Nodes Scheduled with Up-to-date Pods: 5
Number of Nodes Scheduled with Available Pods: 5
Number of Nodes Misscheduled: 0
Pods Status:  5 Running / 0 Waiting / 0 Succeeded / 0 Failed
Pod Template:
  Labels:  name=prometheus-exporter
           tier=monitoring
  Containers:
   prometheus:
    Image:        prom/node-exporter
    Port:         80/TCP
    Environment:  <none>
    Mounts:       <none>
  Volumes:        <none>
Events:
  Type    Reason            Age   From        Message
  ----    ------            ----  ----        -------
  Normal  SuccessfulCreate  28s   daemon-set  Created pod: prometheus-daemonset-pzfl8
  Normal  SuccessfulCreate  28s   daemon-set  Created pod: prometheus-daemonset-sjcgh
  Normal  SuccessfulCreate  28s   daemon-set  Created pod: prometheus-daemonset-ctrg4
  Normal  SuccessfulCreate  28s   daemon-set  Created pod: prometheus-daemonset-rxg79
  Normal  SuccessfulCreate  28s   daemon-set  Created pod: prometheus-daemonset-cnbkh
```

DaemonSetでポッドを取得

```
$ kubectl get pods -lname=prometheus-exporter
NAME                         READY     STATUS    RESTARTS   AGE
prometheus-daemonset-cnbkh   1/1       Running   0          57s
prometheus-daemonset-ctrg4   1/1       Running   0          57s
prometheus-daemonset-pzfl8   1/1       Running   0          57s
prometheus-daemonset-rxg79   1/1       Running   0          57s
prometheus-daemonset-sjcgh   1/1       Running   0          57s
```

### 特定のノードにDaemonSetsを制限する

Prometheusポッドが[クラスタ](http://d.hatena.ne.jp/keyword/%A5%AF%A5%E9%A5%B9%A5%BF)ノードに正常に展開されたことを確認します。

```
$ kubectl get pods -o wide
NAME                         READY     STATUS    RESTARTS   AGE       IP           NODE
prometheus-daemonset-drqj8   1/1       Running   0          3m        100.96.3.9   ip-172-20-99-142.ec2.internal
prometheus-daemonset-l747p   1/1       Running   0          3m        100.96.4.7   ip-172-20-74-231.ec2.internal
prometheus-daemonset-vbd85   1/1       Running   0          3m        100.96.5.8   ip-172-20-185-78.ec2.internal
prometheus-daemonset-xr67t   1/1       Running   0          3m        100.96.6.8   ip-172-20-150-149.ec2.internal
prometheus-daemonset-xsdlp   1/1       Running   0          3m        100.96.7.7   ip-172-20-37-172.ec2.internal
```

ノードラベルの1つを次のように変更します。

```
$ kubectl label node ip-172-20-74-231.ec2.internal app=prometheus-node
node "ip-172-20-74-231.ec2.internal" labeled
```

次に、次のコマンドでDaemonSetテンプレートを編集します。

```
$ kubectl edit ds/prometheus-daemonset
```

`spec.template.spec` の中に変更したラベルに一致する`nodeSelector`を含めるように変更。

```
      nodeSelector:
        app: prometheus-node
```

更新が実行された後、Prometheusを特定のノードで実行するように設定しました。

```
$ kubectl get ds/prometheus-daemonset
NAME                   DESIRED   CURRENT   READY     UP-TO-DATE   AVAILABLE   NODE SELECTOR         AGE
prometheus-daemonset   1         1         1         0            1           app=prometheus-node   2m
```

### デーモンセットを削除する

DaemonSetを削除するには、次のコマンドを実行します。

```
$ kubectl delete -f daemonset.yaml
```

## ジョブ

ジョブは1つまたは複数のポッドを作成し、指定された数のポッドが正常に完了するようにします。ジョブは、ポッドの正常終了を追跡します。
指定した数のポッドが正常に完了すると、ジョブ自体は完了です。
ハードウェア障害のためにポッドに障害が発生したり削除されたりすると、ジョブは新しいポッドを開始します。
指定した数のポッドが正常に完了すると、ジョブが完了したことを意味します。

これは、特定の数のポッドが常に実行されていることを保証するレプリカセットまたはデプロイメントとは異なります。
したがって、レプリカセットまたは配備内のポッドが終了すると、そのポッドは再び再開されます。これにより、レプリカセットまたはデプロイメントは長期実行プロセスとなります。
これは、NGINXなどのWebサーバーに適しています。ただし、指定した数のポッドが正常に完了すると、ジョブは完了します。
これは、一度だけ実行する必要のあるタスクに適しています。例えば、ジョブは画像フォーマットを別のものに変換することができる。
[レプリケーション](http://d.hatena.ne.jp/keyword/%A5%EC%A5%D7%A5%EA%A5%B1%A1%BC%A5%B7%A5%E7%A5%F3)コントローラでこのポッドを再起動すると、重複した作業が発生するだけでなく、場合によっては有害な可能性があります。

ジョブはレプリカセットを補完します。
レプリカセットは、終了する予定のないポッド（Webサーバーなど）を管理し、ジョブは終了すると予想されるポッド（バッチジョブなど）を管理します。

仕事を持つポッドにのみ適しているRestartPolicyに等しいですOnFailureかNever。

### 非並列ジョブ

ポッドに障害が発生しない限り、1ジョブにつき1つのポッドしか開始されません。
ポッドが正常に終了するとすぐにジョブが完了します。

これがジョブの仕様です。

```
 $ cat job.yaml
apiVersion: batch/v1
kind: Job
metadata:
  name: wait
spec:
  template:
    metadata:
      name: wait
    spec:
      containers:
      - name: wait
        image: ubuntu
        command: ["sleep",  "20"]
      restartPolicy: Never
```

[Ubuntu](http://d.hatena.ne.jp/keyword/Ubuntu)のコンテナを作成し、20秒間スリープ状態になります。
次のコマンドを使用してジョブを作成します。

```
$ kubectl apply -f job.yaml
job "wait" created
```

ジョブを見てみます。

```
$ kubectl get jobs
NAME      DESIRED   SUCCESSFUL   AGE
wait      1         0            0s
```

出力はジョブがまだ成功していないことを示しています。
ポッドの状態を確認して確認します。

```
$ kubectl get -w pods
NAME         READY     STATUS    RESTARTS   AGE
wait-lk49x   1/1       Running   0          7s
wait-lk49x   0/1       Completed   0         24s
```

まず、ジョブのポッドが実行中であることを示します。
ポッドは数秒後に正常に終了し、Completedステータスが表示されます。

ジョブの状態をもう一度見てみましょう。

```
$ kubectl get jobs
NAME      DESIRED   SUCCESSFUL   AGE
wait      1         1            1m
```

出力はジョブが正常に実行されたことを示します。

完了したポッドはkubectl get [pods](http://d.hatena.ne.jp/keyword/pods)コマンドに表示されません。
代わりに、次のように追加のオプションを渡すことで表示できます。

```
$ kubectl get pods --show-all
NAME         READY     STATUS      RESTARTS   AGE
wait-lk49x   0/1       Completed   0          1m
```

ジョブを削除するには、このコマンドを実行します

```
$ kubectl delete -f job.yaml
```

### パラレルジョブ

非並列ジョブはジョブごとに1つのポッドのみを実行します。
この[API](http://d.hatena.ne.jp/keyword/API)は、ジョブに対して複数のポッドを並行して実行するために使用されます。
完了させるポッドの数は設定ファイルの`.spec.completions`属性によって定義されます。
並行して実行するポッドの数は、構成ファイルの`.spec.parallelism`属性によって定義されます。
これらの属性の両方のデフォルト値は1です。

範囲 1〜.spec.completionsの各値に対して成功したポッドが1つある場合、ジョブは完了です。
そのため、固定完了カウントジョブとも呼ばれます。

ジョブの仕様は以下。

```
 $ cat job-parallel.yaml
apiVersion: batch/v1
kind: Job
metadata:
  name: wait
spec:
  completions: 6
  parallelism: 2
  template:
    metadata:
      name: wait
    spec:
      containers:
      - name: wait
        image: ubuntu
        command: ["sleep",  "20"]
      restartPolicy: Never
```

このジョブ仕様は、非並行ジョブ仕様に似ています。
これは、2つの新しい属性が追加されました `.spec.completions`と`.spec.parallelism`。
つまり、6つのポッドが正常に完了すると、ジョブは完了します。
同時に最大2つのポッドが並行して実行されます。

次のコマンドを使用して並列ジョブを作成します。

```
$ kubectl apply -f job-parallel.yaml
```

次のようにジョブのステータスを確認します。

```
$ kubectl get -w jobs
NAME      DESIRED   SUCCESSFUL   AGE
wait      6         0            2s
wait      6         1         22s
wait      6         2         22s
wait      6         3         43s
wait      6         4         43s
wait      6         5         1m
wait      6         6         1m
```

出力は約20秒ごとに2つのポッドが作成されることを示しています。
別の端末ウィンドウで、作成されたポッドの状態を確認します。

```
$ kubectl get -w pods -l job-name=wait
NAME         READY     STATUS    RESTARTS   AGE
wait-f7kgb   1/1       Running   0          5s
wait-smp4t   1/1       Running   0          5s
wait-smp4t   0/1       Completed   0         22s
wait-jbdp7   0/1       Pending   0         0s
wait-jbdp7   0/1       Pending   0         0s
wait-jbdp7   0/1       ContainerCreating   0         0s
wait-f7kgb   0/1       Completed   0         22s
wait-r5v8n   0/1       Pending   0         0s
wait-r5v8n   0/1       Pending   0         0s
wait-r5v8n   0/1       ContainerCreating   0         0s
wait-r5v8n   1/1       Running   0         1s
wait-jbdp7   1/1       Running   0         1s
wait-r5v8n   0/1       Completed   0         21s
wait-ngrgl   0/1       Pending   0         0s
wait-ngrgl   0/1       Pending   0         0s
wait-ngrgl   0/1       ContainerCreating   0         0s
wait-jbdp7   0/1       Completed   0         21s
wait-6l22s   0/1       Pending   0         0s
wait-6l22s   0/1       Pending   0         0s
wait-6l22s   0/1       ContainerCreating   0         0s
wait-ngrgl   1/1       Running   0         1s
wait-6l22s   1/1       Running   0         1s
wait-ngrgl   0/1       Completed   0         21s
wait-6l22s   0/1       Completed   0         21s
```

すべてのポッドが完成したら、`kubectl get pods`は完成したポッドのリストは表示されません。
ポッドの一覧を表示するコマンドを以下に示します。

```
$ kubectl get pods -a
NAME         READY     STATUS      RESTARTS   AGE
wait-6l22s   0/1       Completed   0          1m
wait-f7kgb   0/1       Completed   0          2m
wait-jbdp7   0/1       Completed   0          2m
wait-ngrgl   0/1       Completed   0          1m
wait-r5v8n   0/1       Completed   0          2m
wait-smp4t   0/1       Completed   0          2m
```

同様に、`kubectl get jobs`完了後のジョブのステータスを示します。

```
$ kubectl get jobs
NAME      DESIRED   SUCCESSFUL   AGE
wait      6         6            3m
```

ジョブを削除すると、すべてのポッドも削除されます。ジョブを次のように削除します。

```
$ kubectl delete -f job-parallel.yaml
job.batch "wait" deleted
$ kubectl get jobs
No resources found.
$ kubectl get pods -a
Flag --show-all has been deprecated, will be removed in an upcoming release
No resources found.
```

## Cron Job

### 前提条件

Kubernetes`クラスタバージョン<1.8`の場合、Cron Jobは[API](http://d.hatena.ne.jp/keyword/API)バージョン`batch/v2alpha1`で作成できます。
[クラスタ](http://d.hatena.ne.jp/keyword/%A5%AF%A5%E9%A5%B9%A5%BF)のバージョンを確認しましょう。

```
$ kubectl version
Client Version: version.Info{Major:"1", Minor:"10", GitVersion:"v1.10.2", GitCommit:"81753b10df112992bf51bbc2c2f85208aad78335", GitTreeState:"clean", BuildDate:"2018-04-27T09:22:21Z", GoVersion:"go1.9.3", Compiler:"gc", Platform:"linux/amd64"}
Server Version: version.Info{Major:"1", Minor:"9", GitVersion:"v1.9.3", GitCommit:"d2835416544f298c919e2ead3be3d0864b52323b", GitTreeState:"clean", BuildDate:"2018-02-07T11:55:20Z", GoVersion:"go1.9.2", Compiler:"gc", Platform:"linux/amd64"}
```

### Cronジョブを作成する

Cronジョブは、Cron形式で書かれたスケジュールに従って実行されるジョブです。
主な使用例は2つあります。

1. 指定した時点でジョブを1回実行する
2. 特定の時点で繰り返し

ジョブの仕様です。

```
 $ cat cronjob.yaml
apiVersion: batch/v1beta1
kind: CronJob
metadata:
  name: hello
spec:
  schedule: "*/1 * * * *"
  jobTemplate:
    spec:
      template:
        metadata:
          labels:
            app: hello-cronpod
        spec:
          containers:
          - name: hello
            image: busybox
            args:
            - /bin/sh
            - -c
            - date; echo Hello World!
          restartPolicy: OnFailure
```

このジョブは、現在のタイムスタンプと "[Hello World](http://d.hatena.ne.jp/keyword/Hello%20World)"というメッセージを毎分出力します。
次のコマンドのように、Cron Jobを作成します。

```
$ kubectl create -f cronjob.yaml 
cronjob.batch "hello" created
```

`--validate=false` はkubectlの[CLI](http://d.hatena.ne.jp/keyword/CLI)バージョンが1.8などだった場合は必須です。このオプションを指定しないと、エラーが表示されます。

```
$ kubectl create -f cronjob.yaml --validate=false
cronjob.batch "hello" created
```

次のようにジョブのステータスを確認します。

```
$ kubectl get -w cronjobs
NAME      SCHEDULE      SUSPEND   ACTIVE    LAST SCHEDULE   AGE
hello     */1 * * * *   False     1         4s              1m
```

別の端末ウィンドウで、作成されたポッドの状態を確認します。

```
$ kubectl get -w pods -l app=hello-cronpod
NAME                     READY     STATUS      RESTARTS   AGE
hello-1525775460-z24xb   0/1       Completed   0          1m
hello-1525775520-2lvvg   0/1       Completed   0          24s
```

いずれかのポッドからログを取得

```
 $ kubectl logs hello-1525775460-z24x

Hello World!
```

### Cronジョブを削除

次のコマンドのように、Cron Jobを削除します。

```
$ kubectl delete -f cronjob.yaml
cronjob.batch "hello" deleted
```

## Namespace

Namespaceを使用すると、物理[クラスタ](http://d.hatena.ne.jp/keyword/%A5%AF%A5%E9%A5%B9%A5%BF)を複数のチームで共有することができます。
Namespaceは、作成されたリソースを論理的に名前のついたグループに分割することを可能にします。
各ネNamespaceは以下の機能を提供します。

1. 名前の衝突を回避するためのリソースのためにユニークなスコープ
2. 信頼できるユーザーへの適切な権限を確保するポリシー
3. リソース消費の制約を指定する機能

これにより、Kubernetes[クラスタ](http://d.hatena.ne.jp/keyword/%A5%AF%A5%E9%A5%B9%A5%BF)は複数のグループによってリソースを共有し、各グループごとに異なるレベルの[QoS](http://d.hatena.ne.jp/keyword/QoS)を提供できます。
ある[名前空間](http://d.hatena.ne.jp/keyword/%CC%BE%C1%B0%B6%F5%B4%D6)で作成されたリソースは、他の[名前空間](http://d.hatena.ne.jp/keyword/%CC%BE%C1%B0%B6%F5%B4%D6)から隠されています。
[潜在的](http://d.hatena.ne.jp/keyword/%C0%F8%BA%DF%C5%AA)にそれぞれ異なる制約を持つ複数の[名前空間](http://d.hatena.ne.jp/keyword/%CC%BE%C1%B0%B6%F5%B4%D6)を作成できます。

### デフォルトNamespace

[名前空間](http://d.hatena.ne.jp/keyword/%CC%BE%C1%B0%B6%F5%B4%D6)のリストは、次のコマンドを使用して表示できます。

```
$ kubectl get namespace
NAME          STATUS    AGE
default       Active    2m
kube-public   Active    2m
kube-system   Active    2m
```

デフォルトでは、Kubernetes[クラスタ](http://d.hatena.ne.jp/keyword/%A5%AF%A5%E9%A5%B9%A5%BF)内のすべてのリソースは`default`Namespaceに作成されます。
`kube-public`はすべてのユーザーが読み取ることができる[名前空間](http://d.hatena.ne.jp/keyword/%CC%BE%C1%B0%B6%F5%B4%D6)で、認証されていないユーザーも含まれます。
`kubeadm`で起動された[クラスタ](http://d.hatena.ne.jp/keyword/%A5%AF%A5%E9%A5%B9%A5%BF)は、`cluster-info`ConfigMapがあります。
この[クラスタ](http://d.hatena.ne.jp/keyword/%A5%AF%A5%E9%A5%B9%A5%BF)はkopsを使用して作成されるため、このConfigMapは存在しません。

`kube-system` Kubernetesシステムによって作成されたオブジェクトの[名前空間](http://d.hatena.ne.jp/keyword/%CC%BE%C1%B0%B6%F5%B4%D6)です。

Deploymentを作成しましょう

```
$ kubectl apply -f deployment.yaml
deployment "nginx-deployment" created
```

namespaceを確認

```
$ kubectl get deployment -o jsonpath={.items[].metadata.namespace}
default
```

### カスタムNamespace

新しい[名前空間](http://d.hatena.ne.jp/keyword/%CC%BE%C1%B0%B6%F5%B4%D6)は、設定ファイルまたは`kubectl`を使用して作成できます

1. 次の設定ファイルを使用して[名前空間](http://d.hatena.ne.jp/keyword/%CC%BE%C1%B0%B6%F5%B4%D6)を作成できます。

```
$ cat namespace.yaml
kind: Namespace
apiVersion: v1
metadata:
  name: dev
  labels:
    name: dev
```

1. 新しい[名前空間](http://d.hatena.ne.jp/keyword/%CC%BE%C1%B0%B6%F5%B4%D6)を作成

```
$ kubectl apply -f namespace.yaml
namespace "dev" created
```

1. [名前空間](http://d.hatena.ne.jp/keyword/%CC%BE%C1%B0%B6%F5%B4%D6)のリストを取得する

```
$ kubectl get ns
NAME          STATUS    AGE
default       Active    3h
dev           Active    12s
kube-public   Active    3h
kube-system   Active    3h
```

1. ネームスペースの詳細を取得

```
$ kubectl describe ns/dev
Name:         dev
Labels:       name=dev
Annotations:  kubectl.kubernetes.io/last-applied-configuration={"apiVersion":"v1","kind":"Namespace","metadata":{"annotations":{},"labels":{"name":"dev"},"name":"dev","namespace":""}}

Status:  Active

No resource quota.

No resource limits.
```

1. 構成ファイルを使用して、この新しい[名前空間](http://d.hatena.ne.jp/keyword/%CC%BE%C1%B0%B6%F5%B4%D6)に配置を作成

```
 $ cat deployment-namespace.yaml
apiVersion: extensions/v1beta1
kind: Deployment
metadata:
  name: nginx-deployment-ns
  namespace: dev
spec:
  replicas: 3
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
      - name: nginx
        image: nginx:1.12.1
        ports:
        - containerPort: 80
        - containerPort: 443
```

主な変更は`namespace: dev`の追加です

1. デプロイメントの作成

```
$ kubectl apply -f deployment-namespace.yaml
deployment "nginx-deployment-ns" created
```

1. 次の-nように追加のスイッチを用意することによって、ネームスペース内の配置を照会することができます。

```
$ kubectl get deployments -n dev
NAME               DESIRED   CURRENT   UP-TO-DATE   AVAILABLE   AGE
nginx-deployment-ns   3         3         3            3           1m
```

1. この展開のNamespaceを照会

```
$ kubectl get deployments/nginx-deployment-ns -n dev -o jsonpath={.metadata.namespace}
dev
```

別の方法として、[名前空間](http://d.hatena.ne.jp/keyword/%CC%BE%C1%B0%B6%F5%B4%D6)は`kubectl`を使っても作成することができます。

1. Namespaceを作成

```
$ kubectl create ns dev2
namespace "dev2" created
```

1. Deploymentの作成

```
$ kubectl -n dev2 apply -f deployment.yaml
deployment "nginx-deployment-ns" created
```

1. 新しく作成されたNamespaceにDeploymentを取得

```
$ kubectl get deployments -n dev2
NAME               DESIRED   CURRENT   UP-TO-DATE   AVAILABLE   AGE
nginx-deployment-ns   3         3         3            3           1m
```

1. すべてのNamespaceでのdeploymentを取得

```
$ kubectl get deployments --all-namespaces
NAMESPACE     NAME                  DESIRED   CURRENT   UP-TO-DATE   AVAILABLE   AGE
default       nginx-deployment      3         3         3            3           1h
dev           nginx-deployment-ns   3         3         3            3           1h
dev2          nginx-deployment-ns   3         3         3            3           1m
kube-system   dns-controller        1         1         1            1           5h
kube-system   kube-dns              2         2         2            2           5h
kube-system   kube-dns-autoscaler   1         1         1            1           5h
```

## クォータと制限

各ネームスペースにはリソースクォータを割り当てることができます。クォータを指定すると、ネームスペース内のすべてのリソースで消費できる[クラスタ](http://d.hatena.ne.jp/keyword/%A5%AF%A5%E9%A5%B9%A5%BF)リソースの量を制限できます。
リソースクォータは、ResourceQuotaオブジェクトで定義できます。[名前空間](http://d.hatena.ne.jp/keyword/%CC%BE%C1%B0%B6%F5%B4%D6)にResourceQuotaオブジェクトが存在すると、リソースクォータが強制されます。
[名前空間](http://d.hatena.ne.jp/keyword/%CC%BE%C1%B0%B6%F5%B4%D6)内には最大でも1つのResourceQuotaオブジェクトが存在します。現在、複数のResourceQuotaオブジェクトが許可されています。
これは[kubernetes＃55430](https://github.com/kubernetes/kubernetes/issues/55430)として提出されています。

クォータは、CPUやメモリなどの計算リソース、PersistentVolumeやPersistentVolumeClaimなどのストレージリソース、および指定されたタイプのオブジェクトの数に指定できます。
ResourceQuotaを使用して制限できるリソースの完全なリストは、<https://kubernetes.io/docs/concepts/policy/resource-quotas/> にリストされています。

### ResourceQuotaを作成する

ResourceQuotaは、構成ファイルまたは`kubectl`を使用して作成できます。

1. 次の設定ファイルを使用してResourceQuotaを作成できます。

```
$ cat resource-quota.yaml
apiVersion: v1
kind: ResourceQuota
metadata:
  name: quota
spec:
  hard:
    cpu: "4"
    memory: 6G
    pods: "10"
    replicationcontrollers: "3"
    services: "5"
    configmaps: "5"
```

この設定ファイルは、ネームスペースに次の要件を設定します。

1. 作成されるすべての新しいコンテナには、メモリとCPUの制限が必要です
   ii. この[名前空間](http://d.hatena.ne.jp/keyword/%CC%BE%C1%B0%B6%F5%B4%D6)内のポッドの総数は10を超えることはできません
   iii. この[名前空間](http://d.hatena.ne.jp/keyword/%CC%BE%C1%B0%B6%F5%B4%D6)内のReplicationControllerの総数は3を超えることはできません
   iv. この[名前空間](http://d.hatena.ne.jp/keyword/%CC%BE%C1%B0%B6%F5%B4%D6)内のサービスの総数は5を超えることはできません
2. この[名前空間](http://d.hatena.ne.jp/keyword/%CC%BE%C1%B0%B6%F5%B4%D6)内のConfigMapの総数は5を超えることはできません
3. 新しいResourceQuotaを作成します。

```
$ kubectl apply -f resource-quota.yaml
resourcequota "quota" created
```

あるいは、kubectlCLI を使用してResourceQuotaを作成することもできます。
どちらの場合も、この場合、これらの制限はdefaultネームスペースに置かれます。
別の[名前空間](http://d.hatena.ne.jp/keyword/%CC%BE%C1%B0%B6%F5%B4%D6)は、構成ファイルで指定するか、または[CLI](http://d.hatena.ne.jp/keyword/CLI)`kubectl`で`--namespace`オプションを使用して指定することができます。

```
kubectl create -f ./resource-quota.yaml --namespace=myspace
```

1. ResourceQuotaのリストを取得

```
$ kubectl get quota
NAME      AGE
quota     5m
```

1. ResourceQuotaの詳細については、次を参照してください。

```
$ kubectl describe quota/quota
Name:                   quota
Namespace:              default
Resource                Used  Hard
--------                ----  ----
configmaps              0     5
cpu                     300m  4
memory                  0     6G
pods                    3     12
replicationcontrollers  0     3
services                1     5
```

出力には、default[名前空間](http://d.hatena.ne.jp/keyword/%CC%BE%C1%B0%B6%F5%B4%D6)に3つのPodと1つのサービスが既に存在していることが示されています。

### ResourceQuotaを使用してリソースを拡大

ResourceQuotaが作成されたので、これが作成された新しいリソースや拡張された既存のリソースにどのように影響するのかを見てみましょう。

私たちは既にデプロイメントを持っていますnginx-deployment。割り当てられたクォータを超えるようにレプリカの数をスケーリングし、何が起こるかを見てみましょう。

1. Deploymentのレプリカ数を調整します。

```
$ kubectl scale --replicas=12 deployment/nginx-deployment
deployment "nginx-deployment" scaled
```

コマンド出力には、展開がスケーリングされていることが示されます。

1. すべてのレプリカが利用可能かどうかを確認してみる

```
$ kubectl get deployment/nginx-deployment -o jsonpath={.status.availableReplicas}
3
```

3つのレプリカしか利用できないことを示しています。

1. 詳細は次を参照してください。

```
$ kubectl get deployment/nginx-deployment -o jsonpath={.status.conditions[].message}
Deployment does not have minimum availability.
```

現在の理由が出力に表示されます。

### ResourceQuotaでリソースを作成する

次の設定ファイルを使ってPodを作成しましょう

```
$ cat pod.yaml
apiVersion: v1
kind: Pod
metadata:
  name: nginx-pod
  labels:
    name: nginx-pod
spec:
  containers:
  - name: nginx
    image: nginx:latest
    ports:
    - containerPort: 80
```

このポッドを作成する前に、以前実行していたポッドまたはデプロイメントを削除する必要があります。

```
$ kubectl apply -f pod.yaml
Error from server (Forbidden): error when creating "pod.yaml": pods "nginx-pod" is forbidden: failed quota: quota: must specify memory
```

エラーメッセージは、ResourceQuotaが有効であり、Podがメモリリソースを明示的に指定しなければならないことを示します。

設定ファイルを次のように更新します。

```
$ cat pod-memory.yaml
apiVersion: v1
kind: Pod
metadata:
  name: nginx-pod
  labels:
    name: nginx-pod
spec:
  containers:
  - name: nginx
    image: nginx:latest
    resources:
      requests:
        memory: "100m"
    ports:
    - containerPort: 80
```

ここに定義された明示的メモリリソースがあります。今度は、ポッドを作成してみてください：

```
$ kubectl apply -f pod-memory.yaml
pod "nginx-pod" created
```

ポッドは正常に作成されます。

Podの詳細を取得

```
$ kubectl get pod/nginx-pod -o jsonpath={.spec.containers[].resources}
map[requests:map[cpu:100m memory:100m]]
```

ResourceQuotaの詳細については、次を参照してください。

```
$ kubectl describe quota/quota
Name:                   quota
Namespace:              default
Resource                Used  Hard
--------                ----  ----
configmaps              0     5
cpu                     400m  4
memory                  100m  6G
pods                    4     12
replicationcontrollers  0     3
services                1     5
```

CPUとメモリリソースがどのように増分された値になっているかに注意してください。

[kubernetes＃55433](https://github.com/kubernetes/kubernetes/issues/55433) ResourceQuotaでポッドを作成するために明示的なCPUリソースが必要ない方法の詳細を提供します。

```
$ $ kubectl delete quota/quota
resourcequota "quota" deleted
```

これで、ワークショップを続ける準備が整いました！

次回は[201-cluster-monitoring](https://github.com/aws-samples/aws-workshop-for-kubernetes/tree/master/02-path-working-with-clusters/201-cluster-monitoring)からです。
