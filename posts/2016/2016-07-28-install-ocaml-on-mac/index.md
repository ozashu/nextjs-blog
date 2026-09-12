---
title: "MacにOcamlインストール"
date: "2016-07-28"
---

プログラミングの基礎を読みすすめるにあたって、
[Ocaml](http://d.hatena.ne.jp/keyword/Ocaml)の環境構築でやったことのメモです。

## Install

```
brew install opam
```

## [インタプリタ](http://d.hatena.ne.jp/keyword/%A5%A4%A5%F3%A5%BF%A5%D7%A5%EA%A5%BF)起動

```
ocaml
```

## [インタプリタ](http://d.hatena.ne.jp/keyword/%A5%A4%A5%F3%A5%BF%A5%D7%A5%EA%A5%BF)終了

```
#quit;;
```

## 日本語の文字化けを解消する

プログラミングの基礎でコードを写経すると日本語が[インタプリタ](http://d.hatena.ne.jp/keyword/%A5%A4%A5%F3%A5%BF%A5%D7%A5%EA%A5%BF)で文字化けします。
[EUC](http://d.hatena.ne.jp/keyword/EUC)を使用するように書いてあるのですが、iTermの[文字コード](http://d.hatena.ne.jp/keyword/%CA%B8%BB%FA%A5%B3%A1%BC%A5%C9)を変えてもうまくいかなかったです。
[インタプリタ](http://d.hatena.ne.jp/keyword/%A5%A4%A5%F3%A5%BF%A5%D7%A5%EA%A5%BF)側で日本語文字列がエスケープされているそうです。
(ここを参照)<http://d.hatena.ne.jp/camlspotter/20100106/1262745517>

```
# let printer ppf = Format.fprintf ppf "\"%s\"";;
val printer : Format.formatter -> string -> unit = <fun>
# #install_printer printer;;
```

これで文字化けが解消されているはずです。
それではプログラミングの基礎頑張っていきましょ〜👍
