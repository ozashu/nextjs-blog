---
title: "podのCrashLoopBackOff原因およびNodeのNot Readyフラッピング問題調査"
date: "2019-03-25"
---

# これは何?

とあるPodがCrashLoopBackOffのステータスになりあがってくれず、
それにあわせてNodeのstatusがNot Readyでフラッピングしている。
調査しつつ周辺技術(kubelet, CRI,CNIとか)についても調べて自信ニキになりたい。

# 事象

fluentdのpodがCrashLoopBackOffのステータスになり起動しない、
それに伴いNodeのstatusもNot Readyにフラッピングしている。

- 各nodeの状態

```
# kubectl get pods |grep fluentd
node1                             0/1     CrashLoopBackOff   2029       28d
node2                            0/1     CrashLoopBackOff   1075       28d
node3                            0/1     CrashLoopBackOff   1052       28d
node4                            0/1     CrashLoopBackOff   1036       28d
node5                            0/1     CrashLoopBackOff   2994       28d
```

# どんなとき

fluentdにログが流れてなかった時期

# 原因

CNIの[bug](https://github.com/containernetworking/cni/pull/568)
fluentd PodのPodSandboxのコンテナがないためkubeletでPodの起動に失敗している。

# 根本対応

bugfixされたlibcniをpullする。

# 暫定対応

PodSandboxのコンテナ起動もしくはfluentd Podの再作成(DeamonSetなので消せば再起動するため)もしくはkubelet再起動

# 調査した流れとログ

pod起動していないのでlogsは不可。
kubeletかdescribeでまずは調べる。
台数あるのでまずは `fluentd` を中心に調べていく。
その次にNode NotreadyについてPLEG周りを調べていく。

- node server

kubeletが `fluentd-` podへの動機に失敗している模様

```
# journalctl -u kubelet
-- Logs begin at 月 2018-11-19 12:14:46 JST, end at 月 2019-02-04 16:29:22 JST. --
 1月 24 01:49:36 node kubelet[10796]: E0124 01:49:36.768314   10796 pod_workers.go:190] Error syncing pod a094d5a4-125b-11e9-8374-fa163e76fc98 ("fluentd(a094d5a4-125b-11e9-8374-fa163e76fc98)"), skipping: rpc err
 1月 24 01:49:42 node kubelet[10796]: I0124 01:49:42.507809   10796 setters.go:72] Using node IP: "10.64.152.1"
 1月 24 01:49:51 node kubelet[10796]: E0124 01:49:51.768283   10796 pod_workers.go:190] Error syncing pod a094d5a4-125b-11e9-8374-fa163e76fc98 ("fluentd(a094d5a4-125b-11e9-8374-fa163e76fc98)"), skipping: rpc err
 1月 24 01:49:52 node kubelet[10796]: I0124 01:49:52.523387   10796 setters.go:72] Using node IP: "10.64.152.1"
```

- Master側

CrashLoopBackOffはどうやら以下の内容

> [コンテナ内のプロセスの終了を検知してコンテナの再起動を繰り返している。](https://qiita.com/minodisk/items/547741b73763f2bab6b8#crashloopbackoff)

`fluentd` は `Daemonset` だった。なので[自動起動](http://d.hatena.ne.jp/keyword/%BC%AB%C6%B0%B5%AF%C6%B0)を何度も試みていると考えられる。

```
# kubectl get pods fluentd -o wide
NAME    READY   STATUS             RESTARTS   AGE   IP            NODE    NOMINATED NODE   READINESS GATES
fluentd   0/1     CrashLoopBackOff   1075       28d   172.16.69.8    node   <none>           <none>
```

- master側

OCIruntimeがコンテナ起動作成失敗している模様
Eventsに `status: rpc error` とあるので、kubeletからCRIへのgrpc[プロトコル](http://d.hatena.ne.jp/keyword/%A5%D7%A5%ED%A5%C8%A5%B3%A5%EB)の命令が処理されずエラーになっていると考えられる。

```
# kubectl describe pods fluentd
(略)
    State:          Waiting
      Reason:       CrashLoopBackOff
    Last State:     Terminated
      Reason:       ContainerCannotRun
      Message:      OCI runtime create failed: container_linux.go:348: starting container process caused "process_linux.go:402: container init caused \"\"": unknown
      Exit Code:    128
      Started:      Fri, 11 Jan 2019 16:26:40 +0900
      Finished:     Fri, 11 Jan 2019 16:26:40 +0900
(中略)
Events:
  Type     Reason      Age                    From                                     Message
  ----     ------      ----                   ----                                     -------
  Warning  FailedSync  60m (x85 over 19d)     kubelet, node  error determining status: rpc error: code = Unknown desc = operation timeout: context deadline exceeded
  Warning  FailedSync  8s (x123314 over 23d)  kubelet, node  error determining status: rpc error: code = DeadlineExceeded desc = context deadline exceeded
```

`PodSandboxStatus of sandbox for pod "fluentd" error: rpc error: code = Unknown desc = Error: No such container:` とあるので
`fluentd` podのための `PodSandbox` がないメッセージが出力されている。

- node

```
# less /var/log/messages-20190113
(略)
Jan  7 09:07:16 node004 kubelet: E0107 18:07:16.254903   10796 kuberuntime_manager.go:857] PodSandboxStatus of sandbox "5983c305299bada0906df670eba18f8be1e5192d75b825f1a01075dd5595c5f3" for pod "fluentd(a094d5a4-125b-11e9-8374-fa163e76fc98)" error: rpc error: code = Unknown desc = Error: No such container: 5983c305299bada0906df670eba18f8be1e5192d75b825f1a01075dd5595c5f3
Jan  7 09:07:16 node004 kubelet: E0107 18:07:16.254959   10796 generic.go:247] PLEG: Ignoring events for pod fluentd/default: rpc error: code = Unknown desc = Error: No such container: 5983c305299bada0906df670eba18f8be1e5192d75b825f1a01075dd5595c5f3
```

- node

`fluentd` コンテナは起動しきってない。
`gcr.io/google_containers/pause-amd64` も`k8s_POD_fluentd_default_a094d5a4-125b-11e9-8374-fa163e76fc98_1` をみにいっている。
[google\_containers/pause-amd64](https://kubernetes.io/docs/concepts/containers/images/) pause-amdd64はimage周りで使うコンテナの模様
[image\_gc\_manager\_test.go](https://github.com/kubernetes/kubernetes/blob/7f23a743e8c23ac6489340bbb34fa6f1d392db9d/pkg/kubelet/images/image_gc_manager_test.go#L36)でもpauseコンテナについて書いてある。
pauseコンテナの説明は[ここ](https://www.ianlewis.org/en/almighty-pause-container)がわかりやすい

```
# docker ps -a                                                                                                                                                                                                 [85/1657]
CONTAINER ID        IMAGE                                                        COMMAND                  CREATED             STATUS                PORTS               NAMES
000016b6000        asia.gcr.io/hoge/fluentd                            "/bin/sh -c '/run.sh…"   3 weeks ago         Created                                   k8s_fluentd_fluentd_default_a094d5a4-125b-11e9-8374-fa163e76fc98_1076
0004301c000       asia.gcr.io/hoge/fluentd                           "/bin/sh -c '/run.sh…"   3 weeks ago         Removal In Progress                       k8s_fluentd_fluentd_default_a094d5a4-125b-11e9-8374-fa163e76fc98_1075
0002e7bc000        gcr.io/google_containers/pause-amd64:3.1                         "/pause"                 3 weeks ago         Up 3 weeks                                k8s_POD_fluentd_default_a094d5a4-125b-11e9-8374-fa163e76fc98_1
```

以上をまとめると `fluentd` コンテナは作成され起動しようとしているけど、OCIruntimeがコンテナ起動作成失敗していると考えられる。
`fluentd_default` podのための `PodSandbox` がないメッセージが出力されているので、 `PodSandbox` に調べてみる。
[PodSandbox](https://kubernetes.io/blog/2016/12/container-runtime-interface-cri-in-kubernetes/) は以下。

流れとして `kubelet→CRI(docker)→podsandbox→pod` となる。

```
Before starting a pod, kubelet calls RuntimeService.RunPodSandbox to create the environment. This includes setting up networking for a pod (e.g., allocating an IP). Once the PodSandbox is active, individual containers can be created/started/stopped/removed independently. To delete the pod, kubelet will stop and remove containers before stopping and removing the PodSandbox.

Kubelet is responsible for managing the lifecycles of the containers through the RPCs, exercising the container lifecycles hooks and liveness/readiness checks, while adhering to the restart policy of the pod.
```

つまりkubeletはポッドを開始する前に、RuntimeServiceを呼ぶ。そしてRunPodSandboxを呼び出して環境を作成する。(ポッド用のネットワーク設定(IP割当て)などもする。)
PodSandboxがアクティブになると、個々のコンテナを個別に作成/開始/停止/削除することができる。
ポッドを削除するには、kubeletはPodSandboxを停止して削除する前にコンテナを停止して削除する。
Kubeletは、ポッドの再起動ポリシーを守りながら、RPCを通じてコン​​テナのライフサイクルを管理して、
コンテナーのライフサイクルフックを実行し、liveness/readiness のチェックを行う。

とあるのでkubeletがCRIにgRPCでコンテナ起動させようとしても
PodSandboxのコンテナがないため、コンテナの起動に失敗している。
そしてDeamonSetが起動させようとして、Woeker NodeのStatusもフラッピングしていると考えられる。

Not ReadyのNodeでは `PLEG` でFalseしている。
[PLEG](https://github.com/jenkins-x/exposecontroller/blob/master/vendor/k8s.io/kubernetes/docs/proposals/pod-lifecycle-event-generator.md)はここ参照。
PLEGはkubeletの内部モジュールで、
Pod Lifecycle Event Generatorという名前の通り、kubeletがPodの管理およびコンテナの状態を管理するためのもの。

```
# kubectl describe nodes node
Conditions:
  Type             Status  LastHeartbeatTime                 LastTransitionTime                Reason                       Message
  ----             ------  -----------------                 ------------------                ------                       -------
  MemoryPressure   False   Tue, 05 Feb 2019 14:36:43 +0900   Fri, 21 Dec 2018 20:19:20 +0900   KubeletHasSufficientMemory   kubelet has sufficient memory available
  DiskPressure     False   Tue, 05 Feb 2019 14:36:43 +0900   Fri, 21 Dec 2018 20:19:20 +0900   KubeletHasNoDiskPressure     kubelet has no disk pressure
  PIDPressure      False   Tue, 05 Feb 2019 14:36:43 +0900   Fri, 21 Dec 2018 20:19:20 +0900   KubeletHasSufficientPID      kubelet has sufficient PID available
  Ready            False   Tue, 05 Feb 2019 14:36:43 +0900   Tue, 05 Feb 2019 14:36:33 +0900   KubeletNotReady              ≈is not healthy: pleg was last seen active 3m11.707539232s ago; threshold is 3m0s
(中略)
Events:
  Type    Reason        Age                     From                    Message
  ----    ------        ----                    ----                                     -------
  Normal  NodeReady     19m (x8929 over 45d)    kubelet, node004  Node node004 status is now: NodeReady
  Normal  NodeNotReady  4m15s (x8932 over 24d)  kubelet, node004  Node node004 status is now: NodeNotReady
```

PLEGのhealth checkは3分毎。`docker ps` でコンテナの状態変化を検出し、`docker ps`と`inspect` でこれらのコンテナの詳細を取得する。
これらが終了した後にタイムスタンプを更新するのだけれども、タイムスタンプが更新されていない場合(3分)、ヘルスチェックは失敗する。
<https://github.com/kubernetes/kubernetes/blob/a1539d8e52c7ca5f6a590eebc66a5b33acc9c036/pkg/kubelet/pleg/generic.go#L134-L146>

Master側はNodeのkubeletのPLEGからpodが落ちていると受け取って、Not Readyとしている。
そしてPLEGがpodが落ちていると判断しているのはPodSandboxがおらずコンテナが起動していないから。
そしてCNIのbugでpodsandboxの起動時失敗でtimeoutのままlockを要求して、podsandboxが再起動されず起動していない模様。
<https://github.com/containernetworking/cni/issues/567>

```
# kubectl describe pods fluentd
(略)
Events:
  Type     Reason      Age                    From                                     Message
  ----     ------      ----                   ----                                     -------
  Warning  FailedSync  60m (x85 over 19d)     kubelet, node004  error determining status: rpc error: code = Unknown desc = operation timeout: context deadline exceeded
  Warning  FailedSync  8s (x123314 over 23d)  kubelet, node004  error determining status: rpc error: code = DeadlineExceeded desc = context deadline exceeded
```

コンテナがどうやって起動しているのか、コンテナランタイムの実装などをみて、
理解が必要だと思ったので、理解を深めてからまた、kubernatesのpod起動周りについて調べ直したい。
