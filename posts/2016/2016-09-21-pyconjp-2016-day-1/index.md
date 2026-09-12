---
title: "PyconJP 2016〜1日目〜"
date: "2016-09-21"
---

PyconJP2016の１日目に参加してきたので、
メモ代わりに雑に書きます。

Pycon自体は初参加で、会社のマネーでこれました(感謝)。
会場は[早稲田大学](http://d.hatena.ne.jp/keyword/%C1%E1%B0%F0%C5%C4%C2%E7%B3%D8)だったので、近くて助かりました。
[大久保駅](http://d.hatena.ne.jp/keyword/%C2%E7%B5%D7%CA%DD%B1%D8)や[新大久保駅](http://d.hatena.ne.jp/keyword/%BF%B7%C2%E7%B5%D7%CA%DD%B1%D8)から歩いていける距離だったので、
[西早稲田](http://d.hatena.ne.jp/keyword/%C0%BE%C1%E1%B0%F0%C5%C4)が近いことに気づけて知見を得ました。

## [Keynote](http://d.hatena.ne.jp/keyword/Keynote)

[Python](http://d.hatena.ne.jp/keyword/Python)コミュニティに多大なる貢献をしている`Jessica McKellar`の[Keynote](http://d.hatena.ne.jp/keyword/Keynote)でした。(Last Nameはなんて読むかはわからない。)
同時通訳機が置いていない席に座ったので、英語を頑張って聞きましたが、
半分も理解できませんでした。なんとなく、コミュニティ活動について話していた気がする。。。
彼女はプログラミング教育にも力を入れているので、とても尊敬しています。
[Python](http://d.hatena.ne.jp/keyword/Python)入門の動画を見たり、O'reillyの動画も観たことある。
`Hello App`という[Django](http://d.hatena.ne.jp/keyword/Django)入門書にも`Jessica McKellar`の動画がおすすめされていたりするので、
[Python](http://d.hatena.ne.jp/keyword/Python)でプログラミングをこれから学ぼうという人はきっと彼女の活動の恩恵を受けるのだろう。
あと、Closingで話に上がったCode of Conductはこの[Keynote](http://d.hatena.ne.jp/keyword/Keynote)関連だったんだろうな。。

## マイクロサービスを利用する側のパフォーマンス向上策

[Python](http://d.hatena.ne.jp/keyword/Python)でマイクロサービスは珍しいなあと思って聞きました。
モノタロウの方だったのですが、モノタロウってヨッピーさんがインタビューしていた会社だっけかな。
マイクロサービスの話というかパフォーマンスの話で、IO負荷をどうするかという話でした。
マイクロサービス化すすめると[API](http://d.hatena.ne.jp/keyword/API)コールが増えて、負荷が増えるようで、
varnishキャッシュや[memcached](http://d.hatena.ne.jp/keyword/memcached)を[API](http://d.hatena.ne.jp/keyword/API)サーバに入れて対策したけど、
IO待ちへの対策が不十分だったので[gevent](http://methane.github.io/gevent-tutorial-ja/)を使うというお話でした。

書き方で、下のような記述をみて闇っぽいなと思いクスッとしました。

```
from gevent import monkey
monkey.patch_all()
```

マイクロサービスで負荷増えるってう〜んという感じで、
スケールアウトすれば良いのではという感じもした。

## Lunch

お昼はお弁当が出てよかった。しかも豪華！
特に誰とも話さずぼっち飯[かまし](http://d.hatena.ne.jp/keyword/%A4%AB%A4%DE%A4%B7)ました。。。

## [Python](http://d.hatena.ne.jp/keyword/Python)入門 コードリーディング

`たった一ファイルの python スクリプトから始める OSS 開発入門`も気になったのですが、
録画されてなさそうなビギナーセッションを観ました。

ファイルの場所と[pdb](http://d.hatena.ne.jp/keyword/pdb)のモジュールの読むとっかかり
join,splitの実装を確認して、
どこにファイルがあるのかを確認し、ドキュメントと照らし合わせて読んで見るという使い方を教えてくれました。

ファイルの場所と[pdb](http://d.hatena.ne.jp/keyword/pdb)の使い方

```
[root@shuhei pywork]# python
Python 3.5.2 (default, Jul 18 2016, 05:05:01)
[GCC 4.4.7 20120313 (Red Hat 4.4.7-17)] on linux
Type "help", "copyright", "credits" or "license" for more information.
>>> import oa.path
Traceback (most recent call last):
  File "<stdin>", line 1, in <module>
ImportError: No module named 'oa'
>>> import os.path
>>> os.path
<module 'posixpath' from '/root/.pyenv/versions/3.5.2/lib/python3.5/posixpath.py'>
>>> os.path.dirname(".")
''
>>> os.path.dirname("D://")
'D:'
>>> os.path.join("spam", "egg")
'spam/egg'
>>> print(os.path.join("spam", "egg"))
spam/egg
>>> os.path
<module 'posixpath' from '/root/.pyenv/versions/3.5.2/lib/python3.5/posixpath.py'>
>>> os.path
<module 'posixpath' from '/root/.pyenv/versions/3.5.2/lib/python3.5/posixpath.py'>
>>> os.path.__file__
'/root/.pyenv/versions/3.5.2/lib/python3.5/posixpath.py'
```

モジュールの読むとっかかり
join,splitの実装を確認
どこにファイルがあるのか、確認し、ドキュメントと照らし合わせて読んで見る。

```
>>> import this
The Zen of Python, by Tim Peters

Beautiful is better than ugly.
Explicit is better than implicit.
Simple is better than complex.
Complex is better than complicated.
Flat is better than nested.
Sparse is better than dense.
Readability counts.
Special cases aren't special enough to break the rules.
Although practicality beats purity.
Errors should never pass silently.
Unless explicitly silenced.
In the face of ambiguity, refuse the temptation to guess.
There should be one-- and preferably only one --obvious way to do it.
Although that way may not be obvious at first unless you're Dutch.
Now is better than never.
Although never is often better than *right* now.
If the implementation is hard to explain, it's a bad idea.
If the implementation is easy to explain, it may be a good idea.
Namespaces are one honking great idea -- let's do more of those!
>>> this.__file__
'/root/.pyenv/versions/3.5.2/lib/python3.5/this.py'
```

ROT13の[wiki](http://d.hatena.ne.jp/keyword/wiki)
暗号化をかけると文章がでてくる

[pdb](http://d.hatena.ne.jp/keyword/pdb)というデバッガを使って一行ずつ確認してみる

`import pdb; pdb.set_trace()`

```
d = {}
import pdb; pdb.set_trace()
for c in (65, 97):
    for i in range(26):
        d[chr(i+c)] = chr((i+13) % 26 + c)

print("".join([d.get(c, c) for c in s]))
```

```
d = {}
for c in (65, 97):
    for i in range(26):
        d[chr(i+c)] = chr((i+13) % 26 + c)
        if chr(i+c) == 'E':
                import pdb; pdb.set_trace()

print("".join([d.get(c, c) for c in s]))
```

- コマンド

```
l 複数行
s ステップ実行
c 続ける
b
```

- antigravityモジュール

```
>>> import antigravity
>>> antigravity.__file__
'/root/.pyenv/versions/3.5.2/lib/python3.5/antigravity.py'
```

- [webブラウザ](http://d.hatena.ne.jp/keyword/web%A5%D6%A5%E9%A5%A6%A5%B6)モジュール

```
>>> import webbrowser
>>> webbrowser.__file))
  File "<stdin>", line 1
    webbrowser.__file))
                     ^
SyntaxError: invalid syntax
>>> webbrowser.__file__
'/root/.pyenv/versions/3.5.2/lib/python3.5/webbrowser.py'
```

- os

```
>>> import os
>>> os.__file__
'/root/.pyenv/versions/3.5.2/lib/python3.5/os.py'
```

built-inなら[python](http://d.hatena.ne.jp/keyword/python)に組み込まれているからcの実装
cpython,[github](http://d.hatena.ne.jp/keyword/github)
python自身のソースをみないとだめ。

```
>>> import ita
Traceback (most recent call last):
  File "<stdin>", line 1, in <module>
ImportError: No module named 'ita'
>>> import itaotools
Traceback (most recent call last):
  File "<stdin>", line 1, in <module>
ImportError: No module named 'itaotools'
>>> import itertools
>>> itertools.__file__
Traceback (most recent call last):
  File "<stdin>", line 1, in <module>
AttributeError: module 'itertools' has no attribute '__file__'
>>> itertools
<module 'itertools' (built-in)>
```

## 数学的基礎から学ぶDeep Lerning

途中から数式が完全に理解できなくてすやぁっとなった。。。
NumpyとScipyで[機械学習](http://d.hatena.ne.jp/keyword/%B5%A1%B3%A3%B3%D8%BD%AC)をやるとのことだったのですが、難しい。。。
微妙に行列っぽくなったと思ったら、いきなりシンプルな線形性のある数式になったふぁっ！？ってなった。
[偏微分方程式](http://d.hatena.ne.jp/keyword/%CA%D0%C8%F9%CA%AC%CA%FD%C4%F8%BC%B0)は解いたこと無いのでわからず。。。
ただ、このセッションでやっていたことが先行発売されていた
[オライリー](http://d.hatena.ne.jp/keyword/%A5%AA%A5%E9%A5%A4%A5%EA%A1%BC)社から出版される`ゼロから作るDeep Learning`で近いので、
この本を読むと良さそうだった。その前に数学だと思うけど。

## [Python](http://d.hatena.ne.jp/keyword/Python)入門 ライブコーディング

# ここのコードは不備があるので読み飛ばして下さい。後で修正するつもり。

`基礎から学ぶWebアプリケーションフレームワークの作り方`は録画にまかせて
ビギナーセッションに参加してきました。
Web [API](http://d.hatena.ne.jp/keyword/API) の呼び出しといったコードを書いてくれました。

テストツール
flake8

[インタラクティブ](http://d.hatena.ne.jp/keyword/%A5%A4%A5%F3%A5%BF%A5%E9%A5%AF%A5%C6%A5%A3%A5%D6)シェル
ipython

なにが良いかというとtab補完

ipyhonを使わないなら`readline`を使うと良いが、ipythonを使った方が楽。

```
>>> import readline, rlcompleter
>>> readline.parse_and_bind('tag: complete')
>>> import sys
sys
>>> import sys
```

[デバッグ](http://d.hatena.ne.jp/keyword/%A5%C7%A5%D0%A5%C3%A5%B0)ツール
[pdb](http://d.hatena.ne.jp/keyword/pdb)
ipdb
処理止められて変数を確認できる

```
c continu
n nextで一行図ス
```

slack [api](http://d.hatena.ne.jp/keyword/api)を[curl](http://d.hatena.ne.jp/keyword/curl) で実行する

`pip install request`

```
import requests
import sys

# print(sys.argv)
# sys.exit(0)

url = slackのapiのurl

r = requests.get(
    'https://api.github.com/user') # urlのパラメータと分離左折
token =

channel = 

# text =
# text = 'こんにちは'
if len(sys.argv) < 1: # 例外処理
    print('引数を指定してください')
    sys.exet(0)
text = sys.argv[1]

pretty = 0

params = {
    'token': token,
    'channel': channel,
    'type':
    'pretty': 
    'as_user': True,
}

r = requests.get(url, params=params)
# print(r.text)
data = r.json()
# import ipdb; ipdb.set_trace()
# print(data)

import pprint
pprint.pprint(data)
```

```
pp data
type(data)
pp data['channnel']
```

git cloneしてlocalにライブラリドキュメントもってきて調べるとよい。

```
import requests
import xml.etree.ElementTree as ET
tree = ET.parse('country_data.xml')
root = tree.getroot()

url = ''

app_id =

params = {
    'appid': appi,
    'category': id,
}
r = rewuests.get*url, params-params)
# print(r.text)
root = ET.fromstring(r.text)
pritn(root)
for resut in root:
    for item in enumerate(resut, 0);:
            if i == 0:
                    continu
            import ipdb; ipdb.set_trace()
            print(item)
```

[xml](http://d.hatena.ne.jp/keyword/xml)をパースする
[xml](http://d.hatena.ne.jp/keyword/xml).extree

```
for i in root:oprint:i)
for j in root:result
pp item
for i in item: print(i)
item.find('{urn:yahoo:jp:auc"}')
```

[python](http://d.hatena.ne.jp/keyword/python)入門ビギナー向け勉強会で続きをやってくれるとのことでした。

## How [Python](http://d.hatena.ne.jp/keyword/Python) helped create the visual effects for an Emmy nominated TV show

英語セッションでよくわからなかった。。。
英語やらなあかんね。。。

## LT

- カラオケ採点
- 師匠探し
- 仮想通貨
- 振り返り
- 虹工房

すべて良いLTでした。
虹工房はLTはもったいない内容。

## Closing

Code of Conduct守ろうな話。

## Party

[Twitter](http://d.hatena.ne.jp/keyword/Twitter)でFollowしているけど、会ったことがない人達(ハムカズ先生とくーむさん)に会ってみようと目標を立てて参加。

すてにゃんさんはやぱちーで会ったことがあったけど、
顔と[Twitter](http://d.hatena.ne.jp/keyword/Twitter) ID絶対に一致されてないだろうなと思ったので、長く話せてよかった。
アイドルなだけあり、みんながすてにゃんさんに話しかけていて、自分はそのついでに話をさせていただいたりした。
すてにゃんというハブで他の参加者が繋がるというのは良さあった。

hamukazu先生とも話せてよかった。まともな言動をする立派な大人だった。仕事も忙しそうだ。
コミュニティでの活動をしているからか、知り合いが多そうで、色んな人が声をかけていた。

くーむさんはすてにゃんさんが紹介というか話すついでに話せた。
[Twitter](http://d.hatena.ne.jp/keyword/Twitter)のアイコンを認識されていたのだろうかはわかんないけど、
これを機に覚えていて貰えれば幸いです。

あとは[ツイッター](http://d.hatena.ne.jp/keyword/%A5%C4%A5%A4%A5%C3%A5%BF%A1%BC)IDを交換したり、しなかったりですが、
繋がりを大事にしていきたいと思いました。

来年も参加したい。というか2日目寝坊しないようにしたい。
