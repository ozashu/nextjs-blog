---
title: "シェルスクリプト②(declare,配列,連想配列)"
date: "2017-11-26"
---

## declareでの変数宣言

オプションをつけることで、変数に属性を付与できる

| オプション | 意味 |
| --- | --- |
| -r | 変数を読み取り専用 |
| -i | 変数を整数とする |
| -a | 変数を配列とする |
| -A | 変数を[連想配列](http://d.hatena.ne.jp/keyword/%CF%A2%C1%DB%C7%DB%CE%F3)とする |

指定しない場合は、型は文字列になる

読み取り専用ならreadonlyコマンドをつかうとよい

## 配列

配列は要素を並べて格納し、インデックスという番号で参照できるデータ構造。
インデックスは0からはじまる。

- 配列の作成

配列変数の右辺に()を書いて、要素を記述する。これを複合代入と呼びます。

```
# fruit=(apple orange banana)
```

空の配列

```
# list=()
```

declareでの配列宣言

```
# declare -a arr1
```

- 要素の参照

配列の要素の参照は${配列名[インデックス]}

```
# echo ${arr1[0]}
```

インデックスを指定しない場合は、インデックス0が参照される。

要素の数を取得するにはインデックス"@"を指定
${#配列名[@}}

```
# echo ${#arr1[@]}
```

- インデックスを利用した代入

[bash](http://d.hatena.ne.jp/keyword/bash)の配列は連続している必要がないので、空のある配列は複合代入がつくれる。
以下だとインデックス2と4が空文字列の配列ができる。

```
# arr2=(test0 test1 [3]=test3 [5]=test5 test6 )
```

- 配列の中身を変更

```
# test3=(hoge1 hogehoge)
# test3[1]=hoge2
# 
# echo ${test3[0]}
# echo ${test3[1]}
```

- 要素の削除

```
# unset test3[1]
```

- すべての要素の参照

配列のすべての要素を参照する場合は、インデックスに\*や@を指定

```
# test4=(hoge0 hoge1 hoge2 hoge3 hoge4)
# echo ${test4[*]}
# echo ${test4[@]}
```

""でくくった違いも"$@"と"$*"と同じで、
"${配列[@]}"は要素が個別の文字列として展開される
"${配列[*]}"は配列全体をIFS変数の最初の1文字(たいていはスペース)で連結した1つの文字列として展開される
基本的には"${配列[@]}"を使うのがよい。

配列のコピーに使える

```
# test4_2=("${test4[@]}")
```

- 要素の追加

"${配列[@]}"の他の使い方は、元の配列の先頭や末尾に要素を追加した、新しい配列の作成です

```
# test4_3=(hoge5 hoge6 "${test4[@]}") # 配列の先頭に要素を追加
# test4_4=("${test4[@]}" hoge7 hoge8) # 配列の末尾に要素を追加
```

- 値の存在するインデックスの取得

${!配列名[\*]}や&{!配列名[@]}みたいに、配列名の前に!をつけると、配列の中で値が存在するインデックス一覧を取得できる

```
# echo ${!arr2[@]}
```

## [連想配列](http://d.hatena.ne.jp/keyword/%CF%A2%C1%DB%C7%DB%CE%F3)

[連想配列](http://d.hatena.ne.jp/keyword/%CF%A2%C1%DB%C7%DB%CE%F3)はkeyと[value](http://d.hatena.ne.jp/keyword/value)のデータ構造
hashとかmapとかdictとか言われるやつ

declare -Aで[連想配列](http://d.hatena.ne.jp/keyword/%CF%A2%C1%DB%C7%DB%CE%F3)宣言をする。
これを忘れると配列になってしまうので、注意。

```
# declare -A user=([id]=1 [name]=testuser)
```

- 要素の参照

```
# echo ${user[id]}
# echo ${user[name]}
```

- [連想配列](http://d.hatena.ne.jp/keyword/%CF%A2%C1%DB%C7%DB%CE%F3)の要[素数](http://d.hatena.ne.jp/keyword/%C1%C7%BF%F4)
  - ${#[連想配列](http://d.hatena.ne.jp/keyword/%CF%A2%C1%DB%C7%DB%CE%F3)名[@]}

```
# echo ${#user[@]}
```

- 要素の代入

[連想配列](http://d.hatena.ne.jp/keyword/%CF%A2%C1%DB%C7%DB%CE%F3)ではキーを指定して、キーに対応する値があれば上書き。なければキーと値を追加します。

```
# user[name]=testuser2 # 上書き
# user[country]=Japan  # 新規にキーと値を追加
```

- 要素の削除
  - unsetコマンド

```
# unset user[name]
```

- すべての値の参照

  - ${[連想配列](http://d.hatena.ne.jp/keyword/%CF%A2%C1%DB%C7%DB%CE%F3)名[\*]} もしくは ${[連想配列](http://d.hatena.ne.jp/keyword/%CF%A2%C1%DB%C7%DB%CE%F3)名[@]}
  - 代入した順番は維持されないので注意
- キー一覧の取得

  - ${![連想配列](http://d.hatena.ne.jp/keyword/%CF%A2%C1%DB%C7%DB%CE%F3)名[@]}

新しいシェルプログラミングの教科書はわかりやすくておすすめです。

[![新しいシェルプログラミングの教科書](/images/shell-script-2-declare-arrays/shell-script-2-declare-arrays-0.jpg "新しいシェルプログラミングの教科書")](http://www.amazon.co.jp/exec/obidos/ASIN/B077NC4N14/tokusa1093-22/)

[新しいシェルプログラミングの教科書](http://www.amazon.co.jp/exec/obidos/ASIN/B077NC4N14/tokusa1093-22/)

- 作者: 三宅英明
- 出版社/メーカー: [SBクリエイティブ](http://d.hatena.ne.jp/keyword/SB%A5%AF%A5%EA%A5%A8%A5%A4%A5%C6%A5%A3%A5%D6)
- 発売日: 2017/11/21
- メディア: [Kindle](http://d.hatena.ne.jp/keyword/Kindle)版
- [この商品を含むブログを見る](http://d.hatena.ne.jp/asin/B077NC4N14/tokusa1093-22)
