---
title: "AWS Summit Tokyo 2018の聴いたセッションのメモ"
date: "2018-06-04"
---

聞いたセッションのメモ
セッションだけ聞くなら会場ではなくストリーミング配信をみるのが快適ということに気がついてしまった。

# オペレーションの最適化

- ベストプ[ラク](http://d.hatena.ne.jp/keyword/%A5%E9%A5%AF)ティスに基づく準備
- 適切なモニタリング
- 適切な運用
- Well-Architected framework
- 課題
- [AWS](http://d.hatena.ne.jp/keyword/AWS) Trusterd Advisor
- Well-Architected framework
  [クラウド](http://d.hatena.ne.jp/keyword/%A5%AF%A5%E9%A5%A6%A5%C9)[アーキテクチャ](http://d.hatena.ne.jp/keyword/%A5%A2%A1%BC%A5%AD%A5%C6%A5%AF%A5%C1%A5%E3)設計と運用の考え方とベストプ[ラク](http://d.hatena.ne.jp/keyword/%A5%E9%A5%AF)ティス
- 運用上の優秀正
- 実現のための大原則
  - [クラウド](http://d.hatena.ne.jp/keyword/%A5%AF%A5%E9%A5%A6%A5%C9)で運用するためのもの
- 確認のための質問
- Operation as codeの実践
- config,cloudwatc→lambdaで対処するオペレーションの自動化
- 注釈で[ドキュメンテーション](http://d.hatena.ne.jp/keyword/%A5%C9%A5%AD%A5%E5%A5%E1%A5%F3%A5%C6%A1%BC%A5%B7%A5%E7%A5%F3)をする.デプロイしたらplaybookなりが更新される
- 頻繁に小さく可逆な変更を加える。ワークロード側も変えられる設計にすべき
- 頻繁に運用手順を見直そう。定期的にGamedayを実施して手順をレビューする。効果があるか、効率化できるポイントを探す。
- 障害を予想する。机上演習Pre-mortemを実施する。障害シナリオとその[インパク](http://d.hatena.ne.jp/keyword/%A5%A4%A5%F3%A5%D1%A5%AF)トを理解。対応手順が効果的であることぉ確認、チームがそれらに詳しくなる。
- イベントと障害対応から学ぶ。うまくいった対応も塩お愛した対応も振り返る。イベントから学んだことをチームで共有する。ログを集めて、可視化しておこう。athenaとか
  確認のための質問
  運用がビジネスにどんな影響をあたえるのか、運用が客観的に回るっているのか。
- 運用における優先度を決める要因はなにか
- どのようにアプリケーション
- 実際のお客様環境によくある課題

  - タグを管理・活用しているか
  - デプロイ時に強制 tagつけ忘れないようにCloudformationその他のデプロイツールやiAMポリシーで縛る。[AWS](http://d.hatena.ne.jp/keyword/AWS) Service Catalogを利用
  - [AWS](http://d.hatena.ne.jp/keyword/AWS) Configで必須タグが付いているかをチェック。事前定義済ルールのrequired-tagsを利用。対象となるリソースタイプやタグを編集。
  - タグをキーに[AWS](http://d.hatena.ne.jp/keyword/AWS) Sytem Managerを使ってタグを使った管理もできる。リソースグループ化して管理。グループ化したリソースに対して一括処理も可能。
  - タグで頑張りすぎないことも大事。
  - タグの設定指針 [awS](http://d.hatena.ne.jp/keyword/awS) [Tagging](http://d.hatena.ne.jp/keyword/Tagging) Strategyをもよう。
- メンテナンスの通知は受け取れているのか
  - メールを見逃す。特定の担当者にしか行かない。社内のチャット
  - [aWS](http://d.hatena.ne.jp/keyword/aWS) Personal Health [Dashboard](http://d.hatena.ne.jp/keyword/Dashboard)
  - リソースに対するメンテやissueが表示される[ダッシュ](http://d.hatena.ne.jp/keyword/%A5%C0%A5%C3%A5%B7%A5%E5)ボード
  - CloudWatch Eventsと連携してイベントに対するアクションを実行
- [awS](http://d.hatena.ne.jp/keyword/awS) HEalth [API](http://d.hatena.ne.jp/keyword/API) & [AWS](http://d.hatena.ne.jp/keyword/AWS) Heallth [Github](http://d.hatena.ne.jp/keyword/Github) repository
  - [aws](http://d.hatena.ne.jp/keyword/aws)-health-tools　を使えばチャットツールやｓNS通知に自動化できる
  - 大体の連絡先の活用
    - 合うぃ急の連絡先、操作の連絡先、セキュリティの連絡先
- 複数のアカウントをまとめて管理する
  - 部門ごとやアプリケーションごとにアカウントを作っているけど、ガバナンスを聞かせられない。
  - 請求統合をおこなっているけど、各アカウンとの利用状況が把握できない
  - 請求統合されたアカウント感でRIを管理はいや
  - [AWS](http://d.hatena.ne.jp/keyword/AWS) Oraganizationによえう請求統合がソリューション
  - Masterアカウントにまとめて一括請求、[ボリュームディスカウント](http://d.hatena.ne.jp/keyword/%A5%DC%A5%EA%A5%E5%A1%BC%A5%E0%A5%C7%A5%A3%A5%B9%A5%AB%A5%A6%A5%F3%A5%C8)もこれに適用
- [AWS](http://d.hatena.ne.jp/keyword/AWS) Organization
- 一括請求のみを有効化
- 複数の[AWS](http://d.hatena.ne.jp/keyword/AWS)アカウントに適用するポリシーを集中管理できる
- [AWS](http://d.hatena.ne.jp/keyword/AWS)のサービスへのアクセス制御
- [AWS](http://d.hatena.ne.jp/keyword/AWS)アカウントんお作成と管理の自動化
- [AWS](http://d.hatena.ne.jp/keyword/AWS) Config連携、AWSFirewall Manager連携、SingleSignOn連携
- Cost [Explorer](http://d.hatena.ne.jp/keyword/Explorer) [API](http://d.hatena.ne.jp/keyword/API)
- Cost [Explorer](http://d.hatena.ne.jp/keyword/Explorer) [API](http://d.hatena.ne.jp/keyword/API), CustomReport
- [csv](http://d.hatena.ne.jp/keyword/csv)だけでなく、[json](http://d.hatena.ne.jp/keyword/json)でも取れる
- [aws](http://d.hatena.ne.jp/keyword/aws)-cost-[explorer](http://d.hatena.ne.jp/keyword/explorer)-report
- [api](http://d.hatena.ne.jp/keyword/api)使うとお金がかかる
- Reservide Instanceの共有拒否設定
  - 本当は複数のアカウントでサイズ関係なくうまくばらすこともできるので、共有してほしい。
  - それでも共有したくないなら、RI割引共有の設定で共有したくないなら設定できる
- [AWS](http://d.hatena.ne.jp/keyword/AWS)サポートは活用できているか
  - 複数のアカウント感でナレッジが共有されず、何度もの同じことを聞く
  - 社内で使っている課題管理システムと連携したい
  - サポートの調査が思うように進まない
- [AWS](http://d.hatena.ne.jp/keyword/AWS)サポート[API](http://d.hatena.ne.jp/keyword/API)

  - サポート問い合わせの自動化や問題管理ツールとの連携
  - サポート問い合わせのエクスポート
  - Trusted Advisortとの自動連系
  - case\_life\_cycle.html, trustedadvisor.html
  - ビジネス以上でないと古ファンクションは使えない
- サポート問い合わせのベストプ[ラク](http://d.hatena.ne.jp/keyword/%A5%E9%A5%AF)ティス

  - 一つのお問い合わせで関連性のない複数の質問をしない
  - 問い合わせ対象リソースの所有者が起票していることを確認する
  - 適切な緊急度を設定
  - 問いあわせ時には以下の内容を添付

```
事象の発生時間(タイムゾーン)
事象が発生したリソースの詳細(リージョン・リソースID・名前)
発生した事象の詳細：
SdKやCLIのエラ＝であればそのエラー出力
可能であればAWSのCLIのの場合は--debug
```

- [AWS](http://d.hatena.ne.jp/keyword/AWS) Trusted Advisor
  - リアルタイムガイダンスを提供してくれる
  - [AWS](http://d.hatena.ne.jp/keyword/AWS) Trusted AdvisorとCloudWatchの連携
  - [AWS](http://d.hatena.ne.jp/keyword/AWS)　Limit　Monitor

Well-Architectを使って準備し、Trusted Advisorを使って環境を見直しておこう

# Fargate

コンテナのメリット
- パッケージング
- 配布
- イミュータブルインフラスト[ラク](http://d.hatena.ne.jp/keyword/%A5%E9%A5%AF)チャ

アプリケーション開発に集中

1台のサーバでDockerコンテナを使うのは簡単だが、サーバが増えると大変

- ECS
  - コンテナはタスクという単位でタスクの配置やスケールのマネージド
    動作イメージ
    ECS
    EC2[インスタンス](http://d.hatena.ne.jp/keyword/%A5%A4%A5%F3%A5%B9%A5%BF%A5%F3%A5%B9)とタスクがある。これを提供してくれる
    ECS[アーキテクチャ](http://d.hatena.ne.jp/keyword/%A5%A2%A1%BC%A5%AD%A5%C6%A5%AF%A5%C1%A5%E3)の整理
    Taskアプリケーションを構成する1つ以上のコンテナ(群)実行単位
    Container Instance Taskが起動するEC2[インスタンス](http://d.hatena.ne.jp/keyword/%A5%A4%A5%F3%A5%B9%A5%BF%A5%F3%A5%B9)
    Service　ロングランニングアプリ用スケジューラTaskの数
    Cluster

Fatgateは[インスタンス](http://d.hatena.ne.jp/keyword/%A5%A4%A5%F3%A5%B9%A5%BF%A5%F3%A5%B9)管理不要
　Fargateの上にTaskが起動。EC2[インスタンス](http://d.hatena.ne.jp/keyword/%A5%A4%A5%F3%A5%B9%A5%BF%A5%F3%A5%B9)を増やすことなく仮想サーバー側の管理が不要
Taskだけがスケールされる

Codecommit codebuld ECR Fargate ECK

コンテナ管理にひつようなもの
サービスディスカバリ Route53,ALB
ロギング、モニタにリング　CloudWatch
セキュリティ　IAM　[VPC](http://d.hatena.ne.jp/keyword/VPC)　パラメータストア
スケジューリング
タスクプレースメント

サービスディスカバリ
サービス同士が[疎結合](http://d.hatena.ne.jp/keyword/%C1%C2%B7%EB%B9%E7)になるように構成するのがベストプ[ラク](http://d.hatena.ne.jp/keyword/%A5%E9%A5%AF)ティス、生存時間が短いので各サービスが自身が接続する先を見つける必要がある
ECSではALBと連携
ALBをエンドポイントとしてつかう
ECAサービスディスカバリの利用
名前解決で、ALBを使わずRoute53のDNA名で自動的に登録することができる

ロギングとモニタにリング
コンテナのアプリは外でSTDOUTに出力する
コンテナ[インスタンス](http://d.hatena.ne.jp/keyword/%A5%A4%A5%F3%A5%B9%A5%BF%A5%F3%A5%B9)とかリソースよりサービスを管理するのがよい

CloudWatch
awslogsでCloudWatｈLogsに送信される
1つのTask内に2種類のコンテナを定義する
アプリケーションコンテナ
ロギング用のコンテナ
一次共有ボリュームにログを出力しロギングコンテナがcloudwatch logsに転送
ロギング処理を別コンテナにまかせる
[サイドカー](http://d.hatena.ne.jp/keyword/%A5%B5%A5%A4%A5%C9%A5%AB%A1%BC)構成

Fargateはコンテナに[インスタンス](http://d.hatena.ne.jp/keyword/%A5%A4%A5%F3%A5%B9%A5%BF%A5%F3%A5%B9)の管理は不要でタスクのみ。

Fargateより、より細やかなECS[クラスタ](http://d.hatena.ne.jp/keyword/%A5%AF%A5%E9%A5%B9%A5%BF)管理をつげんできる
ECS[クラスタ](http://d.hatena.ne.jp/keyword/%A5%AF%A5%E9%A5%B9%A5%BF)の状態変化をリアルタイムに検出する
監視システムにEventログを保存してくらすたの　状態を可視化する
特定のタスクが落ちたときに気づける状態変化に気づける

EventStreamによるリアルタイムなイベント検知
ECS[クラスタ](http://d.hatena.ne.jp/keyword/%A5%AF%A5%E9%A5%B9%A5%BF)の状態変化を通知する
Evento通知の到達性は少なくとも１回

セキュリティ
アクセス権限の考え方
IAMロールポリシーを使って[クラスタ](http://d.hatena.ne.jp/keyword/%A5%AF%A5%E9%A5%B9%A5%BF)ーに対する権限や
アプリケーションの権限、どのタスクがどの[AWS](http://d.hatena.ne.jp/keyword/AWS)リスースにアクセスできるか
タスク管理に関する権限
ECRからのイメージのpull
Clone

Taskに関するセキュリティ
Task単位でIAMロールを割り当て
Task単位でSecurity Groupを割り当て

Taskでどのようにパスワードをわたすのか
Parameter Store,Secrets Managerを使ってKMSに置いてTaskに設定されたIAMロールの権限に応じて秘密情報を取得

スケジューリングとタスクプレースメント
管理が必要となる2つのレイヤー
- CountainerInstanceのスケーリング
Fargateは考慮不要。
- Taskのスケーリング
　アプリケーションオートスケーリングを利用することでTaskのオートスケーリングを実現可能

EC2[インスタンス](http://d.hatena.ne.jp/keyword/%A5%A4%A5%F3%A5%B9%A5%BF%A5%F3%A5%B9)使うときのスケールイン
タスクの数が減る。→コンテナ[インスタンス](http://d.hatena.ne.jp/keyword/%A5%A4%A5%F3%A5%B9%A5%BF%A5%F3%A5%B9)を削除

Fargateのスケールイン

タスクのみがスケールインすればよい。

Target Trackingを利用したアプリケーションオートスケーリング
メトリクスに対してターゲット値を設定
その値に近づくようにアプリケーションオートスケーリングが自動的にTaskを調整

Taksの配置を管理するには
Taskga可動するために必要な条件は
必要なCPU、メモリ、ポートが割り当て可能化

どのようにTaskを配置したいのか
特定のAZに置く
特定の[インスタンス](http://d.hatena.ne.jp/keyword/%A5%A4%A5%F3%A5%B9%A5%BF%A5%F3%A5%B9)タイプのみ

Task配置に関するロジック
CPUメ[モリー](http://d.hatena.ne.jp/keyword/%A5%E2%A5%EA%A1%BC)ポートとAZ、[インスタンス](http://d.hatena.ne.jp/keyword/%A5%A4%A5%F3%A5%B9%A5%BF%A5%F3%A5%B9)タイプ、AMI　ID
配置戦略を満たすか
最終的なTaskの配置場所を決定

タスク配置例

コンテナ[インスタンス](http://d.hatena.ne.jp/keyword/%A5%A4%A5%F3%A5%B9%A5%BF%A5%F3%A5%B9)のroll out
タスクdefinitionの更新時に新しいAMI IDを利用してコンテナ[インスタンス](http://d.hatena.ne.jp/keyword/%A5%A4%A5%F3%A5%B9%A5%BF%A5%F3%A5%B9)に配置する制約をつける
1ホスト1コンテナ
distinctinstqnce constaraint + event stream + lambda
