---
title: "Creating multi master cluster with kubeadm(ver1.13以下)"
date: "2019-03-23"
---

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
| haproxy01 | [ロードバランサー](http://d.hatena.ne.jp/keyword/%A5%ED%A1%BC%A5%C9%A5%D0%A5%E9%A5%F3%A5%B5%A1%BC)(HAProxy) |
| master-node01 | MasterNode |
| master-node02 | MasterNode |
| master-node03 | MasterNode |
| worker-node01 | WorkerNode |
| worker-node02 | WorkerNode |
| worker-node03 | WorkerNode |

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
    bind 10.64.21.35:6443
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
    server  master-node01 10.64.20.01:6443 check
    server  master-node02 10.64.20.02:6443 check
    server  master-node03 10.64.20.03 :6443 check
```

1. HAProxyを再起動。

$ sudo systemctl restart haproxy

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

systemctl enable kubelet && systemctl start kubelet
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
$ sudo yum -y install docker-ce-18.06.1.ce-3.el7
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

## [TLS](http://d.hatena.ne.jp/keyword/TLS)証明書を生成する

これらの手順は、cfsslツールをインストールした場所に応じて、
[Linux](http://d.hatena.ne.jp/keyword/Linux)デスクトップまたはHAProxyマシン上にあれば実行できる。

## [認証局](http://d.hatena.ne.jp/keyword/%C7%A7%BE%DA%B6%C9)を作成する

1. [認証局](http://d.hatena.ne.jp/keyword/%C7%A7%BE%DA%B6%C9)設定ファイルを作成します。

```
$ vim ca-config.json
{
  "signing": {
    "default": {
      "expiry": "8760h"
    },
    "profiles": {
      "kubernetes": {
        "usages": ["signing", "key encipherment", "server auth", "client auth"],
        "expiry": "8760h"
      }
    }
  }
}
```

1. [認証局](http://d.hatena.ne.jp/keyword/%C7%A7%BE%DA%B6%C9)署名要求設定ファイルを作成します。

```
$ vim ca-csr.json
{
  "CN": "Kubernetes",
  "key": {
    "algo": "rsa",
    "size": 2048
  },
  "names": [
  {
    "C": "IE",
    "L": "Cork",
    "O": "Kubernetes",
    "OU": "CA",
    "ST": "Cork Co."
  }
 ]
}
```

1. [認証局](http://d.hatena.ne.jp/keyword/%C7%A7%BE%DA%B6%C9)証明書と[秘密鍵](http://d.hatena.ne.jp/keyword/%C8%EB%CC%A9%B8%B0)を生成します。

```
$ cfssl gencert -initca ca-csr.json | cfssljson -bare ca
```

1. ca-key.pemとca.pemが生成されたことを確認します。

```
$ ls -la
```

## Etcd[クラスタ](http://d.hatena.ne.jp/keyword/%A5%AF%A5%E9%A5%B9%A5%BF)ー用の証明書を作成する

1. 証明書署名要求設定ファイルを作成します。

```
$ vim kubernetes-csr.json
{
  "CN": "kubernetes",
  "key": {
    "algo": "rsa",
    "size": 2048
  },
  "names": [
  {
    "C": "IE",
    "L": "Cork",
    "O": "Kubernetes",
    "OU": "Kubernetes",
    "ST": "Cork Co."
  }
 ]
}
```

1. 証明書と[秘密鍵](http://d.hatena.ne.jp/keyword/%C8%EB%CC%A9%B8%B0)を生成します。

```
cfssl gencert \
-ca=ca.pem \
-ca-key=ca-key.pem \
-config=ca-config.json \
-hostname=10.64.20.1,10.64.20.2,10.64.20.3,10.64.21.35,127.0.0.1,kubernetes.default \
-profile=kubernetes kubernetes-csr.json | \
cfssljson -bare kubernetes
```

1. [kubernetes](http://d.hatena.ne.jp/keyword/kubernetes)-key.pemファイルと[kubernetes](http://d.hatena.ne.jp/keyword/kubernetes).pemファイルが生成されたことを確認

`ls -la`

1. 証明書を各ノードにコピー

```
$ scp ca.pem kubernetes.pem kubernetes-key.pem hogeuser@10.64.20.1~
$ scp ca.pem kubernetes.pem kubernetes-key.pem hogeuser@10.64.20.2:~
$ scp ca.pem kubernetes.pem kubernetes-key.pem hogeuser@10.64.20.3:~
$ scp ca.pem kubernetes.pem kubernetes-key.pem hogeuser@10.64.20.4:~
$ scp ca.pem kubernetes.pem kubernetes-key.pem hogeuser@10.64.20.5:~
$ scp ca.pem kubernetes.pem kubernetes-key.pem hogeuser@10.64.20.6:~
```

## 最初のコン[トロール](http://d.hatena.ne.jp/keyword/%A5%C8%A5%ED%A1%BC%A5%EB)プレーンノードの手順

1. 最初のコン[トロール](http://d.hatena.ne.jp/keyword/%A5%C8%A5%ED%A1%BC%A5%EB)プレーンノードで、次の設定ファイルを作成 `kubeadm-config.yaml`
2. `kubernetesVersion` 使用する[Kubernetes](http://d.hatena.ne.jp/keyword/Kubernetes)バージョンに設定する必要があります。この例では `stable` を使用。
3. `controlPlaneEndpoint` ロードバランサのアドレスまたは[DNS](http://d.hatena.ne.jp/keyword/DNS)とポートを一致させる必要があり。
4. `kubeadm、kubelet、kubectl` および[Kubernetes](http://d.hatena.ne.jp/keyword/Kubernetes)のバージョンを一致させることがお勧め。

```
apiVersion: kubeadm.k8s.io/v1beta1
kind: ClusterConfiguration
kubernetesVersion: stable
apiServer:
  certSANs:
  - "10.64.21.35"
controlPlaneEndpoint: "10.64.21.35:6443"
```

1. ノードがクリーンな状態にあることを確認

```
sudo kubeadm init --config=kubeadm-config.yaml
```

次のようなものが見えるはず

```
To start using your cluster, you need to run the following as a regular user:

  mkdir -p $HOME/.kube
  sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
  sudo chown $(id -u):$(id -g) $HOME/.kube/config

You should now deploy a pod network to the cluster.
Run "kubectl apply -f [podnetwork].yaml" with one of the options listed at:
  https://kubernetes.io/docs/concepts/cluster-administration/addons/

You can now join any number of machines by running the following on each node
as root:

kubeadm join 10.64.21.35:6443 --token c6c3id.bba2b5hih8ka9jx3 --discovery-token-ca-cert-hash sha256:b078841bd826050e1461341835ffc5a5b0cf2e32365a33794eb77512ca0c016a
```

1. この出力をテキストファイルにコピーし。後で他のコン[トロール](http://d.hatena.ne.jp/keyword/%A5%C8%A5%ED%A1%BC%A5%EB)プレーンノードを[クラスタ](http://d.hatena.ne.jp/keyword/%A5%AF%A5%E9%A5%B9%A5%BF)に参加させるために必要になる。
2. Weave CNI[プラグイン](http://d.hatena.ne.jp/keyword/%A5%D7%A5%E9%A5%B0%A5%A4%A5%F3)を適用

```
kubectl apply -f "https://cloud.weave.works/k8s/net?k8s-version=$(kubectl version | base64 | tr -d '\n')"
```

kubectl を kubelet に利用可能にするために以下のコマンドを実行しておくこと

```
$ mkdir -p $HOME/.kube
$ cp -f /etc/kubernetes/admin.conf $HOME/.kube/config
$ chown $(id -u):$(id -g) $HOME/.kube/config
```

実行しない場合は次のようになる。

```
# kubectl get pod --all-namespaces
    Unable to connect to the server: x509: certificate signed by unknown authority (possibly because of "crypto/rsa: verification error" while trying to verify candidate authority certificate "kubernetes")
```

1. 次のように入力して、[コンポーネント](http://d.hatena.ne.jp/keyword/%A5%B3%A5%F3%A5%DD%A1%BC%A5%CD%A5%F3%A5%C8)のPodを見始める。

```
kubectl get pod -n kube-system -w
```

1. 最初のノードの初期化が完了した後にのみ、新しいコン[トロール](http://d.hatena.ne.jp/keyword/%A5%C8%A5%ED%A1%BC%A5%EB)プレーンノードを結合させる。

次の例でCONTROL\_PLANE\_IPSは、他のコン[トロール](http://d.hatena.ne.jp/keyword/%A5%C8%A5%ED%A1%BC%A5%EB)プレーンノードの[IPアドレス](http://d.hatena.ne.jp/keyword/IP%A5%A2%A5%C9%A5%EC%A5%B9)に置き換えます。

```
USER=hogeuser
CONTROL_PLANE_IPS="10.64.20.190 10.64.20.186"
for host in ${CONTROL_PLANE_IPS}; do
    scp /etc/kubernetes/pki/ca.crt "${USER}"@$host:
    scp /etc/kubernetes/pki/ca.key "${USER}"@$host:
    scp /etc/kubernetes/pki/sa.key "${USER}"@$host:
    scp /etc/kubernetes/pki/sa.pub "${USER}"@$host:
    scp /etc/kubernetes/pki/front-proxy-ca.crt "${USER}"@$host:
    scp /etc/kubernetes/pki/front-proxy-ca.key "${USER}"@$host:
    scp /etc/kubernetes/pki/etcd/ca.crt "${USER}"@$host:etcd-ca.crt
    scp /etc/kubernetes/pki/etcd/ca.key "${USER}"@$host:etcd-ca.key
    scp /etc/kubernetes/admin.conf "${USER}"@$host:
done
```

*注意：上記のリストの証明書だけをコピーしてください。kubeadmは、参加しているコン[トロール](http://d.hatena.ne.jp/keyword/%A5%C8%A5%ED%A1%BC%A5%EB)プレーン[インスタンス](http://d.hatena.ne.jp/keyword/%A5%A4%A5%F3%A5%B9%A5%BF%A5%F3%A5%B9)に必要なSANを使用して、残りの証明書を生成します。すべての証明書を誤ってコピーした場合、必要なSANが不足しているために追加のノードを作成できない可能性があります。*

## 残りのコン[トロール](http://d.hatena.ne.jp/keyword/%A5%C8%A5%ED%A1%BC%A5%EB)プレーンノードの手順

**ノード一つずつ、[クラスタ](http://d.hatena.ne.jp/keyword/%A5%AF%A5%E9%A5%B9%A5%BF)に組み込んでから次のノードに進むこと**

1. 前の手順で作成したファイルを `scp` を使用した場所に移動させる

```
USER=hogeuser
sudo mkdir -p /etc/kubernetes/pki/etcd
sudo mv /home/${USER}/ca.crt /etc/kubernetes/pki/
sudo mv /home/${USER}/ca.key /etc/kubernetes/pki/
sudo mv /home/${USER}/sa.pub /etc/kubernetes/pki/
sudo mv /home/${USER}/sa.key /etc/kubernetes/pki/
sudo mv /home/${USER}/front-proxy-ca.crt /etc/kubernetes/pki/
sudo mv /home/${USER}/front-proxy-ca.key /etc/kubernetes/pki/
sudo mv /home/${USER}/etcd-ca.crt /etc/kubernetes/pki/etcd/ca.crt
sudo mv /home/${USER}/etcd-ca.key /etc/kubernetes/pki/etcd/ca.key
sudo mv /home/${USER}/admin.conf /etc/kubernetes/admin.conf
```

1. 最初のノードで以前に渡されたjoinコマンドを使用して、このノードで起動( `kubeadm init` )します。これは次のようになります。

```
sudo kubeadm join 10.64.21.35:6443 --token c6c3id.bba2b5hih8ka9jx3 --discovery-token-ca-cert-hash sha256:b078841bd826050e1461341835ffc5a5b0cf2e32365a33794eb77512ca0c016a --experimental-control-plane
```

**`--experimental-control-plane` フラグの追加に注意してください。このフラグは、このコン[トロール](http://d.hatena.ne.jp/keyword/%A5%C8%A5%ED%A1%BC%A5%EB)プレーンノードを[クラスタ](http://d.hatena.ne.jp/keyword/%A5%AF%A5%E9%A5%B9%A5%BF)に参加させることを自動化します。**

コン[トロール](http://d.hatena.ne.jp/keyword/%A5%C8%A5%ED%A1%BC%A5%EB)プレーンノードを[クラスタ](http://d.hatena.ne.jp/keyword/%A5%AF%A5%E9%A5%B9%A5%BF)追加失敗時は `kubeadm reset` して `kubeadm init` する。

1. 次のように入力して、[コンポーネント](http://d.hatena.ne.jp/keyword/%A5%B3%A5%F3%A5%DD%A1%BC%A5%CD%A5%F3%A5%C8)のポッドを見始めます。

```
kubectl get pod -n kube-system -w
```

1. 残りのコン[トロール](http://d.hatena.ne.jp/keyword/%A5%C8%A5%ED%A1%BC%A5%EB)プレーンノードに対してこれらの手順を繰り返します。

## workerノードの[クラスタ](http://d.hatena.ne.jp/keyword/%A5%AF%A5%E9%A5%B9%A5%BF)組み込み

さきほどの `kubeadm join` のコマンドを **`--experimental-control-plane`をつけないで** 実行。
1台ずつpodが組み込まれて完了したことを確認してから実行していくこと。
