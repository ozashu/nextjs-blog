---
title: "７月のテックの祭典"
date: "2016-07-29"
---

前日にPokemonGoMapに消耗して徹夜で行きました。
終日立っていたのでところどころ聞けていなかったです。
[ユニー](http://d.hatena.ne.jp/keyword/%A5%E6%A5%CB%A1%BC)クなのが会場がPokemonGOのポケステーションで
イベント中はずっとルアーモジュールが使用されていました。
おかげで[ミニリュウ](http://d.hatena.ne.jp/keyword/%A5%DF%A5%CB%A5%EA%A5%E5%A5%A6)と[カモネギ](http://d.hatena.ne.jp/keyword/%A5%AB%A5%E2%A5%CD%A5%AE)を捕まえることができましたので、
運営には感謝。

- 基調講演
- 現実が正解だ！ やってみんとわからんことだらけ。 さくらのIoT企画・開発365日の軌跡。そして、次の365日へ。

さくらのIoT Platformの立ち上げに奔走したこの1年を、
チームビルディングという観点で紹介されていました。

あとブースでさくら[クラウド](http://d.hatena.ne.jp/keyword/%A5%AF%A5%E9%A5%A6%A5%C9)２万円クーポンありがとうございました。

- Wantedly の文化を支えるインフラとビジネスの変化に強いインフラ

ブースに座ったまま聞けたので、最高でした。
このセッション聞けて満足して午前が終わりました。
Wantedlyのインフラチームはコードを書いて問題解決をしている。
憧れていた仕事はこういうものだったと気づいたセッションでした。
会社のポジションを気にしていたけど、どういう仕事をしたかったのかを
気づかせてくれたし、今後の[生存戦略](http://d.hatena.ne.jp/keyword/%C0%B8%C2%B8%C0%EF%CE%AC)の方針が決まってきた感じがありました。
今年一年でコードをかけるインフラエンジニアになって、そういう仕事ができる
場所にいけるようやっていきが高まったセッションでした。
帰宅してから、Wantedly Tech Bookは買って読んでいます。

具体的なセッション内容は、
やぱちーでも聞いたCode Wins Argumentsの紹介から、
WantedlyでのUser Firstのお話と、Simple is Not Easyであることのおはなし。
Wantedlyの社員数と売上のグラフをみましたが、伸びかたがすごかったです。
これがグロースというものなのかと思いました。
XaaSと[AWS](http://d.hatena.ne.jp/keyword/AWS)の両方を使い、利用できるものはどんどん利用する。
HerokuやRedisやFirebaseと[AWS](http://d.hatena.ne.jp/keyword/AWS)の組み合わせなどもやっている。
これらはスピード感とコスト感などで選択しているとのこと。
規模が大きくなるに連れて、
Developerからインフラへのタスク依頼が増えてインフラ側が[ボトルネック](http://d.hatena.ne.jp/keyword/%A5%DC%A5%C8%A5%EB%A5%CD%A5%C3%A5%AF)になっていく。
これをどう解決するか、既存、新規アプリ関係なく、
すぐにデプロイできる環境を提供できるようにするのが、変化に強いインフラ。
自動化とTool([API](http://d.hatena.ne.jp/keyword/API))の作成して、
DeveloperがそのToolを使うようにさせて、
インフラにタスク依頼がこないようにした。
Developerに使ってもらえるように気をつけている。
herokuから[AWS](http://d.hatena.ne.jp/keyword/AWS)への移行のような大きな変化は
コマンドが変わることでDeveloperに影響がでるので、
これまでの運用の変化差異を減らせるように、
ヒアリングをして同じ結果になるようにコマンドを作成した。
Docker imageの中にChefを使って[インスタンス](http://d.hatena.ne.jp/keyword/%A5%A4%A5%F3%A5%B9%A5%BF%A5%F3%A5%B9)作成たり、
Packerで[AWS](http://d.hatena.ne.jp/keyword/AWS)のinstanceのAMIを作成などをした。
ただ、これではアプリケーションの構築部分がCode化できたが、
インフラがコードをメンテするので、インフラが[ボトルネック](http://d.hatena.ne.jp/keyword/%A5%DC%A5%C8%A5%EB%A5%CD%A5%C3%A5%AF)になってしまう。
Terraformeは[AWS](http://d.hatena.ne.jp/keyword/AWS)(S3/RDS/ELB etc)dnsimpleを操作させている。
WantedlyではCoreOSを使用しているが、
CoreOSを使うきっかけはDockerやRegistryのversion upが大変だから、
Officialにamiが用意されているのでCoreOSを試験運用してきた。
サーバが一台停止されたら、勝手に[インスタンス](http://d.hatena.ne.jp/keyword/%A5%A4%A5%F3%A5%B9%A5%BF%A5%F3%A5%B9)が立ち上がって欲しいので、
[golang](http://d.hatena.ne.jp/keyword/golang)でツールを作成。[AWS](http://d.hatena.ne.jp/keyword/AWS) TAGを元にsystemdにサービスを提供させるもの。

ただ、これはAutoScaleでよいのでないかしらとおもいました。

[クラスタリング](http://d.hatena.ne.jp/keyword/%A5%AF%A5%E9%A5%B9%A5%BF%A5%EA%A5%F3%A5%B0)はすぐアプリを動かせるインフラをすぐに作れるので、
何台分でもよくて、一回限りでもよい。
Kong Archirtecture：各サービスの[API](http://d.hatena.ne.jp/keyword/API)作成するとき、
Kongに対してdeployすればよい。これは[API](http://d.hatena.ne.jp/keyword/API) [Gateway](http://d.hatena.ne.jp/keyword/Gateway)の働きをする。
[API](http://d.hatena.ne.jp/keyword/API) Generateは[API](http://d.hatena.ne.jp/keyword/API)を作成してくれる。
Wantedlyのインフラチームはコードを書いて問題解決をしているとのことでした。

動画はないみたいなので、公開されているプレゼン資料を読むのが良さそうです！

- 今あえて試行錯誤しながら"[車輪の再発明](http://d.hatena.ne.jp/keyword/%BC%D6%CE%D8%A4%CE%BA%C6%C8%AF%CC%C0)"をする意味

このセッションを聞こうと思って、もともと参加してたのですが、
他の人に譲らないといけないみたいな感じになり[ソウルジェム](http://d.hatena.ne.jp/keyword/%A5%BD%A5%A6%A5%EB%A5%B8%A5%A7%A5%E0)が濁ったのですが、
途中から聞けるようになったのでよかった。

いい話でよかったです。そしてやっているからスキル高いんだなあとも思いました。
もし、来年も同じセッションを聞いていい話と思っちゃいけないとも思いました。
今年一年で、来年このセッションを聞く必要がないようにならないといけない。
手を動かしてやっていかないといけないと思いました。

途中からだったんのですが、内容としてはプログラミング初めて写経の次はどうするのか問題。
写経の次は[車輪の再発明](http://d.hatena.ne.jp/keyword/%BC%D6%CE%D8%A4%CE%BA%C6%C8%AF%CC%C0)のすすめ。
ただプログラミングのやり方がわかってきてからやったほうがよくて、
自分で[プロトコル](http://d.hatena.ne.jp/keyword/%A5%D7%A5%ED%A5%C8%A5%B3%A5%EB)、[アルゴリズム](http://d.hatena.ne.jp/keyword/%A5%A2%A5%EB%A5%B4%A5%EA%A5%BA%A5%E0)を実装するのがよい。
たとえばHTTP[プロトコル](http://d.hatena.ne.jp/keyword/%A5%D7%A5%ED%A5%C8%A5%B3%A5%EB)のサーバやクライアントをつくるとか、
自分が普段使っているプロダクトに似ているものを作ってみる。
[Apache](http://d.hatena.ne.jp/keyword/Apache)や[keepalived](http://d.hatena.ne.jp/keyword/keepalived)などなど。
これをやることで[ボトルネック](http://d.hatena.ne.jp/keyword/%A5%DC%A5%C8%A5%EB%A5%CD%A5%C3%A5%AF)の想像がつきやすくなってくる。
HTTPサーバの実装だったら、HTTPの[RFC](http://d.hatena.ne.jp/keyword/RFC)を読んで、知らないヘッダを読む。
keepaliveや、cache-controlについてどういうものなのかを漠然としたものから
理解することができるようになる。
HTTPサーバの自作はおすすめらしい。
ヘッダを無視して、メソッド、パス、受けたら返すようにするのを目指す。
これをやるとc10k問題がどういうものなのかが、わかってくる。
ファイル[ディスクリプタ](http://d.hatena.ne.jp/keyword/%A5%C7%A5%A3%A5%B9%A5%AF%A5%EA%A5%D7%A5%BF)をセレクトでみてるからc10k問題になる。
epollでみてるのがnginx.
ほかには[CGI](http://d.hatena.ne.jp/keyword/CGI)はどのようにして動作しているのかわかる。
こういうのをやって、どれだけ役に立っているかというと毎日役立ってると思うくらい役に立っているとのこと。
自作したHTTPサーバに対して、[curl](http://d.hatena.ne.jp/keyword/curl)やブラウザが返ってくるのは感動。
セッション中では[Java](http://d.hatena.ne.jp/keyword/Java)で自作する本が出ているのをおすすめしていました。
他には[Linux](http://d.hatena.ne.jp/keyword/Linux)コンテナエンジンの自作をしてみる。
Dockerは巨大なので、実装することで中でどのような動きになっているか理解できる。
cgroupや[chroot](http://d.hatena.ne.jp/keyword/chroot),vethのような技術も理解できる。
先駆者がいるので、コードを読んで参考にするのがよい。
[Dena](http://d.hatena.ne.jp/keyword/Dena)のjaillingの[perl](http://d.hatena.ne.jp/keyword/perl)は200行ぐらいで書かれていたりする。
あとはdrootやhaconiwaなど
他に[車輪の再発明](http://d.hatena.ne.jp/keyword/%BC%D6%CE%D8%A4%CE%BA%C6%C8%AF%CC%C0)としておすすめなのは、
言語処理系、[Lisp](http://d.hatena.ne.jp/keyword/Lisp)のNosql系、プロビジョニングツール、Itamaeｍ、[ldap](http://d.hatena.ne.jp/keyword/ldap)が大変なので、ログイン認証サーバを作ってみる。
他には監視サーバをつくてみるとかもよい。
分散システムの[アルゴリズム](http://d.hatena.ne.jp/keyword/%A5%A2%A5%EB%A5%B4%A5%EA%A5%BA%A5%E0)を実装してみたりもおすすめ。
[車輪の再発明](http://d.hatena.ne.jp/keyword/%BC%D6%CE%D8%A4%CE%BA%C6%C8%AF%CC%C0)は[プロトコル](http://d.hatena.ne.jp/keyword/%A5%D7%A5%ED%A5%C8%A5%B3%A5%EB)や低レイヤなどの普遍的で長く使える技術を効率よく学べる。
似たものを作るので元の[ソースコード](http://d.hatena.ne.jp/keyword/%A5%BD%A1%BC%A5%B9%A5%B3%A1%BC%A5%C9)を必然的に読むことが増える。
[RFC](http://d.hatena.ne.jp/keyword/RFC)を読み解く練習にもなる。新しい実装の公開にも読み解ける。
[車輪の再発明](http://d.hatena.ne.jp/keyword/%BC%D6%CE%D8%A4%CE%BA%C6%C8%AF%CC%C0)の次はなにか、それは代表的プロダクトを作ってみる。
代表的プロダクトとはあの人といえばこのプロダクトと呼ばれるもの。
[車輪の再発明](http://d.hatena.ne.jp/keyword/%BC%D6%CE%D8%A4%CE%BA%C6%C8%AF%CC%C0)＋ア[イデア](http://d.hatena.ne.jp/keyword/%A5%A4%A5%C7%A5%A2)＝代表的プロダクトになる可能性があるのでは？
既存のソフトウェアの不満点を解決、デプロイや運用が既存のソフトウェアより簡単になっている。
抽象化しすぎると特定の規模に絞れないので、[ドメイン](http://d.hatena.ne.jp/keyword/%A5%C9%A5%E1%A5%A4%A5%F3)を対象に特化してみる。
書き直すならどの言語で書き直すのか？UIの考え方も重要。
ここのUIは運用する人目線のインターフェースをとらえる。
既存の言語をGOで書き直す流行りがあった。
ワン[バイ](http://d.hatena.ne.jp/keyword/%A5%D0%A5%A4)ナリで動くので導入障壁が低い。
対話型インターフェースにしないでyをきいてこないようにすれば、
自動化の妨げにならないとか運用目線で考える。
設定ファイルや自動化が難しいツールをCruby/mrubyなどで作り直す。
気をつけよう！！
発明[アンチパターン](http://d.hatena.ne.jp/keyword/%A5%A2%A5%F3%A5%C1%A5%D1%A5%BF%A1%BC%A5%F3)(嫌われる[車輪の再発明](http://d.hatena.ne.jp/keyword/%BC%D6%CE%D8%A4%CE%BA%C6%C8%AF%CC%C0))はやめて！
既存の劣化品を作ってプロダクションにいれてしまうことなど。
既存のモノの修正で十分済むのに新しい物をつくって導入してしまうことなど。
自分の発明にするには作ろうとしている対象の領域の深い知見が必要。
実装すればわかるのは、たいてい勝てない。
作りなおすのは[アーキテクチャ](http://d.hatena.ne.jp/keyword/%A5%A2%A1%BC%A5%AD%A5%C6%A5%AF%A5%C1%A5%E3)としてダメなとき。
やってみた側になるには手を動かすのが大事なので手を動かそう！
[車輪の再発明](http://d.hatena.ne.jp/keyword/%BC%D6%CE%D8%A4%CE%BA%C6%C8%AF%CC%C0)をするときどこまで実装するのかは、
どこまで調べるのかは最初からきめる。
最初にゴールを決める。
プライベードと仕事の線引きはどうするのか、
社内と合意をとる。合意をとるためにも見せられるものが必要。
そのためにも手を動かす。

- [機械学習](http://d.hatena.ne.jp/keyword/%B5%A1%B3%A3%B3%D8%BD%AC)を用いた[AWS](http://d.hatena.ne.jp/keyword/AWS) CloudTrailログの積極的活用
  [機械学習](http://d.hatena.ne.jp/keyword/%B5%A1%B3%A3%B3%D8%BD%AC)興味あるならやってみようよというお話だったと思います。
  ベストスピーカー賞ももらっていました。
  ここでも疲れが出てきて、ちゃんと聞けていなかったです。
  数学とかちゃんとやらないとだよなあ。
- 自動化のための運用監視設計を皆で考えてみなイカ（仮）

このセッションでもああ、こういう監視設計とかやりたくて
[SIer](http://d.hatena.ne.jp/keyword/SIer)から移ったはずなんだよなあということを思い返しました。
やりたかったことを思い出して、やっていこうと思ったセッションです。

内容としてはこれからの運用監視設計の話をしようで、
ゼロから監視設計ができるか、運用目的を明確化した監視と
非機能要件を満たしたシステム監視を行う。
意外と非機能要件の部分の監視が漏れていたりするので、
テストも必ず行いましょう！
そして、人は失敗するので手作業を減らして自動化をしようというお話。
テストもserverspecやinfratesterでテストの自動化ができますね。
そして、自動化をすればいいというのではなく、
個人の経験や組織のナレッジを自動化で更に活かすようにしていく。

- [Linux](http://d.hatena.ne.jp/keyword/Linux),[FreeBSD](http://d.hatena.ne.jp/keyword/FreeBSD)[脆弱性](http://d.hatena.ne.jp/keyword/%C0%C8%BC%E5%C0%AD)検知ツールVulsを開発したらServerspecを超える[GitHub](http://d.hatena.ne.jp/keyword/GitHub)スターを獲得するほどバズった話

タイトルがかなり釣り感があるセッションでした。
インドに一ヶ月修行に行って、
世界のためになにができるかを考えた結果、
ソフトウェアエンジニアとして
人に役立つものを作ろうと思ったらしいです。
そして[OSS](http://d.hatena.ne.jp/keyword/OSS)に貢献した結果、娘から見直されたといういい話が聞けました。
代表的プロダクトを作るには娘が必要で絶望なんて思ったものです。
Vulsは[ツイッター](http://d.hatena.ne.jp/keyword/%A5%C4%A5%A4%A5%C3%A5%BF%A1%BC)のTLでみたなあと思ったぐらいで、
どんなものかは知らなかったのですが、
かなり良さそうだったので、ちょっといじってみようかなと思いました。
格闘家かしらと思ったけど、いい人そうだったなという感想。

- 今エンジニアに最も必要なものは「戦略」である！[孫子](http://d.hatena.ne.jp/keyword/%C2%B9%BB%D2)に学ぶ本質のつかみ方

この時疲れがピークに達していて寝てしまっていた。
戦術と戦略の違いから説明していてよかったです。
中国で出版されている戦略の本をおすすめしていてマニアックだなと思いまいした。
戦術と戦略ってビジネスワードとして使われているので、
ITイベントでもこの手の話を聞けるとは思いませんでした。
最近ではSOFT SKILLSという本が売れていたりするので、
個人的には良いと思います。
結果どういう話に結びついたのかは、あまり覚えてないです。。

- 懇親会

やぱちーとも微妙にエンジニア層が被ってなさそうだなあという印象。
懇親会ではkoudaiiiさんと話してええと様子を伺っていましたが、
どうやら運営側らしく忙しそうだった。
rrreeeyyyさんにsongmuさんが話しかけにきていて
これができるエンジニアかと思いました。
懇親会で話しかけて貰えるように顔を広くなるには
アウトプット必要だよなあと最近思っていることなので、
やっていかないとだ。
個人的にsongmuさんが[ナデシコ](http://d.hatena.ne.jp/keyword/%A5%CA%A5%C7%A5%B7%A5%B3)をみていて(劇場版も)、
[ナデシコ](http://d.hatena.ne.jp/keyword/%A5%CA%A5%C7%A5%B7%A5%B3)観てるんだあ思っていました。
隙をみてkoudaiiiさんに話しかけるチャンスをみつけて、
wantedlyに入社したのが一年ぐらいとおっしゃっていて、
その成長速度に感服しました。
コードがかけるインフラエンジニアになれるように背中を追っていきたい。
k8sとマイクロサービスについてお話してくれたWantedlyの方と名刺交換したら
dtan4さんじゃんと！名刺を見返して気付きました。
酔っててもちゃんとその場で、名刺をよくみよう。。。
今回はコード書いてるインフラの人と話せたのが本当に良かった。
最近の目指す方向が社内でのポジションを目指すことになってたけど、
本来やりたかったことをやっていくべきなんだと気付きました。
やっていくからやってみたになっていこうと思います。
