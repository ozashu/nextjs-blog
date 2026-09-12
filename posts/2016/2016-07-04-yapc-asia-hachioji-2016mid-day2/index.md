---
title: "【報告】YAP(achimon)C::Asia Hachioji 2016midの感想【二日目】"
date: "2016-07-04"
---

ブログを書くまでがYAP(achimon)C。
夜中までブログの感想を書いていたら寝るのが遅くなりましたが、
午前中に起きて参加に成功しました。
楽しかったカンファレンスだったので、みなさんもブログ書いていきましょう！

## 参加したセッション

- [スマホ](http://d.hatena.ne.jp/keyword/%A5%B9%A5%DE%A5%DB)時代の[Bot](http://d.hatena.ne.jp/keyword/Bot)アプリのつくり方
- セキュリティテストサービスを開発運営してきた2年間
- この[RDB](http://d.hatena.ne.jp/keyword/RDB)について私は驚くべき闇を見つけたがそこを発表するにはネットは怖すぎる
- AIって言葉流行っているけど、実際どう組み込むのさ？
- 出張版[MySQL](http://d.hatena.ne.jp/keyword/MySQL) Casual - [クラウド](http://d.hatena.ne.jp/keyword/%A5%AF%A5%E9%A5%A6%A5%C9)時代の[MySQL](http://d.hatena.ne.jp/keyword/MySQL)構築運用を考える 2016夏
- kubernetes を使ってサービスを加速させる取り組み
- [ユニクロ](http://d.hatena.ne.jp/keyword/%A5%E6%A5%CB%A5%AF%A5%ED)の レジから学ぶ goroutine
- [Webサービス](http://d.hatena.ne.jp/keyword/Web%A5%B5%A1%BC%A5%D3%A5%B9)におけるキャッシュ戦略
- [LT]身近に潜む tokenize 2016 ver
- [LT]ES6/Reactが当たり前の現場に入って感じたこと
- [LT][Vagrant](http://d.hatena.ne.jp/keyword/Vagrant)であっぷあっぷした話など
- [LT]やる夫は[Perl](http://d.hatena.ne.jp/keyword/Perl)を学ぶようです
- [LT]新米エンジニアの育て方
- [LT] ES2015 の class でアプリケーションを書いてみた話
- [LT]レゴでベルトコンベアーを作り、異常検知をやってみた
- [LT] aruduinoでPCの電源ボタンを押してみる

## セッションの感想

- [スマホ](http://d.hatena.ne.jp/keyword/%A5%B9%A5%DE%A5%DB)時代の[Bot](http://d.hatena.ne.jp/keyword/Bot)アプリのつくり方

<https://speakerdeck.com/yusukebe/sumahoshi-dai-falsebotapurifalsetukurifang>

LINEと[Facebook](http://d.hatena.ne.jp/keyword/Facebook)のメッセージアプリに[BOT](http://d.hatena.ne.jp/keyword/BOT)という概念と実装が入ってくるというお話でした。
メッセージのやりとりというものはプライベートなものなのに、そこに[BOT](http://d.hatena.ne.jp/keyword/BOT)が入ってくる。
BOTAPIを使ったお話を聞けました。
まず[BOT](http://d.hatena.ne.jp/keyword/BOT)とは人間のように振舞うコンピュータの総称で、
公式[API](http://d.hatena.ne.jp/keyword/API)ドキュメントには和訳もあるらしい。[BOT](http://d.hatena.ne.jp/keyword/BOT)を作成して最初の友達追加は50人だが、
申請すれば5000人まで追加できるようになる。
[BOT](http://d.hatena.ne.jp/keyword/BOT)は[BOT](http://d.hatena.ne.jp/keyword/BOT)対1ユーザのインタラクションになるとのこと。
midといものがあり、個別[BOT](http://d.hatena.ne.jp/keyword/BOT)アプリにとってのユーザー識別子で、
midを保持して一斉送信なとができるがフィットしない。
また、ボタンを組み込めて、ボタンを押すとユーザに特定の発言をさせることができるので、
それを受け取って続きの処理をしたりできる。
リッチメッセージとテキストメッセージ、画像メッセージがある。
リッチメッセージは全て画像で、座標で矩形を指定してアクションを決められる。
すごいと思ったインタラクションは、
指定した文字列を発言させるコマンドなど、タップしたら指定した文字列を発言させるといものがあって、
この情報は[SDK](http://d.hatena.ne.jp/keyword/SDK)のソースにのみ載っているとのことでした。
公式ドキュメントだけでなく、ソースを読むことが大事って言うことがわかりました。
自前[BOT](http://d.hatena.ne.jp/keyword/BOT)アプリはcallbackを受け取り、メッセージに含まれるmidを取得しmidめがけてメッセージ([JSON](http://d.hatena.ne.jp/keyword/JSON))を返す。
LINE [BOT](http://d.hatena.ne.jp/keyword/BOT) [SDK](http://d.hatena.ne.jp/keyword/SDK)はLINEの[Github](https://github.com/line/line-bot-sdk-ruby)があるので使ってみましょう。
リッチメッセージの作成や署名の検証も一行で書けるし、テストも載っています。
LINEからWEBサーバのforkしたプロセスが画像生成を兼ねる。
Imagerで画像作成し、[memcached](http://d.hatena.ne.jp/keyword/memcached)にデータをキャッシュさせている。
midをベースにセッションIDを作成するので、セッション管理ができる。
あと[BOT](http://d.hatena.ne.jp/keyword/BOT)の利用状況を[Google Analytics](http://d.hatena.ne.jp/keyword/Google%20Analytics) でト[ラッキング](http://d.hatena.ne.jp/keyword/%A5%E9%A5%C3%A5%AD%A5%F3%A5%B0)することが可能。

- セキュリティテストサービスを開発運営してきた2年間

安全なWEBアプリケーションの世界のためにセキュリティテストサービスを開発運営しているおはなし。
[脆弱性](http://d.hatena.ne.jp/keyword/%C0%C8%BC%E5%C0%AD)検査にはホワイトボックスと[ブラックボックス](http://d.hatena.ne.jp/keyword/%A5%D6%A5%E9%A5%C3%A5%AF%A5%DC%A5%C3%A5%AF%A5%B9)があり
VAddy,owasp zap,burpsuiteなどのセキュリティテストサービスがある。
他にはOS,[ミドルウェア](http://d.hatena.ne.jp/keyword/%A5%DF%A5%C9%A5%EB%A5%A6%A5%A7%A5%A2)の検査などがある。
今回はWEBアプリの検査のおはなしで、
WEBアプリの検査で大事なことはアプリケーションの正しい動作を把握すること。
検査時は正しい動作をしていることを再現させる事が大事。
例えばログインセッション期限、[CSRF](http://d.hatena.ne.jp/keyword/CSRF)対策トークン期限など。
継続的セキュリティテストをしていこう。
デプロイ中に適宜[脆弱性](http://d.hatena.ne.jp/keyword/%C0%C8%BC%E5%C0%AD)診断をする。
既存の開発フローに[脆弱性](http://d.hatena.ne.jp/keyword/%C0%C8%BC%E5%C0%AD)診断を導入させて、開発フローに適応させる。
どうやるかはCI連携させて無人運用で、正しい動作を自動で再現させるのを目指す。
また、CIの中で流すと時間がかかるので、検査時間をWEBアプリに絞る。
これらをDevSecOpsと言われている。
DevSecOpsをググっても記事はコンサルベースでソリューションが書かれていない。
つまり開発者向けのセキュリティサービスがない。
なので、セキュリティサービス作ったのがVADDYとのことでした。
gitpush→webhook→[脆弱性](http://d.hatena.ne.jp/keyword/%C0%C8%BC%E5%C0%AD)検査→通知の流れで、Vaddyはフリープランあるとのことなので
ためしに使っていきたいな。
海外展開のお話がよかったです。
海外に売ることは隣の家に醤油を借りに行くより簡単だからやっていこうと精神で、
英語対応がもちろん必要でサイト、ドキュメント、ブログ、サポートを英語化。
英語はいろんな業者を比較検討して翻訳者にアウトソースしたとのこと。
ドルの定期決済にする。[PayPal](http://d.hatena.ne.jp/keyword/PayPal)は使っていないらしいが理由はよくわからなかった。
文字列や時間をUTF,[UTC](http://d.hatena.ne.jp/keyword/UTC)にするのも大事らしい。
宣伝としてブログURLを[Reddit](http://d.hatena.ne.jp/keyword/Reddit),hackerniewsにしたらしく
[Reddit](http://d.hatena.ne.jp/keyword/Reddit)に投稿しまくったらアカウントがbanされたとことですので、気をつけましょう。
あとは[まとめサイト](http://d.hatena.ne.jp/keyword/%A4%DE%A4%C8%A4%E1%A5%B5%A5%A4%A5%C8)に掲載させてsackshareや<http://devopsbookmark.com> にpullrecとばしている。
あとは海外にブースを出して、テーブルクロスとかそれっぽい方がいいというのは知見でした。
あとノベルティやステッカーだけでは人があまりこないが、少なくても深い話ができるからいいとのこと。
お金があるところには勝てないですよね。
あとはサービスをよくするにはミートアップするのがいいとのことでした。
フィードバックはなかなかこないのでミートアップするとカジュアルに聞けたりするとのことですが、
ここはログを取って数値化してくっていうのはできないのかなあと思いました。
やらないことを決めるのが難しいから、全ての要望を実装するとぼやけるので、
チーム内の意識を統一するのが大事とも言っていた。
ここもフィードバックは数値化してやることを決めたほうがよさそうだと思いました。
検査内容を絞り、従量課金をしないというのは、これは日本人には合ってそう。
定額制がいいよね。
リッチなレポート、報告会は提供しないで、基本アウトソースでやっているとのこと。
99 Designs,Intercom,Sndgrid。VAddyはVAddyで検査する。
管理画面を省略するが、サポートは優先度高い。
なぜなら気付きが多いので、定期相談会などもしているとのことでした。
サポートは大事、楽しむの大事、[SaaS](http://d.hatena.ne.jp/keyword/SaaS)はいいぞというおはなしでした。

- この[RDB](http://d.hatena.ne.jp/keyword/RDB)について私は驚くべき闇を見つけたがそこを発表するにはネットは怖すぎる

今回のベストトークです。

聴衆のアンケート結果で[MySQL](http://d.hatena.ne.jp/keyword/MySQL)がほとんどで、次点で[PostgreSQL](http://d.hatena.ne.jp/keyword/PostgreSQL)でした。
部屋が人いっぱいで密度がすごかったです。
RDSというか[MySQL](http://d.hatena.ne.jp/keyword/MySQL)人気ですね。

データベースの寿命はアプリより長い。なぜならデータベースの中身はなかなか変えられないから。
その分闇も多くなってくるとのこと。
[MySQL](http://d.hatena.ne.jp/keyword/MySQL)の型に激怒のはなし。型変換、日付型で正しく認識されない仕様がある。
O/Rマッパーがあるせいとのことだったが、よくわからなかったの調べよう。
[MySQL](http://d.hatena.ne.jp/keyword/MySQL)で絵文字の寿司ビール問題はutf8mb4\_binを使うと回避できるがバージョンに注意。
[MySQL](http://d.hatena.ne.jp/keyword/MySQL)においてはNULLではないがNULLでもあることもある。[PHP](http://d.hatena.ne.jp/keyword/PHP)に引っ張られた仕様らしい。
[PostgreSQL](http://d.hatena.ne.jp/keyword/PostgreSQL)ではpgadmin3の翻訳が酷い話だけど、男は黙って[CUI](http://d.hatena.ne.jp/keyword/CUI)ですね！
基本的には正規化して、外部キー制約を貼るのがいいとのことでした。
RDSエンジニアはバグとヒューマンエラーから守るのが大事なのでまずは[SQL](http://d.hatena.ne.jp/keyword/SQL)勉強しろとのこと。
データ量がメモリに乗らなくなり、あふれた瞬間遅くなる。  
ORMが完璧なクエリを書いてくれるとは限らないといっていた。
[MySQL](http://d.hatena.ne.jp/keyword/MySQL)と[PostgreSQL](http://d.hatena.ne.jp/keyword/PostgreSQL)の使い分けはどうしているのかなあ。
できることがそれぞれあるから、その実例とか知っていきたい。
あと[SQL](http://d.hatena.ne.jp/keyword/SQL)や[RDB](http://d.hatena.ne.jp/keyword/RDB)の勉強はどうやるのがよいかな。[Wordpress](http://d.hatena.ne.jp/keyword/Wordpress)の運用とかかしら。
インフラエンジニアがどう学ぶのがいいのか知りたかった、
スロークエリが出ているかとか、INDEXを貼るとしか覚える機会なさそうなんだよなあ。
データの死はサービスの死ですよね。DBが[ボトルネック](http://d.hatena.ne.jp/keyword/%A5%DC%A5%C8%A5%EB%A5%CD%A5%C3%A5%AF)になるとWEBサーバ全台死ぬ奴だ。
DBエンジニアはサービスがヒットした会社で必要でスタートアップとかには必要が無いと言っていた。
DBエンジニアは金を持っている会社で必要になるとのことで、
DBエンジニアは仕事に困らないよね〜〜
[SQL](http://d.hatena.ne.jp/keyword/SQL)の勉強は[SQL](http://d.hatena.ne.jp/keyword/SQL)実践入門と[アンチパターン](http://d.hatena.ne.jp/keyword/%A5%A2%A5%F3%A5%C1%A5%D1%A5%BF%A1%BC%A5%F3)、DB実践入門がおすすめ本なので、
本を読んだり経験談からも学んでいけるので、
苦労した話や失敗談を共有していこうというお話でした。
Delete\_flag なのに9とかNULLとか入ってるケースもあったので命名大事。
メモリに載せること！データがメモリに乗らなくなって突然DBが遅くなるので。
サイト表示で一ページ目ははやいけど、2ページ以降になるとサイトが重くなるのは
だいたいorder by とlimit offsetのせいで、
それは全部読み込んでインデックスきかないから遅くなる。
一ページ目はインデックス効いているが、2ページ目以降は効かない。
それは実行計画ログをみればわかる。スローログだけでなく実行計画ログを見よう。
実行計画とはなんだろうか。
[実行計画についてはこちらをみて勉強しよう](https://speakerdeck.com/soudai/phpernizhi-tutehosiirdbfalseshi-sofalse2)

- AIって言葉流行っているけど、実際どう組み込むのさ？

AIってなんなのさというおはなし。
MSの[エバンジェリスト](http://d.hatena.ne.jp/keyword/%A5%A8%A5%D0%A5%F3%A5%B8%A5%A7%A5%EA%A5%B9%A5%C8)さんが自社サービスと他社さんと一緒にやった事例の紹介。
これからはAI/Big Dataだ！と経営者に言われたエンジニアさん向けのお話でした。

Q:どんなことができるの？
A:例えばInstgramをクロールして自社製品がどんなつぶやきされているかわかりますよ〜

Q:どうやるの？
A:IaaSはやれることが多いが工数はかかる。
[SaaS](http://d.hatena.ne.jp/keyword/SaaS)はやれることは画像や音声の認識が得意な[API](http://d.hatena.ne.jp/keyword/API)をつかうことなので工数は短い。
今回はMSの[SaaS](http://d.hatena.ne.jp/keyword/SaaS)のCongnitive Serviceのおはなし。
ただ[API](http://d.hatena.ne.jp/keyword/API)は[トランザクション](http://d.hatena.ne.jp/keyword/%A5%C8%A5%E9%A5%F3%A5%B6%A5%AF%A5%B7%A5%E7%A5%F3)課金なので使いすぎに注意が必要。
他社との事例で安いネットワークカメラ使えば監視カメラと一緒に使える。
アロバっていう会社がやっているサービス。
カメラと顔認識で入店と退店で性別、年齢、店内動線追跡やエリア滞在などログに貯めることできる。
人力でもできるが、[バイ](http://d.hatena.ne.jp/keyword/%A5%D0%A5%A4)トが適当に入力したりPOS入力は精度が粗い。
[Microsoft](http://d.hatena.ne.jp/keyword/Microsoft)っていろんなことしてるんですねえ。。
アロバビューさん事例では監視カメ[ラプラス](http://d.hatena.ne.jp/keyword/%A5%E9%A5%D7%A5%E9%A5%B9)画像解析による
[マーケティング](http://d.hatena.ne.jp/keyword/%A5%DE%A1%BC%A5%B1%A5%C6%A5%A3%A5%F3%A5%B0)ソリューションとして来店者の性別年齢をリアルタイム解析するお話でした。
個人でやっていくものじゃなさそうだなあと思いました。
会社のお金でやるものですね〜〜

- 出張版[MySQL](http://d.hatena.ne.jp/keyword/MySQL) Casual - [クラウド](http://d.hatena.ne.jp/keyword/%A5%AF%A5%E9%A5%A6%A5%C9)時代の[MySQL](http://d.hatena.ne.jp/keyword/MySQL)構築運用を考える 2016夏

[MySQL](http://d.hatena.ne.jp/keyword/MySQL)運用のおはなし。MHAは無停止フェイルオーバの一つの到達点とのこと。
[クラウド](http://d.hatena.ne.jp/keyword/%A5%AF%A5%E9%A5%A6%A5%C9)時代はRDS。だが技術的に退化していない？
たとえば料金倍、フェイルオーバーが遅い、
[インスタンス](http://d.hatena.ne.jp/keyword/%A5%A4%A5%F3%A5%B9%A5%BF%A5%F3%A5%B9)変更(スケール変更)にシャットダウンを伴う。制限が多い。
アニメーションがすごいけど、どうやったんだろう。
運用したくないからRDSで退化したというお話でした。
マネージドサービスのRDSを使っていればそうですよねえ。
DBサーバ組んでいくかRDSオーロラ使っていくのか、、
Azureの[MySQL](http://d.hatena.ne.jp/keyword/MySQL)のサービスを期待しててと言っていたが、
Azure...

- kubernetes を使ってサービスを加速させる取り組み

<https://speakerdeck.com/koudaiii/kubernetes-woshi-tutesabisuwojia-su-saseruqu-rizu-mi>

k8s
新規からproductionサービスを公開するにはどれくらいかかるかのお話。
サービスを加速させるには変化に強いインフラ基盤が必要で、どうやって用意するか。
WantedlyではCode wins arguments： [MTG](http://d.hatena.ne.jp/keyword/MTG)するならcodeを書いて検証している。
エンジニアは仮説を考えるよりプロトタイプを作って早く学習する。
営業は5くらい契約をとるなどする。
自動化とセルフサービス化はInfra as codeをすすめて開発の人がコマンドで用意できるようにすれば
インフラも開発も自分の仕事を集中することができる。
昔辛かったおはなしで、開発からインフラに依頼が来るとタスクがたまり、
[ボトルネック](http://d.hatena.ne.jp/keyword/%A5%DC%A5%C8%A5%EB%A5%CD%A5%C3%A5%AF)になり、日々のタスクに追われることになっていたらしい。。
その解決するためにはインフラチームの人を増やすと一人一人の力を上げることで解決を図ったとのこと。
どうやって力を上げていったんだろうか。気になるな〜〜
インフラの自動化のお話を聞けた。
ここでついにk8sのお話が！k8sのお話までが長かったけどいい話でしたね！
コンテナとして何が動いているかだけ意識していれば良い世界で、
どのコンテナがどの[インスタンス](http://d.hatena.ne.jp/keyword/%A5%A4%A5%F3%A5%B9%A5%BF%A5%F3%A5%B9)で動いているかわからないからDatadog使って調べる。
くーばーねいてすと読むのか。どういうものかもっと知りたかったなあ。
あとで調べてみよう。

- [ユニクロ](http://d.hatena.ne.jp/keyword/%A5%E6%A5%CB%A5%AF%A5%ED)の レジから学ぶ goroutine

goroutineとチャネルのおはなし。
go routeineの並列制御数はCPUのコア数と同じくらいでいいとのことでした。

- [Webサービス](http://d.hatena.ne.jp/keyword/Web%A5%B5%A1%BC%A5%D3%A5%B9)におけるキャッシュ戦略

WABアプリケーションレイヤーでのキャッシュのおはなし。
キャッシュの目的はI/Oの効率化で使う。I/Oが[ボトルネック](http://d.hatena.ne.jp/keyword/%A5%DC%A5%C8%A5%EB%A5%CD%A5%C3%A5%AF)になる。
いろいろ改善するが、めんどくさい。
キャッシュでI/Oで効率化するが、沼で万能じゃなくて問題もある。
exprireが1時間だと外部のコンテンツが更新されても反映されないので
意図的にキャッシュを適宜更新させないといけない。
引数やクエリを使ったkey生成を透過的キャッシュ。DBIx::ORMapperがある。
cache\_clearDB側の更新の反映はexpireしたあとになる。
基本的にはフロントに近いところでキャッシュしてあげるとよい。
過去のISUCONではHTML事前生成してSSIで投稿させて点数を上げる手法が合ったらしく、
inclideさせるとはやい。
cacahe thundering herdグラフ問題がある。
アプリケーションによって戦略が変わっていくので難しそうでした。

- [LT]身近に潜む tokenize 2016 ver

住所、電話番号、市外局番[総務省](http://d.hatena.ne.jp/keyword/%C1%ED%CC%B3%BE%CA)資料の資料(doc,pdf)っていうのがクスッてきた。
S式むずかしい

- [LT]ES6/Reactが当たり前の現場に入って感じたこと

突発の勉強会とコードレビューやってくれるっていうのがよいなあ。
コミュニケーションをとって教えてくれるというのは大事ですよね。
人ははやい。
レビューで細かく指摘を行い、ChatOpsもやっていくの大切。

- [LT][Vagrant](http://d.hatena.ne.jp/keyword/Vagrant)であっぷあっぷした話など

[vagrant](http://d.hatena.ne.jp/keyword/vagrant)使えばvirtual boxのアレがなくなるのいいよね

- [LT]やる夫は[Perl](http://d.hatena.ne.jp/keyword/Perl)を学ぶようです

やる夫で学ぶスレの朗読
やる夫のスライドはどうやって作ったんだお？
AA崩れてないし新しかった。
言語処理100本ノックもやっていくのよさそうだ。
[Perl](http://d.hatena.ne.jp/keyword/Perl)入学式次回は行ってみよう。

- [LT]新米エンジニアの育て方

技術愛を持っていない場合は
やりたいことのために技術力をつけていこうというのは
いいモチベーションの保ち方だと思いました。
業務の問題解決のためにやっていく気持ち。

- [LT] ES2015 の class でアプリケーションを書いてみた話

[Javascript](http://d.hatena.ne.jp/keyword/Javascript)って難しそうな環境ですね。。。

- [LT]レゴでベルトコンベアーを作り、異常検知をやってみた

レゴ工場すごい

- [LT] aruduinoでPCの電源ボタンを押してみる

電子回路の設計のおはなしで、EAGLEで回路設計して
外部にアウトソースして基盤を発注すれば簡単とのことでした。

## そうろん

いいカンファレンスでした！楽しかったです！
今年は[YAPC](http://d.hatena.ne.jp/keyword/YAPC)なくて残念でしたが、やぱちーのおかげでよい夏になりました！
面白かったので来年もやってほしいです！
今年は懇親会でいろいろお話出来たので、
来年は発表する側になりたいです。
知り合いのエンジニアが0でしたので、
来年があったら知り合いのエンジニアを0からインクリメントさせたい。
エンジニアの友達や知り合いが0問題を解決する必要があると思いました。
今年と来年の目標は外部で発表してアウトプットをしていきたいと思いました。
スタッフのみなさまはお疲れ様でした！

以上。
