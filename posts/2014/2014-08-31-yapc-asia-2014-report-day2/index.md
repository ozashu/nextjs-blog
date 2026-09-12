---
title: "【報告】YAPC::Asiaの感想【二日目】"
date: "2014-08-31"
---

【ブログを書くまでが[YAPC](http://d.hatena.ne.jp/keyword/YAPC)】

[YAPC](http://d.hatena.ne.jp/keyword/YAPC)のブログを書くために開設したので、

もちろん二日目の感想を書かせていただきます。

一日目の興奮とアルコールが抜けきれなかったので、中々寝付けませんでした。

その結果。

> [#yapcasia](https://twitter.com/hashtag/yapcasia?src=hash) 寝坊した！
>
> — oza\_shu (@oza\_shu) [2014, 8月 30](https://twitter.com/oza_shu/statuses/505509221744377856)

一番聞きたかった「突然ITインフラを任された人のための…監視設計入門」には

ギリギリ間に合ったので良かったです。

そんな感じで[YAPC](http://d.hatena.ne.jp/keyword/YAPC)二日目が始まりました。

[![http://instagram.com/p/sTgCFynCRe/](/images/yapc-asia-2014-report-day2/yapc-asia-2014-report-day2-0.png)](http://instagram.com/p/sTgCFynCRe/)

[二日目きたー。](http://instagram.com/p/sTgCFynCRe/)

【参加したセッション】

突然ITインフラを任された人のための…監視設計入門  
[Perl](http://d.hatena.ne.jp/keyword/Perl) Mongersのためのstrace入門  
[Perl](http://d.hatena.ne.jp/keyword/Perl)入学式 in [YAPC](http://d.hatena.ne.jp/keyword/YAPC)::Asia Tokyo 2014  
あやかNow!  
そんなにビッグでもないデータ処理手法の話  
Lightning Talks Day 2  
キーノート   
[YAPC](http://d.hatena.ne.jp/keyword/YAPC)::Asia Tokyo 2014 - クロージング

【セッションの感想】

・突然ITインフラを任された人のための…監視設計入門

→インフラエンジニアとして一番身近でためになると思い楽しみにしていたセッションでした。NOWで現行踏襲という設計で障害が絶賛発生中な現場にいるので、設計とはどうやるのか気になってました。

これは質問しそびれたことが一つあって、[オープンソース](http://d.hatena.ne.jp/keyword/%A5%AA%A1%BC%A5%D7%A5%F3%A5%BD%A1%BC%A5%B9)のミドル使ってるWEB系の会社は障害発生時どのような対処をしているのか気になった。OS,NW,DB,運用MW,業務MW幅広い領域だと思う。[SIer](http://d.hatena.ne.jp/keyword/SIer)はベンダー製品と手厚いサポートがあるけど、WEB系はどうしているのか幅広いスキルと知識を持って対処できるのか、てかどうやったらWEB系のインフラで働けるのか！ハードウェア保守としては[AWS](http://d.hatena.ne.jp/keyword/AWS)みたいな[クラウド](http://d.hatena.ne.jp/keyword/%A5%AF%A5%E9%A5%A6%A5%C9)の時代が来たら死ぬと思いました。

・[Perl](http://d.hatena.ne.jp/keyword/Perl) Mongersのためのstrace入門

→先頭でstraceの見方の話を聴いていてら、後方から上手く動いてないんじゃないかとか

声が聞こえてきて、セッション中に登壇者に話しかけるのすげえ！誰だろうと思ったら

弾小飼さんでCooool!!と思いました。もちろんstraceはちゃんと動いていて、straceの見方を教えていただき勉強になった。普段はstraceをとってもサポートに投げて終わりと他人任せな事しているので、自分でもちゃんと調査します。反省

時間に追われて発表をしているからラフなセッションというのは中々難しいのかなとも思いましたが、ぶっ込む弾小飼さんCooool!

・[Perl](http://d.hatena.ne.jp/keyword/Perl)入学式 in [YAPC](http://d.hatena.ne.jp/keyword/YAPC)::Asia Tokyo 2014

→[Perl](http://d.hatena.ne.jp/keyword/Perl)入学式#1補講以来の参加だったので、かなりパニクりながら練習問題に取り組んだので時間があっという間に過ぎました。サポートの方々に助けられながらも[Perl](http://d.hatena.ne.jp/keyword/Perl)を動かせてプログラミングすごい！たのしい！という感覚を得られました！9/23の第3回は参加しますので、雅な[Perl](http://d.hatena.ne.jp/keyword/Perl)を読んで望みます。最終問題の同じお店が出ないコードが未だに書けていなくて、ブログに載せようとしたのですが間に合わなかった。

そういえば一日目のHUBで話したお姉さんとは別の席だったから、話す機会なく残念です。

・あやかNow!

→[Ruby](http://d.hatena.ne.jp/keyword/Ruby)アイドルがいた！かき氷うまい！無限コーヒー！

・そんなにビッグでもないデータ処理手法の話

→何をしたいか。サイズはいくつか。それにあったプラットフォームを選ぼう！という話だったと思います。Frameworkや[API](http://d.hatena.ne.jp/keyword/API)等の概念がわからず技術的なことは余りわからなかった。取り敢えずわかったことは[ビッグデータ](http://d.hatena.ne.jp/keyword/%A5%D3%A5%C3%A5%B0%A5%C7%A1%BC%A5%BF)はペタサイズのデータと聞いて、[ビッグデータ](http://d.hatena.ne.jp/keyword/%A5%D3%A5%C3%A5%B0%A5%C7%A1%BC%A5%BF)に関わることはなさそうだなあというのは分かった。

> [#yapcasia](https://twitter.com/hashtag/yapcasia?src=hash) [ビッグデータ](http://d.hatena.ne.jp/keyword/%A5%D3%A5%C3%A5%B0%A5%C7%A1%BC%A5%BF)はどんな世界で扱っているのか。官公庁でも扱ってない木ガス。
>
> — oza\_shu (@oza\_shu) [2014, 8月 30](https://twitter.com/oza_shu/statuses/505616552767401984)

・Lightning Talks Day 2

→よいLTばかりでした。ドラ娘も良い。有名な人達を早速フォロー！きっと技術的なことと変態的なことがTLにいっぱい流れるんだろう楽しみ！

・キーノート

→趣味と仕事の話。3年目になり仕事にも慣れ始めてきて漫然とした態度で仕事をするようになった自分には刺さりました。自分がしたいことを仕事にしたい！エンジニアってめっちゃ楽しい！と思う人が増えると世界がよくなるんだろうなあ。そういう姿勢で仕事もしたいとも思います。100%受託の仕事をしていますが、受託は新しい人と技術に出会えると聴いて、受託なんてと腐らずに得られるものは得ようと思います。20代になにをするかは大事って話は20代後半に突入した自分には何かやらないとって思いをさせてくれました。これからどんなエンジニアになりたいか、勉強していろんな人に出会って、[ロールモデル](http://d.hatena.ne.jp/keyword/%A5%ED%A1%BC%A5%EB%A5%E2%A5%C7%A5%EB)を見付けたいと思います。もっとエンジニアらしく振る舞いたいです。

・[YAPC](http://d.hatena.ne.jp/keyword/YAPC)::Asia Tokyo 2014 - クロージング

→来年もあると嬉しいです！技術的にリベンジしたい気持ちでいっぱいです。技術的にも分かることを伸ばして来年はいろんな人と技術的なことを話したいです！エンジニアの人たちってこんなにいるんだと感激しました。

今回は1361人参加とのことで、スキルが有ればこんなにも沢山のエンジニアさんと出会えるのって凄いことだと思いました！懇親会来年はワイワイの中に入れるようにしたい！

そしてスタッフの皆さんお疲れ様でした！楽しかったです！

ありがとうございました！

[YAPC](http://d.hatena.ne.jp/keyword/YAPC)のために開設したこのブログも、せっかくだから勉強した技術的なことや勉強会の感想など書いていこうかなあ。

そういえば一つ自慢話、この間の神楽坂ゆかさんのライブ最前列でした！

世界一かわいい人をすごく近くで見れた。( ･ㅂ･)و ̑̑ ｸﾞｯ !
