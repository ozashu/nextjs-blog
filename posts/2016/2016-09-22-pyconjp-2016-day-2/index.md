---
title: "PyconJP 2016〜2日目〜"
date: "2016-09-22"
---

PyconJP 2016の2日目も行ってきました。
初のPyconJPでしたが、楽しかったです。
スタッフの皆さん、スピーカーの方々ありがとうございました！

忘れないようにメモ代わりに雑に書きます。
よかったら[PyconJP 2016〜1日目〜](http://ozashu.hatenablog.com/entry/2016/09/21/235742)も読んで下さい。

## [Keynote](http://d.hatena.ne.jp/keyword/Keynote)

眠くて間に合うか心配でしたが、ギリギリ間に合いました。
雨で電車が止まらなくてよかった。

2日目は`Andrey Vlasovskikh`の基調講演でした。
[Python](http://d.hatena.ne.jp/keyword/Python)の型ヒントにcommitしてる人らしいです。
ロシアから来てくださって、故郷の[サンクトペテルブルク](http://d.hatena.ne.jp/keyword/%A5%B5%A5%F3%A5%AF%A5%C8%A5%DA%A5%C6%A5%EB%A5%D6%A5%EB%A5%AF)はモスクワの次に多きいところで、
日本でいえば大阪みたいなところと言って面白かったｗ
写真を見せてくれましたが、[北ヨーロッパ](http://d.hatena.ne.jp/keyword/%CB%CC%A5%E8%A1%BC%A5%ED%A5%C3%A5%D1)に属するらしく
情景が美しかったです。

話の内容としてはPython3.6の機能についてでした。
文字列[リテラル](http://d.hatena.ne.jp/keyword/%A5%EA%A5%C6%A5%E9%A5%EB)と変数、数値[リテラル](http://d.hatena.ne.jp/keyword/%A5%EA%A5%C6%A5%E9%A5%EB)の変更点など、
詳しくはドキュメント読みましょう。
Python3推しは無理にしないで、客観的に話すと言っていました。
あるアンケートではPython2と3の使ってつ人の比率は50%が3系で、
56%は2系を使っているらしく、一部重複しているのは2と3を使っている人がいるから。
PyconUS2020でPython2のさよならパーティがあるらしく、
これから[Python](http://d.hatena.ne.jp/keyword/Python)書くなら3系ですね。
2017年に、Django2.0での[python](http://d.hatena.ne.jp/keyword/python)２のサポートも消えるらしいです。

[Python](http://d.hatena.ne.jp/keyword/Python)の型ヒントはPython3.0から登場したが、当初はSyntaxだけで、semanticsは提供されなかった。
3.5で標準化されたて、Mypy,PyCharmで使えるようになった。
Python3の型ヒントの良くないところは静的型付けなのでコードを書く量が増えるし、小さいプロジェクトなら不要。
あとは100%の互換性があるわけではない。

型付けの[ケーススタディ](http://d.hatena.ne.jp/keyword/%A5%B1%A1%BC%A5%B9%A5%B9%A5%BF%A5%C7%A5%A3)はPython2からPython3に準拠させたら6万ドルかかった企業(twisted)があった。
また、[Dropbox](http://d.hatena.ne.jp/keyword/Dropbox)では型ヒントを追加してからPython3に移行した。

Async-Awaitは3.6ではyieldとawaitとasyncが使えるようになる。
Async-Awaitのいいところ。Coroutineとawaitable。
Async-Awaitのわるいところ。同期版があれば非同期版をかかないといけない。
[Django](http://d.hatena.ne.jp/keyword/Django)とFlaskが使えなくなるので、Tornadoやaiohttoに移動しないといけない。
TornadoはFlaskと同じくらいpopularになってきたらしいので、
Tornadoも触っておきたいです。

質問では英語で質問する人が多かったので同時通訳の人が大変そうだった。。。
個人的には日本語で質問して、英語で話したいのなら懇親会とかセッションの合間とかに
話すのがいいんじゃないかなあとカンファレンス行くと毎回思う。

## You Might Not Want Async (in [Python](http://d.hatena.ne.jp/keyword/Python))

台湾の方で、発表のネタがアジアっぽかった。
syncよりasyncの方がCPU待ち全然ないのすごかったです。
Python3.5の機能良さありました。

## Lunch

ビュッフェ形式でした。美味しかったです。
特にだれとも話さずモクモク食べてた。

## ジョブフェア

ビュッフェ形式ならジョブフェア人が少ないのではと思ったけど、
そんなことなかったです。
朝会してるとか、リモートワークの是非とかありました。
リモートワークの話題でrebuild.fmの名前が出てきたｗ
リモートワークはワークライフスタイルではないので、
個人的には日本だとリモートワークをワークライフスタイルって考えてるから
上手くいかないんだろうなあと思います。
リモートワークは世界に展開してなかったり、
地方などにいる優秀なエンジニアを雇いたいって企業がやるものなので、
リモートワークやっている企業の人が、多様性を持ちたいから海外の人を雇うために
リモートワークをしていると言っていて、
まさしくそうで、[外国籍](http://d.hatena.ne.jp/keyword/%B3%B0%B9%F1%C0%D2)の人を雇いたいって企業がリモートワークやればいいだけの話で、
ウチは反対ですっていう会社はそもそもやる必要がないんですよね。

## HTTPプロクシライブラリproxy2の設計と実装

１日目のやつが移動してきたセッションですね。

proxy2の話で、[gzip](http://d.hatena.ne.jp/keyword/gzip)とdeflateモジュールを使って実装したらしいです。
RFC2616, RFC7230も読んだそうです。
[ssl](http://d.hatena.ne.jp/keyword/ssl).wrap\_socketとかBaseHTTPserver, hyyplib,threading,select.[ssl](http://d.hatena.ne.jp/keyword/ssl),
deflate,[gzip](http://d.hatena.ne.jp/keyword/gzip)など標準モジュールだけで作れるらしい。

## Building Distributed System with [Celery](http://d.hatena.ne.jp/keyword/Celery) on Docker Swarm

台湾の方の英語セッションで
Docker Swarmということを期待して参加しました。
[Celery](http://d.hatena.ne.jp/keyword/Celery)も少し調べておきます。

```
from celery import celery
```

発表中に発表聞かないで、自分の発表資料作る人がいて、う〜んって感じだった。

## おやつ

カップケーキでした。すごいかわいいし、美味しかったです。

## はじめて作る[Django](http://d.hatena.ne.jp/keyword/Django)[プラグイン](http://d.hatena.ne.jp/keyword/%A5%D7%A5%E9%A5%B0%A5%A4%A5%F3)

ぎぎにゃんの発表。
ク社[rails](http://d.hatena.ne.jp/keyword/rails) 使ってるイメージだけど、趣味で[Django](http://d.hatena.ne.jp/keyword/Django)使ってるのかなと思ったら、
まさしくそうらしいです。

ぎぎにゃんが作った[プラグイン](http://d.hatena.ne.jp/keyword/%A5%D7%A5%E9%A5%B0%A5%A4%A5%F3)の紹介
[django-debug-toolbar-vcs-info](https://github.com/giginet/django-debug-toolbar-vcs-info)

ぎぎにゃんの友達が作った[プラグイン](http://d.hatena.ne.jp/keyword/%A5%D7%A5%E9%A5%B0%A5%A4%A5%F3)の紹介
[django-permission](https://github.com/lambdalisue/django-permission)

[プラグイン](http://d.hatena.ne.jp/keyword/%A5%D7%A5%E9%A5%B0%A5%A4%A5%F3)の[まとめサイト](http://d.hatena.ne.jp/keyword/%A4%DE%A4%C8%A4%E1%A5%B5%A5%A4%A5%C8)の紹介(2年近く放置されているらしいです。。。)
[awesome-Django](https://github.com/rosarior/awesome-django)

[プラグイン](http://d.hatena.ne.jp/keyword/%A5%D7%A5%E9%A5%B0%A5%A4%A5%F3)を書くときの注意点を紹介してくれました。

実装、テスト(TDDでも可)をやってから色んなCI環境を整える。
全ての環境で通ったらドキュメントを書いて公開する。
というのが流れらしいです。

2.3両方サポートするようにテストは厚くするのが大事で、
[後方互換](http://d.hatena.ne.jp/keyword/%B8%E5%CA%FD%B8%DF%B4%B9)性を気にして3で書くのがオススメ。

[ディレクト](http://d.hatena.ne.jp/keyword/%A5%C7%A5%A3%A5%EC%A5%AF%A5%C8)リ構造の紹介。
ソースを置く[ディレクト](http://d.hatena.ne.jp/keyword/%A5%C7%A5%A3%A5%EC%A5%AF%A5%C8)リがパッケージ名になる。
テストの[ディレクト](http://d.hatena.ne.jp/keyword/%A5%C7%A5%A3%A5%EC%A5%AF%A5%C8)リ。
ドキュメントのファイルと[ディレクト](http://d.hatena.ne.jp/keyword/%A5%C7%A5%A3%A5%EC%A5%AF%A5%C8)リ。
パッケージ、ディストリブューシャン用。

- キーワード

sixは2と3の互換をしてくれるもの。
compat.py
run tests.py
toxは複数バージョンでテストするのによい。
[Django](http://d.hatena.ne.jp/keyword/Django).test.utils
Mock
setting.pyと[Travis](http://d.hatena.ne.jp/keyword/Travis).xyl
Toz-[Travis](http://d.hatena.ne.jp/keyword/Travis)
Readme.xtxtはマークダウンではなくrsdで書く。

## Bottle.py ライブコーディング&リーディング

buttol.pyでのwebアプリ作成の紹介

## Lightning Talks

1日目よりかは真面目内容だったな。

## Closing

虫の鳴き声が聞こえてきて秋を感じる中、クロージング。

会場を貸してくださった[早稲田大学](http://d.hatena.ne.jp/keyword/%C1%E1%B0%F0%C5%C4%C2%E7%B3%D8)ありがとうございました！
トイレで喫煙をした人がいたらしい、、、
トイレで喫煙はヤ[バイ](http://d.hatena.ne.jp/keyword/%A5%D0%A5%A4)でしょ...昭和の不良かな？
スポンサーからのプレゼントコーナーはよかったですね
モノタロウの工具すごかったｗめっちゃデカかったので
当たっても大変だけどよかったですねｗ

## まとめ

来年はLTのネタぐらいは作っておきたいなとおもいました。
普通に知り合いがほしいっすね。
あとは英語セッションも聞けるようになりたいので、[NHK](http://d.hatena.ne.jp/keyword/NHK)英語やっていきだ。
あとは数式も読めるように数学もやっていきだ。
Python3系の機能も覚えるぞ！
来年も参加したいイベントでした。スタッフの方々お疲れ様でした。
楽しかったです。ありがとうございました！
