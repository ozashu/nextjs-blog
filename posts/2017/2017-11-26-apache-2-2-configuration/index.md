---
title: "Apache2.2の設定"
date: "2017-11-26"
---

[前回のCentOS6.7の設定続き！](http://ozashu.hatenablog.com/entry/2015/08/30/101916)

久しぶりにやったので、CentOS6.9でやりました...
ipもよしなにお願いします。
2017年にApache2.2で申し訳ない

# Apache2.2の設定

CentOS6系の設定を想定なのでApache2.2です。(古いね)

- 以下内容

VirtualHostの設定をして[ドメイン](http://d.hatena.ne.jp/keyword/%A5%C9%A5%E1%A5%A4%A5%F3)にアクセスできること
名前ベースの仮想ホストで複数のホスト名をつける
[SSL](http://d.hatena.ne.jp/keyword/SSL)通信ができること

## [Apache](http://d.hatena.ne.jp/keyword/Apache)インストール

インストール

```
# yum install httpd
# httpd -version
Server version: Apache/2.2.15 (Unix)
```

[自動起動](http://d.hatena.ne.jp/keyword/%BC%AB%C6%B0%B5%AF%C6%B0)の設定

```
# chkconfig --list |grep httpd
httpd           0:off   1:off   2:off   3:off   4:off   5:off   6:off
#  chkconfig httpd on
# chkconfig --list |grep httpd
httpd           0:off   1:off   2:on    3:on    4:on    5:on    6:off
```

## [Apache](http://d.hatena.ne.jp/keyword/Apache)設定ファイル

全体の設定と範囲を指定した設定の2つあります。
この範囲を「セクションコンテナ」といいます。
セクションコンテナの中で設定した項目はセクションコンテナ内だけの設定になるのです。

セクションコンテナの種類

- 〜
  - [ディレクト](http://d.hatena.ne.jp/keyword/%A5%C7%A5%A3%A5%EC%A5%AF%A5%C8)リを示す
- 〜
  - ファイルを示す
- 〜
  - URLを示す

[Apache](http://d.hatena.ne.jp/keyword/Apache)の設定ファイルは、行毎に「ディレクティブ」と呼ばれる設定内容を記述します。
Apache2.2と2.4では記述の仕方が違うので設定ミスに注意が必要。
2.4使うならNginxを使ったほうがいいかも。。

ディレクティブの大文字小文字の区別はされません。
優先順位は、、 の順番で解釈され、
先に解釈された設定は、後で解釈された設定で上書きされてしまうので、
アクセス制限などには気をつける点ですね。

編集が終わったら設定ファイルの書式が間違っていないかを確認するようにしましょう。

```
# service httpd configtest
Syntax OK
```

## 名前ベースの仮想ホスト

リク[エス](http://d.hatena.ne.jp/keyword/%A5%A8%A5%B9)トヘッダ内で指定されているHost:ヘッダーの情報からアクセス先のホストを識別できる

## VirtualHostの設定

設定をスッキリさせたいので、conf.d配下に
vhosts.confというVirtualHost専用の設定ファイルを作りました。
VirtualHostで指定した[IPアドレス](http://d.hatena.ne.jp/keyword/IP%A5%A2%A5%C9%A5%EC%A5%B9)に一致した場合のみ設定が適用されます。

```
# cat conf.d/vhosts.conf
# 仮想ホストのIPアドレスを指定(Apache2.4では不要)
NameVirtualHost *:80

<VirtualHost *:80>
ServerAdmin sysadmin@test1.jp
DocumentRoot /var/www/vhosts/www.apachetest1.jp
ServerName www.apachetest1.jp
</VirtualHost>

<VirtualHost *:80>
ServerAdmin sysadmin@test1.jp
DocumentRoot /var/www/vhosts/www.apachetest2.jp
ServerName www.apachetest2.jp
</VirtualHost>
```

DocumentRootも作っておくます。
index.htmlも置いておきました。

```
# mkdir /var/www/vhosts/www.apachetest1.jp/
# cat /var/www/vhosts/www.apachetest1.jp/index.html
apachetest1 is OK
# mkdir /var/www/vhosts/www.apachetest2.jp
# cat /var/www/vhosts/www.apachetest2.jp/index.html
apachetest2 is OK
```

動作確認してみましょう。
Hostヘッダーを指定して[curl](http://d.hatena.ne.jp/keyword/curl)コマンドを実行すると見事index.htmlの情報をとってこれました;-)

```
# curl -H 'Host: www.apachetest1.jp' 192.168.33.111
apachetest1
# curl -H 'Host: www.apachetest2.jp' 192.168.33.111
apachetest2
```

[Apache](http://d.hatena.ne.jp/keyword/Apache)再起動時に以下のメッセージが出たので、hostsに記載。[localhost](http://d.hatena.ne.jp/keyword/localhost)で名前解決させればよさそう。

```
[root@www ~]# service httpd restart
Stopping httpd:                                            [  OK  ]
Starting httpd: httpd: apr_sockaddr_info_get() failed for www.apachetest1.jp
httpd: Could not reliably determine the server's fully qualified domain name, using 127.0.0.1 for ServerName
                                                           [  OK  ]
# vim /etc/hosts
# cat /etc/hosts
127.0.0.1   www.apachetest1.jp localhost localhost.localdomain localhost4 localhost4.localdomain4
::1         www.apachetest1.jp localhost localhost.localdomain localhost6 localhost6.localdomain6
[root@www ~]# service httpd restart
Stopping httpd:                                            [  OK  ]
Starting httpd:                                            [  OK  ]
```

QUIZ:ブラウザでindex.htmlの中身を確認したい場合はどうすればいいでしょうか?

## [SSL](http://d.hatena.ne.jp/keyword/SSL)通信

let's encryptはローカル[ドメイン](http://d.hatena.ne.jp/keyword/%A5%C9%A5%E1%A5%A4%A5%F3)には使えんので、今回はおれおれ証明書で！
本番環境ではlet's encryptもしくは[verisign](http://d.hatena.ne.jp/keyword/verisign)やcybertrustやrapid-[ssl](http://d.hatena.ne.jp/keyword/ssl)など商用のCAを使ってください！

商用CAも[CSR](http://d.hatena.ne.jp/keyword/CSR)をCAに送って、入金して、証明書がもらえたら、よしなに設定の流れです。

[SSL](http://d.hatena.ne.jp/keyword/SSL)化する理由はなんでしょうか

- データの改竄防止
- データ盗聴防止
- CA([認証局](http://d.hatena.ne.jp/keyword/%C7%A7%BE%DA%B6%C9))による認証によって、本物であることを証明する

何が必要でしょうか

- openssl
  - [SSL](http://d.hatena.ne.jp/keyword/SSL)を利用するのに必要なソフトウェア
- mod\_[ssl](http://d.hatena.ne.jp/keyword/ssl)
  - OpenSSLを使って[Apache](http://d.hatena.ne.jp/keyword/Apache)を[SSL](http://d.hatena.ne.jp/keyword/SSL)に対応させるmodule

てなわけでインストール

```
# yum install -y mod_ssl openssl
# httpd -M | grep ssl
Syntax OK
 ssl_module (shared)
```

OpenSSLコマンドで以下のファイルを用意します。
複数[ドメイン](http://d.hatena.ne.jp/keyword/%A5%C9%A5%E1%A5%A4%A5%F3)を持つ場合は[命名規則](http://d.hatena.ne.jp/keyword/%CC%BF%CC%BE%B5%AC%C2%A7)を立てたほうがよいですね。
CommonName.作成日.ファイルタイプなど

- server.key([秘密鍵](http://d.hatena.ne.jp/keyword/%C8%EB%CC%A9%B8%B0))
- server.[csr](http://d.hatena.ne.jp/keyword/csr) ([CSR](http://d.hatena.ne.jp/keyword/CSR)ファイル(公開鍵と、[認証局](http://d.hatena.ne.jp/keyword/%C7%A7%BE%DA%B6%C9)での署名に必要な情報))
- server.crt([サーバ証明書](http://d.hatena.ne.jp/keyword/%A5%B5%A1%BC%A5%D0%BE%DA%CC%C0%BD%F1))

鍵の置き場所はmod\_[ssl](http://d.hatena.ne.jp/keyword/ssl)をインストールしたらデフォルトはconf.d/[ssl](http://d.hatena.ne.jp/keyword/ssl).confになると思います。
また、443ポートで受けます。

```
# grep SSLCert conf.d/ssl.conf
# Point SSLCertificateFile at a PEM encoded certificate.  If
SSLCertificateFile /etc/pki/tls/certs/localhost.crt
SSLCertificateKeyFile /etc/pki/tls/private/localhost.key
# grep Listen conf.d/ssl.conf
Listen 443
```

今回はvhosts.confに設置場所を以下に指定してそこに置いてみましょう。

```
mkdir /etc/httpd/conf/ssl
# vim vhosts.conf
<VirtualHost *:443>
  ServerName www.apachetest1.jp
  DocumentRoot /var/www/test1
  SSLEngine on
  SSLCertificateFile /etc/httpd/conf/ssl/server.crt
  SSLCertificateKeyFile /etc/httpd/conf/ssl/server.key
</VirtualHost>
```

デフォルトの[ssl](http://d.hatena.ne.jp/keyword/ssl).confで`SSLEngine on`は[コメントアウト](http://d.hatena.ne.jp/keyword/%A5%B3%A5%E1%A5%F3%A5%C8%A5%A2%A5%A6%A5%C8)しておきましょう~~

```
# grep SSLEngine /etc/httpd/conf.d/ssl.conf
# SSLEngine on
```

上の[コメントアウト](http://d.hatena.ne.jp/keyword/%A5%B3%A5%E1%A5%F3%A5%C8%A5%A2%A5%A6%A5%C8)をしなかったら、以下のエラーメッセージが出て[Apache](http://d.hatena.ne.jp/keyword/Apache)が起動しなくなりました..

```
[error] Illegal attempt to re-initialise SSL for server (theoretically shouldn't happen!)
```

## [秘密鍵](http://d.hatena.ne.jp/keyword/%C8%EB%CC%A9%B8%B0)の作成

```
# openssl genrsa -out server.key 2048
```

genrsa: [RSA](http://d.hatena.ne.jp/keyword/RSA)形式の[秘密鍵](http://d.hatena.ne.jp/keyword/%C8%EB%CC%A9%B8%B0)を作成
-out [秘密鍵](http://d.hatena.ne.jp/keyword/%C8%EB%CC%A9%B8%B0): [秘密鍵](http://d.hatena.ne.jp/keyword/%C8%EB%CC%A9%B8%B0)の名前指定
2048: 2048バイト長の鍵を作成

## [CSR](http://d.hatena.ne.jp/keyword/CSR)作成

今回はwww.apachetest1.jpだけ[HTTPS](http://d.hatena.ne.jp/keyword/HTTPS)化

```
# openssl genrsa -out server.key 2048
Generating RSA private key, 2048 bit long modulus
.........................................+++
...+++
e is 65537 (0x10001)
[root@localhost ssl]# openssl req -new -sha256 -key server.key -out server.csr
You are about to be asked to enter information that will be incorporated
into your certificate request.
What you are about to enter is what is called a Distinguished Name or a DN.
There are quite a few fields but you can leave some blank
For some fields there will be a default value,
If you enter '.', the field will be left blank.
-----
Country Name (2 letter code) [XX]:JP
State or Province Name (full name) []:Tokyo
Locality Name (eg, city) [Default City]:Shinjuku-ku
Organization Name (eg, company) [Default Company Ltd]:Default Company Ltd
Organizational Unit Name (eg, section) []:section
Common Name (eg, your name or your server's hostname) []:www.apachetest1.jp
Email Address []:

Please enter the following 'extra' attributes
to be sent with your certificate request
A challenge password []:
An optional company name []:
```

CommonNameとbit長など間違いないか確認

```
# openssl req -in server.csr -text
Certificate Request:
   Data:
       Version: 0 (0x0)
       Subject: C=JP, ST=Tokyo, L=Shinjuku-ku, O=Default Company Ltd, OU=Technology, CN=www.apachetest1.jp
       Subject Public Key Info:
           Public Key Algorithm: rsaEncryption
               Public-Key: (2048 bit)
               Modulus:
                   00:ca:d9:de:81:97:43:ff:21:d9:4b:7c:26:50:e1:
```

- [CSR](http://d.hatena.ne.jp/keyword/CSR)作成の前に以下の項目を確認しておくといいです。

| DN フィールド | 説明 | 例 |
| --- | --- | --- |
| Country Name (2 letter code) | 二文字の国名 | JP |
| State or Province Name (full name) | [都道](http://d.hatena.ne.jp/keyword/%C5%D4%C6%BB)府県 | Tokyo, Tokyo-to |
| Locality Name (eg, city) | 市区町村 | Shinjuku-ku |
| Organization Name (eg, company) | 会社名・組織名 | Default Company Ltd |
| Organizational Unit Name(eg, section) | 部署名 | Technology |
| Common Name (eg, YOUR name) | [ドメイン](http://d.hatena.ne.jp/keyword/%A5%C9%A5%E1%A5%A4%A5%F3)名と同。間違えるとサイトみれなくなるので注意!!! | 「http://」や「[https](http://d.hatena.ne.jp/keyword/https)://」は入力不要 |
|  | www有りの場合 | www.[example.com](http://d.hatena.ne.jp/keyword/example.com) |
|  | wwwなしの場合 | [example.com](http://d.hatena.ne.jp/keyword/example.com) |
|  | [サブドメイン](http://d.hatena.ne.jp/keyword/%A5%B5%A5%D6%A5%C9%A5%E1%A5%A4%A5%F3)の場合 | japan.[example.com](http://d.hatena.ne.jp/keyword/example.com) |
|  | [サブドメイン](http://d.hatena.ne.jp/keyword/%A5%B5%A5%D6%A5%C9%A5%E1%A5%A4%A5%F3)無制限の場合 | \*.[example.com](http://d.hatena.ne.jp/keyword/example.com) |
| Email Address | メールアドレス | test@example.jp(値なしでも可) |
| A challenge password |  | 値なし |
| An optional company name |  | 値なし |

## 証明書を作成し自己署名する

```
# openssl x509 -in server.csr -days 365 -req -signkey server.key -out server.crt
Signature ok
subject=/C=JP/ST=Tokyo/L=Shinjuku-ku/O=Default Company Ltd/OU=Technology/CN=www.apachetest1.jp
Getting Private key
```

-req: 入力ファイルが[CSR](http://d.hatena.ne.jp/keyword/CSR)ファイルであることを指定
-days: 証明書の有効期限
x509: X.509形式の証明書を作成
-signkey [秘密鍵](http://d.hatena.ne.jp/keyword/%C8%EB%CC%A9%B8%B0)ファイル: 自己証明書作成時に使用するオプション。[秘密鍵](http://d.hatena.ne.jp/keyword/%C8%EB%CC%A9%B8%B0)ファイルを指定

## [iptables](http://d.hatena.ne.jp/keyword/iptables)の設定を行う

[iptables](http://d.hatena.ne.jp/keyword/iptables)がインストールされていることを確認

```
# which iptables
/sbin/iptables
```

## [iptables](http://d.hatena.ne.jp/keyword/iptables)のポリシー

以下の基本ポリシーを”[DROP](http://d.hatena.ne.jp/keyword/DROP)”(拒否)、”ACCEPT”(許可)のどちらかに設定します。

INPUT:サーバーに入ってくる通信のポリシー。基本ポリシーを”[DROP](http://d.hatena.ne.jp/keyword/DROP)”にして、あとで個別のポートに対して許可する設定にする。
OUTPUT:サーバーから出て行く通信のポリシー。基本ポリシーは”ACCEPT“にする。
FORWARD:受信したデータを他のサーバーへ転送する際に適用される設定。ここでは、特に転送するサーバーは無いので”[DROP](http://d.hatena.ne.jp/keyword/DROP)”。

現状設定されていないです。

```
# iptables -nvL --line
Chain INPUT (policy ACCEPT 6332 packets, 472K bytes)
num   pkts bytes target     prot opt in     out     source               destination

Chain FORWARD (policy ACCEPT 0 packets, 0 bytes)
num   pkts bytes target     prot opt in     out     source               destination

Chain OUTPUT (policy ACCEPT 3243 packets, 254K bytes)
num   pkts bytes target     prot opt in     out     source               destination
```

以下の設定ファイルを作成していきます。
記載内容は[さくらインターネットさんの記事を](https://knowledge.sakura.ad.jp/4048/)参照で

```
# vim /etc/sysconfig/iptables
```

設定を反映させます。

```
# service iptables restart
iptables: Setting chains to policy ACCEPT: filter          [  OK  ]
iptables: Flushing firewall rules:                         [  OK  ]
iptables: Unloading modules:                               [  OK  ]
iptables: Applying firewall rules:                         [  OK  ]
```

22,53,80,443ポートが開放されていることが確認できました。

```
# iptables -nvL --line
Chain INPUT (policy DROP 0 packets, 0 bytes)
num   pkts bytes target     prot opt in     out     source               destination
1        0     0 ACCEPT     all  --  lo     *       0.0.0.0/0            0.0.0.0/0
2        0     0 DROP       tcp  --  *      *       0.0.0.0/0            0.0.0.0/0           tcp flags:0x3F/0x00
3        0     0 DROP       tcp  --  *      *       0.0.0.0/0            0.0.0.0/0           tcp flags:!0x17/0x02 state NEW
4        0     0 DROP       tcp  --  *      *       0.0.0.0/0            0.0.0.0/0           tcp flags:0x3F/0x3F
5        0     0 ACCEPT     icmp --  *      *       0.0.0.0/0            0.0.0.0/0           icmp type 8 limit: up to 1/min burst 10 mode srcip htable-expire 120000
6       11   576 ACCEPT     tcp  --  *      *       0.0.0.0/0            0.0.0.0/0           state RELATED,ESTABLISHED
7        0     0 ACCEPT     udp  --  *      *       0.0.0.0/0            0.0.0.0/0           udp spt:53
8        0     0 ACCEPT     tcp  --  *      *       0.0.0.0/0            0.0.0.0/0           state NEW tcp dpt:22 flags:0x17/0x02 limit: up to 1/min burst 10 mode srcip htable-expire 120000
9        0     0 ACCEPT     tcp  --  *      *       0.0.0.0/0            0.0.0.0/0           tcp dpt:80
10       0     0 ACCEPT     tcp  --  *      *       0.0.0.0/0            0.0.0.0/0           tcp dpt:443

Chain FORWARD (policy DROP 0 packets, 0 bytes)
num   pkts bytes target     prot opt in     out     source               destination

Chain OUTPUT (policy ACCEPT 6 packets, 448 bytes)
num   pkts bytes target     prot opt in     out     source               destination
```

コマンドなら以下ですね

```
iptables -A INPUT -m state --state NEW -m tcp -p tcp --dport 80 -j ACCEPT
iptables -A INPUT -m state --state NEW -m tcp -p tcp --dport 443 -j ACCEPT
```

## graceful再起動で反映

/etc/init.d/[httpd](http://d.hatena.ne.jp/keyword/httpd) graceful

<https://www.apachetest1.jp>にアクセスできることを確認
