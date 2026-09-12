---
title: "ElasticCacheのイベント通知をSlackに投げ隊"
date: "2020-11-13"
---

## これはなに?

ElasticCacheのイベント通知をSlackに通知する奴

## どうして通知するんですか?

他のプロジェクトでDB周りのアラートが発報して確認したらイベント通知にメンテで再起動されていた。

イベント情報を検知できるようにイベント通知をしたくなった。

## 構成

シンプルにElasticCache→[SNS](http://d.hatena.ne.jp/keyword/SNS)→Lambda→Slack

ElasticCacheのイベント通知先を[SNS](http://d.hatena.ne.jp/keyword/SNS)のトピックにして、サブス[クライバー](http://d.hatena.ne.jp/keyword/%A5%AF%A5%E9%A5%A4%A5%D0%A1%BC)であるLambdaに対して投げつける。ログはCloudWatch Logsに投げる。Lambda Functionは[Python](http://d.hatena.ne.jp/keyword/Python)でSlack通知させました。

ここの一通りの設定を見ていきます。

![f:id:oza__shu:20201113191816p:plain](/images/elasticache-event-notification-to-slack/elasticache-event-notification-to-slack-0.png "f:id:oza__shu:20201113191816p:plain")

## Lambdaで使用するので、Webhook URLを作成

名前と通知先とかわいい画像を指定して作成してください。

## [SNS](http://d.hatena.ne.jp/keyword/SNS)通知先の設定

これはElasticCacheの設定で[SNS](http://d.hatena.ne.jp/keyword/SNS)のarnを渡すだけ。

## KMSのkeyを作成

keyを作成したら使うのにaliasも必要になるので準備すればOK

## [SNS](http://d.hatena.ne.jp/keyword/SNS)でTopicとサブス[クライバー](http://d.hatena.ne.jp/keyword/%A5%AF%A5%E9%A5%A4%A5%D0%A1%BC)の設定

Topicと[サブスクリプション](http://d.hatena.ne.jp/keyword/%A5%B5%A5%D6%A5%B9%A5%AF%A5%EA%A5%D7%A5%B7%A5%E7%A5%F3)を作成します。

Topicは作成したら以下のポリシーを当てるぐらい

```
statement {
    sid    = "LambdaPublish"
    effect = "Allow"
    principals {
      type        = "AWS"
      identifiers = ["*"]
    }
    actions = [
      "SNS:GetTopicAttributes",
      "SNS:Publish"
    ]
    resources = [
      "arn:aws:sns:ap-northeast-1:${data.aws_caller_identity.self.account_id}:topic",
    ]
  }
}
```

[サブスクリプション](http://d.hatena.ne.jp/keyword/%A5%B5%A5%D6%A5%B9%A5%AF%A5%EA%A5%D7%A5%B7%A5%E7%A5%F3)はLambdaに送るので送り先のARNを[プロトコル](http://d.hatena.ne.jp/keyword/%A5%D7%A5%ED%A5%C8%A5%B3%A5%EB)でLambdaを指定すればOK.

メッセージ送信をテストで実行して[SNS](http://d.hatena.ne.jp/keyword/SNS)とLambda間で疎通が取れるかテスト可能です。

次はLambdaを用意していきます。

## Lambdaに必要なIAMポリシー

Lambda用のRoleが必要なので作成します。

```
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": "sts:AssumeRole",
      "Principal": {
        "Service": "lambda.amazonaws.com"
      },
      "Effect": "Allow"
    }
  ]
}
```

Webhook URLはKMSで暗号化して渡すので、解読させるためにKMSのDecryptの権限ポリシーが必要です。

```
{
    "Version": "2012-10-17",
    "Statement": [
      {
          "Effect": "Allow",
          "Action": "kms:Decrypt",
          "Resource": "arn:aws:kms:ap-northeast-1:${data.aws_caller_identity.self.account_id}:key/${aws_kms_alias.kms_alias.target_key_id}"
      }
    ]
 }
```

作成したロールに上のと下2つのポリシーをアタッチすればOK

- CloudWatchReadOnlyAccess
- AWSLambdaBasicExecutionRole

## SlackのhookのURLをKMSで暗号化

Terraformではできなかったので、手動で暗号化をして、
それをTerraformでLambdaの関数に読ませました。

暗号化したURLは次の手順で作成

1. 転送時の暗号化に使用するヘルパーの有効化の[チェックボックス](http://d.hatena.ne.jp/keyword/%A5%C1%A5%A7%A5%C3%A5%AF%A5%DC%A5%C3%A5%AF%A5%B9)をチェック
2. 保管時に暗号化する [AWS](http://d.hatena.ne.jp/keyword/AWS) KMS キーの選択で、作った暗号化キーを選択
3. kmsEncryptedHookUrlの[value](http://d.hatena.ne.jp/keyword/value)に、SlackのWebhookのURLを入れる
4. 暗号化ボタンを押下
5. 暗号化完了

暗号化したらLambdaの `kmsEncryptedHookUrl` [環境変数](http://d.hatena.ne.jp/keyword/%B4%C4%B6%AD%CA%D1%BF%F4)に渡します。

## Lambdaでイベント通知の絞り込み

イベント内容で絞り込みしないと毎日のsnapshotのイベントとかで検知してしまうので、

それでイベント通知は以下の2つに絞り込みました。

```
ElastiCache:FailoverComplete
ElastiCache:CacheNodeReplaceComplete
```

[スクリプト](http://d.hatena.ne.jp/keyword/%A5%B9%A5%AF%A5%EA%A5%D7%A5%C8)は以下のように暗号化したslackのURLとチャンネル名を渡して、

イベント通知に一致したらslack通知する内容です。

```
import boto3
import json
import logging
import os

from base64 import b64decode
from urllib.request import Request, urlopen
from urllib.error import URLError, HTTPError

# The base-64 encoded, encrypted key (CiphertextBlob) stored in the kmsEncryptedHookUrl environment variable
ENCRYPTED_HOOK_URL = os.environ['kmsEncryptedHookUrl']
# The Slack channel to send a message to stored in the slackChannel environment variable
SLACK_CHANNEL = os.environ['slackChannel']

HOOK_URL = "https://hooks.slack.com" + boto3.client('kms').decrypt(
    CiphertextBlob=b64decode(ENCRYPTED_HOOK_URL),
    EncryptionContext={
        'LambdaFunctionName': os.environ['AWS_LAMBDA_FUNCTION_NAME']}
)['Plaintext'].decode('utf-8')

logger = logging.getLogger()
logger.setLevel(logging.INFO)

NOTIFICATION_EVENT_TYPE = [
    'ElastiCache:FailoverComplete',
    'ElastiCache:CacheNodeReplaceComplete',
]

def lambda_handler(event, context):
    logger.info("Event: " + str(event))
    print(event['Records'][0]['Sns']['Message'])
    message = json.loads(event['Records'][0]['Sns']['Message'])
    event_time = event['Records'][0]['Sns']['Timestamp']

    # イベントタイプがNOTIFICATION_EVENT_TYPEに含まれない場合は処理を終了
    event_set = set(message.keys())
    notification_event_type_set = set(NOTIFICATION_EVENT_TYPE)
    event_type = event_set & notification_event_type_set
    if not event_type:
        return

    logger.info("Message: " + str(message))

    slack_message = {
        'channel': SLACK_CHANNEL,
        'text': "%s ElastiCache Notification Message: %s" % (event_time, message)
    }

    req = Request(HOOK_URL, json.dumps(slack_message).encode('utf-8'))
    try:
        response = urlopen(req)
        response.read()
        logger.info("Message posted to %s", slack_message['channel'])
    except HTTPError as e:
        logger.error("Request failed: %d %s", e.code, e.reason)
    except URLError as e:
        logger.error("Server connection failed: %s", e.reason)
```

## 動作確認

Elasticache の [SNS](http://d.hatena.ne.jp/keyword/SNS) 通知の設定について、 Test Failover [API](http://d.hatena.ne.jp/keyword/API) 実行時には、 ElastiCache:FailoverComplete 等のイベントが発報されるので、
コンソール上でフェイルオーバーを実施。

# 通知完了!!

## 参考URL

[KMSを使用してキーを暗号化＆復号する手順](http://shomi3023.com/2018/06/16/1818/)

[TerraformでIAMポリシーのJSONに変数を埋めたい場合はaws\_iam\_policy\_documentを使う](https://qiita.com/minamijoyo/items/d68f162bd29cd3d766e8)

[Terraformでテンプレートを使ってポリシーを定義する](https://qiita.com/ringo/items/9e05df9da984fdc059f3)

[terraformからroleにpolicyをattachするときの話](https://qiita.com/yoshi65/items/fe8483df3de8f31cba3c)

[\*.tf 内で AWS アカウント ID を自動参照(取得)する aws\_caller\_identity Data Source]([https://qiita.com/gongo/items/a2b83d7402b97ef43574](https://qiita.com/gongo/items/a2b83d7402b97ef43574))

[キー ID と ARN を検索する](https://docs.aws.amazon.com/ja_jp/kms/latest/developerguide/find-cmk-id-arn.html)

[Amazon SNS のアクション、リソース、および条件キー](https://docs.aws.amazon.com/ja_jp/IAM/latest/UserGuide/list_amazonsns.html)

[AWS Lambdaを使ったAmazon SNSへのメッセージ送受信](https://business.ntt-east.co.jp/content/cloudsolution/column-try-29.html#section-04)

[Terraformで構築するAmazon SNSからAWS Lambdaを呼び出すためのトリガ](https://qiita.com/hayaosato/items/fc3e4e8be285e8dbbd5c)

[【AWS】CloudWatchアラーム通知をLambdaでSlack投稿する](https://www.geekfeed.co.jp/geekblog/aws_cloudwatch_to_slack/)

[AWSの各種アラートをSlackで受け取る](https://developers.wano.co.jp/1239/)

[AWS のリソースを監視して Slack に通知する方法 (または cloudwatch-alarm-to-slack の使い方)](https://qiita.com/megane42/items/bfba43d6a04727b02b1d)

[ElastiCacheのイベント通知をLambdaを使ってフィルタしてみた](https://dev.classmethod.jp/articles/elasticache-sns-lambda-filter/)

[AWS CloudWatchからSlackへ通知する](https://qiita.com/taquaki-satwo/items/c9c196c1642cad626661)

[ElastiCache イベントの表示](https://docs.aws.amazon.com/ja_jp/AmazonElastiCache/latest/red-ug/ECEvents.Viewing.html)
