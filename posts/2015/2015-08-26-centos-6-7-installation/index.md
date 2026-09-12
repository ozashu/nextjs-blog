---
title: "CentOS6.7のインストール"
date: "2015-08-26"
---

# CentOS6.7をインストールしたのでメモ代わりに手順を共有します。

- [CentOS](http://d.hatena.ne.jp/keyword/CentOS)のisoダウンロードや[virtualbox](http://d.hatena.ne.jp/keyword/virtualbox)環境は省略します。

参考サイト
: [CentOS6.4をISOを書き込んだDVDからインストール](http://easyramble.com/install-centos-from-dvd.html)

1.「Wellcome to [CentOS](http://d.hatena.ne.jp/keyword/CentOS) 6.7!」のメッセージ画面

「Install or upgrade an existing system」を選択

2.「Disk Found」の画面

「Skip」を選択しCDチェックを行わない

3.「Cent OS6」の画面

「Next」を選択

4.言語の選択

「Japanese(日本語)」を選択し、「Next」を選択し次の設定へ

5.キーボードの設定画面

「日本語」を選択し「次(N)」で次の設定へ進む

6.「どちらのタイプのストレージデ[バイ](http://d.hatena.ne.jp/keyword/%A5%D0%A5%A4)スにインストールしますか？」

「基本ストレージデ[バイ](http://d.hatena.ne.jp/keyword/%A5%D0%A5%A4)ス」の[ラジオボタン](http://d.hatena.ne.jp/keyword/%A5%E9%A5%B8%A5%AA%A5%DC%A5%BF%A5%F3)を選択し。「次(N)」を選択

7.「現在お使いのシステム上には既存のシステムがインストールされています。どのようになさいますか？」

「新規インストール」の[ラジオボタン](http://d.hatena.ne.jp/keyword/%A5%E9%A5%B8%A5%AA%A5%DC%A5%BF%A5%F3)を選択し「次(N)」を選択

8.ホスト名

「[localhost](http://d.hatena.ne.jp/keyword/localhost)」に設定

9.ネットワークの設定

「ネットワークの設定」を選択
「System eth0」を編集

「自動接続する(A)」にチェックする

※ローカル[IPアドレス](http://d.hatena.ne.jp/keyword/IP%A5%A2%A5%C9%A5%EC%A5%B9)を割り当てたい場合は以下の設定も行いましょう。
方式を「[DHCP](http://d.hatena.ne.jp/keyword/DHCP)」から「手動」に変更
「[IPv6](http://d.hatena.ne.jp/keyword/IPv6)のセッティング」タブに移動し、無効化されていることを確認
「適用」を選択し設定を反映させる。
「ネットワーク接続」のウィンドウを「閉じる」で閉じ、「次(N)」を選択

「次(N)」を選択

10.[タイムゾーン](http://d.hatena.ne.jp/keyword/%A5%BF%A5%A4%A5%E0%A5%BE%A1%BC%A5%F3)の選択

「アジア/東京」で変更なし
Rootパスワードを設定

8文字のものを設定

11.どのタイプをインストールをしますか？

## 物理ボリュームの場合

中段にあるボックスから「カスタムレイアウトを作成します。」を選択
既存の[パーティション](http://d.hatena.ne.jp/keyword/%A5%D1%A1%BC%A5%C6%A5%A3%A5%B7%A5%E7%A5%F3)を全て削除

「作成」を選択し、以下の[パーティション](http://d.hatena.ne.jp/keyword/%A5%D1%A1%BC%A5%C6%A5%A3%A5%B7%A5%E7%A5%F3)を追加し、「次(N)」を選択

| マウントポイント サイズ(MB) | 基本[パーティション](http://d.hatena.ne.jp/keyword/%A5%D1%A1%BC%A5%C6%A5%A3%A5%B7%A5%E7%A5%F3)にする | [ファイルシステム](http://d.hatena.ne.jp/keyword/%A5%D5%A5%A1%A5%A4%A5%EB%A5%B7%A5%B9%A5%C6%A5%E0)タイプ |
| --- | --- | --- |
| /boot 250 | チェック | [ext4](http://d.hatena.ne.jp/keyword/ext4) |
| <適用外> 2048 | チェック | swap |
| / 150328 (残り全て) | チェック | [ext4](http://d.hatena.ne.jp/keyword/ext4) |

「ストレージ厚生をディスクに書き込む中」というウィンドウが出るので、「変更をディスクに書き込む」を選択

## 論理ボリュームの場合

カスタムレイアウトを作成するを選択する。
[パーティション](http://d.hatena.ne.jp/keyword/%A5%D1%A1%BC%A5%C6%A5%A3%A5%B7%A5%E7%A5%F3)の設定は以下の通りとする。
「swap」領域を「2048MB」割り当てる。
「/boot」領域を「250MB」割り当てる。またファイルタイムを「[ext4](http://d.hatena.ne.jp/keyword/ext4)」とする。
上記の[パーティション](http://d.hatena.ne.jp/keyword/%A5%D1%A1%BC%A5%C6%A5%A3%A5%B7%A5%E7%A5%F3)の設定完了LVM物理ボリュームを作成する。設定は以下の通りである。
ファイルサイズ:physical volume
サイズ:5892MB
最大許容量まで使用:チェックを入れる
LVM物理ボリューム作成後、次にLVMボリュームグループを作成する。設定は以下の通りである。
ボリュームグループ名:VoGroup00
物理エクステント:4MB
マウントポイント: /
[ファイルシステム](http://d.hatena.ne.jp/keyword/%A5%D5%A5%A1%A5%A4%A5%EB%A5%B7%A5%B9%A5%C6%A5%E0)タイプ:[ext4](http://d.hatena.ne.jp/keyword/ext4)
論理ボリューム:LogVol00
サイズ:5892MB

12.[ブートローダ](http://d.hatena.ne.jp/keyword/%A5%D6%A1%BC%A5%C8%A5%ED%A1%BC%A5%C0)の設定

デフォルト設定で「次(N)」を選択

# [CentOS](http://d.hatena.ne.jp/keyword/CentOS)のインストール完了
