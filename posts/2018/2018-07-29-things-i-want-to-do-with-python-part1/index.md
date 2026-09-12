---
title: "pythonでしたいと思ったことまとめ①"
date: "2018-07-29"
---

## print()でカンマ区切りで表示したい

```
print(a, b, c, sep=',')
```

## 行末の改行を削除したい

```
string.rstrip()
```

文字列の末尾部分を除去したコピーを返す。引数 chars は除去される[文字集合](http://d.hatena.ne.jp/keyword/%CA%B8%BB%FA%BD%B8%B9%E7)を指定する文字列。

## 特定の文字を除去したい

文字列.replace() メソッドを利用します。

以下で改行を除去できる。

```
remove_enter = jugemu.replace('\n', '')
```

## [csv](http://d.hatena.ne.jp/keyword/csv)ファイルなどのカンマで文字列を分割したい

```
string.strip(',')
```

## ファイルの中身に[追記](http://d.hatena.ne.jp/keyword/%C4%C9%B5%AD)していきたい

`a` を使う、 `w` だと上書きしてしまう。

```
with open('output/hoge.log', 'a', encoding='utf-8') as f:
```

## 現在の時刻を取得する

datetimeモジュールを使う

```
from datetime import datetime

now = datetime.now()
```

日時.yearで日時の年の値を数値として取得できる。

```
print(str(now.year) + '年')
```

日時.monthで日時の月の値を数値として取得できる。

```
print(str(now.month) + '月')
```

日時.dayで日時の日の値を数値として取得できる。

```
print(str(now.day) + '日')
```

日時.hourで日時の時の値を数値として取得できる。

```
print(str(now.hour) + '時')
```

日時.minuteで日時の分の値を数値として取得できる。

```
print(str(now.minute) + '分')
```

日時.secondで日時の秒の値を数値として取得できる。

```
print(str(now.second) + '秒')
```

## 日時のオブジェクトを作成したい

datetime(年, 月, 日, 時, 分, 秒)と指定可能で時分秒を省略すると00:00:00になる。

```
one_day = datetime(2016, 1, 31, 10, 20, 30)
```

## 日時を文字列に変換したい

```
print(now.strftime('%Y/%m/%d'))  # -> 2016/01/10
print(now.strftime('%Y-%m-%d'))  # -> 2016-01-10
print(now.strftime('%Y年%m月%d日'))  # -> 2016年01月10日
```

`strftime` (フォーマット)を利用して変換できる

- %Y: 西暦（4桁）の10進表記を表します。
- %m: 0埋めした10進数で表記した月。
- %d: 0埋めした10進数で表記した月中の日にち。
- %H: 0埋めした10進数で表記した時 (24時間表記）。
- %M: 0埋めした10進数で表記した分。
- %S: 0埋めした10進数で表記した秒。

## 文字列を日付にしたい

`strptime` を使う。

```
from datetime import datetime

day_str = '2018/3/14 12:30:00'
dt = datetime.strptime(day_str, '%Y/%m/%d %H:%M:%S') # 第二引数には変換したい文字列に一致したフォーマットを渡す
print(dt) # 2018-03-14 12:30:00
```

## X日前(後)の日付を表示したい

`timedelta` を使う

```
from datetime import datetime
from datetime import timedelta

olympic_day = datetime(2020, 7, 24)
before_3days = now - timedelta(days=3) # 3日前
after_3days = now + timedelta(days=3) # 3日後
```

## Pathを結合したい

`os.path.join(a, b, ...)` で指定可能

## Pathが存在するか確認したい

`os.path.exists(path)` で指定したpathが存在するか確認できる。

## 指定したpathがファイルか[ディレクト](http://d.hatena.ne.jp/keyword/%A5%C7%A5%A3%A5%EC%A5%AF%A5%C8)リか確認したい

ファイルなら

```
os.path.isfile(path)
```

[ディレクト](http://d.hatena.ne.jp/keyword/%A5%C7%A5%A3%A5%EC%A5%AF%A5%C8)リなら

```
os.path.isdir(path)
```

## 指定された[ディレクト](http://d.hatena.ne.jp/keyword/%A5%C7%A5%A3%A5%EC%A5%AF%A5%C8)リー内のファイル名と子[ディレクト](http://d.hatena.ne.jp/keyword/%A5%C7%A5%A3%A5%EC%A5%AF%A5%C8)リー名をリストで返したい

`os.walk(top)` で返せる。

for文に引数root, dirs, filesを指定すると、そこに各[ディレクト](http://d.hatena.ne.jp/keyword/%A5%C7%A5%A3%A5%EC%A5%AF%A5%C8)リーごとのデータが代入されていく。

```
import os

def directory_tree(target_path):
    for root, dirs, files in os.walk(target_path) :
        print(root)
        for dir in dirs:
            print('\t', dir)
        for file in files:
            print('\t', file)
```

- root には、 [ディレクト](http://d.hatena.ne.jp/keyword/%A5%C7%A5%A3%A5%EC%A5%AF%A5%C8)リのパス が代入。
- dirs には、 root内に存在するサブ[ディレクト](http://d.hatena.ne.jp/keyword/%A5%C7%A5%A3%A5%EC%A5%AF%A5%C8)リーのリスト が代入。
- files には、 root内に存在するファイルのリスト が代入。
