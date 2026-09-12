---
title: "ISUCON7に参加〜そして敗北へ〜"
date: "2017-10-23"
---

ISUCON初参加しました。

# 敗北

お題は「isutaba」というチャットツール

画像はファイルに書き出して参照させるぞ！！
→できんな？

# やっ[たこ](http://d.hatena.ne.jp/keyword/%A4%BF%A4%B3)と

## 当日まで

- 社内ISUCON(復習)

## 当日(まずはじめに)

- 複数台サーバまじ？構成確認
- DBの[スキーマ](http://d.hatena.ne.jp/keyword/%A5%B9%A5%AD%A1%BC%A5%DE)情報確認
- show create table [hoge](http://d.hatena.ne.jp/keyword/hoge);
- SELECT \* FROM [hoge](http://d.hatena.ne.jp/keyword/hoge) LIMIT 10;
- myprofilerを入れる
- pt-query-digest (percona-toolkit)
- [アクセスログ](http://d.hatena.ne.jp/keyword/%A5%A2%A5%AF%A5%BB%A5%B9%A5%ED%A5%B0)集計

## Nginx

- worker\_connections
- proxy\_pass
- expires

## [MySQL](http://d.hatena.ne.jp/keyword/MySQL)

- INDEX追加
  - (user.name)
  - (message.user\_id)
  - (message.channel\_id, message.created\_at)
  - (haveread.user\_id, haveread.channel\_id)
  - (image.name)

## アプリ改修

画像はファイルに書き出して参照させるぞ！！
→　できんな？

## やればよかった(忘れていた)

- ソケット通信化

## やりたかったけど、できなかった

- 画像の脱DB化
- /icons/\* を倒す
- N+1撲滅

## きづけない(次回は気づけるようにしような)

- SELECT \*の撲滅
- Cache-Control
- If-None-Match、If-Modified-Since、eTag
- 304
- /fetch
- [JSON](http://d.hatena.ne.jp/keyword/JSON)レスポンス

## 感想

FlaskとMySQLdbを使ってアプリかこうな
やるべきこと気づいて、実装できず悶々して無力だった
