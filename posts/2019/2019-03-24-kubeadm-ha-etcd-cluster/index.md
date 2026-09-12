---
title: " kubeadmでHA構成のetcdクラスタ構築"
date: "2019-03-24"
---

[最新手順はこちら](https://kubernetes.io/docs/setup/independent/setup-ha-etcd-with-kubeadm/)

Kubeadmは、コン[トロール](http://d.hatena.ne.jp/keyword/%A5%C8%A5%ED%A1%BC%A5%EB)プレーンノード上のkubeletによって管理される静的ポッドで単一メンバーのetcd[クラスタ](http://d.hatena.ne.jp/keyword/%A5%AF%A5%E9%A5%B9%A5%BF)をデフォルトで実行する。
etcd[クラスタ](http://d.hatena.ne.jp/keyword/%A5%AF%A5%E9%A5%B9%A5%BF)ーに含まれるメンバーは1つだけで、メンバーが使用不可になっても持続できないため、これはHA設定ではない。
このタスクでは、kubeadmを使用して[kubernetes](http://d.hatena.ne.jp/keyword/kubernetes)[クラスタ](http://d.hatena.ne.jp/keyword/%A5%AF%A5%E9%A5%B9%A5%BF)を設定するときに外部etcdとして使用できる3つのメンバからなる高可用性etcd[クラスタ](http://d.hatena.ne.jp/keyword/%A5%AF%A5%E9%A5%B9%A5%BF)を作成する手順をみていく。

## 始める前に

- ポート2379および2380を介して互いに通信できる3つのホスト。(今回はこれらをデフォルトポートと想定。kubeadmの設定ファイルで設定可能)
- 各ホストにはdocker、kubelet、およびkubeadmがインストールされている必要がある。
- ホスト間でファイルをコピーするための[ssh](http://d.hatena.ne.jp/keyword/ssh), scpなどが可能であること。

## [クラスタ](http://d.hatena.ne.jp/keyword/%A5%AF%A5%E9%A5%B9%A5%BF)を設定

一般的な方法は、1つのノードですべての証明書を生成し、必要なファイルだけを他のノードに配布すること。

**※kubeadmには、以下に説明する証明書を生成するために必要なすべての暗号化機構が含まれているので他の暗号化ツールは必要ない**

1. etcのサービスマネージャになるようにkubeletを設定

etcdが最初に作成されたので、kubeadm提供のkubeletユニットファイルよりも高い優先順位を持つ新しいユニットファイルを作成することによって
サービスの優先順位を上書きする必要がある。

```
cat << EOF > /etc/systemd/system/kubelet.service.d/20-etcd-service-manager.conf
[Service]
ExecStart=
ExecStart=/usr/bin/kubelet --address=127.0.0.1 --pod-manifest-path=/etc/kubernetes/manifests --allow-privileged=true
Restart=always
EOF

systemctl daemon-reload
systemctl restart kubelet
```

1. kubeadm用の設定ファイルを作成

以下の[スクリプト](http://d.hatena.ne.jp/keyword/%A5%B9%A5%AF%A5%EA%A5%D7%A5%C8)を使用して、etcdメンバーが実行されるホストごとに1つのkubeadm構成ファイルを生成する。

```
# Update HOST0, HOST1, and HOST2 with the IPs or resolvable names of your hosts
export HOST0=10.64.20.1
export HOST1=10.64.20.2
export HOST2=10.64.20.3

# Create temp directories to store files that will end up on other hosts.
mkdir -p /tmp/${HOST0}/ /tmp/${HOST1}/ /tmp/${HOST2}/

ETCDHOSTS=(${HOST0} ${HOST1} ${HOST2})
NAMES=("infra0" "infra1" "infra2")

for i in "${!ETCDHOSTS[@]}"; do
HOST=${ETCDHOSTS[$i]}
NAME=${NAMES[$i]}
cat << EOF > /tmp/${HOST}/kubeadmcfg.yaml
apiVersion: "kubeadm.k8s.io/v1beta1"
kind: ClusterConfiguration
etcd:
    local:
        serverCertSANs:
        - "${HOST}"
        peerCertSANs:
        - "${HOST}"
        extraArgs:
            initial-cluster: ${NAMES[0]}=https://${ETCDHOSTS[0]}:2380,${NAMES[1]}=https://${ETCDHOSTS[1]}:2380,${NAMES[2]}=https://${ETCDHOSTS[2]}:2380
            initial-cluster-state: new
            name: ${NAME}
            listen-peer-urls: https://${HOST}:2380
            listen-client-urls: https://${HOST}:2379
            advertise-client-urls: https://${HOST}:2379
            initial-advertise-peer-urls: https://${HOST}:2380
EOF
done
```

1. [認証局](http://d.hatena.ne.jp/keyword/%C7%A7%BE%DA%B6%C9)を生成する

すでにCAを持っているなら、 `crt` と `key` ファイルを `/etc/kubernetes/pki/etcd/ca.crt` と `/etc/kubernetes/pki/etcd/ca.key` にコピーするだけがアクションです
これらのファイルをコピーしたら、次の手順「各メンバーの証明書を作成する」に進む。ない場合は作成する。

1. 各メンバーの証明書を作成する

```
kubeadm init phase certs etcd-server --config=/tmp/${HOST2}/kubeadmcfg.yaml
kubeadm init phase certs etcd-peer --config=/tmp/${HOST2}/kubeadmcfg.yaml
kubeadm init phase certs etcd-healthcheck-client --config=/tmp/${HOST2}/kubeadmcfg.yaml
kubeadm init phase certs apiserver-etcd-client --config=/tmp/${HOST2}/kubeadmcfg.yaml
cp -R /etc/kubernetes/pki /tmp/${HOST2}/
# cleanup non-reusable certificates
find /etc/kubernetes/pki -not -name ca.crt -not -name ca.key -type f -delete

kubeadm init phase certs etcd-server --config=/tmp/${HOST1}/kubeadmcfg.yaml
kubeadm init phase certs etcd-peer --config=/tmp/${HOST1}/kubeadmcfg.yaml
kubeadm init phase certs etcd-healthcheck-client --config=/tmp/${HOST1}/kubeadmcfg.yaml
kubeadm init phase certs apiserver-etcd-client --config=/tmp/${HOST1}/kubeadmcfg.yaml
cp -R /etc/kubernetes/pki /tmp/${HOST1}/
find /etc/kubernetes/pki -not -name ca.crt -not -name ca.key -type f -delete

kubeadm init phase certs etcd-server --config=/tmp/${HOST0}/kubeadmcfg.yaml
kubeadm init phase certs etcd-peer --config=/tmp/${HOST0}/kubeadmcfg.yaml
kubeadm init phase certs etcd-healthcheck-client --config=/tmp/${HOST0}/kubeadmcfg.yaml
kubeadm init phase certs apiserver-etcd-client --config=/tmp/${HOST0}/kubeadmcfg.yaml
# No need to move the certs because they are for HOST0

# clean up certs that should not be copied off this host
find /tmp/${HOST2} -name ca.key -type f -delete
find /tmp/${HOST1} -name ca.key -type f -delete
```

1. 証明書とkubeadm設定をコピーする

証明書が生成されたので、今度はそれらをそれぞれのホストに移動する必要がある。

```
 USER=hogeuser
 HOST=${HOST1}
 scp -r /tmp/${HOST}/* ${USER}@${HOST}:
 ssh ${USER}@${HOST}
 USER@HOST $ sudo -Es
 root@HOST $ chown -R root:root pki
 root@HOST $ mv pki /etc/kubernetes/
```

1. 必要なファイルがすべて存在することを確認。

`$HOST0` に必要なファイルの完全なリストは以下。

```
/tmp/${HOST0}
└── kubeadmcfg.yaml
---
/etc/kubernetes/pki
├── apiserver-etcd-client.crt
├── apiserver-etcd-client.key
└── etcd
    ├── ca.crt
    ├── ca.key
    ├── healthcheck-client.crt
    ├── healthcheck-client.key
    ├── peer.crt
    ├── peer.key
    ├── server.crt
    └── server.key
```

`$HOST1`

```
$HOME
└── kubeadmcfg.yaml
---
/etc/kubernetes/pki
├── apiserver-etcd-client.crt
├── apiserver-etcd-client.key
└── etcd
    ├── ca.crt
    ├── healthcheck-client.crt
    ├── healthcheck-client.key
    ├── peer.crt
    ├── peer.key
    ├── server.crt
    └── server.key
```

`$HOST2`

```
$HOME
└── kubeadmcfg.yaml
---
/etc/kubernetes/pki
├── apiserver-etcd-client.crt
├── apiserver-etcd-client.key
└── etcd
    ├── ca.crt
    ├── healthcheck-client.crt
    ├── healthcheck-client.key
    ├── peer.crt
    ├── peer.key
    ├── server.crt
    └── server.key
```

1. 静的ポッド[マニフェスト](http://d.hatena.ne.jp/keyword/%A5%DE%A5%CB%A5%D5%A5%A7%A5%B9%A5%C8)を作成

証明書と設定が整ったので、次に[マニフェスト](http://d.hatena.ne.jp/keyword/%A5%DE%A5%CB%A5%D5%A5%A7%A5%B9%A5%C8)を作成。
各ホストで、kubeadmコマンドを実行してetcdの静的[マニフェスト](http://d.hatena.ne.jp/keyword/%A5%DE%A5%CB%A5%D5%A5%A7%A5%B9%A5%C8)を生成する。

```
root@HOST0 $ kubeadm init phase etcd local --config=/tmp/${HOST0}/kubeadmcfg.yaml
root@HOST1 $ kubeadm init phase etcd local --config=/home/ubuntu/kubeadmcfg.yaml
root@HOST2 $ kubeadm init phase etcd local --config=/home/ubuntu/kubeadmcfg.yaml
```

1. オプション：[クラスタ](http://d.hatena.ne.jp/keyword/%A5%AF%A5%E9%A5%B9%A5%BF)ーの正常性を確認

```
docker run --rm -it \
--net host \
-v /etc/kubernetes:/etc/kubernetes quay.io/coreos/etcd:${ETCD_TAG} etcdctl \
--cert-file /etc/kubernetes/pki/etcd/peer.crt \
--key-file /etc/kubernetes/pki/etcd/peer.key \
--ca-file /etc/kubernetes/pki/etcd/ca.crt \
--endpoints https://${HOST0}:2379 cluster-health
...
cluster is healthy
```

`${ETCD_TAG}` :あなたのetcd画像のバージョンタグを設定。例えばv3.2.24。
`${HOST0}` :テストしているホストの[IPアドレス](http://d.hatena.ne.jp/keyword/IP%A5%A2%A5%C9%A5%EC%A5%B9)を設定。
