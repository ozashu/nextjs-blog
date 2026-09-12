---
title: "GKE + datadogの監視の仕組みをhelmfileを使っての下準備"
date: "2019-04-25"
---

GKE + datadogの監視をするのにhelmfileを使ってdatadog-agentを入れるのと、
helmfileをCircle CIで回してパッケージ管理の準備までしてしまおうというもの。

## Integrationの有効化

Datadogなので、まずはintegrationの有効化
必要に応じてだけど、代替以下

```
Docker
Google Cloud Platform
Google Container Engine
Google Compute Engine
Google CloudSQL
Google Cloud Pubsub
Google Cloud Storage
kubernates
```

[こちら参考](https://blog.orz.at/2018/03/03/gke-datadog/)
[GCP](http://d.hatena.ne.jp/keyword/GCP)のIntegrationを有効化するために [サービスアカウント](https://cloud.google.com/sdk/docs/authorizing?hl=ja#authorizing_with_a_service_account) が必要なので作成しておく。

## 監視項目

監視したい内容は以下とする

- [Kubernetes](http://d.hatena.ne.jp/keyword/Kubernetes) 上のアプリ/[クラスタ](http://d.hatena.ne.jp/keyword/%A5%AF%A5%E9%A5%B9%A5%BF)[コンポーネント](http://d.hatena.ne.jp/keyword/%A5%B3%A5%F3%A5%DD%A1%BC%A5%CD%A5%F3%A5%C8)の監視

| 種類 | 監視対象 | 監視項目 | 監視方法 (使うメトリクス項目) |
| --- | --- | --- | --- |
| Work metrics | アプリの Pod (web, [api](http://d.hatena.ne.jp/keyword/api), worker) | unavailable な Pod がいないことを確認 | [kubernetes](http://d.hatena.ne.jp/keyword/kubernetes)\_state.deployment.replicas\_unavailable |
| Work metrics | アプリの Pod (web, [api](http://d.hatena.ne.jp/keyword/api), worker) | Pod が restart loop に陥っていないことを確認 | "CrashLoopBackOff/n分間にn回以上再起動していないかどうか" |
| Work metrics | kube-system namespace の [Pods](http://d.hatena.ne.jp/keyword/Pods) | unavailable な Pod がいないことを確認 |  |
| Work metrics | [Kubernetes](http://d.hatena.ne.jp/keyword/Kubernetes) worker nodes | 全ての node status が Ready であることを確認 | check: [kubernetes](http://d.hatena.ne.jp/keyword/kubernetes)\_state.node.ready |
| Work metrics | [Kubernetes](http://d.hatena.ne.jp/keyword/Kubernetes) worker nodes | 全ての node が schedulable であることを確認 | "metrics: [kubernetes](http://d.hatena.ne.jp/keyword/kubernetes)\_state.node.status/tag: status:schedulable == 0" |
| Resources metrics | [Kubernetes](http://d.hatena.ne.jp/keyword/Kubernetes) worker nodes | node のリソースのキャパシティに余裕があることを確認 | "kube\_node\_status\_capacity\_cpu\_cores/kube\_node\_status\_capacity\_memory\_bytes" |

- GCE[インスタンス](http://d.hatena.ne.jp/keyword/%A5%A4%A5%F3%A5%B9%A5%BF%A5%F3%A5%B9)の監視

| 種類 | 監視対象 | 監視項目 | 監視方法 (使うメトリクス項目) |
| --- | --- | --- | --- |
| Resources metrics | [Kubernetes](http://d.hatena.ne.jp/keyword/Kubernetes) worker nodes | Keepalive (Connectivity) 監視 | 従来の [VM](http://d.hatena.ne.jp/keyword/VM) 運用と同じやり方 |
| Resources metrics | [Kubernetes](http://d.hatena.ne.jp/keyword/Kubernetes) worker nodes | CPU Usage | 従来の [VM](http://d.hatena.ne.jp/keyword/VM) 運用と同じやり方 |
| Resources metrics | [Kubernetes](http://d.hatena.ne.jp/keyword/Kubernetes) worker nodes | Memory Usage | 従来の [VM](http://d.hatena.ne.jp/keyword/VM) 運用と同じやり方 |
| Resources metrics | [Kubernetes](http://d.hatena.ne.jp/keyword/Kubernetes) worker nodes | Disk Usage | 従来の [VM](http://d.hatena.ne.jp/keyword/VM) 運用と同じやり方 |

- Datadog [Dashboard](http://d.hatena.ne.jp/keyword/Dashboard) に出しておきたい項目

| 項目 | メトリクス |
| --- | --- |
| CPU core 使用率 | [kubernetes](http://d.hatena.ne.jp/keyword/kubernetes).cpu.usage.total / [kubernetes](http://d.hatena.ne.jp/keyword/kubernetes).cpu.capacity |
| Memory 使用率 | [kubernetes](http://d.hatena.ne.jp/keyword/kubernetes).memory.usage / [kubernetes](http://d.hatena.ne.jp/keyword/kubernetes).memory.capacity |
| Disk 使用率 | [kubernetes](http://d.hatena.ne.jp/keyword/kubernetes).filesystem.usage\_pct |
| CPU reqests/limits | [kubernetes](http://d.hatena.ne.jp/keyword/kubernetes).cpu.requests / [kubernetes](http://d.hatena.ne.jp/keyword/kubernetes).cpu.limits |
| Mem reqests/limits | [kubernetes](http://d.hatena.ne.jp/keyword/kubernetes).memory.requests / [kubernetes](http://d.hatena.ne.jp/keyword/kubernetes).memory.limits |

## DatadogのAgentの用意

[Monitoring Kubernetes with Datadog](https://www.datadoghq.com/blog/monitoring-kubernetes-with-datadog/)
[How to monitor Google Kubernetes Engine with Datadog](https://www.datadoghq.com/blog/monitor-google-kubernetes-engine/)

datadogの記事をみるとGKEなどのkubernatesをdatadogでモニタリングするには各ノードにdatadog-agentをdeamonsetで常駐させるのが一般的らしい。
Pod間通信でメトリクスを取ってくるようです。

以下のようなものを用意して、 `kubectl create -f datadog-agent.yaml` で当てる感じ。
datadogのkubernatesのintegrationのページにも書いてありまする。

TIPS

- DaemonSetのAPIversionは[Kubernetes](http://d.hatena.ne.jp/keyword/Kubernetes)バージョン1.9以降の場合は、`apps/v1` を使用
- `apps/v1` ではspec.selectorが必要になります。
- 他のpodからcustom metricsをDogStatsD経由で送信するため、8125/[UDP](http://d.hatena.ne.jp/keyword/UDP)をHost(ノード)に公開します
- Traceの機能も同様に他のpodから使いたいため8126/[TCP](http://d.hatena.ne.jp/keyword/TCP)をHost(ノード)に開ける。
- [API](http://d.hatena.ne.jp/keyword/API)\_KEYはSecretから取得。作成コマンドは以下参照。
- `kubectl create secret generic datadog-secret --from-literal=api_key=*****`

```
apiVersion: extensions/v1beta1 
kind: DaemonSet
metadata:
  name: datadog-agent
spec:
  selector:
    matchLabels:
      name: datadog-agent
  template:
    metadata:
      labels:
        app: datadog-agent
      name: datadog-agent
    spec:
      serviceAccountName: datadog-agent
      containers:
      - image: datadog/agent:latest
        imagePullPolicy: Always
        name: datadog-agent
        ports:
          - containerPort: 8125
            # Custom metrics via DogStatsD - uncomment this section to enable custom metrics collection
            # hostPort: 8125
            name: dogstatsdport
            protocol: UDP
          - containerPort: 8126
            # Trace Collection (APM) - uncomment this section to enable APM
            # hostPort: 8126
            name: traceport
            protocol: TCP
        env:
          - name: DD_API_KEY
            valueFrom:
              secretKeyRef:
                name: datadog-secret
                key: api-key
          - name: DD_COLLECT_KUBERNETES_EVENTS
            value: "true"
          - name: DD_LEADER_ELECTION
            value: "true"
          - name: KUBERNETES
            value: "true"
          - name: DD_KUBERNETES_KUBELET_HOST
            valueFrom:
              fieldRef:
                fieldPath: status.hostIP
          - name: DD_APM_ENABLED
            value: "true"
        resources:
          requests:
            memory: "256Mi"
            cpu: "200m"
          limits:
            memory: "256Mi"
            cpu: "200m"
        volumeMounts:
          - name: dockersocket
            mountPath: /var/run/docker.sock
          - name: procdir
            mountPath: /host/proc
            readOnly: true
          - name: cgroups
            mountPath: /host/sys/fs/cgroup
            readOnly: true
        livenessProbe:
          exec:
            command:
            - ./probe.sh
          initialDelaySeconds: 15
          periodSeconds: 5
      volumes:
        - hostPath:
            path: /var/run/docker.sock
          name: dockersocket
        - hostPath:
            path: /proc
          name: procdir
        - hostPath:
            path: /sys/fs/cgroup
          name: cgroups
```

[Kubernetes](https://docs.datadoghq.com/integrations/kubernetes/#kubernetes-state-metrics)のintegrationをみると
manifestを書いて、それに[k8s](http://d.hatena.ne.jp/keyword/k8s)[クラスタ](http://d.hatena.ne.jp/keyword/%A5%AF%A5%E9%A5%B9%A5%BF)に当てる必要がある。
manifest管理をどうするかの問題が発生するが、今回はhelmを使ってインストールをする。

## helm + helmfileを用いたdatadog-agentインストール

ますhelmとは[K8s](http://d.hatena.ne.jp/keyword/K8s)のパッケージ管理ツール。
[リポジトリ](http://d.hatena.ne.jp/keyword/%A5%EA%A5%DD%A5%B8%A5%C8%A5%EA)に登録された構成情報(Chart)を、 installコマンドに適時引数で設定情報を与え、簡単に自分の[クラスタ](http://d.hatena.ne.jp/keyword/%A5%AF%A5%E9%A5%B9%A5%BF)に導入(Release)することができる。
そして[helmfile](https://github.com/roboll/helmfile)は[k8s](http://d.hatena.ne.jp/keyword/k8s)[クラスタ](http://d.hatena.ne.jp/keyword/%A5%AF%A5%E9%A5%B9%A5%BF)のhelm releasesを管理してくれるもの。
`helmfile.yaml` にデプロイしたいhelm Chartを書いて、 `helmfile sync` を実行するとインストールやアップグレードを `gemfile` のように冪等に管理してくれるもの。

datadog-agentを[クラスタ](http://d.hatena.ne.jp/keyword/%A5%AF%A5%E9%A5%B9%A5%BF)に配置する場合は以下の[YAML](http://d.hatena.ne.jp/keyword/YAML)を書くだけ。

- [datadogのhelm chart](https://github.com/helm/charts/tree/master/stable/datadog)
- `prd.values.yaml` にdatadog-[api](http://d.hatena.ne.jp/keyword/api)キーを入れて読み込ませる

```
releases:
  - name: datadog
    namespace: kube-system
    chart: stable/datadog
    version: 1.27.2
    values:
      - ./datadog/prd.values.yaml
```

## Circle CIでhelmインストールする

GKEなので、kubectl,helm,helmfileをインストールして、
gcloudコマンドでログインして、[クラスタ](http://d.hatena.ne.jp/keyword/%A5%AF%A5%E9%A5%B9%A5%BF)のクレデンシャルとって、helmを当てていく流れ。

以下はCircle CI側の[環境変数](http://d.hatena.ne.jp/keyword/%B4%C4%B6%AD%CA%D1%BF%F4)に入れておく。

- `COOGLE_CLOUD_REGION`
- `GCLOUD_SERVICE_KEY`
- `GOOGLE_PROJECT_ID`

```
version: 2

defaults: &defaults
  working_directory: ~/hogehoge
  docker:
    - image: google/cloud-sdk:242.0.0-slim

global_env: &global_env
  GOOGLE_PROJECT_ID: hogehoge
  COOGLE_CLOUD_REGION: asia-northeast1
  K8S_CLUSTER: hogehoge

common_steps:
  install_base_packages: &install_base_packages
    command: apt-get update && apt-get install wget kubectl
  install_helm: &install_helm
    name: install helm
    command: |
      # install helm
      wget https://storage.googleapis.com/kubernetes-helm/helm-v2.13.1-linux-amd64.tar.gz
      tar zxvf helm-v2.13.1-linux-amd64.tar.gz
      mv ./linux-amd64/helm /usr/local/bin/helm
      helm init --client-only
      helm plugin install https://github.com/databus23/helm-diff

      # install helmfile
      wget https://github.com/roboll/helmfile/releases/download/v0.54.2/helmfile_linux_amd64
      chmod +x ./helmfile_linux_amd64
      mv ./helmfile_linux_amd64 /usr/local/bin/helmfile
    gcloud_login: &gcloud_login
      name: gcloud login
      command: |
        echo ${GCLOUD_SERVICE_KEY} | base64 -d | gcloud auth activate-service-account --key-file=-
        gcloud --quiet config set project ${GOOGLE_PROJECT_ID}
    setup_cluster_and_helm: &setup_cluster_and_helm
      name: setup cluster credential and helm environment
      command: |
        gcloud beta container clusters get-credentials ${K8S_CLUSTER} --region ${COOGLE_CLOUD_REGION} --project ${GOOGLE_PROJECT_ID}
        helm repo update

jobs:
  helmfile-sync-dry-run:
    <<: *defaults
    environment:
      <<: *global_env
    steps:
      - checkout
      - run: *install_base_packages
      - run: *install_helm
      - run: *gcloud_login
      - run: *setup_cluster_and_helm
      - run:
          name: helmfile diff
          command: helmfile --file prd.helmfile.yaml diff
      - run:
          name: helmfile sync dry-run
          command: helmfile --file prd.helmfile.yaml sync --args --dry-run
  helmfile-sync:
    <<: *defaults
    environment:
      <<: *global_env
    steps:
      - checkout
      - run: *install_base_packages
      - run: *install_helm
      - run: *gcloud_login
      - run: *setup_cluster_and_helm
      - run:
          name: helmfile sync
          command: |
            helmfile --file prd.helmfile.yaml sync

workflows:
  version: 2
  dry-run-and-sync:
    jobs:
      - helmfile-sync-dry-run:
          filters:
            branches:
              only: /.*/
      - helmfile-sync:
          requires:
            - helmfile-sync-dry-run
          filters:
            branches:
              only: master
```

- サービスアカウントを使用してアクセス承認
  - `gcloud auth activate-service-account` が正常に完了すると、`gcloud init` や `gcloud auth login` と同様に、サービスアカウントの認証情報がローカルシステムに保存され、指定したアカウントがCloudSDKの構成のアクティブなアカウントに設定される。
  - [サービスアカウント](https://cloud.google.com/sdk/docs/authorizing?hl=ja#authorizing_with_a_service_account)は事前に作成しておく(Datadogの[GCP](http://d.hatena.ne.jp/keyword/GCP)のintegrationするときに必要になる。)
  - `--key-file=-` で `-` を渡すことで標準入力でキーを渡すことができる
- `gcloud` [コマンドライン](http://d.hatena.ne.jp/keyword/%A5%B3%A5%DE%A5%F3%A5%C9%A5%E9%A5%A4%A5%F3) ツールでアクティブなプロジェクトを設定
  - `gcloud --quiet config set project ${GOOGLE_PROJECT_ID}`
  - `gcloud` は対話型インターフェースなので、自動化には邪魔なので、[プロンプトの無効化](https://cloud.google.com/sdk/docs/scripting-gcloud?hl=ja)を `--quiet` でする。 `--quiet` フラグは先頭の項目の右側に挿入する。
- [クラスタ](http://d.hatena.ne.jp/keyword/%A5%AF%A5%E9%A5%B9%A5%BF)の認証情報を取得する
  - `gcloud beta container clusters get-credentials [CLUSTER_NAME] [--internal-ip] [--region=REGION | --zone=ZONE, -z ZONE] [GCLOUD_WIDE_FLAG …]` で[クラスタ](http://d.hatena.ne.jp/keyword/%A5%AF%A5%E9%A5%B9%A5%BF)に対して認証を行う。
  - [gcloud beta container clusters get-credentialsとは](https://cloud.google.com/sdk/gcloud/reference/beta/container/clusters/get-credentials)
- Helm [CLI](http://d.hatena.ne.jp/keyword/CLI) を初期設定
  - `helm init --client-only`　ちなみにインターネット環境がない場合は `--skip-refresh`
- helmクライアント側でキャッシュしているので、最新の[リポジトリ](http://d.hatena.ne.jp/keyword/%A5%EA%A5%DD%A5%B8%A5%C8%A5%EA)内の情報を得るために `helm repo update` を実行して、再取得することでキャッシュをリフレッシュさせる。
- `helm diff` でreleasesのdiffをとる
  - `helmfile diff` サブコマンドは、[マニフェスト](http://d.hatena.ne.jp/keyword/%A5%DE%A5%CB%A5%D5%A5%A7%A5%B9%A5%C8)で定義されているすべての `charts/releases` にわたってhelm-diff[プラグイン](http://d.hatena.ne.jp/keyword/%A5%D7%A5%E9%A5%B0%A5%A4%A5%F3)を実行。
  - `helmfile --file prd.helmfile.yaml diff`
  - 使うには [helm-diffパッケージが必要。](https://github.com/databus23/helm-diff)
- `helmfile --file prd.helmfile.yaml sync --args --dry-run`
  - Helmfileは実行中にさまざまなイベントをトリガーとする。 イベントが発生すると、argsを指定してコマンドを実行することで、関連するフックが実行される。
- `helmfile --file prd.helmfile.yaml sync`
  - helmfile syncサブコマンドは、helmfileの説明に従って[クラスタ](http://d.hatena.ne.jp/keyword/%A5%AF%A5%E9%A5%B9%A5%BF)の状態を同期する。 デフォルトのhelmfileはhelmfile.[yaml](http://d.hatena.ne.jp/keyword/yaml)。任意の[yaml](http://d.hatena.ne.jp/keyword/yaml)ファイルを `--file path/to/your/yaml/file` フラグを指定することで渡すことができる。
  - helmfileは[マニフェスト](http://d.hatena.ne.jp/keyword/%A5%DE%A5%CB%A5%D5%A5%A7%A5%B9%A5%C8)で宣言されたreleaseごとに `helm upgrade --install` を実行。必要に応じて、secretsを復号化してhelmチャートの値として使用する。 また、指定されたチャー[トリポジ](http://d.hatena.ne.jp/keyword/%A5%C8%A5%EA%A5%DD%A5%B8)トリを更新し、参照されているローカルチャートの依存関係も更新する。
  - `helm upgrade --install` は releaseが存在するかどうかに応じてインストールまたはアップグレードすることができる。

これで、helmで Datadog agent のインストールができる。また、何かhelmで追加したくなったらhelmfileに書いていくことになる。

# 気になりンゴ

`--dry-run` は実はまだ機能追加されてない?helpに特に出てこない。
`--args` でhookさせているけど、helmfileにhookさせるものをかかないとhookされないのかな

```
releases:
- name: myapp
  chart: mychart
  # *snip*
  hooks:
  - events: ["prepare", "cleanup"]
    command: "echo"
    args: ["{{`{{.Environment.Name}}`}}", "{{`{{.Release.Name}}`}}", "{{`{{.HelmfileCommand}}`}}\
"]
```
