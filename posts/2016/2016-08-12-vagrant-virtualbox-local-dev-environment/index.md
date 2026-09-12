---
title: "vagrantとvirtualboxで作るローカル開発環境"
date: "2016-08-12"
---

## [VirtualBox](http://d.hatena.ne.jp/keyword/VirtualBox)をインストール

<https://www.virtualbox.org>

## [Vagrant](http://d.hatena.ne.jp/keyword/Vagrant)をインストール

<https://www.vagrantup.com>

## [CentOS](http://d.hatena.ne.jp/keyword/CentOS)インストール

作業[ディレクト](http://d.hatena.ne.jp/keyword/%A5%C7%A5%A3%A5%EC%A5%AF%A5%C8)リを作成して移動します

```
$ mkdir MyVagrant
$ cd MyVagrant
$ mkdir mycentos
$ cd mycentos
```

[CentOS 6.7のboxを探す](https://atlas.hashicorp.com/boxes/search)

初期化コマンドを実行し、Vagrantfileという設定ファイルが作成されるのを確認します。
また、boxが追加されていることも確認できます。
Vagrantfileを編集してローカルIP(192.168.〜)の[コメントアウト](http://d.hatena.ne.jp/keyword/%A5%B3%A5%E1%A5%F3%A5%C8%A5%A2%A5%A6%A5%C8)を外します。
そしたら[VM](http://d.hatena.ne.jp/keyword/VM)を起動し、[ssh](http://d.hatena.ne.jp/keyword/ssh)で接続します。

```
$ vagrant init bento/centos-6.7
$ ll
$ vagrant box list
bento/centos-6.7 (virtualbox, 2.2.7)
$ vim Vagrantfile
 config.vm.network "private_network", ip: "192.168.xxx.xxx"
$ vagrant up
$ vagrant ssh
```

[vagrant](http://d.hatena.ne.jp/keyword/vagrant) [ssh](http://d.hatena.ne.jp/keyword/ssh)の時に以下のエラーメッセージが出力されました。
[ssh](http://d.hatena.ne.jp/keyword/ssh)接続の認証が失敗しているようです。
`$ vagrant ssh`で接続をして、パスワードがきかれてきます。
`vagrant`を入力すればログインできました。

```
default: Warning: Remote connection disconnect. Retrying...
default: Warning: Authentication failure. Retrying...
default: Warning: Authentication failure. Retrying...
```

dotinstallの[Github](http://d.hatena.ne.jp/keyword/Github)にcentos6.5のansible一式があったので
それを利用しましょう。

```
$ sudo yum -y install git
$ git clone https://github.com/dotinstallres/centos65.git
$ cd centos65/
$ ./run.sh
$ ruby -v
-bash: ruby: コマンドが見つかりません
$ exec $SHELL -l
$ ruby -v
ruby 2.2.2p95 (2015-04-13 revision 50295) [x86_64-linux]
```

他にインストールされたものを確認

```
$ php -v
PHP 5.6.24 (cli) (built: Jul 21 2016 07:42:08)
Copyright (c) 1997-2016 The PHP Group
Zend Engine v2.6.0, Copyright (c) 1998-2016 Zend Technologies
$ mysql --version
mysql  Ver 14.14 Distrib 5.5.51, for Linux (x86_64) using readline 5.1
$ python --version
Python 2.6.6
$ ruby -v
ruby 2.2.2p95 (2015-04-13 revision 50295) [x86_64-linux]
$ sudo service httpd status
httpd (pid  26838) を実行中...
```

[Apache](http://d.hatena.ne.jp/keyword/Apache)と[PHP](http://d.hatena.ne.jp/keyword/PHP)が起動しているので、
試しにWEBページをブラウザ上に表示させてみましょう。
以下のindex.[php](http://d.hatena.ne.jp/keyword/php)を`/var/www/html`配下において
ブラウザ上で確認しましょう。
ブラウザのURLに`サーバのIPアドレス/index.php`を打ち込んで
[Hello World](http://d.hatena.ne.jp/keyword/Hello%20World)の文字が表示されることを確認します。

```
$ vim index.php
<?php

echo "Hello World";
```

[IPアドレス](http://d.hatena.ne.jp/keyword/IP%A5%A2%A5%C9%A5%EC%A5%B9)ではなくて、ホスト名を入力して確かめたい人は
hostsファイルを修正すればできます。
[IPアドレス](http://d.hatena.ne.jp/keyword/IP%A5%A2%A5%C9%A5%EC%A5%B9)に対してホスト名を記入すればできます。

```
$ vi /etc/hosts
IPアドレス  ホスト名
```

再度、URLに`ホスト名/index.php`で表示できることを確認

これで環境構築の設定は以上。

CentOS7のAnsibleはないようなので、
作成しておこう。

# boxの削除

```
Macintosh:mycentos shuhei$ vagrant box list
bento/centos-6.7 (virtualbox, 2.2.7)
Macintosh:mycentos shuhei$ vagrant box remove bento/centos-6.7
Box 'bento/centos-6.7' (v2.2.7) with provider 'virtualbox' appears
to still be in use by at least one Vagrant environment. Removing
the box could corrupt the environment. We recommend destroying
these environments first:

default (ID: 113a639075cb4f1c8e398bf1a5bf5340)
host (ID: 44374733ca5644bfb8a902c6cd73cf5c)
web (ID: c5c7135a72c44ef682ed38fe8c5ed156)

Are you sure you want to remove this box? [y/N] y
Removing box 'bento/centos-6.7' (v2.2.7) with provider 'virtualbox'...
Macintosh:mycentos shuhei$ vagrant box list
There are no installed boxes! Use `vagrant box add` to add some.
```

Vagrantfileは残っているのでrｍコマンドで削除

```
Macintosh:mycentos shuhei$ ll
total 8
-rw-r--r--  1 shuhei  staff  3005  8 12 06:15 Vagrantfile
```
