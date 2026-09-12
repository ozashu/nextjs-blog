---
title: "  JAPAN CONTAINER DAYS V18.04に行ってきた"
date: "2018-04-19"
---

<https://medium.com/@yukotan/japan-container-days-v18-04-%E3%81%AE%E8%B3%87%E6%96%99-4f380fb7b696>

# [サイバーエージェント](http://d.hatena.ne.jp/keyword/%A5%B5%A5%A4%A5%D0%A1%BC%A5%A8%A1%BC%A5%B8%A5%A7%A5%F3%A5%C8)におけるプライベートコンテナ基盤AKEを支える技術

<https://speakerdeck.com/masayaaoyama/saibaezientoniokerupuraibetokontenaji-pan-akewozhi-eruji-shu>

## アドテクで求められる性能要件

- Low Latency
- High Traffic
- High Computing

## 環境

AKEとよばれるプライベート基盤(オンプレ)

## AKEとは

コンテナが流行り始めた2016年ごろにスタート。
ソースを読んで理解を深め、2017年04月ごろにリリース。
2017年07付きにk8s1.7がプロダクションでサポート。
type loadbalanceをサポート。
プロダクション環境にAKEをリリース。
コンテナ環境に合わせたCICD環境を作り上げると効率が上がる。

コマンドで[クラスタ](http://d.hatena.ne.jp/keyword/%A5%AF%A5%E9%A5%B9%A5%BF)が作れる。
Heatとういう機能をつかって構築している。

## 一連の流れ

パッチを当てたK8sをbuildしOSimageをつくり、Opencluster Heatで自動構築して、E2E Testを実行する。
テストで使用しているもの
<https://github.com/heptio/sonobuoy>

## Key Features

- K8sとSwarms support
- openstackと統合
  - Heatで構築、CinderをPV、Designateで名前解決、Keystoneで認証する。
  - MagnumはL3ネットワークを使わなければいけないので、開発が遅い。細かい設定ができない。
  - Rancher 2.0はGAが5月だった。細かい設定ができない。
  - Tectonicは[知名度](http://d.hatena.ne.jp/keyword/%C3%CE%CC%BE%C5%D9)が低くかった。細かい設定ができない。
- L4/L7[ロードバランサー](http://d.hatena.ne.jp/keyword/%A5%ED%A1%BC%A5%C9%A5%D0%A5%E9%A5%F3%A5%B5%A1%BC)を用意
  - NodePort + 手動LBだとノードのスケールしたり、LoadBalancerの操作が必要で大変。
  - type: LoadBalancerはCloud Provider Integrationで実装、OpenStackではOctaviaが使える。
  - Octaviaは性能不足なのでBaremetal LBと連携するようなCloudProviderを実装した。
  - [ingress](http://d.hatena.ne.jp/keyword/ingress)は面倒
- monitoring log
  - addonを追加することで後から利便性を高めることができる。
  - addonとしてEFKstack、Datadog、helmなどがある。
- Tuning
  - アドテクのシステムに合わせてチューニング
  - Network,Kernel,K8s,Hypervisor
- Multi Countainer の実行サポート
  - k8sだけではなく、Docker Swamも対応

## 利点

自分たちでコンテナ基盤をつくれば、なんでも作れて触れて最高
ハイブリット[クラウド](http://d.hatena.ne.jp/keyword/%A5%AF%A5%E9%A5%A6%A5%C9)構成
マルチコンテナランタイム対応

## デメリット

実装コスト、運用コスト

# マイクロサービスアプリケーションとしての[機械学習](http://d.hatena.ne.jp/keyword/%B5%A1%B3%A3%B3%D8%BD%AC)

[機械学習](http://d.hatena.ne.jp/keyword/%B5%A1%B3%A3%B3%D8%BD%AC)、[人工知能](http://d.hatena.ne.jp/keyword/%BF%CD%B9%A9%C3%CE%C7%BD)分野のブームがきている。
この分野では人材不足、獲得合戦だが、
今の学生は優秀なので数年後には解消されていそうとのこと。

## [機械学習](http://d.hatena.ne.jp/keyword/%B5%A1%B3%A3%B3%D8%BD%AC)をアプリケーションで利用する

処理時間、サーバコストも高い
コードと学習モデルの整合性が難しい
学習環境の用意も必要
[機械学習](http://d.hatena.ne.jp/keyword/%B5%A1%B3%A3%B3%D8%BD%AC)エンジニアの担当領域が不明
[機械学習](http://d.hatena.ne.jp/keyword/%B5%A1%B3%A3%B3%D8%BD%AC)エンジニアは[モデリング](http://d.hatena.ne.jp/keyword/%A5%E2%A5%C7%A5%EA%A5%F3%A5%B0)などが得意だけど、システム設計とか[API](http://d.hatena.ne.jp/keyword/API)提供などはメインじゃない

## コストの高い要求をした時のメルカリのSREチームの解凍

メルカリのSREチーム「Dockerfile用意してください。なんとかします」

## はじめてのDockerfile

ビルド時にキャッシュがある。
キャッシュを意識した順序で書く。

一週間後、S3に画像が入っているので、[GCP](http://d.hatena.ne.jp/keyword/GCP)のk8sという構成。
Datadogでのモニタリング、Spinnakerでのデプロイリリース管理

<http://techlife.cookpad.com/entry/2015/09/16/182917>

## はじめてのSpinnaker

[GUI](http://d.hatena.ne.jp/keyword/GUI)で操作できる。
自動deploy,immutableである。
<http://tech.mercari.com/entry/2017/08/21/092743>
<http://tech.mercari.com/entry/2017/12/17/205719>
<http://tech.mercari.com/entry/2017/12/02/093000>

1週間でできた理由は，モノリシック[アーキテクチャ](http://d.hatena.ne.jp/keyword/%A5%A2%A1%BC%A5%AD%A5%C6%A5%AF%A5%C1%A5%E3)からマイクロサービスに変わっていたことで，[疎結合](http://d.hatena.ne.jp/keyword/%C1%C2%B7%EB%B9%E7)な作りになっていたから．
これにとり，異なる機能を影響なく短期間でリリースできるようになった。
基本機能は Monolithic のまま、新機能や大幅な変更が伴う機能は Microservice可。

[機械学習](http://d.hatena.ne.jp/keyword/%B5%A1%B3%A3%B3%D8%BD%AC)では汎用的につくるのは難しい。

キモになる[機械学習](http://d.hatena.ne.jp/keyword/%B5%A1%B3%A3%B3%D8%BD%AC)の更新は，手動更新を都度SREに依頼していた．後から気づいたことだが，
コードとモデルは密結合なため，整合性が保たれていないと動かない．複数のモデルをサポートし始めたら，自分の運用が破綻するのは目に見え始めていた。
マイクロサービスにしたメリットは[機械学習](http://d.hatena.ne.jp/keyword/%B5%A1%B3%A3%B3%D8%BD%AC)モデルのサービスの組み込みが早い。
影響範囲が明確，改善の見込みがあれば早期のモデルデプロイ→気モデルの軽量化チューニングという投機的デプロイもできる。
[機械学習](http://d.hatena.ne.jp/keyword/%B5%A1%B3%A3%B3%D8%BD%AC)エンジニアからすると，最大限の成果を上げるためには[モデリング](http://d.hatena.ne.jp/keyword/%A5%E2%A5%C7%A5%EA%A5%F3%A5%B0)への注力が大事。
とはいえ、運用は無視できないので、[モデリング](http://d.hatena.ne.jp/keyword/%A5%E2%A5%C7%A5%EA%A5%F3%A5%B0)と運用を分けたチームで運用する予定。
サービス関連系のオーバーヘッドも実は無視できない。

マイクロサービス化、依存パッケージとかを自由に使えるようになるのでいいけど、汎用イメージをつくるのはよくない。

PersistentVolumeでデータをBlueGreenデプロイする。

[機械学習](http://d.hatena.ne.jp/keyword/%B5%A1%B3%A3%B3%D8%BD%AC)のモデルを頻繁に更新するのでコンテナーにしてマイクロサービスにすると相性がよい。

## まとめ

[機械学習](http://d.hatena.ne.jp/keyword/%B5%A1%B3%A3%B3%D8%BD%AC)エンジニアの立場からマイクロサービスは相性がいい。

- 影響範囲がわかりやすい
- [アルゴリズム](http://d.hatena.ne.jp/keyword/%A5%A2%A5%EB%A5%B4%A5%EA%A5%BA%A5%E0)選択の自由度が高い
- サービスの組み込みが早い

[機械学習](http://d.hatena.ne.jp/keyword/%B5%A1%B3%A3%B3%D8%BD%AC)とMicroservicesとの親和性は高いがMicroservicesの雛形や指針があり、[機械学習](http://d.hatena.ne.jp/keyword/%B5%A1%B3%A3%B3%D8%BD%AC)のシステムの専属のチームがあるとよい。

# [Yahoo!](http://d.hatena.ne.jp/keyword/Yahoo%21)JapanのK8s as a Serviceで加速するアプリケーション開発

<https://www.slideshare.net/techblogyahoo/yahoo-japan-kubernetesasaservice>

[Yahoo!](http://d.hatena.ne.jp/keyword/Yahoo%21)ズバトクonk8s

## サービス内容

くじが当たるキャンペーンプラットフォーム

技術スタックIaaS上の[VM](http://d.hatena.ne.jp/keyword/VM)に社内独自パケージシステムと[PHP](http://d.hatena.ne.jp/keyword/PHP)から構成．
キャンペーン中の数10倍に跳ね上がる[トラフィック](http://d.hatena.ne.jp/keyword/%A5%C8%A5%E9%A5%D5%A5%A3%A5%C3%A5%AF)は，[VM](http://d.hatena.ne.jp/keyword/VM)で捌くのが大変．CI/CD周りが自動化されていないので，
リリースが遅い．パフォーマンステスト環境の整備が難しいなどの問題があった．

Yahoo ズバトクというサービスの基盤をkubernetesにした。
Zlabと協力してスタックをモダン化．OpenStackの上にk8s,Docker,ConcourseCIが,アプリも[Java](http://d.hatena.ne.jp/keyword/Java)で作り変えた

## 開発フローもモダン化

dev/[stg](http://d.hatena.ne.jp/keyword/stg)/proの3環境にデプロイするまで,GitHubgのPR,Jenkins・独自ツールでビルド・構築していたのが、
[Github](http://d.hatena.ne.jp/keyword/Github)とConcurseが全てテスト/ビルド/デプロイが走る統合型に変わって便利になった。
リリースに掛かる時間も数時間から10分程度に変わった。

障害発生時の対応も変わった。
IaaSのHyperVisorが落ちたら、その上で動く[VM](http://d.hatena.ne.jp/keyword/VM)を退避→サーバ稼働再開という流れ
k8sを入れるとHyperVisorダウンをトリガにオートヒーリングで自動的にサービスが継続できる。
障害調査も分散環境のログ取得から，ログは1箇所で見れば良くなった。
今まではサーバーログを集めて調査してたが次はk8s側の機能でログを集約、splunkを使っている。

## 移行コストの話

内製プラットフォーム側の追加対応・CI/CD、言語のスイッチ、考え方や設計方針もk8s化する必要があった。
具体的には[クラウド](http://d.hatena.ne.jp/keyword/%A5%AF%A5%E9%A5%A6%A5%C9)ネイティブ化。
これはZlabの協力を得て，考え方を変えた。
まだ移行の課題はあって。既存の設計をもう少し[クラウド](http://d.hatena.ne.jp/keyword/%A5%AF%A5%E9%A5%A6%A5%C9)ネイティブ化するための設計変更などもある。
今後はリリースまでの時間をもっと短くしたい。

# [Yahoo!](http://d.hatena.ne.jp/keyword/Yahoo%21)JapanのK8s as a Service

Zlabは株式会社．ヤフージャパンの100％子会社．インフラ基盤技術の調査・研究開発。

## Kaas

k8s[クラスタ](http://d.hatena.ne.jp/keyword/%A5%AF%A5%E9%A5%B9%A5%BF)の作成、削除、アップグレードを簡単値行える

- セルフサービス
- マネージド
- スケーラブル

## 障害や問題のあるノードの修復(セルフヒーリング)

ノードAが壊れたら、削除して、新規のノードを自動作成し、[クラスタ](http://d.hatena.ne.jp/keyword/%A5%AF%A5%E9%A5%B9%A5%BF)を一定に保つ。

## ゼロダウンタイムのアップグレード

利用可能なノード数を一定に保つことでサービス断なしに達成・
全ノードの更新が必要な[脆弱性](http://d.hatena.ne.jp/keyword/%C0%C8%BC%E5%C0%AD)対応にも即座に自動で対応できる。

## [クラスタ](http://d.hatena.ne.jp/keyword/%A5%AF%A5%E9%A5%B9%A5%BF)アドオン

[クラスタ](http://d.hatena.ne.jp/keyword/%A5%AF%A5%E9%A5%B9%A5%BF)でサポートするアドオン:Ingres Controller、[Ingress](http://d.hatena.ne.jp/keyword/Ingress)ホストの自動登録。
Prometeus/Grafanaと[ダッシュ](http://d.hatena.ne.jp/keyword/%A5%C0%A5%C3%A5%B7%A5%E5)ボードで分かりやすく

## Kaasの価値

煩雑なk8sのオペレーションから運用者を解放

- [クラスタ](http://d.hatena.ne.jp/keyword/%A5%AF%A5%E9%A5%B9%A5%BF)の作成、削除、設定変更
- ノード(VN)の追加、削除

これらは人間のやる仕事じゃないのでソフトウェア+Kaasにやらせる。
AUTOMATE ALL THE THINGS!!

## KaaSの要件

数万台でも動くスケーラビリティ、非同期で処理できるモデル、処理が失敗しても再開できる・一部の破壊が全体の障害に影響を与えない堅牢性。

- スケーラブル
- 非同期モデル
- 堅牢性
  - 処理が失敗しても再開できる

複雑な分散システムとして実装する必要があるが、近くに優れた分散システムの基盤があることに気づく。

KaaSは何を元に作っているのか．分散システム基盤としてのk8sに対して[拡張機能](http://d.hatena.ne.jp/keyword/%B3%C8%C4%A5%B5%A1%C7%BD)を追加することで対応。
もともとのk8s自体が分散処理で動くように作り込まれているから
k8sの[拡張機能](http://d.hatena.ne.jp/keyword/%B3%C8%C4%A5%B5%A1%C7%BD)とすることで、付加価値が生まれる箇所のロジックに集中して開発ができている

## 分散システム基盤としてのk8s

kaas on k8s

母体のk8sで便利なもの．CustomResourceDeginitions。k8sAPIを拡張して，任意のリソースを追加できる。(エンドポイント，[Watch](http://d.hatena.ne.jp/keyword/Watch) [API](http://d.hatena.ne.jp/keyword/API)など)
CRDを書いただけではなにもおきないのでコントローラを書く。
callbackとworkerを書けばOK。
カスタムコントローラの実装ができる。
これはControllerという形で[フレームワーク](http://d.hatena.ne.jp/keyword/%A5%D5%A5%EC%A1%BC%A5%E0%A5%EF%A1%BC%A5%AF)が用意されていて、実装者はコールバックだけを[フレームワーク](http://d.hatena.ne.jp/keyword/%A5%D5%A5%EC%A1%BC%A5%E0%A5%EF%A1%BC%A5%AF)に登録すれば良い。
カスタムリソースとカスタムコントローラのパターンで開発している

# K8sのセキュリティのベストプラクティス

<https://speakerdeck.com/ianlewis/kubernetesfalsesekiyuriteifalsebesutopurakuteisu>

Ian Lwwis

k8sはインフラの提供をしてくれる

Guestbookアプリで説明
- WebFronted
- web app
- Message
- メッセージを保存閲覧
- NGWord
- [NGワード](http://d.hatena.ne.jp/keyword/NG%A5%EF%A1%BC%A5%C9)を検出

k8s [API](http://d.hatena.ne.jp/keyword/API)

1. Frontend Podから[トーク](http://d.hatena.ne.jp/keyword/%A5%C8%A1%BC%A5%AF)ン取得
2. [トーク](http://d.hatena.ne.jp/keyword/%A5%C8%A1%BC%A5%AF)ン取得し、[API](http://d.hatena.ne.jp/keyword/API)サーバを攻撃
3. シークレットなどを取得し、さらにサービスを攻撃

## Mitigate 1 & 2:RBAC

RBAC(Role Based [Access](http://d.hatena.ne.jp/keyword/Access) Control)をきちんと設定しよう！

RBACは1.6から標準

Role Based [Access](http://d.hatena.ne.jp/keyword/Access) Control
ユーザやサーボすアカウントへロールを付与
ロールが権限を持つ
get secrets
tipdate configmap
etc
RBACはネームスペース展開
GKEではIAMと連携

## Mitigate 2:[API](http://d.hatena.ne.jp/keyword/API) Sercer Firewall

[API](http://d.hatena.ne.jp/keyword/API) Server Firewallで[API](http://d.hatena.ne.jp/keyword/API)サーバーへのアクセスにIP制限かけよう！(Backend network側しかアクセスさせないようにする)

[API](http://d.hatena.ne.jp/keyword/API)サーバへのアクセスを[IPアドレス](http://d.hatena.ne.jp/keyword/IP%A5%A2%A5%C9%A5%EC%A5%B9)に制限
GKE なら1コマンドでできる

## Mitigate 3:Network Policy

Network Policyで、DBやRedisなどKVSへのアクセスは必要なPodだけに制限しよう！
`telnet redis port番号` とかで接続できてしまう。
データベースへのアクセスを必要のあるPodに制限
ラブル[セレクタ](http://d.hatena.ne.jp/keyword/%A5%BB%A5%EC%A5%AF%A5%BF)ーでPodを洗濯
ネットワーク[プラグイン](http://d.hatena.ne.jp/keyword/%A5%D7%A5%E9%A5%B0%A5%A4%A5%F3)で実装されている Calico, Weave,etc

[ingress](http://d.hatena.ne.jp/keyword/ingress)で設定したものしかportにアクセスできない。

## ホストへアクセス

1. コンテナ外へ突破
2. kubeletを攻撃(権限や情報にアクセスされるなど)
3. 同じホストに実行中のコンテナを攻撃

## Mitigate1 :non-rootユーザで実行

コンテナをrootで実行すると色々できちゃうからroot意外のユーザーで実行する
コンテナで別ユーザを実行すると、ホストのユーザがとれていない状態になる。
spec: securityContext: runAsUserでユーザを指定できる

runAsUser:1000

## Mitigate1 :読み込みせんよう[ファイルシステム](http://d.hatena.ne.jp/keyword/%A5%D5%A5%A1%A5%A4%A5%EB%A5%B7%A5%B9%A5%C6%A5%E0)

読み込み専用[ファイルシステム](http://d.hatena.ne.jp/keyword/%A5%D5%A5%A1%A5%A4%A5%EB%A5%B7%A5%B9%A5%C6%A5%E0)もtrueにしておくと良い
spec: securityContext: readOnlyRootFilesystem: true
readOnlyRootFilesystem: true
eadonlyfilesystemの使い所は大事

## Mitigate1 :no\_[nre](http://d.hatena.ne.jp/keyword/nre)\_privs

allowPrivilegeEscalation: false

自分が持っている権限委譲は付与できないようにする。
AllowPriviledgeEscalationはk8s 1.9での挙動では注意
<https://qiita.com/inajob/items/943a634a1941030e5075>

## Mitigate 1: seccpmp/AppArmor/[SELinux](http://d.hatena.ne.jp/keyword/SELinux)

seccomp + AppArmor + [SELinux](http://d.hatena.ne.jp/keyword/SELinux)で多段で守る
eccomp + AppArmor/[SELinux](http://d.hatena.ne.jp/keyword/SELinux)で壁を増やす

### SECCOMP

seccomp: security.alpha.kubernetes.io/pod: docker/default

metadata: annotations:seccomp.security.alpha.kubernetes.io/pod : docker/defaultとするとseccompが有効になってお勧め(ただしalpha)

seccompはv1.10でもまだalpha版 <https://kubernetes.io/docs/concepts/policy/pod-security-policy/#seccomp>

`unshare -U` でネームスペースから突破できてしまう。`

### AppArmor

container .apparmor .security.beta.kubernates.io/hello: runtime/default

### [SELinux](http://d.hatena.ne.jp/keyword/SELinux)

[SELinux](http://d.hatena.ne.jp/keyword/SELinux)は[Redhat](http://d.hatena.ne.jp/keyword/Redhat)系、AppArmorは[Debian](http://d.hatena.ne.jp/keyword/Debian)系、

[seLinux](http://d.hatena.ne.jp/keyword/seLinux)はラベルで設定可能
<https://kubernetes.io/docs/tasks/configure-pod-container/security-context/>

## Mitigate 2&3: kubeletの権限を制限する

RBAC for kubelet

--authorization-mode=RBAC,Node
--admission-control=...,NodeReaatriction

Rotate lubelet certs

--rotate-certificates

## Mitigate: PodSecurityPolicy

## [トラフィック](http://d.hatena.ne.jp/keyword/%A5%C8%A5%E9%A5%D5%A5%A3%A5%C3%A5%AF)を傍受

1. ネットワーク上の通信を傍受

## Istio

1. サービス間のプ[ロキシー](http://d.hatena.ne.jp/keyword/%A5%ED%A5%AD%A5%B7%A1%BC)
2. 暗号化
3. 証明証の自動更新
4. ポリシーがセントラルサーバで集中して管理する

# CNCF Cloud Native Interactive Landscape

<https://landscape.cncf.io/>

# Cloud Native Apps 入門

<https://speakerdeck.com/tnir/cloud-native-apps>

## What is Cloud Natic

[クラウド](http://d.hatena.ne.jp/keyword/%A5%AF%A5%E9%A5%A6%A5%C9)ネイティブなシステム

<https://www.cncf.io/about/charter/>

## CNCF

2015年にk8sプロジェクトの寄贈先として[Linux](http://d.hatena.ne.jp/keyword/Linux) Foudationのもとでスタート
20プロジェクト(2018年4月現在)
メンバーシップ(スポンサー)~180社(2018/4)
Technical Oversight Communite

## What is Cloud Natic Application

cloud application maturity
<https://www.nirmata.com/2015/03/09/cloud-native-application-maturity-model/>

## CI/CD基盤

イメージビルドの省力化・自動化・標準化は重要
Gitlab Runner + Gitlab Container Registry

## Gitlab CI評価

CNCF CIにも採用済
Cloud Native対応
[GitHub](http://d.hatena.ne.jp/keyword/GitHub)/GHE対応
企業ユースには適する
UIの洗練感はない

## [アーキテクチャ](http://d.hatena.ne.jp/keyword/%A5%A2%A1%BC%A5%AD%A5%C6%A5%AF%A5%C1%A5%E3)

積極的なマイクロサービスは行わない。

## マイクロサービス化に拘らない

- 既存コード資産
- 慣れた[フレームワーク](http://d.hatena.ne.jp/keyword/%A5%D5%A5%EC%A1%BC%A5%E0%A5%EF%A1%BC%A5%AF)
- I/Oを熟考した「サービス」を実装していく

## KubeCon tips and k8s at [Github](http://d.hatena.ne.jp/keyword/Github)

<https://speakerdeck.com/tnir/kubecon-tips-and-kubernetes-at-github>

## The Twelve-Factor Appsに従う

## コミュニティとの関わり

コミュニティに支えられた。

## まとめ

k8sで実行できるようにアプリをcloud Native化しよう。k8sで廃れても対応できそう。
cloud Native化の仕組みが大事。
microservicesにこだわらないことも大事
コミュニティに支えられた。

# Spinnakerを利用したk8sへの継続的デリバリ

k8sで安全にappをデプロイする仕組みについて
※安全とは作業ミスをなくすなど

## 導入するメリット

なぜコンテナを使うのか?
コンテナを利用するメリットは
ポータビリティ、軽量、実行環境の隔り

開発と本番環境の環境差分をなくす
設定漏れやパッケージの差分など

## k8sの役割

複数のDockerホストの管理
コンテナの死活監視
障害時のセルフヒーリング
[ロードバランサー](http://d.hatena.ne.jp/keyword/%A5%ED%A1%BC%A5%C9%A5%D0%A5%E9%A5%F3%A5%B5%A1%BC)の組み込み

k8sにはCI/CDの機能がないので別途用意する必要がある

## CI/CD

高品質なプロダクトを素早くユーザに届ける

CI:[継続的インテグレーション](http://d.hatena.ne.jp/keyword/%B7%D1%C2%B3%C5%AA%A5%A4%A5%F3%A5%C6%A5%B0%A5%EC%A1%BC%A5%B7%A5%E7%A5%F3)
DEVELOPE→DEPLOY→TESTを自動で回す仕組み
a.g. Jenkins

CD:継続的デリバリ
CIで回したものを[stg](http://d.hatena.ne.jp/keyword/stg),本番環境にデプロイする仕組み

Spinnakerにより、k8s上でCDを実現できる
CIは別途用意

## Spinnakerとは

[Netflix](http://d.hatena.ne.jp/keyword/Netflix)社が開発した[OSS](http://d.hatena.ne.jp/keyword/OSS)
マルチ[クラウド](http://d.hatena.ne.jp/keyword/%A5%AF%A5%E9%A5%A6%A5%C9)対応CDツール
アプリケーションの自動デプロイに必要な機能が実装
パイプラインやNlue/Greenデプロイなど

## 機能紹介

k8sにデプロイする機能
[GUI](http://d.hatena.ne.jp/keyword/GUI)でパイプラインを作成できる
パイプラインとはワークフローみたいなもの
複数のデプロイメント方法をサポート
Red /Black Deploy(Blue/Green)
Rollying Red/Black Deploy
Canary Deploy

## Red/Black Deploy

切り替え切り戻しを一瞬で行い時

## Rollying Red/Black Deploy

断続的に切り替えたいとき

## Canary Deploy

テスト的検査
最小構成だけ切り替えて様子見したいとき
問題なければ、切り替える

切り戻しも[GUI](http://d.hatena.ne.jp/keyword/GUI)やパイプラインで簡単に可能

## パイプラインにカスタム[スクリプト](http://d.hatena.ne.jp/keyword/%A5%B9%A5%AF%A5%EA%A5%D7%A5%C8)の実行が可能

serverspec,selemiumなどで工程ごとに試験ができる

CIツールは別途必要。
連携できるのは、[Travis](http://d.hatena.ne.jp/keyword/Travis)とJenkins

## 進捗状況を通知できる

パイプラインの成功、失敗をslackなどで通知など

## パイプラインで承認フローを組み込める

[stg](http://d.hatena.ne.jp/keyword/stg),testは自動、本番は管理者の承認で先にすすめる。

承認(manual judgment)

## その他機能

- white-listed execution [windows](http://d.hatena.ne.jp/keyword/windows)
- chaos monkey integrarion
- enable monitoring
  - datadog
  - prometheus
  - stackdrive
- triggering on webhock
- authentication
  - oauth2.0
  - [saml](http://d.hatena.ne.jp/keyword/saml)
  - [ldap](http://d.hatena.ne.jp/keyword/ldap)
  - x.509

## spinnaker と k8sの[マッピング](http://d.hatena.ne.jp/keyword/%A5%DE%A5%C3%A5%D4%A5%F3%A5%B0)

instance, pod
server group, replicaset
clustrt, deployment
load bakancers, service
security group, [Ingress](http://d.hatena.ne.jp/keyword/Ingress)

## Spinnakerのこれから

2ヶ月ごとにバージョンアップ
k8sのmanifestをデプロイ
kayentaと連携

# k8sの運用設計ガイド

細かい機能はあとで理解し、k8sはなにをするのかをまずは理解した方がいい。
明確な目的を持てば、自然とどう使えばいいかわかる。

## テーマ

自律的なチームとシステムを作るためのk8sの利用/運用設計

## why自律的?

独立的に動けて。自由がある。
moving fast, innovating

## moving fast

速さというのは急ぐこと空ではなく、何かをなくすことから生まれる
チューニングも思いクエリをなくす。承認リレーをなくす。

## k8s自体の狙いとズレていないか?

3GB.4GBのイメージを使ってしまうとか
k8s design architecture
[オーケストレーション](http://d.hatena.ne.jp/keyword/%A5%AA%A1%BC%A5%B1%A5%B9%A5%C8%A5%EC%A1%BC%A5%B7%A5%E7%A5%F3)を排除して、セルフオペレーションのためのもの。

## チームの設計

技術と組織は表裏一体
どういうチームだったらk8sを使える?

- [コンウェイ](http://d.hatena.ne.jp/keyword/%A5%B3%A5%F3%A5%A6%A5%A7%A5%A4)の法則
  メルカリは開発拠点が1つtokyo,London,USで[ソースコード](http://d.hatena.ne.jp/keyword/%A5%BD%A1%BC%A5%B9%A5%B3%A1%BC%A5%C9)も3つに分かれている

## [コンウェイ](http://d.hatena.ne.jp/keyword/%A5%B3%A5%F3%A5%A6%A5%A7%A5%A4)の法則を逆手に取る

自分が作りたいシステムを設計したチームをつくればいい

アプリケーション系、インフラ共通基盤系
これらは密結合せず、チームを分けた方がいい
プロダクトチームと[クラスタ](http://d.hatena.ne.jp/keyword/%A5%AF%A5%E9%A5%B9%A5%BF)アドミンチーム

## 責任の設計

## システムごとに必要なエンジニアリング作業がある

## [疎結合](http://d.hatena.ne.jp/keyword/%C1%C2%B7%EB%B9%E7)になる責任教会を決める

[ソースコード](http://d.hatena.ne.jp/keyword/%A5%BD%A1%BC%A5%B9%A5%B3%A1%BC%A5%C9)、Container、ノード、[クラスタ](http://d.hatena.ne.jp/keyword/%A5%AF%A5%E9%A5%B9%A5%BF)
コンテナとノードが教会

## プロダクトチームの責任

顧客の課題を解決

## [クラスタ](http://d.hatena.ne.jp/keyword/%A5%AF%A5%E9%A5%B9%A5%BF)チームの責任

プロダクトチームのパフォーマンスを最大化すること。

You build it,you run it!!

## [クラスタ](http://d.hatena.ne.jp/keyword/%A5%AF%A5%E9%A5%B9%A5%BF)の設計

開発環境、本番環境毎に[クラスタ](http://d.hatena.ne.jp/keyword/%A5%AF%A5%E9%A5%B9%A5%BF)をつくるのはよくない
環境が増えるたびに[クラスタ](http://d.hatena.ne.jp/keyword/%A5%AF%A5%E9%A5%B9%A5%BF)が増えて管理コストが上がる。
開発と本番環境が一致していることが保証しづらい。
ステージング環境が必要になっtラ、また[クラスタ](http://d.hatena.ne.jp/keyword/%A5%AF%A5%E9%A5%B9%A5%BF)をつくるのか。

## リージョン毎に1つだけ[クラスタ](http://d.hatena.ne.jp/keyword/%A5%AF%A5%E9%A5%B9%A5%BF)をつくる。

1. 開発と本番環境が一致
2. プロダクトが[クラスタ](http://d.hatena.ne.jp/keyword/%A5%AF%A5%E9%A5%B9%A5%BF)を意識しない

## 環境を特別視しない

開発と本番環境をわけても、serviceA がserviceBに影響を与えないようにしといけない結局、

## リージョンごとに1つだけくらつたをつくる。

1. [aws](http://d.hatena.ne.jp/keyword/aws),[gcp](http://d.hatena.ne.jp/keyword/gcp),herokuに開発環境せんよう窓口はない
2. ユーザが開発環境用として認識すればいい

## プロダクト、サービス毎に[クラスタ](http://d.hatena.ne.jp/keyword/%A5%AF%A5%E9%A5%B9%A5%BF)をわける

メンテされない[クラスタ](http://d.hatena.ne.jp/keyword/%A5%AF%A5%E9%A5%B9%A5%BF)がでてくる。
他のアービスと熊津するばあいはどうする

[クラスタ](http://d.hatena.ne.jp/keyword/%A5%AF%A5%E9%A5%B9%A5%BF)感通信ｙほり、暮らした無い通信のお方がネットワークの制御がしやすい。Neteork PolivyやIstopがあるので。

## 同じノードにのっているとセキュアじゃない

## [クラスタ](http://d.hatena.ne.jp/keyword/%A5%AF%A5%E9%A5%B9%A5%BF)は１つ専用のノードを用意する

## [クラスタ](http://d.hatena.ne.jp/keyword/%A5%AF%A5%E9%A5%B9%A5%BF)の粒度

## Namespaceの設計

Namespaceでバーチャル[クラスタ](http://d.hatena.ne.jp/keyword/%A5%AF%A5%E9%A5%B9%A5%BF)を作る

## 環境毎にNamespaceを分ける

## 環境だけでなく差＝ビス感もわけたい

サービス名+環境にNamespaceを分ける

## Network Pokivyの設計

Namespaceレベルで制御する

基本はAll Denyにしてホワイト絵リストで通信可能なNamespaceを設計する

## RBACの設計

RBCSCで権限委譲する
admin Roleとcluster admin Roleでプロダクトチームと、[クラスタ](http://d.hatena.ne.jp/keyword/%A5%AF%A5%E9%A5%B9%A5%BF)アドミンチームでわける。

Borg-cluster adminチームは[Gmail](http://d.hatena.ne.jp/keyword/Gmail) adminチームの権限はみれない、
権限は強すぎるなら削った方外い。

## アプリケーションContainerの設計

## Disposable

1. ステートレスに
2. ログは標準出力に

k8sはあるべき状態に治す。いまの状態から。control move
死んでも立ち上がるので、大丈夫というアプリケーションをつくるのがよい。

## IMuutable

1. Latest tagは使わない
2. 開発と本番環境で同じイメージを使う

## Resilient

自然に復旧する動きにする

1. Liveness Proveを使う(生きてるけど、バックエンドにつながらない時は通さない。Containerは生きているけど、プロセスがゾンビの時はkillしてもらう。)
2. Crash only
3. [PDB](http://d.hatena.ne.jp/keyword/PDB)を使う

## Observable

1. Liveness Prove,Readiness Probe
2. ログは標準出力に
3. メトリクス、トレース

## Single Concern

1. 1Container 1プロセス

## Loosely COupled

!. Labelで引っ掛ける
2. 順番はないほうがいい
3. Affinityも極力避ける([疎結合](http://d.hatena.ne.jp/keyword/%C1%C2%B7%EB%B9%E7)にしたい)
4. (Externaml)Serviceで固定IPも避ける

## 12 Factoro Appをみるのがいい

## オペレーションの設計

## 必ず宣言的なアプローチをロツ

1. バージョン管理
2. Control Loop
3. 1リソース1ファイル

バージョン管理では
[GUI](http://d.hatena.ne.jp/keyword/GUI)のデプロイツールはあんまりよくない。
[yaml](http://d.hatena.ne.jp/keyword/yaml)のパラメータを変えた時、どこ変えたのかわかんない
どうあるべきかを書けばいい。

## WHY k8sがYAMKベースなのか

[YAML](http://d.hatena.ne.jp/keyword/YAML)は[CLI](http://d.hatena.ne.jp/keyword/CLI)や[curl](http://d.hatena.ne.jp/keyword/curl)の[rest API](http://d.hatena.ne.jp/keyword/rest%20API)が自然と使える。

## モニタリングの設計

メトリクス
イベント
トレース
どうはねているのか
どのクエリ、どの関数がエラーなのか
イベント、ログ
なぜを把握するためのもの。
メトリクスやトレースにはきづけないもの
4つのレベルでモニタリングする
[ソースコード](http://d.hatena.ne.jp/keyword/%A5%BD%A1%BC%A5%B9%A5%B3%A1%BC%A5%C9) -> コンテナ -> ノード -> [クラスタ](http://d.hatena.ne.jp/keyword/%A5%AF%A5%E9%A5%B9%A5%BF)

# 『コンテナ疲れ』と戦う、k8s - PaaS -ServerLessの活用法!

正しいテクノロジースタックの洗濯ができる知識

コンテナつらくないですか?
コンテナ具術は抽象度が低い
エンジニアのかばーしないといけない責任は似が広い
k8sはエンジニアスキルが高いことを前提では
SREも日本の企業にあっているだろうか

## Containerの次はなんだろう

10年前は[クラウド](http://d.hatena.ne.jp/keyword/%A5%AF%A5%E9%A5%A6%A5%C9)黎明期。
EC2のEUリージョン解説

5年前は[クラウド](http://d.hatena.ne.jp/keyword/%A5%AF%A5%E9%A5%A6%A5%C9)は定着
DevOpsがもてはやされた。IaaSやCI/CDが中心。

テクノロジーの流れは
抽象度が高く、自動化の繰り返し
自動化の好循環

次はより抽象化、より自動化。
PaasやServerless

## PaaS

開発者がアプリケーション開発に専念
アプリケーションのライフサイクルを支援するプラットフォーム
PaaSの内部はContainerを使っている
Containerが廃れてもPaaSは進化し続けている

## Serverless

サーバ管理をせずともアプリケーションの構築と実行を行う仕組み

## ServerlessとContainerの関係

Slervelessプラットフォームは込んでナでFucctionえお実行

CNCF serverless whitepaper
<http://gs2.hatenablog.com/entry/2018/02/16/114739>

# Fluentd and Distributed Logging in Container Era

ログにもプロダクションのログ。ビジネスや、サービスのためのログ。
サービスログ、システムログなどがある。
コンテナは生まれて消えるので、ログ管理は大変。マイクロサービスが流行り、いろんなコンテナに、アプリがある。

ソースレイヤーでパースする。先に統一すると後が楽。統一された型を持ったレイヤーにするのが大事。
Fluentdでは基本は[json](http://d.hatena.ne.jp/keyword/json)型に変換する。
aggregatorはfluentdからfluentdに送ること。

logging driverはDockerコンテナのログを取れる。
fluent-loggerはfluentdはコンテナのアドレスを知らなくていい。

コネクションが増えるとパフォーマンスが落ちるので、コンテナのアプリケーションのログの送り先に直接redisに送るとかではなく、fuentdを送る。
バッファリングや、ロードバランシングを考えてくれる。分離して管理する。

agregation serverとしてfluentdをさらに置く。
コネクションを一つにまとめて、ロギングだけのコンテナを置くと、ソースサイドの負荷も下げられる。

[destination](http://d.hatena.ne.jp/keyword/destination)が[api](http://d.hatena.ne.jp/keyword/api)コールが多いか、少ないかで変わる。
Bigqueryとかは課金があるので、前段にアグリッションサーバを置くことがある。
ネットワークを分散して、障害で落ちてもいいように、ロードバランシングしたほうがいい。
ログは飛ばし先の分散が重要。

ログのフォーマットは統一しよう。アプリケーションレイヤーとシステムレイヤーが分断されるとツライ。
Fluentdで飛ばすログが1ファイルに全部入り（[スタックトレース](http://d.hatena.ne.jp/keyword/%A5%B9%A5%BF%A5%C3%A5%AF%A5%C8%A5%EC%A1%BC%A5%B9)も[アクセスログ](http://d.hatena.ne.jp/keyword/%A5%A2%A5%AF%A5%BB%A5%B9%A5%ED%A5%B0)など）つらい。
