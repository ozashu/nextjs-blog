---
title: "macからvagrantへrake spec実行ユーザ変更"
date: "2018-04-06"
---

[mac](http://d.hatena.ne.jp/keyword/mac)のユーザで[SSH](http://d.hatena.ne.jp/keyword/SSH)接続しようとするので、`vagrant` ユーザに変えたかった。
documentには以下のように記載があった。

> Serverspec with [SSH](http://d.hatena.ne.jp/keyword/SSH) backend logs in to target servers as a user configured in ~/.[ssh](http://d.hatena.ne.jp/keyword/ssh)/config or a current user. If you’d like to change the user, please edit the below line in spec/spec\_helper.rb.

`options[:user] ||= Etc.getlogin`

`~/.ssh/config` や `ssh_config` に記載したがどうしても上の `options[:user] ||= Etc.getlogin` が先に読み込まれて
現在のログインユーザーで実行されてしまった。
なので以下のように強引に書き換えて通った。

```
-options[:user] ||= 'vagrant'
+options[:user] ||= Etc.getlogin
```

`spec_helper.rb` をいい感じに書き換えて `ssh_config` を読ませるようにしたい。
