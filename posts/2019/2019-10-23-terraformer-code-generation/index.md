---
title: "terraformerを使ってコード化対応"
date: "2019-10-23"
---

手動で管理していたCloudDNSをコード管理したかったので、[terraformer](https://github.com/GoogleCloudPlatform/terraformer)を使ってコード化しました。

## Installation

`brew install terraformer`

## 事前準備

コマンド実行したら以下エラーが出たので、[ディレクト](http://d.hatena.ne.jp/keyword/%A5%C7%A5%A3%A5%EC%A5%AF%A5%C8)リにpluginをinstall

> Copy your Terraform provider's plugin(s) to folder ~/.terraform.d/plugins/{[darwin](http://d.hatena.ne.jp/keyword/darwin),[linux](http://d.hatena.ne.jp/keyword/linux)}\_[amd64](http://d.hatena.ne.jp/keyword/amd64)/, as appropriate.

```
mkdir -p ~/.terraform.d/plugins/darwin_amd64
cd ~/.terraform.d/plugins/darwin_amd64
wget https://releases.hashicorp.com/terraform-provider-google/2.17.0/terraform-provider-google_2.17.0_darwin_amd64.zip
unzip terraform-provider-google_2.17.0_darwin_amd64.zip
```

## Command実行

CloudDNSの以下リソースのコード化を実行

- [google](http://d.hatena.ne.jp/keyword/google)\_[dns](http://d.hatena.ne.jp/keyword/dns)\_managed\_zone
- [google](http://d.hatena.ne.jp/keyword/google)\_[dns](http://d.hatena.ne.jp/keyword/dns)\_record\_set

```
terraformer import google --resources=dns --projects=hogehoge --regions=asia-northeast1
2019/10/23 13:47:53 google importing project hogehoge region asia-northeast1
2019/10/23 13:47:54 google importing... dns
...

2019/10/23 13:48:00 google Connecting....
2019/10/23 13:48:00 google save dns
2019/10/23 13:48:00 google save tfstate for dns
```

tfstateファイルとtfファイルが作成されていることを確認

```
ll generated/google/hogehoge/dns/asia-northeast1/
 default.tfstate*
 dns_managed_zone.tf*
 dns_record_set.tf*
 outputs.tf*
 provider.tf*
```
