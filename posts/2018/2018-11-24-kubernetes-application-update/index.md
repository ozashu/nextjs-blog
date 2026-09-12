---
title: "Kubernetes Application Update"
date: "2018-11-24"
---

303-app-updateの内容

## [Kubernetes](http://d.hatena.ne.jp/keyword/Kubernetes) Application Update

今回では、[Kubernetes](http://d.hatena.ne.jp/keyword/Kubernetes)[クラスタ](http://d.hatena.ne.jp/keyword/%A5%AF%A5%E9%A5%B9%A5%BF)にデプロイされたアプリケーションを使用して更新する方法について説明しデプロイします。
また、アプリケーションのCanary Deploymentについても見ていきます。

Deploymentは、Podを管理するためのレプリカセットを作成します。
レプリカセット内のレプリカの数は、アプリケーションの要求に合わせて拡大縮小できます。
Deploymentを使用してdeployされたアプリケーションを更新するには、
Deploymentの構成を更新する必要があります。

この変更により、新しいレプリカセットが作成されます。
これは、以前のレプリカセットが縮小されている間にスケールアップされます。
これにより、アプリケーションのダウンタイムが発生しません。

`kubectl rolling-update` コマンドが ありますが、レプリカセットにのみ適用されます。
このコマンドからの更新は、クライアント側で行われました。
更新がサーバー側にあるので、Deploymentを使用してrolling-updateを行うことを強くお勧めします。

我々の[ユースケース](http://d.hatena.ne.jp/keyword/%A5%E6%A1%BC%A5%B9%A5%B1%A1%BC%A5%B9)では、アプリケーションは最初に画像を使用します `arungupta/app-upgrade:v1` 。
次に、イメージを使用するようにDeploymentが更新されます `arungupta/app-upgrade:v2` 。
v1イメージは "[Hello World](http://d.hatena.ne.jp/keyword/Hello%20World)！"を出力します。
v2イメージは「Howdy World！」を印刷します。
これらのイメージの[ソースコード](http://d.hatena.ne.jp/keyword/%A5%BD%A1%BC%A5%B9%A5%B3%A1%BC%A5%C9)は[images](https://github.com/aws-samples/aws-workshop-for-kubernetes/tree/master/03-path-application-development/303-app-update/images)[ディレクト](http://d.hatena.ne.jp/keyword/%A5%C7%A5%A3%A5%EC%A5%AF%A5%C8)リにあります。

## 前提条件

この章の演習を行うには、[Kubernetes](http://d.hatena.ne.jp/keyword/Kubernetes)[クラスタ](http://d.hatena.ne.jp/keyword/%A5%AF%A5%E9%A5%B9%A5%BF)構成を展開する必要があります。
EKSベースの[Kubernetes](http://d.hatena.ne.jp/keyword/Kubernetes)[クラスタ](http://d.hatena.ne.jp/keyword/%A5%AF%A5%E9%A5%B9%A5%BF)を作成するには、[AWS](http://d.hatena.ne.jp/keyword/AWS) [CLI](http://d.hatena.ne.jp/keyword/CLI)を使用します。
EKSを使用せずに[Kubernetes](http://d.hatena.ne.jp/keyword/Kubernetes)[クラスタ](http://d.hatena.ne.jp/keyword/%A5%AF%A5%E9%A5%B9%A5%BF)を作成する場合は、代わりにkopsを使用できます。
この章の設定ファイルはすべてapp-update[ディレクト](http://d.hatena.ne.jp/keyword/%A5%C7%A5%A3%A5%EC%A5%AF%A5%C8)リにあります。
この章のコマンドを実行する前に、その[ディレクト](http://d.hatena.ne.jp/keyword/%A5%C7%A5%A3%A5%EC%A5%AF%A5%C8)リに移動してください。
Cloud9で作業している場合は、次のコマンドを実行します。

`cd ~/environment/aws-workshop-for-kubernetes/03-path-application-development/303-app-update/`

## rolling-update

### 新しいリビジョンへのアップデート

アプリケーションを更新するには、既存のすべてのポッドを、別のバージョンのイメージを使用する新しいポッドに置き換える必要があります。
`.spec.strategy` デプロイメント設定で、古いポッドを新しいポッドに置き換えるための戦略を定義することができます。
このキーには次の2つの値があります。

1. Recreate
2. RollingUpdate （デフォルト）

この2つのデプロイ戦略を見てみましょう。

### strategy を再作成する

既存のPodはすべて、新しいものが作成される前に強制終了されます。
設定ファイルは以下のようになります

```
apiVersion: apps/v1
kind: Deployment
metadata:
  name: app-recreate
spec:
  replicas: 5
  selector:
    matchLabels:
      name: app-recreate
  strategy:
    type: Recreate
  template:
    metadata:
      labels:
        name: app-recreate
    spec:
      containers:
      - name: app-recreate
        image: arungupta/app-upgrade:v1
        ports:
        - containerPort: 8080
```

1. deploymentを作成

```
$ kubectl create -f templates/app-recreate.yaml --record
deployment "app-recreate" created
```

--recordこのdeploymentを開始するコマンドが確実に記録されます。
これは、アプリケーションがいくつかの更新を経て、バージョンとコマンドを関連付ける必要がある場合に便利です。

1. deploymentsの履歴を取得

```
$ kubectl rollout history deployment/app-recreate
deployments "app-recreate"
REVISION  CHANGE-CAUSE
1         kubectl create --filename=templates/app-recreate.yaml --record=true
```

1. サービスを公開する

```
$ kubectl expose deployment/app-recreate --port=80 --target-port=8080 --name=app-recreate --type=LoadBalancer
service "app-recreate" exposed
```

1. サービスの詳細を取得する

```
$ kubectl describe svc/app-recreate
Name:                     app-recreate
Namespace:                default
Labels:                   name=app-recreate
Annotations:              <none>
Selector:                 name=app-recreate
Type:                     LoadBalancer
IP:                       100.65.43.233
LoadBalancer Ingress:     af2dc1f99bda211e791f402037f18a54-1616925381.eu-central-1.elb.amazonaws.com
Port:                     <unset>  80/TCP
TargetPort:               80/TCP
NodePort:                 <unset>  30158/TCP
Endpoints:                100.96.1.14:80,100.96.2.13:80,100.96.3.13:80 + 2 more...
Session Affinity:         None
External Traffic Policy:  Cluster
Events:
  Type    Reason                Age   From                Message
  ----    ------                ----  ----                -------
  Normal  CreatingLoadBalancer  24s   service-controller  Creating load balancer
  Normal  CreatedLoadBalancer   23s   service-controller  Created load balancer
```

1. serviceにアクセス

```
$ curl http://af2dc1f99bda211e791f402037f18a54-1616925381.eu-central-1.elb.amazonaws.com
Hello World!
```

1. 別の端末では、Podの状態を確認

```
$ kubectl get -w pods
app-v1-recreate-486400321-4rwzb   1/1       Running   0          9m
app-v1-recreate-486400321-fqh5l   1/1       Running   0          9m
app-v1-recreate-486400321-jm02h   1/1       Running   0          9m
app-v1-recreate-486400321-rl79n   1/1       Running   0          9m
app-v1-recreate-486400321-z89nm   1/1       Running   0          9m
```

1. deploymentのイメージを更新します。

```
$ kubectl set image deployment/app-recreate app-recreate=arungupta/app-upgrade:v2
deployment "app-recreate" image updated
```

1. Podのステータスが更新されます。すべてのPodが最初に終了し、新しいPodが作成されたことを示します。

```
$ kubectl get -w pods
NAME                              READY     STATUS    RESTARTS   AGE
app-v1-recreate-486400321-4rwzb   1/1       Running   0          9m
app-v1-recreate-486400321-fqh5l   1/1       Running   0          9m
app-v1-recreate-486400321-jm02h   1/1       Running   0          9m
app-v1-recreate-486400321-rl79n   1/1       Running   0          9m
app-v1-recreate-486400321-z89nm   1/1       Running   0          9m
app-v1-recreate-486400321-rl79n   1/1       Terminating   0         10m
app-v1-recreate-486400321-jm02h   1/1       Terminating   0         10m
app-v1-recreate-486400321-fqh5l   1/1       Terminating   0         10m
app-v1-recreate-486400321-z89nm   1/1       Terminating   0         10m
app-v1-recreate-486400321-4rwzb   1/1       Terminating   0         10m
app-v1-recreate-486400321-rl79n   0/1       Terminating   0         10m
app-v1-recreate-486400321-4rwzb   0/1       Terminating   0         10m
app-v1-recreate-486400321-fqh5l   0/1       Terminating   0         10m
app-v1-recreate-486400321-z89nm   0/1       Terminating   0         10m
app-v1-recreate-486400321-jm02h   0/1       Terminating   0         10m
app-v1-recreate-486400321-fqh5l   0/1       Terminating   0         10m
app-v1-recreate-486400321-fqh5l   0/1       Terminating   0         10m
app-v1-recreate-486400321-z89nm   0/1       Terminating   0         10m
app-v1-recreate-486400321-z89nm   0/1       Terminating   0         10m
app-v1-recreate-486400321-rl79n   0/1       Terminating   0         10m
app-v1-recreate-486400321-rl79n   0/1       Terminating   0         10m
app-v1-recreate-486400321-jm02h   0/1       Terminating   0         10m
app-v1-recreate-486400321-jm02h   0/1       Terminating   0         10m
app-v1-recreate-486400321-4rwzb   0/1       Terminating   0         10m
app-v1-recreate-486400321-4rwzb   0/1       Terminating   0         10m
app-v1-recreate-2362379170-fp3j2   0/1       Pending   0         0s
app-v1-recreate-2362379170-xxqqw   0/1       Pending   0         0s
app-v1-recreate-2362379170-hkpt7   0/1       Pending   0         0s
app-v1-recreate-2362379170-jzh5d   0/1       Pending   0         0s
app-v1-recreate-2362379170-k26sf   0/1       Pending   0         0s
app-v1-recreate-2362379170-xxqqw   0/1       Pending   0         0s
app-v1-recreate-2362379170-fp3j2   0/1       Pending   0         0s
app-v1-recreate-2362379170-hkpt7   0/1       Pending   0         0s
app-v1-recreate-2362379170-jzh5d   0/1       Pending   0         0s
app-v1-recreate-2362379170-k26sf   0/1       Pending   0         0s
app-v1-recreate-2362379170-xxqqw   0/1       ContainerCreating   0         0s
app-v1-recreate-2362379170-fp3j2   0/1       ContainerCreating   0         1s
app-v1-recreate-2362379170-hkpt7   0/1       ContainerCreating   0         1s
app-v1-recreate-2362379170-jzh5d   0/1       ContainerCreating   0         1s
app-v1-recreate-2362379170-k26sf   0/1       ContainerCreating   0         1s
app-v1-recreate-2362379170-fp3j2   1/1       Running   0         3s
app-v1-recreate-2362379170-k26sf   1/1       Running   0         3s
app-v1-recreate-2362379170-xxqqw   1/1       Running   0         3s
app-v1-recreate-2362379170-hkpt7   1/1       Running   0         4s
app-v1-recreate-2362379170-jzh5d   1/1       Running   0         4s
```

出力は、すべてのPodが最初に終了した後、新しいPodが作成されたことを示します。

1. deploymentsの履歴を手に入れる

```
$ kubectl rollout history deployment/app-recreate
deployments "app-recreate"
REVISION  CHANGE-CAUSE
1         kubectl create --filename=templates/app-recreate.yaml --record=true
2         kubectl set image deployment/app-recreate app-recreate=arungupta/app-upgrade:v2
```

1. 再度アプリケーションにアクセスする

```
$ curl http://af2dc1f99bda211e791f402037f18a54-1616925381.eu-central-1.elb.amazonaws.com
Howdy World!
```

出力にv2は、使用されているイメージのバージョンが表示されるようになりました。

### Rolling update戦略

Podはローリングアップデートの方法で更新されます。
Rolling updateの実行方法を定義するには、次の2つのオプションのプロパティを使用できます。

1. `.spec.strategy.rollingUpdate.maxSurge` 必要な数のポッドに作成できるポッドの最大数を指定します。値には、絶対数またはパーセンテージを使用できます。デフォルト値は25%です。
2. `.spec.strategy.rollingUpdate.maxUnavailable` 更新処理中に使用できないポッドの最大数を指定します。

設定ファイルは以下のようになります

```
apiVersion: apps/v1
kind: Deployment
metadata:
  name: app-rolling
spec:
  replicas: 5
  selector:
    matchLabels:
      name: app-rolling
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 1
  template:
    metadata:
      labels:
        name: app-rolling
    spec:
      containers:
      - name: app-rolling
        image: arungupta/app-upgrade:v1
        ports:
        - containerPort: 8080
```

この場合、最大数のポッド上に1つ以上のポッドを作成することができ、更新プロセス中には1つのポッドしか利用できなくなります。

1. deploymentを作成

```
$ kubectl create -f templates/app-rolling.yaml --record
deployment "app-rolling" created
```

再度、--recordこの展開を開始するコマンドが確実に記録されます。
これは、アプリケーションがいくつかの更新を経て、バージョンとコマンドを関連付ける必要がある場合に便利です。

1. デプロイの履歴を取得する

```
$ kubectl rollout history deployment/app-rolling
deployments "app-rolling"
REVISION  CHANGE-CAUSE
1         kubectl create --filename=templates/app-rolling.yaml --record=true
```

1. サービスを公開する

```
$ kubectl expose deployment/app-rolling --port=80 --target-port=8080 --name=app-rolling --type=LoadBalancer
service "app-rolling" exposed
```

1. サービスの詳細を取得する

```
$ kubectl describe svc/app-rolling
Name:                     app-rolling
Namespace:                default
Labels:                   name=app-rolling
Annotations:              <none>
Selector:                 name=app-rolling
Type:                     LoadBalancer
IP:                       100.71.164.130
LoadBalancer Ingress:     abe27b4c7bdaa11e791f402037f18a54-647142678.eu-central-1.elb.amazonaws.com
Port:                     <unset>  80/TCP
TargetPort:               80/TCP
NodePort:                 <unset>  31521/TCP
Endpoints:                100.96.1.16:80,100.96.2.15:80,100.96.3.15:80 + 2 more...
Session Affinity:         None
External Traffic Policy:  Cluster
Events:
  Type    Reason                Age   From                Message
  ----    ------                ----  ----                -------
  Normal  CreatingLoadBalancer  1m    service-controller  Creating load balancer
  Normal  CreatedLoadBalancer   1m    service-controller  Created load balancer
```

1. サービスへアクセス

```
$ curl http://abe27b4c7bdaa11e791f402037f18a54-647142678.eu-central-1.elb.amazonaws.com
Hello World!
```

出力はv1、イメージのバージョンが使用されていることを示します。

1. 別の端末では、Podの状態を確認します。

```
$ kubectl get -w pods
NAME                           READY     STATUS    RESTARTS   AGE
app-rolling-1683885671-d7vpf   1/1       Running   0          2m
app-rolling-1683885671-dt31h   1/1       Running   0          2m
app-rolling-1683885671-k8xn9   1/1       Running   0          2m
app-rolling-1683885671-sdjk3   1/1       Running   0          2m
app-rolling-1683885671-x1npp   1/1       Running   0          2m
```

1. deploymentのイメージを更新します。

```
$ kubectl set image deployment/app-rolling app-rolling=arungupta/app-upgrade:v2
deployment "app-rolling" image updated
```

1. Podのステータスが更新されます。

```
$ kubectl get -w pods
NAME                           READY     STATUS    RESTARTS   AGE
app-rolling-1683885671-d7vpf   1/1       Running   0          2m
app-rolling-1683885671-dt31h   1/1       Running   0          2m
app-rolling-1683885671-k8xn9   1/1       Running   0          2m
app-rolling-1683885671-sdjk3   1/1       Running   0          2m
app-rolling-1683885671-x1npp   1/1       Running   0          2m
app-rolling-4154020364-ddn16   0/1       Pending   0         0s
app-rolling-4154020364-ddn16   0/1       Pending   0         1s
app-rolling-4154020364-ddn16   0/1       ContainerCreating   0         1s
app-rolling-1683885671-sdjk3   1/1       Terminating   0         5m
app-rolling-4154020364-j0nnk   0/1       Pending   0         1s
app-rolling-4154020364-j0nnk   0/1       Pending   0         1s
app-rolling-4154020364-j0nnk   0/1       ContainerCreating   0         1s
app-rolling-1683885671-sdjk3   0/1       Terminating   0         5m
app-rolling-4154020364-ddn16   1/1       Running   0         2s
app-rolling-1683885671-dt31h   1/1       Terminating   0         5m
app-rolling-4154020364-j0nnk   1/1       Running   0         3s
app-rolling-4154020364-wlvfz   0/1       Pending   0         1s
app-rolling-4154020364-wlvfz   0/1       Pending   0         1s
app-rolling-1683885671-x1npp   1/1       Terminating   0         5m
app-rolling-4154020364-wlvfz   0/1       ContainerCreating   0         1s
app-rolling-4154020364-qr1lz   0/1       Pending   0         1s
app-rolling-4154020364-qr1lz   0/1       Pending   0         1s
app-rolling-1683885671-dt31h   0/1       Terminating   0         5m
app-rolling-4154020364-qr1lz   0/1       ContainerCreating   0         1s
app-rolling-1683885671-x1npp   0/1       Terminating   0         5m
app-rolling-4154020364-wlvfz   1/1       Running   0         2s
app-rolling-1683885671-d7vpf   1/1       Terminating   0         5m
app-rolling-4154020364-vlb4b   0/1       Pending   0         2s
app-rolling-4154020364-vlb4b   0/1       Pending   0         2s
app-rolling-4154020364-vlb4b   0/1       ContainerCreating   0         2s
app-rolling-1683885671-d7vpf   0/1       Terminating   0         5m
app-rolling-1683885671-x1npp   0/1       Terminating   0         5m
app-rolling-1683885671-x1npp   0/1       Terminating   0         5m
app-rolling-4154020364-qr1lz   1/1       Running   0         3s
app-rolling-1683885671-k8xn9   1/1       Terminating   0         5m
app-rolling-1683885671-k8xn9   0/1       Terminating   0         5m
app-rolling-4154020364-vlb4b   1/1       Running   0         2s
```

出力は、新しいPodが作成された後、古いPodが作成された後、新しいPodが作成されたことを示します。

1. デプロイの履歴を取得する

```
$ kubectl rollout history deployment/app-rolling
deployments "app-rolling"
REVISION  CHANGE-CAUSE
1         kubectl create --filename=templates/app-rolling.yaml --record=true
2         kubectl set image deployment/app-rolling app-rolling=arungupta/app-upgrade:v2
```

1. アプリケーションに再度アクセスする

```
$ curl http://abe27b4c7bdaa11e791f402037f18a54-647142678.eu-central-1.elb.amazonaws.com
Howdy World!
```

出力にv2は、使用されているイメージのバージョンが表示されるようになりました。

### 以前のリビジョンへの[ロールバック](http://d.hatena.ne.jp/keyword/%A5%ED%A1%BC%A5%EB%A5%D0%A5%C3%A5%AF)

上記で説明したように、Deploymentをどのように展開したかの詳細は、
`kubectl rollout history` コマンドを使用して取得できます。
[ロールバック](http://d.hatena.ne.jp/keyword/%A5%ED%A1%BC%A5%EB%A5%D0%A5%C3%A5%AF)するには、Deploymentの完全な履歴を取得できます。

```
$ kubectl rollout history deployment/app-rolling
deployments "app-rolling"
REVISION  CHANGE-CAUSE
1         kubectl create --filename=templates/app-rolling.yaml --record=true
2         kubectl set image deployment/app-rolling app-rolling=arungupta/app-upgrade:v2
```

次のコマンドを使用して以前のバージョンに[ロールバック](http://d.hatena.ne.jp/keyword/%A5%ED%A1%BC%A5%EB%A5%D0%A5%C3%A5%AF)します。

```
$ kubectl rollout undo deployment/app-rolling --to-revision=1
deployment "app-rolling" rolled back
```

サービスに再度アクセスしてください

```
$ curl http://abe27b4c7bdaa11e791f402037f18a54-647142678.eu-central-1.elb.amazonaws.com
Hello World!
```

出力はv1、イメージのバージョンが現在使用されていることを示します。

### リソースの削除

```
kubectl delete deployment/app-recreate svc/app-recreate deployment/app-rolling svc/app-rolling
```

## Canary deployment

Canaryデプロイメントを使用すると、少数のユーザーに変更を徐々に反映させることで、すべてのユーザーに展開する前に、新しいバージョンのアプリケーションを本番環境に展開することができます。
[Kubernetes](http://d.hatena.ne.jp/keyword/Kubernetes)でこれを達成するにはいくつかの方法があります。

1. Service、DeploymentおよびLabelの使用
2. 入力コントローラの使用
3. [DNS](http://d.hatena.ne.jp/keyword/DNS)コントローラの使用
4. IstioまたはLinkerdの使用

今回はService、DeploymentおよびLabelの方法を見ていきます

### Deployment, ServiceとLabels

異なるバージョンのイメージを使用した2つのデプロイメントが使用されます。
どちらの配置も同じポッドラベルを持ちますが、少なくとも1つのラベルが異なります。
一般的なポッドラベルは、サービスの[セレクタ](http://d.hatena.ne.jp/keyword/%A5%BB%A5%EC%A5%AF%A5%BF)として表示されます。
レプリカの数を調整するために、異なるポッドラベルが使用されます。
新しいバージョンのDeploymentの1つのレプリカが古いバージョンとともにリリースされます。
しばらくの間エラーが検出されない場合、新しいバージョンのレプリカの数がスケールアップされ、古いバージョンのレプリカの数が縮小されます。
最終的に、古いバージョンは削除されます。

#### Deploymentとサービス定義

v1展開のバージョンを見てみましょう

```
apiVersion: apps/v1
kind: Deployment
metadata:
  name: app-v1
spec:
  replicas: 2
  selector:
    matchLabels:
      name: app
      version: v1
  template:
    metadata:
      labels:
        name: app
        version: v1
    spec:
      containers:
      - name: app
        image: arungupta/app-upgrade:v1
        ports:
        - containerPort: 8080
```

それは `arungupta/app-upgrade:v1` イメージを使用します。
それは2つのラベル `name: app` と `version: v1`
v2展開のバージョンを見てみましょう

```
apiVersion: apps/v1
kind: Deployment
metadata:
  name: app-v2
spec:
  replicas: 2
  selector:
    matchLabels:
      name: app
      version: v2
  template:
    metadata:
      labels:
        name: app
        version: v2
    spec:
      containers:
      - name: app
        image: arungupta/app-upgrade:v2
        ports:
        - containerPort: 8080
```

それは別のイメージ `arungupta/app-upgrade:v2` を使用します。
これには、Deploymentのバージョン `v1` と一致する1つのラベル `name: app` があります。
これは、他のラベル `v2` と似ていますが、異なる値 `version: v2` を使用しています。
このラベルを使用するv1と、Deploymentの `v1` バージョンをオーバーライドすることなく、このDeploymentを独自に拡張できます。

最後に、これらのデプロイメントを使用するサービス定義を見てみましょう。

```
apiVersion: v1
kind: Service
metadata:
  name: app-service
spec:
  selector:
    name: app
  ports:
  - name: app
    port: 80
  type: LoadBalancer
```

サービスは、アプリケーションの両方のバージョンに共通のラベルを使用します。これにより、両方のデプロイメントのポッドをサービスの一部にすることができます。

確認しましょう。

#### Canary Deploymentを作成

1. Deploymentのv1バージョンをデプロイする

```
$ kubectl apply -f templates/app-v1.yaml
deployment "app-v1" created
```

1. Deploymentのv2バージョンをデプロイする

```
$ kubectl apply -f templates/app-v2.yaml
deployment "app-v2" created
```

3.　サービスをデプロイする

```
$ kubectl apply -f templates/app-service.yaml
service "app-service" created
```

1. このサービスのPod listを確認してください

```
$ kubectl get pods -l name=app
NAME                      READY     STATUS    RESTARTS   AGE
app-v1-3101668686-4mhcj   1/1       Running   0          2m
app-v1-3101668686-ncbfv   1/1       Running   0          2m
app-v2-2627414310-89j1v   1/1       Running   0          2m
app-v2-2627414310-bgg1t   1/1       Running   0          2m
```

`templates/app-service.yaml`のサービス定義で指定されているポッドのみを選択するように、クエリーの`name=app`ラベルを明示的に指定していることに注意してください。
v1バージョンからは2つのポッド、 v2バージョンからは2つのポッドがあります。
このサービスにアクセスすると、v1バージョンから50％、2vバージョンから50％の応答が得られます。

#### Canary Deploymentをスケール

v1バージョンとv2バージョンから含まれるポッドの数は、2つのデプロイメントを使用して個別に拡張できます。

1. v2 deployment のレプリカ数を増やす

```
$ kubectl scale deploy/app-v2 --replicas=4
deployment "app-v2" scaled
```

1. サービスの一部であるポッドを確認してください

```
$ kubectl get pods -l name=app
NAME                      READY     STATUS    RESTARTS   AGE
app-v1-3101668686-4mhcj   1/1       Running   0          6m
app-v1-3101668686-ncbfv   1/1       Running   0          6m
app-v2-2627414310-89j1v   1/1       Running   0          6m
app-v2-2627414310-8jpzd   1/1       Running   0          7s
app-v2-2627414310-b17v8   1/1       Running   0          7s
app-v2-2627414310-bgg1t   1/1       Running   0          6m
```

現在、4つのポッドはアプリケーションのバージョン`v2`から来ており、2つのポッドはアプリケーションのバージョン`v1`から来ていることがわかります。
したがって、ユーザーからの[トラフィック](http://d.hatena.ne.jp/keyword/%A5%C8%A5%E9%A5%D5%A5%A3%A5%C3%A5%AF)の3分の2が新しいアプリケーションから提供されるようになります。

1. v1バージョンのレプリカ数を0に減らす

```
$ kubectl scale deploy/app-v1 --replicas=0
deployment "app-v1" scaled
```

1. サービスの一部であるPodを確認してください

```
$ kubectl get pods -l name=app
NAME                      READY     STATUS    RESTARTS   AGE
app-v2-2627414310-89j1v   1/1       Running   0          8m
app-v2-2627414310-8jpzd   1/1       Running   0          1m
app-v2-2627414310-b17v8   1/1       Running   0          1m
app-v2-2627414310-bgg1t   1/1       Running   0          8m
```

現在、すべてのポッドがDeploymentの`v2`バージョンを提供しています。

#### Canary Deploymentを削除する

上記で作成したすべてのリソースを削除するには、このコマンドを実行します。

```
$ kubectl delete svc/app-service deployment/app-v1 deployment/app-v2
```

### [Ingress](http://d.hatena.ne.jp/keyword/Ingress) Controller (まだ未実装)

デプロイメントとサービスを使用して[トラフィック](http://d.hatena.ne.jp/keyword/%A5%C8%A5%E9%A5%D5%A5%A3%A5%C3%A5%AF)の適切なパーセンテージを達成するには、必要な数のポッドをスピンアップする必要があります。
たとえば、バージョンにv1ポッドのレプリカが4つある場合などです。
次に、バージョンに5％の[トラフィック](http://d.hatena.ne.jp/keyword/%A5%C8%A5%E9%A5%D5%A5%A3%A5%C3%A5%AF)を向けるためにv2、1ポッドのv2バージョンのレプリカには16個のv1バージョンのレプリカがさらに必要になります。
これはリソースの最適な使用ではありません。
この問題を解決するには、[Kubernetes](http://d.hatena.ne.jp/keyword/Kubernetes) [Ingress](http://d.hatena.ne.jp/keyword/Ingress)による重み付け[トラフィック](http://d.hatena.ne.jp/keyword/%A5%C8%A5%E9%A5%D5%A5%A3%A5%C3%A5%AF)の切り替えが使用できます。

Zalandoによると [Kubernetes Ingress Controller for AWS](https://github.com/zalando-incubator/kube-ingress-aws-controller) は[Kubernetes](http://d.hatena.ne.jp/keyword/Kubernetes)の[Ingress](http://d.hatena.ne.jp/keyword/Ingress)コントローラ

```
$ kubectl apply -f templates/ingress-controller.yaml
deployment "app-ingress-controller" created
```
