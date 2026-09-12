---
title: "k8sクラスタのアップグレード"
date: "2018-08-29"
---

# 203-cluster-upgrades

# [Kubernetes](http://d.hatena.ne.jp/keyword/Kubernetes)[クラスタ](http://d.hatena.ne.jp/keyword/%A5%AF%A5%E9%A5%B9%A5%BF)のアップグレード

[AWS](http://d.hatena.ne.jp/keyword/AWS)上の[Kubernetes](http://d.hatena.ne.jp/keyword/Kubernetes)[クラスタ](http://d.hatena.ne.jp/keyword/%A5%AF%A5%E9%A5%B9%A5%BF)のアップグレードは、kopsで簡単にできます。
今回[Kubernetes](http://d.hatena.ne.jp/keyword/Kubernetes)[クラスタ](http://d.hatena.ne.jp/keyword/%A5%AF%A5%E9%A5%B9%A5%BF)ーを2つの方法でアップグレードする方法を試します。

## インプレースアップグレード

Kopsを使用すると、インプレースを使用して[クラスタ](http://d.hatena.ne.jp/keyword/%A5%AF%A5%E9%A5%B9%A5%BF)をアップグレードすることは簡単です。
[バー](http://d.hatena.ne.jp/keyword/%A5%D0%A1%BC)ジョン1.6.10の[Kubernetes](http://d.hatena.ne.jp/keyword/Kubernetes)[クラスタ](http://d.hatena.ne.jp/keyword/%A5%AF%A5%E9%A5%B9%A5%BF)をセットアップし、kopsを使用して1.7.2への自動ローリングアップグレードを実行します。

## [クラスタ](http://d.hatena.ne.jp/keyword/%A5%AF%A5%E9%A5%B9%A5%BF)を作成

次のように[Kubernetes](http://d.hatena.ne.jp/keyword/Kubernetes) 1.6.10[バー](http://d.hatena.ne.jp/keyword/%A5%D0%A1%BC)ジョン[クラスタ](http://d.hatena.ne.jp/keyword/%A5%AF%A5%E9%A5%B9%A5%BF)を作成します。

```
kops create cluster \
  --name example.cluster.k8s.local \
  --master-count 3 \
  --node-count 5 \
  --zones $AWS_AVAILABILITY_ZONES \
  --kubernetes-version=1.6.10 \
  --yes
```

マルチAZ配備の[クラスタ](http://d.hatena.ne.jp/keyword/%A5%AF%A5%E9%A5%B9%A5%BF)により、[クラスタ](http://d.hatena.ne.jp/keyword/%A5%AF%A5%E9%A5%B9%A5%BF)のアップグレード中にポッドやサービスがダウンタイムを起こさないことが保証されます。

[クラスタ](http://d.hatena.ne.jp/keyword/%A5%AF%A5%E9%A5%B9%A5%BF)を検証

```
$ kops validate cluster --name example.cluster.k8s.local
Validating cluster example.cluster.k8s.local

INSTANCE GROUPS
NAME      ROLE  MACHINETYPE MIN MAX SUBNETS
master-eu-central-1a  Master  m3.medium 1 1 eu-central-1a
master-eu-central-1b  Master  m3.medium 1 1 eu-central-1b
master-eu-central-1c  Master  c4.large  1 1 eu-central-1c
nodes     Node  t2.medium 5 5 eu-central-1a,eu-central-1b,eu-central-1c

NODE STATUS
NAME            ROLE  READY
ip-172-20-112-170.eu-central-1.compute.internal master  True
ip-172-20-117-204.eu-central-1.compute.internal node  True
ip-172-20-54-176.eu-central-1.compute.internal  master  True
ip-172-20-55-115.eu-central-1.compute.internal  node  True
ip-172-20-63-241.eu-central-1.compute.internal  node  True
ip-172-20-71-25.eu-central-1.compute.internal master  True
ip-172-20-91-30.eu-central-1.compute.internal node  True
ip-172-20-93-220.eu-central-1.compute.internal  node  True

Your cluster example.cluster.k8s.local is ready
```

[クラスタ](http://d.hatena.ne.jp/keyword/%A5%AF%A5%E9%A5%B9%A5%BF)内の異なるノードの[バー](http://d.hatena.ne.jp/keyword/%A5%D0%A1%BC)ジョンを確認します。

```
$ kubectl get nodes
NAME                                              STATUS    ROLES     AGE       VERSION
ip-172-20-112-170.eu-central-1.compute.internal   Ready     master    7m        v1.6.10
ip-172-20-117-204.eu-central-1.compute.internal   Ready     node      6m        v1.6.10
ip-172-20-54-176.eu-central-1.compute.internal    Ready     master    7m        v1.6.10
ip-172-20-55-115.eu-central-1.compute.internal    Ready     node      6m        v1.6.10
ip-172-20-63-241.eu-central-1.compute.internal    Ready     node      6m        v1.6.10
ip-172-20-71-25.eu-central-1.compute.internal     Ready     master    7m        v1.6.10
ip-172-20-91-30.eu-central-1.compute.internal     Ready     node      6m        v1.6.10
ip-172-20-93-220.eu-central-1.compute.internal    Ready     node      6m        v1.6.10
```

[クラスタ](http://d.hatena.ne.jp/keyword/%A5%AF%A5%E9%A5%B9%A5%BF)内の各ノードが[バー](http://d.hatena.ne.jp/keyword/%A5%D0%A1%BC)ジョン1.6.10であることを示しています。

## [クラスタ](http://d.hatena.ne.jp/keyword/%A5%AF%A5%E9%A5%B9%A5%BF)構成の編集

1.6.10の既存の[クラスタ](http://d.hatena.ne.jp/keyword/%A5%AF%A5%E9%A5%B9%A5%BF)を1.7.4にアップグレードしましょう。[クラスタ](http://d.hatena.ne.jp/keyword/%A5%AF%A5%E9%A5%B9%A5%BF)構成を編集します。

```
kops edit cluster example.cluster.k8s.local
```

これにより、[クラスタ](http://d.hatena.ne.jp/keyword/%A5%AF%A5%E9%A5%B9%A5%BF)構成が[テキストエディタ](http://d.hatena.ne.jp/keyword/%A5%C6%A5%AD%A5%B9%A5%C8%A5%A8%A5%C7%A5%A3%A5%BF)で開きます。
`kubernetesVersion` ターゲット[バー](http://d.hatena.ne.jp/keyword/%A5%D0%A1%BC)ジョン（この場合は1.7.4）にキーを設定し、設定ファイルを保存します。

以前の値：

```
kubernetesVersion: 1.6.10
```

以下に変更されます：

```
kubernetesVersion: 1.7.4
```

変更を保存してエディタを終了します。[Kubernetes](http://d.hatena.ne.jp/keyword/Kubernetes)[クラスタ](http://d.hatena.ne.jp/keyword/%A5%AF%A5%E9%A5%B9%A5%BF)は設定を再読み込みする必要があります。
これは、次のコマンドを使用して、[クラスタ](http://d.hatena.ne.jp/keyword/%A5%AF%A5%E9%A5%B9%A5%BF)のローリング・アップデートを強制することで実行できます。

`このプロセスには30〜45分かかることがあります。その時間中に更新なしでクラスタを離れることをお勧めします。`

```
$ kops update cluster example.cluster.k8s.local
I1028 18:18:59.671912   10844 apply_cluster.go:420] Gossip DNS: skipping DNS validation
I1028 18:18:59.699729   10844 executor.go:91] Tasks: 0 done / 81 total; 36 can run
I1028 18:19:00.824806   10844 executor.go:91] Tasks: 36 done / 81 total; 15 can run
I1028 18:19:01.601875   10844 executor.go:91] Tasks: 51 done / 81 total; 22 can run
I1028 18:19:03.340103   10844 executor.go:91] Tasks: 73 done / 81 total; 5 can run
I1028 18:19:04.153174   10844 executor.go:91] Tasks: 78 done / 81 total; 3 can run
I1028 18:19:04.575327   10844 executor.go:91] Tasks: 81 done / 81 total; 0 can run
Will modify resources:
  LaunchConfiguration/master-eu-central-1a.masters.cluster.k8s.local
    UserData
                          ...
                            cat > kube_env.yaml << __EOF_KUBE_ENV
                            Assets:
                          + - 7bf3fda43bb8d0a55622ca68dcbfaf3cc7f2dddc@https://storage.googleapis.com/kubernetes-release/release/v1.7.4/bin/linux/amd64/kubelet
                          - - a9258e4d2c7d7ed48a7bf2e3c77a798fa51a6787@https://storage.googleapis.com/kubernetes-release/release/v1.6.10/bin/linux/amd64/kubelet
                          + - 819010a7a028b165f5e6df37b1bb7713ff6d070f@https://storage.googleapis.com/kubernetes-release/release/v1.7.4/bin/linux/amd64/kubectl
                          - - 0afe23fb48276ad8c6385430962cd237367b22f7@https://storage.googleapis.com/kubernetes-release/release/v1.6.10/bin/linux/amd64/kubectl
                            - 1d9788b0f5420e1a219aad2cb8681823fc515e7c@https://storage.googleapis.com/kubernetes-release/network-plugins/cni-0799f5732f2a11b329d9e3d51b9c8f2e3759f2ff.tar.gz
                            - c18ca557507c662e3a072c3475da9bd1bc8a503b@https://kubeupv2.s3.amazonaws.com/kops/1.7.1/linux/amd64/utils.tar.gz
                          ...

  LaunchConfiguration/master-eu-central-1b.masters.cluster.k8s.local
    UserData
                          ...
                            cat > kube_env.yaml << __EOF_KUBE_ENV
                            Assets:
                          + - 7bf3fda43bb8d0a55622ca68dcbfaf3cc7f2dddc@https://storage.googleapis.com/kubernetes-release/release/v1.7.4/bin/linux/amd64/kubelet
                          - - a9258e4d2c7d7ed48a7bf2e3c77a798fa51a6787@https://storage.googleapis.com/kubernetes-release/release/v1.6.10/bin/linux/amd64/kubelet
                          + - 819010a7a028b165f5e6df37b1bb7713ff6d070f@https://storage.googleapis.com/kubernetes-release/release/v1.7.4/bin/linux/amd64/kubectl
                          - - 0afe23fb48276ad8c6385430962cd237367b22f7@https://storage.googleapis.com/kubernetes-release/release/v1.6.10/bin/linux/amd64/kubectl
                            - 1d9788b0f5420e1a219aad2cb8681823fc515e7c@https://storage.googleapis.com/kubernetes-release/network-plugins/cni-0799f5732f2a11b329d9e3d51b9c8f2e3759f2ff.tar.gz
                            - c18ca557507c662e3a072c3475da9bd1bc8a503b@https://kubeupv2.s3.amazonaws.com/kops/1.7.1/linux/amd64/utils.tar.gz
                          ...

  LaunchConfiguration/master-eu-central-1c.masters.cluster.k8s.local
    UserData
                          ...
                            cat > kube_env.yaml << __EOF_KUBE_ENV
                            Assets:
                          + - 7bf3fda43bb8d0a55622ca68dcbfaf3cc7f2dddc@https://storage.googleapis.com/kubernetes-release/release/v1.7.4/bin/linux/amd64/kubelet
                          - - a9258e4d2c7d7ed48a7bf2e3c77a798fa51a6787@https://storage.googleapis.com/kubernetes-release/release/v1.6.10/bin/linux/amd64/kubelet
                          + - 819010a7a028b165f5e6df37b1bb7713ff6d070f@https://storage.googleapis.com/kubernetes-release/release/v1.7.4/bin/linux/amd64/kubectl
                          - - 0afe23fb48276ad8c6385430962cd237367b22f7@https://storage.googleapis.com/kubernetes-release/release/v1.6.10/bin/linux/amd64/kubectl
                            - 1d9788b0f5420e1a219aad2cb8681823fc515e7c@https://storage.googleapis.com/kubernetes-release/network-plugins/cni-0799f5732f2a11b329d9e3d51b9c8f2e3759f2ff.tar.gz
                            - c18ca557507c662e3a072c3475da9bd1bc8a503b@https://kubeupv2.s3.amazonaws.com/kops/1.7.1/linux/amd64/utils.tar.gz
                          ...

  LaunchConfiguration/nodes.cluster.k8s.local
    UserData
                          ...
                            cat > kube_env.yaml << __EOF_KUBE_ENV
                            Assets:
                          + - 7bf3fda43bb8d0a55622ca68dcbfaf3cc7f2dddc@https://storage.googleapis.com/kubernetes-release/release/v1.7.4/bin/linux/amd64/kubelet
                          - - a9258e4d2c7d7ed48a7bf2e3c77a798fa51a6787@https://storage.googleapis.com/kubernetes-release/release/v1.6.10/bin/linux/amd64/kubelet
                          + - 819010a7a028b165f5e6df37b1bb7713ff6d070f@https://storage.googleapis.com/kubernetes-release/release/v1.7.4/bin/linux/amd64/kubectl
                          - - 0afe23fb48276ad8c6385430962cd237367b22f7@https://storage.googleapis.com/kubernetes-release/release/v1.6.10/bin/linux/amd64/kubectl
                            - 1d9788b0f5420e1a219aad2cb8681823fc515e7c@https://storage.googleapis.com/kubernetes-release/network-plugins/cni-0799f5732f2a11b329d9e3d51b9c8f2e3759f2ff.tar.gz
                            - c18ca557507c662e3a072c3475da9bd1bc8a503b@https://kubeupv2.s3.amazonaws.com/kops/1.7.1/linux/amd64/utils.tar.gz
                          ...

  LoadBalancer/api.cluster.k8s.local
    Lifecycle              <nil> -> Sync

  LoadBalancerAttachment/api-master-eu-central-1a
    Lifecycle              <nil> -> Sync

  LoadBalancerAttachment/api-master-eu-central-1b
    Lifecycle              <nil> -> Sync

  LoadBalancerAttachment/api-master-eu-central-1c
    Lifecycle              <nil> -> Sync

Must specify --yes to apply changes
```

次のコマンドを使用して変更を適用します。

```
kops update cluster example.cluster.k8s.local --yes
```

出力します

```
$ kops update cluster example.cluster.k8s.local --yes
I1028 18:22:53.558475   10876 apply_cluster.go:420] Gossip DNS: skipping DNS validation
I1028 18:22:54.487232   10876 executor.go:91] Tasks: 0 done / 81 total; 36 can run
I1028 18:22:55.750674   10876 executor.go:91] Tasks: 36 done / 81 total; 15 can run
I1028 18:22:56.640322   10876 executor.go:91] Tasks: 51 done / 81 total; 22 can run
I1028 18:22:59.756888   10876 executor.go:91] Tasks: 73 done / 81 total; 5 can run
I1028 18:23:01.154703   10876 executor.go:91] Tasks: 78 done / 81 total; 3 can run
I1028 18:23:01.890273   10876 executor.go:91] Tasks: 81 done / 81 total; 0 can run
I1028 18:23:02.196422   10876 update_cluster.go:247] Exporting kubecfg for cluster
kops has set your kubectl context to example.cluster.k8s.local

Cluster changes have been applied to the cloud.

Changes may require instances to restart: kops rolling-update cluster
```

## [クラスタ](http://d.hatena.ne.jp/keyword/%A5%AF%A5%E9%A5%B9%A5%BF)のアップグレード

次のコマンドを使用して、いずれかのノードで再起動が必要かどうかを判断します。

```
kops rolling-update cluster example.cluster.k8s.local
```

このコマンドは、次のように出力します。

```
NAME                  STATUS      NEEDUPDATE  READY MIN MAX NODES
master-eu-central-1a  NeedsUpdate 1           0     1   1   1
master-eu-central-1b  NeedsUpdate 1           0     1   1   1
master-eu-central-1c  NeedsUpdate 1           0     1   1   1
nodes                 NeedsUpdate 5           0     5   5   5

Must specify --yes to rolling-update.
```

このSTATUS列には、マスターノードとワーカーノードの両方を更新する必要があることが示されています。
次のコマンドを使用してローリングアップデートを実行します。

```
kops rolling-update cluster example.cluster.k8s.local --yeskops rolling-update cluster example.cluster.k8s.loc
```

このコマンドの出力が表示されます。

```
NAME                  STATUS      NEEDUPDATE  READY MIN MAX NODES
master-eu-central-1a  NeedsUpdate 1           0     1   1   1
master-eu-central-1b  NeedsUpdate 1           0     1   1   1
master-eu-central-1c  NeedsUpdate 1           0     1   1   1
nodes                 NeedsUpdate 5           0     5   5   5
I1028 18:26:37.124152   10908 instancegroups.go:350] Stopping instance "i-0c729296553079aab", node "ip-172-20-54-176.eu-central-1.compute.internal", in AWS ASG "master-eu-central-1a.masters.cluster.k8s.local".
I1028 18:31:37.439446   10908 instancegroups.go:350] Stopping instance "i-002976b15a2968b34", node "ip-172-20-71-25.eu-central-1.compute.internal", in AWS ASG "master-eu-central-1b.masters.cluster.k8s.local".
I1028 18:36:38.700513   10908 instancegroups.go:350] Stopping instance "i-0d4bd1a9668fab3e1", node "ip-172-20-112-170.eu-central-1.compute.internal", in AWS ASG "master-eu-central-1c.masters.cluster.k8s.local".
I1028 18:41:39.938149   10908 instancegroups.go:350] Stopping instance "i-0048aa89472a2c225", node "ip-172-20-93-220.eu-central-1.compute.internal", in AWS ASG "nodes.cluster.k8s.local".
I1028 18:43:41.019527   10908 instancegroups.go:350] Stopping instance "i-03787fa7fa77b9348", node "ip-172-20-117-204.eu-central-1.compute.internal", in AWS ASG "nodes.cluster.k8s.local".
I1028 19:14:50.288739   10908 instancegroups.go:350] Stopping instance "i-084c653bad3b17071", node "ip-172-20-55-115.eu-central-1.compute.internal", in AWS ASG "nodes.cluster.k8s.local".
I1028 19:16:51.339991   10908 instancegroups.go:350] Stopping instance "i-08da4ee3253afa479", node "ip-172-20-63-241.eu-central-1.compute.internal", in AWS ASG "nodes.cluster.k8s.local".
I1028 19:18:52.368412   10908 instancegroups.go:350] Stopping instance "i-0a7975621a65a1997", node "ip-172-20-91-30.eu-central-1.compute.internal", in AWS ASG "nodes.cluster.k8s.local".
I1028 19:20:53.743998   10908 rollingupdate.go:174] Rolling update completed!
```

[クラスタ](http://d.hatena.ne.jp/keyword/%A5%AF%A5%E9%A5%B9%A5%BF)を再度検証します。

```
$ kops validate cluster
Using cluster from kubectl context: example.cluster.k8s.local

Validating cluster example.cluster.k8s.local

INSTANCE GROUPS
NAME      ROLE  MACHINETYPE MIN MAX SUBNETS
master-eu-central-1a  Master  m3.medium 1 1 eu-central-1a
master-eu-central-1b  Master  m3.medium 1 1 eu-central-1b
master-eu-central-1c  Master  c4.large  1 1 eu-central-1c
nodes     Node  t2.medium 5 5 eu-central-1a,eu-central-1b,eu-central-1c

NODE STATUS
NAME            ROLE  READY
ip-172-20-101-20.eu-central-1.compute.internal  master  True
ip-172-20-106-93.eu-central-1.compute.internal  node  True
ip-172-20-109-10.eu-central-1.compute.internal  node  True
ip-172-20-41-77.eu-central-1.compute.internal node  True
ip-172-20-44-33.eu-central-1.compute.internal master  True
ip-172-20-75-132.eu-central-1.compute.internal  node  True
ip-172-20-85-128.eu-central-1.compute.internal  master  True
ip-172-20-93-108.eu-central-1.compute.internal  node  True

Your cluster example.cluster.k8s.local is ready
```

[クラスタ](http://d.hatena.ne.jp/keyword/%A5%AF%A5%E9%A5%B9%A5%BF)からノードのリストを取得

```
$ kubectl get nodes
NAME                                             STATUS    ROLES     AGE       VERSION
ip-172-20-101-20.eu-central-1.compute.internal   Ready     master    42m       v1.7.4
ip-172-20-106-93.eu-central-1.compute.internal   Ready     node      36m       v1.7.4
ip-172-20-109-10.eu-central-1.compute.internal   Ready     node      37m       v1.7.4
ip-172-20-41-77.eu-central-1.compute.internal    Ready     node      3m        v1.7.4
ip-172-20-44-33.eu-central-1.compute.internal    Ready     master    51m       v1.7.4
ip-172-20-75-132.eu-central-1.compute.internal   Ready     node      5m        v1.7.4
ip-172-20-85-128.eu-central-1.compute.internal   Ready     master    46m       v1.7.4
ip-172-20-93-108.eu-central-1.compute.internal   Ready     node      44s       v1.7.4
```

## Blue/green Upgrade

Blue/green メソッドを使用して[クラスタ](http://d.hatena.ne.jp/keyword/%A5%AF%A5%E9%A5%B9%A5%BF)ーをアップグレードすることは、本質的にはより控えめであると考えられ、アプリケーションの高可用性を考慮します。
2つの[k8s](http://d.hatena.ne.jp/keyword/k8s)[クラスタ](http://d.hatena.ne.jp/keyword/%A5%AF%A5%E9%A5%B9%A5%BF)を設定します.1つは1.6.10[バー](http://d.hatena.ne.jp/keyword/%A5%D0%A1%BC)ジョン、もう1つは1.7.2で、ポッドの展開とサービスは新しい[クラスタ](http://d.hatena.ne.jp/keyword/%A5%AF%A5%E9%A5%B9%A5%BF)に移行します。
