---
title: "【報告】YAPC::Asiaの感想【8/21&8/22】"
date: "2015-08-23"
---

【Blogを書くまでが[YAPC](http://d.hatena.ne.jp/keyword/YAPC)】

去年と数えて今回が二回目の[YAPC](http://d.hatena.ne.jp/keyword/YAPC)でした。このblogも[YAPC](http://d.hatena.ne.jp/keyword/YAPC)の感想を書く為、専用となってしまっています。

昨日は以下のショックでblogを書く元気が無くなってしまいました。

> [YAPC](http://d.hatena.ne.jp/keyword/YAPC)パーカーのサイズ感を完全に誤って早速秋用のパジャマに成り下がった。XL異常なデカさ。
>
> — トトス (@oza\_shu) [2015, 8月 21](https://twitter.com/oza_shu/status/634684830190452736)

しかし、今回で[YAPC](http://d.hatena.ne.jp/keyword/YAPC)最後ということなので、気を取り直してblogを書かないわけにはいけません。それでは8/21&8/22の感想を書いていこうと思います。

・8/21

【参加したセッション】

メリークリスマス！

世界展開する大規模[ウェブサービス](http://d.hatena.ne.jp/keyword/%A5%A6%A5%A7%A5%D6%A5%B5%A1%BC%A5%D3%A5%B9)のデプロイを支える技術

[TBD](http://d.hatena.ne.jp/keyword/TBD)

Conway's Law of Distributed Work

[Podcast](http://d.hatena.ne.jp/keyword/Podcast)を支える技術、エンジニアのためのWebメディア、そして[CPAN](http://d.hatena.ne.jp/keyword/CPAN)

Lightning Talks Day 1

【セッションの感想】

・メリークリスマス！

まずは[Perl](http://d.hatena.ne.jp/keyword/Perl)の父[Larry Wall](http://d.hatena.ne.jp/keyword/Larry%20Wall)のメリークリスマス！から。「メリークリスマス！」って何のこっちゃと思ったら、ついに噂のPerl6が今年のクリスマスにリリースされるとのことが発表されました！( ※ただし約束はしていない。)

そしてLarryの[Perl](http://d.hatena.ne.jp/keyword/Perl)と[トールキン](http://d.hatena.ne.jp/keyword/%A5%C8%A1%BC%A5%EB%A5%AD%A5%F3)の作品との関係性。Perl5である「[ホビットの冒険](http://d.hatena.ne.jp/keyword/%A5%DB%A5%D3%A5%C3%A5%C8%A4%CE%CB%C1%B8%B1)」からPerl6である「[指輪物語](http://d.hatena.ne.jp/keyword/%BB%D8%CE%D8%CA%AA%B8%EC)」は書かれるまで、何年も待たなければいけなかった。そして、それは[ホビット](http://d.hatena.ne.jp/keyword/%A5%DB%A5%D3%A5%C3%A5%C8)([Perl](http://d.hatena.ne.jp/keyword/Perl))が成長していく物語なんだ。と知性あふれるLarryの語りと、それを同時通訳をこなせているプロの凄さからニヤニヤが止まりませんでした。観ててよかった「[ロード・オブ・ザ・リング](http://d.hatena.ne.jp/keyword/%A5%ED%A1%BC%A5%C9%A1%A6%A5%AA%A5%D6%A1%A6%A5%B6%A1%A6%A5%EA%A5%F3%A5%B0)」。物語性ある[プログラミング言語](http://d.hatena.ne.jp/keyword/%A5%D7%A5%ED%A5%B0%A5%E9%A5%DF%A5%F3%A5%B0%B8%C0%B8%EC)はなんて素敵なんだ。「[Perl](http://d.hatena.ne.jp/keyword/Perl)は[Unix](http://d.hatena.ne.jp/keyword/Unix)のtoolになり見えない存在になることで革命的になった。 」この[Unix](http://d.hatena.ne.jp/keyword/Unix)と共に成長していった感じも好き。革命的なものは革命的とみないものなんだ。あとは「人間の価値は何を得られるかでなく何を与えられるか」というgiveの精神。これが[OSS](http://d.hatena.ne.jp/keyword/OSS)の精神なんだろうなあ。「I fail good」正しく失敗できるようになりたいです。

最初がLarryWallのセッションだったからか、Larryより同時通訳者の方が話題になり、誰も質問しないなんて展開になってしまったのかな。とLarryには申し訳ない気持ちにはなった。

・世界展開する大規模[ウェブサービス](http://d.hatena.ne.jp/keyword/%A5%A6%A5%A7%A5%D6%A5%B5%A1%BC%A5%D3%A5%B9)のデプロイを支える技術   
  
consul とstrecherめっちゃ早いって話だった気がします。  
成果物をプルリクするよりS3に管理することで早いとのこと。デプロイ話はピンと来なかったなあ。cap2&gitより早くて、autoscaleと連携しマルチリージョンできるらしい。ココらへんは用語も知らないこと多かったので、ググッて調べとこ。Jenkins先生のテストは大事っぽい。[YAML](http://d.hatena.ne.jp/keyword/YAML)は何の文脈で出てきたっけなあ。

##ブレイクタイム##  
  
お弁当の支給ありがとうございました。美味しかったです！  
  
・[TBD](http://d.hatena.ne.jp/keyword/TBD)  
お昼のお弁当をさっさと食べ、Matsのセッションだったから一番前ので席を確保。  
おじさんが座ってたから2つぐらい席を離して座りました。するとスタッフの方が話しかけててMatsだった。

> 隣にMats様が座っていた [#yapcais](https://twitter.com/hashtag/yapcais?src=hash)
>
> — トトス (@oza\_shu) [2015, 8月 21](https://twitter.com/oza_shu/status/634571085711699968)

> 今日から[Ruby](http://d.hatena.ne.jp/keyword/Ruby)やるわ。
>
> — トトス (@oza\_shu) [2015, 8月 21](https://twitter.com/oza_shu/status/634571344261201920)

※ [Ruby](http://d.hatena.ne.jp/keyword/Ruby)始めます。

「今日は[Ruby](http://d.hatena.ne.jp/keyword/Ruby)の話は封印します。」では何の話をするか、「不揮発性のメインメモ」の話をします。でも実際スライド作ったら15分しか持たないから不揮発性のメインメモリがもしもできたら、言語設計者としてどのような言語を設計するかっていう話は飲み会とかで」と追っしゃてました。いつか聞きたいです。笑

それでは「[Ruby](http://d.hatena.ne.jp/keyword/Ruby)の封印を早速解きます。[Ruby](http://d.hatena.ne.jp/keyword/Ruby)の悪口を言っても問題ないのは問題ないから」と初めてMatsをみたけど面白い方だった。

[Ruby](http://d.hatena.ne.jp/keyword/Ruby)の設計は[Perl](http://d.hatena.ne.jp/keyword/Perl)や[Lisp](http://d.hatena.ne.jp/keyword/Lisp)の影響を受けているから、もしいま[Ruby](http://d.hatena.ne.jp/keyword/Ruby)を設計をしたら取り入れなかった機能の話をしてくれた。こういう話を聞くと、[プログラミング言語](http://d.hatena.ne.jp/keyword/%A5%D7%A5%ED%A5%B0%A5%E9%A5%DF%A5%F3%A5%B0%B8%C0%B8%EC)の説明で、OOの言語の影響を受けているって話はこういうことだったんだと納得出来ました。新しく[プログラミング言語](http://d.hatena.ne.jp/keyword/%A5%D7%A5%ED%A5%B0%A5%E9%A5%DF%A5%F3%A5%B0%B8%C0%B8%EC)を作った言語設計者も意識した[プログラミング言語](http://d.hatena.ne.jp/keyword/%A5%D7%A5%ED%A5%B0%A5%E9%A5%DF%A5%F3%A5%B0%B8%C0%B8%EC)があるんだ。そして今新しく作っている[プログラミング言語](http://d.hatena.ne.jp/keyword/%A5%D7%A5%ED%A5%B0%A5%E9%A5%DF%A5%F3%A5%B0%B8%C0%B8%EC)のデモをしてくれた。[シェルスクリプト](http://d.hatena.ne.jp/keyword/%A5%B7%A5%A7%A5%EB%A5%B9%A5%AF%A5%EA%A5%D7%A5%C8)が今見直されている。その理由がパイプ処理でCPUのマルチコアを正しく使うから、っていう話は面白かった。ハードウェアの進化に伴い、[プログラミング言語](http://d.hatena.ne.jp/keyword/%A5%D7%A5%ED%A5%B0%A5%E9%A5%DF%A5%F3%A5%B0%B8%C0%B8%EC)の使われ方も変わるのだろう。それを踏まえた新しい[プログラミング言語](http://d.hatena.ne.jp/keyword/%A5%D7%A5%ED%A5%B0%A5%E9%A5%DF%A5%F3%A5%B0%B8%C0%B8%EC)「Streem」については今後チェックしておこう。  
  
・Conway's Law of Distributed Work   
Remote! リモートワークの話でした。今はインフラエンジニアをやっているので、このリモートワークとは縁が無いだろうけど、諦めない。  
  
【Effective communic*ation saves Time】*

リモートワークでのコミュニケーションの話で、次のようにグループ分けをしていた。「Text Chat:Archive,Group Chat, Privete Chat. Full Participation」  
  
【コミュニケーションを円滑にするツール】  
・CHATOPS:[lita](http://d.hatena.ne.jp/keyword/lita),hubot  
・Audio/Video Communication:Headphones,Microphone,Camera  
・HipChat,[Google](http://d.hatena.ne.jp/keyword/Google) Hangouts,appear.in,sqwiggleSCREEN SHARING:Screenhero(for 　　　slack),Hip Chat,join.me.WebEX  
・CODE REVIEW:Pull Requests,Gerrit.ReviewBoard.Code COllaborator  
・Piivotal Tracker,Trello,[Github](http://d.hatena.ne.jp/keyword/Github) Issues,waffle.io for [GitHub](http://d.hatena.ne.jp/keyword/GitHub) Issues  
・Ether[ad,Haclpad,[Google Docs](http://d.hatena.ne.jp/keyword/Google%20Docs).[Github](http://d.hatena.ne.jp/keyword/Github) [Wiki](http://d.hatena.ne.jp/keyword/Wiki)  
・[Dropbox](http://d.hatena.ne.jp/keyword/Dropbox),Boc.net,GoogleDrive.[NFS](http://d.hatena.ne.jp/keyword/NFS)  
・[Google Calendar](http://d.hatena.ne.jp/keyword/Google%20Calendar),Exchange  
*※誤字脱字あるので後でスライド再度確認しておこう。*  
  
【Everyone should experience remotie work】  
リモートワークを理解してもらうには「期間は一週間で実感してもらうのが大事」  
  
【Have on-site meetups】  
定期的に人と会うのが大切。invite remote workers into hallway conversations. Over communicate. [37signals](http://d.hatena.ne.jp/keyword/37signals)のREMOTEでも似たような話があったような。読み返してみよう。  
  
【ア[イデア](http://d.hatena.ne.jp/keyword/%A5%A4%A5%C7%A5%A2)を書き、コミュニケーションを行う】  
これは付箋なり、テキストチャットなり、人それぞれの好み。Share your personality.人格個性を共有。自分の趣味は何か、オフィスを離れて何をしているのか。オフトピックの場を設ける。つまりはHipChatの雑談板みたいなものですね。Remoteって能力だけで評価するのかなと思ったら、人格であるソフトパワーも大事なんだ。結局人と人だから当然か。

【Exhibit a "visible pulse.】  
大事なのは[バイ](http://d.hatena.ne.jp/keyword/%A5%D0%A5%A4)タルを見せる。生きてることを知らせる。いついるのかいないのか知らせる。 なんか[ネトゲ](http://d.hatena.ne.jp/keyword/%A5%CD%A5%C8%A5%B2)の話に通じるのではないかと思いました。  
Pick a timezone.Standard Operating Ti*me(SOT).基準の時間を設ける。*これはきっと本社がどこなのかで決まるんだと思う。  
sociotechnical Theoryは造語らしい。

【感想】  
このセッションで思ったのはRemoteWorkはMMOと近い何かがあるし、同時通訳者がいるなら英語で質問をするのは避けるべきだと思いました。日本語で質問したほうがいい答えが返ってくるのは良い知見だ。「日本語で質問してね」と言ったのはスピーカーなのか通訳者の心の声が漏れたのかどっちなんだろう。  
でも英語出来る人が多くて驚いたし、凄いと思う。懇親会とかでせっかく来てくれた外国人スピーカーと話したら嬉しいな。そしてそういうことができるようになりたい。

※英語始めます。

最後に質問の答で「常に[スマートフォン](http://d.hatena.ne.jp/keyword/%A5%B9%A5%DE%A1%BC%A5%C8%A5%D5%A5%A9%A5%F3)を握っていると友達や家族が強いフラストレーションを持つよね」これってリモートワーク関係なく大切なことではないでしょうか。

・[Podcast](http://d.hatena.ne.jp/keyword/Podcast)を支える技術、エンジニアのためのWebメディア、そして[CPAN](http://d.hatena.ne.jp/keyword/CPAN)

[Podcast](http://d.hatena.ne.jp/keyword/Podcast)の話でした。あとお金の話。

.fmって[ドメイン](http://d.hatena.ne.jp/keyword/%A5%C9%A5%E1%A5%A4%A5%F3)名らしく年間1万以上するらしい。[Podcast](http://d.hatena.ne.jp/keyword/Podcast)も大変そう。音質という宗教の世界になるっていうのはこだわりだしたら怖い。静かな場所であれば[iphone](http://d.hatena.ne.jp/keyword/iphone)のスピーカーでも大丈夫らしいし、大事なのはいかに雑音が入らないところでやるのかなんだろう。とりあえず溜まってたrebuild.fm聴いていこう。  
「大規模でも小中規模サービスでも捗る microservices な Web サービスのつくりかた」を見たくて途中で抜けてしまったけど、結局、満室で部屋にはいることができず、その後は無限コーヒーを飲んでました。スライ*ドを後で確認しておこう。*

・Lightning Talks Day 1

みんな話が面白く楽しかったです！papixさんのは笑ったし、嫁[bot](http://d.hatena.ne.jp/keyword/bot)と一緒にプロビジョニングする話もあらゆる意味ですごかった。

・8/22

【参加したセッション】

ISUCONの勝ち方

サーバーサイドエンジニア(特に[Perl](http://d.hatena.ne.jp/keyword/Perl))のための[iOS](http://d.hatena.ne.jp/keyword/iOS)アプリ開発入門

Adventures in Refactoring

Posture for Engineers

Run containerized workloads with Lattice

Profiling & Optimizing in Go

Lightning Talks Day 2

クロージング

【セッションの感想】

・ISUCONの勝ち方

> おはよー。[YAPC](http://d.hatena.ne.jp/keyword/YAPC)寝坊した。ううう
>
> — トトス (@oza\_shu) [2015, 8月 22](https://twitter.com/oza_shu/status/634881733578526720)

走って走ってちょっと歩いて走ったらギリギリ間に合った！

チューニングってどんなことをやるのか興味がありました。

ISUCONとは[ベンチマーク](http://d.hatena.ne.jp/keyword/%A5%D9%A5%F3%A5%C1%A5%DE%A1%BC%A5%AF)ツールの計測したスコアで順位付けするらしい。  
勝つためには、普段から一緒に作業をしている人と作業分担をして、お互いの作業をチェックしてミスを減らすことが大事だと。問題をいち早く相談して解決すること。決まったことはメモをして書き出し、後戻りは減らす。最初の1時間は課題の理解、プロファイリングとチューニングの方向性。最後の30分再起動テストを設けること。ちゃんと起動するか確認が大事。

【事前準備】

PrivateGitRepository,[Wiki](http://d.hatena.ne.jp/keyword/Wiki),メンバーの[ssh](http://d.hatena.ne.jp/keyword/ssh)公開鍵、秘伝のタレ、Chatroom,技術選択についての簡単な打ち合わせ、過去問を解く、ローカルより、EC2,[GCP](http://d.hatena.ne.jp/keyword/GCP)とかで試したほうがいい。

【チューニングの進め方】

１：課題の理解、レギューレーションヤ当日の説明を理解、どのようにスコアが決まるか、失格になるのか、ブラウザで課題となるサイトへアクセス。とりあえず[ベンチマーク](http://d.hatena.ne.jp/keyword/%A5%D9%A5%F3%A5%C1%A5%DE%A1%BC%A5%AF)を動かす。

初期設定が間違いなど、はずれ[インスタンス](http://d.hatena.ne.jp/keyword/%A5%A4%A5%F3%A5%B9%A5%BF%A5%F3%A5%B9)をひいたかわかるため、とりあえず[ベンチマーク](http://d.hatena.ne.jp/keyword/%A5%D9%A5%F3%A5%C1%A5%DE%A1%BC%A5%AF)を動かす。

2.プロファイリング、Webアプリで起きてることを知る、[アクセスログ](http://d.hatena.ne.jp/keyword/%A5%A2%A5%AF%A5%BB%A5%B9%A5%ED%A5%B0)の解析、[MySQL](http://d.hatena.ne.jp/keyword/MySQL)のSlowLog解析、アプリケーションの解析、負荷分散。

【[アクセスログ](http://d.hatena.ne.jp/keyword/%A5%A2%A5%AF%A5%BB%A5%B9%A5%ED%A5%B0)の解析】

[ベンチマーク](http://d.hatena.ne.jp/keyword/%A5%D9%A5%F3%A5%C1%A5%DE%A1%BC%A5%AF)ツールがアクセスしている先を確認。頻度とレスポンス時間をバランスよく見る。スコアに関係ないところはもういじらなくていいよねと決める。analyze\_[apache](http://d.hatena.ne.jp/keyword/apache)+log,kataribe

[apache](http://d.hatena.ne.jp/keyword/apache)のアクセスと具解析、httod.confをいじり、accesss\_logを消し、サーバ再起動し、解析にかける。kataribeは１回しかアクセスしてないなら重くても無視する。全部を見てどこをチューニングするか決める。

【[MySQL](http://d.hatena.ne.jp/keyword/MySQL)\_SlowLog解析】

クエリ実行回数と頻度の両方を見る。遅いクエリ、より秒間数千クエリを食うクエリ両方を見る。ツール。pt- query.MySQLSlowLOg解析。myconfを0にして全てをslowlogに出す。最後にはslowllogを消す。どんなクエリが動いてるのか確認。

【アプリケーションのプロファイリング】

各言語のツールを使う。strace,[tcpdump](http://d.hatena.ne.jp/keyword/tcpdump)など。  
アプリケーションが何をしてて、どこと通信をしているのかを確認することが大事。  
サーバの負荷を見る、top.iftop,iotop,dstatなどなど、ネットワークがつまるなど、通信が一番*重くなる。*

【サーバ構成】

Client,リバプロ、APPサーバ、Cache,KVS,RDMSそれぞれどんなサーバで、ミドルか、その設定、過去には設定の[typo](http://d.hatena.ne.jp/keyword/typo)や罠もある。  
チューニングの方向性を決める。与えられたサーバを使い切る。

【効率の良いCPUの使い方を知る】

[コンテキストスイッチ](http://d.hatena.ne.jp/keyword/%A5%B3%A5%F3%A5%C6%A5%AD%A5%B9%A5%C8%A5%B9%A5%A4%A5%C3%A5%C1)ング。いかに何もしないアプリケーションにいかに近づけるか、参照通信を減らし、無くしていくこと。  
[Apache](http://d.hatena.ne.jp/keyword/Apache) VS NginxだったのがNginx VS h2oになると予想。

h2oっていうのは知らなかったな。h2oはスレッドなのでNginxより早いが、設定はNginxのほうがある。外部プロセスの起動HTMLテンプレート処理、テキスト画像変換処理、RDMBMS/Cacheとの接続、N+1問題などが重い処理。

【[RDBMS](http://d.hatena.ne.jp/keyword/RDBMS)/[SQL](http://d.hatena.ne.jp/keyword/SQL)】

B+Tree。一番下にデータがぶら下がっている。インデックスはidだけがぶら下がっている。つまりプライマリキーがぶら下がって いる。このしょりが重い。MySQ:LのOFFSET処理。最後の古いページも見る。捨てるデータの読み都営を最小限に。

どうやってデータを取りに行くかを心に描くのはちゃんと動きを理解しないといけない。これは小手先のスキルじゃなく大規模システムの会社で働くなどして、スキルを磨かないとダメだ。やっぱり大きなシステム持ってる独自サービスの会社に勤めてみたいなー！

最後に初期状態を記録。変更を都度記録。前日はよく寝る。あきらめないことが大事。

・サーバーサイドエンジニア(特に[Perl](http://d.hatena.ne.jp/keyword/Perl))のための[iOS](http://d.hatena.ne.jp/keyword/iOS)アプリ開発入門

swift2.0で仕様が固まり、もう[objective-C](http://d.hatena.ne.jp/keyword/objective-C)を書くことはないだろうと聞いて、これは[iOS](http://d.hatena.ne.jp/keyword/iOS)アプリも触ってみたいなと思いました。[API](http://d.hatena.ne.jp/keyword/API)を使ったデモはネットワークの問題で上手く行かなかったけど、[xcode](http://d.hatena.ne.jp/keyword/xcode)-betaでのスライド遷移の簡単さを見ると[GUI](http://d.hatena.ne.jp/keyword/GUI)でもできることあるみたい。でもswiftはマシンパワーを要求するからMacbookProと外部ディスプレイを買ったほうがいいというのは知見だ。あと[iOS](http://d.hatena.ne.jp/keyword/iOS)アプリのいいところは作ったのを手軽に他の人に見てもらえるから、フィードバックもらえてたのしい。自分しか使わないモノを作って、自分が知りたいことだけを勉強していくのがいいよっていうのはMuraseさんでもそうなんだと思い親近感。

・Adventures in Refactoring

個人的には一番面白かった話！ヒゲで雑音が入って通訳の人からマイクの位置変えるようにとお達しが笑

リファクトリングとはコードを変えるが、振る舞いは同じ。悪いリファクター結果を計ることが大事。一貫性もいいと思うが、一貫性というものは計れないものだ。重要なのは正しいことをキープすること。良い[リファクタリング](http://d.hatena.ne.jp/keyword/%A5%EA%A5%D5%A5%A1%A5%AF%A5%BF%A5%EA%A5%F3%A5%B0)は取り除くこと。不要な行を取り除く。テスト[カバレッジ](http://d.hatena.ne.jp/keyword/%A5%AB%A5%D0%A5%EC%A5%C3%A5%B8)が改善されるとよい。テストのExpressabilityを改善するとよい。テストの表現性。これは造語らしい。

テストの振る舞いが変わっているところに対して[リファクタリング](http://d.hatena.ne.jp/keyword/%A5%EA%A5%D5%A5%A1%A5%AF%A5%BF%A5%EA%A5%F3%A5%B0)を行う。パフォーマンスの改善がされること。コードの振る舞いを変えないで、スピードを改善。その結果を測るものとして[ディベロッパ](http://d.hatena.ne.jp/keyword/%A5%C7%A5%A3%A5%D9%A5%ED%A5%C3%A5%D1)ーがハッピーがどうかはコードを見れば測ることができるw[リファクタリング](http://d.hatena.ne.jp/keyword/%A5%EA%A5%D5%A5%A1%A5%AF%A5%BF%A5%EA%A5%F3%A5%B0)とISUCONの勝ち方も似ていると思った。

 【[リファクタリング](http://d.hatena.ne.jp/keyword/%A5%EA%A5%D5%A5%A1%A5%AF%A5%BF%A5%EA%A5%F3%A5%B0)の理由】

[ディベロッパ](http://d.hatena.ne.jp/keyword/%A5%C7%A5%A3%A5%D9%A5%ED%A5%C3%A5%D1)ーがハッピーになり、性能向上する。将来の作業のに向けてのの自信を得ること。そして技術的負債を払うこと。[リファクタリング](http://d.hatena.ne.jp/keyword/%A5%EA%A5%D5%A5%A1%A5%AF%A5%BF%A5%EA%A5%F3%A5%B0)した後は自信を持てる。そして他の[ディベロッパ](http://d.hatena.ne.jp/keyword/%A5%C7%A5%A3%A5%D9%A5%ED%A5%C3%A5%D1)ーの教育になる。システムがどういう振る舞いをしていくか学ぶことができる。

【テクニック】

コードの中にちょこちょこハッピーを得る。それは測定できる。例えば二つのコードを一つにするとか、アドレスをオブジェクト、リストにするとか、クオートマークの一貫性や、抽象コードを入れること。関数を入れること。小さなテーブルを[スプレッドシート](http://d.hatena.ne.jp/keyword/%A5%B9%A5%D7%A5%EC%A5%C3%A5%C9%A5%B7%A1%BC%A5%C8)などでハッシュにする。

【大切なこと】

スタイルガイドがあることが大事。それを得ること。まずスタイルガイドを決める、後はルールを踏襲する。$go fmt とか素晴らしい。というよりgo素晴らしいだってw

verbe type.動詞を名詞化できるかどうか。ちいさなメソッドを名刺にする。抽象化レイヤーを導入する。pullリクエストをマージできるのか。

あと 不要な抽象化レイヤーを取り除く。

【[リファクタリング](http://d.hatena.ne.jp/keyword/%A5%EA%A5%D5%A5%A1%A5%AF%A5%BF%A5%EA%A5%F3%A5%B0)の落とし穴】

既存のバグ。[リファクタリング](http://d.hatena.ne.jp/keyword/%A5%EA%A5%D5%A5%A1%A5%AF%A5%BF%A5%EA%A5%F3%A5%B0)をやっている時にバグを直してはダメ。壊れた時、fixが原因なのか、[リファクタリング](http://d.hatena.ne.jp/keyword/%A5%EA%A5%D5%A5%A1%A5%AF%A5%BF%A5%EA%A5%F3%A5%B0)が原因かわからなくなるかた、それぞれ別に直していく。これは最後に質問で補足されていました。

パフォーマンスの変化がわかる。コンテキストなど。

【[リファクタリング](http://d.hatena.ne.jp/keyword/%A5%EA%A5%D5%A5%A1%A5%AF%A5%BF%A5%EA%A5%F3%A5%B0)を分解】

Deprecate; 古いメソッドを取れ除けない時にする。これはtail\_bytesの時はできない。Backwards Compatible : currentが一つから二つになるとき、[API](http://d.hatena.ne.jp/keyword/API)を書き換え全てcurrentとする。

ここはデモで話してたところなので再度確認したい。

また大きな[リファクタリング](http://d.hatena.ne.jp/keyword/%A5%EA%A5%D5%A5%A1%A5%AF%A5%BF%A5%EA%A5%F3%A5%B0)にはリスクがある。リスクを抑制するにはToolsを書く。大規模な[リファクタリング](http://d.hatena.ne.jp/keyword/%A5%EA%A5%D5%A5%A1%A5%AF%A5%BF%A5%EA%A5%F3%A5%B0)にはコードが増える。

【大規模な[リファクタリング](http://d.hatena.ne.jp/keyword/%A5%EA%A5%D5%A5%A1%A5%AF%A5%BF%A5%EA%A5%F3%A5%B0)によいツールの紹介】

・Backscatter.なんでコールされているのか吐く。コールスタックより上流のスタックがわかる。良い点はランタイムで実行される.

・Science:[ruby](http://d.hatena.ne.jp/keyword/ruby)のライブラリ。実験ができる。古いと新しいメソッド二つを実行できる。e.use/e.newパフォーマンステストでもscience.グラフが出る。[rubygems](http://d.hatena.ne.jp/keyword/rubygems)でパブリックされている。scienceを後でダウンロードしてみよう！

【[リファクタリング](http://d.hatena.ne.jp/keyword/%A5%EA%A5%D5%A5%A1%A5%AF%A5%BF%A5%EA%A5%F3%A5%B0)の不満話】

Backscatterは時間がかかるし、scienceは[ruby](http://d.hatena.ne.jp/keyword/ruby)しかない。可視化できなくてエディタレベルしかない。それに比べて[java](http://d.hatena.ne.jp/keyword/java)は素晴らしい。言語の中に入っている。Deprecatedがある。[C++](http://d.hatena.ne.jp/keyword/C%2B%2B)14も入ってる。[Django](http://d.hatena.ne.jp/keyword/Django)などの[フレームワーク](http://d.hatena.ne.jp/keyword/%A5%D5%A5%EC%A1%BC%A5%E0%A5%EF%A1%BC%A5%AF)もある。

【Q&A】

[リファクタリング](http://d.hatena.ne.jp/keyword/%A5%EA%A5%D5%A5%A1%A5%AF%A5%BF%A5%EA%A5%F3%A5%B0)のアプローチに意見が分かれたらPull requestを使う。style guideがあることが大事。セミコロンやクォーテーションはどっちがいいか等はstyle guideを見て決めていく。[リファクタリング](http://d.hatena.ne.jp/keyword/%A5%EA%A5%D5%A5%A1%A5%AF%A5%BF%A5%EA%A5%F3%A5%B0)のアプローチはテストの結果をコミュニケーションのキーにしていく。テストの結果がいいほうを取ればいいんだね。

[リファクタリング](http://d.hatena.ne.jp/keyword/%A5%EA%A5%D5%A5%A1%A5%AF%A5%BF%A5%EA%A5%F3%A5%B0)と開発どっちを優先するか。その基準は変更に関する自信のレベル。変更する前に自信がないとダメ。その自信を計測するのは難しい。機能の動きに変化がないか自信が大事。ここはテストを通して、決めていけばいいのかな。

先ほど話にあった、バグfixと[リファクタリング](http://d.hatena.ne.jp/keyword/%A5%EA%A5%D5%A5%A1%A5%AF%A5%BF%A5%EA%A5%F3%A5%B0)の優先の問題は、個別に切り分けてやるのが大事。

[リファクタリング](http://d.hatena.ne.jp/keyword/%A5%EA%A5%D5%A5%A1%A5%AF%A5%BF%A5%EA%A5%F3%A5%B0)の目標は振る舞いを変えないこと。それはテストを行うこと。テスト[カバレッジ](http://d.hatena.ne.jp/keyword/%A5%AB%A5%D0%A5%EC%A5%C3%A5%B8)と表現性。テストがどれだけ複雑であるか。テストの複雑性はコード改善されないとダメ。テスト[カバレッジ](http://d.hatena.ne.jp/keyword/%A5%AB%A5%D0%A5%EC%A5%C3%A5%B8)はテストがうまくいっているかでわかる。

[リファクタリング](http://d.hatena.ne.jp/keyword/%A5%EA%A5%D5%A5%A1%A5%AF%A5%BF%A5%EA%A5%F3%A5%B0)のデザイン主導は好ましくない。コードがテストに、良いテストからコードは生まれる。テスト駆動ドリブンのことなんだろう。最初にテストがあって、それに通るコードを書くことが大事。コードを最初に書いて、それが通ってしまうテストを書くことになるのは避けるべき。

スタイルガイドを変更するかはpull requestで管理する。「”」にするか「’」にするかは、pull requestでレポジトリで管理する。[リファクタリング](http://d.hatena.ne.jp/keyword/%A5%EA%A5%D5%A5%A1%A5%AF%A5%BF%A5%EA%A5%F3%A5%B0)が終わったらスタイルガイドを変えるなど、別々の問題としている。[リファクタリング](http://d.hatena.ne.jp/keyword/%A5%EA%A5%D5%A5%A1%A5%AF%A5%BF%A5%EA%A5%F3%A5%B0)途中で変えたりはしないのかな。

レガシコードに対しての[リファクタリング](http://d.hatena.ne.jp/keyword/%A5%EA%A5%D5%A5%A1%A5%AF%A5%BF%A5%EA%A5%F3%A5%B0)はどうするか。まずはテストを書くとこから始める。テストを書き切ってから、[リファクタリング](http://d.hatena.ne.jp/keyword/%A5%EA%A5%D5%A5%A1%A5%AF%A5%BF%A5%EA%A5%F3%A5%B0)をする。別々に切り分ける。変更を行う前に6か8つのテストを加えるのは最初のプルリクでする。

テストの[リファクタリング](http://d.hatena.ne.jp/keyword/%A5%EA%A5%D5%A5%A1%A5%AF%A5%BF%A5%EA%A5%F3%A5%B0)は絶対にやらないといけない。テストを変更するのは別の[リファクタリング](http://d.hatena.ne.jp/keyword/%A5%EA%A5%D5%A5%A1%A5%AF%A5%BF%A5%EA%A5%F3%A5%B0)にする。コードとテストの[リファクタリング](http://d.hatena.ne.jp/keyword/%A5%EA%A5%D5%A5%A1%A5%AF%A5%BF%A5%EA%A5%F3%A5%B0)はミックスして時にはやる。ケース[バイ](http://d.hatena.ne.jp/keyword/%A5%D0%A5%A4)ケースなのかな。

[リファクタリング](http://d.hatena.ne.jp/keyword/%A5%EA%A5%D5%A5%A1%A5%AF%A5%BF%A5%EA%A5%F3%A5%B0)とISUCONの勝ち方の類似点は振る舞いを変えず、パフォーマンスを向上させること。それがいかに大変なのか。奥が深い。

・Posture for Engineers

エンジニアのための姿勢の話。

エンジニアでありヨガのインストラクターの方の話だった。正しい姿勢の仕方と前傾姿勢の悪影響を話してくれた。腹痛も姿勢の問題かもしれないんだって。

座ることは新しいこと。長時間座ることができない。長い時間座っていると体が正しく機能しない。筋肉は縮んだり、弱くなったり、腰痛が出てくる。脊椎がずれてくる。[カイロプラクティック](http://d.hatena.ne.jp/keyword/%A5%AB%A5%A4%A5%ED%A5%D7%A5%E9%A5%AF%A5%C6%A5%A3%A5%C3%A5%AF)では背骨が全ての中心とする。咳つがずれると神経が圧迫する。

腹痛の原因が原因だったりする。ストレッチ大事。姿勢を保つ筋肉を鍛えることができる。みんなの体は違うからできないポーズがあってもへこまないで。痛みを感じたらやめてた方がいい。痛みがあるのは不自然なことだから。

立って仕事をするのはいいけど、今まで座ってた人がやると、膝を痛めたりするかも。立方として耳が背骨の中心に来るようにして前傾姿勢を防ぐ。

みんなで実際に立って面白かったなｗ

【ストレッチ方法】

床の上に座る。肩甲骨を壁につけて、４秒かけて頭を前後に倒す。脇の下の筋肉は四つん這いcat/cow、または椅子に座って肩を中心にし、頭を倒す。

 骨盤が丸々と膝にも問題が出る。腹筋を鍛える。丸まらないようにする。でも腹筋運動は危険かもしれないから、エクサザイズボールに座るのが良い。30分座ることから始めよう。

以下はポーズの名前。後でググっておこう。

BoatPose/full pose.背骨をまっすぐにするのがポイント。

Staropen/Close。

Standingholdpose/Ardha

Uttanasana(Halfway Lift)

座りっぱなしは体に良くないけど、そういう仕事だから気をつけた方がいい。

姿勢について知見を得ることができ感動した。

・Run containerized workloads with Lattice

 CloudFoundry[オープンソース](http://d.hatena.ne.jp/keyword/%A5%AA%A1%BC%A5%D7%A5%F3%A5%BD%A1%BC%A5%B9)、もっと簡単なLatticeっていうのを作ったよって話。

Latticeの[アーキテクチャ](http://d.hatena.ne.jp/keyword/%A5%A2%A1%BC%A5%AD%A5%C6%A5%AF%A5%C1%A5%E3)ーを話してくれた。LatticeはDockerやBuildPackを実行できる。CloudFoundyより簡単なのが特徴。適していないのはプロダクション環境ではダメ。Persistent dataもダメ。セキュリティーポリシーが強いのもダメ。使うのはローカルでお願い。

Kubernetesはスケジューラにすぎない。SelfHealing,LoadBalancingは他でやらせること。

Latticeはインストールが楽で、[vagrant](http://d.hatena.ne.jp/keyword/vagrant) upだけでいい。[クラスタ](http://d.hatena.ne.jp/keyword/%A5%AF%A5%E9%A5%B9%A5%BF)ー化できるしterraformも適している。スケジューラの名前はDiego。Task,LongRunningProsess。Schedulingはコンテナの数 [インスタンス](http://d.hatena.ne.jp/keyword/%A5%A4%A5%F3%A5%B9%A5%BF%A5%F3%A5%B9)の数。

【Usage】

Dockerイメージのデプロイや、アプリのスケールアップとか。Builtpack:dropletをつくったら実行。自分のワークロードも作れる。own workloadのことね。

ルーティングレイヤー：デフォルトあるが、変えることもできる。

【Logs】

アプリログを指定。[X-Ray](http://d.hatena.ne.jp/keyword/X-Ray)アプリの[インスタンス](http://d.hatena.ne.jp/keyword/%A5%A4%A5%F3%A5%B9%A5%BF%A5%F3%A5%B9)ディトリブーションゾーンを可視化。X-Rayhは[OSS](http://d.hatena.ne.jp/keyword/OSS)だよ。

Latticeは開発環境で、本番環境はCloudFoundry.でも使い方はほとんど似ていて、コマンドが違うだけ。Latticeでローカルでいじってから始めるのが良さそうだった。インストールも簡単だったし。

・Profiling & Optimizing in Go

Go,Go,Go,Go,Go.

Go言語の話だった。

終始、デモだったので[Emacs](http://d.hatena.ne.jp/keyword/Emacs)の流れるようなデモコーディングにインフラは[Vim](http://d.hatena.ne.jp/keyword/Vim)で、開発は[Emacs](http://d.hatena.ne.jp/keyword/Emacs)でやろうと思いました。

※[Emacs](http://d.hatena.ne.jp/keyword/Emacs)始めます。

go tool pprofはすごい便利そうだった。いろんなツールが有るんだな。

・Lightning Talks Day 2

 MySQL5.7はデフォルトで360日でパスワード変更求められるらしい！これで呪いは回避できたかな。

みんな昨日今日で作ったとは思えない内容で面白かったです。すごかった！

・クロージング

 これで本当に[YAPC](http://d.hatena.ne.jp/keyword/YAPC)は終わりなんだなあと思ったら感慨深いですね。いろんなエンジニアの同窓会にもなってたんだろうなあ。最後の最後で知れてよかったです。こんなにも楽しいカンファレンスって無いんじゃないでしょうか。

[Perl](http://d.hatena.ne.jp/keyword/Perl)は[ワンライナー](http://d.hatena.ne.jp/keyword/%A5%EF%A5%F3%A5%E9%A5%A4%A5%CA%A1%BC)いや、プログラミング書かない人でも、十分楽しめるセッションばかりのカンファレンスなんて無いですよ。今は[perl](http://d.hatena.ne.jp/keyword/perl)以外の言語を書いていて、[perl](http://d.hatena.ne.jp/keyword/perl)から巣立っていった発表者の方々も多かったのではないでしょうか。  
 別の言語や、[Perl](http://d.hatena.ne.jp/keyword/Perl)とは全く関係ないサービス、開発手法について話せるカンファレンスなんて他にないですよ！[Perl](http://d.hatena.ne.jp/keyword/Perl)のコミュニティとそこで育った皆さんの懐の深さが知れました。[Perl](http://d.hatena.ne.jp/keyword/Perl)入学式みたいにプログラミング入門の勉強会があるし、[Perl](http://d.hatena.ne.jp/keyword/Perl)コミュニティっていいですよね。Larryも言ってたけど育っている感じがとってもいいコミュニティだと思います。  

最後の[YAPC](http://d.hatena.ne.jp/keyword/YAPC)今回は2130人参加とのこと、前回は1361人参加だったので、最後にこんなに多くの人が集まったのは凄いと思います。そしてスキルが有ればこんなにも沢山のエンジニアさんと出会えるのって凄いことだと思いました！

そしてスタッフの皆さんお疲れ様でした！楽しかったです！

ありがとうございました！
