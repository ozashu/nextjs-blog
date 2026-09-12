---
title: "Ansible入門"
date: "2016-09-04"
---

## Ansible

Ansibleサーバのhostを立てて、
AnsibleでWEBとDBサーバを構築していく。
Ansibleでは管理される側には[Python](http://d.hatena.ne.jp/keyword/Python)が入っていて、
あとは[SSH](http://d.hatena.ne.jp/keyword/SSH)接続ができればよい。

- やっていくこと

Ansibleのインストール
[SSH](http://d.hatena.ne.jp/keyword/SSH)接続確認
Inventoryファイル編集 # どのサーバを管理するのか記述する
ansible.cfg編集 # Ansibleの設定ファイル
Playbook編集 # 管理するサーバの構成を記述

- 構成

HOSTサーバ:Ansible
WEBサーバ：Use,[Apache](http://d.hatena.ne.jp/keyword/Apache),[PHP](http://d.hatena.ne.jp/keyword/PHP)
DBサーバ：Use,[MySQL](http://d.hatena.ne.jp/keyword/MySQL)

[ここ](http://ozashu.hatenablog.com/entry/2016/08/18/14351)の[Vagrant](http://d.hatena.ne.jp/keyword/Vagrant)の手順でサーバを立ち上げます。

Vagrantfileは以下の設定を追記します。

```
# 変更箇所
  # config.vm.box = "bento/centos-6.7"

# 追加箇所
  config.vm.define "host" do |node|
    node.vm.box = "bento/centos-6.7"
    node.vm.hostname = "host"
    node.vm.network :private_network, ip: "192.168.43.51"
  end

  config.vm.define "web" do |node|
  node.vm.box = "bento/centos-6.7"
    node.vm.hostname = "web"
    node.vm.network :private_network, ip: "192.168.43.52"
  end

  config.vm.define "db" do |node|
  node.vm.box = "bento/centos-6.7"
    node.vm.hostname = "db"
    node.vm.network :private_network, ip: "192.168.43.53"
  end
```

サーバを立ち上げ、立ち上がっているのを確認

```
$ vagrant up
$ vagrant status
Current machine states:

host                      running (virtualbox)
web                       running (virtualbox)
db                        running (virtualbox)
```

Ansibleサーバのhostへ[ssh](http://d.hatena.ne.jp/keyword/ssh)接続をします。

```
$ vagrant ssh host
```

[yum](http://d.hatena.ne.jp/keyword/yum)でAnsibleインストールできなかった。

```
$ sudo yum install ansible
(略)
パッケージ ansible は利用できません。
エラー: 何もしません
```

epel[リポジトリ](http://d.hatena.ne.jp/keyword/%A5%EA%A5%DD%A5%B8%A5%C8%A5%EA)をインストールします

```
$ sudo yum install epel-release
```

これは[rpm](http://d.hatena.ne.jp/keyword/rpm)でインストールしてもよい。
<https://dl.fedoraproject.org/pub/epel/>
最新は<https://dl.fedoraproject.org/pub/epel/epel-release-latest-7.noarch.rpm>ですね。(2016/08現在)

```
wget https://dl.fedoraproject.org/pub/epel/epel-release-latest-7.noarch.rpm
sudo rpm -Uvh epel-release-latest-7.noarch.rpm
```

これでもう一度[yum](http://d.hatena.ne.jp/keyword/yum)でAnsibleをインストールすればできるはず

```
$ sudo yum install ansible
```

Ansibleインストール完了

```
$ ansible --version
ansible 2.1.1.0
  config file = /etc/ansible/ansible.cfg
  configured module search path = Default w/o overrides
```

[SSH](http://d.hatena.ne.jp/keyword/SSH)接続を鍵認証で行えるようにします。

`.ssh/config`を作成します。
また[パーミッション](http://d.hatena.ne.jp/keyword/%A5%D1%A1%BC%A5%DF%A5%C3%A5%B7%A5%E7%A5%F3)も変更します。

```
$ vi .ssh/config
Host web
 HostName 192.168.43.52
 User vagrant
Host db
 HostName 192.168.43.53
 User vagrant
$ ll .ssh/config
-rw-rw-r--. 1 vagrant vagrant 67  8月 29 10:34 2016 .ssh/config
$ chmod 600 .ssh/config
 ll .ssh/config
-rw-------. 1 vagrant vagrant 67  8月 29 10:34 2016 .ssh/config
```

次に[秘密鍵](http://d.hatena.ne.jp/keyword/%C8%EB%CC%A9%B8%B0)と公開鍵を作成しwebとdbに公開鍵をコピーします。
コピーしたらhostnameを指定して[SSH](http://d.hatena.ne.jp/keyword/SSH)接続できることを確認

```
$ ssh-keygen -t rsa
$ ssh-keygen -t rsa
$ ssh-copy-id web
$ ssh web
$ ssh-copy-id db
$ ssh db
```

hostsというinventoryファイルを作成し
host側でAnsibleコマンドを実行します。
hostsにはwebとdbの情報を記載します。
ここで[グループ名]でグループをつくることができます。
Ansibleコマンドを実行するときallやhostname指定またはグループ指定ができるようになります。

```
$ vi hosts
[web]
192.168.43.52

[db]
192.168.43.53
```

`ansible 対象サーバ -i inventoryファイル(フルパス) -m module名`

ex.[ping](http://d.hatena.ne.jp/keyword/ping) module

```
$ ansible all -i hosts -m ping
192.168.43.53 | SUCCESS => {
    "changed": false,
    "ping": "pong"
}
192.168.43.52 | SUCCESS => {
    "changed": false,
    "ping": "pong"
}
```

また`ansible.cfg`にinventoryファイルを指定すれば省略可能です。

-i を抜かしてコマンドが実行できます。

`$ ansible all -m ping`

```
$ ansible all -m ping
192.168.43.52 | SUCCESS => {
    "changed": false,
    "ping": "pong"
}
192.168.43.53 | SUCCESS => {
    "changed": false,
    "ping": "pong"
}
```

playbookにサーバにしたい処理を書きます
今回は[hoge](http://d.hatena.ne.jp/keyword/hoge)ユーザを追加してみます。
[YAML](http://d.hatena.ne.jp/keyword/YAML)ファイルで記述します。
一行目の「---」[YAML](http://d.hatena.ne.jp/keyword/YAML)ファイルであることを指す
「- hosts」に対象サーバを指定する。今回は「all」で全台へ
管理者権限が必要なので「sudo: yes」とする。
タスクを実行するために「tasks:」モジュールを指定し、
タスクに名前をつけておきます。
`- name: add a new user`とし、
userモジュールとnameオプションで[hoge](http://d.hatena.ne.jp/keyword/hoge)ユーザを追加します。

```
$ vi playbook.yml
$ cat playbook.yml
---
- hosts: all
  sudo: yes
  tasks:
    - name: add a new user
      user: name=hoge
$ ansible-playbook playbook.yml
[DEPRECATION WARNING]: Instead of sudo/sudo_user, use become/become_user and make sure become_method is 'sudo' (default).
This feature will be removed in a future release. Deprecation warnings
can be disabled by setting deprecation_warnings=False in ansible.cfg.

PLAY [all] *********************************************************************

TASK [setup] *******************************************************************
ok: [192.168.43.52]
ok: [192.168.43.53]

TASK [add a new user] **********************************************************
changed: [192.168.43.52]
changed: [192.168.43.53]

PLAY RECAP *********************************************************************
192.168.43.52              : ok=2    changed=1    unreachable=0    failed=0
192.168.43.53              : ok=2    changed=1    unreachable=0    failed=0
```

モジュールは冪等なのですでに[hoge](http://d.hatena.ne.jp/keyword/hoge)ユーザがいたら、何もしません。
2回目を実行してもOKで返ってきますが、`changed=0`となっていることがわかります。
シェルとかだと既にユーザがいたらおかしな挙動をするかもしれませんね。
ここがAnsibleの利点で安全にplaybookを何度も実行できます。
実際に[hoge](http://d.hatena.ne.jp/keyword/hoge)ユーザが追加されていることも確認できました。

```
$ ansible-playbook playbook.yml
[DEPRECATION WARNING]: Instead of sudo/sudo_user, use become/become_user and make sure become_method is 'sudo' (default).
This feature will be removed in a future release. Deprecation warnings
can be disabled by setting deprecation_warnings=False in ansible.cfg.

PLAY [all] *********************************************************************

TASK [setup] *******************************************************************
ok: [192.168.43.52]
ok: [192.168.43.53]

TASK [add a new user] **********************************************************
ok: [192.168.43.52]
ok: [192.168.43.53]

PLAY RECAP *********************************************************************
192.168.43.52              : ok=2    changed=0    unreachable=0    failed=0
192.168.43.53              : ok=2    changed=0    unreachable=0    failed=0

$ ssh web
Last login: Wed Aug 31 22:12:23 2016 from 192.168.43.51
 cat /etc/passwd |grep hoge
hoge:x:501:501::/home/hoge:/bin/bash
```

stateオプションを使ってみる。
stateそれが存在するかどうかを指定できる。
[hoge](http://d.hatena.ne.jp/keyword/hoge)ユーザが存在しないとする。

```
      user: name=hoge state=absent
```

実行してみるとユーザが消えていることが確認できる。

```
[vagrant@host ~]$ ansible-playbook playbook.yml
[DEPRECATION WARNING]: Instead of sudo/sudo_user, use become/become_user and make sure become_method is 'sudo' (default).
This feature will be removed in a future release. Deprecation warnings
can be disabled by setting deprecation_warnings=False in ansible.cfg.

PLAY [all] *********************************************************************

TASK [setup] *******************************************************************
ok: [192.168.43.52]
ok: [192.168.43.53]

TASK [add a new user] **********************************************************
changed: [192.168.43.52]
changed: [192.168.43.53]

PLAY RECAP *********************************************************************
192.168.43.52              : ok=2    changed=1    unreachable=0    failed=0
192.168.43.53              : ok=2    changed=1    unreachable=0    failed=0

[vagrant@host ~]$ ssh web
^[[ALast login: Wed Aug 31 22:37:46 2016 from 192.168.43.51
[vagrant@web ~]$ cat /etc/passwd |grep hoge
[vagrant@web ~]$ logout
```

ansible-playbookのオプションを確認

`--syntax-check`はPlaybookの文法チェック

```
$ ansible-playbook playbook.yml --syntax-check
[DEPRECATION WARNING]: Instead of sudo/sudo_user, use become/become_user and make sure become_method is 'sudo' (default).
This feature will be removed in a future release. Deprecation warnings
can be disabled by setting deprecation_warnings=False in ansible.cfg.

playbook: playbook.yml
```

`--list-task`はタスク一覧を表示

```
$ ansible-playbook playbook.yml --list-task
[DEPRECATION WARNING]: Instead of sudo/sudo_user, use become/become_user and make sure become_method is 'sudo' (default).
This feature will be removed in a future release. Deprecation warnings
can be disabled by setting deprecation_warnings=False in ansible.cfg.

playbook: playbook.yml

  play #1 (all): all    TAGS: []
    tasks:
      add a new user    TAGS: []
```

`--check`はドライランを実行

```
$ ansible-playbook playbook.yml --check
```

Playbookでは変数も使えます。Playbookを使い回すときに便利になる。

今回はユーザ名を変数で扱ってみます。

[tasks:]の前に[vats:]というのをつけて
キーと値を管理します。
ここでは`username: hoge`
変数とするときは`{{キー}}`とすればよい

```
$ cat playbook.yml
---
- hosts: all
  sudo: yes
  vars:
    username: hoge
  tasks:
    - name: add a new user
      user: name={{username}}
]$ ansible-playbook playbook.yml
[DEPRECATION WARNING]: Instead of sudo/sudo_user, use become/become_user and make sure become_method is 'sudo' (default).
This feature will be removed in a future release. Deprecation warnings
can be disabled by setting deprecation_warnings=False in ansible.cfg.

PLAY [all] *********************************************************************

TASK [setup] *******************************************************************
ok: [192.168.43.52]
ok: [192.168.43.53]

TASK [add a new user] **********************************************************
changed: [192.168.43.52]
changed: [192.168.43.53]

PLAY RECAP *********************************************************************
192.168.43.52              : ok=2    changed=1    unreachable=0    failed=0
192.168.43.53              : ok=2    changed=1    unreachable=0    failed=0
```

実行時にユーザに変数の値を入力させることもできます。
「vars: prompt」として「username: "Enter username"」とする。
これで実行時にユーザ名が聞かれます。

```
$ cat playbook.yml
---
- hosts: all
  sudo: yes
#  vars:
#    username: hoge
  vars_prompt:
    username: "Enter username"
  tasks:
    - name: add a new user
      user: name={{username}}
$ ansible-playbook playbook.yml
[DEPRECATION WARNING]: Instead of sudo/sudo_user, use become/become_user and make sure become_method is 'sudo' (default).
This feature will be removed in a future release. Deprecation warnings
can be disabled by setting deprecation_warnings=False in ansible.cfg.
[DEPRECATION WARNING]: Using the 'short form' for vars_prompt has been deprecated.
This feature will be removed in a future release. Deprecation warnings can be disabled by setting
deprecation_warnings=False in ansible.cfg.
Enter username: hoge

PLAY [all] *********************************************************************

TASK [setup] *******************************************************************
ok: [192.168.43.53]
ok: [192.168.43.52]

TASK [add a new user] **********************************************************
ok: [192.168.43.52]
ok: [192.168.43.53]

PLAY RECAP *********************************************************************
192.168.43.52              : ok=2    changed=0    unreachable=0    failed=0
192.168.43.53              : ok=2    changed=0    unreachable=0    failed=0
```

WEBに[Apache](http://d.hatena.ne.jp/keyword/Apache)をインストールするplaybookを書きます。
[yum](http://d.hatena.ne.jp/keyword/yum)モジュールを使い、`state=latest`とすると最新版をインストールします。
serviceモジュールを使い、再起動時に[自動起動](http://d.hatena.ne.jp/keyword/%BC%AB%C6%B0%B5%AF%C6%B0)するように設定します。

```
---
- hosts: all
  sudo: yes
  tasks:
    - name: add a new user
      user: name=hoge

- hosts: web
  sudo: yes
  tasks:
   - name: install apache
     yum: name=httpd state=latest
   - name: start apache and enabled
     service: name=httpd state=started enabled=yes
~
```

WEBブラウザのURLに`192.168.43.52`でアクセスすると[Apache](http://d.hatena.ne.jp/keyword/Apache)の画面が出てきます。

次は[Apache](http://d.hatena.ne.jp/keyword/Apache)のドキュメントルートの所有者を変更し、
ファイルを置いてWEBブラウザ上から確認してみます。
最初に適当にindex.htmlを作成してかた、
playbookに書いていきます。

まずは、ドキュメントルートの所有者変更は
ファイルや[ディレクト](http://d.hatena.ne.jp/keyword/%A5%C7%A5%A3%A5%EC%A5%AF%A5%C8)リに関するfileモジュールを使います。
対象[ディレクト](http://d.hatena.ne.jp/keyword/%A5%C7%A5%A3%A5%EC%A5%AF%A5%C8)リとownerを指定し、`recurse=yes`にすることで
[再帰](http://d.hatena.ne.jp/keyword/%BA%C6%B5%A2)的に反映されます。

次に、index.htmlファイルを転送するために
copyモジュールを使い、
対象ファイルと、対象[ディレクト](http://d.hatena.ne.jp/keyword/%A5%C7%A5%A3%A5%EC%A5%AF%A5%C8)リ、所有者を指定します。

```
---
- hosts: all
  sudo: yes
  tasks:
    - name: add a new user
      user: name=hoge
 - hosts: web
  sudo: yes
  tasks:
   - name: install apache
     yum: name=httpd state=latest
   - name: start apache and enabled
     service: name=httpd state=started enabled=yes
   - name: change owner
     file: dest=/var/www/html owner=vagrant recurse=yes
   - name: copy index.html
     copy: src=./index.html dest=/var/www/html/index.html owner=vagrant
```

ansible-playbookを実行するとエラーが出ました。

```
TASK [copy index.html] *********************************************************
fatal: [192.168.43.52]: FAILED! => {"changed": false, "checksum": "82a4c7e6c69f12b6fdc25ec54a16ef7a1bfbecaf", "failed": true, "msg": "Aborting, target uses selinux but python bindings (libselinux-python) aren't installed!"}
```

`libselinux-python`がインストールされていないとエラーが出たので、
WEBとDBに対してインストールするようにplaybook追記します。

```
---
- hosts: all
  sudo: yes
  tasks:
    - name: add a new user
      user: name=hoge
    - name: install libselinux-python
      yum: name=libselinux-python state=latest
```

これで成功。
WEBブラウザで確認し反映されていることを確認。

[PHP](http://d.hatena.ne.jp/keyword/PHP)パッケージインストール

複数のパッケージをインストールする際、
[yum](http://d.hatena.ne.jp/keyword/yum)モジュールをを何度も書くことよりも、
インストールしたいパッケージをリスト化したほうがよいです。
nameのあとに`{{item}}`として、
`with_items`を使い、リスト化します。
これでリスト化したパッケージが一つずつ`{{item}}`に代入され
[yum](http://d.hatena.ne.jp/keyword/yum)が実行されインストールされます。

[Apache](http://d.hatena.ne.jp/keyword/Apache)再起動もplaybook上で行います。
serviceモジュールで再起動しますが、
notifyとhandlersモジュールを使い、
タスクで変更があった場合、再起動するようにします。
handlersは最後に一回だけ呼ばれるもので、
複数の箇所からnotifyで呼ばれても実行するのは最後の一回です。
また、[PHP](http://d.hatena.ne.jp/keyword/PHP)ファイルを作成し、WEBに転送して、WEBブラウザ上で表示されるか確認し、
[Apache](http://d.hatena.ne.jp/keyword/Apache)再起動されているか確認します。

```
    - name: install php packages
      yum: name={{item}} state=latest
      with_items:
        - php 
        - php-devel
        - php-mbstring
        - php-mysql
      notify:
        - restart apache
    - name: copy hello.php
      copy: src=./hello.php dest=/var/www/html/hello.php owner=vagrant
  handlers: 
    - name: restart apache
      service: name=httpd state=restarted
```

[PHP](http://d.hatena.ne.jp/keyword/PHP)のパッケージインストールと
ファイルの転送、[Apache](http://d.hatena.ne.jp/keyword/Apache)再起動が実施されています。

```
TASK [install php packages] ****************************************************
changed: [192.168.43.52] => (item=[u'php', u'php-devel', u'php-mbstring', u'php-mysql'])

TASK [copy hello.php] **********************************************************
changed: [192.168.43.52]

RUNNING HANDLER [restart apache] ***********************************************
changed: [192.168.43.52]

PLAY RECAP *********************************************************************
192.168.43.52              : ok=11   changed=3    unreachable=0    failed=0
192.168.43.53              : ok=3    changed=0    unreachable=0    failed=0
```

もう一度ansible-playbookを実行してみると
既に[PHP](http://d.hatena.ne.jp/keyword/PHP)パッケージがインストールされているので、
notifyからhandlersが呼ばれていないので、
[Apache](http://d.hatena.ne.jp/keyword/Apache)再起動されていないのが確認できます。

```
TASK [install php packages] ****************************************************
ok: [192.168.43.52] => (item=[u'php', u'php-devel', u'php-mbstring', u'php-mysql'])

TASK [copy hello.php] **********************************************************
ok: [192.168.43.52]

PLAY RECAP *********************************************************************
192.168.43.52              : ok=10   changed=0    unreachable=0    failed=0
192.168.43.53              : ok=3    changed=0    unreachable=0    failed=0
```

DBへ[MySQL](http://d.hatena.ne.jp/keyword/MySQL)をインストールします。

```
- hosts: db
  sudo: yes
  tasks: 
    - name: install mysql
      yum: name=mysql-server state=latest
    - name: start mysql and enabled
      service: name=mysqld state=started enabled=yes
```

DBで[MySQL](http://d.hatena.ne.jp/keyword/MySQL)がインストールされていることを確認

```
$ ssh db
Last login: Thu Sep  1 10:11:31 2016 from 192.168.43.51
 mysql --version
mysql  Ver 14.14 Distrib 5.1.73, for redhat-linux-gnu (x86_64) using readline 5.1
```

[MySQL](http://d.hatena.ne.jp/keyword/MySQL)データベースを作成し、ユーザを設定します。
`mysql_db`モジュールを使用します。
ユーザは`mysql_user`を使用します。
`priv`でデータベースの全てのテーブルに対し、権限を付与します。

```
    - name: create a database
      mysql_db: name=mydb state=present
    - name: create a name for mydb
      mysql_user: name=dbuser password=******** priv=mydb.*:ALL state=present
```

データベースを作るときに`python mysqldb`が必要らしいのでインストールする。

```
TASK [create a database] *******************************************************
fatal: [192.168.43.53]: FAILED! => {"changed": false, "failed": true, "msg": "the python mysqldb module is required"}
```

変数を使ってまとめてインストールします。

```
  tasks:
    - name: install mysql
      yum: name={{item}} state=latest
      with_items:
        - mysql-server
        - MySQL-python
```

DBに[SSH](http://d.hatena.ne.jp/keyword/SSH)接続してデータベースが作成されていることを確認

```
$ ssh db
Last login: Thu Sep  1 10:19:04 2016 from 192.168.43.51
$ mysql -u dbuser -p mydb
Enter password:
Welcome to the MySQL monitor.  Commands end with ; or \g.
Your MySQL connection id is 4
Server version: 5.1.73 Source distribution

Copyright (c) 2000, 2013, Oracle and/or its affiliates. All rights reserved.

Oracle is a registered trademark of Oracle Corporation and/or its
affiliates. Other names may be trademarks of their respective
owners.

Type 'help;' or '\h' for help. Type '\c' to clear the current input statement.

mysql> show databases;
+--------------------+
| Database           |
+--------------------+
| information_schema |
| mydb               |
| test               |
+--------------------+
3 rows in set (0.00 sec)

mysql> exit
Bye
```
