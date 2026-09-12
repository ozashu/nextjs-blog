---
title: "severspec入門"
date: "2016-09-04"
---

# Serverspec

[Apache](http://d.hatena.ne.jp/keyword/Apache),[PHP](http://d.hatena.ne.jp/keyword/PHP),[MySQL](http://d.hatena.ne.jp/keyword/MySQL),[Nagios](http://d.hatena.ne.jp/keyword/Nagios)をインストールして
インストールされているかをテストしていきます。

Serverspecは[Ruby](http://d.hatena.ne.jp/keyword/Ruby)が必要なのでインストールをします。
[こちら](http://ozashu.hatenablog.com/entry/2016/07/22/115147)を参考にインストールしてみてください。

[Ruby](http://d.hatena.ne.jp/keyword/Ruby)をインストールしたら、
[Ruby](http://d.hatena.ne.jp/keyword/Ruby)用のgemというソフトウェア[リポジトリ](http://d.hatena.ne.jp/keyword/%A5%EA%A5%DD%A5%B8%A5%C8%A5%EA)からServerspecをインストールします。

```
# yum install rubygems
```

```
# gem install serverspec
```

インストール完了したら
Serverspec用に[ディレクト](http://d.hatena.ne.jp/keyword/%A5%C7%A5%A3%A5%EC%A5%AF%A5%C8)リを作成し、テストをしてみます。

```
# mkdir ~/servertest
# cd servertest/
# serverspec-init
Select OS type:

  1) UN*X
  2) Windows

Select number: 1

Select a backend type:

  1) SSH
  2) Exec (local)

Select number: 1

Vagrant instance y/n: n
Input target host name: web
 + spec/
 + spec/web/
 + spec/web/sample_spec.rb
 + spec/spec_helper.rb
 + Rakefile
 + .rspec
```

rake spec実行時にエラーが出たのでまとめる

- "set :request\_pty, true"を書いてくれ

`spec_helper.rb`に追記して事なきを得ました。

```
Please write "set :request_pty, true" in your spec_helper.rb or other appropriate file.
```

- HighLine か Termiosをインストールしてくれ

`gem install highline`で事なきを得ました。

```
Text will be echoed in the clear. Please install the HighLine or Termios libraries to suppress echoed text.
```

- passwordか[localhost](http://d.hatena.ne.jp/keyword/localhost)を記入してくれ

```
Wrong sudo password! Please confirm your password on localhost.
```

これはこちらを参考にしました。[CentOS 6.5でserverspecサーバ構築　その２](http://rollinglinux.blog.fc2.com/blog-entry-6.html)
こちらも参考[【入門】serverspecでSSH経由でリモートホストにspec流す](http://j-caw.co.jp/blog/?p=1594)
sudoパスワードを聞かれるようにしないといけないようですね。
rake specのコマンドを少し変えれば良いらしい。

```
$ SUDO_PASSWORD=xxxxxxxx rake spec
```

もしくは

```
$ ASK_SUDO_PASSWORD=1 rake spec
```

これでOK。

これらのエラーメッセージは環境によっては聞かれなかったので
[ruby](http://d.hatena.ne.jp/keyword/ruby)のバージョンとかが原因なのかなあ。

サンプルのテストファイルを削除なり、
名前変更するなりしておきましょう。
書き方の参考に読んでおくのもよいです。

```
# mv sample_spec.rb{,.bak}
```

## [Apache](http://d.hatena.ne.jp/keyword/Apache)インストール

serverspecで[Apache](http://d.hatena.ne.jp/keyword/Apache)インストールのテストを書きます。

```
$ vi httpd_spec.rb
require 'spec_helper'
describe package('httpd') do
    it { should be_installed }
end
```

テストが通るように[Apache](http://d.hatena.ne.jp/keyword/Apache)を[yum](http://d.hatena.ne.jp/keyword/yum)でインストールして、
サービスを起動させます。

```
# yum install httpd
# service httpd status
httpd は停止しています
# service httpd start
httpd を起動中: httpd: apr_sockaddr_info_get() failed for shuhei
httpd: Could not reliably determine the server's fully qualified domain name, using 127.0.0.1 for ServerName
                                                         [  OK  ]
# chkconfig --list |grep htt
httpd           0:off   1:off   2:off   3:off   4:off   5:off   6:off
# chkconfig httpd on
# chkconfig --list |grep htt
httpd           0:off   1:off   2:on    3:on    4:on    5:on    6:off
```

## [PHP](http://d.hatena.ne.jp/keyword/PHP)インストール

`php、php-devel、php-mbstring、php-gd`が入っているテストを書きます。

```
require 'spec_helper'

%w(php php-devel php-mbstring php-gd).each do |pkg|
  describe package(pkg) do
    it { should be_installed }
  end
end
```

[yum](http://d.hatena.ne.jp/keyword/yum)でインストールします。

```
# yum install php php-devel php-mbstring php-gd
```

## MySQL5.6インストール

[MySQL](http://d.hatena.ne.jp/keyword/MySQL)のインストールには2通りあります。

[yum](http://d.hatena.ne.jp/keyword/yum)と[rpm](http://d.hatena.ne.jp/keyword/rpm)でインストールの2種類あり、
MySQL5.6まではインストール方法でパッケージやサービス名に
差異があるとのこと。
5.7からは差異はないらしい

- [yum](http://d.hatena.ne.jp/keyword/yum)[リポジトリ](http://d.hatena.ne.jp/keyword/%A5%EA%A5%DD%A5%B8%A5%C8%A5%EA)を使用したインストール

[yum](http://d.hatena.ne.jp/keyword/yum)コマンドでのインストールは簡単なのでおすすめですが、
インストールされるパスが固定されるので、
1台のサーバに複数の[MySQL](http://d.hatena.ne.jp/keyword/MySQL)をインストールすることができないです。
また、`yum upgrade`時に[MySQL](http://d.hatena.ne.jp/keyword/MySQL)サーバがマイナーバージョンアップされることがあるらしく、
インストール後に無効化する必要があります。
メジャーバージョンアップはされないように、メジャーバージョンアップごとに
違う[リポジトリ](http://d.hatena.ne.jp/keyword/%A5%EA%A5%DD%A5%B8%A5%C8%A5%EA)名が割り当てられています。

(今回は1台のサーバに[MySQL](http://d.hatena.ne.jp/keyword/MySQL)サーバ２台たてて、[レプリケーション](http://d.hatena.ne.jp/keyword/%A5%EC%A5%D7%A5%EA%A5%B1%A1%BC%A5%B7%A5%E7%A5%F3)を行いたいので、
[rpm](http://d.hatena.ne.jp/keyword/rpm)パッケージでインストールしていきます。)

- [rpm](http://d.hatena.ne.jp/keyword/rpm)パッケージを使用したインストール

[MySQL](http://d.hatena.ne.jp/keyword/MySQL)は[サイト](http://dev.mysql.com/downloads/)からダウンロードします。
`/usr/local/src`配下に`Red Hat Enterprise Linux 6 / Oracle Linux 6 (x86, 64-bit), RPM Bundle`をインストールします。

```
# cd /usr/local/src/
# wget http://dev.mysql.com/get/Downloads/MySQL-5.6/MySQL-5.6.32-1.el6.x86_64.rpm-bundle.tar
# tar xvf MySQL-5.6.32-1.el6.x86_64.rpm-bundle.tar
MySQL-shared-5.6.32-1.el6.x86_64.rpm
MySQL-test-5.6.32-1.el6.x86_64.rpm
MySQL-server-5.6.32-1.el6.x86_64.rpm
MySQL-shared-compat-5.6.32-1.el6.x86_64.rpm
MySQL-client-5.6.32-1.el6.x86_64.rpm
MySQL-embedded-5.6.32-1.el6.x86_64.rpm
MySQL-devel-5.6.32-1.el6.x86_64.rpm
```

パッケージを`-i`でインストールします。

```
# rpm -i MySQL-*.rpm
警告: MySQL-client-5.6.32-1.el6.x86_64.rpm: ヘッダ V3 DSA/SHA1 Signature, key ID 5072e1f5: NOKEY
エラー: 依存性の欠如:
    MySQL-devel は mysql-devel-5.1.73-7.el6.x86_64 と競合します。
```

`MySQL-devel は mysql-devel-5.1.73-7.el6.x86_64 と競合します。`
なんてエラーがでました。`mysql-devel-5.1.73-7.el6.x86_64`なんて入れた覚えはない。
`-e`でアンインストールしてみるが、インストールされていないとのこと。。。

```
# rpm -e mysql-devel-5.1.73-7.el6.x86_64.rpm
エラー: パッケージ mysql-devel-5.1.73-7.el6.x86_64.rpm はインストールされていません。
```

```
# yum remove mysql-libs
```

インストール成功

```
# rpm -i MySQL-*.rpm
```

サービスを起動させて3306ポートでLISTENしていることを確認
[rpm](http://d.hatena.ne.jp/keyword/rpm)インストールなのでサービス名が[mysql](http://d.hatena.ne.jp/keyword/mysql)です。
[yum](http://d.hatena.ne.jp/keyword/yum)インストールもしくは5.7はmysqldになります。

```
# service mysql status
 ERROR! MySQL is not running
# service mysql start
Starting MySQL SUCCESS!
[root@shuhei src]# service mysql status
 SUCCESS! MySQL.. running (17092)
# ps auxf |grep mysql
root     17204  0.0  0.0 103320   852 pts/2    S+   17:29   0:00                          \_ grep mysql
root     16989  0.0  0.1  11340  1364 pts/2    S    17:29   0:00 /bin/sh /usr/bin/mysqld_safe --datadir=/var/lib/mysql --pid-file=/var/lib/mysql/shuhei.pid
mysql    17092  2.2 44.2 1013188 451848 pts/2  Sl   17:29   0:00  \_ /usr/sbin/mysqld --basedir=/usr --datadir=/var/lib/mysql --plugin-dir=/usr/lib64/mysql/plugin --user=mysql --log-error=/var/lib/mysql/shuhei.err --pid-file=/var/lib/mysql/shuhei.pid
# netstat -atnp |grep mysql
tcp        0      0 :::3306                     :::*                        LISTEN      17092/mysqld
```

[MySQL](http://d.hatena.ne.jp/keyword/MySQL)のプロセスが起動されているか、ポート接続しているかテストを書きます

```
require 'spec_helper'

describe service('mysqld') do
  it { should be_enabled }
  it { should be_running }
end

describe port(3306) do
  it { should be_listening }
end

describe service('mysql') do
  it { should be_enabled }
  it { should be_running }
end

describe port(3308) do
  it { should be_listening }
end
```

## [Nagios](http://d.hatena.ne.jp/keyword/Nagios)インストール

[Nagiosのインストールは公式サイト参照](https://assets.nagios.com/downloads/nagioscore/docs/nagioscore/4/en/quickstart-fedora.html)

[nagios](http://d.hatena.ne.jp/keyword/nagios)がインストールされているテストを書きます。

```
require 'spec_helper'

describe service('nagios') do
  it { should be_enabled }
  it { should be_running }
end
```

`/usr/local/src`配下に
最新版4.2.0を[サイト](https://www.nagios.org/)からインストールします。

```
# wget https://assets.nagios.com/downloads/nagioscore/releases/nagios-4.2.0.tar.gz#_ga=1.247838018.451693304.1472123299
# wget https://nagios-plugins.org/download/nagios-plugins-2.1.2.tar.gz#_ga=1.179877985.451693304.1472123299
```

必要なパッケージをインストール

```
yum install gcc glibc glibc-common
yum install gd gd-devel
```

[Nagios](http://d.hatena.ne.jp/keyword/Nagios)ユーザとグループを作成

```
# /usr/sbin/useradd -m nagios
# passwd nagios
# /usr/sbin/groupadd nagcmd
# /usr/sbin/usermod -a -G nagcmd nagios
# /usr/sbin/usermod -a -G nagcmd apache
# less /etc/passwd
# less /etc/group
```

ダウンロードしたfileを解凍

```
tar xzf nagios-4.2.0.tar.gz
cd nagios-4.2.0
```

作成したグループを指定してconfig scriptを実行

```
./configure --with-command-group=nagcmd
```

[コンパイル](http://d.hatena.ne.jp/keyword/%A5%B3%A5%F3%A5%D1%A5%A4%A5%EB)実行

```
make all
```

インストール実行

```
make install
make install-init
make install-config
make install-commandmode
```

web configをインストール

```
make install-webconf
```

[Nagios](http://d.hatena.ne.jp/keyword/Nagios)のweb画面にログインユーザーnagiosadminを作成

```
htpasswd -c /usr/local/nagios/etc/htpasswd.users nagiosadmin
```

[Apache](http://d.hatena.ne.jp/keyword/Apache)再起動

```
service httpd restart
```

pluginの[コンパイル](http://d.hatena.ne.jp/keyword/%A5%B3%A5%F3%A5%D1%A5%A4%A5%EB)とインストール

```
# ./configure --with-nagios-group=nagios --with-mysql=/usr/bin/mysql
checking for a BSD-compatible install... /usr/bin/install -c
checking whether build environment is sane... configure: error: newly created file is older than distributed files!
Check your system clock
```

OSとハードの時間が実際の時間とずれているのが原因でインストールに失敗する
(2016/08/25)

```
# date
2016年  7月 24日 日曜日 18:17:55 JST
# hwclock
2016年07月24日 18時17分58秒  -0.524383 秒
```

時間を合わせればインストールできる。

```
 date -s "08/25 20:39 2016"
2016年  8月 25日 木曜日 20:39:00 JST
 date
2016年  8月 25日 木曜日 20:39:02 JST
 hwclock
2016年07月24日 18時20分17秒  -0.148454 秒
 hwclock -w
# hwclock --systohc
# hwclock
2016年08月25日 20時39分16秒  -0.051022 秒
```

[nagios](http://d.hatena.ne.jp/keyword/nagios)がインストールされているテストを書きます。

```
require 'spec_helper'

describe service('nagios') do
  it { should be_enabled }
  it { should be_running }
end
```
