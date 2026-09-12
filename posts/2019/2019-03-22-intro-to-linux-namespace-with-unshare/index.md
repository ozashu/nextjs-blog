---
title: "unshareコマンドでLinuxのNamespaceに入門"
date: "2019-03-22"
---

Namespaceはコンテナで使われている技術の一つで、コンテナを理解深めるために知っておくとよいので調べてみた。
どんな使われ方をしているかというと、
例えばPID namespaceはPIDの number spaceを隔離する。
これは同じホスト上で実行されている2つのプロセスが同じPIDを持つことができるということになる。

namespaceがなくて隔離されてないとコンテナAがコンテナB、C、Dなどに
filesystemのunmountやホスト名の変更、NWインターフェースの削除など
できたりしてしまうので、必ず他のコンテナのプロセスがみれないようにする。

## Namespace

Kernel/OSのリソースで、物理リソースは制限しない(cgroupsでする)が、
以下の項目についてNamespaceを分離する。
namespaceを分離した環境では、許可されたリソースしか見えなくなるので
コンテナ内の要素だけ見えるように制限できる。

- Mount Namespace([ファイルシステム](http://d.hatena.ne.jp/keyword/%A5%D5%A5%A1%A5%A4%A5%EB%A5%B7%A5%B9%A5%C6%A5%E0)のマウントポイントを分離: Namespace 内の mount / umount が他の Namespace に影響を与えないようにする)
- UTS Namespace(ホスト名，[ドメイン](http://d.hatena.ne.jp/keyword/%A5%C9%A5%E1%A5%A4%A5%F3)名の分離)
- PID Namespace(PID 空間の分離、新しい PID Namespace では PID 1 から始まる)
- IPC Namespace([セマフォ](http://d.hatena.ne.jp/keyword/%A5%BB%A5%DE%A5%D5%A5%A9)、MQ、共有メモリなどのプロセス間通信の分離)
- User Namespace(UID、[GID](http://d.hatena.ne.jp/keyword/GID) Namespaceの分離)
- Network Namespace(インターフェース、ルーティングテーブル、ソケットなど)
- cgroup Namespace(cgroupのルート[ディレクト](http://d.hatena.ne.jp/keyword/%A5%C7%A5%A3%A5%EC%A5%AF%A5%C8)リを分離)

## cgroups

cpuやmemory、ディスクなどの物理リソース制限は
cgroupsと呼ばれる[カーネル](http://d.hatena.ne.jp/keyword/%A5%AB%A1%BC%A5%CD%A5%EB)機能で計測されアクセス制限される。
cgroupsではタスクをグループ化したり、そのグループ内のタスクに対して
以下のような物理リソースを制限できる。使用量やアクセスを制限する。

- CPU
- メモリ
- ブロックデ[バイス](http://d.hatena.ne.jp/keyword/%A5%D0%A5%A4%A5%B9)([mmap](http://d.hatena.ne.jp/keyword/mmap)可能なストレージとほぼ同義)
- ネットワーク
- /dev以下のデ[バイス](http://d.hatena.ne.jp/keyword/%A5%D0%A5%A4%A5%B9)ファイル

## unshareコマンドでNamespaceについて確認

`unshare` コマンドはparentから `unshared` されている namespaceを使用してプログラムを実行できるらしい。 `unshare` が新しいnamespace でどんなプログラムでも走らせることができるということ。実際にUTS Namespaceを例に `unshare`コマンドの動きを確認してみる。

```
    $ unshare -h
    
    Usage:
     unshare [options] <program> [<argument>...]
    
    Run a program with some namespaces unshared from the parent.
    
    オプション:
     -m, --mount               unshare mounts namespace
     -u, --uts                 unshare UTS namespace (hostname etc)
     -i, --ipc                 unshare System V IPC namespace
     -n, --net                 unshare network namespace
     -p, --pid                 unshare pid namespace
     -U, --user                unshare user namespace
     -f, --fork                fork before launching <program>
         --mount-proc[=<dir>]  mount proc filesystem first (implies --mount)
     -r, --map-root-user       map current user to root (implies --user)
         --propagation <slave|shared|private|unchanged>
                               modify mount propagation in mount namespace
     -s, --setgroups allow|deny  control the setgroups syscall in user namespaces
    
     -h, --help     display this help and exit
     -V, --version  output version information and exit
    
    For more details see unshare(1).
```

UTS Namespaceは[名前空間](http://d.hatena.ne.jp/keyword/%CC%BE%C1%B0%B6%F5%B4%D6)ごとにホスト名や[ドメイン](http://d.hatena.ne.jp/keyword/%A5%C9%A5%E1%A5%A4%A5%F3)名を独自に持つことができる。
以下で UTS Namespace を `unshare` コマンドで操作してみる。

`unshare -u /bin/sh` は`UTS名前空間を指定してunshare実行`している
これでホスト名、[ドメイン](http://d.hatena.ne.jp/keyword/%A5%C9%A5%E1%A5%A4%A5%F3)名が分離されたので、
もとのホスト名は `test-ozawa-dev01.amb-infra-dev.incvb.io` だが、
unshare で切り替え後、 `my-new-hostname` に変更している。

もちろんこのホスト名は新たな namespace だけで有効なので、
unshareで起動したシェルを終了すると、ホスト名はもとに戻る。

```
    $ sudo su       # root userになる
    # uname -n   # 現在のhostnameを確認
    test01
    # unshare -u /bin/sh  # 新しいUTS namespaceでshellを作成
    sh-4.2# hostname my-new-hostname                 # hostnameを設定
    sh-4.2# uname -n                                 # 新しいhostnameを確認
    my-new-hostname
    sh-4.2# exit                        # 新しいUTS namespaceから出る
    exit
    # uname -n   # 元のhostnameが変更されていないことを確認
    test01
```
