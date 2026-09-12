---
title: "Terraform and CORS-Enabled AWS API Gateway and AWS WAF   "
date: "2019-03-27"
---

この記事は[AWS](http://d.hatena.ne.jp/keyword/AWS) WAF と [API](http://d.hatena.ne.jp/keyword/API) [Gateway](http://d.hatena.ne.jp/keyword/Gateway) endpoint で CORS を有効化について。

以下にsampleを載せてあります。

[REST API](http://d.hatena.ne.jp/keyword/REST%20API) リソースが [API](http://d.hatena.ne.jp/keyword/API) 独自の[ドメイン](http://d.hatena.ne.jp/keyword/%A5%C9%A5%E1%A5%A4%A5%F3)以外の[ドメイン](http://d.hatena.ne.jp/keyword/%A5%C9%A5%E1%A5%A4%A5%F3)からリク[エス](http://d.hatena.ne.jp/keyword/%A5%A8%A5%B9)トを受け取る場合、
リソースの選択されたメソッドで Cross-Origin Resource Sharing (CORS) を有効にする必要があるので、

CORS 対応のために、今回は以下のレスポンスヘッダーを付与させます。

- [Access](http://d.hatena.ne.jp/keyword/Access)-Control-Allow-Origin

# [API](http://d.hatena.ne.jp/keyword/API) [Gateway](http://d.hatena.ne.jp/keyword/Gateway) の[REST API](http://d.hatena.ne.jp/keyword/REST%20API)の設定

WAFと[API](http://d.hatena.ne.jp/keyword/API) [Gateway](http://d.hatena.ne.jp/keyword/Gateway)をつなげるので、 `endpoint_configuration`の設定が必要になる。

```
    ## API Gateway - Rest API
    resource "aws_api_gateway_rest_api" "rest_api" {
      name                     = "${var.env}-${var.name}-api-gateway"
      description              = "${var.env}-${var.name}-api-gateway"
      minimum_compression_size = 0
    
      endpoint_configuration {
        types = ["REGIONAL"]
      }
    }
```

# [API](http://d.hatena.ne.jp/keyword/API) [Gateway](http://d.hatena.ne.jp/keyword/Gateway)のResourcesの設定

TerraformのProviderを参考に作成するだけで大丈夫。

```
    ## API Gateway - Resources
    resource "aws_api_gateway_resource" "resource" {
      depends_on  = ["aws_api_gateway_rest_api.rest_api"]
      rest_api_id = "${aws_api_gateway_rest_api.rest_api.id}"
      parent_id   = "${aws_api_gateway_rest_api.rest_api.root_resource_id}"
      path_part   = "${var.name}"
    }
```

# [API](http://d.hatena.ne.jp/keyword/API) [Gateway](http://d.hatena.ne.jp/keyword/Gateway)のMethodの設定

`response_models` や `response_parameters` をつける以外は

TerraformのProviderを参考に作成するだけで大丈夫。

CORS対応のために `Access-Control-Allow-Origin`をレスポンスヘッダに付与させます。

```
    ## API Gateway - Method Setting
    # post
    resource "aws_api_gateway_method" "method_post" {
      depends_on       = ["aws_api_gateway_resource.resource"]
      rest_api_id      = "${aws_api_gateway_rest_api.rest_api.id}"
      resource_id      = "${aws_api_gateway_resource.resource.id}"
      http_method      = "POST"
      authorization    = "NONE"
      api_key_required = false
    
      request_parameters = {
        "method.request.querystring.key" = true
      }
    }
    
    resource "aws_api_gateway_method_response" "method_response_post_200" {
      depends_on  = ["aws_api_gateway_method.method_post"]
      rest_api_id = "${aws_api_gateway_rest_api.rest_api.id}"
      resource_id = "${aws_api_gateway_resource.resource.id}"
      http_method = "${aws_api_gateway_method.method_post.http_method}"
      status_code = "200"
    
      response_models = {
        "application/json" = "Empty"
      }
    
      response_parameters {
        "method.response.header.Access-Control-Allow-Origin" = true
      }
    }
    
    resource "aws_api_gateway_method_response" "method_response_post_400" {
      depends_on  = ["aws_api_gateway_method.method_post"]
      rest_api_id = "${aws_api_gateway_rest_api.rest_api.id}"
      resource_id = "${aws_api_gateway_resource.resource.id}"
      http_method = "${aws_api_gateway_method.method_post.http_method}"
      status_code = "400"
    
      response_models = {
        "application/json" = "Empty"
      }
    
      response_parameters {
        "method.response.header.Access-Control-Allow-Origin" = true
      }
    }
```

# [API](http://d.hatena.ne.jp/keyword/API) [Gateway](http://d.hatena.ne.jp/keyword/Gateway)のIntegrationの設定

- ハマりポイント
  - `selection_pattern` が必要
  - `aws_api_gateway_integration_response` は `aws_api_gateway_method_response`に依存する。

```
    ## API Gateway - Integration Setting
    resource "aws_api_gateway_integration" "integration_post" {
      depends_on              = ["aws_api_gateway_method.method_post"]
      rest_api_id             = "${aws_api_gateway_rest_api.rest_api.id}"
      resource_id             = "${aws_api_gateway_resource.resource.id}"
      http_method             = "${aws_api_gateway_method.method_post.http_method}"
      integration_http_method = "POST"
      type                    = "HTTP"
      uri                     = "${var.url}"
    }
    
    resource "aws_api_gateway_integration_response" "integration_response_post_200" {
      depends_on  = ["aws_api_gateway_method_response.method_response_post_200"]
      rest_api_id = "${aws_api_gateway_rest_api.rest_api.id}"
      resource_id = "${aws_api_gateway_resource.resource.id}"
      http_method = "${aws_api_gateway_method.method_post.http_method}"
      status_code = "${aws_api_gateway_method_response.method_response_post_200.status_code}"
      selection_pattern = "200"
    
      response_templates = {
        "application/json" = ""
      }
    
      response_parameters = {
        "method.response.header.Access-Control-Allow-Origin" = "'*'"
      }
    }
    
    resource "aws_api_gateway_integration_response" "integration_response_post_400" {
      depends_on  = ["aws_api_gateway_method_response.method_response_post_400"]
      rest_api_id = "${aws_api_gateway_rest_api.rest_api.id}"
      resource_id = "${aws_api_gateway_resource.resource.id}"
      http_method = "${aws_api_gateway_method.method_post.http_method}"
      status_code = "${aws_api_gateway_method_response.method_response_post_400.status_code}"
      selection_pattern = "4\\d{2}"
    
      response_templates = {
        "application/json" = ""
      }
    
      response_parameters = {
        "method.response.header.Access-Control-Allow-Origin" = "'*'"
      }
    }
```

[API](http://d.hatena.ne.jp/keyword/API) [Gateway](http://d.hatena.ne.jp/keyword/Gateway) では、Mock 統合タイプで `OPTIONS` メソッドを設定して CORS を有効にし、
前述のレスポンスヘッダーをメソッドのレスポンスヘッダーとして返す。
200 レスポンスで `Access-Control-Allow-Origin:'*request-originating server addresses*'` ヘッダーを返すようにすること。
特定の *`request-originating server addresses`* の静的な値を `*` に置き換えることもできるけど
広範なサポートを有効にすることはよく考えること。任意のサーバーを指定可能なのでできるならその方がよいので。

今回では `*` をつけています。
今回はMock統合タイプでbackendが[Google](http://d.hatena.ne.jp/keyword/Google) Formを例にしている。

`Access-Control-Allow-Origin`を設定すれば `CORS` は有効化できます。

- ハマりポイント
  - `OPTIONS` メソッドを使用するのを忘れない
  - `selection_pattern` が必要
  - `aws_api_gateway_integration_response` は `aws_api_gateway_method_response`に依存する。

```
    # options
    resource "aws_api_gateway_method" "method_options" {
      depends_on       = ["aws_api_gateway_resource.resource"]
      rest_api_id      = "${aws_api_gateway_rest_api.rest_api.id}"
      resource_id      = "${aws_api_gateway_resource.resource.id}"
      http_method      = "OPTIONS"
      authorization    = "NONE"
      api_key_required = false
    
      request_parameters = {
        "method.request.querystring.key" = true
      }
    }
    
    resource "aws_api_gateway_method_response" "method_response_options_200" {
      depends_on  = ["aws_api_gateway_method.method_options"]
      rest_api_id = "${aws_api_gateway_rest_api.rest_api.id}"
      resource_id = "${aws_api_gateway_resource.resource.id}"
      http_method = "${aws_api_gateway_method.method_options.http_method}"
      status_code = "200"
    
      response_models = {
        "application/json" = "Empty"
      }
    
      response_parameters {
        "method.response.header.Access-Control-Allow-Origin" = true
      }
    }
    
    resource "aws_api_gateway_method_response" "method_response_options_400" {
      depends_on  = ["aws_api_gateway_method.method_options"]
      rest_api_id = "${aws_api_gateway_rest_api.rest_api.id}"
      resource_id = "${aws_api_gateway_resource.resource.id}"
      http_method = "${aws_api_gateway_method.method_options.http_method}"
      status_code = "400"
    
      response_models = {
        "application/json" = "Empty"
      }
    
      response_parameters {
        "method.response.header.Access-Control-Allow-Origin" = true
      }
    }
    
    resource "aws_api_gateway_integration" "integration_options" {
      depends_on              = ["aws_api_gateway_method.method_options"]
      rest_api_id             = "${aws_api_gateway_rest_api.rest_api.id}"
      resource_id             = "${aws_api_gateway_resource.resource.id}"
      http_method             = "${aws_api_gateway_method.method_options.http_method}"
      integration_http_method = "OPTIONS"
      type                    = "MOCK"
    }
    
    resource "aws_api_gateway_integration_response" "integration_response_options_200" {
      depends_on  = ["aws_api_gateway_method_response.method_response_options_200"]
      rest_api_id = "${aws_api_gateway_rest_api.rest_api.id}"
      resource_id = "${aws_api_gateway_resource.resource.id}"
      http_method = "${aws_api_gateway_method.method_options.http_method}"
      status_code = "${aws_api_gateway_method_response.method_response_options_200.status_code}"
      selection_pattern = "200"
    
      response_templates = {
        "application/json" = ""
      }
    
      response_parameters = {
        "method.response.header.Access-Control-Allow-Origin" = "'*'"
      }
    }
    
    resource "aws_api_gateway_integration_response" "integration_response_options_400" {
      depends_on  = ["aws_api_gateway_method_response.method_response_options_400"]
      rest_api_id = "${aws_api_gateway_rest_api.rest_api.id}"
      resource_id = "${aws_api_gateway_resource.resource.id}"
      http_method = "${aws_api_gateway_method.method_options.http_method}"
      status_code = "${aws_api_gateway_method_response.method_response_options_400.status_code}"
      selection_pattern = "4\\d{2}"
    
      response_templates = {
        "application/json" = ""
      }
    
      response_parameters = {
        "method.response.header.Access-Control-Allow-Origin" = "'*'"
      }
    }
```

- ハマりポイント
  - `aws_api_gateway_deploymen` と `aws_api_gateway_stage` は両方必要ない (stage-nameがconflict する)。[こちら参照]([https://github.com/hashicorp/terraform/issues/6128](https://github.com/hashicorp/terraform/issues/6128))

```
    ## API Gateway - Deployment
    resource "aws_api_gateway_deployment" "deployment_200" {
      depends_on = [
        "aws_api_gateway_integration.integration_post",
        "aws_api_gateway_integration_response.integration_response_post_200",
      ]
    
      rest_api_id = "${aws_api_gateway_rest_api.rest_api.id}"
      stage_name  = "${var.env}"
    }
    
    resource "aws_api_gateway_method_settings" "method_settings_200" {
      depends_on  = ["aws_api_gateway_deployment.deployment_200"]
      rest_api_id = "${aws_api_gateway_rest_api.rest_api.id}"
      stage_name  = "${var.env}"
      method_path = "*/*"
    
      settings {
        metrics_enabled = true
        logging_level   = "INFO"
      }
    }
    
    resource "aws_api_gateway_deployment" "deployment_400" {
      depends_on = [
        "aws_api_gateway_integration.integration_post",
        "aws_api_gateway_integration_response.integration_response_post_400",
      ]
    
      rest_api_id = "${aws_api_gateway_rest_api.rest_api.id}"
      stage_name  = "${var.env}"
    }
    
    resource "aws_api_gateway_method_settings" "method_settings_400" {
      depends_on  = ["aws_api_gateway_deployment.deployment_400"]
      rest_api_id = "${aws_api_gateway_rest_api.rest_api.id}"
      stage_name  = "${var.env}"
      method_path = "*/*"
    
      settings {
        metrics_enabled = true
        logging_level   = "INFO"
      }
    }
```

WAFのRuleはIP制限。

同一[IPアドレス](http://d.hatena.ne.jp/keyword/IP%A5%A2%A5%C9%A5%EC%A5%B9)から5分間に2000(最低値)を超えたリク[エス](http://d.hatena.ne.jp/keyword/%A5%A8%A5%B9)トをトリガー。

WAFと[API](http://d.hatena.ne.jp/keyword/API) [Gateway](http://d.hatena.ne.jp/keyword/Gateway)を繋げたいので、

WAF ResourcesではなくWAF Regional Resoucesを使う必要がある。

- ハマりポイント
  - `metric_name` は英数字のみなので `-`などは使わない。[こちら参照]([https://docs.aws.amazon.com/ja_jp/waf/latest/developerguide/web-acl-creating.html](https://docs.aws.amazon.com/ja_jp/waf/latest/developerguide/web-acl-creating.html))

```
    ## WAF RULE
    resource "aws_wafregional_rate_based_rule" "wafrule" {
      name        = "${var.env}-bov-form-protect-dos-rule"
      metric_name = "${var.env}bovrule"
    
      rate_key   = "IP"
      rate_limit = 2000
    }
```

WAF RULEに該当したらBLOCKさせる設定をする。

[aws\_wafregional\_web\_acl\_association]([https://github.com/terraform-providers/terraform-provider-aws/blob/master/website/docs/r/wafregional_web_acl_association.html.markdown](https://github.com/terraform-providers/terraform-provider-aws/blob/master/website/docs/r/wafregional_web_acl_association.html.markdown)) ではまだ `ALB`しか公式サポートしていないようだけど、

[API](http://d.hatena.ne.jp/keyword/API) [Gateway](http://d.hatena.ne.jp/keyword/Gateway)でも繋ぐことができた。

WAFと[API](http://d.hatena.ne.jp/keyword/API) [Gateway](http://d.hatena.ne.jp/keyword/Gateway)の繋ぎこみの設定は `web_acl_id` と`resource_arn` を書くことで可能。

`resource_arn` の書き方は [AWSドキュメンテーションなど参照]([https://docs.aws.amazon.com/ja_jp/general/latest/gr/aws-arns-and-namespaces.html](https://docs.aws.amazon.com/ja_jp/general/latest/gr/aws-arns-and-namespaces.html))

もしくは[AssociateWebACLのドキュメンテーション]([https://docs.aws.amazon.com/ja_jp/waf/latest/APIReference/API_regional_AssociateWebACL.html](https://docs.aws.amazon.com/ja_jp/waf/latest/APIReference/API_regional_AssociateWebACL.html))

[公式サポートされてほしい]([https://github.com/terraform-providers/terraform-provider-aws/issues/6441](https://github.com/terraform-providers/terraform-provider-aws/issues/6441))

- ハマりポイント
  - `wafregional_ipset` はALBで使うproviderで今回はIP指定もないので使わない。[こちら参照]([https://www.terraform.io/docs/providers/aws/r/wafregional_ipset.html](https://www.terraform.io/docs/providers/aws/r/wafregional_ipset.html))
  - `aws_wafregional_ipset` の変わりに `aws_wafregional_rate_based_rule` を使用する

```
    ## WAF_ACL rate_based block over 2000 access
    
    resource "aws_wafregional_web_acl" "wafacl" {
      name        = "${var.env}-bov-form-protect-dos-acl"
      metric_name = "${var.env}BovFormAccess"
    
      default_action {
        type = "ALLOW"
      }
    
      rule {
        action {
          type = "BLOCK"
        }
    
        priority = 1
        rule_id  = "${aws_wafregional_rate_based_rule.wafrule.id}"
        type     = "RATE_BASED"
      }
    }
    
    resource "aws_wafregional_web_acl_association" "wafassosiation" {
      depends_on   = ["aws_wafregional_web_acl.wafacl"]
      resource_arn = "arn:aws:apigateway:ap-northeast-1::/restapis/${aws_api_gateway_rest_api.rest_api.id}/stages/${var.env}"
      web_acl_id   = "${aws_wafregional_web_acl.wafacl.id}"
    }
```
