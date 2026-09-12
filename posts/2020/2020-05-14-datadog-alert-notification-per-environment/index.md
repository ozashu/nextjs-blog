---
title: "datadogのアラート通知先を環境毎に変えたい"
date: "2020-05-14"
---

環境毎にアラート項目を作り分けてて面倒くさかったので、一つの監視で複数環境を監視できるようにした。
環境毎に[閾値](http://d.hatena.ne.jp/keyword/%EF%E7%C3%CD)を変えたいという要望は捨て置く。

[datadogでタグを使って1モニターから複数の通知先を出し分け設定する](https://qiita.com/aibou/items/687901162744ebe1e557) こちらを参考にした。

ここでの想定は

- envタグとかenviromentタグにprd,dev,[stg](http://d.hatena.ne.jp/keyword/stg).sbx,[shd](http://d.hatena.ne.jp/keyword/shd),lrd...などなど付いている
- slackチャンネルが `hoge_alert` 部屋と `hoge_dev_alert` 部屋があり、slackのwebhookのurlをdatadogのslackのintegrationで設定し、通知可能であることです。

slackが落ちた時に大丈夫なように、prdのcriticalだけMail通知もすると安全そう

以下のように書けば、一つの監視で通知先を分けれるし、ステータス毎にメンションも分けられるのでおすすめです。

```
{{#is_alert}}  
Criticalだよ!
{{#is_match "env" "prd"}}  <!channel>  @slack-Slack_Account_Hook_PRD-hoge_alert {{/is_match}}
{{^is_match "env" "prd"}}  <!here>  @slack-Slack_Account_Hook_DEV-hoge_dev_alert  {{/is_match}}
{{/is_alert}}

{{#is_warning}}
WARNINGだよ。 
{{#is_match "env" "prd"}} <!here> @slack-Slack_Account_Hook_PRD-hoge_alert {{/is_match}}
{{^is_match "env" "prd"}} @slack-Slack_Account_Hook_DEV-hoge_dev_alert  {{/is_match}}
{{/is_warning}} 

{{#is_no_data}}
NoDataだよ!
{{#is_match "env" "prd"}} <!here>  @slack-Slack_Account_Hook_PRD-hoge_alert {{/is_match}}
{{^is_match "env" "prd"}} @slack-Slack_Account_Hook_DEV-hoge_dev_alert  {{/is_match}}
{{/is_no_data}} 

{{#is_recovery}}
復旧したよ!
{{#is_match "env" "prd"}} @slack-Slack_Account_Hook_PRD-hoge_alert {{/is_match}}
{{^is_match "env" "prd"}} @slack-Slack_Account_Hook_DEV-hoge_dev_alert  {{/is_match}}
{{/is_recovery}}
```
