---
title: "Service Discovery for Microservices with Kubernetes"
date: "2018-08-29"
---

# 302-app-discovery

## Service Discovery for Microservices with [Kubernetes](http://d.hatena.ne.jp/keyword/Kubernetes)

ハードコードされた[IPアドレス](http://d.hatena.ne.jp/keyword/IP%A5%A2%A5%C9%A5%EC%A5%B9)を使用するのではなく、
アプリケーション内のさまざまなマイクロサービスがサービス検出を使用してインフラスト[ラク](http://d.hatena.ne.jp/keyword/%A5%E9%A5%AF)チャ内で互いにどのように位置付けられるかの例を示す。

## 前提条件

3つのマスターノードと5つのワーカーノードを持つ[クラスタ](http://d.hatena.ne.jp/keyword/%A5%AF%A5%E9%A5%B9%A5%BF)を使用

## アプリケーション[アーキテクチャ](http://d.hatena.ne.jp/keyword/%A5%A2%A1%BC%A5%AD%A5%C6%A5%AF%A5%C1%A5%E3)

サンプルアプリケーションでは、次の3つのサービスを使用

1. `webapp` ：Webアプリケーションのマイクロサービスは `greeter` 、`name` のマイクロサービスを使用して人のために挨拶を生成します。
2. `greeter` ：マイクロサービスは `greet` 、URLの名前/値のキーペアに基づいて挨拶を返します。
3. `name` ： `id` URLの名前/値のキーペアに基づいて人の名前を返すマイクロサービス。

これらのサービスは、Dockerイメージとして構築され、[Kubernetes](http://d.hatena.ne.jp/keyword/Kubernetes)に配備されています。すべてのサービスはNode.jsアプリケーションとしてビルドされています。
サービスの[ソースコード](http://d.hatena.ne.jp/keyword/%A5%BD%A1%BC%A5%B9%A5%B3%A1%BC%A5%C9)は <https://github.com/arun-gupta/container-service-discovery/tree/master/services> にあります。

これらの `webapp` サービスは `name` と `greeter` サービスと通信するに、以下の[環境変数](http://d.hatena.ne.jp/keyword/%B4%C4%B6%AD%CA%D1%BF%F4)でサービスを構成する必要があります。
`NAME_SERVICE_HOST` と `GREETER_SERVICE_HOST` の[環境変数](http://d.hatena.ne.jp/keyword/%B4%C4%B6%AD%CA%D1%BF%F4)は、そのラベルではなく、ポッドまたはホストの[IPアドレス](http://d.hatena.ne.jp/keyword/IP%A5%A2%A5%C9%A5%EC%A5%B9)などの静的参照することによって、これらのサービスを参照してください。
その利点は 存在している `name` および/または `greeter` ポッドがもはや操作可能でなくなった場合、それが依存するサービスを継続して実行するために十分なリソースが[クラスタ](http://d.hatena.ne.jp/keyword/%A5%AF%A5%E9%A5%B9%A5%BF)にある場合、 `webapp` サービスは機能し続けます。

1. NAME\_SERVICE\_HOST
2. NAME\_SERVICE\_PORT
3. NAME\_SERVICE\_PATH
4. GREETER\_SERVICE\_HOST
5. GREETER\_SERVICE\_PORT
6. GREETER\_SERVICE\_PATH

3つの異なるサービスを持つ設定ファイルは、[app.yml](https://github.com/aws-samples/aws-workshop-for-kubernetes/blob/master/03-path-application-development/302-app-discovery/templates/app.yml) で定義されています。
webappサービスのレプリカセットには、次の[環境変数](http://d.hatena.ne.jp/keyword/%B4%C4%B6%AD%CA%D1%BF%F4)があります。

```
spec:
  containers:
  - name: webapp-pod
    image: arungupta/webapp-service:latest
    env:
    - name: NAME_SERVICE_HOST
      value: name-service
    - name: NAME_SERVICE_PORT
      value: "8080"
    - name: NAME_SERVICE_PATH
      value: /
    - name: GREETER_SERVICE_HOST
      value: greeter-service
    - name: GREETER_SERVICE_PORT
      value: "8080"
    - name: GREETER_SERVICE_PATH
      value: /
```

[環境変数](http://d.hatena.ne.jp/keyword/%B4%C4%B6%AD%CA%D1%BF%F4)は、アプリケーション構成で定義されているように、`name`および`greeter`サービスを指しています。
`webapp` サービス用のイングレスロードバランサは、次のフラグメントを使用して作成されます。

```
spec:
  selector:
    app: webapp-pod
  ports:
    - name: web
      port: 80
  type: LoadBalancer
```

全体として、サービスは次のように互いに通信します。

[[Ingress](http://d.hatena.ne.jp/keyword/Ingress) LB (ELB)] → [WEBAPP] → /name-service → Name
↓
→ /greeter-service → Greeter

## アプリケーションのデプロイ

1. アプリケーションをデプロイする

   `$ kubectl create -f templates/app.yml
   service "name-service" created
   replicaset.extensions "name-rs" created
   service "greeter-service" created
   replicaset.extensions "greeter-rs" created
   service "webapp-service" created
   replicaset.extensions "webapp-rs" created`
2. サービスのリストを取得

```
$ kubectl get svc
NAME              CLUSTER-IP       EXTERNAL-IP        PORT(S)        AGE
greeter-service   100.64.44.23     <none>             8080/TCP       13s
kubernetes        100.64.0.1       <none>             443/TCP        23m
name-service      100.66.113.58    <none>             8080/TCP       13s
webapp-service    100.71.126.195   a5427e1288472...   80:31234/TCP   12s
```

1. サービスの詳細情報を取得

```
$ kubectl describe svc/webapp-service
Name:           webapp-service
Namespace:      default
Labels:         <none>
Annotations:        <none>
Selector:       app=webapp-pod
Type:           LoadBalancer
IP:         100.71.126.195
LoadBalancer Ingress:   a5427e128847211e782280a896fc2bfc-283874069.us-east-1.elb.amazonaws.com
Port:           web 80/TCP
NodePort:       web 31234/TCP
Endpoints:      100.96.2.12:80
Session Affinity:   None
Events:
  FirstSeen LastSeen    Count   From            SubObjectPath   Type        Reason          Message
  --------- --------    -----   ----            -------------   --------    ------          -------
  30s       30s     1   service-controller          Normal      CreatingLoadBalancer    Creating load balancer
  29s       29s     1   service-controller          Normal      CreatedLoadBalancer Created load balancer
```

[ロードバランサー](http://d.hatena.ne.jp/keyword/%A5%ED%A1%BC%A5%C9%A5%D0%A5%E9%A5%F3%A5%B5%A1%BC)がリク[エス](http://d.hatena.ne.jp/keyword/%A5%A8%A5%B9)トを受け入れるまで3分ほど待つ

## アプリケーションへアクセス

ブラウザや[curl](http://d.hatena.ne.jp/keyword/curl)でアプリケーションにアクセスする

```
http://<host>
http://<host>?greet=ho
http://<host>?id=1
http://<host>?greet=ho&id=1
```

`<host>` はロードバランサのアドレスの入力値

```
$ kubectl get svc/webapp-service -o jsonpath={.status.loadBalancer.ingress[0].hostname}
a5427e128847211e782280a896fc2bfc-283874069.us-east-1.elb.amazonaws.com
```

## アプリケーション削除

```
$ kubectl delete -f templates/app.yml
```
