---
title: "Pythonのクラスの基本"
date: "2018-02-28"
---

# クラスの基本

## クラスの書式

```
class クラス名:
    メソッドや属性
```

## メソッド

クラス内の関数をメソッドと呼ぶ。
メソッドにはクラスに関連する処理を記述。

## 属性

クラス内のデータを属性と呼ぶ。
属性はクラスの[インスタンス](http://d.hatena.ne.jp/keyword/%A5%A4%A5%F3%A5%B9%A5%BF%A5%F3%A5%B9)ごとのデータを持つ。
`self.hoge` のようなクラスに関するデータのこと。

## classの[インスタンス](http://d.hatena.ne.jp/keyword/%A5%A4%A5%F3%A5%B9%A5%BF%A5%F3%A5%B9)の利用

クラスを設計図として、[インスタンス](http://d.hatena.ne.jp/keyword/%A5%A4%A5%F3%A5%B9%A5%BF%A5%F3%A5%B9)を作成

```
c1 = NewClass()
c2 = NewClass()
```

右辺にクラス名()と書いて[インスタンス](http://d.hatena.ne.jp/keyword/%A5%A4%A5%F3%A5%B9%A5%BF%A5%F3%A5%B9)を作成。
c1とc2がそれぞれ[インスタンス](http://d.hatena.ne.jp/keyword/%A5%A4%A5%F3%A5%B9%A5%BF%A5%F3%A5%B9)となる。
作成時に値を渡したい場合は()の中に引数を渡せば良い。

### **init**メソッド

`__init__` メソッドはクラスから[インスタンス](http://d.hatena.ne.jp/keyword/%A5%A4%A5%F3%A5%B9%A5%BF%A5%F3%A5%B9)が作られた直後に実行される特殊メソッド。
メソッドの書式は関数と同じ。
メソッドの第一引数には[インスタンス](http://d.hatena.ne.jp/keyword/%A5%A4%A5%F3%A5%B9%A5%BF%A5%F3%A5%B9)自身が渡される。(self)

```
class User(object):
    def __init__(self, name, age):
        self.name = name
        self.age = age

    def info(self):
        return self.name + ':' + str(self.age)
```

Userクラスの[インスタンス](http://d.hatena.ne.jp/keyword/%A5%A4%A5%F3%A5%B9%A5%BF%A5%F3%A5%B9)を作る例。

```
user1 = User('田村ゆかり', 17)
```

[インスタンス](http://d.hatena.ne.jp/keyword/%A5%A4%A5%F3%A5%B9%A5%BF%A5%F3%A5%B9)作成時に[クラスタ](http://d.hatena.ne.jp/keyword/%A5%AF%A5%E9%A5%B9%A5%BF)名に渡される引数は`__init__`メソッドに渡されている。
クラスのメソッドの第一引数に指定されているselfは実際に呼び出し元から引数を設定する場合は無視する。
Userクラスの場合は、[インスタンス](http://d.hatena.ne.jp/keyword/%A5%A4%A5%F3%A5%B9%A5%BF%A5%F3%A5%B9)作成時にnameとageに渡される値を設定する。
