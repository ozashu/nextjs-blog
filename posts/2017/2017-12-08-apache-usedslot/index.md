---
title: "Apache Usedslotの見方"
date: "2017-12-08"
---

[Apache](http://d.hatena.ne.jp/keyword/Apache) Usedslotの見方をまとめてみた

## 稼働状況の表示（ステータス情報表示）

稼働中のプロセス数，待機中のプロセス数および各プロセスのステータス（R，W，Lなど）をWebブラウザに表示
この情報を基に，StartServers，MinSpareServers，MaxSpareServers，MaxClientsディレクティブなどをチューニングできる

## server-statusハンドラの指定

ステータス情報の表示機能を利用するには，次に示すようにserver-statusハンドラを指定
Webサーバのステータス情報はアクセス制御して，エンドユーザには非公開にするのが一般的

```
<Location /server-status>
      SetHandler server-status
</Location>
```

## URLの指定

ステータス情報を表示するには，Webブラウザや[curl](http://d.hatena.ne.jp/keyword/curl)で次の形式でURLを指定

```
http://IPアドレス/server-status?auto
```

autoはプレーンテキスト形式で表示できる

```
# curl http://127.0.0.1/server-status/?auto
Total Accesses: 4366246
Total kBytes: 77563940
CPULoad: .34465
Uptime: 150727
ReqPerSec: 28.9679
BytesPerSec: 526949
BytesPerReq: 18190.8
BusyWorkers: 13
IdleWorkers: 7
Scoreboard: K_KKKW._.K..K._.K___KK.W.K_.K..............................................(略)..........
```

※ステータス情報の表示機能で取得できる情報（auto指定がある場合）

- Total accesses:合計アクセス回数
- Total kBytes:合計通信量
- CPU load:CPU使用率
- [Uptime](http://d.hatena.ne.jp/keyword/Uptime):サーバプロセスの稼働時間（秒）
- ReqperSec:1秒当たりのリク[エス](http://d.hatena.ne.jp/keyword/%A5%A8%A5%B9)ト数
- BytesPerSec:1秒当たりの通信量
- BytesPerReq:1リク[エス](http://d.hatena.ne.jp/keyword/%A5%A8%A5%B9)ト当たりの通信量
- BusyWorkers:リク[エス](http://d.hatena.ne.jp/keyword/%A5%A8%A5%B9)ト処理中のサーバプロセス（スレッド）数
- idle workers:リク[エス](http://d.hatena.ne.jp/keyword/%A5%A8%A5%B9)ト待ち状態のサーバプロセス（スレッド）数
- Scoreboard:個々のスレッドの動作状況

※稼働中のサーバプロセスの状態の記号

- \_ : リク[エス](http://d.hatena.ne.jp/keyword/%A5%A8%A5%B9)ト待ち状態
- S : 起動処理中
- R : クライアントからのリク[エス](http://d.hatena.ne.jp/keyword/%A5%A8%A5%B9)トを受信中
- W : リク[エス](http://d.hatena.ne.jp/keyword/%A5%A8%A5%B9)トの処理実行およびクライアントへレスポンス送信中
- K : 持続型接続状態でリク[エス](http://d.hatena.ne.jp/keyword/%A5%A8%A5%B9)ト受信待ち
- D : ルックアップ中
- C : 接続を終了中
- L : ログ出力処理中
- G : graceful restartにおける処理終了待ち
- I : スレッド停止中
- . : 起動していない状態

## 見方のPoint

- 「R」 or「W」 が多ければ待機プロセスを増やしたほうがいいので、MaxClients を増やす。
- 「.」が多ければ、ServerLimit を減らす。
- 「\_」が多ければ、待機中プロセスが多いので、MinSpareServers と MaxSpareServers を減らす。

![Apacheスコアボードの監視とチューニング](https://www.ginnokagi.com/2008/03/apache.html)

![server-status](http://itdoc.hitachi.co.jp/manuals/link/cosmi_v0950/03Y1830D/EY180051.HTM)

## 監視では

.と\_を抜かした個数を分子にして、.を抜かした個数を分母にすれば以下のことがわかる。

- [Apache](http://d.hatena.ne.jp/keyword/Apache) の同時接続数の割合を監視することができる
- MaxClients に対しての 使用中のスロット数 の割合を監視対象の数値とすることができる
