---
title: "aws-workshop-for-kubernetes(201-cluster-monitoring)"
date: "2018-05-16"
---

前回の続きから [201-cluster-monitoring](https://github.com/aws-samples/aws-workshop-for-kubernetes/tree/master/02-path-working-with-clusters/201-cluster-monitoring)

# Kubernetes Cluster Monitoring

## Introduction

今回、以下を使用してKubernetes[クラスタ](http://d.hatena.ne.jp/keyword/%A5%AF%A5%E9%A5%B9%A5%BF)を監視していきます。

1. Kubernetes[ダッシュ](http://d.hatena.ne.jp/keyword/%A5%C0%A5%C3%A5%B7%A5%E5)ボード
2. Heapster、InfluxDB、Grafana
3. Prometheus, Node exporter、Grafana

[Prometheus](https://prometheus.io/)は、[オープンソース](http://d.hatena.ne.jp/keyword/%A5%AA%A1%BC%A5%D7%A5%F3%A5%BD%A1%BC%A5%B9)のシステム監視とアラートツールキットです。Prometheusは、これらのターゲット上のHTTPエンドポイントからメトリックを抽出することで、監視対象からのメトリックを収集します。

HeapsterはKuberenetesコンテナメトリクスに限定されていますが、一般的な使用ではありません。HeapsterはPrometheusスクレイプターゲットとして使用できます。

## 前提条件

ここで説明する3つのマスターノードと5つのワーカーノードを持つ[クラスタ](http://d.hatena.ne.jp/keyword/%A5%AF%A5%E9%A5%B9%A5%BF)を使用します。
[Multi-Master Cluster](https://github.com/aws-samples/aws-workshop-for-kubernetes/tree/master/01-path-basics/102-your-first-cluster#multi-master-cluster)で作成しておきます。。
ここでの設定ファイルはすべて`cluster-monitoring`[ディレクト](http://d.hatena.ne.jp/keyword/%A5%C7%A5%A3%A5%EC%A5%AF%A5%C8)リにあります。
コマンドを実行する前に、その[ディレクト](http://d.hatena.ne.jp/keyword/%A5%C7%A5%A3%A5%EC%A5%AF%A5%C8)リに移動してください。

## Kubernetes [Dashboard](http://d.hatena.ne.jp/keyword/Dashboard)

[Kubernetes Dashboard](https://github.com/kubernetes/dashboard)はKubernetes[クラスタ](http://d.hatena.ne.jp/keyword/%A5%AF%A5%E9%A5%B9%A5%BF)用の汎用WebベースのUIです。

[ダッシュ](http://d.hatena.ne.jp/keyword/%A5%C0%A5%C3%A5%B7%A5%E5)ボードでは、Kubernetes v1.8でBetaではなくGAに昇格された[RBAC API](https://kubernetes.io/docs/admin/authorization/rbac/)を使用しているため、
実行中のKubernetesのバージョンに応じて異なるバージョンの[ダッシュ](http://d.hatena.ne.jp/keyword/%A5%C0%A5%C3%A5%B7%A5%E5)ボードを使用します。
次のコマンドを使用してあなたのKubernetesのバージョンを確認してください。
- Server Versionの値を確認してください。

```
 $ kubectl version
Client Version: version.Info{Major:"1", Minor:"10", GitVersion:"v1.10.2", GitCommit:"81753b10df112992bf51bbc2c2f85208aad78335", GitTreeState:"clean", BuildDate:"2018-04-27T09:22:21Z", GoVersion:"go1.9.3", Compiler:"gc", Platform:"linux/amd64"}
Server Version: version.Info{Major:"1", Minor:"9", GitVersion:"v1.9.3", GitCommit:"d2835416544f298c919e2ead3be3d0864b52323b", GitTreeState:"clean", BuildDate:"2018-02-07T11:55:20Z", GoVersion:"go1.9.2", Compiler:"gc", Platform:"linux/amd64"}
ec2-user:~/environment $
```

v1.8以上を使用している場合は、次のコマンドを使用して[Dashboard](http://d.hatena.ne.jp/keyword/Dashboard)をデプロイします。

```
$ kubectl apply -f https://raw.githubusercontent.com/kubernetes/dashboard/master/src/deploy/recommended/kubernetes-dashboard.yaml
secret "kubernetes-dashboard-certs" created
serviceaccount "kubernetes-dashboard" created
role.rbac.authorization.k8s.io "kubernetes-dashboard-minimal" created
rolebinding.rbac.authorization.k8s.io "kubernetes-dashboard-minimal" created
deployment.apps "kubernetes-dashboard" created
service "kubernetes-dashboard" created
```

[ダッシュ](http://d.hatena.ne.jp/keyword/%A5%C0%A5%C3%A5%B7%A5%E5)ボードは、次のコマンドを使用して表示できます。

```
kubectl proxy --address 0.0.0.0 --accept-hosts '.*' --port 8080
```

さて、[ダッシュ](http://d.hatena.ne.jp/keyword/%A5%C0%A5%C3%A5%B7%A5%E5)ボードには、`Preview` , `Preview Running Application` を介してアクセス可能

```
https://ENVIRONMENT_ID.vfs.cloud9.REGION_ID.amazonaws.com/api/v1/namespaces/kube-system/services/https:kubernetes-dashboard:/proxy/
```

`ENVIRONMENT_ID` は Cloud9 [IDE](http://d.hatena.ne.jp/keyword/IDE)環境ID（内蔵ブラウザのアドレスバーを一度クリックすると表示されます）と `REGION_ID` は[AWS](http://d.hatena.ne.jp/keyword/AWS) region（us-east-1など）

Kubernetes 1.7以降、[Dashboard](http://d.hatena.ne.jp/keyword/Dashboard)は認証をサポートしています。
詳細については、<https://github.com/kubernetes/dashboard/wiki/Access-control#introduction> を参照してください。認証にはbearer[トーク](http://d.hatena.ne.jp/keyword/%A5%C8%A1%BC%A5%AF)ンを使用します。

`kube-system` ネームスペースの既存のsecretsをチェック

```
kubectl -n kube-system get secret
```

出力は次のように表示されます。

```
NAME                                     TYPE                                  DATA      AGE
attachdetach-controller-token-dhkcr      kubernetes.io/service-account-token   3         3h
certificate-controller-token-p131b       kubernetes.io/service-account-token   3         3h
daemon-set-controller-token-r4mmp        kubernetes.io/service-account-token   3         3h
default-token-7vh0x                      kubernetes.io/service-account-token   3         3h
deployment-controller-token-jlzkj        kubernetes.io/service-account-token   3         3h
disruption-controller-token-qrx2v        kubernetes.io/service-account-token   3         3h
dns-controller-token-v49b6               kubernetes.io/service-account-token   3         3h
endpoint-controller-token-hgkbm          kubernetes.io/service-account-token   3         3h
generic-garbage-collector-token-34fvc    kubernetes.io/service-account-token   3         3h
horizontal-pod-autoscaler-token-lhbkf    kubernetes.io/service-account-token   3         3h
job-controller-token-c2s8j               kubernetes.io/service-account-token   3         3h
kube-dns-autoscaler-token-s3svx          kubernetes.io/service-account-token   3         3h
kube-dns-token-92xzb                     kubernetes.io/service-account-token   3         3h
kube-proxy-token-0ww14                   kubernetes.io/service-account-token   3         3h
kubernetes-dashboard-certs               Opaque                                2         9m
kubernetes-dashboard-key-holder          Opaque                                2         9m
kubernetes-dashboard-token-vt0fd         kubernetes.io/service-account-token   3         10m
namespace-controller-token-423gh         kubernetes.io/service-account-token   3         3h
node-controller-token-r6lsr              kubernetes.io/service-account-token   3         3h
persistent-volume-binder-token-xv30g     kubernetes.io/service-account-token   3         3h
pod-garbage-collector-token-fwmv4        kubernetes.io/service-account-token   3         3h
replicaset-controller-token-0cg8r        kubernetes.io/service-account-token   3         3h
replication-controller-token-3fwxd       kubernetes.io/service-account-token   3         3h
resourcequota-controller-token-6rl9f     kubernetes.io/service-account-token   3         3h
route-controller-token-9brzb             kubernetes.io/service-account-token   3         3h
service-account-controller-token-bqlsk   kubernetes.io/service-account-token   3         3h
service-controller-token-1qlg6           kubernetes.io/service-account-token   3         3h
statefulset-controller-token-kmgzg       kubernetes.io/service-account-token   3         3h
ttl-controller-token-vbnhf               kubernetes.io/service-account-token   3         3h
```

「kubernetes.io/namespace-controller-token」タイプのシークレットを使用してログインできます。
ここでは、シークレットの[トーク](http://d.hatena.ne.jp/keyword/%A5%C8%A1%BC%A5%AF)ン `namespace-controller-token-423gh` を使用してログインします。
このシークレットの[トーク](http://d.hatena.ne.jp/keyword/%A5%C8%A1%BC%A5%AF)ンを取得するには、次のコマンドを使用します。

```
kubectl -n kube-system describe secret namespace-controller-token-423gh
```

出力リストから namespace-controller-token に置き換える必要があることに注意してください。

```
Name:         namespace-controller-token-423gh
Namespace:    kube-system
Labels:       <none>
Annotations:  kubernetes.io/service-account.name=default
              kubernetes.io/service-account.uid=3a3fea86-b3a1-11e7-9d90-06b1e747c654

Type:  kubernetes.io/service-account-token

Data
====
ca.crt:     1046 bytes
namespace:  11 bytes
token:      eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJrdWJlcm5ldGVzL3NlcnZpY2VhY2NvdW50Iiwia3ViZXJuZXRlcy5pby9zZXJ2aWNlYWNjb3VudC9uYW1lc3BhY2UiOiJrdWJlLXN5c3RlbSIsImt1YmVybmV0ZXMuaW8vc2VydmljZWFjY291bnQvc2VjcmV0Lm5hbWUiOiJkZWZhdWx0LXRva2VuLTd2aDB4Iiwia3ViZXJuZXRlcy5pby9zZXJ2aWNlYWNjb3VudC9zZXJ2aWNlLWFjY291bnQubmFtZSI6ImRlZmF1bHQiLCJrdWJlcm5ldGVzLmlvL3NlcnZpY2VhY2NvdW50L3NlcnZpY2UtYWNjb3VudC51aWQiOiIzYTNmZWE4Ni1iM2ExLTExZTctOWQ5MC0wNmIxZTc0N2M2NTQiLCJzdWIiOiJzeXN0ZW06c2VydmljZWFjY291bnQ6a3ViZS1zeXN0ZW06ZGVmYXVsdCJ9.GHW-7rJcxmvujkClrN6heOi_RYlRivzwb4ScZZgGyaCR9tu2V0Z8PE5UR6E_3Vi9iBCjuO6L6MLP641bKoHB635T0BZymJpSeMPQ7t1F02BsnXAbyDFfal9NUSV7HoPAhlgURZWQrnWojNlVIFLqhAPO-5T493SYT56OwNPBhApWwSBBGdeF8EvAHGtDFBW1EMRWRt25dSffeyaBBes5PoJ4SPq4BprSCLXPdt-StPIB-FyMx1M-zarfqkKf7EJKetL478uWRGyGNNhSfRC-1p6qrRpbgCdf3geCLzDtbDT2SBmLv1KRjwMbW3EF4jlmkM4ZWyacKIUljEnG0oltjA
```

この出力から[トーク](http://d.hatena.ne.jp/keyword/%A5%C8%A1%BC%A5%AF)ンの値をコピーし、[ダッシュ](http://d.hatena.ne.jp/keyword/%A5%C0%A5%C3%A5%B7%A5%E5)ボードのログインウィンドウで `Token` を選択し、テキストを貼り付けます。
`SIGN IN` をクリックすると、デフォルトの[ダッシュ](http://d.hatena.ne.jp/keyword/%A5%C0%A5%C3%A5%B7%A5%E5)ボードビューが表示されます。

[ダッシュ](http://d.hatena.ne.jp/keyword/%A5%C0%A5%C3%A5%B7%A5%E5)ボード上でを `Nodes` をクリックすると、[クラスタ](http://d.hatena.ne.jp/keyword/%A5%AF%A5%E9%A5%B9%A5%BF)内で実行されているノードに関するテキスト表現が表示されます。
[Deploying applications using Kubernetes Helm charts](https://github.com/aws-samples/aws-workshop-for-kubernetes/tree/master/03-path-application-development/306-app-management-with-helm)の説明に従って、
[Java](http://d.hatena.ne.jp/keyword/Java)アプリケーションをインストールします。
`Pods` を再度クリックすると、[クラスタ](http://d.hatena.ne.jp/keyword/%A5%AF%A5%E9%A5%B9%A5%BF)内で実行中のポッドについてのテキスト表現が表示されます。
これは、Heapster、InfluxDB、Grafanaがインストールされた後に変更されます。

# [Deploying applications using Kubernetes Helm charts](https://github.com/aws-samples/aws-workshop-for-kubernetes/tree/master/03-path-application-development/306-app-management-with-helm)

[Helm](https://github.com/kubernetes/helm) は [Kubernetesチャート](https://github.com/kubernetes/charts) を管理するためのツールです。
チャートは、関連するKubernetesリソースのセットを記述するファイルの集まりです。 [チャートの紹介](https://github.com/kubernetes/helm/blob/master/docs/charts.md) で詳細を読む。

## 前提条件

この章では、ここで説明する3つのマスターノードと5つのワーカーノードを持つ[クラスタ](http://d.hatena.ne.jp/keyword/%A5%AF%A5%E9%A5%B9%A5%BF)を使用します。
設定ファイルはすべて `helm` [ディレクト](http://d.hatena.ne.jp/keyword/%A5%C7%A5%A3%A5%EC%A5%AF%A5%C8)リにあります。コマンドを実行する前に、その[ディレクト](http://d.hatena.ne.jp/keyword/%A5%C7%A5%A3%A5%EC%A5%AF%A5%C8)リに移動してください。

## Helmをインストールする

Helmには2つの部分があります。Helm client（helm）とHelm server（tiller）です。
TillerはあなたのKubernetes[クラスタ](http://d.hatena.ne.jp/keyword/%A5%AF%A5%E9%A5%B9%A5%BF)の内部で動作し、あなたのチャートのリリース（インストール）を管理します。
ヘルムは、ラップトップ、CI/CD、またはどこでも実行するために実行されます。
このセクションでは、クライアントとサーバーの両方をインストールする方法を示します。

## Helm clientをインストールする

Mac OSXにインストール

```
brew install kubernetes-helm
```

## Heapster、InfluxDB、Grafana

[Heapster](https://github.com/kubernetes/heapster)はmetrics aggregatorと[プロセッサー](http://d.hatena.ne.jp/keyword/%A5%D7%A5%ED%A5%BB%A5%C3%A5%B5%A1%BC)です。[クラスタ](http://d.hatena.ne.jp/keyword/%A5%AF%A5%E9%A5%B9%A5%BF)全体のポッドとしてインストールされます。
Kubeletと対話することにより、各ノードのすべてのコンテナの監視データとイベントデータを収集します。
Kubelet自体が[cAdvisor](https://github.com/google/cadvisor) からこのデータを取得します。
このデータは、ストレージ用の時系列データベースInfluxDBに保存されます。
Grafana[ダッシュ](http://d.hatena.ne.jp/keyword/%A5%C0%A5%C3%A5%B7%A5%E5)ボードを使用してデータを可視化するか、Kubernetes [Dashboard](http://d.hatena.ne.jp/keyword/Dashboard)で表示することができます。

Heapsterは、コンピューティングリソースの使用状況、ライフサイクルイベントなどのさまざまな信号を収集して解釈し、RESTエンドポイントを介して[クラスタ](http://d.hatena.ne.jp/keyword/%A5%AF%A5%E9%A5%B9%A5%BF)メトリックをエクスポートします。

Heapster、InfluxDB、Grafanaは [Kubernetesアドオン](https://kubernetes.io/docs/concepts/cluster-administration/addons/) です。

## インストール

Heapster、InfluxDB、Grafanaをインストールするには、次のコマンドを実行します。

```
$ kubectl apply -f templates/heapster/
deployment "monitoring-grafana" created
service "monitoring-grafana" created
clusterrolebinding "heapster" created
serviceaccount "heapster" created
deployment "heapster" created
service "heapster" created
deployment "monitoring-influxdb" created
service "monitoring-influxdb" created
```

Heapsterは、各ノードで実行されているcAdvisor[インスタンス](http://d.hatena.ne.jp/keyword/%A5%A4%A5%F3%A5%B9%A5%BF%A5%F3%A5%B9)からメトリックを集計しています。
このデータは、[クラスタ](http://d.hatena.ne.jp/keyword/%A5%AF%A5%E9%A5%B9%A5%BF)内で実行されているInfluxDB[インスタンス](http://d.hatena.ne.jp/keyword/%A5%A4%A5%F3%A5%B9%A5%BF%A5%F3%A5%B9)に格納されます。
Grafana[ダッシュ](http://d.hatena.ne.jp/keyword/%A5%C0%A5%C3%A5%B7%A5%E5)ボードは、<https://ENVIRONMENT_ID.vfs.cloud9.REGION_ID.amazonaws.com/api/v1/namespaces/kube-system/services/monitoring-grafana/proxy/?orgId=1> でアクセスし、[クラスタ](http://d.hatena.ne.jp/keyword/%A5%AF%A5%E9%A5%B9%A5%BF)について今の情報を表示します。

注意
Kubernetesプロキシが動作していない場合、Grafana[ダッシュ](http://d.hatena.ne.jp/keyword/%A5%C0%A5%C3%A5%B7%A5%E5)ボードは利用できません。
プロキシが実行されていない場合は、コマンドを使用してプロキシを開始できます
`kubectl proxy --address 0.0.0.0 --accept-hosts '.*' --port 8080`

## Graphana[ダッシュ](http://d.hatena.ne.jp/keyword/%A5%C0%A5%C3%A5%B7%A5%E5)ボード

[クラスタ](http://d.hatena.ne.jp/keyword/%A5%AF%A5%E9%A5%B9%A5%BF)とワークロードを監視するための[ダッシュ](http://d.hatena.ne.jp/keyword/%A5%C0%A5%C3%A5%B7%A5%E5)ボードが組み込まれています。それらは、画面の左上隅をクリックすることで利用できます。

「[クラスタ](http://d.hatena.ne.jp/keyword/%A5%AF%A5%E9%A5%B9%A5%BF)」[ダッシュ](http://d.hatena.ne.jp/keyword/%A5%C0%A5%C3%A5%B7%A5%E5)ボードには、すべてのワーカーノードとそのCPUおよびメモリメトリックが表示されます。選択した期間中に収集したメトリックを表示するには、ノード名を入力します。

[クラスタ](http://d.hatena.ne.jp/keyword/%A5%AF%A5%E9%A5%B9%A5%BF)[ダッシュ](http://d.hatena.ne.jp/keyword/%A5%C0%A5%C3%A5%B7%A5%E5)ボードは次のようになります。

「[Pods](http://d.hatena.ne.jp/keyword/Pods)」[ダッシュ](http://d.hatena.ne.jp/keyword/%A5%C0%A5%C3%A5%B7%A5%E5)ボードでは、[クラスタ](http://d.hatena.ne.jp/keyword/%A5%AF%A5%E9%A5%B9%A5%BF)内のすべてのポッドのリソース使用率を確認できます。ノードと同様に、上部のフィルタボックスに名前を入力してポッドを選択できます。

Heapsterの展開後、Kubernetes [Dashboard](http://d.hatena.ne.jp/keyword/Dashboard)は、ポッドやノード、その他のワークロードのCPUやメモリ使用率などの追加グラフを表示するようになりました。
Kubernetes [Dashboard](http://d.hatena.ne.jp/keyword/Dashboard)の[クラスタ](http://d.hatena.ne.jp/keyword/%A5%AF%A5%E9%A5%B9%A5%BF)の更新ビューは次のようになります。
ポッドの更新されたビューは次のようになります。

## Clean

インストールされているすべての[コンポーネント](http://d.hatena.ne.jp/keyword/%A5%B3%A5%F3%A5%DD%A1%BC%A5%CD%A5%F3%A5%C8)を削除します。

`kubectl delete -f templates/heapster/`

## プロメテウス、ノードエクスポータ、グラファナ

プロメテウスは、[オープンソース](http://d.hatena.ne.jp/keyword/%A5%AA%A1%BC%A5%D7%A5%F3%A5%BD%A1%BC%A5%B9)のシステム監視とアラートツールキットです。
Prometheusは、これらのターゲット上のHTTPエンドポイントからメトリックをスクレイプすることにより、監視対象からのメトリックを収集します。

プロメテウスは[KubernetesOperator](https://github.com/coreos/prometheus-operator/) によって管理されます。
この[演算子](http://d.hatena.ne.jp/keyword/%B1%E9%BB%BB%BB%D2)は[カスタムリソース](https://kubernetes.io/docs/concepts/api-extension/custom-resources/)を使用しています。
Kubernetesの[API](http://d.hatena.ne.jp/keyword/API)を拡張し、Prometheus、ServiceMonitorとAlertmanagerのようなカスタムリソースを追加する。

プロメテウスは、[ServiceMonitor](https://github.com/coreos/prometheus-operator/)を追加することによって、動的に新しいターゲットをスクレイプすることができます。
kube-controller-manager、kube-scheduler、kube-state-metrics、kubeletとnode-exporterをスクレイプするためにそれらのいくつかを含まれている。

[Node exporter](https://github.com/prometheus/node_exporter) は、\* NIX[カーネル](http://d.hatena.ne.jp/keyword/%A5%AB%A1%BC%A5%CD%A5%EB)によって公開されるハードウェアおよびOSメトリクスのPrometheus exporterです。
[kube-state-metrics](https://github.com/kubernetes/kube-state-metrics) は、Kubernetes [API](http://d.hatena.ne.jp/keyword/API)サーバーをリッスンし、オブジェクトの状態に関するメトリックを生成する単純なサービスです。

## インストール

まず、新しいカスタムリソースを聞くPrometheus Operatorを導入する必要があります。

```
$ kubectl apply -f templates/prometheus/prometheus-bundle.yaml
namespace "monitoring" created
clusterrolebinding "prometheus-operator" created
clusterrole "prometheus-operator" created
serviceaccount "prometheus-operator" created
deployment "prometheus-operator" created
```

次にPrometheus Operatorが起動するまで待つ必要があります。

```
$ kubectl rollout status deployment/prometheus-operator -n monitoring
...
deployment "prometheus-operator" successfully rolled out
```

最後のステップとして、プロメテウスのカスタムリソース、サービスモニタ、[クラスタ](http://d.hatena.ne.jp/keyword/%A5%AF%A5%E9%A5%B9%A5%BF)ロールと[バインディング](http://d.hatena.ne.jp/keyword/%A5%D0%A5%A4%A5%F3%A5%C7%A5%A3%A5%F3%A5%B0)（RBAC）を導入する必要があります。

```
$ kubectl apply -f templates/prometheus/prometheus.yaml
serviceaccount "kube-state-metrics" created
clusterrole "kube-state-metrics" created
clusterrolebinding "kube-state-metrics" created
service "kube-scheduler-prometheus-discovery" created
service "kube-controller-manager-prometheus-discovery" created
daemonset "node-exporter" created
service "node-exporter" created
deployment "kube-state-metrics" created
service "kube-state-metrics" created
prometheus "prometheus" created
servicemonitor "prometheus-operator" created
servicemonitor "kube-apiserver" created
servicemonitor "kubelet" created
servicemonitor "kube-controller-manager" created
servicemonitor "kube-scheduler" created
servicemonitor "kube-state-metrics" created
servicemonitor "node-exporter" created
alertmanager "main" created
secret "alertmanager-main" created
```

プロメテウスが現れるのを待つ

```
$ kubectl get po -l prometheus=prometheus -n monitoring
NAME                      READY     STATUS    RESTARTS   AGE
prometheus-prometheus-0   2/2       Running   0          1m
prometheus-prometheus-1   2/2       Running   0          1m
```

## Prometheus [Dashboard](http://d.hatena.ne.jp/keyword/Dashboard)

プロメテウスはさまざまな[スクレイピング](http://d.hatena.ne.jp/keyword/%A5%B9%A5%AF%A5%EC%A5%A4%A5%D4%A5%F3%A5%B0)ターゲットからメトリックを削り取り、[ダッシュ](http://d.hatena.ne.jp/keyword/%A5%C0%A5%C3%A5%B7%A5%E5)ボードを次の方法で転送します。

```
$ kubectl port-forward $(kubectl get po -l prometheus=prometheus -n monitoring -o jsonpath={.items[0].metadata.name}) 9090 -n monitoring
Forwarding from 127.0.0.1:9090 -> 9090
```

ブラウザで <http://localhost:9090/targets> を開き、すべてのターゲットを次のように表示する必要がありますUP（データコレクタが初めて起動して実行されるまで数分かかる場合があります）。ブラウザは次のように出力を表示します。

## Grafana Installation

次のコマンドでインストールできます

```
$ kubectl apply -f templates/prometheus/grafana-bundle.yaml
secret "grafana-credentials" created
service "grafana" created
configmap "grafana-dashboards-0" created
deployment "grafana" created
```

起動をまちます

```
$ kubectl rollout status deployment/grafana -n monitoring
...
deployment "grafana" successfully rolled out
```

## Grafana [Dashboard](http://d.hatena.ne.jp/keyword/Dashboard)

grafana[ダッシュ](http://d.hatena.ne.jp/keyword/%A5%C0%A5%C3%A5%B7%A5%E5)ボードをローカルポートに転送します。

```
$ kubectl port-forward $(kubectl get pod -l app=grafana -o jsonpath={.items[0].metadata.name} -n monitoring) 3000 -n monitoring
Forwarding from 127.0.0.1:3000 -> 3000
```

Grafana[ダッシュ](http://d.hatena.ne.jp/keyword/%A5%C0%A5%C3%A5%B7%A5%E5)ボードは、<http://localhost:3000/> にアクセスできるようになりました。トップにある検索ボタンを使用して、[ダッシュ](http://d.hatena.ne.jp/keyword/%A5%C0%A5%C3%A5%B7%A5%E5)ボードの完全なリストを利用できます。

これらの[ダッシュ](http://d.hatena.ne.jp/keyword/%A5%C0%A5%C3%A5%B7%A5%E5)ボードを使用して、さまざまな指標にアクセスできます。

1. Kubernetes Cluster Control Plane
2. Kubernetes[クラスタ](http://d.hatena.ne.jp/keyword/%A5%AF%A5%E9%A5%B9%A5%BF)のステータス
3. Kubernetes[クラスタ](http://d.hatena.ne.jp/keyword/%A5%AF%A5%E9%A5%B9%A5%BF)容量計画
4. Kubernetes[クラスタ](http://d.hatena.ne.jp/keyword/%A5%AF%A5%E9%A5%B9%A5%BF)内のノード

 その他の便利なリンク

<http://localhost:3000/dashboard/db/deployment&orgId=1>
<http://localhost:3000/dashboard/db/kubernetes-cluster-health?refresh=10s&orgId=1>
<http://localhost:3000/dashboard/db/kubernetes-resource-requests?orgId=1>
<http://localhost:3000/dashboard/db/pods?orgId=1>

## 掃除

インストールされているすべての[コンポーネント](http://d.hatena.ne.jp/keyword/%A5%B3%A5%F3%A5%DD%A1%BC%A5%CD%A5%F3%A5%C8)を削除します。

```
kubectl delete -f templates/prometheus/prometheus-bundle.yaml
```
