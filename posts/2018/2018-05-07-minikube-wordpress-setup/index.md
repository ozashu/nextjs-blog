---
title: "minikubeでWordPress環境を構築"
date: "2018-05-07"
---

こちら[Kubernetes ハンズオン](https://github.com/takaishi/hello2018/tree/master/k8s_hands_on)をやりました。
適宜コマンドや説明を修正、補足した作業メモです。

# ゴール

[VirtualBox](http://d.hatena.ne.jp/keyword/VirtualBox)環境の1VM上にk8s環境をつくり[wordpress](http://d.hatena.ne.jp/keyword/wordpress)を構築していきます。

# 事前知識

## Pod

Podはk8sでアプリケーションを動かす最小単位のリソースです。
同じプロセス空間、ネットワーク、ストレージを共有する1つ以上のコンテナから構成されます。
Podは必ずNode上で実行されます。

## Node

Nodeはk8sのワーカーマシンで、[仮想マシン](http://d.hatena.ne.jp/keyword/%B2%BE%C1%DB%A5%DE%A5%B7%A5%F3)か物理マシンです。
今回は[virtualbox](http://d.hatena.ne.jp/keyword/virtualbox)上にminikubeというNodeが作られることを確認できます。

# k8s環境の準備

[minikube](https://github.com/kubernetes/minikube/)とkubectlを[Mac](http://d.hatena.ne.jp/keyword/Mac)にインストールします

`brew cask install minikube`
`brew install kubectl`

## minikubeでローカルにk8s環境作成

`minikube start` でk8sv1.10.0のシングル[クラスタ](http://d.hatena.ne.jp/keyword/%A5%AF%A5%E9%A5%B9%A5%BF)が作成できました。

```
minikube start
Starting local Kubernetes v1.10.0 cluster...
Starting VM...
Getting VM IP address...
Moving files into cluster...
Setting up certs...
Connecting to cluster...
Setting up kubeconfig...
Starting cluster components...
Kubectl is now configured to use the cluster.
Loading cached images from config file.
```

`minikube status` で `minikube` と `cluster` がRunningになっていることを確認

```
minikube status
minikube: Running
cluster: Running
kubectl: Correctly Configured: pointing to minikube-vm at 192.168.99.102
```

冒頭でもいいましたが、Nodeとしてminikubeが確認できます。

```
kubectl get nodes
NAME       STATUS    ROLES     AGE       VERSION
minikube   Ready     master    24s       v1.10.0
```

# k8s上に[Wordpress](http://d.hatena.ne.jp/keyword/Wordpress)を構築

k8s上に[wordpress](http://d.hatena.ne.jp/keyword/wordpress)と[mysql](http://d.hatena.ne.jp/keyword/mysql)のコンテナを立ち上げていきます。
DockerStoreにあるものを使っていきます。

- [mysql](https://store.docker.com/images/mysql)
- [wordpress](https://store.docker.com/images/wordpress)

## DBのパスワードの秘密情報をk8sに保存

k8sの昨日で[Secrets](https://kubernetes.io/docs/concepts/configuration/secret/)というものがあります。
これは秘密情報を `Secrets` というデータベースで管理して、
パスワードなどを必要とする Pod のみに送ります。
Secrets の中身は `Key-Value` ペアのリストでパスワードを保存し、対象のpodに送ります。
今回は `password.txt` というファイルを作成し、 `Secrets` に登録します。

```
vim password.txt
```

`kubectl ceate secret` コマンドで登録

```
kubectl create secret generic mysql-pass --from-file=password.txt
secret "mysql-pass" created
```

`kubectl get secrets` コマンドで、Secretsの一覧を取得できます。

```
kubectl get secrets
NAME                  TYPE                                  DATA      AGE
default-token-g46vb   kubernetes.io/service-account-token   3         3h
mysql-pass            Opaque                                1         8s
```

## [MySQL](http://d.hatena.ne.jp/keyword/MySQL)を起動

[MySQL](http://d.hatena.ne.jp/keyword/MySQL)のPodをつくり[MySQL](http://d.hatena.ne.jp/keyword/MySQL)を起動させます。
以下の内容で `./manifests/mysql-pod.yaml` を作成します。

```
apiVersion: v1
kind: Pod
metadata:
  name: wordpress-mysql
  labels:
    app: wordpress
    tier: mysql
spec:
  containers:
  - image: mysql:5.6
    name: mysql
    env:
      - name: MYSQL_ROOT_PASSWORD
        valueFrom:
          secretKeyRef:
            name: mysql-pass
            key: password.txt
    ports:
      - containerPort: 3306
        name: mysql
```

- apiVersion
- kind
  - リソースの種類
- metadata
  - Podに設定する[メタデータ](http://d.hatena.ne.jp/keyword/%A5%E1%A5%BF%A5%C7%A1%BC%A5%BF)
  - Podの名前とラベルを設定することで同じアプリケーションが動作するPodが複数存在するときに絞り込みを行うことが可能
- spec
  - Podの仕様についての定義
  - 起動時に渡す[環境変数](http://d.hatena.ne.jp/keyword/%B4%C4%B6%AD%CA%D1%BF%F4)や、公開するポートなどをここで設定
  - [環境変数](http://d.hatena.ne.jp/keyword/%B4%C4%B6%AD%CA%D1%BF%F4)として `MYSQL_ROOT_PASSWORD` を定義し、Secretsに登録したパスワードを参照させる

`kubectl apply` コマンドでPodを作成

```
kubectl apply -f ./manifests/mysql-pod.yaml
pod "wordpress-mysql" created
```

`kubectl get pods` コマンドで、[mysql](http://d.hatena.ne.jp/keyword/mysql)が起動していることを確認

```
kubectl get pods
NAME              READY     STATUS    RESTARTS   AGE
wordpress-mysql   0/1       Pending   0          1m
```

`-l` でラベルを使って絞り込みもできます。

```
kubectl get pods -l app=wordpress -l tier=mysql
NAME              READY     STATUS    RESTARTS   AGE
wordpress-mysql   0/1       Pending   0          59s
```

`kubectl logs` コマンドで[MySQL](http://d.hatena.ne.jp/keyword/MySQL)のログも確認できます

```
kubectl logs wordpress-mysql | tail -n 5
2018-05-05 08:04:52 1 [Warning] Insecure configuration for --pid-file: Location '/var/run/mysqld' in the path is accessible to all OS users. Consider choosing a different directory
.
2018-05-05 08:04:52 1 [Warning] 'proxies_priv' entry '@ root@wordpress-mysql' ignored in --skip-name-resolve mode.
2018-05-05 08:04:52 1 [Note] Event Scheduler: Loaded 0 events
2018-05-05 08:04:52 1 [Note] mysqld: ready for connections.
Version: '5.6.40'  socket: '/var/run/mysqld/mysqld.sock'  port: 3306  MySQL Community Server (GPL)
```

`mysqld: ready for connections.` と出力されていることを確認できます。

## [MySQL](http://d.hatena.ne.jp/keyword/MySQL)に接続

`kubectl port-forward` コマンドで、Podのポートを[フォワ](http://d.hatena.ne.jp/keyword/%A5%D5%A5%A9%A5%EF)ードさせます。

```
kubectl port-forward wordpress-mysql 13306:3306
Forwarding from 127.0.0.1:13306 -> 3306
Forwarding from [::1]:13306 -> 3306

Handling connection for 13306
Handling connection for 13306
Handling connection for 13306
```

ポート `13306` をしていして[MySQL](http://d.hatena.ne.jp/keyword/MySQL)クライアントで[MySQL](http://d.hatena.ne.jp/keyword/MySQL)に接続できることを確認できました。

```
mysql -s -uroot -p -h127.0.0.1 --port=13306
Enter password:
mysql> show databases;
Database
information_schema
mysql
performance_schema
```

## DBのデータを永続的に保存させる

[MySQL](http://d.hatena.ne.jp/keyword/MySQL)のデータはPod上にあるので、Podが消えたらDBのデータも消えてしまいます。
なのでDBのデータを [PersistentVolume](https://kubernetes.io/docs/concepts/storage/persistent-volumes/) に保存するようにします。

[kubernetesでPersistent Volumesを使ってみる](https://ishiis.net/2017/01/08/kubernetes-storage/)

`./manifests/mysql-volume.yaml` でPersistentVolumeを定義します。
`local-volume-1`というPersistentVolumeを作成します。

```
apiVersion: v1
kind: PersistentVolume
metadata:
  name: local-volume-1
  labels:
    type: local
spec:
  capacity:
    storage: 20Gi
  accessModes:
    - ReadWriteOnce
  hostPath:
    path: /tmp/data/lv-1
  persistentVolumeReclaimPolicy: Recycle
```

適用すると、PersistentVolumeが作成されます。

```
kubectl apply -f ./manifests/mysql-volume.yaml
persistentvolume "local-volume-1" created
```

PersistentVolume一覧からlocal-volume-1が作成されていることを確認できました。

```
kubectl get persistentvolume
NAME             CAPACITY   ACCESS MODES   RECLAIM POLICY   STATUS      CLAIM     STORAGECLASS   REASON    AGE
local-volume-1   20Gi       RWO            Recycle          Available
```

次に、PodがPersistentVolumeを取得できるようにします。
[PersistentVolumeClaim](https://kubernetes.io/docs/concepts/storage/persistent-volumes/#persistentvolumeclaims) というリソースを使いますので
`./manifests/mysql-persistent-volume-claim.yaml` で定義します。
PV(PersistentVolume)からPodに紐付けるための領域がPVC(PersistentVolumeClaim)です。

```
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: mysql-lv-claim
  labels:
    app: wordpress
    tier: mysql
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 20Gi
```

- [Access](http://d.hatena.ne.jp/keyword/Access) Modes
  - Claimsは特定のアクセスモードでストレージを要求するときにボリュームと同じ規則を使用します。
- Resources
  - Claimsはポッドのように、特定の量のリソースを要求することができます。この場合、要求はストレージ用です。同じリソース・モデルがボリュームと要求の両方に適用されます。

適用してPVC(PersistentVolumeClaim)を作成します。
PVCをつくることでPodにストレージを追加することができます。

```
kubectl apply -f ./manifests/mysql-persistent-volume-claim.yaml
persistentvolumeclaim "mysql-lv-claim" created
```

それでは[mysql](http://d.hatena.ne.jp/keyword/mysql) PodがPVを使うようにマウント設定を行います。[Deployments](https://kubernetes.io/docs/concepts/workloads/controllers/deployment/)にもしておきます。
Deployment については以下もこちらも確認しました。

[Kubernetes Deploymentを理解する](https://qiita.com/komattaka/items/bd1d8d32f6cb24a32f53)
[Kubernetes: Deployment の仕組み](https://qiita.com/tkusumi/items/01cd18c59b742eebdc6a)

`Deployment` は `ReplicaSet` を生成・管理し、 `ReplicaSet` は `Pod` を生成・管理します。
`Rolling Back` やローリングアップデート、`Scaling` でセルフヒーリングといった仕組みを提供してくれます。

`./manifests/mysql-deployment-with-volume.yaml` で定義します。

```
apiVersion: apps/v1
kind: Deployment
metadata:
  name: wordpress-mysql
  labels:
    app: wordpress
    tier: mysql
spec:
  selector:
    matchLabels:
      app: wordpress
      tier: mysql
  template:
    metadata:
      labels:
        app: wordpress
        tier: mysql
    spec:
      containers:
      - image: mysql:5.6
        name: mysql
        env:
          - name: MYSQL_ROOT_PASSWORD
            valueFrom:
              secretKeyRef:
                name: mysql-pass
                key: password.txt
        ports:
          - containerPort: 3306
            name: mysql
        volumeMounts:
          - name: mysql-local-storage
            mountPath: /var/lib/mysql
      volumes:
      - name: mysql-local-storage
        persistentVolumeClaim:
          claimName: mysql-lv-claim
```

`kubectl apply` して、[mysql](http://d.hatena.ne.jp/keyword/mysql) Deploymentを作成

```
kubectl apply -f  manifests/mysql-deployment-with-volume.yaml
deployment.apps "wordpress-mysql" created
```

Deploymentを作ったので、Deploymentによって作られたPodと、最初に作成したPodがいる状態です。
`wordpress-mysql-7584cf4c49-xx9t4` がDeploymentによって作られたPodです。

```
kubectl get pod -l app=wordpress -l tier=mysql
NAME                               READY     STATUS    RESTARTS   AGE
wordpress-mysql                    1/1       Running   0          48m
wordpress-mysql-7584cf4c49-xx9t4   1/1       Running   0          14s
```

古い[wordpress](http://d.hatena.ne.jp/keyword/wordpress)-[mysql](http://d.hatena.ne.jp/keyword/mysql) Podは消します。

```
kubectl delete pod wordpress-mysql
pod "wordpress-mysql" deleted
```

Deploymentが作ったPodを見ると、 `ReplicaSet` でPodが管理されており、
`Volumes` に[mysql](http://d.hatena.ne.jp/keyword/mysql)-lv-claimが登録されているのがわかります。

```
kubectl describe pod wordpress-mysql-7584cf4c49-xx9t4
Name:           wordpress-mysql-7584cf4c49-xx9t4
(略)
Controlled By:  ReplicaSet/wordpress-mysql-7584cf4c49
(略)
Volumes:
  mysql-local-storage:
    Type:       PersistentVolumeClaim (a reference to a PersistentVolumeClaim in the same namespace)
    ClaimName:  mysql-lv-claim
    ReadOnly:   false
  default-token-cwnn6:
    Type:        Secret (a volume populated by a Secret)
    SecretName:  default-token-cwnn6
    Optional:    false
(略)
```

## [WordPress](http://d.hatena.ne.jp/keyword/WordPress)の起動

次は `./manifests/wordpress-pod.yaml` に定義し、[WordPress](http://d.hatena.ne.jp/keyword/WordPress)のPodを作成します。

```
apiVersion: v1
kind: Pod
metadata:
  name: wordpress
  labels:
    app: wordpress
    tier: front-end
spec:
  containers:
  - image: wordpress
    name: wordpress
    env:
    - name: WORDPRESS_DB_PASSWORD
      valueFrom:
        secretKeyRef:
          name: mysql-pass
          key: password.txt
    ports:
    - containerPort: 80
      name: wordpress
```

`kubectl apply` をします。

```
kubectl apply -f ./manifests/wordpress-pod.yaml
pod "wordpress" created
```

Podが立ち上がりませんでした。

```
kubectl get pods -l app=wordpress -l tier=front-end
NAME        READY     STATUS             RESTARTS   AGE
wordpress   0/1       CrashLoopBackOff   7          17m
```

ログを確認

[WordPress](http://d.hatena.ne.jp/keyword/WordPress)と[MySQL](http://d.hatena.ne.jp/keyword/MySQL)の接続ができていなそう。

```
kubectl logs wordpress | tail -n 5
MySQL Connection Error: (2002) php_network_getaddresses: getaddrinfo failed: Name or service not known

Warning: mysqli::__construct(): php_network_getaddresses: getaddrinfo failed: Name or service not known in Standard input code on line 22

Warning: mysqli::__construct(): (HY000/2002): php_network_getaddresses: getaddrinfo failed: Name or service not known in Standard input code on line 22
```

[WordPress](http://d.hatena.ne.jp/keyword/WordPress)のPod定義で、[MySQL](http://d.hatena.ne.jp/keyword/MySQL)のホストを指定していないからので、
[環境変数](http://d.hatena.ne.jp/keyword/%B4%C4%B6%AD%CA%D1%BF%F4)`WORDPRESS_DB_HOST` として渡してあげましょう。

## [WordPress](http://d.hatena.ne.jp/keyword/WordPress)と[MySQL](http://d.hatena.ne.jp/keyword/MySQL)の接続

`Service` というリソースを作ります。
サービスの転送先のポッドのセットは、ラベルと[セレクタ](http://d.hatena.ne.jp/keyword/%A5%BB%A5%EC%A5%AF%A5%BF)ーによって判別されます。
Serviceのspecとしては、ポート情報とどのPodにつなぐかを決めるselectorとclusterIPです。

[Services](https://kubernetes.io/docs/concepts/services-networking/service/)
[Kubernetes "サービス"の概要についての自習ノート](https://qiita.com/MahoTakara/items/d18d8f9b36416353066c)

`./manifests/mysql-service.yaml` で[MySQL](http://d.hatena.ne.jp/keyword/MySQL)の接続情報を定義します。

```
apiVersion: v1
kind: Service
metadata:
  name: wordpress-mysql
  labels:
    app: wordpress
    tier: mysql
spec:
  ports:
    - port: 3306
  selector:
    app: wordpress
    tier: mysql
  clusterIP: None
```

今回はまずService `wordpress-mysql` という名前の新しいオブジェクトを作成しました。
このオブジェクトは、[TCP](http://d.hatena.ne.jp/keyword/TCP)ポート `3306` をラベルのある任意のPod、ここでは `wordpress` で使用できるようにします。

[wordpress](http://d.hatena.ne.jp/keyword/wordpress)-[mysql](http://d.hatena.ne.jp/keyword/mysql)サービスを作成します。

```
kubectl apply -f manifests/mysql-service.yaml
service "wordpress-mysql" created
```

Service一覧で確認

```
kubectl get service -l app=wordpress -l tier=mysql
NAME              TYPE        CLUSTER-IP   EXTERNAL-IP   PORT(S)    AGE
wordpress-mysql   ClusterIP   None         <none>        3306/TCP   8s
```

Serviceを作成したら、[wordpress](http://d.hatena.ne.jp/keyword/wordpress) Podを一度消して、
DB接続できる[wordpress](http://d.hatena.ne.jp/keyword/wordpress) Podを作り直します。

```
kubectl delete pod wordpress
pod "wordpress" deleted
kubectl get pods -l app=wordpress -l tier=frontend
No resources found.
```

[mysql](http://d.hatena.ne.jp/keyword/mysql)のホストとして[mysql](http://d.hatena.ne.jp/keyword/mysql) Serviceを使うように定義を追加します。
spec/containers/envに、[WORDPRESS](http://d.hatena.ne.jp/keyword/WORDPRESS)\_DB\_HOSTを追加して、値に、[wordpress](http://d.hatena.ne.jp/keyword/wordpress)-[mysql](http://d.hatena.ne.jp/keyword/mysql) Serviceの3306を指定しています。
`./manifests/wordpress-pod-with-mysql-host.yaml` という名前で以下のを記述します。

```
apiVersion: v1
kind: Pod
metadata:
  name: wordpress
  labels:
    app: wordpress
    tier: frontend
spec:
  containers:
  - image: wordpress
    name: wordpress
    env:
    - name: WORDPRESS_DB_HOST
      value: wordpress-mysql:3306
    - name: WORDPRESS_DB_PASSWORD
      valueFrom:
        secretKeyRef:
          name: mysql-pass
          key: password.txt
    ports:
    - containerPort: 80
      name: wordpress
```

`kubectl apply`して、再度Podを作成。

```
kubectl apply -f ./manifests/wordpress-pod-with-mysql-host.yaml
pod "wordpress" created
```

ログをみてみます。
[WordPress](http://d.hatena.ne.jp/keyword/WordPress)が無事起動されています。
[wordpress](http://d.hatena.ne.jp/keyword/wordpress)から[wordpress](http://d.hatena.ne.jp/keyword/wordpress)-[mysql](http://d.hatena.ne.jp/keyword/mysql)に繋がりました。

```
kubectl logs wordpress | tail -n 5
Complete! WordPress has been successfully copied to /var/www/html
AH00558: apache2: Could not reliably determine the server's fully qualified domain name, using 172.17.0.4. Set the 'ServerName' directive globally to suppres
s this message
AH00558: apache2: Could not reliably determine the server's fully qualified domain name, using 172.17.0.4. Set the 'ServerName' directive globally to suppress this message
[Sat May 05 09:32:32.910938 2018] [mpm_prefork:notice] [pid 1] AH00163: Apache/2.4.25 (Debian) PHP/7.2.5 configured -- resuming normal operations
[Sat May 05 09:32:32.911000 2018] [core:notice] [pid 1] AH00094: Command line: 'apache2 -D FOREGROUND'
```

しかし、k8sの外から[wordpress](http://d.hatena.ne.jp/keyword/wordpress)に繋ぐことができないので、[wordpress](http://d.hatena.ne.jp/keyword/wordpress)用のサービスも作ります。
[mysql](http://d.hatena.ne.jp/keyword/mysql)とは違い、外部から接続したいので、typeとしてNodePortというものを選択します。
これは、PodのポートとNodeのポートを接続するものです。

`./manifests/wordpress-service.yaml` で以下の[yaml](http://d.hatena.ne.jp/keyword/yaml)を作成します。

```
apiVersion: v1
kind: Service
metadata:
  labels:
    app: wordpress
    tier: frontend
  name: wordpress
spec:
  type: NodePort
  ports:
    - port: 80
      targetPort: 80
      nodePort: 30180
  selector:
    app: wordpress
    tier: frontend
```

`kubectl apply` コマンドで、[wordpress](http://d.hatena.ne.jp/keyword/wordpress) Serviceを作成。
applyすればブラウザからアクセス可能になります。

```
kubectl apply -f ./manifests/wordpress-service.yaml
service "wordpress" created
```

Service一覧から確認

```
kubectl get service -l app=wordpress -l tier=frontend
NAME        TYPE       CLUSTER-IP     EXTERNAL-IP   PORT(S)        AGE
wordpress   NodePort   10.101.18.94   <none>        80:30180/TCP   9s
```

minikubeでは、以下のコマンドでブラウザで開くことができます。
[Wordpress](http://d.hatena.ne.jp/keyword/Wordpress)のセットアップ画面が表示されることができます。

```
minikube service wordpress
Opening kubernetes service default/wordpress in default browser...
```

## セルフヒーリング

[wordpress](http://d.hatena.ne.jp/keyword/wordpress)コンテナがクラッシュした時に繋がらなくなってしまいます。
対応したくないものです。運用はラクにしたいですね。
Podはコンテナとストレージボリュームの集合というだけで、自分自身を管理するということをしませんでした。
DeploymentのリソースをつかうことでPodの管理が可能になります。
`Deployment` は `ReplicaSet` を生成・管理し、 `ReplicaSet` は `Pod` を生成・管理でしたね。

`./manifests/wordpress-deployment.yaml` という名前で、以下の[yaml](http://d.hatena.ne.jp/keyword/yaml)を作成。

```
apiVersion: apps/v1
kind: Deployment
metadata:
  name: wordpress
  labels:
    app: wordpress
    tier: frontend
spec:
  selector:
    matchLabels:
      app: wordpress
      tier: frontend
  template:
    metadata:
      labels:
        app: wordpress
        tier: frontend
    spec:
      containers:
      - image: wordpress
        name: wordpress
        env:
        - name: WORDPRESS_DB_HOST
          value: wordpress-mysql:3306
        - name: WORDPRESS_DB_PASSWORD
          valueFrom:
            secretKeyRef:
              name: mysql-pass
              key: password.txt
        ports:
        - containerPort: 80
          name: wordpress
```

applyしてDeploymentによって自動的にwodpress Podが作成されることが確認できます。
古いPod([wordpress](http://d.hatena.ne.jp/keyword/wordpress))は削除します。

```
kubectl apply -f ./manifests/wordpress-deployment.yaml
deployment.apps "wordpress" created
```

`kubectl get deployment` コマンドで、[wordpress](http://d.hatena.ne.jp/keyword/wordpress) Deploymentが作成されていることを確認

```
kubectl get deployment -l app=wordpress -l tier=frontend
NAME        DESIRED   CURRENT   UP-TO-DATE   AVAILABLE   AGE
wordpress   1         1         1            0           7s
```

`Deployment` によってPodが自動作成されていることを確認。
[wordpress](http://d.hatena.ne.jp/keyword/wordpress)はPodとして作成したもので、[wordpress](http://d.hatena.ne.jp/keyword/wordpress)-5644c5ff4-fgbgbは `Deployment` によって自動作成されたものです。
また、最初に作成した[wordpress](http://d.hatena.ne.jp/keyword/wordpress) Podは消しておきましょう。

```
kubectl get pods -l app=wordpress -l tier=frontend
NAME                        READY     STATUS    RESTARTS   AGE
wordpress                   1/1       Running   0          8m
wordpress-5644c5ff4-fgbgb   1/1       Running   0          23s
kubectl delete po/wordpress
pod "wordpress" deleted
```

Deploymentは定義した状態を維持しようとします。
例えば、Podを削除しても新しいPodが自動的に作成され、Podが1台動いているという状態が維持されるます。

```
kubectl delete pod wordpress-5644c5ff4-fgbgb
pod "wordpress-5644c5ff4-fgbgb" deleted
kubectl get pods -l app=wordpress -l tier=frontend
NAME                        READY     STATUS        RESTARTS   AGE
wordpress-5644c5ff4-fgbgb   0/1       Terminating   0          54s
wordpress-5644c5ff4-w7h9z   1/1       Running       0          6s
```

このように `wordpress-5644c5ff4-fgbgb` が削除されると、
`wordpress-5644c5ff4-w7h9z` というPodがDeploymentにより作られます。

これはk8sの特徴で、状態を維持しようとする機能があります。
これにより、アプリケーションがクラッシュしたりしても自動的に復旧され、
サービスの運用の負担を下げることができます。

Deploymentを使うように変えてもPodは1つのままですがPodの数を変更することも可能です。
次は [kubectl scale](https://kubernetes-v1-4.github.io/docs/user-guide/kubectl/kubectl_scale/) コマンドでレプリカ数を変更して、Podの数を変えてみましょう。

```
kubectl scale deployment wordpress --replicas 5
deployment.extensions "wordpress" scaled
```

`kubectl get pods` でPodが4台追加されていることが確認できました。

```
kubectl get pods -l app=wordpress -l tier=frontend

NAME                        READY     STATUS              RESTARTS   AGE
wordpress-5644c5ff4-9kt5l   0/1       ContainerCreating   0          12s
wordpress-5644c5ff4-kvb4q   1/1       Running             0          12s
wordpress-5644c5ff4-vhkhq   0/1       ContainerCreating   0          12s
wordpress-5644c5ff4-w7h9z   1/1       Running             0          33s
wordpress-5644c5ff4-zq6sz   0/1       ContainerCreating   0          12s
```

これで、スケールアウトできる、[wordpress](http://d.hatena.ne.jp/keyword/wordpress)環境の完成です。
