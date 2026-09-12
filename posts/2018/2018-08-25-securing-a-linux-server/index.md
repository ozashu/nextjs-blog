---
title: "Linuxサーバをセキュアな環境にする"
date: "2018-08-25"
---

[Linux](http://d.hatena.ne.jp/keyword/Linux)サーバでセキュアな設定についてまとめてみました。
OSはCentOS6なので古いですが。。
[Wordpress](http://d.hatena.ne.jp/keyword/Wordpress)周りはまだ調べられてないので
どこかでまとめたい。

## アドレススキャン対策

ブロードキャスト宛のICMP Echo Requestに対して回答しない

```
vim /etc/sysctl.conf
net.ipv4.icmp_echo_ignore_broadcasts=1
```

## OSや[バー](http://d.hatena.ne.jp/keyword/%A5%D0%A1%BC)ジョンの確認

```
# yum -y install nmap
# nmap -O example.com
```

`telnet example.com 80`

## まずはこれぐらいはやっておきたいセキュアな設定

- OSはminimalで必要最小限でインストールする
- システム管理者用のユーザを作成して利用する
- `yum -y update` でパッケージを最新のものを利用する
- 不要なサービスは停止する
  - audit(コマンドの監査をしない場合)
  - ip6tables([IPv6](http://d.hatena.ne.jp/keyword/IPv6)を使用しない場合)
  - netfs([NFS](http://d.hatena.ne.jp/keyword/NFS)クライアントを使用しない場合)
  - [postfix](http://d.hatena.ne.jp/keyword/postfix)([SMTP](http://d.hatena.ne.jp/keyword/SMTP)サーバを使用しない場合)
- rootユーザのログインを禁止する
  - コンソールからのrootログイン禁止

```
  # echo > /etc/securetty
```

- [SSH](http://d.hatena.ne.jp/keyword/SSH)でのrootログイン禁止

```
  # vim /etc/ssh/ssh_config
  #PermitRootLogin yes
```

↓

```
  PermitRootLogin no
```

- [SSH](http://d.hatena.ne.jp/keyword/SSH)を受け付けるPort番号を変更する

```
  # vim /etc/ssh/ssh_config
  Ports 20022
```

- [SSH](http://d.hatena.ne.jp/keyword/SSH)サーバを再起動して設定を反映させる
- ポートや[ファイアウォール](http://d.hatena.ne.jp/keyword/%A5%D5%A5%A1%A5%A4%A5%A2%A5%A6%A5%A9%A1%BC%A5%EB)の設定を確認する
  - `netstat -atnp` `iptables -Ln`

## OSのセキュリティ

- [GRUB](http://d.hatena.ne.jp/keyword/GRUB)のパスワード設定
  - `grub-md5-crypt` を実行して出力内容を `/boot/grub/grub.conf` に書くコム
  - title で始まる行よりも前に `password --md5 パスワード` の書式で記述する
- 一般ユーザのログイン管理
  - 不要なユーザのロック `usermod -L hoge`
  - 不要なユーザのロック解除 `usermod -U hoge`
  - シェルログインが不要なユーザの作成 `useradd -s /sbin/nologon hoge`
  - [hoge](http://d.hatena.ne.jp/keyword/hoge)ユーザのログインシェルを `/sbin/nologin` に設定 `usermod -s /sbin/nologin hoge`
- コンソールからのrootログイン禁止
  - `echo > /etc/securetty`
- su コマンドを使えるユーザを制限
  - `/etc/pam.d/su` ファイルをrootユーザで開き、 「auth required pam\_wheel.so use\_uid」という行を追加する
  - これでwheelグループに追加されたユーザのみがsuコマンドを利用できるようになる
  - `usermod -G wheel hoge` でグループに所属させることが可能
- sudoコマンドの利用設定
  - `visudo` を実行し `/etc/sudoers` を開く
  - `hoge ALL=(ALL) ALL` ですべてのroot権限が必要なコマンドの実行を許可する
- [Clam AntiVirus](http://d.hatena.ne.jp/keyword/Clam%20AntiVirus)のインストール
  - `yum install clamav`
  - `freshclam` でウィルスデータベースのアップデート
  - ウィルススキャンはスキャンしたい[ディレクト](http://d.hatena.ne.jp/keyword/%A5%C7%A5%A3%A5%EC%A5%AF%A5%C8)リに移動し、clamscanコマンドを実行
  - `cd /home` して `clamscan -r` で[再帰](http://d.hatena.ne.jp/keyword/%BA%C6%B5%A2)的に[ディレクト](http://d.hatena.ne.jp/keyword/%A5%C7%A5%A3%A5%EC%A5%AF%A5%C8)リをスキャンする
  - スキャンしかしないので `clamscan --remove` で実行時にウィルスの自動削除もしてくれる

## メールサーバのセキュリティ

- ユーザログインの禁止
  - メールサーバを利用するだけのユーザならログインする必要ないのでデフォルトシェルを無効にしておく
  - `useradd -s /sbin/nologin newuser`

main.cfの主な設定

- myhostname
  - ホスト名を[FQDN](http://d.hatena.ne.jp/keyword/FQDN)で指定
  - `myhostname = windsor.example.com`
- mydomain
  - メールサーバの[ドメイン](http://d.hatena.ne.jp/keyword/%A5%C9%A5%E1%A5%A4%A5%F3)名を指定
  - `mydomain = example.com`
- myorigin
  - メールアドレスの[@]以降が指定されなかった時、デフォルトで保管する値を指定する
  - `myorigin = $mydomain`
- inet\_interfaces
  - [SMTP](http://d.hatena.ne.jp/keyword/SMTP)接続を待ち受けるネットワーク[インターフェイス](http://d.hatena.ne.jp/keyword/%A5%A4%A5%F3%A5%BF%A1%BC%A5%D5%A5%A7%A5%A4%A5%B9)を指定
  - `localhost` なら他の[SMTP](http://d.hatena.ne.jp/keyword/SMTP)サーバからの接続は受け付けない
  - `all` は全てのネットワーク[インターフェイス](http://d.hatena.ne.jp/keyword/%A5%A4%A5%F3%A5%BF%A1%BC%A5%D5%A5%A7%A5%A4%A5%B9)で接続を待ち受ける
- mydestination
  - ローカル配送を行う[ドメイン](http://d.hatena.ne.jp/keyword/%A5%C9%A5%E1%A5%A4%A5%F3)名、つまりメールを受け取る[ドメイン](http://d.hatena.ne.jp/keyword/%A5%C9%A5%E1%A5%A4%A5%F3)名を指定
  - `mydestination = $myhostname, localhost.$mydomain, localhost`
- mynetworks
  - 中継を許可するホストの存在する内部ネットワークアドレスを指定
  - ここに指定したアドレスからのメールは無条件で中継される
  - `mynetworks = 192.168.11.0/24, 127.0.0.1/8`
- smtpd\_banner
  - [SMTP](http://d.hatena.ne.jp/keyword/SMTP)の応答コードに続いて出力されるバナー情報を指定
  - できるだけ情報は少ないほうがいいが、 `$myhostname` は削除しないようにすること
- disabled\_vrfy\_command
  - STMPのVRFYコマンドを禁止にする
  - VRFYコマンドはメールサーバにどのようなアカウントがあるのかを知られる可能性がある
  - `disable_vrfy_command = yes`
- smtpd\_helo\_required
  - [SMTP](http://d.hatena.ne.jp/keyword/SMTP)開始時のHELO/EHLOコマンドを必須とするかどうかを指定
  - yesとすると[スパムメール](http://d.hatena.ne.jp/keyword/%A5%B9%A5%D1%A5%E0%A5%E1%A1%BC%A5%EB)の抑制となる
  - `smtpd_helo_required = yes`
- smtpd\_recipient\_restrictions
  - 通常は末尾に[reject](http://d.hatena.ne.jp/keyword/reject)を指定する
- smtpd\_sender\_restictions
  - メールの送信元アドレスをチェックし、受信を拒否するかどうかを判断

設定の反映

`service postfix reload`

デフォルト値から変更されている項目のみを表示

`postconf -n`

## [FTP](http://d.hatena.ne.jp/keyword/FTP)サーバのセキュリティ

[CentOS](http://d.hatena.ne.jp/keyword/CentOS)ではセキュアなvsftpdを使う

vsftpd.confの設定

- バナーの表示
- [FTP](http://d.hatena.ne.jp/keyword/FTP)接続確立時のバナーメッセージはftpd\_bannerディレクティブで設定
  - `ftpd_banner='FTP Login`
  - バナーメッセージを格納したファイルを指定するbanner\_fileによって無視せれるので注意
- [TCP](http://d.hatena.ne.jp/keyword/TCP) Wrapperの利用有無
  - `tcp_wraller=Yes`
  - `tcp_wraller=No`
- ユーザリストファイル
  - [FTP](http://d.hatena.ne.jp/keyword/FTP)アクセスを許可するかどうかをユーザー単位で設定できる
  - ユーザリストファイル(デフォルト `/etc/vsftpd/user_list` ) にユーザの一覧を記述
  - このリストを[ブラックリスト](http://d.hatena.ne.jp/keyword/%A5%D6%A5%E9%A5%C3%A5%AF%A5%EA%A5%B9%A5%C8)か[ホワイトリスト](http://d.hatena.ne.jp/keyword/%A5%DB%A5%EF%A5%A4%A5%C8%A5%EA%A5%B9%A5%C8)にするか選択できる
  - [ブラックリスト](http://d.hatena.ne.jp/keyword/%A5%D6%A5%E9%A5%C3%A5%AF%A5%EA%A5%B9%A5%C8)形式の場合

```
  userlist_file=/etc/vsftpd/user_list
  userlist_enable=YES
  userlist_deny=YES
```

- [ホワイトリスト](http://d.hatena.ne.jp/keyword/%A5%DB%A5%EF%A5%A4%A5%C8%A5%EA%A5%B9%A5%C8)の場合

```
  userlist_file=/etc/vsftpd/user_list
  userlist_enable=YES
  userlist_deny=NO
```

- `/etc/vsftpd/user_list` には[FTP](http://d.hatena.ne.jp/keyword/FTP)接続にかかわるユーザを登録。
- `userlist_enable=NO` となっている場合 `/etc/vsftpd/user_list` 内に指定されたユーザのみ[FTP](http://d.hatena.ne.jp/keyword/FTP)許可されるが、 `/etc/vsftpd/ftpusers` にユーザ名が指定されている場合は[FTP](http://d.hatena.ne.jp/keyword/FTP)ログインを禁止されてしまう
- ファイルのアップロード
  - [FTP](http://d.hatena.ne.jp/keyword/FTP)サーバをファイル配布用にするならアップロードは不要
  - `write_enable=NO` でアップロードが禁止になる
- ユーザの設定
  - [Linux](http://d.hatena.ne.jp/keyword/Linux)ユーザのログインを許可するには `local_enable=YES` と設定すると[Linux](http://d.hatena.ne.jp/keyword/Linux)システムのユーザ名とパスワードを使って[FTP](http://d.hatena.ne.jp/keyword/FTP)ログインが可能になる
- ホーム[ディレクト](http://d.hatena.ne.jp/keyword/%A5%C7%A5%A3%A5%EC%A5%AF%A5%C8)リ以外に移動できないように設定
  - 以下で各ユーザの[ディレクト](http://d.hatena.ne.jp/keyword/%A5%C7%A5%A3%A5%EC%A5%AF%A5%C8)リがルート[ディレクト](http://d.hatena.ne.jp/keyword/%A5%C7%A5%A3%A5%EC%A5%AF%A5%C8)リとみなされ、他のユーザのホーム[ディレクト](http://d.hatena.ne.jp/keyword/%A5%C7%A5%A3%A5%EC%A5%AF%A5%C8)リやシステム関連[ディレクト](http://d.hatena.ne.jp/keyword/%A5%C7%A5%A3%A5%EC%A5%AF%A5%C8)リへは移動できなくなる([chroot](http://d.hatena.ne.jp/keyword/chroot) jail)

```
chroot_local_user=YES
#chroot_list_enable=YES
# (default follows)
chroot_list_file=/etc/vsftpd/chroot_list
```

- 一部のユーザにはホーム[ディレクト](http://d.hatena.ne.jp/keyword/%A5%C7%A5%A3%A5%EC%A5%AF%A5%C8)リ以外に移動できないように設定
  - `chroot_list_enable=YES` と設定して、`chroot_list` にユーザを列挙する

```
chroot_local_user=YES
chroot_list_enable=YES
# (default follows)
chroot_list_file=/etc/vsftpd/chroot_list
```

- ホーム[ディレクト](http://d.hatena.ne.jp/keyword/%A5%C7%A5%A3%A5%EC%A5%AF%A5%C8)リ配下の[FTP](http://d.hatena.ne.jp/keyword/FTP)ログイン用のサブ[ディレクト](http://d.hatena.ne.jp/keyword/%A5%C7%A5%A3%A5%EC%A5%AF%A5%C8)リにログインするようにする
  - 以下では `~/public_html` [ディレクト](http://d.hatena.ne.jp/keyword/%A5%C7%A5%A3%A5%EC%A5%AF%A5%C8)リを[FTP](http://d.hatena.ne.jp/keyword/FTP)ログイン[ディレクト](http://d.hatena.ne.jp/keyword/%A5%C7%A5%A3%A5%EC%A5%AF%A5%C8)リにする
  - `local_root=public_html`
- 匿名[FTP](http://d.hatena.ne.jp/keyword/FTP)を許可の有無
  - デフォルトでは有効になっている
  - `anonymous_enable=YES`
  - 匿名[FTP](http://d.hatena.ne.jp/keyword/FTP)を使ってファイル配布したい場合は、匿名アカウントでのファイルアップロードを禁止しておく
  - `anon_upload_enable=NO`
  - `write_enbale=NO` なら `anon_upload_enable=YES` でもファイルのアップロードはできない
- FTPSを使う
  - 証明書と[秘密鍵](http://d.hatena.ne.jp/keyword/%C8%EB%CC%A9%B8%B0)をまとめてpemファイルを作る

```
cd /etc/pki/tls/certs
cp mycerts.crt mycerts.pem
cat mycerts.key >> mycerts.pem
```

- vsftpd.confに以下の行を追加

```
ssl_enable=YES #SSLの有効化
rsa_cert_file=/etc/pki/tls/certs/mycerts.pem #サーバ証明書秘密鍵のパス
```

- 通常の[FTP](http://d.hatena.ne.jp/keyword/FTP)接続も許可するなら以下の設定もする
- [SSL](http://d.hatena.ne.jp/keyword/SSL)非対応の[FTPクライアント](http://d.hatena.ne.jp/keyword/FTP%A5%AF%A5%E9%A5%A4%A5%A2%A5%F3%A5%C8)からの利用も想定するときは必要

```
force_local_logins_ssl=NO #FTPログイン時にSSL接続を強制しないように設定
force_local_date_ssl=NO   #FTP転送時にSSL接続を強制しないように設定
```

- vsftpdのログ
  - デフォルトでは`/var/log/xferlog` にファイル転送に関するログが記録される

```
xferlog_enable=YES
xferlog_std_format=YES
```

- ファイル転送のログに加えて、サーバへの接続に関するログも出力されるようにする

```
xferlog_std_format=NO
vsftpd_log_file=/var/log/vsftpd.log
```

- syslogへ出力するようにもできる

```
syslog_enable=YES
```

## 安全な[SSH](http://d.hatena.ne.jp/keyword/SSH)サーバの設定

`/etc/ssh/sshd_config` の設定

- Portの変更
  - `Port 20022 #portの待受けを22番以外にする`
- Protocolの[バー](http://d.hatena.ne.jp/keyword/%A5%D0%A1%BC)ジョンを2にする
  - `Protocol 2`
- rootログインを許可しない
  - `PermitRootLogin no`
- パスワード認証を許可しない
  - `PasswordAuthentication no`
- ログイン認証認証の失敗を許容できる回数を変更
  - `MaxAuthTries 3`
