---
title: "PyCon2017 一日目のれぽーと"
date: "2017-09-08"
---

# PyCon2017 一日目

後日に動画とslideがまとまってくれると嬉しい。

英語のセッションばかり聴いていたらとっても難しかった。
VOES 稼働後 after VOES launchが一番おもしろかったです。
VOESという[音ゲー](http://d.hatena.ne.jp/keyword/%B2%BB%A5%B2%A1%BC)を開発している台湾の人のセッションで
ゲームのbackend開発でDB周りや[CDN](http://d.hatena.ne.jp/keyword/CDN)、キャッシュ周りの話をしてくれました。
メンテナンスの話ではF○Oの48時間メンテナンスをネタにしたりもしていました。

Industrial Test Automation with Asyncioでは
asyncioの実装例周りを実際に書いておきたいと思います。
3.6系を勉強するならnon-blockingIOとか使いたい。。
以外とpyramid使いがいた気がします。人数としてはすくないですが。
Tornadoの話は特に聞かなかったです。

そういえばアンケートでは[Python](http://d.hatena.ne.jp/keyword/Python)でWEBアプリを書いている人は3割ほどでした。
PyConはデータサイエンティストの集まりと化しているようです。
そもそもプロダクション環境で[Python](http://d.hatena.ne.jp/keyword/Python)でアプリをリリースしている企業が少ないということなんでしょう。
[PHP](http://d.hatena.ne.jp/keyword/PHP)か[Ruby](http://d.hatena.ne.jp/keyword/Ruby)でアプリを書いて、分析基盤を[Python](http://d.hatena.ne.jp/keyword/Python)を使うという使い分けなのが多そう。

# [Keynote](http://d.hatena.ne.jp/keyword/Keynote)

[Python](http://d.hatena.ne.jp/keyword/Python)は教育として使われる言語で、いろんな分野の人が使う共通言語になる
データサイエンスはソフトウェア開発ではない。
解析に使うのはsoftware(ソフトウェア)なく、thoughtware(思考)である。
予測できることはほとんどない。「未来を予測する最もよい方法は、それを発明すること」by[アランケイ](http://d.hatena.ne.jp/keyword/%A5%A2%A5%E9%A5%F3%A5%B1%A5%A4)
ビジネスが[オープンソース](http://d.hatena.ne.jp/keyword/%A5%AA%A1%BC%A5%D7%A5%F3%A5%BD%A1%BC%A5%B9)を好む理由。ベンダーロックインを防ぐ(特にデータ)。
また、自分たちの都合に合わせて変更、機能追加できる。
[Python](http://d.hatena.ne.jp/keyword/Python)はレゴのようなもので組み立てていろんなものを作り上げることができる。

- Peter Wang
  - Anacondaデータサイエンスエコシステムの製品エンジニアリングチームを率いている人。
- Over 20 Million Downloards
- Other Problebms in 2012
- [Python](http://d.hatena.ne.jp/keyword/Python)は人気がある
  - イブサンローランの香水のCMでIPython のプロンプトが出てくる
- Why [Python](http://d.hatena.ne.jp/keyword/Python) for Data
  - not system language but intended to teaching language for prototype
- [Python](http://d.hatena.ne.jp/keyword/Python)にはいくつかの部族がある
  - Analyst,Data Developer,programmerも使える共通言語
- Data Science ！＝Software Development
- Era of Data Literacy
- A Few Predictions
  - 未来を予測する最もよい方法は、それを発明すること
- Open Source and Developers
  - [Python](http://d.hatena.ne.jp/keyword/Python)はレゴのようなもの
- ビジネスが[オープンソース](http://d.hatena.ne.jp/keyword/%A5%AA%A1%BC%A5%D7%A5%F3%A5%BD%A1%BC%A5%B9)を好む理由。ベンダーロックインを防ぐ(特にデータ)。また、自分たちの都合に合わせて変更、機能追加できる。
- 解析に使う言語は'thoughtware'で'software'ではない

# セッション

## Industrial Test Automation with Asyncio

asyncio

- Industry use
  - Railway Test Automation Project
  - Communication via [TCP](http://d.hatena.ne.jp/keyword/TCP) and [UDP](http://d.hatena.ne.jp/keyword/UDP) based protocals
- How to [talk](http://d.hatena.ne.jp/keyword/talk) to N computers at the same time?
- Trying without Asyncio
- import socket
- とても長い、
- Since [the network](http://d.hatena.ne.jp/keyword/the%20network) is the bottleneck
- and we only [talk](http://d.hatena.ne.jp/keyword/talk) to
- The Splution
- socketモジュール使うより短く書けるよ

```
import asyncio

tasks - {
     machine.sya("Hello, hoe are you?")
     for maching is machines
}

await asyncio.wait(tasks)
```

- The difference
  - In the second ecample ,there is no immediate ececution
  - Only promise creates"please
  - Calling asyncio,wait forces runtime ri ewaolce taskas
- How do N things at the same time
  - Missing ingeedient Non-blocking IO
  - Many implementations pthread,libuOS level"kqueue,select,epoll
  - How t do N　things at the same time
  - リク[エス](http://d.hatena.ne.jp/keyword/%A5%A8%A5%B9)ト⇔レスポンスを一台ずつやるのがblocking-IO
  - 一気に複数にリク[エス](http://d.hatena.ne.jp/keyword/%A5%A8%A5%B9)トを投げつけるのがnon-blockingIO
  - asyncioの使用例

```
Python asyncio sockets
reader, wtiter = loop.open_connvtion()
writer.senf(b'Hello, World)
awsit wruterr,drain(
  anser - await reader,read(199)
    )
```

- Test Usage
  - シナリオ例
  - ABCからDへ同じパケットを送る
  - DhaAkaradakeケットを受け取るか、
- slow and incorrect eith blocking I/O
  - In the eqal world
  - network devices do not wait
  - Now with non-blockingI/O
- 正しい振る舞いだけでなく、テスト実行が3倍早くなった
- Ecaluation
  - think about use cascadefind tools,and learng about best practices
  - apply,improce,share
- Synchronoously
  - Code is easy to understand
  - No mental overhead for locking/transactions
  - Easy oo interface with existing
- Asynchtronously
  - Specian sysntax needed asunc awaot
  - locking always necesary,even though single threaded
  - necessary for teatm to learn new programmin paradigm
- What you should avoid
  - Using asyncio because It is fast I/ve been thereSpeedup onluy observable in I/O biund
  - If you mix COU and I/O bound rasks and need adcice taks to me
- Why I like asyncio
  - Incerediblu powerful standard library
  - Easy to implement protocals o n [TCP](http://d.hatena.ne.jp/keyword/TCP) useing [OOP](http://d.hatena.ne.jp/keyword/OOP):asyncoo.protocalo
  - Context managers for locking promitives
- If you create something aweasome write a blof post
- Got o your local [python](http://d.hatena.ne.jp/keyword/python) meetio and tals aavuoit Asynip
- Contribute back to ppen souece :Rreport Bugs,Help Beginners,Write

## [Python](http://d.hatena.ne.jp/keyword/Python)で大量データ処理！PySparkを用いたデータ処理と分析のきほん

- [Apache](http://d.hatena.ne.jp/keyword/Apache) Sparkの紹介
- [Python](http://d.hatena.ne.jp/keyword/Python)といえばPyDataというくらいライブラリがそろっている
- 大規模データを扱いたい、データ量がスケールしても動く仕組みがほしい
- Sparkは[OSS](http://d.hatena.ne.jp/keyword/OSS)の並列分散処理[フレームワーク](http://d.hatena.ne.jp/keyword/%A5%D5%A5%EC%A1%BC%A5%E0%A5%EF%A1%BC%A5%AF)
  - 処理が失敗しても[リカバリ](http://d.hatena.ne.jp/keyword/%A5%EA%A5%AB%A5%D0%A5%EA)を[フレームワーク](http://d.hatena.ne.jp/keyword/%A5%D5%A5%EC%A1%BC%A5%E0%A5%EF%A1%BC%A5%AF)がやってくれる
  - タスクのスケジューリングもやってくれる
  - サーバのスケールアウトによって、[スループット](http://d.hatena.ne.jp/keyword/%A5%B9%A5%EB%A1%BC%A5%D7%A5%C3%A5%C8)が線形に近い形で向上する
  - リソース値用最適化ノク婦がされている
  - オンメモリベースの処理
  - [JVM](http://d.hatena.ne.jp/keyword/JVM)のオーバヘッドを改善sるProject [Tungsten](http://d.hatena.ne.jp/keyword/Tungsten)
  - キャッシュ、遅延評価
  - S[ark2.2だと3.4以上に対応
  - [機械学習](http://d.hatena.ne.jp/keyword/%B5%A1%B3%A3%B3%D8%BD%AC)やストリーム処理、処理の流れが見えるUI
  - サーバ一台でも動く
  - Spark2.2.0からpipでもインストールできたけど、localのみで分散処理はできない
  - Dockerでもお試しできる
- [Hadoop](http://d.hatena.ne.jp/keyword/Hadoop)[クラスタ](http://d.hatena.ne.jp/keyword/%A5%AF%A5%E9%A5%B9%A5%BF)上で動作する、[Amazon](http://d.hatena.ne.jp/keyword/Amazon) EMRや[Google](http://d.hatena.ne.jp/keyword/Google) DataProcなどのマネージドサービスを使うと楽
- Sparkの３つのプログラミングモデル
- [RDD](http://d.hatena.ne.jp/keyword/RDD)とDataframe
  - [RDD](http://d.hatena.ne.jp/keyword/RDD),コレクション操作のように処理を記述する
  - DataframehaSQLライクに処理を記述する
  - Dataframeは[オプティマ](http://d.hatena.ne.jp/keyword/%A5%AA%A5%D7%A5%C6%A5%A3%A5%DE)いさによる最適化
  - Dataframeno[オプティマ](http://d.hatena.ne.jp/keyword/%A5%AA%A5%D7%A5%C6%A5%A3%A5%DE)イザによる最適化
  - 高地的な処理の順番に入れ替えれ実行してくれる
  - データソースによててはギル田処理をデータ・ソース側d行い必要なデータのみを読み込むようにする
- [RDD](http://d.hatena.ne.jp/keyword/RDD)
  - ワーカーノードでの処理では[Python](http://d.hatena.ne.jp/keyword/Python)プロセスで行われる
- Dataframe
  - ワーカーノードでの処理は[JVM](http://d.hatena.ne.jp/keyword/JVM)上で行われる
  - ただしUDHはPytohonプロセスで実行される
- パフォーマンス上の問題点
  - [Iterator](http://d.hatena.ne.jp/keyword/Iterator)単位でのserializationと[python](http://d.hatena.ne.jp/keyword/python)プロセスへのパイプが発生
- RDDPythonは遅い
- DFだったら[Scala](http://d.hatena.ne.jp/keyword/Scala)と同じくらい
- [RDD](http://d.hatena.ne.jp/keyword/RDD)の中でNumpyやScipyを使う
- 集計結果をPandas DataFrameに変換してMatplitlibで可視化する
- PySParkではppandas DataFrameとDparkDataFtaneの相互変換可能
- [Apache](http://d.hatena.ne.jp/keyword/Apache) Arrow

  - データフォーマットの仕様とそれをりようするためのライブラリ
  - 異なる言語プロダクト感でのデータ連携コストを下げる
- [Apache](http://d.hatena.ne.jp/keyword/Apache) Zeppelom
  - レコメンデーション、異常検知とか
- DAたFrameをつかう
- 処理するデータ量を減らす
- ストレージの利用
  - D3,HDFA
- データフォーマットはParwuetを利用
- メモリ
- yarnによってコンテナが　きっｌareruera-ga
- okiyasui

## VOES 稼働後 after VOES launch

Hsueh-Tsung Kuo

how to resolve problems of mobile game server development and service maintenance

- VOES
  - [GCP](http://d.hatena.ne.jp/keyword/GCP)を使っている
  - 公式サイトみてね
  - [音ゲー](http://d.hatena.ne.jp/keyword/%B2%BB%A5%B2%A1%BC)
- DBのアトミックを守る
  - [トランザクション](http://d.hatena.ne.jp/keyword/%A5%C8%A5%E9%A5%F3%A5%B6%A5%AF%A5%B7%A5%E7%A5%F3)が終わってからアップデートする処理
- database chache mechanism
  - redis or memchached in RAM:fast
- AからBへのサーバへデータを移すとき
  - Aの[トランザクション](http://d.hatena.ne.jp/keyword/%A5%C8%A5%E9%A5%F3%A5%B6%A5%AF%A5%B7%A5%E7%A5%F3)処理が完了してからBへ
- database server reliableを保つ
- def gacha
- [FGO](http://d.hatena.ne.jp/keyword/FGO)メンテナンス48時間突破
  - <http://xn—fate-grandorder-794ovb07b7ht176ef78bjy3dxb0g.com/archives/72294537.html>
- [Python](http://d.hatena.ne.jp/keyword/Python) is so slow
- from database to static failures
- statistics
  - crontabでBigQueryを叩いて結果を初滅
  - 結果は[Google](http://d.hatena.ne.jp/keyword/Google) Cloug Storageなどに突っ込む
- Server operation with CSB
  - [CDN](http://d.hatena.ne.jp/keyword/CDN)でキャッシュミスしたらServerにリク[エス](http://d.hatena.ne.jp/keyword/%A5%A8%A5%B9)トを投げる
  - [CDN](http://d.hatena.ne.jp/keyword/CDN)のCache invalidationは不毛だしrevisionごとにURL作ろう
- service downtime and update
- timezone
  - TZ=[Asia](http://d.hatena.ne.jp/keyword/Asia)/Taipei
  - イベント処理には困らないから[UTC](http://d.hatena.ne.jp/keyword/UTC)使わない

## Why you should do text analysis in [python](http://d.hatena.ne.jp/keyword/python)

Bhargav Srinivasa Desikan

<https://github.com/hari-allamraju/pycon-talk-taxidata/tree/master/slides>

- why [python](http://d.hatena.ne.jp/keyword/python)
  - ease of use
  - [regex](http://d.hatena.ne.jp/keyword/regex),parsing, adn generators(pipeline text)
  - incredible suport in form of libraries
  - awesome community
- why text proxessing
  - data everywhere
  - with machine learning,deep insights
  - fun - from a personal point of view
  - employability - from a progessinal point of view
- so what can you do?
  - glean insights from your own text
  - chatbots
  - language translation
    - machine learning,deep learnings,tenserflow
  - research - especially in the humanities
- where is the data
  - free, open source, research sources
  - scrape data off the internet
  - whatsapp,FB,Hike,Line - any messageing app!
  - ebooks
    - <https://archive.org/details/A_Game_of_Thrones_Series>
- pre-processing
  - garbage in , garbage out
  - ease of reading and writing to files
  - also - libraried for pre-processing
- machine learnng in text
  - gensim
    - トピック分析できるライブラリ
  - scikit- learn
  - keras/tensorflow
- world embeddings
  - king - man + woman = [Queen](http://d.hatena.ne.jp/keyword/Queen)
- computational linguitstics
  - Part of Speech [tagging](http://d.hatena.ne.jp/keyword/tagging)
  - Named Entity Recognition
- Japanse relevance
  - spaCy has started alpha suppprt for Japanese
  - you can contribute and help expand it
  - as for ML, it is largely language agnostic
- so now
  - [python](http://d.hatena.ne.jp/keyword/python) is great at quick and dirty text pre-processing
  - and has a great ,great library support
  - and woth data everywhere

## [Python](http://d.hatena.ne.jp/keyword/Python)でOauthサーバを構築した話

設定やパラメータの話
規約があるので、規約どおりに実装しようという話

- Tech bureau Coap.で働いている
- [API](http://d.hatena.ne.jp/keyword/API)の話
  - secret & key を利用する場合
  - OAuth(token)を利用する場合
- OAuthサーバの作り方
- OAuthとは
- OAuth2.0の話
  - 日本語で規約がある
  - 全て規約が決まっている
- 使ったもの
  - Python3
  - Pyramid
  - SQLArchemy
  - Nginx
- [トーク](http://d.hatena.ne.jp/keyword/%A5%C8%A1%BC%A5%AF)ン発行、利用、再発行
- 名称、サービス名称
- cliend\_id
  - どのサーバに紐付ければいいのか
- responce\_type
- state
  - なりすまし対策
- redirect\_url
  - リダイレクト用のURL必須ではない
- 認証が通ったあと

## How (and Why) We speak in Unicord

Devon Peticolas

- Morse
  - Encording
- Baudot
  - パンチカード
- ASCⅡ
- The 8th bit
  - Latin-1
  - Hebrew
  - Meanwhile in Japan
  - Kanji
  - Katakarna
  - AA
- Japanese Encodeiisa
- [Unicode](http://d.hatena.ne.jp/keyword/Unicode)はどの言語でもつかる
- [utf-8](http://d.hatena.ne.jp/keyword/utf-8)
- [utf-16](http://d.hatena.ne.jp/keyword/utf-16)
- [utf-32](http://d.hatena.ne.jp/keyword/utf-32)

## Secrets of a [WSGI](http://d.hatena.ne.jp/keyword/WSGI) master

Graham Dumpletonさん

- WGSI == Web Server [Gateway](http://d.hatena.ne.jp/keyword/Gateway) Interfaces
  - Webサーバとアプリをつなぐもの
- [WSGI](http://d.hatena.ne.jp/keyword/WSGI) is a specification for an [Application Programming Interface](http://d.hatena.ne.jp/keyword/Application%20Programming%20Interface)
- Friends don’t let friends use raw [WSGI](http://d.hatena.ne.jp/keyword/WSGI)
- [django](http://d.hatena.ne.jp/keyword/django),Flask,Bottle,などなど
- You still need a way to host a [WSGI](http://d.hatena.ne.jp/keyword/WSGI) Application
- The development servers builtin to a framework are not good enough
- Installing mod\_[wsgi](http://d.hatena.ne.jp/keyword/wsgi) the easy way
  - pip install mod\_[wsgi](http://d.hatena.ne.jp/keyword/wsgi)
- Run mod\_[wsgi](http://d.hatena.ne.jp/keyword/wsgi) from the command Line
  - mod\_[wsgi](http://d.hatena.ne.jp/keyword/wsgi)-express start-server [wsgi](http://d.hatena.ne.jp/keyword/wsgi).py
  - No [Apache](http://d.hatena.ne.jp/keyword/Apache) configuration required
- Automatic code reloading
  - [python](http://d.hatena.ne.jp/keyword/python) manage.pu runmodwsgi –reload-on-changes
- Friends don’t let friends use [Python](http://d.hatena.ne.jp/keyword/Python) without a [Python](http://d.hatena.ne.jp/keyword/Python) virtual enviroment
- warpdrive
  - <https://github.com/GrahamDumpleton/warpdrive>
- Same tools for development
  - warpdrive project mypyapp
  - warpdrive build
  - warpdrive start
- Generate image with no Dockerfile
  - warpdrive image mypyapp
  - docker run –rm -p 80:8080 mypyapp
- Source-to-Image
- Embedded mode
- [Daemon](http://d.hatena.ne.jp/keyword/Daemon) mode
- Request monitoring
- Openshift
- Friends don’t let friends use [Windows](http://d.hatena.ne.jp/keyword/Windows) for running [Python](http://d.hatena.ne.jp/keyword/Python) web Applications
- Friends don’t let friends use the mod\_[wsgi](http://d.hatena.ne.jp/keyword/wsgi) which comes packaged with the operating system
- Friends don’t let friends use those other [WSGI](http://d.hatena.ne.jp/keyword/WSGI) servers
- Friends don’t let friends make things too complicated,simple is good

# LT

## ギャル語翻訳

- pyladiesの人たちのプロジェクト
- hack-a-thon
- ニュースサイトをギャル語にした
- [Mecab](http://d.hatena.ne.jp/keyword/Mecab),Tornado,Azure,Data ScirnceVM,Azure Redis cache
- 辞書は手書き
- Cheomeの[拡張機能](http://d.hatena.ne.jp/keyword/%B3%C8%C4%A5%B5%A1%C7%BD)で設定
- 辞書を[ディープラーニング](http://d.hatena.ne.jp/keyword/%A5%C7%A5%A3%A1%BC%A5%D7%A5%E9%A1%BC%A5%CB%A5%F3%A5%B0)化したい
- ギャル語の情報を取得したい

## ymyzk

- 計測する
- profileをつかう
- [wsgi](http://d.hatena.ne.jp/keyword/wsgi)\_lineprof
- [Python](http://d.hatena.ne.jp/keyword/Python)でISUCONかちましょう

## Respect is built-in names

- sum,idに代入しない
- list に listを突っ込まない
- dictにdictを突っ込まない
- [json](http://d.hatena.ne.jp/keyword/json)に[json](http://d.hatena.ne.jp/keyword/json)をつっこまない

## 誰でも簡単に暗号取引[bot](http://d.hatena.ne.jp/keyword/bot)ができるライブラリを作った

- Zaifbot

## OSSFriday

- [OSS](http://d.hatena.ne.jp/keyword/OSS)に貢献しよう

## ローカル環境でもDockerをドカドカ使う

- builderscon来年もやるらしい
- テスト環境でも使うのはよい

## [Python](http://d.hatena.ne.jp/keyword/Python)の実装をみる

- 無職最高
- [Python](http://d.hatena.ne.jp/keyword/Python)で[インタプリタ](http://d.hatena.ne.jp/keyword/%A5%A4%A5%F3%A5%BF%A5%D7%A5%EA%A5%BF)とか書こう

## カラオケおじさん

- 英日中の歌詞判別

## ジョブフェア

- モノタロウ
  - 東京オフィス作る
  - データ分析に基づき仕事をしている
- Line
  - サーバレスでLINE [bot](http://d.hatena.ne.jp/keyword/bot)つくれる
- Retty
  - [もくもく会](http://d.hatena.ne.jp/keyword/%A4%E2%A4%AF%A4%E2%A4%AF%B2%F1)とかやっているらしい
- iRidge
  - 何やっているかよくわからない会社

# Closing

Pyconのスタッフ多い。40人ぐらい?
1クラス分以上いた気がする。
