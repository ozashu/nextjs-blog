---
title: "\"msg\": \"Failed to connect to the host via ssh: Permission denied (publickey,password).\r\n\"の対応"
date: "2018-04-06"
---

## 環境

- コントローラー:[Mac](http://d.hatena.ne.jp/keyword/Mac)
- ターゲット:CentOS6.9([vagrant](http://d.hatena.ne.jp/keyword/vagrant))

`ansible -i inventory/inventory.ini playbook -m ping`

[ping](http://d.hatena.ne.jp/keyword/ping)で疎通確認をしたところ以下のメッセージが出た。
[SSH](http://d.hatena.ne.jp/keyword/SSH)接続失敗しているようだった。

`"msg": "Failed to connect to the host via ssh: Permission denied (publickey,password).\r\n"`

公開鍵の権限など確認したけど問題なく原因がわからなかったのですが、
`- vvv` オプションで確認したところ以下のように[SSH](http://d.hatena.ne.jp/keyword/SSH)接続するuserが指定されていないのが原因だった。

`ESTABLISH SSH CONNECTION FOR USER: None`

なので、 以下のようにインベントリにユーザを指定すれば解決しました。

`192.168.33.27 ansible_user=vagrant`

[SSH](http://d.hatena.ne.jp/keyword/SSH)が通らない時に原因はいくつかあると思いますが、 `-vvv` や `-vvvv` を指定すれば原因が掴めそうです。
