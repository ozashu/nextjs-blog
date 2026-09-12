---
title: "CentOSにRuby2系をインストールした"
date: "2016-07-22"
---

ServerSpecを始めようとして、
ServerSpecには[Ruby](http://d.hatena.ne.jp/keyword/Ruby)が必要なので、
[Ruby](http://d.hatena.ne.jp/keyword/Ruby)のインストールからはじめました。

CentOS6系ではRuby2系でないとエラーが出てしまうので
今回はRuby2系のインストールをします。

- [こちらを参考にさせて頂きました](http://dotnsf.blog.jp/archives/1020034700.html)

まずは[Ruby](http://d.hatena.ne.jp/keyword/Ruby)がインストールをしているか確認します。

```
# ruby -v
-bash: ruby: コマンドが見つかりません
```

rbenvを使用して[Ruby](http://d.hatena.ne.jp/keyword/Ruby)をインストールします。
今回は/usr/local/src/配下に[Ruby](http://d.hatena.ne.jp/keyword/Ruby)をインストールします。

```
# cd /usr/local/src/
```

rbenvは[Github](http://d.hatena.ne.jp/keyword/Github)から提供されているのでgitをインストールします。

```
# yum install git
```

gitで[Github](http://d.hatena.ne.jp/keyword/Github)からrbenvをチェックアウトします。

```
# git clone git://github.com/sstephenson/rbenv.git
```

次に[ruby](http://d.hatena.ne.jp/keyword/ruby)-build[プラグイン](http://d.hatena.ne.jp/keyword/%A5%D7%A5%E9%A5%B0%A5%A4%A5%F3)をrbenv/plugins/配下にインストールします。

```
# mkdir rbenv/plugins
# cd rbenv/plugins/
# git clone git://github.com/sstephenson/ruby-build.git
```

/etc/profile に以下の３行を追加して、rbenv を初期化＆実行するための環境設定を行います

~/.rbenv/binにrbenvコマンドが入っているので、そこにパスを通します。
※[zsh](http://d.hatena.ne.jp/keyword/zsh)使ってる場合は~/.[bash](http://d.hatena.ne.jp/keyword/bash)\_profileの代わりに~/.zshenvにして下さい。

rbenv initコマンドを呼び出すようにします。実際は~/.rbenv/libexec/rbenv-initのシェルを呼び出しているようです。

```
# echo 'export RBENV_ROOT="/usr/local/src/rbenv"' >> ~/.bash_profile
# echo 'export PATH="${RBENV_ROOT}/bin:${PATH}"' >> ~/.bash_profile
# echo 'eval "$(rbenv init -)"' >> ~/.bash_profile
# test -r ~/.bashrc && . ~/.bashrc
```

`test -r ~/.bashrc && . ~/.bashrc`はbashrcが読み込まれなくなったら入れてみて下さい。

シェルを再起動して設定を反映させましょう。

```
# source ~/.bash_profile
```

パスが通ってることを確認します。

```
# echo $RBENV_ROOT
/usr/local/src/rbenv
# rbenv root
/usr/local/src/rbenv
```

必要になるモジュールを[yum](http://d.hatena.ne.jp/keyword/yum) でインストールします

```
# yum install gcc make openssl-devel libffi-devel
```

rbenv でインストールできる [Ruby](http://d.hatena.ne.jp/keyword/Ruby) のバージョン一覧を確認します。

```
# rbenv install -l
```

お好きなバージョンをインストールしてください。

```
# rbenv install 2.3.1
```

OSによっては以下のような実行結果（エラー）が出ました。

```
BUILD FAILED (CentOS release 6.x (Final) using ruby-build xxxxxxxxxxx)
```

以下のコマンドを実行して解決できました。

```
yum install -y readline-devel
```

[Ruby](http://d.hatena.ne.jp/keyword/Ruby)のインストールを確認

```
# rbenv global 2.3.1
# ruby -v
ruby 2.3.1p112 (2016-04-26 revision 54768) [x86_64-linux]
```

他のバージョンをインストールしても以下のコマンドでデフォルトバージョンを変更できます。

```
# rbenv global バージョン名
```
