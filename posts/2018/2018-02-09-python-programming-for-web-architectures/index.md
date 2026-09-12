---
title: "Python Programming for Web Architectures"
date: "2018-02-09"
---

タイトルをかっこよくしてみた。
最近PyQなるものを初めて[Python](http://d.hatena.ne.jp/keyword/Python)の書き方を覚えているのですが、
様々なライブラリがあることを知り、簡単な[TCP](http://d.hatena.ne.jp/keyword/TCP)サーバが書けることを知りました。

普段は[Webサービス](http://d.hatena.ne.jp/keyword/Web%A5%B5%A1%BC%A5%D3%A5%B9)のサーバ管理をしていますが、
[TCP/IP](http://d.hatena.ne.jp/keyword/TCP/IP)の通信をクライアントーサーバ間でどのような処理でされているのか、
IPやPortってどんな役割を果たしているのかなど実装を通じて学んでみました。

他にも[Apache](http://d.hatena.ne.jp/keyword/Apache)などのWebサーバはpreforkモデルですが、
preforkってどんな処理なのか、Nginxが解決するC10K問題って何かなども
Webサーバ[アーキテクチャ](http://d.hatena.ne.jp/keyword/%A5%A2%A1%BC%A5%AD%A5%C6%A5%AF%A5%C1%A5%E3)のおさらいもしようと思います。

主に以下をパクリもとい参考にしています。
なので本記事を読まなくてもいいので、以下の記事や本だけでも読んでみて下さい。
[2015年Webサーバアーキテクチャ序論](http://blog.yuuk.io/entry/2015-webserver-architecture#%E3%83%9E%E3%83%AB%E3%83%81%E3%82%B9%E3%83%AC%E3%83%83%E3%83%89%E3%83%A2%E3%83%87%E3%83%AB)
[process-book](http://shinpeim.github.io/process-book/)
[Learning Python Network Programming](https://www.packtpub.com/networking-and-servers/learning-python-network-programming)

イベント駆動モデルはわからんので断念してます。

## IP,Portそしてsocket

socketはエンティティがプロセス間通信を実行できる仮想エンドポイントで、
仮想エンドポイントを識別するために必要になるのが、IPとPort番号になる。
[IPアドレス](http://d.hatena.ne.jp/keyword/IP%A5%A2%A5%C9%A5%EC%A5%B9)でホストがわかるけど、[TCP](http://d.hatena.ne.jp/keyword/TCP)/[UDP](http://d.hatena.ne.jp/keyword/UDP)通信でどのプロセスと通信をするのか決めるために
Port番号が必要になる。

`ss`,`netstat`,`lsof`コマンドで、何気なくどのポートがなんのプロセスか、
どのプロセスがファイルを掴んでいるのかなど確認していましたが、
socket通信を理解すると、コマンドの確認結果の理解に繋がります。

## 3WAYハンドシェイク

[TCP](http://d.hatena.ne.jp/keyword/TCP)と[UDP](http://d.hatena.ne.jp/keyword/UDP)通信ですが、ここでは[TCP](http://d.hatena.ne.jp/keyword/TCP)通信について取り上げます。
クライアントとサーバーの間の3WAYハンドシェイクプロセスによって[TCP](http://d.hatena.ne.jp/keyword/TCP)接続を確立します。
SYN→SYN/ACK→ACKのやつですね。

[TCP](http://d.hatena.ne.jp/keyword/TCP)コネクションの図や[TCP](http://d.hatena.ne.jp/keyword/TCP) jokeなどをみると理解が深まります。

[TCP](http://d.hatena.ne.jp/keyword/TCP)サーバのリスニング接続を設定[Python](http://d.hatena.ne.jp/keyword/Python)の関数create\_listen\_socket()として書いてみます。

```
def create_listen_socket(host, port):
    """ サーバーが接続要求を受け取るソケットを設定する """
    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM) # アドレスファミリー、ソケットタイプ、プロトコル番号を指定して新しいソケットを作成
    sock.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    sock.bind((host, port))
    sock.listen(100)
    return sock
```

## クライアントとサーバ間のメッセージのやりとりの例(ユニキャスト通信)

メッセージをsocketから受信するための関数をrecv\_msg()関数として以下に定義しました。

```
def recv_msg(sock):
    """ データがソケットに到着するのを待ってから、メッセージの区切り文字として '¥0'を使用してメッセージに解析する """
    data = bytearray() # 新しいバイト配列を返す。
    msg = ''　
    # ソケットから4096バイトを繰り返し読み込み、デリミタが表示されるまでバイトをデータに格納する
    while not msg:
        recvd = sock.recv(4096) # ソケットからデータを受信し、結果を bytes オブジェクトで返します。一度に受信するデータは、4096bufsize
        if not recvd:
            # ソケットが途中で閉じられたら
            raise ConnectionError()
        data = data + recvd
        if b'\0' in recvd:
            # b '\ 0'をメッセージの区切り文字にする
            msg = data.rstrip(b'\0')
    msg = msg.decode('utf-8') #バイト型から文字列型へデコード
    return msg
```

メッセージの受信を待っている間にプログラムが必要とするものは何もないので、この関数はメッセージ全体を受信するまでループ内でsocket.recv()を呼び出します。
nullバイトを受け取ったかどうかを見るために繰り返しデータをチェックし、うけとったら、null バイトを取り除き、[UTF-8](http://d.hatena.ne.jp/keyword/UTF-8)からデコードして受信データを返します。

最後にsend\_msg()関数とprep\_msg())関数を作成しました。
これはメッセージにnullバイトの区切り文字をつけるのと、[UTF-8](http://d.hatena.ne.jp/keyword/UTF-8)[エンコーディング](http://d.hatena.ne.jp/keyword/%A5%A8%A5%F3%A5%B3%A1%BC%A5%C7%A5%A3%A5%F3%A5%B0)して送信するための関数です。

```
def prep_msg(msg):
    """ メッセージとして送信する文字列を準備する """
    msg += '\0'
    return msg.encode('utf-8') # 文字列をバイト型へエンコード
def send_msg(sock, msg):
    """ 文字列をソケットに送信する準備 """
    data = prep_msg(msg)
    sock.sendall(data)
```

さきほど書いた関数をモジュールとして、
新たにメッセージを受けるサーバの[スニペット](http://d.hatena.ne.jp/keyword/%A5%B9%A5%CB%A5%DA%A5%C3%A5%C8)を以下のように定義して書きました。

```
def handle_client(sock, addr):
    """ sockを通じてclientからデータを受けとり,echoを返す """
    try:
        msg = chatmodule.recv_msg(sock) # messageを完全に受信するまでblockする
        print('{}: {}'.format(addr, msg))
        chatmodule.send_msg(sock, msg) # 送信するまでblock
    except (ConnectionError, BrokenPipeError):   # ConnectionError のサブクラスで、もう一方の端が閉じられたパイプに書き込こもうとするか、書き込みのためにシャットダウンされたソケットに書き込こもうとした場合に発生。
         print('Socket error')
    finally:
        print('Closed connection to {}'.format(addr))
        sock.close()

if __name__ == '__main__':

    listen_sock = chatmodule.create_listen_socket(HOST, PORT)
    addr = listen_sock.getsockname() # ソケット自身のアドレスを返します。この関数は、IPv4/v6ソケットのポート番号を調べる場合などに使用。
    print('Listening on {}'.format(addr))

    while True:
        client_sock, addr = listen_sock.accept()
        print('Connection from {}'.format(addr))
        handle_client(client_sock, addr)
```

最初に、listen\_sockをcreate\_listen\_socket()呼び出して定義します。
次に、クライアントからの接続要求を永久にlistenし、listen\_sock.accept()をブロックするmainループに入ります。
クライアント接続が開始されると、[プロトコル](http://d.hatena.ne.jp/keyword/%A5%D7%A5%ED%A5%C8%A5%B3%A5%EB)に従ってクライアントを処理するhandle\_client()関数が呼び出されます。
部分的にメインループを整理し、この一連の操作を再利用できるように別の関数にしました。
これでサーバー側の処理が書けたので、次はクライアント側です。

クライアントの[スニペット](http://d.hatena.ne.jp/keyword/%A5%B9%A5%CB%A5%DA%A5%C3%A5%C8)も以下に書きました。
mainループでしていることはメッセージとして`q`を入力してクライアントを終了するまで永遠にループさせています。
メインループ内では、まずサーバーへの接続を作成をして、次に、ユーザーにプロンプ​​トを表示します。
送信するメッセージを入力すると、上で書いたsend\_msg()関数を使ってメッセージが送信されます。
その後、サーバーの応答を待ちます。応答がきたら、それを出力します。
クライアントとサーバがこれで書けますので、参考にしてみて下さい。

```
if __name__ == '__main__':

    while True:
        try:
            sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            sock.connect((HOST, PORT))
            print('\nConnected to {}:{}'.format(HOST, PORT))
            print("Type message, enter to send, 'q' to quit")
            msg = input()

            if msg == 'q': break
            chatmodule.send_msg(sock, msg) # 送信するまでBlock
            print('Sent message: {}'.format(msg))
            msg = chatmodule.recv_msg(sock) # messageを完全に受信するまでBlock
            print('Received echo: ' + msg)

        except ConnectionError:
            print('Socket error')
            break
        finally:
            sock.close()
            print('Closed connection to server\n')
```

クライアントとサーバのソケット通信の動きをまとめると

1. サーバはsocket、bind、listenでクライアントの接続を待ち受ける
2. 接続きたらacceptにより実際のデータの読み出しまで待つ。
3. データがきたら、リク[エス](http://d.hatena.ne.jp/keyword/%A5%A8%A5%B9)トを処理して、クライアントにレスポンスを返す。
4. クライアントとの接続をcloseで閉じて、またaccept待ち状態になりライアントからの接続をLISTENする。

これでクライアントとサーバのソケット通信がsocket、bind、listenを使用して理解できたと思います。
ただ、実行するとわかりますが、ひとつのクライアントからのリク[エス](http://d.hatena.ne.jp/keyword/%A5%A8%A5%B9)トしか処理できません。
クライアントからの接続を accept したあとは、ループを抜けるまでは新規のクライアント接続をブロックしてしまいます。

1:1の通信なのでユニキャスト通信です。
WEBサーバ[アーキテクチャ](http://d.hatena.ne.jp/keyword/%A5%A2%A1%BC%A5%AD%A5%C6%A5%AF%A5%C1%A5%E3)としてはシリアルモデルと言われるものになります。
[Apache](http://d.hatena.ne.jp/keyword/Apache)は複数のユーザからのリク[エス](http://d.hatena.ne.jp/keyword/%A5%A8%A5%B9)トにレスポンスを返せるのはなぜでしょうか、
複数のプロセスがリク[エス](http://d.hatena.ne.jp/keyword/%A5%A8%A5%B9)トを返しているからですね。
それでは次はマルチ[プロセスモデル](http://d.hatena.ne.jp/keyword/%A5%D7%A5%ED%A5%BB%A5%B9%A5%E2%A5%C7%A5%EB)をみていきましょう。

## マルチ[プロセスモデル](http://d.hatena.ne.jp/keyword/%A5%D7%A5%ED%A5%BB%A5%B9%A5%E2%A5%C7%A5%EB)

プロセスをforkして子プロセス子プロセスにリク[エス](http://d.hatena.ne.jp/keyword/%A5%A8%A5%B9)ト処理を任せるモデルです。
forkはプロセスをコピーするのでリソースを使い重いと言われますが、
しかし、Copy On Write(Cow)という仕組みで、差分のみをコピーするため実際にはそこまでリソースを使いません。
ただCoWでメモリコピー負荷が抑えられていますが、リク[エス](http://d.hatena.ne.jp/keyword/%A5%A8%A5%B9)ト毎にforkが発生するとリソースが使われますので
事前にforkさせておくのがpreforkモデルです。
事前に一定[数の子](http://d.hatena.ne.jp/keyword/%BF%F4%A4%CE%BB%D2)プロセスをforkして、それらを使いまわす(MaxRequestsPerChildなど)ことで、リク[エス](http://d.hatena.ne.jp/keyword/%A5%A8%A5%B9)ト毎にforkをしなくてすみます。

また、マルチ[プロセスモデル](http://d.hatena.ne.jp/keyword/%A5%D7%A5%ED%A5%BB%A5%B9%A5%E2%A5%C7%A5%EB)は、プロセス間通信が必要なのでforkによるパフォーマンスが低下する可能性がありますが、
メモリを共有していないということは、コード内で競合状態が発生しないのでロックなどを気にしなくてすむので、処理を書くのが簡単になります。

今回はaccept()したあとの処理をプロセスで行いました。workerモデルと呼ばれるものです。
acceptしたプロセスからworkerプロセスにsocket接続を引き渡しますので
[コンテキストスイッチ](http://d.hatena.ne.jp/keyword/%A5%B3%A5%F3%A5%C6%A5%AD%A5%B9%A5%C8%A5%B9%A5%A4%A5%C3%A5%C1)の負荷がかかってしまいます。

```
while True:
    client_sock,addr = listen_sock.accept()
    proc = Process(target=handle_client,
                       args=[client_sock, addr])
    proc.start()
    print('Connection from {}'.format(addr))
    proc.join(1)
```

ちなみにpreforkモデルはaccept()からclose()までの処理を各プロセスにやらせます。
accept()からclose()までの処理がシンプルに書けます。
(ただ自分は上手く書けなかったので、だれか実装例を教えてほしい)

デメリットは同時接続数がプロセスの数ということです。
同時接続数が子プロセスの数を超えると、accept()がされないので、接続は未処理となり詰まります。

[Python multiprocessing 備忘録](http://note.crohaco.net/2017/python-multiprocessing/2/)

## マルチスレッドモデル

マルチスレッドのとマルチプロセスの違いはなんでしょうか。
基本的には同じでスレッドにはリク[エス](http://d.hatena.ne.jp/keyword/%A5%A8%A5%B9)トごとにスレッドを生成する1コネクション1スレッドのモデルと、
事前にスレッドをPoolしておくモデル（スレッドプール）があります。
スレッドの利点としてプロセスと比較した場合のメモリ占有量は軽量と言われています。
スレッドはリソースを共有しているため、複数のスレッド間で通信が可能で異なるメモリアドレスを読み書きすることができますが、
2つのスレッドがメモリを共有し始め、スレッドの実行順序を保証する方法がない場合は、間違った値を返したり、システム全体がクラッシュしたりする可能性があります。

```
if __name__ == '__main__':
    listen_sock = chatmodule.create_listen_socket(HOST, PORT)
    addr = listen_sock.getsockname()
    print('Listening on {}'.format(addr))
    while True:
        client_sock,addr = listen_sock.accept()
        # Thread は自動的にhandle_client()関数を実行し、同時にこのwhile loopを実行
        thread = threading.Thread(target=handle_client,
                                  args=[client_sock, addr],
                                  daemon=True)
        thread.start()
        print('Connection from {}'.format(addr))
```

接続するクライアントごとに、handle\_client()関数を実行するだけの新しいスレッドを作成されます。
スレッドが受信または送信時にブロックすると、OSは他のスレッドをチェックして、
それらが[ブロッキング](http://d.hatena.ne.jp/keyword/%A5%D6%A5%ED%A5%C3%A5%AD%A5%F3%A5%B0)状態から抜けたかどうかを確認し、存在する場合はそのスレッドの1つに切り替えます。
スレッドコンスト[ラク](http://d.hatena.ne.jp/keyword/%A5%E9%A5%AF)タ呼び出しの[daemon](http://d.hatena.ne.jp/keyword/daemon)引数をTrueに設定しました。
ctrl-cでプログラムを終了できますが、明示的にすべてのスレッドを閉じる必要はありません。
複数のクライアントでこのエコーサーバーを試すと、メッセージを接続して送信する2番目のクライアントがすぐに応答を受け取るのがわかります。

キューやロックの処理はチャットサーバなどを実装するとわかると思います。
(ただ自分は上手く書けなかったので、だれか実装例を教えてほしい)

[マルチスレッドのコンテキスト切り替えに伴うコスト](http://d.hatena.ne.jp/naoya/20071010/1192040413)
[スレッドセーフ](https://ja.wikipedia.org/wiki/%E3%82%B9%E3%83%AC%E3%83%83%E3%83%89%E3%82%BB%E3%83%BC%E3%83%95)

# C10K問題

インターネットが発展してWebサーバーが同時に1万のクライアントを処理する時代になり、
マルチプロセス/スレッドではこの問題が解決できません。
解決策として、イベント駆動[アーキテクチャ](http://d.hatena.ne.jp/keyword/%A5%A2%A1%BC%A5%AD%A5%C6%A5%AF%A5%C1%A5%E3)であるNginxが誕生しました。
Nginxが目指すものはイベントループで1つのスレッドで数万の同時接続を処理することです。

しかし、全てがイベント駆動で解決するというわけではなく、マルチスレッド・アプローチで解決できたり、
他にはスケーリングの問題としてもC10Kは使われます。

また、アーバン・エアーシップ社が単一のノードで500.000件の同時接続。
C500k問題に直面した模様。
膨大な数のモバイルデ[バイス](http://d.hatena.ne.jp/keyword/%A5%D0%A5%A4%A5%B9)に通知サービスを提供するには、非常に多くのアイドル接続を並行して処理する必要があります。

今は、1000万の同時接続である「C10Mの問題」に直面しています。
このようなものは大規模分散システムの領域でしょうか。
いろんな[アーキテクチャ](http://d.hatena.ne.jp/keyword/%A5%A2%A1%BC%A5%AD%A5%C6%A5%AF%A5%C1%A5%E3)を組み合わせないと解決できなそうですね。
これらの知識についても勉強したいです。

[TCP/IP - Solving the C10K with the thread per client approach](https://stackoverflow.com/questions/17593699/tcp-ip-solving-the-c10k-with-the-thread-per-client-approach)
[C500k in Action at Urban Airship](https://www.urbanairship.com/blog/c500k-in-action-at-urban-airship)
[C10M](http://c10m.robertgraham.com/p/about-this-site.html)

## イベント駆動型サーバー[アーキテクチャ](http://d.hatena.ne.jp/keyword/%A5%A2%A1%BC%A5%AD%A5%C6%A5%AF%A5%C1%A5%E3)

1プロセス/スレッドでは同時に複数のブロック処理を扱えないため、
新たにプロセスやスレッドを生成し処理をさせていましたね。

イベント駆動ではイベントループで一のスレッドを複数の接続に[マッピング](http://d.hatena.ne.jp/keyword/%A5%DE%A5%C3%A5%D4%A5%F3%A5%B0)させて
接続、リク[エス](http://d.hatena.ne.jp/keyword/%A5%A8%A5%B9)トの入出力操作から発生したすべてのイベントを処理させます。
新しいイベントがキューに入れられ、スレッドはいわゆるイベントループを実行します。
キューからイベントをdequeueしてイベントを処理し、次のイベントを取得するか、新しいイベントがプッシュされるのを待ちます。
したがって、スレッドによって実行される作業は、複数の接続を単一の実行フローに多重化するスケジューラの作業と非常に似ています。
次のスライドを参考になりそうです。

[イベント駆動プログラミングとI/O多重化](https://www.slideshare.net/mizzy/io-18459625)

イベント駆動型サーバー[アーキテクチャ](http://d.hatena.ne.jp/keyword/%A5%A2%A1%BC%A5%AD%A5%C6%A5%AF%A5%C1%A5%E3)は[Python](http://d.hatena.ne.jp/keyword/Python)で
イベント駆動型プログラミングを書かないと理解が深まりそうにないので
次回は以下を調べてみようと思います。
(だれか参考になる実装例や説明教えてください)

- イベント駆動型プログラミング
  - それは何であり、どのように機能するのですか？
- asyncioモジュール
- asyncioベースのプログラミング
- Twisted
- Gevent

# オブジェクト、メソッドまとめ

```
Socket family:socket.AF_INET＝アドレス (およびプロトコル) ファミリーを示す定数で、 socket() の 最初の引数に指定することができます。
Socket type:ソケットの種類を指定します。SOCK_STREAMとSOCK_DGRAMをそれぞれ指定すると、TCPベースのソケットとUDPベースのソケットが作成されます。
socket.bind(address):ソケットを address にbindします。
socket.listen([backlog]):サーバーを有効にして、接続を受け付けるようにします。backlog が指定されている場合、少なくとも 0 以上でなければなりません (それより低い場合、0 に設定されます)。システムが新しい接続を拒否するまでに許可する未受付の接続の数を指定します。指定しない場合、デフォルトの妥当な値が選択されます。バージョン3.5 で backlogの引数が任意になりました。
socket.setsockopt(level, optname, None, optlen: int)
level:SOL_SOCKET:level パラメータは、オプションのプロトコルレベルを指定します。オプションをソケットレベルで取得するには level パラメータに SOL_SOCKET を指定します。
TCP のようなそれ以外のレベルの場合、そのレベルのプロトコル番号を指定します。
フラグ:SO_REUSEADDR フラグは、 TIME_WAIT 状態にあるローカルソケットをそのタイムアウト期限が自然に切れるのを待つことなく再利用することをカーネルに伝えます。
socket.listen:サーバーを有効にして、接続を受け付けるようにします。backlog が指定されている場合、少なくとも 0 以上でなければなりません (それより低い場合、0 に設定されます)。システムが新しい接続を拒否するまでに許可する未受付の接続の数を指定します。指定しない場合、デフォルトの妥当な値が選択されます。バージョン 3.5 で変更: backlog 引数が任意になりました。
socket.sendall(bytes[, flags]):ソケットにデータを送信します。ソケットはリモートソケットに接続済みでなければなりません。オプション引数 flags の意味は、上記 recv() と同じです。
send() と異なり、このメソッドは bytes の全データを送信するか、エラーが発生するまで処理を継続します。
正常終了の場合は None を返し、エラー発生時には例外が発生します。
エラー発生時、送信されたバイト数を調べる事はできません。
バージョン 3.5 で変更: ソケットのタイムアウトは、データが正常に送信される度にリセットされなくなりました。
ソケットのタイムアウトは、すべてのデータを送る最大の合計時間となります。
システムコールが中断されシグナルハンドラが例外を送出しなかった場合、
このメソッドは InterruptedError 例外を送出する代わりにシステムコールを再試行するようになりました (論拠については PEP 475 を参照してください)。
socket.accept:接続を受け付けます。ソケットはアドレスにbind済みで、listen中である必要があります。戻り値は (conn, address) のペアで、 conn は接続を通じてデータの送受信を行うための 新しい ソケットオブジェクト、 address は接続先でソケットにbindしているアドレスを示します。新たに作成されたソケットは 継承不可 です。システムコールが中断されシグナルハンドラが例外を送出しなかった場合、このメソッドは InterruptedError 例外を送出する代わりにシステムコールを再試行するようになりました (論拠については PEP 475 を参照してください)。
```
