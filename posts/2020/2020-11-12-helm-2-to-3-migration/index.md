---
title: "helm2to3"
date: "2020-11-12"
---

# これはなに

helm v2からv3にマイグレするやつです。
[v2のサポート期間は2020年11月13日まで](https://helm.sh/blog/helm-v2-deprecation-timeline/)なので即対応必須奴。

Helmの新しいメジャーリリースへのアップグレードで最も重要な部分の1つは、データの移行で、やるには[helm-2to3プラグイン](https://github.com/helm/helm-2to3)をつかうのがよい。

この[プラグイン](http://d.hatena.ne.jp/keyword/%A5%D7%A5%E9%A5%B0%A5%A4%A5%F3)は、以下をしてくれる奴

- Helm v2の設定の移行
- Helm v2リリースの移行
- Helm v2の設定、リリースデータ、Tillerのデプロイメントのクリーンアップ。

# やることリスト

- [ ] helm3のインストール
- [ ] helm2to3 pluginのインストール
- [ ] v2のデータをバックアップ
- [ ] Helm v2の設定を移行
- [ ] Helm v2のReleaseを移行
- [ ] Helm v2データをクリーンアップ(Helm v3が期待通りにHelm v2データを管理していることを確認してから)
- [ ] cicd周りの修正
- [ ] terraformとかで[k8s](http://d.hatena.ne.jp/keyword/k8s)[クラスタ](http://d.hatena.ne.jp/keyword/%A5%AF%A5%E9%A5%B9%A5%BF)ーでtillerとか入れてたら削除
- [ ] helm-diff使ってたら最新にあげたほうがいいです。

# 事前準備

### Helm v2と v3 のclientのセットアップ

以下の例みたいにv2とv3の[CLI](http://d.hatena.ne.jp/keyword/CLI)を用意

- [brew](http://d.hatena.ne.jp/keyword/brew)で入れたhelm3.3.0（2020/11/12現在は3.4.0が最新）
  - helm (pathが通っている)
- バイナリでいれたhelm2.14.2
  - /Users/[hoge](http://d.hatena.ne.jp/keyword/hoge)/Downloads/[darwin](http://d.hatena.ne.jp/keyword/darwin)-[amd64](http://d.hatena.ne.jp/keyword/amd64)/helm (path指定)

```
$ helm version
version.BuildInfo{Version:"v3.3.0",GoVersion:"go1.14.6"}

$ helm version
Client: &version.Version{SemVer:"v2.14.2"}
Server: &version.Version{SemVer:"v2.14.2"}
```

### helm-2to3 [プラグイン](http://d.hatena.ne.jp/keyword/%A5%D7%A5%E9%A5%B0%A5%A4%A5%F3)

現在[プラグイン](http://d.hatena.ne.jp/keyword/%A5%D7%A5%E9%A5%B0%A5%A4%A5%F3)では以下のことができる。

- Helm v2設定の移行
- Helm v2リリースの移行
- Helm v2の設定、リリースデータ、Tillerの配置のクリーンアップ

```
$ helm 2to3 version
Migrate and Cleanup Helm v2 configuration and releases in-place to Helm v3
```

# v2のデータをバックアップと差し戻し手順

Tiller はリリース情報などをすべて [Kubernetes](http://d.hatena.ne.jp/keyword/Kubernetes) ConfigMap オブジェクトに保存しているので、これをバックアップしておけばv2に差し戻しが可能。
あとhelm v2のコマンドとフォルダを保存しておく。

1. 一覧を出す
   これらの最新のconfigをバックアップしていく。

```
$ kubectl get configmap -n kube-system -l "OWNER=TILLER" |cut -d. -f1 |uniq -c|awk '{print $2}'
NAME
hoge-namespace
```

1. 最新のconfigmapを保存しておく

```
kubectl get configmap -n kube-system -o yaml hogehoge-app.v17 > hogehoge-app.v17.yaml
```

差し戻しのapplyは以下コマンドのを適宜変更して使う。

```
 kubectl apply -f hogehoge-app.v17.yaml -n kube-system
```

# 手順

### Helm v2の設定を移行する(localなので不要なら実行しなくてもOK)

まずはHelm v2の設定フォルダとデータフォルダを移行します。
以下を移行する。

- Chart starters
- Repositories
- Plugins

まずは --dry-run をする。

```
$ helm 2to3 move config --dry-run
```

実際に移行

```
$ helm 2to3 move config

WARNING: Helm v3 configuration maybe overwritten during this operation.

[Move Config/confirm] Are you sure you want to move the v2 configration? [y/N]: y

2019/11/14 14:55:00 Helm v2 configuration will be moved to Helm v3 configration.
...
2019/11/14 14:55:00 Helm v2 configuration was moved successfully to Helm v3 configration.
```

helm v3 のrepo listを実行して確認

```
$ helm repo list

NAME        URL
stable      <https://kubernetes-charts.storage.googleapis.com>
jfrog       <https://charts.jfrog.io>
rimusz      <https://charts.rimusz.net>
buildkite   <https://buildkite.github.io/charts>
jetstack    <https://charts.jetstack.io>
odavid      <https://odavid.github.io/k8s-helm-charts>
elastic     <https://helm.elastic.co>
appscode    <https://charts.appscode.com/stable>

$ helm plugin list

NAME    VERSION DESCRIPTION
2to3    0.1.0   migrate Helm v2 configuration and releases in-place to Helm v3
edit    0.3.0   Edit a release.
gcs     0.2.0   Provides Google Cloud Storage protocol support.
                <https://github.com/vigles>...
linter  0.1.1   Helm plugin to find hardcoded passwords in values.yaml files
monitor 0.3.0   Query at a given interval a Prometheus, ElasticSearch or Sentry instance...
```

Helm v2 と同じ Helm [リポジトリ](http://d.hatena.ne.jp/keyword/%A5%EA%A5%DD%A5%B8%A5%C8%A5%EA)と[プラグイン](http://d.hatena.ne.jp/keyword/%A5%D7%A5%E9%A5%B0%A5%A4%A5%F3)が使えるようになっていればOK.

※ Helm v2の[プラグイン](http://d.hatena.ne.jp/keyword/%A5%D7%A5%E9%A5%B0%A5%A4%A5%F3)がすべてHelm v3で正常に動作することを確認し、動作しない[プラグイン](http://d.hatena.ne.jp/keyword/%A5%D7%A5%E9%A5%B0%A5%A4%A5%F3)は削除すること。
move configは、Helm v3のconfigとdataフォルダが存在しない場合は作成し、存在する場合はrepositories.[yaml](http://d.hatena.ne.jp/keyword/yaml)ファイルを上書きする。

この[プラグイン](http://d.hatena.ne.jp/keyword/%A5%D7%A5%E9%A5%B0%A5%A4%A5%F3)は、デフォルトではないHelm v2 homeとHelm v3の設定とデータフォルダもサポートする。

```
$ export HELM_V2_HOME=$HOME/.helm2
$ export HELM_V3_CONFIG=$HOME/.helm3
$ export HELM_V3_DATA=$PWD/.helm3
$ helm3 2to3 move config
```

### Helm v2 リリースの移行

リリースの移行を開始する準備ができたので移行テスト。

listで対象を確認

```
$ helm list
```

まずは --dry-run

```
$ helm 2to3 convert --dry-run hoge-realease
```

では、実際に移行を実行してみましょう。

```
$ helm 2to3 convert hoge-realease
```

一撃[ワンライナー](http://d.hatena.ne.jp/keyword/%A5%EF%A5%F3%A5%E9%A5%A4%A5%CA%A1%BC)

```
~/bin/helm2/helm ls --output json | jq -r '.Releases[] | select(.Namespace != "default" and .Namespace != "hoge-namespace") | .Name' | xargs -t -I {} helm 2to3 convert {}
```

移行が成功したかどうかをチェックしてみましょう。
v2とv3でlistで確認

```
(v2) helm list

$ helm list -n hoge_namespaces
```

※ --delete-v2-releasesフラグを指定していないので、Helm v2 のリリース情報がそのまま残るが、
後からhelmの2to3クリーンアップで削除することができる。

すべてのリリースを移動する準備ができたら、hellmリストをループで実行し、hellm v2の各リリースに対してhellm 2to3の変換RELEASEを適用することで、
自動化することができる。

### Helm v2データのクリーンアップ

最後のステップは、古いデータのクリーンアップ。
以下がクリーンアップされる

- Configuration (Helm home directory)
- v2 release data
- Tiller deployment

まずは --dry-run

どのリリースが削除されるか、kube-system[名前空間](http://d.hatena.ne.jp/keyword/%CC%BE%C1%B0%B6%F5%B4%D6)からTillerサービスが削除されるか、Helm v2の[ホームフォルダ](http://d.hatena.ne.jp/keyword/%A5%DB%A1%BC%A5%E0%A5%D5%A5%A9%A5%EB%A5%C0)が削除されるかが表示される。

```
$ helm 2to3 cleanup --dry-run

2019/11/14 15:06:59 NOTE: This is in dry-run mode, the following actions will not be executed.
2019/11/14 15:06:59 Run without --dry-run to take the actions described below:
2019/11/14 15:06:59
WARNING: "Helm v2 Configuration" "Release Data" "Release Data" will be removed.
This will clean up all releases managed by Helm v2. It will not be possible to restore them if you haven't made a backup of the releases.
Helm v2 may not be usable afterwards.

[Cleanup/confirm] Are you sure you want to cleanup Helm v2 data? [y/N]: y
2019/11/14 15:07:01
Helm v2 data will be cleaned up.
2019/11/14 15:07:01 [Helm 2] Releases will be deleted.
2019/11/14 15:07:01 [Helm 2] ReleaseVersion "postgres.v1" will be deleted.
2019/11/14 15:07:01 [Helm 2] ReleaseVersion "redis.v1" will be deleted.
2019/11/14 15:07:01 [Helm 2] Home folder "/Users/rimasm/.helm" will be deleted.
```

Hem v2 のデータをクリーンアップする準備ができたら、--dry-run フラグを指定せずにコマンドを実行。

```
$ helm 2to3 cleanup --dry-run
```

# ci/cd周りの修正

helmとかもろもろversion upする

# terraformの修正

helmのupgradeとtillerの削除
ここらへん↓を修正

<https://ghe.ca-tools.org/odessa/infrastructure/blob/394cc738b716d2d6b332d8b2ff6065f9a762f2bc/gcp/env/common/gke/locals.tf#L2-L96>

## helm-diff[プラグイン](http://d.hatena.ne.jp/keyword/%A5%D7%A5%E9%A5%B0%A5%A4%A5%F3)のupgrade

installシェルでhelm homeというコマンドが使われているけど、helm v3ではhelm homeが消えてインストールできなかったが、helm-diffのバージョンを最新にしたところインストールできました。

# 参考

[How to migrate from Helm v2 to Helm v3](https://helm.sh/blog/migrate-from-helm-v2-to-helm-v3/)[helm-2to3プラグイン](https://github.com/helm/helm-2to3)[helm v3.3.0](https://github.com/helm/helm/releases/tag/v3.3.0)[helm2からhelm3に(削除履歴も含めて)マイグレーションできるのか試してみた](https://qiita.com/khrd/items/da22f3e69c894b3af9b5)[Helm\_v2->v3\_移行](https://scrapbox.io/tkms0106/Helm_v2-%3Ev3_%E7%A7%BB%E8%A1%8C)[How Helm Uses ConfigMaps to Store Data](https://www.notion.so/cyberagent/technosophos.com/2017/03/23/how-helm-uses-configmaps-to-store-data.html)[helm2からhelm3に(削除履歴も含めて)マイグレーションできるのか試してみた](https://qiita.com/khrd/items/da22f3e69c894b3af9b5)
