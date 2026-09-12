---
title: "今度こそMySQLを覚えたい人のためのMySQL5.6入門"
date: "2018-05-26"
---

最近、今度こそ[MySQL](http://d.hatena.ne.jp/keyword/MySQL)を覚えたい!!と思いました。
では今から[MySQL](http://d.hatena.ne.jp/keyword/MySQL)覚えるなら何から始めるのが良いでしょうか。[MySQL](http://d.hatena.ne.jp/keyword/MySQL)は5.7や8も出てきました。
今回は日本語のドキュメントがある唯一のバージョンの5.6系をCentOS6にインストールします。

[MySQL 5.6 リファレンスマニュアル](https://dev.mysql.com/doc/refman/5.6/ja/)

5.xもまだたくさんあり、今後数年は現役と思われるので、
基本的に捨てられた機能は忘れてよいと思いますが、
[Query Cache](https://yakst.com/ja/posts/4612)などは結構使っていたりするので5.xでは知ってたほうが良いでしょう。

また、その他データベースの基礎知識については[こちら](http://ozashu.hatenablog.com/entry/2017/11/02/193714)も説明できるとよいです。

- [yum](http://d.hatena.ne.jp/keyword/yum)[リポジトリ](http://d.hatena.ne.jp/keyword/%A5%EA%A5%DD%A5%B8%A5%C8%A5%EA)でのインストール

[MySQLダウンロードページ](https://dev.mysql.com/downloads/mysql/)
[MySQLのyumリポジトリ](https://dev.mysql.com/downloads/repo/yum/)

CentOS6系に最新の[MySQL](http://d.hatena.ne.jp/keyword/MySQL)[リポジトリ](http://d.hatena.ne.jp/keyword/%A5%EA%A5%DD%A5%B8%A5%C8%A5%EA)をインストール
デフォルトで5.7をインストールするようになっているので、
MySQL5.6をインストールするように変更し
[MySQL](http://d.hatena.ne.jp/keyword/MySQL)をインストール。終わったらサービスを起動させる。

```
# yum install https://dev.mysql.com/get/mysql57-community-release-el6-11.noarch.rpm
# sudo vim /etc/yum.repos.d/mysql-community.repo
# Enable to use MySQL 5.6
[mysql56-community]
name=MySQL 5.6 Community Server
baseurl=http://repo.mysql.com/yum/mysql-5.6-community/el/6/$basearch/
enabled=1     # 0から1
gpgcheck=1
gpgkey=file:///etc/pki/rpm-gpg/RPM-GPG-KEY-mysql

[mysql57-community]
name=MySQL 5.7 Community Server
baseurl=http://repo.mysql.com/yum/mysql-5.7-community/el/6/$basearch/
enabled=0     # 1から0
gpgcheck=1
gpgkey=file:///etc/pki/rpm-gpg/RPM-GPG-KEY-mysql
# yum install mysql-community-server
# service mysqld start
# mysql -v
Welcome to the MySQL monitor.  Commands end with ; or \g.
Your MySQL connection id is 2
Server version: 5.6.38 MySQL Community Server (GPL)
```

- [rpm](http://d.hatena.ne.jp/keyword/rpm)インストール

[ダウンロードページ](https://dev.mysql.com/downloads/mysql/)から
[rpm](http://d.hatena.ne.jp/keyword/rpm)パッケージを取得して、インストール

```
wget https://dev.mysql.com/get/Downloads/MySQL-5.6/mysql-5.6.38-linux-glibc2.12-x86_64.tar.gz
rpm -i MySQL-*.RPM
service MySQL
```

## [mysql](http://d.hatena.ne.jp/keyword/mysql)\_secure\_installationでセキュアな設定

```
# mysql_secure_installation

NOTE: RUNNING ALL PARTS OF THIS SCRIPT IS RECOMMENDED FOR ALL MySQL
      SERVERS IN PRODUCTION USE!  PLEASE READ EACH STEP CAREFULLY!

In order to log into MySQL to secure it, we'll need the current
password for the root user.  If you've just installed MySQL, and
you haven't set the root password yet, the password will be blank,
so you should just press enter here.

Enter current password for root (enter for none): # 起動したてでrootパスワードが設定されていないので、そのまま「Enter」。
OK, successfully used password, moving on...

Setting the root password ensures that nobody can log into the MySQL
root user without the proper authorisation.

Set root password? [Y/n] Y # Rootパスワードを設定するので「Y」。
New password:
Re-enter new password:
Password updated successfully!
Reloading privilege tables..
 ... Success!

By default, a MySQL installation has an anonymous user, allowing anyone
to log into MySQL without having to have a user account created for
them.  This is intended only for testing, and to make the installation
go a bit smoother.  You should remove them before moving into a
production environment.

Remove anonymous users? [Y/n] Y # 誰でもログインできる状態になっているのでアノニマスユーザをRemoveするので「Y」。
 ... Success!

Normally, root should only be allowed to connect from 'localhost'.  This
ensures that someone cannot guess at the root password from the network.

Disallow root login remotely? [Y/n] Y　# RootでMySQLにリモートログインできるのはセキュリティ的にNGなので「Y」。
 ... Success!

By default, MySQL comes with a database named 'test' that anyone can
access.  This is also intended only for testing, and should be removed
before moving into a production environment.

Remove test database and access to it? [Y/n] Y # testデータベースは不要のため「Y」。
 - Dropping test database...
ERROR 1008 (HY000) at line 1: Can't drop database 'test'; database doesn't exist
 ... Failed!  Not critical, keep moving...
 - Removing privileges on test database...
 ... Success!

Reloading the privilege tables will ensure that all changes made so far
will take effect immediately.

Reload privilege tables now? [Y/n] Y # 上記設定による権限の変更等を即時反映したいので「Y」。
 ... Success!

All done!  If you've completed all of the above steps, your MySQL
installation should now be secure.

Thanks for using MySQL!

Cleaning up...
```

## CREATE USER 命令でユーザ作成

rootはスーパユーザなので作業ユーザを作成しましょう。
今回は作業ユーザにmysqltestデータベースの権限を付与します。

```
% mysql -uroot -p
Enter password: root の パスワード を 入力
mysql > CREATE USER ユーザ名@localhost IDENTIFIED BY '*******';
mysql> GRANT ALL ON mysqltest.* TO ユーザ名@localhost;
Query OK, 0 rows affected (0.00 sec)

mysql> quit
Bye
```

作業ユーザでログインします。
`--default-character-set=utf8mb4` は接続の[文字コード](http://d.hatena.ne.jp/keyword/%CA%B8%BB%FA%A5%B3%A1%BC%A5%C9)を[UTF-8](http://d.hatena.ne.jp/keyword/UTF-8)に設定するオプションです。

```
[root@localhost src]# mysql -uユーザ名 -p --default-character-set=utf8mb4
Enter password:
```

mysqltestデータベースを作成します。
`CHARSET utf8mb4` はDB配下で使う[文字コード](http://d.hatena.ne.jp/keyword/%CA%B8%BB%FA%A5%B3%A1%BC%A5%C9)を[utf-8](http://d.hatena.ne.jp/keyword/utf-8)にします。

```
mysql> CREATE DATABASE mysqltest CHARSET utf8mb4;
Query OK, 1 row affected (0.01 sec)
```

```
mysql> use mysqladmin
Database changed
```

[sql](http://d.hatena.ne.jp/keyword/sql)\_modeを設定しましょう。

[MySQL](http://d.hatena.ne.jp/keyword/MySQL)は標準では、指定された値のままレコードに格納できなくても、なるべくエラーにならないように処理を続けようとする（ERRORではなく警告になる）。
たとえば、 NULLを許さずデフォルト値も設定されていないカラムを指定せずにINSERTしてもエラーにならず、
型に応じた暗黙のデフォルト値が設定される。
また、 DATE 型のカラムに0000-00-00や2016-04-00などの0を含む値が許されています。
ほかにも、文字列カラムで最大長を超えた長さの文字列を格納しようとしてもエラーにならずに切り捨てられたり、
[文字コード](http://d.hatena.ne.jp/keyword/%CA%B8%BB%FA%A5%B3%A1%BC%A5%C9)変換で正しく変換処理ができなかった場合などにもエラーになりません。
データベースには不正な値が入らないように設定は変更しましょう。
[sql](http://d.hatena.ne.jp/keyword/sql)\_modeで変更可能です。
クライアント接続ごとに `SET sql_ mode =...` を 発行するのではなく、すべての接続で[sql](http://d.hatena.ne.jp/keyword/sql)\_modeの設定を有効にしたい場合は、
mysqldの起動時オプションや設定ファイルで指定することができます。

[ルーク！MySQLではkamipo TRADITIONALを使え！](http://www.songmu.jp/riji/entry/2015-07-08-kamipo-traditional.html)

```
mysql> SET sql_mode='TRADITIONAL,NO_AUTO_VALUE_ON_ZERO,ONLY_FULL_GROUP_BY';
Query OK, 0 rows affected (0.00 sec)
```

## DB作成

みんなだいすきKEN\_ALL.[csv](http://d.hatena.ne.jp/keyword/csv) を用いてデータベースを作成しましょう。

```
# cd /usr/local/src/
# wget http://zipcloud.ibsnet.co.jp/zipcodedata/download?di=1364544418311 -O post.zip
# unzip post.zip
# nkf -w --overwrite KEN_ALL.CSV
```

以下は[MySQL](http://d.hatena.ne.jp/keyword/MySQL)にログインして実行します。
[CSV](http://d.hatena.ne.jp/keyword/CSV)のインポートでエラーが出ました。
secure\_file\_privで設定されている[ディレクト](http://d.hatena.ne.jp/keyword/%A5%C7%A5%A3%A5%EC%A5%AF%A5%C8)リから出ないとインポートができないようです。
このエラーで検索するとsecure\_file\_privを無効化する力技の記事が多かった。。。

```
mysql> create database postaldb default character set utf8;
mysql> use postaldb;
Database changed
mysql> CREATE TABLE  `postal_codes` (`jis` varchar(10) DEFAULT NULL, `zip_old` varchar(5) DEFAULT NULL, `zip` varchar(7) DEFAULT NULL, `addr1_kana` varchar(100) DEFAULT NULL, `addr2_kana` varchar(100) DEFAULT NULL, `addr3_kana` varchar(100) DEFAULT NULL, `addr1` varchar(100) DEFAULT NULL, `addr2` varchar(100) DEFAULT NULL, `addr3` varchar(100) DEFAULT NULL, `c1` int(11) DEFAULT NULL, `c2` int(11) DEFAULT NULL, `c3` int(11) DEFAULT NULL, `c4` int(11) DEFAULT NULL, `c5` int(11) DEFAULT NULL, `c6` int(11) DEFAULT NULL) ENGINE=InnoDB DEFAULT CHARSET=utf8;
Query OK, 0 rows affected (0.03 sec)
mysql> load data infile "/usr/local/src/KEN_ALL.CSV" into table postal_codes fields terminated bY ',' optionally enclosed by '"';
ERROR 1290 (HY000): The MySQL server is running with the --secure-file-priv option so it cannot execute this statement
mysql> SELECT @@secure_file_priv;
+-----------------------+
| @@secure_file_priv    |
+-----------------------+
| /var/lib/mysql-files/ |
+-----------------------+
1 row in set (0.00 sec)

ERROR 1290 (HY000): The MySQL server is running with the --secure-file-priv option so it cannot execute this statement
# mv /usr/local/src/KEN_ALL.CSV /var/lib/mysql-files/
mysql> load data infile "/var/lib/mysql-files/KEN_ALL.CSV" into table postal_codes fields terminated bY ',' optionally enclosed by '"';
Query OK, 123400 rows affected (0.65 sec)
Records: 123400  Deleted: 0  Skipped: 0  Warnings: 0

mysql>
mysql> show tables;
+--------------------+
| Tables_in_postaldb |
+--------------------+
| postal_codes       |
+--------------------+
1 row in set (0.00 sec)
mysql> select * from postal_codes LIMIT 10;
+-------+---------+---------+--------------------+-----------------------------------+-------------------------------------------+-----------+--------------------+-----------------------------------------+------+------+------+------+------+------+
| jis   | zip_old | zip     | addr1_kana         | addr2_kana                        | addr3_kana                                | addr1     | addr2              | addr3                                   | c1   | c2   | c3   | c4   | c5   | c6   |
+-------+---------+---------+--------------------+-----------------------------------+-------------------------------------------+-----------+--------------------+-----------------------------------------+------+------+------+------+------+------+
| 01101 | 060     | 0600000 | ホッカイドウ       | サッポロシチュウオウク            | イカニケイサイガナイバアイ                | 北海道    | 札幌市中央区       | 以下に掲載がない場合                    |    0 |    0 |    0 |    0 |    0 |    0 |
| 01101 | 064     | 0640941 | ホッカイドウ       | サッポロシチュウオウク            | アサヒガオカ                              | 北海道    | 札幌市中央区       | 旭ケ丘                                  |    0 |    0 |    1 |    0 |    0 |    0 |
| 01101 | 060     | 0600041 | ホッカイドウ       | サッポロシチュウオウク            | オオドオリヒガシ                          | 北海道    | 札幌市中央区       | 大通東                                  |    0 |    0 |    1 |    0 |    0 |    0 |
| 01101 | 060     | 0600042 | ホッカイドウ       | サッポロシチュウオウク            | オオドオリニシ(1-19チョウメ)              | 北海道    | 札幌市中央区       | 大通西（１〜１９丁目）                  |    1 |    0 |    1 |    0 |    0 |    0 |
| 01101 | 064     | 0640820 | ホッカイドウ       | サッポロシチュウオウク            | オオドオリニシ(20-28チョウメ)             | 北海道    | 札幌市中央区       | 大通西（２０〜２８丁目）                |    1 |    0 |    1 |    0 |    0 |    0 |
| 01101 | 060     | 0600031 | ホッカイドウ       | サッポロシチュウオウク            | キタ1ジョウヒガシ                         | 北海道    | 札幌市中央区       | 北一条東                                |    0 |    0 |    1 |    0 |    0 |    0 |
| 01101 | 060     | 0600001 | ホッカイドウ       | サッポロシチュウオウク            | キタ1ジョウニシ(1-19チョウメ)             | 北海道    | 札幌市中央区       | 北一条西（１〜１９丁目）                |    1 |    0 |    1 |    0 |    0 |    0 |
| 01101 | 064     | 0640821 | ホッカイドウ       | サッポロシチュウオウク            | キタ1ジョウニシ(20-28チョウメ)            | 北海道    | 札幌市中央区       | 北一条西（２０〜２８丁目）              |    1 |    0 |    1 |    0 |    0 |    0 |
| 01101 | 060     | 0600032 | ホッカイドウ       | サッポロシチュウオウク            | キタ2ジョウヒガシ                         | 北海道    | 札幌市中央区       | 北二条東                                |    0 |    0 |    1 |    0 |    0 |    0 |
| 01101 | 060     | 0600002 | ホッカイドウ       | サッポロシチュウオウク            | キタ2ジョウニシ(1-19チョウメ)             | 北海道    | 札幌市中央区       | 北二条西（１〜１９丁目）                |    1 |    0 |    1 |    0 |    0 |    0 |
+-------+---------+---------+--------------------+-----------------------------------+-------------------------------------------+-----------+--------------------+-----------------------------------------+------+------+------+------+------+------+
10 rows in set (0.00 sec)
```

これでMySQL5.6系とデータベースもできました。
あとは実践ハイパフォーマンス[MySQL](http://d.hatena.ne.jp/keyword/MySQL) 第3版と[公式ドキュメント](https://dev.mysql.com/doc/refman/5.6/ja/)を読んで[MySQL](http://d.hatena.ne.jp/keyword/MySQL)を覚えていきましょう!!
投げっぱなし感になってしまったので、今後も理解したらまとめていきます。

[![実践ハイパフォーマンスMySQL 第3版](/images/mysql-5-6-introduction/mysql-5-6-introduction-0.jpg "実践ハイパフォーマンスMySQL 第3版")](http://www.amazon.co.jp/exec/obidos/ASIN/4873116384/tokusa1093-22/)

[実践ハイパフォーマンスMySQL 第3版](http://www.amazon.co.jp/exec/obidos/ASIN/4873116384/tokusa1093-22/)

- 作者: Baron Schwartz,Peter Zaitsev,Vadim Tkachenko,菊池研自,[株式会社クイープ](http://d.hatena.ne.jp/keyword/%B3%F4%BC%B0%B2%F1%BC%D2%A5%AF%A5%A4%A1%BC%A5%D7)
- 出版社/メーカー: [オライリージャパン](http://d.hatena.ne.jp/keyword/%A5%AA%A5%E9%A5%A4%A5%EA%A1%BC%A5%B8%A5%E3%A5%D1%A5%F3)
- 発売日: 2013/11/25
- メディア: 大型本
- [この商品を含むブログ (7件) を見る](http://d.hatena.ne.jp/asin/4873116384/tokusa1093-22)
