---
title: "CentOS6.7の設定"
date: "2015-08-30"
---

# 前回インストールしたCentOS6.7の設定を行っていきます。

## [SELinux](http://d.hatena.ne.jp/keyword/SELinux)の無効化

何はともかく無効化しましょう。以下に設定変更します。

> [SELINUX](http://d.hatena.ne.jp/keyword/SELINUX)=disabled

```
# [cp -a /etc/sysconfig/selinux{,.bak}
# vi /etc/sysconfig/selinux
# shutdown -r now
```

[SELinux](http://d.hatena.ne.jp/keyword/SELinux)が無効化された事を確認します

```
# getenforce
Disabled
```

## 開発ツール、Baseパッケージのインストール

```
# yum groupinstall base
# yum groupinstall development tools
```

## 監視ユーザ追加

```
# useradd hogehoge
# passwd hogehoge
ユーザー hogehoge のパスワードを変更。
新しいパスワード:
新しいパスワードを再入力してください:
passwd: 全ての認証トークンが正しく更新できました。
```

## 作成したユーザに管理者権限付与

/etc/sudoersに以下の内容を記載

> hogehoge ALL=(ALL) ALL

```
# cp -a /etc/sudoers{,.bak}
# visudo
# cat /etc/sudoers |grep hogehoge
hogehoge    ALL=(ALL)   ALL
$ sudo whoami
We trust you have received the usual lecture from the local System
Administrator. It usually boils down to these three things:
    #1) Respect the privacy of others.
    #2) Think before you type.
    #3) With great power comes great responsibility.
[sudo] password for hogehoge: 
root
```

root権限が付与された事を確認。

## rootユーザリモートログイン不可設定

rootで[ssh](http://d.hatena.ne.jp/keyword/ssh)接続は禁止して、作成したユーザで[ssh](http://d.hatena.ne.jp/keyword/ssh)接続するようにしましょう。

/etc/[ssh](http://d.hatena.ne.jp/keyword/ssh)/[sshd](http://d.hatena.ne.jp/keyword/sshd)\_configに以下の内容を追記

> PermitRootLogin no

```
# cp -a /etc/ssh/sshd_config{,.bak}
# vi /etc/ssh/sshd_config
# service sshd restart
# service sshd restart
sshd を停止中:                                             [  OK  ]
sshd を起動中:                                             [  OK  ]
# cat /etc/ssh/sshd_config | grep PermitRootLogin
#PermitRootLogin yes
PermitRootLogin no
```

PermitRootLogin noが追加されていることを確認。サービスも正常に起動しています。

## リモートログインの確認

rootユーザでのログイン不可の確認します。

```
# ssh root@xxx.xxx.xxx.xxx
The authenticity of host 'xxx.xxx.xxx.xxx (xxx.xxx.xxx.xxx)' can't be established.
RSA key fingerprint is xx:xx:xx:xx:xx:xx:xx:xx:xx:xx:xx:xx:xx:xx:xx:xx.
Are you sure you want to continue connecting (yes/no)? yes
Warning: Permanently added 'xxx.xxx.xxx.xxx' (RSA) to the list of known hosts.
root@xxx.xxx.xxx.xxx's password: 
Permission denied, please try again.
```

Permission deniedで権限が拒否された事を確認

## 一般ユーザでのログイン確認

```
# ssh hogehoge@xxx.xxx.xxx.xxx
hogehoge@xxx.xxx.xxx.xxx's password
$
```

## 一般ユーザが管理者権限になることを確認

```
$ sudo su -
[sudo] password for hogehoge: 
#
```

プロンプトが管理者権限になったので管理者権限になることに成功

プロンプトが一般ユーザになったのでログイン成功

# Quizここで#や$になったりしているのはなぜでしょうか。調べてコメント欄に書いてみてください。

## [カーネルパニック](http://d.hatena.ne.jp/keyword/%A5%AB%A1%BC%A5%CD%A5%EB%A5%D1%A5%CB%A5%C3%A5%AF)設定

「/etc/sysctl.conf」は[カーネル](http://d.hatena.ne.jp/keyword/%A5%AB%A1%BC%A5%CD%A5%EB)パラメータを記述する設定ファイルです。
ここにパニックリブートの設定を追加

```
# cp -a /etc/sysctl.conf{,.bak} 
# echo >> /etc/sysctl.conf 
# echo kernel.panic = 30 >> /etc/sysctl.conf
# cat /etc/sysctl.conf |grep kernel.panic
kernel.panic = 30  //パニック後30秒後に再起動
```

## [yum](http://d.hatena.ne.jp/keyword/yum)設定

参考サイト
: [Yumの構成](http://docs.oracle.com/cd/E39368_01/b71105/ol_yum_config.html)
: [yumが遅い場合にダウンロードを速くするyum-fastestmirror](http://centos.bungu-do.jp/archives/000205.html)
: [CentOSでyumのリポジトリを国内指定したりほか](http://www2.sawanoboly.net/wp_old/2008/07/16/24.html)

1.[yum](http://d.hatena.ne.jp/keyword/yum)の[プラグイン](http://d.hatena.ne.jp/keyword/%A5%D7%A5%E9%A5%B0%A5%A4%A5%F3)をインストールしてダウンロードの速い[ミラーサイト](http://d.hatena.ne.jp/keyword/%A5%DF%A5%E9%A1%BC%A5%B5%A5%A4%A5%C8)を自動で選択するように設定

# [yum](http://d.hatena.ne.jp/keyword/yum) -y install [yum](http://d.hatena.ne.jp/keyword/yum)-fastestmirror

2.「mirrorlist=」の末尾に「&cc=JP」を追記し、国コード別のミラーリストを返すように設定

```
# cp -a /etc/yum.repos.d/CentOS-Base.repo{,.bak} 
# vi /etc/yum.repos.d/CentOS-Base.repo
# cat /etc/yum.repos.d/CentOS-Base.repo |grep mirrorlist=
# If the mirrorlist= does not work for you, as a fall back you can try the 
mirrorlist=http://mirrorlist.centos.org/?release=$releasever&arch=$basearch&repo=os&infra=$infra&cc=JP
mirrorlist=http://mirrorlist.centos.org/?release=$releasever&arch=$basearch&repo=updates&infra=$infra&cc=JP
mirrorlist=http://mirrorlist.centos.org/?release=$releasever&arch=$basearch&repo=extras&infra=$infra&cc=JP
mirrorlist=http://mirrorlist.centos.org/?release=$releasever&arch=$basearch&repo=centosplus&infra=$infra&cc=JP
mirrorlist=http://mirrorlist.centos.org/?release=$releasever&arch=$basearch&repo=contrib&infra=$infra&cc=JP
```

3.「[yum](http://d.hatena.ne.jp/keyword/yum) -y update」ですべてのパッケージを、それらが依存するパッケージとともに更新

`# yum -y update`

4.更新がないことを確認

```
# yum check-update
読み込んだプラグイン:fastestmirror, security
Loading mirror speeds from cached hostfile
 * base: ftp.tsukuba.wide.ad.jp
 * extras: ftp.tsukuba.wide.ad.jp
 * updates: ftp.tsukuba.wide.ad.jp
```

5.[yum](http://d.hatena.ne.jp/keyword/yum)および関連ユーティリティの設定ファイルである「/etc/[yum](http://d.hatena.ne.jp/keyword/yum).conf」でpluginsが1に設定されていて、[yum](http://d.hatena.ne.jp/keyword/yum)の機能を拡張する[プラグイン](http://d.hatena.ne.jp/keyword/%A5%D7%A5%E9%A5%B0%A5%A4%A5%F3)が有効である事を確認

```
# cat /etc/yum.conf |grep plugins=1
plugins=1
```

6.mirrorlistの設定が正しくされているか確認

```
# cat /etc/yum.repos.d/CentOS-Base.repo | grep mirrorlist=http://
mirrorlist=http://mirrorlist.centos.org/?release=$releasever&arch=$basearch&repo=os&infra=$infra&cc=JP
mirrorlist=http://mirrorlist.centos.org/?release=$releasever&arch=$basearch&repo=updates&infra=$infra&cc=JP
mirrorlist=http://mirrorlist.centos.org/?release=$releasever&arch=$basearch&repo=extras&infra=$infra&cc=JP
mirrorlist=http://mirrorlist.centos.org/?release=$releasever&arch=$basearch&repo=centosplus&infra=$infra&cc=JP
mirrorlist=http://mirrorlist.centos.org/?release=$releasever&arch=$basearch&repo=contrib&infra=$infra&cc=JP
```

## [自動起動](http://d.hatena.ne.jp/keyword/%BC%AB%C6%B0%B5%AF%C6%B0)設定

1.以下のサービスを自動起しない用設定

```
# chkconfig --level 2345 mdmonitor off
# chkconfig --level 2345 atd off
# chkconfig --level 2345 smartd off
# chkconfig --level 2345 haldaemon off
# chkconfig --level 2345 restorecond off
```

| サービス名 | サービス内容 |
| --- | --- |
| mdmonitor | [ソフトウェアRAID](http://d.hatena.ne.jp/keyword/%A5%BD%A5%D5%A5%C8%A5%A6%A5%A7%A5%A2RAID)をモニターするサービスなので[ソフトウェアRAID](http://d.hatena.ne.jp/keyword/%A5%BD%A5%D5%A5%C8%A5%A6%A5%A7%A5%A2RAID)を使用していないので無効 |
| atd | 単発的にスケジュール化した コマンド を実行させるデーモン。指定時間にコマンド実行を行える，atコマンドを使用したい場合に利用 |
| smartd | ハードディスクの内蔵の自己診断機能(S.M.A.R.T.)を利用し、異常が発生したときにレポートするデーモン。[RAID](http://d.hatena.ne.jp/keyword/RAID)を使わないので無効 |
| haldaemon | システム上のハードウェアに関していくつかのソースから情報を集めたり管理したりするデーモン。デスクトップ環境ではないので無効 |
| restorecond | [SELinux](http://d.hatena.ne.jp/keyword/SELinux)と連動して、ファイルの作成などを監視して適当なラベルを付与するが[SELinux](http://d.hatena.ne.jp/keyword/SELinux)は無効なので、こちらも無効化 |

参考サイト
: [不要なサービスは停止～ソフトウェアRAIDモニター（mdmonitor）](http://hono-linux.seesaa.net/article/384630165.html)
: [不要なサービスは停止～HALデーモン（haldaemon)](http://hono-linux.seesaa.net/article/384714439.html)
: [不要なデーモンを停止させる (CentOS 6.5)](http://qiita.com/RentalCat__/items/862d0ec075e97ae52b52) 
: [不要なデーモンを停止しましょう](http://www.obenri.com/_minset_cent5/daemon_cent5.html)

2.設定変更したlevel設定の確認

`# chkconfig --list |sort -s`

offにしたサービスが起動していないことを確認
