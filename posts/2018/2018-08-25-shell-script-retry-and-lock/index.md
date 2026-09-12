---
title: "シェルスクリプトでのリトライ処理とロック処理"
date: "2018-08-25"
---

サーバ運用で手動で[Apache](http://d.hatena.ne.jp/keyword/Apache)再起動のような対応は辛いので
アラートを検知したら自動で[Apache](http://d.hatena.ne.jp/keyword/Apache)再起動を実施し、
メールで知らせてくれる[スクリプト](http://d.hatena.ne.jp/keyword/%A5%B9%A5%AF%A5%EA%A5%D7%A5%C8)を書きたいと思い、
リトライ処理やロック処理を[シェルスクリプト](http://d.hatena.ne.jp/keyword/%A5%B7%A5%A7%A5%EB%A5%B9%A5%AF%A5%EA%A5%D7%A5%C8)でどうやるか調べたのでまとめます。

## リトライ処理

変数でリトライ回数とリトライ間隔を決めて
whileループでカウントを1ずつ増やし、
sleepコマンドの引数にリトライ間隔の変数を与えることで
リトライ処理を実装できた。

```
## リトライ処理
RETRY_COUNT=1    # リトライ回数
RETRY_INTERVAL=1 # リトライ間隔1秒

while [[ $COUNT -ne $RETRY_COUNT ]]
do
    COUNT=`expr $COUNT + 1`
    sleep $RETRY_INTERVAL
done
```

## ロック処理

こちらの記事が参考になりました。[https://heartbeats.jp/hbblog/2013/10/atomic03.html#more](%E3%81%9D%E3%81%AE%E3%83%95%E3%82%A1%E3%82%A4%E3%83%AB%E3%80%81%E5%AE%89%E5%85%A8%E3%81%AB%E3%83%AD%E3%83%83%E3%82%AF%E3%81%A7%E3%81%8D%E3%81%A6%E3%81%84%E3%81%BE%E3%81%99%E3%81%8B%EF%BC%9F%EF%BC%88%E3%82%A2%E3%83%88%E3%83%9F%E3%83%83%E3%82%AF%E3%81%AA%E3%83%95%E3%82%A1%E3%82%A4%E3%83%AB%E6%93%8D%E4%BD%9C%EF%BC%9A%E5%BE%8C%E7%B7%A8%EF%BC%89)

> [シンボリックリンク](http://d.hatena.ne.jp/keyword/%A5%B7%A5%F3%A5%DC%A5%EA%A5%C3%A5%AF%A5%EA%A5%F3%A5%AF)を作成するときに、作成先にすでにファイルが存在するとエラーとなります。そのため、ロックファイルを[シンボリックリンク](http://d.hatena.ne.jp/keyword/%A5%B7%A5%F3%A5%DC%A5%EA%A5%C3%A5%AF%A5%EA%A5%F3%A5%AF)として作成を試みれば、ロックファイルが存在すればエラーが発生するため、ロックファイルが存在すると判断し処理を中断できます。ロックファイルが存在しなければ、ロックファイルが[シンボリックリンク](http://d.hatena.ne.jp/keyword/%A5%B7%A5%F3%A5%DC%A5%EA%A5%C3%A5%AF%A5%EA%A5%F3%A5%AF)として作成されます。「ロックファイルの確認」と「ロックファイルの作成」が同時に行われるため、安全にロックすることができるのです。普通のファイルとしてロックファイルを作成する方法での問題は[シンボリックリンク](http://d.hatena.ne.jp/keyword/%A5%B7%A5%F3%A5%DC%A5%EA%A5%C3%A5%AF%A5%EA%A5%F3%A5%AF)の場合は起きません。

以下のように[シンボリックリンク](http://d.hatena.ne.jp/keyword/%A5%B7%A5%F3%A5%DC%A5%EA%A5%C3%A5%AF%A5%EA%A5%F3%A5%AF)を作成することでアトミックにロックファイルを作成することができます。

```
#!/bin/bash
LOCK_FILE=$HOME/tmp/file.lock

## ロックファイルの確認と作成
if ! ln -s $$ $LOCK_FILE; then
    echo "LOCKED"
    exit 0
```

このようにロックファイルの確認と作成を別々に行うとアトミックなファイルの扱いにはならないので要注意です。

```
## ロックファイルの確認
if [ -f $LOCK_FILE ]; then
    echo "LOCKED"
    exit 1
fi
```

それでは実際にリトライ処理とロック処理を使って[シェルスクリプト](http://d.hatena.ne.jp/keyword/%A5%B7%A5%A7%A5%EB%A5%B9%A5%AF%A5%EA%A5%D7%A5%C8)を書いてみましょう。
[Nagios](http://d.hatena.ne.jp/keyword/Nagios)監視でcheck\_httpが何度か失敗し、check\_loadでも失敗したら
[Apache](http://d.hatena.ne.jp/keyword/Apache)再起動を実行し、1分間は[Apache](http://d.hatena.ne.jp/keyword/Apache)再起動が実行されない[スクリプト](http://d.hatena.ne.jp/keyword/%A5%B9%A5%AF%A5%EA%A5%D7%A5%C8)を書いてみます。
これをCronなどで3分毎に実行させればWEBサーバで応答に時間がかかっている時の障害対応を自動化できますね。
ロックファイルを設置して[排他制御](http://d.hatena.ne.jp/keyword/%C7%D3%C2%BE%C0%A9%B8%E6)を行うことで、[Apache](http://d.hatena.ne.jp/keyword/Apache)再起動が何度も実行されないように実装ができます。

```
#!/bin/bash

set -uo pipefail

HOSTNAME=$(uname -n)
MAIL_ADDRESS_TO="メールアドレス"
LOCK_FILE="$HOME/restart.lock"

RETRY_COUNT=5    # リトライ回数
RETRY_INTERVAL=5 # リトライ間隔5秒
COUNT=0

## ロックファイルの確認
## なければロックファイルの作成
if ! ln -s $$ $LOCK_FILE; then
    echo "LOCKED"
    exit 0
fi

/usr/lib64/nagios/plugins/check_http -w 5 -c 7 -H localhost -u "/" -s "</html>"
RETURN_HTTP=$?

if [[ ${RETURN_HTTP} -ne 0 ]]; then

    ## check_httpの応答判断のリトライ処理
    while [[ $COUNT -ne $RETRY_COUNT ]]
    do
        COUNT=`expr $COUNT + 1`
        sleep $RETRY_INTERVAL
        /usr/lib64/nagios/plugins/check_http -w 5 -c 7 -H localhost -u "/" -s "</html>"
        RETURN_HTTP=$?
        if [[ ${RETURN_HTTP} -eq 0 ]]; then
            exit 0
        else
            continue
        fi
    done

    ## リトライ5回繰り返してもcheck_http監視がOKでないなら以下の再起動処理に進む
    if [[ ${RETURN_HTTP} -ne 0 ]]; then
        /usr/lib64/nagios/plugins/check_load -w 2,2,2 -c 3,3,3
        RETURN_LOAD=$?
        if [[ ${RETURN_LOAD} -ne 0 ]]; then

            echo "/etc/init.d/httpd restart"
            RETURN=$?

            if [[ ${RETURN} -ne -0 ]]; then
                RESULT="Failed"
            else
                RESULT="Success"
            fi

            SUBJECT="${HOSTNAME} httpd restart ${RESULT}"
            BODY="${HOSTNAME} restart apache ${RESULT}"
            echo "${BODY}" | mail -s "${SUBJECT}" ${MAIL_ADDRESS_TO}

            ## 再起動後は1分スリープ後にロックファイルの削除
            sleep 60
            rm -f $LOCK_FILE
        fi
    fi
fi
```

障害対応の自動化で他によいものがあれば教えて下さい。
また、今回のアトミックなファイルの取扱いの考え方は自分ひとりではなかなか気づかなかったです。
