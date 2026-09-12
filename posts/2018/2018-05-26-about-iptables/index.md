---
title: "# iptablesについて"
date: "2018-05-26"
---

[iptables](http://d.hatena.ne.jp/keyword/iptables)についてまとめてみました。
設定ミスすると思わぬサービス影響が出るのでちゃんと理解したいところです。

## オプション

| オプション | 意味 |
| --- | --- |
| -N | 新規チェインの追加 |
| -X | ユーザチェインの削除 |
| -A | ルールの追加 |
| -D | ルールの削除 |
| -L | チェインにあるルールの一覧表示 |
| -F | チェイン内容の全消去 |
| -P | 各チェインのデフォルトルール(ポリシー)を記述することができる |
| -I | 選択されたチェインにルール番号を指定して 1 つ以上のルールを挿入する |
| -R | 選択されたチェインにあるルールを置き換える |
| -Z | すべてのチェインのパケットカウンタとバイトカウンタをゼロにする |
| -E | ユーザー定義チェインを指定した名前に変更する。 |
| -h | ヘルプ |

## パラメータ

以下のパラメータは (-A, -D, -I, -R,コマンドで用いられて) ルールの仕様を決める。

| パラメータ名 | 説明 |
| --- | --- |
| -p（--protocol） プロコトル | ルールで使う[プロトコル](http://d.hatena.ne.jp/keyword/%A5%D7%A5%ED%A5%C8%A5%B3%A5%EB)（[tcp](http://d.hatena.ne.jp/keyword/tcp)、[udp](http://d.hatena.ne.jp/keyword/udp)、icmp、all）を指定 |
| -s（--source） [IPアドレス](http://d.hatena.ne.jp/keyword/IP%A5%A2%A5%C9%A5%EC%A5%B9)[/mask] | 送信元アドレス。[IPアドレス](http://d.hatena.ne.jp/keyword/IP%A5%A2%A5%C9%A5%EC%A5%B9)のほかにホスト名などでも指定できる |
| -d（--[destination](http://d.hatena.ne.jp/keyword/destination)） [IPアドレス](http://d.hatena.ne.jp/keyword/IP%A5%A2%A5%C9%A5%EC%A5%B9)[/mask] | 接続先アドレス。[IPアドレス](http://d.hatena.ne.jp/keyword/IP%A5%A2%A5%C9%A5%EC%A5%B9)のほかにホスト名などでも指定できる |
| -i（--in-interface） デ[バイス](http://d.hatena.ne.jp/keyword/%A5%D0%A5%A4%A5%B9) | パケットが入ってくる[インターフェイス](http://d.hatena.ne.jp/keyword/%A5%A4%A5%F3%A5%BF%A1%BC%A5%D5%A5%A7%A5%A4%A5%B9)（eth0、eth1など）を指定 |
| -o（--out-interface） デ[バイス](http://d.hatena.ne.jp/keyword/%A5%D0%A5%A4%A5%B9) | パケットが出ていく[インターフェイス](http://d.hatena.ne.jp/keyword/%A5%A4%A5%F3%A5%BF%A1%BC%A5%D5%A5%A7%A5%A4%A5%B9)を指定 |
| -j（--jump） ターゲット | パケットがマッチしたときのアクション（ターゲット）を指定 |
| -t（--table） テーブル | テーブル（filter、nat、mangle）を指定 |
| ! | -p、-s、-dなどで、条件を反転する。「! 192.168.0.1」とすると、「192.168.0.1以外」という意味になる |
| -c | このオプションを使うと、 (insert, append, replace 操作において) 管理者はパケットカウンタとバイトカウンタを 初期化することができる。 |
| -f | このオプションは、分割されたパケット (fragmented packet) のうち 2 番目以降のパケットだけを参照するルールであることを意味する。 |

- -p
  [プロトコル](http://d.hatena.ne.jp/keyword/%A5%D7%A5%ED%A5%C8%A5%B3%A5%EB) all は全ての[プロトコル](http://d.hatena.ne.jp/keyword/%A5%D7%A5%ED%A5%C8%A5%B3%A5%EB)とマッチし、 このオプションが省略された際のデフォルトである。
- !
  -pでは[プロトコル](http://d.hatena.ne.jp/keyword/%A5%D7%A5%ED%A5%C8%A5%B3%A5%EB)の前に "!" を置くと、その[プロトコル](http://d.hatena.ne.jp/keyword/%A5%D7%A5%ED%A5%C8%A5%B3%A5%EB)を除外するという意味になる。
  -sではアドレス指定の前に "!" を置くと、そのアドレスを除外するという意味になる。 フラグ --src は、このオプションの別名である。
  -dではアドレス指定の前に "!" を置くと、そのアドレスを除外するという意味になる。
  -iではインターフェース名の前に "!" を置くと、 そのインターフェースを除外するという意味になる。
  -oではインターフェース名の前に "!" を置くと、 そのインターフェースを除外するという意味になる。
  -fでは"-f" フラグの前に "!"を置くと、 分割されたパケットのうち最初のものか、 分割されていないパケットだけにマッチする。
- -d
  --dst は、このオプションの別名である。
- -j
  このオプションがルールの中で省略された場合、 ルールに マッチしてもパケットの行方に何も影響しないが、 ルールのカウンタは 1 つ 加算される。
- -i
  パケットを受信することになるインターフェース名 (INPUT, FORWARD, PREROUTING チェインに入るパケットのみ)。
  インターフェース名が "+" で終っている場合、 その名前で始まる任意の インターフェース名にマッチする。
  このオプションが省略された場合、 任意のインターフェース名にマッチする。
- -o
  パケットを送信することになるインターフェース名 (FORWARD, OUTPUT, POSTROUTING チェインに入るパケットのみ)。
  インターフェース名が "+" で終っている場合、 その名前で始まる任意のインターフェース名にマッチする。
  このオプションが省略された場合、 任意のインターフェース名にマッチする。

## テーブルとは

チェインをグループ化したもの

| テーブル名 | 利用できるチェイン |
| --- | --- |
| filter | INPUT,FORWARD,OUTPUT |
| nat | PREROUTING,OUTPUT,POSTROUTING |
| mangle | PREROUTING,OUTPUT,※POSTROUTING,INPUT,FORWARD |

※3つのチェインは[カーネル](http://d.hatena.ne.jp/keyword/%A5%AB%A1%BC%A5%CD%A5%EB)2.4.18からサポートされている。

- filter
  パケットのフィルタリングに使用する。
  これがデフォルトのテーブルである。 (-t オプションが指定されていない場合)
- nat
  このテーブルは新しい接続を開くようなパケットに対して参照される。
  [IPマスカレード](http://d.hatena.ne.jp/keyword/IP%A5%DE%A5%B9%A5%AB%A5%EC%A1%BC%A5%C9)の設定を行う。
  アドレス変換に使用される。
- mangle
  このテーブルは特別なパケット変換に使われる。  
  パケットをNAT以外の目的で置き換えるときに使用される。
  [TOS](http://d.hatena.ne.jp/keyword/TOS)フィールドの書き換えなどパケットの
  書き換えルールを設定する。[QoS](http://d.hatena.ne.jp/keyword/QoS)をするのに使う。

## チェインとは

チェインは入力、出力、転送するパケットに適用するルールのリスト
デフォルトでINPUT, FORWARD, OUTPUT, PREROUTING, POSTROUTINGの
合計5つのチェインが定義されているが新しく作成したり、既存のチェインとリンクさせることが可能

| チェイン | チェインの意味 |
| --- | --- |
| INPUT | コンピュータに入ってくるパケットに適用するルール) |
| FORWARD | あるネットワークインターフェースから、別のネットワークインターフェースに中継されるパケットに適用するルール) |
| OUTPUT | コンピュータから出てゆくパケットに適用するルール) |
| PREROUTING | パケットが入ってきた場合、すぐにそのパケットを変換するためのチェイン) |
| OUTPUT | ローカルで生成されたパケットをルーティングの前に変換するためのチェイン) |
| POSTROUTING | パケットが出て行くときに変換するためのチェイン) |

- FORWARD
  このチェインはコンピュータがルータもしくは[ゲートウェイ](http://d.hatena.ne.jp/keyword/%A5%B2%A1%BC%A5%C8%A5%A6%A5%A7%A5%A4)として構成された場合に使用される。

## iptableの起動確認

`/etc/init.d/iptables status`

- 動いている場合

```
# /etc/init.d/iptables status
テーブル: filter
Chain INPUT (policy ACCEPT)
num  target     prot opt source               destination         
1    ACCEPT     all  --  0.0.0.0/0            0.0.0.0/0           state RELATED,ESTABLISHED
2    ACCEPT     icmp --  0.0.0.0/0            0.0.0.0/0           
3    ACCEPT     all  --  0.0.0.0/0            0.0.0.0/0           
4    ACCEPT     tcp  --  0.0.0.0/0            0.0.0.0/0           state NEW tcp dpt:80
5    ACCEPT     tcp  --  0.0.0.0/0            0.0.0.0/0           state NEW tcp dpt:443
6    ACCEPT     tcp  --  0.0.0.0/0            0.0.0.0/0           state NEW tcp dpt:22
7    ACCEPT     tcp  --  0.0.0.0/0            0.0.0.0/0           state NEW tcp dpt:3306
8    REJECT     all  --  0.0.0.0/0            0.0.0.0/0           reject-with icmp-host-prohibited

Chain FORWARD (policy ACCEPT)
num  target     prot opt source               destination         
1    REJECT     all  --  0.0.0.0/0            0.0.0.0/0           reject-with icmp-host-prohibited

Chain OUTPUT (policy ACCEPT)
num  target     prot opt source               destination
```

- 動いていない場合

```
# /etc/init.d/iptables status
bash: /etc/init.d/iptables: そのようなファイルやディレクトリはありません
```

## natテーブルの状態

オプション`-t nat`で
natテーブルを指定することができる。

```
# iptables -t nat -nvL
Chain PREROUTING (policy ACCEPT 211 packets, 8772 bytes)
 pkts bytes target     prot opt in     out     source               destination         

Chain POSTROUTING (policy ACCEPT 0 packets, 0 bytes)
 pkts bytes target     prot opt in     out     source               destination         

Chain OUTPUT (policy ACCEPT 0 packets, 0 bytes)
 pkts bytes target     prot opt in     out     source               destination
```

## 設定追加した後にサーバ再起動時の動き

saveする前に再起動をすると追加した設定は消える。

[iptables](http://d.hatena.ne.jp/keyword/iptables)の再起動時に`ファイアウォールルールを消去中:`と出力されるので、
保存しなければ再起動時に設定が反映されない。

```
# /etc/init.d/iptables restart
iptables: チェインをポリシー ACCEPT へ設定中filter         [  OK  ]
iptables: ファイアウォールルールを消去中:                  [  OK  ]
iptables: モジュールを取り外し中:                          [  OK  ]
iptables: ファイアウォールルールを適用中:                  [  OK  ]
```

## INPUTチェイン一番上部に追加して`iptables -nvL`の結果をみてみる

- IP:123.456.789.111
- ポート:80
- [プロトコル](http://d.hatena.ne.jp/keyword/%A5%D7%A5%ED%A5%C8%A5%B3%A5%EB):[TCP](http://d.hatena.ne.jp/keyword/TCP)

[iptables](http://d.hatena.ne.jp/keyword/iptables) -I 1 -m state --state NEW -p [tcp](http://d.hatena.ne.jp/keyword/tcp) -s 123.456.789.111 --sport 80 -j ACCEPT

- `iptables -nvL`の結果

```
# iptables -nvL
Chain INPUT (policy ACCEPT 0 packets, 0 bytes)
 pkts bytes target     prot opt in     out     source               destination         
    0     0 ACCEPT     tcp  --  *      *       123.456.789.111      0.0.0.0/0           state NEW tcp spt:80
  404 33344 ACCEPT     all  --  *      *       0.0.0.0/0            0.0.0.0/0           state RELATED,ESTABLISHED
    0     0 ACCEPT     icmp --  *      *       0.0.0.0/0            0.0.0.0/0           
    0     0 ACCEPT     all  --  lo     *       0.0.0.0/0            0.0.0.0/0           
    0     0 ACCEPT     tcp  --  *      *       0.0.0.0/0            0.0.0.0/0           state NEW tcp dpt:80
    0     0 ACCEPT     tcp  --  *      *       0.0.0.0/0            0.0.0.0/0           state NEW tcp dpt:443
    0     0 ACCEPT     tcp  --  *      *       0.0.0.0/0            0.0.0.0/0           state NEW tcp dpt:22
    2   120 ACCEPT     tcp  --  *      *       0.0.0.0/0            0.0.0.0/0           state NEW tcp dpt:3306
    0     0 REJECT     all  --  *      *       0.0.0.0/0            0.0.0.0/0           reject-with icmp-host-prohibited

Chain FORWARD (policy ACCEPT 0 packets, 0 bytes)
 pkts bytes target     prot opt in     out     source               destination         
    0     0 REJECT     all  --  *      *       0.0.0.0/0            0.0.0.0/0           reject-with icmp-host-prohibited

Chain OUTPUT (policy ACCEPT 13 packets, 2948 bytes)
 pkts bytes target     prot opt in     out     source               destination
```

## [SMTP](http://d.hatena.ne.jp/keyword/SMTP)(25ポート)にアタックが来ていると仮定して、遮断手順作成してみる

- IP:123.456.789.222
- ポート:25
- [プロトコル](http://d.hatena.ne.jp/keyword/%A5%D7%A5%ED%A5%C8%A5%B3%A5%EB):[TCP](http://d.hatena.ne.jp/keyword/TCP)
- チェインはINPUT
- アタックを /var/log/maillog で確認

```
# /etc/init.d/iptables status
# cp -a /etc/sysconfig/iptables{,.`date +%Y%m%d`_1}
# /etc/init.d/iptables save
# cp -a /etc/sysconfig/iptables{,.`date +%Y%m%d`_2}
# iptables -nvL (iptables -nL)
# iptables -I INPUT -s 123.456.789.111 -p tcp --dport 25 -j DROP
# iptables -nvL
# /etc/init.d/iptables save
```

以下は実行ログ

```
# cp -a /etc/sysconfig/iptables{,.`date +%Y%m%d`_1}
# /etc/init.d/iptables save
iptables: ファイアウォールのルールを /etc/sysconfig/iptable[  OK  ]中:
# cp -a /etc/sysconfig/iptables{,.`date +%Y%m%d`_2}
# iptables -nvL
Chain INPUT (policy ACCEPT 0 packets, 0 bytes)
 pkts bytes target     prot opt in     out     source               destination         
    0     0 ACCEPT     tcp  --  *      *       123.456.789.111      0.0.0.0/0           state NEW tcp spt:80
  171 13020 ACCEPT     all  --  *      *       0.0.0.0/0            0.0.0.0/0           state RELATED,ESTABLISHED
    0     0 ACCEPT     icmp --  *      *       0.0.0.0/0            0.0.0.0/0           
    0     0 ACCEPT     all  --  lo     *       0.0.0.0/0            0.0.0.0/0           
    0     0 ACCEPT     tcp  --  *      *       0.0.0.0/0            0.0.0.0/0           state NEW tcp dpt:80
    0     0 ACCEPT     tcp  --  *      *       0.0.0.0/0            0.0.0.0/0           state NEW tcp dpt:443
    0     0 ACCEPT     tcp  --  *      *       0.0.0.0/0            0.0.0.0/0           state NEW tcp dpt:22
    4   240 ACCEPT     tcp  --  *      *       0.0.0.0/0            0.0.0.0/0           state NEW tcp dpt:3306
    1   229 REJECT     all  --  *      *       0.0.0.0/0            0.0.0.0/0           reject-with icmp-host-prohibited

Chain FORWARD (policy ACCEPT 0 packets, 0 bytes)
 pkts bytes target     prot opt in     out     source               destination         
    0     0 REJECT     all  --  *      *       0.0.0.0/0            0.0.0.0/0           reject-with icmp-host-prohibited

Chain OUTPUT (policy ACCEPT 107 packets, 15828 bytes)
 pkts bytes target     prot opt in     out     source               destination         
# iptables -I INPUT -s 123.456.789.111 -p tcp --dport 25 -j DROP
# iptables -nvL
Chain INPUT (policy ACCEPT 0 packets, 0 bytes)
 pkts bytes target     prot opt in     out     source               destination         
    0     0 DROP       tcp  --  *      *       123.456.789.222      0.0.0.0/0           tcp dpt:25
    0     0 ACCEPT     tcp  --  *      *       123.456.789.111      0.0.0.0/0           state NEW tcp spt:80
  189 14412 ACCEPT     all  --  *      *       0.0.0.0/0            0.0.0.0/0           state RELATED,ESTABLISHED
    0     0 ACCEPT     icmp --  *      *       0.0.0.0/0            0.0.0.0/0           
    0     0 ACCEPT     all  --  lo     *       0.0.0.0/0            0.0.0.0/0           
    0     0 ACCEPT     tcp  --  *      *       0.0.0.0/0            0.0.0.0/0           state NEW tcp dpt:80
    0     0 ACCEPT     tcp  --  *      *       0.0.0.0/0            0.0.0.0/0           state NEW tcp dpt:443
    0     0 ACCEPT     tcp  --  *      *       0.0.0.0/0            0.0.0.0/0           state NEW tcp dpt:22
    5   300 ACCEPT     tcp  --  *      *       0.0.0.0/0            0.0.0.0/0           state NEW tcp dpt:3306
    1   229 REJECT     all  --  *      *       0.0.0.0/0            0.0.0.0/0           reject-with icmp-host-prohibited

Chain FORWARD (policy ACCEPT 0 packets, 0 bytes)
 pkts bytes target     prot opt in     out     source               destination         
    0     0 REJECT     all  --  *      *       0.0.0.0/0            0.0.0.0/0           reject-with icmp-host-prohibited

Chain OUTPUT (policy ACCEPT 4 packets, 576 bytes)
 pkts bytes target     prot opt in     out     source               destination         
# /etc/init.d/iptables save
iptables: ファイアウォールのルールを /etc/sysconfig/iptable[  OK  ]中:
# iptables -nvL
Chain INPUT (policy ACCEPT 0 packets, 0 bytes)
 pkts bytes target     prot opt in     out     source               destination         
    0     0 DROP       tcp  --  *      *       111.111.111.111      0.0.0.0/0           tcp dpt:25
    0     0 ACCEPT     tcp  --  *      *       111.111.111.111      0.0.0.0/0           state NEW tcp spt:80
  204 15448 ACCEPT     all  --  *      *       0.0.0.0/0            0.0.0.0/0           state RELATED,ESTABLISHED
    0     0 ACCEPT     icmp --  *      *       0.0.0.0/0            0.0.0.0/0           
    0     0 ACCEPT     all  --  lo     *       0.0.0.0/0            0.0.0.0/0           
    0     0 ACCEPT     tcp  --  *      *       0.0.0.0/0            0.0.0.0/0           state NEW tcp dpt:80
    0     0 ACCEPT     tcp  --  *      *       0.0.0.0/0            0.0.0.0/0           state NEW tcp dpt:443
    0     0 ACCEPT     tcp  --  *      *       0.0.0.0/0            0.0.0.0/0           state NEW tcp dpt:22
    5   300 ACCEPT     tcp  --  *      *       0.0.0.0/0            0.0.0.0/0           state NEW tcp dpt:3306
    1   229 REJECT     all  --  *      *       0.0.0.0/0            0.0.0.0/0           reject-with icmp-host-prohibited

Chain FORWARD (policy ACCEPT 0 packets, 0 bytes)
 pkts bytes target     prot opt in     out     source               destination         
    0     0 REJECT     all  --  *      *       0.0.0.0/0            0.0.0.0/0           reject-with icmp-host-prohibited

Chain OUTPUT (policy ACCEPT 15 packets, 3516 bytes)
 pkts bytes target     prot opt in     out     source               destination         
# /etc/init.d/iptables restart
iptables: チェインをポリシー ACCEPT へ設定中filter         [  OK  ]
iptables: ファイアウォールルールを消去中:                  [  OK  ]
iptables: モジュールを取り外し中:                          [  OK  ]
iptables: ファイアウォールルールを適用中:                  [  OK  ]
# iptables -nvL
Chain INPUT (policy ACCEPT 0 packets, 0 bytes)
 pkts bytes target     prot opt in     out     source               destination         
    0     0 DROP       tcp  --  *      *       111.111.111.111      0.0.0.0/0           tcp dpt:25
    0     0 ACCEPT     tcp  --  *      *       111.111.111.111      0.0.0.0/0           state NEW tcp spt:80
   16  1168 ACCEPT     all  --  *      *       0.0.0.0/0            0.0.0.0/0           state RELATED,ESTABLISHED
    0     0 ACCEPT     icmp --  *      *       0.0.0.0/0            0.0.0.0/0           
    0     0 ACCEPT     all  --  lo     *       0.0.0.0/0            0.0.0.0/0           
    0     0 ACCEPT     tcp  --  *      *       0.0.0.0/0            0.0.0.0/0           state NEW tcp dpt:80
    0     0 ACCEPT     tcp  --  *      *       0.0.0.0/0            0.0.0.0/0           state NEW tcp dpt:443
    0     0 ACCEPT     tcp  --  *      *       0.0.0.0/0            0.0.0.0/0           state NEW tcp dpt:22
    0     0 ACCEPT     tcp  --  *      *       0.0.0.0/0            0.0.0.0/0           state NEW tcp dpt:3306
    0     0 REJECT     all  --  *      *       0.0.0.0/0            0.0.0.0/0           reject-with icmp-host-prohibited

Chain FORWARD (policy ACCEPT 0 packets, 0 bytes)
 pkts bytes target     prot opt in     out     source               destination         
    0     0 REJECT     all  --  *      *       0.0.0.0/0            0.0.0.0/0           reject-with icmp-host-prohibited

Chain OUTPUT (policy ACCEPT 9 packets, 1236 bytes)
 pkts bytes target     prot opt in     out     source               destination
```

[iptables](http://d.hatena.ne.jp/keyword/iptables)で遮断する手順も用意しました。

# アタックがあった際[iptables](http://d.hatena.ne.jp/keyword/iptables)にて遮断する手順

## 注意

- どこのテーブルに設定を追加するか確認すること

### アタックの判断基準

- [netstat](http://d.hatena.ne.jp/keyword/netstat)の出力だけでアタックと判断しない
- 海外IPだからという理由だけでアタックと判断しない
- 必ず各ログを閲覧し、アタックと思われる出力を確認する

### どこで遮断するか(サーバ、上流LB)

- LBにぶら下がっているサーバに関しては、上流LBにて遮断を実施する。
- その他については当該サーバにて遮断を実施する。

## 遮断手順

1. root権限

   ```
     sudo su -
   ```
2. 実施前に service [iptables](http://d.hatena.ne.jp/keyword/iptables) status で有効か確認する

   ```
    service iptables status
   ```
3. 現在の[iptables](http://d.hatena.ne.jp/keyword/iptables)の設定確認

   ```
    iptables -nvL --line
   ```
4. ルールに差異がないかを確認

   ```
    diff /etc/sysconfig/iptables <(iptables-save)
   ```
5. 設定ファイルをバックアップ

   ```
    cp -a /etc/sysconfig/iptables{,.`date +%Y%m%d`}
   ```
6. 現在の設定を保存

   ```
    /etc/init.d/iptables save
   ```

   ※centos7系 [iptables](http://d.hatena.ne.jp/keyword/iptables)-save > /etc/sysconfig/[iptables](http://d.hatena.ne.jp/keyword/iptables)(wm\_ml)
7. 設定のバックアップ

   ```
    cp -a /etc/sysconfig/iptables{,.`date +%Y%m%d`_2}
   ```
8. 対象のIPを遮断

   ```
    iptables -I ＜チェイン名＞ 1 -p tcp -m tcp --dport ＜ポート番号＞ -s ＜IPアドレス＞ -j DROP

    iptables -I INPUT 1 -p tcp -m tcp --dport 80 -s 123.456.789.111 -j DROP
    iptables -I INPUT 1 -p tcp -m tcp --dport 80 -s 123.456.789.222 -j DROP
   ```
9. 追加されたか確認

   ```
    iptables -nvL --line
   ```
10. 疎通確認

    1. 正常な(遮断されるべきでない)疎通が取れるか確認する
    2. 別窓で当該サーバの遮断したポートに対して[telnet](http://d.hatena.ne.jp/keyword/telnet)を実行

       ```
        telnet <サーバ> <ポート>
       ```
    3. 正常に接続できることを確認
11. 現在の設定を吐き出す

    ```
    /etc/init.d/iptables save
    ```

    ※centos7系 [iptables](http://d.hatena.ne.jp/keyword/iptables)-save > /etc/sysconfig/[iptables](http://d.hatena.ne.jp/keyword/iptables)

## 差し戻し手順

1. 直前のバックアップファイルから復元

   ```
    iptables-restore < /etc/sysconfig/iptables{,.$(date +%Y%m%d)}
   ```
2. 確認

   ```
    iptables -nvL
   ```
3. 疎通確認

   ```
    telnet <サーバ> <ポート>
   ```
4. save

   ```
    /etc/init.d/iptables save
   ```

   ※centos7系 [iptables](http://d.hatena.ne.jp/keyword/iptables)-save > /etc/sysconfig/[iptables](http://d.hatena.ne.jp/keyword/iptables)

## 削除手順

1. root権限

   ```
    sudo su -
   ```
2. 実施前に service [iptables](http://d.hatena.ne.jp/keyword/iptables) status で有効か確認する

   ```
    service iptables status
   ```
3. 現在の[iptables](http://d.hatena.ne.jp/keyword/iptables)の設定確認

   ```
    iptables -nvL --line
   ```
4. 設定のバックアップ

   ```
    cp -a /etc/sysconfig/iptables{,.`date +%Y%m%d`}
   ```
5. 現在の設定を保存

   ```
    /etc/init.d/iptables save
   ```
6. 設定のバックアップ

   ```
    cp -a /etc/sysconfig/iptables{,.`date +%Y%m%d`_2}
   ```
7. 対象のIPを遮断

   ```
    iptables -D ＜チェイン名＞ ＜行番号＞
   ```
8. 追加されたか確認

   ```
    iptables -nvL --line
   ```
9. 現在の設定を吐き出す

   ```
    /etc/init.d/iptables save
   ```

   ※centos7系 [iptables](http://d.hatena.ne.jp/keyword/iptables)-save > /etc/sysconfig/[iptables](http://d.hatena.ne.jp/keyword/iptables)
