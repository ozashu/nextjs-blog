---
title: "Terraform0.13へのUpgrade"
date: "2020-10-14"
---

Terraform0.13にUpgradeの手順と詰まったPointをメモ

## 事前準備

こんなアド[バイス](http://d.hatena.ne.jp/keyword/%A5%D0%A5%A4%A5%B9)を受けていたので、先にproviderのバージョンをあげます。

```
古い環境からterraform v0.13.0+aws providerv3に一気に上げるとtfstateが不整合っぽいエラーでまくるので、
terraformv0.12.x+aws provider v3で一度apply通してから（何のリソースでもok）だとエラーなくなるので、その順番で0.13に上げると良さそうです
```

## 手順

各providerも0.13に対応させる
terraform 0.13upgradeを各ステートに実行
terraform init,applyを実行して通ればOK

## 詰まったところ

1. providerが読み込めないと怒られる

workspaceごとにterraform init,applyをしてstateを最新にしたら突破できました。

```
Error: Could not load plugin

Plugin reinitialization required. Please run "terraform init".

Plugins are external binaries that Terraform uses to access and manipulate
resources. The configuration provided requires plugins which can't be located,
don't satisfy the version constraints, or are otherwise incompatible.

Terraform automatically discovers provider requirements from your
configuration, including providers used in child modules. To see the
requirements and constraints, run "terraform providers".

7 problems:

- Failed to instantiate provider "registry.terraform.io/-/archive" to obtain
schema: unknown provider "registry.terraform.io/-/archive"
- Failed to instantiate provider "registry.terraform.io/-/aws" to obtain
schema: unknown provider "registry.terraform.io/-/aws"
```

以下のように直せばOK

```
export AWS_ACCOUNT_ID=${AWS_ACCOUNT_ID}; eval $(aws sts assume-role --role-arn arn:aws:iam::${AWS_ACCOUNT_ID}:role/AdminAssumeRole --role-session-name "terraform_session" --output json | jq -r '.Credentials|"export AWS_ACCESS_KEY_ID="+.AccessKeyId+"\nexport AWS_SECRET_ACCESS_KEY="+.SecretAccessKey+"\nexport AWS_SESSION_TOKEN="+.SessionToken')
terraform init -backend-config "key=env-terraform.tfstate" 
terraform get                                                                                                                                                                                                  
terraform workspace select env
terraform state replace-provider 'registry.terraform.io/-/archive' 'registry.terraform.io/hashicorp/archive' -auto-approve 
terraform state replace-provider 'registry.terraform.io/-/aws' 'registry.terraform.io/hashicorp/aws' -auto-approve 
terraform state replace-provider 'registry.terraform.io/-/kubernetes' 'registry.terraform.io/hashicorp/kubernetes' -auto-approve 
terraform state replace-provider 'registry.terraform.io/-/local' 'registry.terraform.io/hashicorp/local' -auto-approve 
terraform state replace-provider 'registry.terraform.io/-/null' 'registry.terraform.io/hashicorp/null' -auto-approve 
terraform state replace-provider 'registry.terraform.io/-/random' 'registry.terraform.io/hashicorp/random' -auto-approve 
terraform state replace-provider 'registry.terraform.io/-/template' 'registry.terraform.io/hashicorp/template' -auto-approve
```

1. regionを指定しろと怒られる

```
provider.aws.region
  The region where AWS operations will take place. Examples
  are us-east-1, us-west-2, etc.
  Enter a value: 
Refreshing Terraform state in-memory prior to plan...
The refreshed state will be used to calculate this plan, but will not be
persisted to local or remote state storage.
```

providerのregionの指定の仕方が変わっていた[これ](https://registry.terraform.io/providers/hashicorp/aws/latest/docs#example-usage)を参考に書き直しました。

## 参考手順

[Upgrading to Terraform v0.13](https://www.terraform.io/upgrade-guides/0-13.html)
[Terraform AWS Provider Version 3 Upgrade Guide](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/guides/version-3-upgrade)
[Terraform Google Provider 3.0.0 Upgrade Guide](https://www.terraform.io/docs/providers/google/guides/version_3_upgrade.html#resource-google_compute_network)
