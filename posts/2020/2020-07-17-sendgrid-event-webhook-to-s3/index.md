---
title: "sendgridのeventdataをS3に送るやつです"
date: "2020-07-17"
---

## 構成

SendGridのエラーをS3に格納するfunctionを実行する構成です。

![f:id:oza__shu:20200717200041p:plain](/images/sendgrid-event-webhook-to-s3/sendgrid-event-webhook-to-s3-0.png "f:id:oza__shu:20200717200041p:plain")

各サービスの役割とポイントとなる設定についてみていきましょう。
S3→Lambda→APIGateway→SendGridの順にみていきましょう〜〜〜

**S3**

- eventdataの保存先にS3を使用します。[bucket](http://d.hatena.ne.jp/keyword/bucket)を用意してlifecycleで保存期間を設定して終わりです。

**[AWS](http://d.hatena.ne.jp/keyword/AWS) Lambda**

- [API](http://d.hatena.ne.jp/keyword/API) [Gateway](http://d.hatena.ne.jp/keyword/Gateway)で受けたeventdataをS3に保存するために、[AWS](http://d.hatena.ne.jp/keyword/AWS) Lambdaを使います。[公式ドキュメント](https://sendgrid.com/docs/for-developers/tracking-events/event/#delivery-events)をみるとイベントデータは[JSON](http://d.hatena.ne.jp/keyword/JSON)配列で送信されるようです。今回はPython3でfunctionを書きました。forで回して1件ずつ処理してS3に格納していきます。内容をざっと見ると、timestampのunixstampを[JST](http://d.hatena.ne.jp/keyword/JST)に変換しログ名にもいれて、dict型からstr型bytes型に変換しioモジュールでファイルに書き出し、それをboto3でアップロードさせました。Lambda関数のコード抜粋を載せます。

```
# configure with env vars
BUCKET_NAME = os.environ['LOG_S3_BUCKET']

def put_to_s3(data: dict, bucket: str, key: str):
    xray_recorder.begin_subsegment('s3 upload')
    strdata = json.dumps(data)
    bindata = strdata.encode()
    try:
        with io.BytesIO(bindata) as data_fileobj:
            s3_results = s3.upload_fileobj(data_fileobj, bucket, key)

        logger.info(f"S3 upload errors: {s3_results}")

    except S3UploadFailedError as e:
        logger.error("Upload failed. Error:")
        logger.error(e)
        import traceback
        traceback.print_stack()
        raise
    xray_recorder.end_subsegment()

def handler(event, context):
    logger.info(event)
    data_list = event['body']
    data_dicts = json.loads(data_list)
    logger.info(data_dicts)
    for _, data in enumerate(data_dicts):
        unix_timestamp = data['timestamp']
        jst_time = datetime.fromtimestamp(unix_timestamp)
        key = data['event'] + "/" + jst_time.strftime("%Y-%m/%d/%H/%Y-%m-%d-%H:%M:%S-") + "-" + data['sg_event_id'] + ".log"
        put_to_s3(data, BUCKET_NAME, key)
```

eventに何が受け取るのか最初わからずハマりました。文字列がきていたので[json](http://d.hatena.ne.jp/keyword/json).loadsでdictに変更して値がとれるようになりました。
Lambda関数には、S3へのUpload権限を与えるのを忘れないようにしてください。

[公式ドキュメントのここらへん](https://docs.aws.amazon.com/ja_jp/lambda/latest/dg/lambda-intro-execution-role.html)が参考になりそう。

functionのzip化はarchive\_fileを使うでもいいと思います。

[Python](http://d.hatena.ne.jp/keyword/Python)のコードはとりあえず、[ここらへん](https://docs.aws.amazon.com/ja_jp/lambda/latest/dg/with-s3-example-deployment-pkg.html#with-s3-example-deployment-pkg-python)から参考に育てていきました。あと[ここらへん](https://dev.classmethod.jp/articles/lambda-my-first-step/)とかも。

**[API](http://d.hatena.ne.jp/keyword/API) [Gateway](http://d.hatena.ne.jp/keyword/Gateway)**

- Event WebhookのHTTPリク[エス](http://d.hatena.ne.jp/keyword/%A5%A8%A5%B9)トをLambda Proxyを経由して[API](http://d.hatena.ne.jp/keyword/API) [Gateway](http://d.hatena.ne.jp/keyword/Gateway)で受けます。[API](http://d.hatena.ne.jp/keyword/API) [Gateway](http://d.hatena.ne.jp/keyword/Gateway)はリソースを作成後、ANYメソッドを作成します。[プロキシリソースとの Lambda プロキシ統合](https://docs.aws.amazon.com/ja_jp/apigateway/latest/developerguide/api-gateway-set-up-simple-proxy.html)を参考に設定します。設定内容としては、greedy パス変数 {proxy+} を使用してプロキシリソースを作成します。そしてプロキシリソースに ANY メソッドを設定します。[API](http://d.hatena.ne.jp/keyword/API) [Gateway](http://d.hatena.ne.jp/keyword/Gateway) [REST API](http://d.hatena.ne.jp/keyword/REST%20API) の **[AWS](http://d.hatena.ne.jp/keyword/AWS)\_PROXY**で指定されるLambda プロキシ統合は、バックエンドの Lambda 関数と統合するために使用します。Lambda プロキシ統合を使うと何がよいかなのですが、[API](http://d.hatena.ne.jp/keyword/API) [Gateway](http://d.hatena.ne.jp/keyword/Gateway)がリク[エス](http://d.hatena.ne.jp/keyword/%A5%A8%A5%B9)トとレスポンスの[マッピング](http://d.hatena.ne.jp/keyword/%A5%DE%A5%C3%A5%D4%A5%F3%A5%B0)設定をよしなに設定してくれるので、[マッピング](http://d.hatena.ne.jp/keyword/%A5%DE%A5%C3%A5%D4%A5%F3%A5%B0)テンプレートを書かなくなることです。以上で[API](http://d.hatena.ne.jp/keyword/API) [Gateway](http://d.hatena.ne.jp/keyword/Gateway)の設定は完了です。最後に[API](http://d.hatena.ne.jp/keyword/API)をterraformでapplyしてデプロイして[API](http://d.hatena.ne.jp/keyword/API) [Gateway](http://d.hatena.ne.jp/keyword/Gateway)の設定は完了です。[こっちのドキュメント](https://docs.aws.amazon.com/ja_jp/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html)も参照した方がいいと思います。
  [この記事](http://blog.serverworks.co.jp/tech/2020/02/07/apigw-lambda-response/)も見やすかったです。

**SendGrid**

- Event WebhookはSendGrid[ダッシュ](http://d.hatena.ne.jp/keyword/%A5%C0%A5%C3%A5%B7%A5%E5)ボードの「[Settings > Mail Settings > Event Notification](https://app.sendgrid.com/settings/mail_settings)」で設定します。**HTTP POST URL**に[API](http://d.hatena.ne.jp/keyword/API) [Gateway](http://d.hatena.ne.jp/keyword/Gateway)のエンドポイントのURLを設定します。**SELECT ACTIONS**で受け取りたいイベントの[チェックボックス](http://d.hatena.ne.jp/keyword/%A5%C1%A5%A7%A5%C3%A5%AF%A5%DC%A5%C3%A5%AF%A5%B9)をONにして設定を保存します。今回はエラーを受け取りたいので**Dropped, Deffered, Bounced**に✅を入れます。Event Notification設定画面で「Test Your Integration」ボタンを選択して、S3にテストデータが保存されていることが確認できれば設定は完了です。[ここらへん](https://sendgrid.kke.co.jp/docs/Tutorials/C_Manage_Events/using_event_webhook.html)に書いてあります。

### まとめ

いかがでしたか？Sendgridのeventdataを[AWS](http://d.hatena.ne.jp/keyword/AWS)を利用して保存する方法をみてきました。S3は耐障害性が高く、Lifecycleでログ保存期間についても簡単に設定することができます。今回の構成をeventdataの保存を考える際に参考にしてみてください。
