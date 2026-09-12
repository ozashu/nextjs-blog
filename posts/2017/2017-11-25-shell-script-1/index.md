---
title: "シェルスクリプト①"
date: "2017-11-25"
---

# [シェルスクリプト](http://d.hatena.ne.jp/keyword/%A5%B7%A5%A7%A5%EB%A5%B9%A5%AF%A5%EA%A5%D7%A5%C8)まとめ

## 一行目のおまじない

1行目にシェバンと呼ぶ、[bash](http://d.hatena.ne.jp/keyword/bash)で動作しますよというおまじないがある。

```
#!/bin/bash
```

## 変数

変数宣言では空白文字列は入れてはだめ

```
変数=値
```

declareで宣言していない場合は値は文字列とされる。

値にスペースやタブを含みたい場合はシングル[ダブル]クォートでくくる

```
test='test test'
```

空白文字も格納できる

```
empty1=
```

or

```
empty2=''
```

変数を参照する場合は変数名の前に$をつける

```
$test
```

宣言していない変数を参照してもエラーにならず、空白文字として実行されてしまうので注意

## [環境変数](http://d.hatena.ne.jp/keyword/%B4%C4%B6%AD%CA%D1%BF%F4)

[環境変数](http://d.hatena.ne.jp/keyword/%B4%C4%B6%AD%CA%D1%BF%F4)は親プロセスから子プロセスに引き継がれるもので、親プロセスのシェルで設定されていた[環境変数](http://d.hatena.ne.jp/keyword/%B4%C4%B6%AD%CA%D1%BF%F4)の値は子プロセスにコピーされコマンドから参照可能。

printenvコマンドで[環境変数](http://d.hatena.ne.jp/keyword/%B4%C4%B6%AD%CA%D1%BF%F4)の一覧を表示可能

[環境変数](http://d.hatena.ne.jp/keyword/%B4%C4%B6%AD%CA%D1%BF%F4)の定義

exportコマンドで[環境変数](http://d.hatena.ne.jp/keyword/%B4%C4%B6%AD%CA%D1%BF%F4)の定義が可能

```
CONFIG_NAME=test #変数CONFIG_NAMEを宣言
export CONFIG_NAME #exportで環境変数にする
```

or

```
export CONFIG_NAME=test #一行で変数定義と環境変数にするのもできる
```

## 特殊なシェル変数

ホーム[ディレクト](http://d.hatena.ne.jp/keyword/%A5%C7%A5%A3%A5%EC%A5%AF%A5%C8)リの表示

- $HOME

カレント[ディレクト](http://d.hatena.ne.jp/keyword/%A5%C7%A5%A3%A5%EC%A5%AF%A5%C8)リの表示

- $[PWD](http://d.hatena.ne.jp/keyword/PWD)

ログインユーザーのログインシェル

- $SHELL

現在動作している[bash](http://d.hatena.ne.jp/keyword/bash)コマンドのフルパス

- $[BASH](http://d.hatena.ne.jp/keyword/BASH)

現在動作している[bash](http://d.hatena.ne.jp/keyword/bash)のバージョン情報

- $[BASH](http://d.hatena.ne.jp/keyword/BASH)\_VERSION

現在実行している[シェルスクリプト](http://d.hatena.ne.jp/keyword/%A5%B7%A5%A7%A5%EB%A5%B9%A5%AF%A5%EA%A5%D7%A5%C8)の行番号を格納している。
いま何行目なのか出力できるのでデバックなどに使える。

- $LINENO

[ロケール](http://d.hatena.ne.jp/keyword/%A5%ED%A5%B1%A1%BC%A5%EB)を指定

- $LANG

localeコマンドで現在設定されている[ロケール](http://d.hatena.ne.jp/keyword/%A5%ED%A5%B1%A1%BC%A5%EB)が確認できる

PATHは、シェルがコマンドを探す[ディレクト](http://d.hatena.ne.jp/keyword/%A5%C7%A5%A3%A5%EC%A5%AF%A5%C8)リを指定するための変数
[ディレクト](http://d.hatena.ne.jp/keyword/%A5%C7%A5%A3%A5%EC%A5%AF%A5%C8)リは:で区切る
コマンド検索パスと呼ばれ、左から順に探していく

- $PATH

コマンドを配置するための[ディレクト](http://d.hatena.ne.jp/keyword/%A5%C7%A5%A3%A5%EC%A5%AF%A5%C8)リを作成した場合、コマンドを探すパスを追加したい場合、このPATHを使う。
以下は現在のパスに加えてホーム[ディレクト](http://d.hatena.ne.jp/keyword/%A5%C7%A5%A3%A5%EC%A5%AF%A5%C8)リ配下のbin[ディレクト](http://d.hatena.ne.jp/keyword/%A5%C7%A5%A3%A5%EC%A5%AF%A5%C8)リからもコマンドを探すように指定

```
PATH=$HOME/bin:$PATH
```

IFSはシェルの区切り文字を指定するための変数
[bash](http://d.hatena.ne.jp/keyword/bash)は文字列を単語に分割する必要があるときは、ここの文字列を区切り文字として使う。
通常はスペース、タブ、改行が設定されている。

```
$ echo "$IFS" |od -a
0000000  sp  ht  nl  nl
0000004
```

odコマンドはファイルの内容を8進数で表示しますが、-aをつけると、制御文字などが文字の名前で出力される
sp=スペース、ht=タブ、nlは改行

## 位置パラメータ

$1,$2のように1から始まる数値を名前に持つ変数で、
引数を参照することができる。

位置パラメータをすべて参照する場合は、$\*や$@で可能

ダブルクォートでくくると動作が変わるので注意
"$@"=位置パラメータそれぞれが文字列として展開される
"$\*"=連結した一つの文字パラメータとして展開されてしまう。

なので$@を使ったほうが意図しない動作を起こさない。

## 特殊パラメータ

| 変数名 | 内容 |
| --- | --- |
| $# | 位置パラメータの個数 |
| $? | 直前に実行したコマンドの終了ステータス値 |
| $$ | 現在のプロセスのプロセスID |
| $! | 最後に実行したバックグラウンドコマンドのプロセスID |

[シェルスクリプト](http://d.hatena.ne.jp/keyword/%A5%B7%A5%A7%A5%EB%A5%B9%A5%AF%A5%EA%A5%D7%A5%C8)に与えられた引数の個数

- $#

コマンド終了ステータス値
0は成功,0以外は失敗

- $?

現在のプロセスIDを表示

- $$

ユニークなファイル名を作る時にも使える

```
tempfile=/tmp/tempfile$$
```

バックグラウンドのプロセスIDを表示

- $!

バックグラウンドで実行したプロセスをkillするときに使える
