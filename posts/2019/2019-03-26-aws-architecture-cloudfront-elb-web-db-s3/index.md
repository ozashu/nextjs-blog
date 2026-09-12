---
title: "AWS構築[Cloudfront+ELB+WEB+DB+S3]"
date: "2019-03-26"
---

[AWS](http://d.hatena.ne.jp/keyword/AWS)なれるために2018年ごろに手でポチポチ構築したときのメモ
なので今は設定画面とか変わっているものがありそう
[Cloudfront+ELB+WEB+DB+S3] 構成。
ほとんどの場合、Terraformで構築すると思うけど、
その前の[AWS](http://d.hatena.ne.jp/keyword/AWS)入門として一応残しておきます。

# 仕様と構成

## サブネット構成

| 名前タグ | [VPC](http://d.hatena.ne.jp/keyword/VPC) | AZ | [IPv4](http://d.hatena.ne.jp/keyword/IPv4) CIDR ブロック |
| --- | --- | --- | --- |
| subnet-hogehoge-training-[ssh](http://d.hatena.ne.jp/keyword/ssh) | [hog](http://d.hatena.ne.jp/keyword/hog) | ap-northeast-b | 172.31.[hoge](http://d.hatena.ne.jp/keyword/hoge).0/24 |
| subnet-hogehoge-training-web01 | training | ap-northeast-b | 172.31.[hoge](http://d.hatena.ne.jp/keyword/hoge).0/24 |
| subnet-hogehoge-training-web02 | training | ap-northeast-c | 172.31.[hoge](http://d.hatena.ne.jp/keyword/hoge).0/24 |
| subnet-hogehoge-training-db01 | training | ap-northeast-b | 172.31.[hoge](http://d.hatena.ne.jp/keyword/hoge).0/24 |
| subnet-hogehoge-training-db02 | training | ap-northeast-c | 172.31.[hoge](http://d.hatena.ne.jp/keyword/hoge).0/24 |

## IAMロール

- IAMロール名
  - [hoge](http://d.hatena.ne.jp/keyword/hoge)-training
- 権限
  - EBSスナップショット
  - S3ファイルアップロード権限

## S3

- [バケット](http://d.hatena.ne.jp/keyword/%A5%D0%A5%B1%A5%C3%A5%C8)名
  - [hoge](http://d.hatena.ne.jp/keyword/hoge)-training.<[ドメイン](http://d.hatena.ne.jp/keyword/%A5%C9%A5%E1%A5%A4%A5%F3)>
- - <http://hoge-training.<>[ドメイン](http://d.hatena.ne.jp/keyword/%A5%C9%A5%E1%A5%A4%A5%F3)>/image/logo\_[hoge](http://d.hatena.ne.jp/keyword/hoge).[svg](http://d.hatena.ne.jp/keyword/svg)

## サーバ構成

### 踏み台

- OS
  - CentOS7([AWS](http://d.hatena.ne.jp/keyword/AWS) Marketplaceから)
- [インスタンス](http://d.hatena.ne.jp/keyword/%A5%A4%A5%F3%A5%B9%A5%BF%A5%F3%A5%B9)対応
  - t2.micro
- サブネット
  - subnet\_[ssh](http://d.hatena.ne.jp/keyword/ssh)
- 自動割当パブリックIP
  - 有効化
- プライベート[IPアドレス](http://d.hatena.ne.jp/keyword/IP%A5%A2%A5%C9%A5%EC%A5%B9)
  - 172.31.[hoge](http://d.hatena.ne.jp/keyword/hoge).10
- ディスク
  - 初期値を利用
  - ボリュームタイプは汎用[SSD](http://d.hatena.ne.jp/keyword/SSD)(GP2)
- タグ
  - Name:[hoge](http://d.hatena.ne.jp/keyword/hoge)-training-[ssh](http://d.hatena.ne.jp/keyword/ssh)
- セキュリティグループ
  - セキュリティグループ名:[hoge](http://d.hatena.ne.jp/keyword/hoge)-training-[ssh](http://d.hatena.ne.jp/keyword/ssh)
  - 設定:自分のNWから[SSH](http://d.hatena.ne.jp/keyword/SSH)のみ許可
- キーペア
  - 新規作成
- EIP
  - 必要
- ホスト名
  - [hoge](http://d.hatena.ne.jp/keyword/hoge)-training-[ssh](http://d.hatena.ne.jp/keyword/ssh)

### web

- OS
  - CentOS7([AWS](http://d.hatena.ne.jp/keyword/AWS) Marketplaceから)
- [インスタンス](http://d.hatena.ne.jp/keyword/%A5%A4%A5%F3%A5%B9%A5%BF%A5%F3%A5%B9)対応
  - t2.micro
- サブネット
  - subnet-[hoge](http://d.hatena.ne.jp/keyword/hoge)-training-web01
  - subnet-[hoge](http://d.hatena.ne.jp/keyword/hoge)-training-web02
- 自動割当パブリックIP
  - 有効化
- プライベート[IPアドレス](http://d.hatena.ne.jp/keyword/IP%A5%A2%A5%C9%A5%EC%A5%B9)
  - 172.31.[hoge](http://d.hatena.ne.jp/keyword/hoge).10
  - 172.31.[hoge](http://d.hatena.ne.jp/keyword/hoge).10
- ディスク
  - 初期値を利用
  - ボリュームタイプは汎用[SSD](http://d.hatena.ne.jp/keyword/SSD)(GP2)
- タグ
  - Name:[hoge](http://d.hatena.ne.jp/keyword/hoge)-training-web01
  - Name:[hoge](http://d.hatena.ne.jp/keyword/hoge)-training-web02
- セキュリティグループ
  - セキュリティグループ名:[hoge](http://d.hatena.ne.jp/keyword/hoge)-training-web
  - 設定:踏み台のから[SSH](http://d.hatena.ne.jp/keyword/SSH)のみ許可,ELBからのHTTP(80)のみ許可
- キーペア
  - 新規作成
- EIP
  - 不要
- ホスト名
  - [hoge](http://d.hatena.ne.jp/keyword/hoge)-training-web01
  - [hoge](http://d.hatena.ne.jp/keyword/hoge)-training-web02
- [ミドルウェア](http://d.hatena.ne.jp/keyword/%A5%DF%A5%C9%A5%EB%A5%A6%A5%A7%A5%A2)
  - [Apache](http://d.hatena.ne.jp/keyword/Apache)([yum](http://d.hatena.ne.jp/keyword/yum)にてインストールされる最新版)

### ELB(ALB)

- 名前
  - [hoge](http://d.hatena.ne.jp/keyword/hoge)-training-elb
- セキュリティグループ
  - セキュリティグループ名:[hoge](http://d.hatena.ne.jp/keyword/hoge)-training-elb
- ルーティングの設定
  - ターゲットグループ名:[hoge](http://d.hatena.ne.jp/keyword/hoge)-training-elb
- ターゲットの登録
  - webサーバ2台を登録

### RDS([MySQL](http://d.hatena.ne.jp/keyword/MySQL))

- サブネットグループの作成
  - [hoge](http://d.hatena.ne.jp/keyword/hoge)-training-db
- 開発/テストを洗濯
- DBエンジンのバージョン
  - 最新版を選択
- DB[インスタンス](http://d.hatena.ne.jp/keyword/%A5%A4%A5%F3%A5%B9%A5%BF%A5%F3%A5%B9)の選択
  - db.t2.micro
- マルチAZ配置
  - はい
- DB[インスタンス](http://d.hatena.ne.jp/keyword/%A5%A4%A5%F3%A5%B9%A5%BF%A5%F3%A5%B9)識別子
  - [hoge](http://d.hatena.ne.jp/keyword/hoge)-training-db
- マスターユーザの名前
  - root
- パスワード
  - ---
- [VPC](http://d.hatena.ne.jp/keyword/VPC)
  - training
- サブネットグループ
  - subnet-[hoge](http://d.hatena.ne.jp/keyword/hoge)-training-db01
  - subnet-[hoge](http://d.hatena.ne.jp/keyword/hoge)-training-db02
- パブリックアクセス可能
  - いいえ
- [VPC](http://d.hatena.ne.jp/keyword/VPC)セキュリティグループ
  - タグ名: [hoge](http://d.hatena.ne.jp/keyword/hoge)-training-db
  - インバウンドルールの編集: webサーバのsubnetからのみ3306のアクセス許可
- データベース名
  - [hoge](http://d.hatena.ne.jp/keyword/hoge)\_training\_db
- バックアップウィンドウ
  - 開始時間20:00UTF
- マイナーバージョン自動アップグレード
  - いいえ
- メンテナンスウィンドウ
  - 開始日時:日曜日の21:00UTF

### CloudFront

S3参照

- logoの画像
  - `/image/`配下は300秒キャッシュ(<http://hoge-training.<>[ドメイン](http://d.hatena.ne.jp/keyword/%A5%C9%A5%E1%A5%A4%A5%F3)>/image/)
- logo以外
  - `/js/`,`/css/`配下は600秒キャッシュ(<http://hoge-training.<>[ドメイン](http://d.hatena.ne.jp/keyword/%A5%C9%A5%E1%A5%A4%A5%F3)>/js/),(<http://hoge-training.<>[ドメイン](http://d.hatena.ne.jp/keyword/%A5%C9%A5%E1%A5%A4%A5%F3)>/[css](http://d.hatena.ne.jp/keyword/css)/)
- それ以外はキャッシュさせない
- 他のパラメータ値は気にしない

### Route53

[hoge](http://d.hatena.ne.jp/keyword/hoge)-trainigを[サブドメイン](http://d.hatena.ne.jp/keyword/%A5%B5%A5%D6%A5%C9%A5%E1%A5%A4%A5%F3)として<[ドメイン](http://d.hatena.ne.jp/keyword/%A5%C9%A5%E1%A5%A4%A5%F3)>に登録

# 流れ

1. [hoge](http://d.hatena.ne.jp/keyword/hoge)-training.<[ドメイン](http://d.hatena.ne.jp/keyword/%A5%C9%A5%E1%A5%A4%A5%F3)> にアクセスするとサイト表示閲覧可能にする。
   - ELB から 2 台に振り分けられている状態
   - index.html を設置
2. RDS 作成
   - web サーバから [mysql](http://d.hatena.ne.jp/keyword/mysql) コマンドで接続可能
3. CloudFront の設定
4. プログラムの作成

# 手順

## IAMロールの作成

ロールは永続的な権限（アクセスキー、シークレットアクセスキー)を保持するユーザーとは異なり、
一時的に[AWS](http://d.hatena.ne.jp/keyword/AWS)リソースへアクセス権限を付与する場合に使用します。

- [AWS](http://d.hatena.ne.jp/keyword/AWS)リソースへの権限付与
  - EC2上で稼働するアプリに一時的に[AWS](http://d.hatena.ne.jp/keyword/AWS)のリソースへアクセスする権限を与えたい場合
  - EC2作成時にロールを付与することで可能
  - [[AWS]IAMロールをEC2インスタンスに設定(アタッチ)してみた](http://shomi3023.com/2017/11/16/post-1146/)で、既存の[インスタンス](http://d.hatena.ne.jp/keyword/%A5%A4%A5%F3%A5%B9%A5%BF%A5%F3%A5%B9)にもアタッチ可能
- クロスアカウントアクセス
  - 複数の[AWS](http://d.hatena.ne.jp/keyword/AWS)アカウント間のリソースを１つのIAMユーザアカウントで操作したい
- IDフェデレーション
  - 社内のADや[LDAP](http://d.hatena.ne.jp/keyword/LDAP)サーバに登録されているアカウントを使用して、[AWS](http://d.hatena.ne.jp/keyword/AWS)リソースにアクセスしたい場合
- WEB IDフェデレーション
  - FBや[Google](http://d.hatena.ne.jp/keyword/Google)等のアカウントを使用して[AWS](http://d.hatena.ne.jp/keyword/AWS)リソースにアクセスしたい場合

[AWS](http://d.hatena.ne.jp/keyword/AWS)コンソールの`IAM→ロール→ロールの作成`

EC2[インスタンス](http://d.hatena.ne.jp/keyword/%A5%A4%A5%F3%A5%B9%A5%BF%A5%F3%A5%B9)だけがそのロールを取得することができるポリシーを選択
`次のステップ:アクセス権限` をクリック
`ポリシーの作成` をクリック
後述の `IAMポリシーの付与` に飛びます。

## IAMユーザとグループ

今回は使わないがロールではなくユーザとグループを作成してポリシーを付与するのは以下手順

[AWS](http://d.hatena.ne.jp/keyword/AWS)コンソールの`IAM→ユーザ→ユーザを追加`
IAMユーザにアクセス権限を設定する場合、ユーザーに直接ポリシー付与する方法と、ポリシー付与したグループを作成して、ユーザーをグループに所属させる方法がある。
基本的にはIAMグループに対して、アクセス権限を設定するようにする。
グループの名前も管理者であることが想像できるものにするのがよい。

- ユーザ名
  - [hoge](http://d.hatena.ne.jp/keyword/hoge)-training
- [AWS](http://d.hatena.ne.jp/keyword/AWS)アクセスの種類を選択
  - アクセスの種類:プログラムによるアクセス、[AWS](http://d.hatena.ne.jp/keyword/AWS)コンソールへのアクセス
  - カスタムパスワード:\*\*\*\*\*\*\*\*\*
  - パスワードのリセットが必要
- ユーザをグループに追加で `グループの作成` をクリック
- グループ名 `hoge-training` 入力して `グループの作成` をクリック
- ポリシーの付与はのちほど行うので `次のステップ:確認` をクリック
- `ユーザーの作成` をクリック

これでIAMユーザーが作成されました。
作成結果の画面にアクセスキーIDとシークレットアクセスキーが表示されていますので、
忘れずに控えておきましょう。
`.csvのダウンロード` をクリックすると、アクセスキー情報が記載された[CSV](http://d.hatena.ne.jp/keyword/CSV)ファイルをダウンロードできます、
後からアクセスキーの作成は可能だが、同じアクセスキーは二度とダウンロードできないので注意。
アクセスキーを不特定多数が閲覧可能な場所には置かないこと。[Github](http://d.hatena.ne.jp/keyword/Github)とか...
アクセスキーを入手したら `閉じる` をクリックしてIAMのユーザー画面に戻る。

## IAMポリシーの付与

作成したIAMユーザにアクセス権限を設定
アクセス権限はIAMポリシーで管理されます。
ポリシーには管理ポリシーとインラインポリシーの2種類があります。

- 管理ポリシー
  - [AWS](http://d.hatena.ne.jp/keyword/AWS)管理ポリシー
    - [AWS](http://d.hatena.ne.jp/keyword/AWS)側で作成。管理されるポリシー
    - 管理者権限、全サービスの閲覧のみの権限、EC2フルアクセス権限などが用意されている
    - 細かい設定をする必要がない場合は、このポリシーを付与すると[ラク](http://d.hatena.ne.jp/keyword/%A5%E9%A5%AF)
  - カスタマー管理ポリシー
    - ユーザが作成して、自由に設定できるポリシー
    - 特定のIPをからのみ操作を受け付けるといった細かい設定はこのポリシーを使う
- インラインポリシー
  - 特定のIAMユーザ、IAMグループ、IAMロールに直接付与されるポリシー
  - 基本的には管理ポリシーを使うので、インラインポリシーが付与されることはあまりない。
  - 管理ポリシーはそのポリシーを適用している全ユーザ、グループ、ロールに影響があるので、特定のユーザのみに付与したい場合などはインラインポリシーを使う

ポリシーは[JSON](http://d.hatena.ne.jp/keyword/JSON)形式で記述します。

権限を以下のみにしたいので参考記事を参照しつつ設定してください。

- EBSスナップショット
- S3ファイルアップロード権限

参考記事

- [Amazon S3: 特定の S3 バケットへの読み取りと書き込みアクセスを許可する](https://docs.aws.amazon.com/ja_jp/IAM/latest/UserGuide/reference_policies_examples_s3_rw-bucket.html)
- [IAMのEC2権限をまとめてみた](http://blog.serverworks.co.jp/tech/2014/02/07/iam-ec2/)
- [EC2のIAM権限で使えるActionをまとめてみた](http://www.kabegiwablog.com/entry/2017/08/29/213104)

`Review policy` をクリックし、ポリシー名と説明を記入し、 `Create policy` をクリック
次にアクセス権限ポリシーをロールにアタッチさせます。
対象のポリシーを選択し、 `次のステップ:確認` をクリック
ロール名とロールの説明を入力し、 `ロールの作成` をクリック

EC2で対象の[インスタンス](http://d.hatena.ne.jp/keyword/%A5%A4%A5%F3%A5%B9%A5%BF%A5%F3%A5%B9)を選択し、 `アクション→インスタンスの設定→IAMロールの割り当て/置換` をクリックし,アタッチしたいポリシーを選択。

## サブネットの作成

サブネットは大きなネットワークを複数の小さなネットワークに分割して管理する歳の、管理単位となるネットワーク
ELBを作成する予定があるサブネットは余裕を持って、「/24」(256IPアドレス以上)のネットワーク範囲で作成することが推奨
なぜなら、ELB作成時でELBを作成するサブネットに20IPアドレス以上の空きが必要になるため、「/28」(16IPアドレス)で作成したサブネットにはELBを作成することができないため。

[AWS](http://d.hatena.ne.jp/keyword/AWS)コンソールで `VPC→サブネット→サブネットの作成` から以下の条件でサブネットを作成する

| 名前タグ | [VPC](http://d.hatena.ne.jp/keyword/VPC) | AZ | [IPv4](http://d.hatena.ne.jp/keyword/IPv4) CIDR ブロック |
| --- | --- | --- | --- |
| subnet-[hoge](http://d.hatena.ne.jp/keyword/hoge)-training-[ssh](http://d.hatena.ne.jp/keyword/ssh) | training | ap-northeast-b | 172.31.[hoge](http://d.hatena.ne.jp/keyword/hoge).0/24 |
| subnet-[hoge](http://d.hatena.ne.jp/keyword/hoge)-training-web01 | training | ap-northeast-b | 172.31.[hoge](http://d.hatena.ne.jp/keyword/hoge).0/24 |
| subnet-[hoge](http://d.hatena.ne.jp/keyword/hoge)-training-web02 | training | ap-northeast-c | 172.31.[hoge](http://d.hatena.ne.jp/keyword/hoge).0/24 |
| subnet-[hoge](http://d.hatena.ne.jp/keyword/hoge)-training-db01 | training | ap-northeast-b | 172.31.[hoge](http://d.hatena.ne.jp/keyword/hoge).0/24 |
| subnet-[hoge](http://d.hatena.ne.jp/keyword/hoge)-training-db02 | training | ap-northeast-c | 172.31.[hoge](http://d.hatena.ne.jp/keyword/hoge).0/24 |

踏み台とWEBは- 自動割当パブリックIPを有効化にしたいので、
`サブネットのアクション` タブの`自動割り当てIP設定の変更`から有効化します。

## EC2作成

### [AWS](http://d.hatena.ne.jp/keyword/AWS)操作用の公開鍵・[秘密鍵](http://d.hatena.ne.jp/keyword/%C8%EB%CC%A9%B8%B0)の作成

EC2では[公開鍵暗号方式](http://d.hatena.ne.jp/keyword/%B8%F8%B3%AB%B8%B0%B0%C5%B9%E6%CA%FD%BC%B0)でろログインをします。

`EC2→キーペア→キーペアの作成`でキーペアを作成します。
作成したキーペアは作成したタイミングでしかダウンロードできないので注意。

1. [AWS](http://d.hatena.ne.jp/keyword/AWS)コンソールからEC2を選択
2. EC2[ダッシュ](http://d.hatena.ne.jp/keyword/%A5%C0%A5%C3%A5%B7%A5%E5)ボードからキーペアを選択
3. キーペアの作成をクリック
4. キーペア名に作成するキーペアの名前を入力
5. 作成をクリック
6. pem形式のファイルをダウンロードします。

権限は`600`にします。

`$ chmod 600 hoge.pem`

### セキュリティグループを作成

セキュリティグループは[ホワイトリスト](http://d.hatena.ne.jp/keyword/%A5%DB%A5%EF%A5%A4%A5%C8%A5%EA%A5%B9%A5%C8)方式なので「何を許可するのか」のみ指定可能
また、セキュリティグループは[VPC](http://d.hatena.ne.jp/keyword/VPC)ごとの設定になります。

[AWS](http://d.hatena.ne.jp/keyword/AWS)コンソールの`EC2→セキュリティグループ→セキュリティグループの作成`から`インバウンド(内部への通信)`で以下の条件で作成

- 踏み台
  - セキュリティグループ名:[hoge](http://d.hatena.ne.jp/keyword/hoge)-training-[ssh](http://d.hatena.ne.jp/keyword/ssh)
  - 設定:オフィスIPから[SSH](http://d.hatena.ne.jp/keyword/SSH)のみ許可
  - [SSH](http://d.hatena.ne.jp/keyword/SSH),[TCP](http://d.hatena.ne.jp/keyword/TCP),22, 自分のネットワーク
- WEB
  - セキュリティグループ名:[hoge](http://d.hatena.ne.jp/keyword/hoge)-training-web
  - 設定:踏み台のから[SSH](http://d.hatena.ne.jp/keyword/SSH)のみ許可,ELBからのHTTP(80)のみ許可
  - HTTP,[TCP](http://d.hatena.ne.jp/keyword/TCP),80,172.31.0.0/16
  - [SSH](http://d.hatena.ne.jp/keyword/SSH),[TCP](http://d.hatena.ne.jp/keyword/TCP),22,172.31.[hoge](http://d.hatena.ne.jp/keyword/hoge).10/32
- ELB
  - セキュリティグループ名:[hoge](http://d.hatena.ne.jp/keyword/hoge)-training-elb
  - HTTP,[TCP](http://d.hatena.ne.jp/keyword/TCP),80,0.0.0.0/0,::/0
- DB
  - タグ名: [hoge](http://d.hatena.ne.jp/keyword/hoge)-training-db
  - インバウンドルールの編集: webサーバのsubnetからのみ3306のアクセス許可
  - カスタム [TCP](http://d.hatena.ne.jp/keyword/TCP) ルール,[TCP](http://d.hatena.ne.jp/keyword/TCP),3306,172.31.[hoge](http://d.hatena.ne.jp/keyword/hoge).0/24
  - カスタム [TCP](http://d.hatena.ne.jp/keyword/TCP) ルール,[TCP](http://d.hatena.ne.jp/keyword/TCP),3306,172.31.[hoge](http://d.hatena.ne.jp/keyword/hoge).0/24

### EC2作成・起動

[AWS](http://d.hatena.ne.jp/keyword/AWS)コンソールの`EC2→インスタンス→インスタンスの作成`から作成していく

1. AMIの選択

[AWS](http://d.hatena.ne.jp/keyword/AWS) Marketplace からCentOS7を選択

1. [インスタンス](http://d.hatena.ne.jp/keyword/%A5%A4%A5%F3%A5%B9%A5%BF%A5%F3%A5%B9)タイプの選択

t2.micro

1. 詳細設定

ネットワークで対象の[VPC](http://d.hatena.ne.jp/keyword/VPC)を選択
サブネットはそれぞれのものを選択
自動割り当てパブリック IPは有効化
ネットワーク[インターフェイス](http://d.hatena.ne.jp/keyword/%A5%A4%A5%F3%A5%BF%A1%BC%A5%D5%A5%A7%A5%A4%A5%B9)のプライマリIPで以下のを指定
- [ssh](http://d.hatena.ne.jp/keyword/ssh)
- 172.31.[hoge](http://d.hatena.ne.jp/keyword/hoge).10
- web01
- 172.31.[hoge](http://d.hatena.ne.jp/keyword/hoge).10
- web02
- 172.31.[hoge](http://d.hatena.ne.jp/keyword/hoge).10

1. ストレージの追加
2. 初期値を利用
3. ボリュームタイプは汎用[SSD](http://d.hatena.ne.jp/keyword/SSD)(GP2)
4. タグの追加

Name:[hoge](http://d.hatena.ne.jp/keyword/hoge)-training-[ssh](http://d.hatena.ne.jp/keyword/ssh)
Name:[hoge](http://d.hatena.ne.jp/keyword/hoge)-training-web01
Name:[hoge](http://d.hatena.ne.jp/keyword/hoge)-training-web02

1. セキュリティグループの設定

既存のセキュリティグループを選択

- [hoge](http://d.hatena.ne.jp/keyword/hoge)-training-[ssh](http://d.hatena.ne.jp/keyword/ssh)
- [hoge](http://d.hatena.ne.jp/keyword/hoge)-training-web
- EC2[インスタンス](http://d.hatena.ne.jp/keyword/%A5%A4%A5%F3%A5%B9%A5%BF%A5%F3%A5%B9)の起動

### EIP

[AWS](http://d.hatena.ne.jp/keyword/AWS)コンソールの`EC2→Elastic IP→新しいアドレスの割り当て`でElasticIPを作成
次に`アクション→アドレスの関連付け`で踏み台の[インスタンス](http://d.hatena.ne.jp/keyword/%A5%A4%A5%F3%A5%B9%A5%BF%A5%F3%A5%B9)とプライベートIPを選択を選択し関連付けをおす。

### ELBの作成

[AWS](http://d.hatena.ne.jp/keyword/AWS)コンソールの`EC2→ロードバランサー→ロードバランサーの作成`をクリック。
ALBのHTTP(S) で作成。

名前:[hoge](http://d.hatena.ne.jp/keyword/hoge)-training-elb
リソースはHTTPのみ
[アベイラビリティ](http://d.hatena.ne.jp/keyword/%A5%A2%A5%D9%A5%A4%A5%E9%A5%D3%A5%EA%A5%C6%A5%A3)ーゾーン:[VPC](http://d.hatena.ne.jp/keyword/VPC)と登録するEC2[インスタンス](http://d.hatena.ne.jp/keyword/%A5%A4%A5%F3%A5%B9%A5%BF%A5%F3%A5%B9)を含むAZを選択
タグ:Name,[hoge](http://d.hatena.ne.jp/keyword/hoge)-training-elb

`次の手順:セキュリティ設定の構成`を選択
以下のエラーが出るが気にせず、進む。

```
ロードバランサーのセキュリティを向上させましょう。ロードバランサーは、いずれのセキュアリスナーも使用していません。
ロードバランサーへのトラフィックを保護する必要がある場合は、フロントエンド接続に HTTPS プロトコルをお使いください。 最初のステップに戻り、基本的な設定 セクションでセキュアなリスナーを追加 / 設定することができます。または現在の設定のまま続行することもできます。
```

`ステップ 3: セキュリティグループの設定`では`既存のセキュリティグループを選択する`で既に作成したセキュリティグループを選択

`ステップ 4: ルーティングの設定`の`ターゲットグループ`では名前だけ入力

名前:ELBTARGET

`ステップ 5: ターゲットの登録` で追加したいEC2[インスタンス](http://d.hatena.ne.jp/keyword/%A5%A4%A5%F3%A5%B9%A5%BF%A5%F3%A5%B9)を選択して、`登録済みに追加`をクリック
`登録済みに追加`されたら`次の手順:確認`を選択

`ステップ 6: 確認`で問題なければ作成

### ELBの動作確認

webサーバに[centos](http://d.hatena.ne.jp/keyword/centos)をインストール

```
# yum -y install httpd
# systemctl list-unit-files -t service |grep httpd
httpd.service                                 disabled
# systemctl enable httpd.service
Created symlink from /etc/systemd/system/multi-user.target.wants/httpd.service to /usr/lib/systemd/system/httpd.service.
# systemctl list-unit-files -t service |grep httpd
httpd.service                                 enabled
# systemctl start httpd.service
```

ELBの[DNS](http://d.hatena.ne.jp/keyword/DNS)名をブラウザに入力して`index.html`の中身が表示されることを確認
ターゲットグループのターゲットから両[インスタンス](http://d.hatena.ne.jp/keyword/%A5%A4%A5%F3%A5%B9%A5%BF%A5%F3%A5%B9)が`healthy`になることを確認

### Route53の設定

ホストゾーン`ドメイン`は既にあるものなどを使い、
[hoge](http://d.hatena.ne.jp/keyword/hoge)-trainigを[サブドメイン](http://d.hatena.ne.jp/keyword/%A5%B5%A5%D6%A5%C9%A5%E1%A5%A4%A5%F3)として `ドメイン` に登録する。
ホストゾーンはその[ドメイン](http://d.hatena.ne.jp/keyword/%A5%C9%A5%E1%A5%A4%A5%F3)のリソースレコードセットの集合です。

`Route53→Hosted zones`から`ドメイン`を選択
`Create Record Set`を選択　
Name:[hoge](http://d.hatena.ne.jp/keyword/hoge)-training
Type:Aレコード([IPv4](http://d.hatena.ne.jp/keyword/IPv4))
[Value](http://d.hatena.ne.jp/keyword/Value):Alias:Yes
Alias Target:ELBの[DNS](http://d.hatena.ne.jp/keyword/DNS)名
Routing Policy:Simple

のちにAliasをCloudFrontに変更します。

### RDS 作成

[VPC](http://d.hatena.ne.jp/keyword/VPC)上にRDS[インスタンス](http://d.hatena.ne.jp/keyword/%A5%A4%A5%F3%A5%B9%A5%BF%A5%F3%A5%B9)を起動する場合、DBサブネットグループを作成する必要があるので
まずはサブネットグループを作成します。

`RDS→サブネットグループ→DBサブネットグループの作成`を選択
サブネットグループの詳細
名前:[hoge](http://d.hatena.ne.jp/keyword/hoge)-training
説明:middle engineer training ozawa subnet
VPC:trainingの[VPC](http://d.hatena.ne.jp/keyword/VPC)を選択
サブネットの追加で`アベイラビリティーゾーン`と`サブネット`

`RDS→インスタンス→DBインスタンスの起動→MySQL`を選択

DB詳細の指定

- 開発/テストを選択
- DBエンジンのバージョン
  - 最新のバージョン
- DB[インスタンス](http://d.hatena.ne.jp/keyword/%A5%A4%A5%F3%A5%B9%A5%BF%A5%F3%A5%B9)の選択
  - db.t2.micro
- マルチAZ配置
  - 別のゾーンにレプリカを作成します
- DB[インスタンス](http://d.hatena.ne.jp/keyword/%A5%A4%A5%F3%A5%B9%A5%BF%A5%F3%A5%B9)識別子
  - [hoge](http://d.hatena.ne.jp/keyword/hoge)-training-db
- マスターユーザの名前
  - root
- パスワード
  - ---

[詳細設定]の設定
ネットワーク&セキュリティ

- [VPC](http://d.hatena.ne.jp/keyword/VPC)
  - training
- サブネットグループ
  - [hoge](http://d.hatena.ne.jp/keyword/hoge)\_training
- パブリック[アクセシビリティ](http://d.hatena.ne.jp/keyword/%A5%A2%A5%AF%A5%BB%A5%B7%A5%D3%A5%EA%A5%C6%A5%A3)
  - いいえ
- [アベイラビリティ](http://d.hatena.ne.jp/keyword/%A5%A2%A5%D9%A5%A4%A5%E9%A5%D3%A5%EA%A5%C6%A5%A3)ーゾーン
  - 指定なし
- [VPC](http://d.hatena.ne.jp/keyword/VPC)セキュリティグループ
  - タグ名: [hoge](http://d.hatena.ne.jp/keyword/hoge)-training-db

データベースの設定

- データベースの名前
  - [hoge](http://d.hatena.ne.jp/keyword/hoge)\_training\_db
- データベースのポート
  - 3306
- DBパラメータグループ
  - デフォルト
- オプショングループ
  - デフォルト
- IAM DB 認証
  - 無効化

暗号化

- 無効化(無料利用枠ではデフォルトで無効)

バックアップ

- バックアップの保存期間
  - 1日
- バックアップウィンドウ
  - 開始時間20:00UTF期間0.5時間
- タグをスナップショットへコピー
  　- チェック

モニタリング

- 拡張モニタリング
  - 有効
  - モニタリングロール:デフォルト
  - 60秒

ログのエクスポート

- 監査ログ
  - 有効
- エラーログ
  - 無効
- 全般ログ
  - 有効
- スロークエリログ
  - 有効

メンテナンス

- マイナーバージョン自動アップグレード
  - 無効化
- メンテナンスウィンドウ
  - 開始日時:日曜日の21:00UTF期間0.5時間

`DBインスタンスの作成` で作成完了

webサーバに[mysql](http://d.hatena.ne.jp/keyword/mysql)クライアントを[インスタンス](http://d.hatena.ne.jp/keyword/%A5%A4%A5%F3%A5%B9%A5%BF%A5%F3%A5%B9)
RDS[インスタンス](http://d.hatena.ne.jp/keyword/%A5%A4%A5%F3%A5%B9%A5%BF%A5%F3%A5%B9)からエンドポイントを確認

```
# yum install mysql -y
# mysql -u root -h エンドポイント名 -p
```

### S3

`hoge-training.<ドメイン>` で[バケット](http://d.hatena.ne.jp/keyword/%A5%D0%A5%B1%A5%C3%A5%C8)を作成します。

`S3→バケットを作成する` で作成します。

- [バケット](http://d.hatena.ne.jp/keyword/%A5%D0%A5%B1%A5%C3%A5%C8)名を入力
- リージョンを選択
- 次へをクリック
- `フォルダの作成` で `image` フォルダを作成
- アクセス権限 → [バケット](http://d.hatena.ne.jp/keyword/%A5%D0%A5%B1%A5%C3%A5%C8)ポリシーを以下にしてパブリックにする

```
{
    "Version": "2012-10-17",
    "Id": "PublicRead",
    "Statement": [
        {
            "Sid": "ReadAccess",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::hoge-training.<ドメイン/*"
        }
    ]
}
```

プロパティの設定およびアクセス許可の設定はデフォルトのまま進めます。

### CloudFrontの設定

CloudFrontは[AWS](http://d.hatena.ne.jp/keyword/AWS)の[CDN](http://d.hatena.ne.jp/keyword/CDN)サービスです。
[CDN](http://d.hatena.ne.jp/keyword/CDN)とはコンテンツを配信するために最適化されたネットワークのことです。
分散して配置されたサーバからコンテンツを配布することで効率的にコンテンツを配信する仕組み。

CloudFrontは[AWS](http://d.hatena.ne.jp/keyword/AWS)が世界中に配置したエッジサーバを利用して効率的にコンテンツを配信します。
エッジサーバはCloudFrontのコンテンツの配布ポイントでユーザーのアクセスを最も近くにあるエッジサーバに誘導します。
「xxx.cloudfront.net」という[ドメイン](http://d.hatena.ne.jp/keyword/%A5%C9%A5%E1%A5%A4%A5%F3)にアクセスすると、最も近いエッジサーバの[IPアドレス](http://d.hatena.ne.jp/keyword/IP%A5%A2%A5%C9%A5%EC%A5%B9)が返されます。
CloudFrontではコンテンツの配信元のサーバをオリジンサーバと呼びます。
CloudFrontを利用していない場合は、全てのアクセスがオリジンサーバにいくが、
利用するとオリジンサーバに到達する前に、エッジサーバがコンテンツを返す。
そのため、オリジンサーバの負荷を下げることができ負荷分散としても大きな意味があります。
なのでEC2やS3等コンテンツを配信するサーバの前には、なるべくCloudFrontを配置するべき。

エッジロケーションはエッジサーバが存在する地域で、日本では東京と大阪にある。

`CloudFront→Create Distribution`をクリック

- コンテンツの配信方法の選択

HTTP[S]で表示するWEBコンテンツの配信なのでWEBを選択します。

- Distributionの設定

OriginSettingでオリジンサーバの設定をします。
今回CloudFrontはS3とALBの前に設置するので、
`Origin Domain Name` にS3とALBを選択して入力することになります。

- Origin Domain Name
  - [hoge](http://d.hatena.ne.jp/keyword/hoge)-training.<[ドメイン](http://d.hatena.ne.jp/keyword/%A5%C9%A5%E1%A5%A4%A5%F3)>.s3.amazonaws.com
- Behaviors
  - /image/\* 300 秒キャッシュ
- Origin Domain Name
  - [hoge](http://d.hatena.ne.jp/keyword/hoge)-training-elb-1353485913.ap-northeast-1.elb.amazonaws.com
- Behaviors

  - /js/\* 600 秒キャッシュ
  - /[css](http://d.hatena.ne.jp/keyword/css)/\* 600 秒キャッシュ
  - Default (\*)
- Distributionの設定(Origin Settings)

オリジンサーバの設定をする

| 設定項目 | 値 | 説明 |
| --- | --- | --- |
| Origin Domain Name | S3[バケット](http://d.hatena.ne.jp/keyword/%A5%D0%A5%B1%A5%C3%A5%C8)のエンドポイント | オリジンサーバの[ドメイン](http://d.hatena.ne.jp/keyword/%A5%C9%A5%E1%A5%A4%A5%F3)を入力 |
| Origin Path | 値なし | CloudFrontへのリク[エス](http://d.hatena.ne.jp/keyword/%A5%A8%A5%B9)トをオリジンサーバの特定のパスにルーティングしたい場合に設定。 |
| Origin ID | 任意の名前 | このDistributionを区別するための名前を設定 |
| Restrict [Bucket](http://d.hatena.ne.jp/keyword/Bucket) [Access](http://d.hatena.ne.jp/keyword/Access) | No | オリジンがS3の場合のみ有効。S3[バケット](http://d.hatena.ne.jp/keyword/%A5%D0%A5%B1%A5%C3%A5%C8)のコンテンるへのアクセスをCloudFrontからのみに制限する場合はYes。直接エンドポイントにアクセスできるようにするならNo |
| Origin Custom Headers | 値なし | リク[エス](http://d.hatena.ne.jp/keyword/%A5%A8%A5%B9)トをオリジンサーバに転送する際のヘッダーを指定 |

- Default Cache Behavior Setting

キャッシュの動作の設定をする

| 設定項目 | 値 | 説明 |
| --- | --- | --- |
| Path Pattern | Default(\*) | キャッシュを有効にするパスのパターンを指定。 |
| Viewer Priticol Policy | HTTP and [HTTPS](http://d.hatena.ne.jp/keyword/HTTPS) | コンテンツにアクセスする際にどの[プロトコル](http://d.hatena.ne.jp/keyword/%A5%D7%A5%ED%A5%C8%A5%B3%A5%EB)を使用するか選択 |
| Allowed HTTP Methods | GET,HEAD | エンドユーザーに許可するHTTPメソッドを選択 |
| Field-level Encryption Config | 値なし | 特定のデータフィールドにフィードレベル暗号化を適用する場合に指定 |
| Cached HTTP Methods | GET,HEAD | CloudFrontでのキャッシュが有効になるHTTPメソッドを選択 |
| Cached Based on Selected Request Headers | None | CloudFrontがオリジンサーバに転送するリク[エス](http://d.hatena.ne.jp/keyword/%A5%A8%A5%B9)トヘッダーの指定とヘッダー値に基づいてオブジェクトをキャッシュするかの設定を行う。 |
| Object Caching | Use Origin Cache Headers | CloudFrontがキャッシュを保持する時間の設定。オリジンサーバで追加したCache-COntorolの時間に応じてキャッシュを保持する場合は、今回の値を設定する。 |
| Minimum [TTL](http://d.hatena.ne.jp/keyword/TTL) | 0 | キャッシュの最小保持期間 |
| Maximum [TTL](http://d.hatena.ne.jp/keyword/TTL) | 31536000 | キャッシュの最大保持期間 |
| Default [TTL](http://d.hatena.ne.jp/keyword/TTL) | 86400 | キャッシュのデフォルトの保持期間 |
| Foward Cookied | None | CloudFrontからオリジンサーバに転送する[Cookie](http://d.hatena.ne.jp/keyword/Cookie)を指定。オリジンがS3のときは無効。 |
| Query String Fowarding and Caching | None | クエリ文字列に基づいてキャッシュを行う |
| Smooth Streaming | No | [Microsoft](http://d.hatena.ne.jp/keyword/Microsoft)スムーズストリーミング形式のメディアファイルを配信する場合はYES |
| Restrict Viewer [Access](http://d.hatena.ne.jp/keyword/Access) | No | 署名付きURLを利用するかの選択 |
| Compress Objects Automatically | No | ファイルを自動的に圧縮する |
| Lambda Function Assopciations | 値なし | トリガーを追加するLambda関数のARNを指定 |

- Distribution Setting

Distributionの詳細を設定

| 設定項目 | 値 | 説明 |
| --- | --- | --- |
| Price Class | Use ALL Edge Locations | 価格クラスを選択。 |
| [AWS](http://d.hatena.ne.jp/keyword/AWS) WAF Web [ACL](http://d.hatena.ne.jp/keyword/ACL) | None | [AWS](http://d.hatena.ne.jp/keyword/AWS) WAFを使用する場合にウェブ[ACL](http://d.hatena.ne.jp/keyword/ACL)を選択する・ |
| Alternate Domain Names | 値なし | [独自ドメイン](http://d.hatena.ne.jp/keyword/%C6%C8%BC%AB%A5%C9%A5%E1%A5%A4%A5%F3)を利用する場合に設定 |
| [SSL](http://d.hatena.ne.jp/keyword/SSL) Certificate | Default CloudFrint Cerificate | DefaultではCloudFrontにデフォルトで用意されている証明書を利用する。 |
| Supported HTTP Versions | HTTP/2,HTTP/1.1,HTTP/1.0 | CloudFrontとの通信に使用するHTTPバージョンを指定 |
| Default Root Object | index.html | デフォルトのルートオブジェクトを設定 |
| Logging | OFF | ログを取得するか設定 |
| [Bucket](http://d.hatena.ne.jp/keyword/Bucket) for Logs | 値なし | ログを配置するS3の[バケット](http://d.hatena.ne.jp/keyword/%A5%D0%A5%B1%A5%C3%A5%C8)を選択 |
| Log Prefix | 値なし | ログファイル名の戦闘につける文字列を指定 |
| [Cookie](http://d.hatena.ne.jp/keyword/Cookie) Logging | off | ログに[Cookie](http://d.hatena.ne.jp/keyword/Cookie)も記録するか選択 |
| Enable [IPv6](http://d.hatena.ne.jp/keyword/IPv6) | 有効 | [IPv6](http://d.hatena.ne.jp/keyword/IPv6)を有効にするか選択 |
| Comment | 値なし | 入力は任意。 |
| Distribution State | Enabled | Distributionの使用準備が整ったあと、自動的にこのDistributionを有効にするか選択 |

Deployedになったら、Domain Nameに表示されている「\*\*\*\*.cloudfront.net」にアクセスすればS3のコンテンツが表示されます。

- Route53との連系

Route53にCLoudFrontのエンドポイントを設定することで、[独自ドメイン](http://d.hatena.ne.jp/keyword/%C6%C8%BC%AB%A5%C9%A5%E1%A5%A4%A5%F3)でCloudFrontを利用することができます。
作成したDistributionを選択し、Distribution Settingをクリック。
GeneralタブのEditで編集画面に行き、Alternate Domain Namesに設定したい[独自ドメイン](http://d.hatena.ne.jp/keyword/%C6%C8%BC%AB%A5%C9%A5%E1%A5%A4%A5%F3)を入力する。

次にRoute5→Hotsted Zonesから使用する[独自ドメイン](http://d.hatena.ne.jp/keyword/%C6%C8%BC%AB%A5%C9%A5%E1%A5%A4%A5%F3)のホストゾーンを選択し、Aliasレコードを追加する。

## 確認項目

セキュリティ

- [SSH](http://d.hatena.ne.jp/keyword/SSH) 事務所からのみ接続できることを確認
- HTTP 事務所からのみ閲覧できることを確認
- [MySQL](http://d.hatena.ne.jp/keyword/MySQL) web サーバからのみ接続できることを確認

RDS

- 手動フェイルオーバを行なう
  - AZ が切り替わっていることを確認
  - サービスが閲覧できることを確認

S3

- web サーバから [aws](http://d.hatena.ne.jp/keyword/aws) コマンドを利用してS3 の[バケット](http://d.hatena.ne.jp/keyword/%A5%D0%A5%B1%A5%C3%A5%C8)にテストファイルをアップロードする
- S3 の[バケット](http://d.hatena.ne.jp/keyword/%A5%D0%A5%B1%A5%C3%A5%C8)から [aws](http://d.hatena.ne.jp/keyword/aws) コマンドを利用してテストファイルをダウンロードする
- 踏み台からは S3 操作が不可であることを確認する

EBS

- web サーバから [aws](http://d.hatena.ne.jp/keyword/aws) コマンドを利用して、EBS スナップショットを取得する
- 踏み台からは EBS スナップショット取得が出来ないことを確認

サイト表示

- yourname-training.<[ドメイン](http://d.hatena.ne.jp/keyword/%A5%C9%A5%E1%A5%A4%A5%F3)> 画面表示が正常であることを確認
  - web01, web02 に分散されていることを確認
  - web01 を ELB から切り離しても正常に閲覧できることを確認
- image 配下へのアクセス
  - S3 へアクセスが行っていることを確認
- js, [css](http://d.hatena.ne.jp/keyword/css) 配下へのアクセス ELB を経由していることを確認
  - キャッシュ時間に応じてキャッシュされていることを確認

上記以外   
- ELB を経由していることを確認   
- キャッシュされていないことを確認
