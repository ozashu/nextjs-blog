---
title: "Creating multi master cluster with kubeadm(ver1.14以上)"
date: "2019-04-06"
---

[前回](http://ozashu.hatenablog.com/entry/2019/03/23/085435?_ga=2.118348812.449414718.1554368334-1988520423.1540348390)kubeadmでマルチマスターの[クラスタ](http://d.hatena.ne.jp/keyword/%A5%AF%A5%E9%A5%B9%A5%BF)構築をしたが、kubeadm1.14で証明書の発行と配布がされるようになったので試してみた。

# document

<https://kubernetes.io/docs/setup/independent/install-kubeadm/>
<https://kubernetes.io/docs/setup/independent/create-cluster-kubeadm/>
[kubeadmのトラブルシューティング](https://kubernetes.io/docs/setup/independent/troubleshooting-kubeadm/)

# 始める前に

1. 以下のいずれかを実行している1台以上のマシンを用意
2. [Ubuntu](http://d.hatena.ne.jp/keyword/Ubuntu) 16.04+
3. [CentOS](http://d.hatena.ne.jp/keyword/CentOS) 7
4. マシンごとに2 GB以上のRAM（それ以下にすると、アプリケーション用のスペースが狭まる）
5. 2 CPU以上
6. [クラスタ](http://d.hatena.ne.jp/keyword/%A5%AF%A5%E9%A5%B9%A5%BF)内のすべてのマシン間の完全なネットワーク接続（パブリックまたはプライベートネットワークは問題なし）
7. ノードごとに固有のホスト名、[MACアドレス](http://d.hatena.ne.jp/keyword/MAC%A5%A2%A5%C9%A5%EC%A5%B9)、およびproduct\_uuid。
8. マシンでは特定のポートを開けとく
9. [スワップ](http://d.hatena.ne.jp/keyword/%A5%B9%A5%EF%A5%C3%A5%D7)無効(kubeletを正しく動作させるために[スワップ](http://d.hatena.ne.jp/keyword/%A5%B9%A5%EF%A5%C3%A5%D7)を無効にする。)

## 今回の構成

| ホスト名 | 役割 |
| --- | --- |
| dev-proxy01 | [ロードバランサー](http://d.hatena.ne.jp/keyword/%A5%ED%A1%BC%A5%C9%A5%D0%A5%E9%A5%F3%A5%B5%A1%BC)(HAProxy) |
| dev-master01 | MasterNode |
| dev-master02 | MasterNode |
| dev-master03. | MasterNode |
| dev-worker01 | WorkerNode |
| dev-worker02 | WorkerNode |
| dev-worker03 | WorkerNode |

## クライアントに必要なもの

cfsslとkubectlをインストールする

## HAProxy[ロードバランサー](http://d.hatena.ne.jp/keyword/%A5%ED%A1%BC%A5%C9%A5%D0%A5%E9%A5%F3%A5%B5%A1%BC)のインストール

3つの[Kubernetes](http://d.hatena.ne.jp/keyword/Kubernetes)マスターノードを配置するので、
[トラフィック](http://d.hatena.ne.jp/keyword/%A5%C8%A5%E9%A5%D5%A5%A3%A5%C3%A5%AF)を分散させるためにそれらの前にHAPRoxy[ロードバランサー](http://d.hatena.ne.jp/keyword/%A5%ED%A1%BC%A5%C9%A5%D0%A5%E9%A5%F3%A5%B5%A1%BC)を配置する必要がある。

1. LBにするサーバに[SSH](http://d.hatena.ne.jp/keyword/SSH)で接続します。
2. OS update
3. `$ sudo yum update -y`
4. HAProxyをインストール
5. `$ sudo yum install haproxy`
6. 3つの[Kubernetes](http://d.hatena.ne.jp/keyword/Kubernetes)マスターノード間で[トラフィック](http://d.hatena.ne.jp/keyword/%A5%C8%A5%E9%A5%D5%A5%A3%A5%C3%A5%AF)を負荷分散するようにHAProxyを設定。

```
$ sudo vim /etc/haproxy/haproxy.cfg
global
...
default
...
#---------------------------------------------------------------------
# main frontend which proxys to the backends
#---------------------------------------------------------------------
frontend kubernetes
    bind 10.64.20.226:6443
    option tcplog
    mode tcp
    default_backend kubernetes-master-nodes
#---------------------------------------------------------------------
# static backend for serving up images, stylesheets and such
#---------------------------------------------------------------------
backend static
    balance     roundrobin
    server      static 127.0.0.1:4331 check

#---------------------------------------------------------------------
# round robin balancing between the various backends
#---------------------------------------------------------------------
backend kubernetes-master-nodes
    mode tcp
    balance     roundrobin
    option tcp-check
    server  dev-master01 10.64.20.223:6443 check
    server  dev-master02 10.64.20.225:6443 check
    server  dev-master03 10.64.20.222:6443 check
```

1. HAProxyを再起動。

```
$ sudo systemctl restart haproxy
```

```
cat <<EOF > /etc/yum.repos.d/kubernetes.repo
[kubernetes]
name=Kubernetes
baseurl=https://packages.cloud.google.com/yum/repos/kubernetes-el7-x86_64
enabled=1
gpgcheck=1
repo_gpgcheck=1
gpgkey=https://packages.cloud.google.com/yum/doc/yum-key.gpg https://packages.cloud.google.com/yum/doc/rpm-package-key.gpg
exclude=kube*
EOF

# Set SELinux in permissive mode (effectively disabling it)
setenforce 0
sed -i 's/^SELINUX=enforcing$/SELINUX=permissive/' /etc/selinux/config

yum install -y kubelet kubeadm kubectl --disableexcludes=kubernetes

systemctl enable --now kubelet
```

# 以下は各kubeノードで実行

`sudo visudo` で一般ユーザにroot権限を付与
`sudo yum -y install vim`

## Dockerのインストール

[最新の手順はこちら](https://docs.docker.com/install/linux/docker-ce/centos/)

```
$ sudo yum install -y yum-utils \
  device-mapper-persistent-data \
  lvm2
$ sudo yum-config-manager \
    --add-repo \
    https://download.docker.com/linux/centos/docker-ce.repo
$ sudo yum install docker-ce docker-ce-cli containerd.io
$ sudo systemctl start docker & sudo systemctl enable docker
```

## kubeadmのインストール

[最新の手順はこちら](https://kubernetes.io/docs/setup/independent/install-kubeadm/)

まず事前準備として、全ノードで Docker、[CLI](http://d.hatena.ne.jp/keyword/CLI) 等の関連パッケージのインストールと、
[クラスタ](http://d.hatena.ne.jp/keyword/%A5%AF%A5%E9%A5%B9%A5%BF)内で利用するオーバーレイネットワーク用に[カーネル](http://d.hatena.ne.jp/keyword/%A5%AB%A1%BC%A5%CD%A5%EB)パラメータを変更しておきます。

```
# 必要な依存パッケージのインストール
$ sudo yum -y update
# リポジトリの登録と更新
$ sudo su -
$ cat <<EOF > /etc/yum.repos.d/kubernetes.repo
[kubernetes]
name=Kubernetes
baseurl=https://packages.cloud.google.com/yum/repos/kubernetes-el7-x86_64
enabled=1
gpgcheck=1
repo_gpgcheck=1
gpgkey=https://packages.cloud.google.com/yum/doc/yum-key.gpg https://packages.cloud.google.com/yum/doc/rpm-package-key.gpg
exclude=kube*
EOF

# SELinux disabling it)
setenforce 0
sed -i 's/^SELINUX=enforcing$/SELINUX=permissive/' /etc/selinux/config

# Kubernetes 関連パッケージのインストール
yum install -y kubelet kubeadm kubectl --disableexcludes=kubernetes

systemctl enable --now kubelet
# オーバーレイネットワーク用にカーネルパラメータを変更 
# RHEL / CentOS 7の一部のユーザーは、iptablesがバイパスされているために
# トラフィックが誤ってルーティングされるという問題を報告しています。
# あなたのnet.bridge.bridge-nf-call-iptables設定で1に設定されていることを確認する必要がある
cat <<EOF >  /etc/sysctl.d/k8s.conf
net.bridge.bridge-nf-call-ip6tables = 1
net.bridge.bridge-nf-call-iptables = 1
EOF
sysctl --system
```

# kubeadmを使ったHA[クラスタ](http://d.hatena.ne.jp/keyword/%A5%AF%A5%E9%A5%B9%A5%BF)の作成

[最新の手順はこちら](https://kubernetes.io/docs/setup/independent/high-availability/)

## [クラスタ](http://d.hatena.ne.jp/keyword/%A5%AF%A5%E9%A5%B9%A5%BF)ーの初期化とkubeadmで[TLS](http://d.hatena.ne.jp/keyword/TLS)証明書を調査する

マスターノードに1台ログインして以下を実行

1. [ディレクト](http://d.hatena.ne.jp/keyword/%A5%C7%A5%A3%A5%EC%A5%AF%A5%C8)リを作成

```
mkdir /etc/kubernetes/kubeadm
```

1. kubeadm-configを作成する。
2. `kubernetesVersion` 使用する[Kubernetes](http://d.hatena.ne.jp/keyword/Kubernetes)バージョンに設定する必要があります。この例では `stable` を使用。
3. `controlPlaneEndpoint` ロードバランサのアドレスまたは[DNS](http://d.hatena.ne.jp/keyword/DNS)とポートを一致させる必要があり。
4. `kubeadm、kubelet、kubectl` および[Kubernetes](http://d.hatena.ne.jp/keyword/Kubernetes)のバージョンを一致させることがお勧め。
5. IPは[proxyサーバ](http://d.hatena.ne.jp/keyword/proxy%A5%B5%A1%BC%A5%D0)のIPです。

```
$ vim /etc/kubernetes/kubeadm/kubeadm-config.yaml
apiVersion: kubeadm.k8s.io/v1beta1
kind: ClusterConfiguration
kubernetesVersion: stable
# REPLACE with `loadbalancer` IP
controlPlaneEndpoint: "10.64.20.226:6443"
networking:
  podSubnet: 10.64.0.0/18
```

1. 指定されたupload-certsと設定で[クラスタ](http://d.hatena.ne.jp/keyword/%A5%AF%A5%E9%A5%B9%A5%BF)を初期化します。

```
# kubeadm init \
     --config=/etc/kubernetes/kubeadm/kubeadm-config.yaml \
     --experimental-upload-certs
```

この出力をテキストファイルにコピーし。後で他のコン[トロール](http://d.hatena.ne.jp/keyword/%A5%C8%A5%ED%A1%BC%A5%EB)プレーンノードを[クラスタ](http://d.hatena.ne.jp/keyword/%A5%AF%A5%E9%A5%B9%A5%BF)に参加させるために必要になるのでメモ。

`certificate-key` は kubeadm certs secret の復号化を可能にするのでメモ。

```
You can now join any number of the control-plane node running the following command on each as root:

  kubeadm join 10.64.20.226:6443 --token ruf1ng.rcjtrdkczkto9t5d \
    --discovery-token-ca-cert-hash sha256:d17549120dec4b237497d95a7131b6387f00b1612b58be6341b7ea451f0939d0 \
    --experimental-control-plane --certificate-key d54f93a776345163398ec944fc67021517e96f11e3a59fb3d659ba5ab8f60b17
```

1. 利用するユーザで以下を実行。
   kubeconfigコマンドを実行する推奨のkubectlアクセス用。

```
mkdir -p $HOME/.kube
sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
sudo chown $(id -u):$(id -g) $HOME/.kube/config
```

1. kube-systemネームスペースのkubeadm-certシークレットを調べる。
   etcd、kube-apiserver、およびサービスアカウントの証明書が表示されます。

```
kubectl get secrets -n kube-system kubeadm-certs -o yaml
```

1. `ownerReferences` 配下の、`name` を調べる。
   これは一時的なkubeadm[トーク](http://d.hatena.ne.jp/keyword/%A5%C8%A1%BC%A5%AF)ンと相関しています。
   その[トーク](http://d.hatena.ne.jp/keyword/%A5%C8%A1%BC%A5%AF)ンが期限切れになると、このsecretも失効します。

```
  ownerReferences:
    - apiVersion: v1
    blockOwnerDeletion: true
    controller: true
    kind: Secret
    name: bootstrap-token-6o49ct
    uid: c6d15490-55b0-11e9-84b0-fa163e4b8c32
```

1. `kubeadm` で利用可能な[トーク](http://d.hatena.ne.jp/keyword/%A5%C8%A1%BC%A5%AF)ンリスト一覧を取得する。
   `6o49ct` が上記のステップの所有者参照であることに注意してください。
   これは結合[トーク](http://d.hatena.ne.jp/keyword/%A5%C8%A1%BC%A5%AF)ンではなく、kubeadm-certsで[ttl](http://d.hatena.ne.jp/keyword/ttl)を有効にするプロキシです。
   参加するときには、依然として `ruf1ng`[トーク](http://d.hatena.ne.jp/keyword/%A5%C8%A1%BC%A5%AF)ンを使用する必要があります。

```
$ kubeadm token list
TOKEN                     TTL       EXPIRES                     USAGES                   DESCRIPTION                                           EXTRA GROUPS
6o49ct.fxxdtesig28iohi5   1h        2019-04-03T12:35:34+09:00   <none>                   Proxy for managing TTL for the kubeadm-certs secret   <none>
ruf1ng.rcjtrdkczkto9t5d   23h       2019-04-04T10:35:35+09:00   authentication,signing   <none>                                                system:bootstrappers:kubeadm:default-node-token
```

1. CNI-plugin である `calico` を 前のconfigで設定した `podSubnet` にマッチする podのCIDRでインストールする。

```
kubectl apply -f https://gist.githubusercontent.com/joshrosso/ed1f5ea5a2f47d86f536e9eee3f1a2c2/raw/dfd95b9230fb3f75543706f3a95989964f36b154/calico-3.5.yaml
```

1. NodeのSTATUSが `Ready` であることを確認する。

```
$ kubectl get nodes
NAME                 STATUS   ROLES    AGE   VERSION
dev-master01   Ready    master   16m   v1.14.0
```

1. `kube-system` PodがRunningであることを確認する。

```
$ kubectl get pods -n kube-system
NAME                                         READY   STATUS    RESTARTS   AGE
calico-node-blstp                            1/1     Running   0          13m
coredns-fb8b8dccf-7nmlh                      1/1     Running   0          16m
coredns-fb8b8dccf-jr9nc                      1/1     Running   0          16m
etcd-dev-master01                      1/1     Running   0          15m
kube-apiserver-dev-master01            1/1     Running   0          15m
kube-controller-manager-dev-master01   1/1     Running   0          15m
kube-proxy-sz8cz                             1/1     Running   0          16m
kube-scheduler-dev-master01            1/1     Running   0          15m
```

## 2台目のMaster Nodeを追加する

1. メモっておいた以下のコマンドを実行する。

```
kubeadm join 10.64.20.226:6443 --token ruf1ng.rcjtrdkczkto9t5d \
    --discovery-token-ca-cert-hash sha256:d17549120dec4b237497d95a7131b6387f00b1612b58be6341b7ea451f0939d0 \
    --experimental-control-plane --certificate-key d54f93a776345163398ec944fc67021517e96f11e3a59fb3d659ba5ab8f60b17
```

1. 上のコマンドが完了したあとは、2台目のMaster Nodeがいることを確認する

```
$ kubectl get nodes
NAME                 STATUS   ROLES    AGE   VERSION
dev-master01   Ready    master   39m   v1.14.0
dev-master02   Ready    <none>   15m   v1.14.0
```

1. ROLESがnoneだったので、LABELを付与

```
$ kubectl label node dev-master02 node-role.kubernetes.io/master=
node/dev-master02 labeled
$ kubectl get nodes
NAME                 STATUS   ROLES    AGE   VERSION
dev-master01   Ready    master   41m   v1.14.0
dev-master02   Ready    master   16m   v1.14.0
```

1. Podが作成されていることを確認する

```
$ kubectl get pods -n kube-system
NAME                                         READY   STATUS    RESTARTS   AGE
calico-node-blstp                            1/1     Running   0          38m
calico-node-vprt5                            1/1     Running   0          17m
coredns-fb8b8dccf-7nmlh                      1/1     Running   0          41m
coredns-fb8b8dccf-jr9nc                      1/1     Running   0          41m
etcd-dev-master01                      1/1     Running   0          41m
etcd-dev-master02                      1/1     Running   0          17m
kube-apiserver-dev-master01            1/1     Running   0          41m
kube-apiserver-dev-master02            1/1     Running   0          17m
kube-controller-manager-dev-master01   1/1     Running   1          40m
kube-controller-manager-dev-master02   1/1     Running   0          17m
kube-proxy-bdwgx                             1/1     Running   0          17m
kube-proxy-sz8cz                             1/1     Running   0          41m
kube-scheduler-dev-master01            1/1     Running   1          40m
kube-scheduler-dev-master02            1/1     Running   0          17m
```

## 新しいTokenを使って3台目のMaster Nodeを追加

ここで3番目のMaster Nodeを最後のMasterとして追加するが、
最初に既存のkubeadm[トーク](http://d.hatena.ne.jp/keyword/%A5%C8%A1%BC%A5%AF)ンをすべて削除する。
新規で構築する場合は不要だが、これは、[Kubernetes](http://d.hatena.ne.jp/keyword/Kubernetes)[クラスタ](http://d.hatena.ne.jp/keyword/%A5%AF%A5%E9%A5%B9%A5%BF)ーが既に実行されているときにマスターを追加する方法です。

1. まず、動いているMasterから全てのTokenを表示

```
$ kubeadm token list
TOKEN                     TTL       EXPIRES                     USAGES                   DESCRIPTION                                           EXTRA GROUPS
6o49ct.fxxdtesig28iohi5   1h        2019-04-03T12:35:34+09:00   <none>                   Proxy for managing TTL for the kubeadm-certs secret   <none>
ruf1ng.rcjtrdkczkto9t5d   23h       2019-04-04T10:35:35+09:00   authentication,signing   <none>                                                system:bootstrappers:kubeadm:default-node-token
```

1. 全ての存在するTokenを削除
   kubeadm-certsシークレットの有効期限が切れて削除されたため、以前に記録されたjoinコマンドは機能しません。
   暗号化キーは無効になり、join[トーク](http://d.hatena.ne.jp/keyword/%A5%C8%A1%BC%A5%AF)ンは機能しなくなります。

```
kubeadm token delete 6o49ct.fxxdtesig28iohi5
kubeadm token delete ruf1ng.rcjtrdkczkto9t5d
```

削除されたことを確認

```
$ kubeadm token list
TOKEN     TTL       EXPIRES   USAGES    DESCRIPTION   EXTRA GROUPS
```

1. 10分の[TTL](http://d.hatena.ne.jp/keyword/TTL)で新しい[トーク](http://d.hatena.ne.jp/keyword/%A5%C8%A1%BC%A5%AF)ンを作成します。
   以下のIPは[ロードバランサー](http://d.hatena.ne.jp/keyword/%A5%ED%A1%BC%A5%C9%A5%D0%A5%E9%A5%F3%A5%B5%A1%BC)のホストを反映している必要があります。

```
$ kubeadm token create --ttl 10m --print-join-command
kubeadm join 10.64.20.226:6443 --token y5hs8z.nu2my2jhq44b74i5     --discovery-token-ca-cert-hash sha256:d17549120dec4b237497d95a7131b6387f00b1612b58be6341b7ea451f0939d0
```

1. kubeadm initのupload-certsフェーズを実行。

```
$ sudo su -
# kubeadm init phase upload-certs --experimental-upload-certs
[upload-certs] Storing the certificates in ConfigMap "kubeadm-certs" in the "kube-system" Namespace
[upload-certs] Using certificate key:
d0e3299a47812ebe52497e4d47676786c39460b0e137844c87862059f5436f7d
```

1. Masterに追加したいNodeに[SSH](http://d.hatena.ne.jp/keyword/SSH)接続し、前の手順の出力を使用して、コン[トロール](http://d.hatena.ne.jp/keyword/%A5%C8%A5%ED%A1%BC%A5%EB)プレーンへのjoinコマンドを実行します。

```
kubeadm join 10.64.20.226:6443 \
    --experimental-control-plane \
    --certificate-key d0e3299a47812ebe52497e4d47676786c39460b0e137844c87862059f5436f7d \
    --token y5hs8z.nu2my2jhq44b74i5 \
    --discovery-token-ca-cert-hash sha256:d17549120dec4b237497d95a7131b6387f00b1612b58be6341b7ea451f0939d0
```

以下は出力の抜粋

```
This node has joined the cluster and a new control plane instance was created:

* Certificate signing request was sent to apiserver and approval was received.
* The Kubelet was informed of the new secure connection details.
* Control plane (master) label and taint were applied to the new node.
* The Kubernetes control plane instances scaled up.
* A new etcd member was added to the local/stacked etcd cluster.

To start administering your cluster from this node, you need to run the following as a regular user:

        mkdir -p $HOME/.kube
        sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
        sudo chown $(id -u):$(id -g) $HOME/.kube/config

Run 'kubectl get nodes' to see this node join the cluster.
```

上の出力にあるように `kubectl` コマンドを実行できるようにする

```
$ kubectl get nodes
The connection to the server localhost:8080 was refused - did you specify the right host or port?
$ mkdir -p $HOME/.kube
$ sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
$ sudo chown $(id -u):$(id -g) $HOME/.kube/config
```

Master Nodeとして追加されたことを確認

```
$ kubectl get nodes
NAME                 STATUS   ROLES    AGE   VERSION
dev-master01   Ready    master   80m   v1.14.0
dev-master02   Ready    master   56m   v1.14.0
dev-master03   Ready    master   74s   v1.14.0
```

## workerノードの[クラスタ](http://d.hatena.ne.jp/keyword/%A5%AF%A5%E9%A5%B9%A5%BF)組み込み

さきほどの `kubeadm join` のコマンドを **`--experimental-control-plane`をつけないで** 実行。
1台ずつpodが組み込まれて完了したことを確認してから実行していくこと。

実行したら `error execution phase preflight: unable to fetch the kubeadm-config ConfigMap: failed to get config map: Unauthorized` とエラーが出た。

```
# kubeadm join 10.64.20.226:6443     --certificate-key d0e3299a47812ebe52497e4d47676786c39460b0e137844c87862059f5436f7d     --token y5hs8z.nu2my2jhq44b74i5     --discovery-token-ca-cert-hash sha256:d17549120dec4b237497d95a7131b6
387f00b1612b58be6341b7ea451f0939d0
[preflight] Running pre-flight checks
        [WARNING IsDockerSystemdCheck]: detected "cgroupfs" as the Docker cgroup driver. The recommended driver is "systemd". Please follow the guide at https://kubernetes.io/docs/setup/cri/
[preflight] Reading configuration from the cluster...
[preflight] FYI: You can look at this config file with 'kubectl -n kube-system get cm kubeadm-config -oyaml'
error execution phase preflight: unable to fetch the kubeadm-config ConfigMap: failed to get config map: Unauthorized
```

この場合はTokenの期限が切れていることが原因

```
[root@dev-master03 ~]# kubeadm token list
TOKEN                     TTL         EXPIRES                     USAGES                   DESCRIPTION                                           EXTRA GROUPS
y5hs8z.nu2my2jhq44b74i5   <invalid>   2019-04-03T11:57:38+09:00   authentication,signing   <none>                                                system:bootstrappers:kubeadm:default-node-token
ym6spi.2e7jfvyaqvtg4wce   1h          2019-04-03T13:49:27+09:00   <none>                   Proxy for managing TTL for the kubeadm-certs secret   <none>
```

再度作り直す

```
[root@dev-master03 ~]# kubeadm token delete y5hs8z.nu2my2jhq44b74i5
bootstrap token with id "y5hs8z" deleted
[root@dev-master03 ~]# kubeadm token create --ttl 10m --print-join-command
kubeadm join 10.64.20.226:6443 --token 9drkxn.oyse1f63s715af4g     --discovery-token-ca-cert-hash sha256:d17549120dec4b237497d95a7131b6387f00b1612b58be6341b7ea451f0939d0
[root@dev-master03 ~]# kubeadm token list
TOKEN                     TTL       EXPIRES                     USAGES                   DESCRIPTION                                           EXTRA GROUPS
9drkxn.oyse1f63s715af4g   9m        2019-04-03T12:48:20+09:00   authentication,signing   <none>                                                system:bootstrappers:kubeadm:default-node-token
ym6spi.2e7jfvyaqvtg4wce   1h        2019-04-03T13:49:27+09:00   <none>                   Proxy for managing TTL for the kubeadm-certs secret   <none>
```

作り直したTokenを使用してjoinされることを確認

```
kubeadm join 10.64.20.226:6443 \
    --certificate-key d0e3299a47812ebe52497e4d47676786c39460b0e137844c87862059f5436f7d \
    --token 9drkxn.oyse1f63s715af4g \
    --discovery-token-ca-cert-hash sha256:d17549120dec4b237497d95a7131b6387f00b1612b58be6341b7ea451f0939d0
```

出力はこんな感じ

```
[preflight] Running pre-flight checks
        [WARNING IsDockerSystemdCheck]: detected "cgroupfs" as the Docker cgroup driver. The recommended driver is "systemd". Please follow the guide at https://kubernetes.io/docs/setup/cri/
[preflight] Reading configuration from the cluster...
[preflight] FYI: You can look at this config file with 'kubectl -n kube-system get cm kubeadm-config -oyaml'
[kubelet-start] Downloading configuration for the kubelet from the "kubelet-config-1.14" ConfigMap in the kube-system namespace
[kubelet-start] Writing kubelet configuration to file "/var/lib/kubelet/config.yaml"
[kubelet-start] Writing kubelet environment file with flags to file "/var/lib/kubelet/kubeadm-flags.env"
[kubelet-start] Activating the kubelet service
[kubelet-start] Waiting for the kubelet to perform the TLS Bootstrap...

This node has joined the cluster:
* Certificate signing request was sent to apiserver and a response was received.
* The Kubelet was informed of the new secure connection details.

Run 'kubectl get nodes' on the control-plane to see this node join the cluster.
```

Nodeとして追加されていることを確認

```
$ kubectl get nodes
NAME                 STATUS   ROLES    AGE     VERSION
dev-master01   Ready    master   131m    v1.14.0
dev-master02   Ready    master   106m    v1.14.0
dev-master03   Ready    master   51m     v1.14.0
dev-worker01   Ready    <none>   6m53s   v1.14.0
dev-worker02   Ready    <none>   3m54s   v1.14.0
dev-worker03   Ready    <none>   3m42s   v1.14.0
```

ROLESがnoneなのでworkerと付与してもいい。
こんな感じで。

```
$ kubectl label node dev-worker01 node-role.kubernetes.io/worker=
node/dev-worker01 labeled
$ kubectl label node dev-worker02 node-role.kubernetes.io/worker=
node/dev-worker02 labeled
$ kubectl label node dev-worker03 node-role.kubernetes.io/worker=
node/dev-worker03 labeled
$ kubectl get nodes
NAME                 STATUS   ROLES    AGE    VERSION
dev-master01   Ready    master   158m   v1.14.0
dev-master02   Ready    master   134m   v1.14.0
dev-master03   Ready    master   79m    v1.14.0
dev-worker01   Ready    worker   34m    v1.14.0
dev-worker02   Ready    worker   31m    v1.14.0
dev-worker03   Ready    worker   31m    v1.14.0
```

etcdの[冗長化](http://d.hatena.ne.jp/keyword/%BE%E9%C4%B9%B2%BD)はされないので、するなら別にしないとだめ。
みなさんどうされているか、よければおしえてください。

```
[hoge@dev-master01 ~]$ kubectl get componentstatus
NAME                 STATUS    MESSAGE             ERROR
scheduler            Healthy   ok
controller-manager   Healthy   ok
etcd-0               Healthy   {"health":"true"}
```
