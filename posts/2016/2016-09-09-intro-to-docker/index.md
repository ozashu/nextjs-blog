---
title: "Docker入門"
date: "2016-09-09"
---

## Dockerとは何か。

軽量な仮想環境を実現するためのツール。
OSやアプリの設定したものをイメージ化して保存できる。
Docker環境の別のマシンにも移すことができる。

## なにをする。

Dockerがインス[トール](http://d.hatena.ne.jp/keyword/%A5%C8%A1%BC%A5%EB)されたOSを用意する。
OSやアプリが入った実行imageを実行する`docker run`
今回は実行imageはDocker Indexから取ってくる`docker pull`
実行したらContainerというものができる。
Containerで設定やアプリ、インス[トール](http://d.hatena.ne.jp/keyword/%A5%C8%A1%BC%A5%EB)したりして設定する。
そこから新しくimageを作る場合は`docker commit`
作成したimageを他のマシンで動かしたい場合は
`docker push`でimageをDocker Indexに持って行き、
移したい先のマシンで`docker pull` , `docker run`をすればよい。
imageを持ってきたらContainerができる。

## OSインス[トール](http://d.hatena.ne.jp/keyword/%A5%C8%A1%BC%A5%EB)

[Vagrantbox.es](http://www.vagrantbox.es/)から
Official [Ubuntu](http://d.hatena.ne.jp/keyword/Ubuntu) 14.04 daily Cloud Image [amd64](http://d.hatena.ne.jp/keyword/amd64) (Development release, No Guest Additions)のイメージを使用します。

## 使い方

`To use the available boxes just replace {title} and {url} with the information in the table below.`

```
$ vagrant box add {title} {url}
$ vagrant init {title}
$ vagrant up
```

なので

```
$ vagrant box add trusty64 https://cloud-images.ubuntu.com/vagrant/trusty/current/trusty-server-cloudimg-amd64-vagrant-disk1.box
$ mkdir Docker
$ cd Docker/
$ vagrant init trusty64
$ vi Vagrantfile
```

> # config.[vm](http://d.hatena.ne.jp/keyword/vm).network “private\_network”, ip: “192.168.33.10”
>
> ```
>               ↓
> ```
>
> config.[vm](http://d.hatena.ne.jp/keyword/vm).network “private\_network”, ip: “192.168.55.44”

```
$ vagrant up
$ vagrant ssh
```

[公式サイト](https://docs.docker.com/engine/installation/linux/ubuntulinux/)を参照してインス[トール](http://d.hatena.ne.jp/keyword/%A5%C8%A1%BC%A5%EB)します。

Docker1.12.1がインス[トール](http://d.hatena.ne.jp/keyword/%A5%C8%A1%BC%A5%EB)されました。

```
$ sudo docker --version
Docker version 1.12.1, build 23cf638
```

また、CentOS7にインス[トール](http://d.hatena.ne.jp/keyword/%A5%C8%A1%BC%A5%EB)するなら[yum](http://d.hatena.ne.jp/keyword/yum)で良いと思います。

```
yum -y install docker
systemctl start docker
systemctl enable docker
```

## Dockerの操作

Dockerで[centos](http://d.hatena.ne.jp/keyword/centos)のimageを`search`でDocker Indexから探してみます。
imageが見つかったら`docker pull`で引っ張ってきます。
`docker images`でimageをもってこれたことを確認しました。
imageを消すには`docker rmi`で削除できます。

```
$ sudo docker search centos |more
NAME                            DESCRIPTION                                     STARS     OFFICIAL   AUTOMATED
centos                          The official build of CentOS.                   2613      [OK]
jdeathe/centos-ssh              CentOS-6 6.8 x86_64 / CentOS-7 7.2.1511 x8...   29                   [OK]
jdeathe/centos-ssh-apache-php   CentOS-6 6.8 x86_64 / Apache / PHP / PHP M...   19                   [OK]
nimmis/java-centos              This is docker images of CentOS 7 with dif...   15                   [OK]
million12/centos-supervisor     Base CentOS-7 with supervisord launcher, h...   12                   [OK]
torusware/speedus-centos        Always updated official CentOS docker imag...   8                    [OK]
[以下略]
$ sudo docker pull centos
$ sudo docker images
REPOSITORY          TAG                 IMAGE ID            CREATED             SIZE
centos              latest              980e0e4c79ec        7 hours ago         196.7 MB
hello-world         latest              c54a2cc56cbb        9 weeks ago         1.848 kB
$ sudo docker inspect [IMAGE-ID]
$ sudo docker images
$ sudo docker rmi [IMAGE ID]
$ sudo docker images
```

[centos](http://d.hatena.ne.jp/keyword/centos)というimageを実行してContainerを作りコマンドを実行します。

```
$ sudo docker run centos echo "Hello World"
Hello World
```

Containerが作られたかを確認するために`docker ps`を実行しても確認できません。
動作が完了してしまっているので表示されませんでした。
既に完了しているContainerを確認するためには`ps -a`とします。

```
$ sudo docker ps
CONTAINER ID        IMAGE               COMMAND             CREATED             STATUS              PORTS               NAMES
$ sudo docker ps -a
CONTAINER ID        IMAGE               COMMAND                CREATED              STATUS                          PORTS               NAMES
7b88f37bfa42        centos              "echo 'Hello World'"   About a minute ago   Exited (0) About a minute ago                       compassionate_bassi
5fb7e2f68a58        hello-world         "/hello"               About an hour ago    Exited (0) About an hour ago                        amazing_kowalevski
```

最新5つのContainerを表示させるには`ps -a -n=5`です。
削除するには`rm CONTAINER ID`で削除できます。

```
vagrant@vagrant-ubuntu-trusty-64:~$ sudo docker ps -a -n=5
CONTAINER ID        IMAGE               COMMAND                CREATED             STATUS                         PORTS               NAMES
7b88f37bfa42        centos              "echo 'Hello World'"   5 minutes ago       Exited (0) 5 minutes ago                           compassionate_bassi
5fb7e2f68a58        hello-world         "/hello"               About an hour ago   Exited (0) About an hour ago                       amazing_kowalevski
vagrant@vagrant-ubuntu-trusty-64:~$ sudo docker rm 7b
7b
vagrant@vagrant-ubuntu-trusty-64:~$ sudo docker ps -a
CONTAINER ID        IMAGE               COMMAND             CREATED             STATUS                         PORTS               NAMES
5fb7e2f68a58        hello-world         "/hello"            About an hour ago   Exited (0) About an hour ago                       amazing_kowalevski
```

今度は実行中のContainerを確認してみます。
バックグラウンドで動かすには`run -d`
CONTAINER IDが出力されるので、
`logs CONTAINER ID`で実行中のタスクログを確認できる。

```
vagrant@vagrant-ubuntu-trusty-64:~$ sudo docker run -d centos free -s 3
9396f8bf834796370f781293f9effd11f4af71e45a58025dbad6f8ba133cac20
vagrant@vagrant-ubuntu-trusty-64:~$ sudo docker logs 939
              total        used        free      shared  buff/cache   available
Mem:         501712      120312      137480         736      243920      359839
Swap:             0           0           0

              total        used        free      shared  buff/cache   available
Mem:         501712      119892      137796         736      244024      360327
(以下略)
```

フォアグラウンドに持って行く時は`attach`を使います。
止めるには`Ctrl + C`

```
$ sudo docker attach --sig-proxy=false 939
```

実行中のタスクをストップするには`kill`か`stop`
再開させるには`start`

```
vagrant@vagrant-ubuntu-trusty-64:~$ sudo docker ps
CONTAINER ID        IMAGE               COMMAND             CREATED             STATUS              PORTS               NAMES
9396f8bf8347        centos              "free -s 3"         2 minutes ago       Up 2 minutes                            modest_brattain
vagrant@vagrant-ubuntu-trusty-64:~$ sudo docker stop 939
939
vagrant@vagrant-ubuntu-trusty-64:~$ sudo docker ps
CONTAINER ID        IMAGE               COMMAND             CREATED             STATUS              PORTS               NAMES
vagrant@vagrant-ubuntu-trusty-64:~$ sudo docker ps -a
CONTAINER ID        IMAGE               COMMAND             CREATED             STATUS                        PORTS               NAMES
9396f8bf8347        centos              "free -s 3"         2 minutes ago       Exited (137) 12 seconds ago                       modest_brattain
5fb7e2f68a58        hello-world         "/hello"            2 hours ago         Exited (0) 2 hours ago                            amazing_kowalevski
vagrant@vagrant-ubuntu-trusty-64:~$ sudo docker start 939
939
vagrant@vagrant-ubuntu-trusty-64:~$ sudo docker ps -a
CONTAINER ID        IMAGE               COMMAND             CREATED             STATUS                   PORTS               NAMES
9396f8bf8347        centos              "free -s 3"         3 minutes ago       Up 2 seconds                                 modest_brattain
5fb7e2f68a58        hello-world         "/hello"            2 hours ago         Exited (0) 2 hours ago                       amazing_kowalevski
```

Containerに変更して、imageを作成する
まずは`-i`で[インタラクティブ](http://d.hatena.ne.jp/keyword/%A5%A4%A5%F3%A5%BF%A5%E9%A5%AF%A5%C6%A5%A3%A5%D6)モードにし、
`-t`でターミナルを立ち上げ、
imageを指定、
[bash](http://d.hatena.ne.jp/keyword/bash)を指定してシェルを立ち上げContainerに入ります。

Containerに入れたので`/home`配下に移動して`test.txt`を作成してみます。

```
$ sudo docker run -i -t centos /bin/bash
# ll
total 68
-rw-r--r--   1 root root 18307 Sep  6 14:02 anaconda-post.log
lrwxrwxrwx   1 root root     7 Sep  6 13:59 bin -> usr/bin
drwxr-xr-x   5 root root   380 Sep  7 20:23 dev
drwxr-xr-x  48 root root  4096 Sep  7 20:23 etc
drwxr-xr-x   2 root root  4096 Aug 12  2015 home
lrwxrwxrwx   1 root root     7 Sep  6 13:59 lib -> usr/lib
lrwxrwxrwx   1 root root     9 Sep  6 13:59 lib64 -> usr/lib64
drwx------   2 root root  4096 Sep  6 13:59 lost+found
drwxr-xr-x   2 root root  4096 Aug 12  2015 media
drwxr-xr-x   2 root root  4096 Aug 12  2015 mnt
drwxr-xr-x   2 root root  4096 Aug 12  2015 opt
dr-xr-xr-x 111 root root     0 Sep  7 20:23 proc
dr-xr-x---   2 root root  4096 Sep  6 14:02 root
drwxr-xr-x  10 root root  4096 Sep  6 14:02 run
lrwxrwxrwx   1 root root     8 Sep  6 13:59 sbin -> usr/sbin
drwxr-xr-x   2 root root  4096 Aug 12  2015 srv
dr-xr-xr-x  13 root root     0 Sep  7 20:23 sys
drwxrwxrwt   7 root root  4096 Sep  6 14:02 tmp
drwxr-xr-x  13 root root  4096 Sep  6 13:59 usr
drwxr-xr-x  18 root root  4096 Sep  6 14:02 var
# cd home/
# ll
total 0
# touch test.txt
# ll
total 0
-rw-r--r-- 1 root root 0 Sep  7 20:23 test.txt
```

Containerから抜けたら`ps -a`でContainerを確認します。
先ほどできたContainerがあるので、IDを指定してimageを作ります。
`docker commit`で作成できます。「username/任意の名前」でimageの名前をつけます。
今回では「[hoge](http://d.hatena.ne.jp/keyword/hoge)/test」としました。
`sudo docker images`でimageが作成されたことを確認します。
`hoge/test`が作成されています。これを元にContainerを作成します。
`sudo docker run -i -t hoge/test /bin/bash`でContainerに入り、
`test.txt`があることを確認。
これでContainerからimageを作成することができました。

```
# exit
~$ sudo docker ps -a
CONTAINER ID        IMAGE               COMMAND             CREATED              STATUS                      PORTS               NAMES
35695d6c9cef        centos              "/bin/bash"         About a minute ago   Exited (0) 26 seconds ago                       kickass_euclid
9396f8bf8347        centos              "free -s 3"         15 hours ago         Up 15 hours                                     modest_brattain
5fb7e2f68a58        hello-world         "/hello"            17 hours ago         Exited (0) 17 hours ago                         amazing_kowalevski
~$ sudo docker commit 356 hoge/test
sha256:c44f82ed12cc43c6b9a24256b0a99f62e69e9ac75ead52e9035f58214904511e
~$ sudo docker images
REPOSITORY          TAG                 IMAGE ID            CREATED             SIZE
hoge/test           latest              c44f82ed12cc        8 seconds ago       196.7 MB
centos              latest              980e0e4c79ec        23 hours ago        196.7 MB
hello-world         latest              c54a2cc56cbb        9 weeks ago         1.848 kB
~$ sudo docker run -i -t hoge/test /bin/bash
# cd home/
# ll
total 0
-rw-r--r-- 1 root root 0 Sep  7 20:23 test.txt
```

- Dockerコマンドのライフサイクルに関わる動作

| サブコマンド | 意味 | 実行後の状態 |
| --- | --- | --- |
| run | デプロイ・起動 | 起動が成功したら稼働中/失敗したら停止中 |
| stop | 稼働中のDockerコンテナを停止 | 停止が成功したら停止中 |
| start | 停止中のDockerコンテナを起動 | 起動が成功したら稼働中 |
| rm | デプロイしたDockerコンテナを削除 | 存在しなくなる(startできなくなる) |

- Dockerコンテナの操作

| サブコマンド | 意味 |
| --- | --- |
| exec | 稼働中のコンテナでコマンドを実行 |
| logs | コンテナのログ(標準出力、[標準エラー出力](http://d.hatena.ne.jp/keyword/%C9%B8%BD%E0%A5%A8%A5%E9%A1%BC%BD%D0%CE%CF))をする |
| inspect | コンテナ/イメージの詳細情報を表示 |

- Dockerイメージ操作のコマンド

| サブコマンド | 意味 |
| --- | --- |
| images | DockeデーモンにあるDockerイメージ一覧を表示する |
| [rmi](http://d.hatena.ne.jp/keyword/rmi) | DockerデーモンにあるDockerイメージを削除する |

## Dockerfile

`docker build`
imageから新しいimage作成の自動化
自動化の[スクリプト](http://d.hatena.ne.jp/keyword/%A5%B9%A5%AF%A5%EA%A5%D7%A5%C8)がDockerfile

Dockerfileを作成

```
vagrant@vagrant-ubuntu-trusty-64:~$ vi Dockerfile
```

`FROM`で何のイメージを元にするか指定します。
`MAINTAINER`で誰が書いたか記述します。
名前とメールアドレスを書いておきます。
コメントは`#`です。
今回コマンド2つ指定します。
`RUN`はbuildされるときに実行されるもの。
色んな物をインス[トール](http://d.hatena.ne.jp/keyword/%A5%C8%A1%BC%A5%EB)したりすることができます。
今回はインス[トール](http://d.hatena.ne.jp/keyword/%A5%C8%A1%BC%A5%EB)ではなく、`now building...`とだけ表示させます。
`CMD`はbuildされたimageを元に、runするときに実行されるもの。
(imageからContainerを作るときのこと)
書き方は実行したいものを`,`で区切り、`[]`で囲みます。

```
FROM centos
MAINTAINER FirstName LastName <email address>
# RUN: build時に実行
RUN echo "new building..."
# CMD: run時に実行
# CMD: echo "now runnning..."
CMD ["echo", "new running..."]
```

`build`をしてみます。
`sudo docker build`に新しいimageの名前をつけます。
`-t hoge/test2`とします。
カレント[ディレクト](http://d.hatena.ne.jp/keyword/%A5%C7%A5%A3%A5%EC%A5%AF%A5%C8)リにあるDockerfileを使うので`.`をつけます。
実行すると`now building...`と出力されているのが確認できました。

```
vagrant@vagrant-ubuntu-trusty-64:~$ sudo docker build -t hoge/test2 .
Sending build context to Docker daemon 13.31 kB
Step 1 : FROM centos
 ---> 980e0e4c79ec
Step 2 : MAINTAINER Gen dockerid <mailaddress>
 ---> Running in f506910e9ee7
 ---> b1af5b08522a
Removing intermediate container f506910e9ee7
Step 3 : RUN echo "new building..."
 ---> Running in b9c7c9ec39a1
new building...
 ---> feb31b681b6d
Removing intermediate container b9c7c9ec39a1
Step 4 : CMD echo new running...
 ---> Running in 858b8d74a51f
 ---> a646d9c9c705
Removing intermediate container 858b8d74a51f
Successfully built a646d9c9c705
```

`sudo docker images`を実行して、`hoge/test2`があることを確認できました。
実行すると`new running...`と出力されることが確認できます。

```
vagrant@vagrant-ubuntu-trusty-64:~$ sudo docker images
REPOSITORY          TAG                 IMAGE ID            CREATED             SIZE
hoge/test2          latest              a646d9c9c705        12 seconds ago      196.7 MB
hoge/test           latest              c44f82ed12cc        About an hour ago   196.7 MB
centos              latest              980e0e4c79ec        24 hours ago        196.7 MB
hello-world         latest              c54a2cc56cbb        9 weeks ago         1.848 kB
vagrant@vagrant-ubuntu-trusty-64:~$ sudo docker run hoge/test2
new running...
```

次はインス[トール](http://d.hatena.ne.jp/keyword/%A5%C8%A1%BC%A5%EB)を試してみます。

[Apache](http://d.hatena.ne.jp/keyword/Apache)インス[トール](http://d.hatena.ne.jp/keyword/%A5%C8%A1%BC%A5%EB)するVagrantfileを書きます

build時にRUNでインス[トール](http://d.hatena.ne.jp/keyword/%A5%C8%A1%BC%A5%EB)させます。
imagesの中にファイルを取り込むには`ADD`を使います。
index.htmlを`/var/www/html/`にコピーします。
`EXPOSE`で80番ポートを開けます。
`run`の時に実行するコマンドを
`CMD ["/usr/sbin/httpd", "-D", "FOREGROUND"]`とします。
※ index.htmlは`Hello World!`という内容で作りました。

```
FROM centos
MAINTAINER Gen docker id <mailaddress>
RUN yum -y install httpd
ADD ./index.html /var/www/html/
EXPOSE 80
CMD ["/usr/sbin/httpd", "-D", "FOREGROUND"]
# CMD ["/usr/sbin/httpd", "-DFOREGROUND"] でもOK
```

`build`でインス[トール](http://d.hatena.ne.jp/keyword/%A5%C8%A1%BC%A5%EB)します。

```
$ sudo docker build -t hoge/httpd .
```

ホスト側の8080番ポートをContainer側の80番ポートにリダイレクトさせ、
バックグラウンドで走らせます。
`run`を実行するとContainerの[httpd](http://d.hatena.ne.jp/keyword/httpd)が立ち上がります。

```
$ sudo docker run -p 8080:80 -d hoge/httpd
e23a0bb40467f42650d9dc33dbd77f1927efe7b828d1bb2ba2f18d957a04cf44
```

Containerの[httpd](http://d.hatena.ne.jp/keyword/httpd)が立ち上がっているのを確認。

```
$ sudo docker ps
CONTAINER ID        IMAGE               COMMAND                  CREATED             STATUS              PORTS                  NAMES
e23a0bb40467        hoge/httpd          "/usr/sbin/httpd -D F"   14 seconds ago      Up 13 seconds       0.0.0.0:8080->80/tcp   nauseous_einstein
```

`http://192.168.55.44:8080/`にWEBブラウザでアクセスすると
`Hello World!`が表示されました！

docker hubにコンソールからログインします。
Docker Hubにimageをpushします。

```
~$ sudo docker login
Login with your Docker ID to push and pull images from Docker Hub. If you don't have a Docker ID, head over to https://hub.docker.com to create one.
Username: hoge
Password:

▽
Login Succeeded
~$ sudo docker push hoge/httpd
```

ブラウザで、Docker HUBにログインして
Repositoryのところに、`hoge/httpd`があることを確認
