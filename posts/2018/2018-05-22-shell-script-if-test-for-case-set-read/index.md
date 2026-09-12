---
title: "# シェルスクリプトで使える if,test,for,case,set,readコマンド"
date: "2018-05-22"
---

[シェルスクリプト](http://d.hatena.ne.jp/keyword/%A5%B7%A5%A7%A5%EB%A5%B9%A5%AF%A5%EA%A5%D7%A5%C8)で使えるコマンドをまとめました。
最後に簡単な[シェルスクリプト](http://d.hatena.ne.jp/keyword/%A5%B7%A5%A7%A5%EB%A5%B9%A5%AF%A5%EA%A5%D7%A5%C8)を実際に書いてみます。

## if

if文は条件が真の時、偽の時で処理をわけることができます。

- if文の文法

```
if 条件; then
   条件が真の時の処理
else
   条件が偽である時の処理
fi
```

- if~else~elif文

```
if 条件1; then
   条件1が真の時の処理
elif 条件2; thne
   条件2が真の時の処理
elif 条件3; thne
   条件3が真の時の処理
else
   上記すべての条件が偽である時の処理
fi
```

- if文の[入れ子](http://d.hatena.ne.jp/keyword/%C6%FE%A4%EC%BB%D2)構造

```
if 条件1; then
    条件1が真の時の処理
    if 条件2; then
         条件1,2 ともに真の時の処理
　　 fi
fi
```

- 引数がyesという文字列かどうか判定

```
#!/bin/bash

if [[ "$1" == yes ]]; then
    echo yes
else
    echo no
fi
```

[演算子](http://d.hatena.ne.jp/keyword/%B1%E9%BB%BB%BB%D2)にはどのようなものがあるのかは、まとめて調べておくとよさそう。
以下、参照でも大丈夫そう。

- [初心者向け！シェルスクリプト演算子まとめました【Linux】](https://eng-entrance.com/linux-shellscript-operator)
- [シェルスクリプトの基礎知識まとめ](https://qiita.com/katsukii/items/383b241209fe96eae6e7)

## testコマンド - []

`[` は記号ではなく、if文の条件として使用されるコマンドです。
`test`コマンドと同様の動作をします。
`[`コマンドは引数に[演算子](http://d.hatena.ne.jp/keyword/%B1%E9%BB%BB%BB%D2)を指定すると、文字列や数値の比較、ファイルの存在などを判定します。
結果が真なら`0`,偽なら`1`を終了ステータスとして返します。
終了ステータスは`$?`で確認できます。
ちなみに`]`は`[`コマンドの終わりを示す記号で`[`コマンドは最後の引数に`]`を指定しないといけない規則になっている。

```
hoge=yes
[ "$hoge" = "yes" ]
echo $?
```

## 

- `[[` は `[` より条件式をよりシンプルにかけます。
  - AND演算やOR演算は `-a` , `-o` の代わりに `&&`, `||` を使用します。
- 単語分割とパス名展開がされない。
- パターンマッチ
  - - などのパス名展開の機能が失われ、文字とみなされる。

## &&と||

&&は `コマンド1 && コマンド2` という形で使用し
コマンド1を実行して終了ステータス0である時だけコマンド2を実行する。

||は `コマンド1 || コマンド2` という形で使用し
コマンド1を実行して終了ステータス0以外の時だけコマンド2を実行する。

これらと以下のコマンドを組み合わせることでシュル[スクリプト](http://d.hatena.ne.jp/keyword/%A5%B9%A5%AF%A5%EA%A5%D7%A5%C8)記載することができると思います。

## for

```
for 変数 in 単語list
do
  繰り返す処理
done
```

例

```
#!/bin/bash

for i in aaa bbb ccc
do
    echo $i
done
```

パス名展開でも使えます。
注意点は`*.txt` にマッチするファイルがなかったら、 `*.txt` という文字列そのものがfile変数に代入されるので注意

```
#!/bin/bash

for file in *.txt
do
    cp "$file" "${file}.back"
done
```

[シェルスクリプト](http://d.hatena.ne.jp/keyword/%A5%B7%A5%A7%A5%EB%A5%B9%A5%AF%A5%EA%A5%D7%A5%C8)の引数に対して繰り返し処理をしたい場合は `"$@"` を使います。

```
#!/bin/bash

for i in "$@"
do
    echo $1
done
```

- breakとcontinue

for文の処理の中でbreakを呼ぶと、その時点でforのループを抜けます。
for文の処理の中でcontinueを呼ぶと、繰り返し処理のそれ以降の部分を省略して次の繰り返しに移行します。

```
for i in {1..9}
do
    if [[ $i -eq 3 ]]; then
        continue
    elif [[ $i -eq 5 ]]; then
        break
    fi

    echo $i
done
```

## case

caseは1つの文字列に対して複数のパターンを指定して、それぞれのパターンにマッチした処理を実行するための構文で
最初にマッチしたパターンの処理がおこなわれ、すべてのパターンにマッチしない場合は何も行われません。
case文の最後は `esac`です。

```
case 文字列 in
    パターン1)
        パターン1にマッチした場合の処理
        ;;
    パターン2)
        パターン2にマッチした場合の処理
        ;;
    パターン3)
        パターン3にマッチした場合の処理
        ;;
esac
```

case文では、パターンのところにパス名展開と同じ[ワイルドカード](http://d.hatena.ne.jp/keyword/%A5%EF%A5%A4%A5%EB%A5%C9%A5%AB%A1%BC%A5%C9)記号が使用可能

```
#!/bin/bash

file="$1"
case "$file" in
    *.txt)
        head "$file"
        ;;
    *.tar.gz)
        tar zxf "$file"
        ;;
    *)
        echo "not supported file : $file"
        ;;
esac
```

パターンに `|` で複数指定することも可能です。
また最後の条件を `*` にすることでマッチしなかった場合の処理が書けます。

```
#!/bin/bash

file="$1"
case "$file" in
    *.txt)
      head "$file"
      ;;
    *.tar.gz | *.tgz)
      tar xzf "file"
      ;;
    *)
      echo "not supported file : $file"
      ;;
esac
```

## while

whileは指定した条件が真である限り処理を繰り返す

```
while コマンド
do
    繰り返す処理
done
```

コマンドには `[[ ]]` を記述することも可能
breakやcontinueも使用できます。

```
#!/bin/bash

i=0
while [[ $i -lr 10 ]]
do
    echo "$i"
    i=$((i + 3))
done
```

## until

untilはwhileとは逆で条件が偽であるかぎり処理を繰り返す

```
#!/bin/bash

i=0
until [[ $i -gt 10 ]]
do
    echo "$i"
    i=$((i + 3))
done
```

## setコマンド

setコマンドの機能

1. 現在設定されているシェル変数の一覧を表示
2. シェルのオプションを有効または無効にする機能
3. 位置パラメータの値を設定する機能

今回は2番目の機能の説明をする。

`set -o`で有効, `set +o`で無効にすることができる

| オプション名 | 略称 | 内容 |
| --- | --- | --- |
| errexit | -e | コマンドの終了ステータスが0以外なら即座にシュルを終了する |
| nounset | -u | 未定義の変数を参照したときにエラーとする |
| pipefail | なし | パイプラインの戻り値が、終了ステータス0でない最後の値となる。 |

## readコマンド

readは標準入力から1行分読み取るコマンドで、
その内容が引数で指定した名前の変数に代入される。

`read 変数1 変数2 ...`

下記のように書けばユーザのキーボード入力待ちになり
readの引数であるinput変数に値が代入される。
これでユーザからの入力によって処理を分岐させることができる。

```
#!/bin/bash

echo 'delete'
read input

if [[ $input == yes ]]; then
    echo 'delete'
else
    echo 'cancel'
fi
```

readコマンドによってデータを読み取る際は、行の内容はIFS変数で指定されている文字によって単語に分割される。
IFS(シェルの区切り文字を指定する)変数で通常はスペース、タブ、改行が設定される。
それらの単語はreadコマンドの引数として指定した変数に順に代入される。
単語の数と比べて変数の数が少ない場合は、残った単語は最後の変数にまとめて代入される。
変数を1つしか指定しない場合は行全体がその変数に代入される。

標準入力の内容を一行ずつ読み取って処理することもできる。

```
#!/bin/bash

while read line
do
  printf '%s\n' "$line"
done
```

readコマンドは終了ステータスは通常0を返す。
EOF(ファイルの末尾)に到達した場合は0以外を返すので
ループさせれば入力の先頭から末尾まで行単位で読みこむ。

### readコマンド使用上の注意

readコマンドは`\`を[エス](http://d.hatena.ne.jp/keyword/%A5%A8%A5%B9)ケープ文字として解釈するので`\`の後にIFSに含まれる文字が続いていても単語の区切りとしない。
行末に`\`があった場合は行の終わりとみなさず、次の行と合わせて1つの行として読み込む。
オプション`-r`でこの機能を無効化することができる。
次にreadコマンドは行を単語に分割する際、行の先頭と終わりにあるIFSに含まれる文字を取り除くので
上の例では先頭と末尾の空白文字が削除された後の値がline変数に代入されることになる。

例えば先頭行の空白文字を残したい場合は、次の要因IFS変数の値を空文字列とすれば、
readコマンドでの単語の分割は行われず、空白文字を残すことができます。

```
#!/bin/bash

while IFS= read -r line
do
  printf '%s\n' "$line"
done
```

## [シェルスクリプト](http://d.hatena.ne.jp/keyword/%A5%B7%A5%A7%A5%EB%A5%B9%A5%AF%A5%EA%A5%D7%A5%C8)を書いてみよう

最後に大きいファイルを削除するイメージで[スクリプト](http://d.hatena.ne.jp/keyword/%A5%B9%A5%AF%A5%EA%A5%D7%A5%C8)を書いてみました。
実行すると同じ[ディレクト](http://d.hatena.ne.jp/keyword/%A5%C7%A5%A3%A5%EC%A5%AF%A5%C8)リにある `100GB.img*` のファイルを消します。

```
#!/bin/bash

set -euo pipefail

for file in 100GB.img*
do
    echo "対象のファイルは $file で間違いないですか?(y/n)"
    read input

    if [[ $input == "y" ]] || [[ $input == "yes" ]]; then
        ionice -c3 nice -n 19 rm $file
        sleep 30
        echo "$file を削除しました"
    else
        echo "CANCEL"
    fi
done
```

rmで大きいファイルを削除するとIOささり障害が出そうですね。
そんな時はtruncateコマンドでファイルサイズを小さくして削除するのがよいでしょう。
参考リンク: [大量・巨大なファイル操作を低負荷で行う方法](http://www.nari64.com/?p=748)

また、こちらの新しいシェルプログラミングの教科書はわかりやすくておすすめです。

[![新しいシェルプログラミングの教科書](/images/shell-script-if-test-for-case-set-read/shell-script-if-test-for-case-set-read-0.jpg "新しいシェルプログラミングの教科書")](http://www.amazon.co.jp/exec/obidos/ASIN/B077NC4N14/tokusa1093-22/)

[新しいシェルプログラミングの教科書](http://www.amazon.co.jp/exec/obidos/ASIN/B077NC4N14/tokusa1093-22/)

- 作者: 三宅英明
- 出版社/メーカー: [SBクリエイティブ](http://d.hatena.ne.jp/keyword/SB%A5%AF%A5%EA%A5%A8%A5%A4%A5%C6%A5%A3%A5%D6)
- 発売日: 2017/11/21
- メディア: [Kindle](http://d.hatena.ne.jp/keyword/Kindle)版
- [この商品を含むブログを見る](http://d.hatena.ne.jp/asin/B077NC4N14/tokusa1093-22)
