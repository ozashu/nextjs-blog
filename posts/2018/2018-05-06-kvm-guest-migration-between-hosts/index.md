---
title: "# KVM仮想化ホストサーバ間でのゲストサーバ移動"
date: "2018-05-06"
---

[KVM](http://d.hatena.ne.jp/keyword/KVM)仮想化環境でゲストイメージを別のホストサーバに移動させたので、
手順をまとめておきます。

## ゲストサーバの起動状況確認

`virsh list --all` などで対象のゲストサーバが存在するか確認しましょう。
またイメージファイルや転送先のホストのディスク容量なども確認しておきましょう。
`virsh nodeinfo` や `virsh dominfo <ドメイン名>` でCPUやメモリなどの割当状況も確認しておきます。

## 移動するゲストイメージの停止

移動するゲストイメージを停止します。

```
virsh dominfo <ドメイン名>
virsh shutdown <ドメイン名>
virsh destroy <ドメイン名>　#shutdownで停止しなかったら  
virsh dominfo <ドメイン名>
```

## ゲストイメージのファイルコピー

定義ファイルとimageファイルをコピーします。
[rsync](http://d.hatena.ne.jp/keyword/rsync)は転送の効率化のために、暗号方式や転送速度制限を行っています。

```
virsh dumpxml <ドメイン名> > /tmp/定義ファイル名.xml
scp /tmp/定義ファイル名.xml user@対象サーバのIP:~/
rsync -avS --progress -e "ssh -c arcfour" --bwlimit=250000 /var/lib/libvirt/images/イメージファイル名.img user@対象サーバのIP:~/
ionice -c3 nice -n15 md5sum /var/lib/libvirt/images/イメージファイル名.img
```

## 転送したファイルのチェック

imageファイルのチェック

```
ionice -c3 nice -n15 md5sum /path/to/イメージファイル名.img
```

## 定義ファイルの配置

権限等は他と揃えておきましょう、

```
mv /path/to/定義ファイル名.xml /etc/libvirt/qemu/
```

## ハードリンク作成

imageファイルが消失してもいいようにハードリンク作成しておきます。

```
ln /var/lib/libvirt/images/イメージファイル名.img /var/lib/libvirt/hardlink/イメージファイル名.img
```

## ゲストサーバを[libvirt](http://d.hatena.ne.jp/keyword/libvirt) 管理下に登録、起動

定義ファイルを定義して、起動

```
virsh define /etc/libvirt/qemu/定義ファイル名.xml
virsh dominfo <ドメイン名>
virsh start <ドメイン名>
```

## 設定の削除

移設元の設定は不要なので削除します。

```
virsh undefine <ドメイン名>
```
