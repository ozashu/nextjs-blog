---
title: "Terraformの基本"
date: "2019-05-07"
---

terraformの基本事項について[aws](http://d.hatena.ne.jp/keyword/aws) providerを使用して確認していく。
terraformコマンドで構築する前にクレデンシャル情報を[環境変数](http://d.hatena.ne.jp/keyword/%B4%C4%B6%AD%CA%D1%BF%F4)に渡しておくのを忘れずに。

```
export AWS_ACCESS_KEY_ID=hogehoge
export AWS_SECRET_ACCESS_KEY=hogehoge
export AWS_DEFAULT_REGION=hogehoge
```

## コマンド

`terraform init` はプロバイダ用のバイナリをダウンロードする。
`terraform plan` はdry-run
`terraform apply` でplanの内容を実行する

## 要注意メッセージ

リソースの再作成

`# aws_instance.example must be replaced` 例えば、[aws](http://d.hatena.ne.jp/keyword/aws)のproviderでinstanceを作っていたとして、
何かtfファイルを編集したら[インスタンス](http://d.hatena.ne.jp/keyword/%A5%A4%A5%F3%A5%B9%A5%BF%A5%F3%A5%B9)が再作成されてしまったなんてことが起きるので注意。
destroyも要確認。

## Terraform の構成要素

1. 変数

variableで変数の定義ができる。

```
variable "example_instance_type" {
  default = "t3.micro"
}

resource "aws_instance" "example" {
  ami           = "ami-0f9ae750e8274075b"
  instance_type = var.example_instance_type
}
```

`locals` でローカル変数が定義できる。
variableはコマンド実行時に変数を上書きできるがlocalsは上書きできない違いがある。

1. output

`output` で値を出力することができる
apply時にターミナル上で値が確認できるようになる。
他にはmoduleから値を取得する時に使う。

```
variable "example_instance_type" {
  default = "t3.micro"
}

resource "aws_instance" "example" {
  ami           = "ami-0f9ae750e8274075b"
  instance_type = var.example_instance_type
}

output "example_instance_id" {
  value = aws_instance.example.id
}
```

applyすると、実行結果に、作成された[インスタンス](http://d.hatena.ne.jp/keyword/%A5%A4%A5%F3%A5%B9%A5%BF%A5%F3%A5%B9)の ID が出力される。

```
Outputs:

example_instance_id = i-090d4a8d3ec3fac74
```

1. データソース

データソースを使うと外部データを参照できる。

最新のAmazonLinux2のAMIを以下のように定義して参照してみる、
`filter` などを使って検索条件を指定し、`most_recent` で最新のAMIを取得している。

```
data "aws_ami" "recent_amazon_linux_2" {
  most_recent = true
  owners      = ["amazon"]

  filter {
    name   = "name"
    values = ["amzn2-ami-hvm-2.0.????????-x86_64-gp2"]
  }

  filter {
    name      = "state"
    variables = ["abailable"]
  }
}

resource "aws_instance" "example" {
  ami           = data.aws_ami.recent_amazon_linux_2.image_id
  instance_type = "t3.micro"
}
```

1. provider

[AWS](http://d.hatena.ne.jp/keyword/AWS)、[GCP](http://d.hatena.ne.jp/keyword/GCP)、Azure、Openstackなど構築する際、その[API](http://d.hatena.ne.jp/keyword/API)の違いを吸収するものがプロバイダ。

リージョンの定義を[aws](http://d.hatena.ne.jp/keyword/aws) mojuleを使ってするとこうなる。

```
provider "aws" {
  region = "ap-northeast-1"
}
```

## Interpolation Syntax

1. 参照

EC2 向けセキュリティグループの定義

80 番ポートを許可すると以下
※接続元のIPアドレスを制限していないです

```
resource "aws_security_group" "example_ec2" {
  name = "example-ec2"

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
```

`vpc_security_group_ids` からセキュリティグループへの参照を追加し、EC2[インスタンス](http://d.hatena.ne.jp/keyword/%A5%A4%A5%F3%A5%B9%A5%BF%A5%F3%A5%B9)と紐づけます。
`vpc_security_group_ids` はリスト形式で渡すため、値を `[]` で囲んでいます。
`TYPE.NAME.ATTRIBUTE` の形式で他のリソースの値を参照できます。

```
variable "example_instance_type" {
  default = "t3.micro"
}

resource "aws_instance" "example" {
  ami           = "ami-0f9ae750e8274075b"
  instance_type = var.example_instance_type
  vpc_security_group_ids = [aws_security_group.example_ec2.id]

  user_data = <<EOF
#!/bin/bash
  yum install -y httpd
  systemctl start httpd.service
EOF
}

output "example_public_dns" {
  value = aws_instance.example.public_dns
}
```

1. 条件分岐

Terraform では、[三項演算子](http://d.hatena.ne.jp/keyword/%BB%B0%B9%E0%B1%E9%BB%BB%BB%D2)が使える。
本番環境と開発環境で[インスタンス](http://d.hatena.ne.jp/keyword/%A5%A4%A5%F3%A5%B9%A5%BF%A5%F3%A5%B9)タイプを切り替えたい時。

```
variable "env" {}

resource "aws_instance" "example" {
  ami           = "ami-0f9ae750e8274075b"
  instance_type = var.env == "prod" ? "m5.large" : "t3.micro"
}
```

env変数をTerrafor 実行時に切り替えると、plan 結果が変わる。

```
$ terraform plan -var 'env=prod'
$ terraform plan -var 'env=dev'
```

ただ環境を分けたい時は[ディレクト](http://d.hatena.ne.jp/keyword/%A5%C7%A5%A3%A5%EC%A5%AF%A5%C8)リで分けたりしてもよいかな。

1. 組み込み関数

Terraform には、文字列操作やリスト操作、よくある処理が組み込み関数として提供されている。
外部ファイルを読み込む file 関数を使ってみる。

ユーザデータを `user_data.sh` として[スクリプト](http://d.hatena.ne.jp/keyword/%A5%B9%A5%AF%A5%EA%A5%D7%A5%C8)で外に出す。
`main.tf` ファイルと同じディレクトリに置く。

```
#!/bin/bash
yum install -y httpd
systemctl start httpd.service
```

以下でapply すると、`user_data.sh` ファイルを読み込んでくれる。

```
resource "aws_instance" "example" {
  ami           = "ami-0f9ae750e8274075b"
  instance_type = "t3.micro"
  user_data     = file("./user_data.sh")
}
```

1. テンプレート

Terraform には、実行時に値を埋め込むテンプレート機能がある。
`user_data.sh` を `user_data.sh.tpl` とテンプレートファイル化してみる。
インストールパッケージを差し替えられるように、「package」変数を定義する。

```
#!/bin/sh
yum install -y ${package}
systemctl start ${package}.service
```

これを利用するために `template_file` データソースを定義する
`template` に、テンプレートファイルのパスを指定する
vars 句を記述すると、テンプレートの変数に値を代入できる

```
data "template_file" "httpd_user_data" {
  template = file("./user_data.sh.tpl")

  vars = {
    package = "httpd"
  } 
}
```

`template_file` データソースを参照する
`data.template_file.httpd_user_data.rendered`のように記述することで、テンプレートに変数を埋め込んだ結果を取得できる

```
resource "aws_instance" "example" {
  ami           = "ami-0f9ae750e8274075b"
  instance_type = "t3.micro"
  user_data     = data.template_file.httpd_user_data.rendered
}
```

## tfstateファイル

Terraform が変更した差分を検出して、必要な部分だけ変更できることが確認できた。
この判断をtfstateファイルで行っている。
tfstate ファイルは Terraform が生成するファイルで、現在の状態が記録されている。
Terraform は tfstate ファイルと、HCL で記述されたコードの内容に差分があれば、その差分のみを変更するよう振る舞う。
`terraform.tfstate` ファイルは `terraform apply` を実行していれば作成される。
中身を見ると[JSON](http://d.hatena.ne.jp/keyword/JSON)文字列に、現在の状態が記述されているのがわかる。

tfstateファイルは `terraform apply` を実行したローカルに保存されるが、
これだとチーム開発したときに、他の人にtfstateファイルがないことになってしまい、
全リソース再作成が起きるおそれがあるので、リモートのストレージを、バックエンドとして利用しましょう。[AWS](http://d.hatena.ne.jp/keyword/AWS)ならS3などを利用しましょう。

tfstateの格納先が記載されたファイル `init.tf` を作り、事前作成したバケットを指定します。

```
terraform {
  backend "s3" {
    bucket = "tfstate-pragmatic-terraform-on-aws"
    key    = "example/terraform.tfstate"
    region = "ap-northeast-1"
  }
}
```

リモートのバックエンドとして使用するS3[バケット](http://d.hatena.ne.jp/keyword/%A5%D0%A5%B1%A5%C3%A5%C8)には、バージョニング設定をすることが強く推奨されます。
S3に保存すれば、tfstateファイルから、いつでも以前の状態に戻せるようにもなります。
また、DynamoDB と組み合わせると、[ロックも可能](https://www.terraform.io/docs/backends/types/s3.html)

## リソースの削除

`terraform destroy` でリソース削除できます。実行には注意しましょう。

## モジュール

Terraform にもモジュール化の仕組みがあります。
モジュールは別ディレクトリにする必要があるので、まずは `modules` ディレクトリを 作成します。
そして、モジュールを定義する `main.tf` ファイルを作成します。
利用する側を `resources` [ディレクト](http://d.hatena.ne.jp/keyword/%A5%C7%A5%A3%A5%EC%A5%AF%A5%C8)リなどにして、そこに環境ごとにpathを切ってmain.tfを置けば
`modules` 配下のmoduleを環境毎に再利用することも可能になります。

1. モジュールの定義

http\_server モジュールを実装します。
[Apache](http://d.hatena.ne.jp/keyword/Apache) をインストール した EC2 [インスタンス](http://d.hatena.ne.jp/keyword/%A5%A4%A5%F3%A5%B9%A5%BF%A5%F3%A5%B9)と、80 番ポートを許可したセキュリティグループを定義してみます。
http\_server モジュールのインタフェースは次のとおりです。
- 入力パラメータ `instance_type` - EC2 の[インスタンス](http://d.hatena.ne.jp/keyword/%A5%A4%A5%F3%A5%B9%A5%BF%A5%F3%A5%B9)タイプ
- 出力パラメータ `public_dns` - EC2 のパブリック [DNS](http://d.hatena.ne.jp/keyword/DNS)

```
variable "instance_type" {}

resource "aws_instance" "default" {
  ami                    = "ami-0f9ae750e8274075b"
  vpc_security_group_ids = [aws_security_group.default.id]
  instance_type          = var.instance_type
  
  user_data = <<EOF
    #!/bin/bash
    yum install -y httpd
    systemctl start httpd.service
EOF
}

resource "aws_security_group" "default" {
  name = "ec2"

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

output "public_dns" {
  value = aws_instance.default.public_dns
}
```

1. モジュールの利用

モジュール利用側の main.tf ファイルを以下のように実装します。
利用するモジュールは `source` に指定します。

```
module "dev_server" {
  source        = "./http_server"
  instance_type = "t3.micro"
}

output "public_dns" {
  value = module.dev_server.public_dns
}
```

apply はモジュール利用側のディレクトリで実行します。
ただし、モジュールを使用する場合、もうひと手間必要です。
`terraform get` コマンドか `terraform init` コマンドを実行して、モジュールを事前に取得しておく必要があります。
`terraform init` を実行する[スクリプト](http://d.hatena.ne.jp/keyword/%A5%B9%A5%AF%A5%EA%A5%D7%A5%C8)を作成して、circle ciなどを利用してinitで失敗したらbuildが失敗するようにする運用がいいと思う。
