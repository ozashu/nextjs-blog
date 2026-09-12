---
title: "Azure歴0年だけど一ヶ月でAZ-104とAZ-303とAZ-304に合格してAzure Solutions Architect Expertになりました。"
date: "2022-01-15"
---

Azureを触ったことがないのですが、今後触っていくことになったのでキャッチアップがてら資格をとってみました。

Azure経験0でも一ヶ月で資格取得が可能でした。勉強開始からAzure Solutions Architect Expertまで28日間かかっています。
5日から7日間の勉強期間で本記事の勉強方法で試験に合格することが可能でした。
事前知識としては[AWS](http://d.hatena.ne.jp/keyword/AWS) Certified Solutions ArchitectとProfessional Cloud Architectを所持しております。

## Azure Solutions Architect Expert取得まで

[Azure Solutions Architect Expert](https://docs.microsoft.com/ja-jp/learn/certifications/azure-solutions-architect/)を取りたかったので、
AZ-104とAZ-305を取得すれば良いことがわかったので、まずAZ-104を取得しました。
ただAZ-305の申込みがまだできなそうだったので、急遽AZ-303とAZ-304の資格を取ることになりました。

取得順番はAZ-104→AZ-304→AZ-303です。
受けた感想としてはAZ-104はAzureの知識がなくても[AWS](http://d.hatena.ne.jp/keyword/AWS)や[GCP](http://d.hatena.ne.jp/keyword/GCP)の知識があれば少し勉強すれば一発合格できる難易度だと思います。AZ-304は一度目では合格できず追加で問題をとして２日後に再試験で合格しました。
AZ-303は304より難易度が優しいと感じました。こちらは一発合格できました。

AZ-303とAZ-304は2022 年 3 月 31 日に廃止されAZ-305に取って代わるようです。
今後受ける人はAZ-305が受験できるまで待ってもいいと思いますが、
廃止するまでに短期集中でとるのであればAZ-303とAZ-304は問題集の情報が多く対策しやすいということがあるので
受けてしまうのもいいと思います。また資格試験は短期集中で問題をたくさん解いて受験したほうが合格しやすいと思いますのでおすすめです。

本記事では自分が実際にやったAZ-303とAZ-304と事前準備としてのAZ-104の対策情報をシェアしていきます。

## AZ-104とAZ-303とAZ-304の対策の前に

AZ-104とAZ-303とAZ-304の対策は基本的には同じです。
たくさん問題を解いて、関連ドキュメントを読むことです。

ただAzure知識0から問題を解いてドキュメントを読んでも知識が体系的に定着しないと思ったので、
最初は以下の本を買って読み、Azureシステムの運用知識を体系的に学習しました。
運用知識についての図とともに説明があり章末問題と模擬試験がついていたので内容としては申し分ありませんでした。
また[https://docs.microsoft.com/ja-jp/learn/:title](Microsoft%20Learn)もあるのでこちらでもいいと思います。
自分にあったほうでどんな知識が必要なのか確認するといいと思います。

[![合格対策 Microsoft認定試験AZ-104:Microsoft Azure Administratorテキスト＆演習問題](/images/azure-az104-az303-az304-solutions-architect-expert/azure-az104-az303-az304-solutions-architect-expert-1.jpg "合格対策 Microsoft認定試験AZ-104:Microsoft Azure Administratorテキスト＆演習問題")](https://www.amazon.co.jp/exec/obidos/ASIN/B09HT3HX8W/tokusa1093-22/)

[合格対策 Microsoft認定試験AZ-104:Microsoft Azure Administratorテキスト＆演習問題](https://www.amazon.co.jp/exec/obidos/ASIN/B09HT3HX8W/tokusa1093-22/)

- 作者:[吉田薫](http://d.hatena.ne.jp/keyword/%B5%C8%C5%C4%B7%B0)
- [リックテレコム](http://d.hatena.ne.jp/keyword/%A5%EA%A5%C3%A5%AF%A5%C6%A5%EC%A5%B3%A5%E0)

[Amazon](https://www.amazon.co.jp/exec/obidos/ASIN/B09HT3HX8W/tokusa1093-22/)

これでAzureの大体の知識が定着したと思います。

## AZ-104とAZ-303とAZ-304を問題をたくさん解いて対策

あとは問題集を解いて間違ったら、そのキーワードで検索し該当するドキュメントを読んでいくという方法です。
問題集は3種類使いました。それぞれ質と実際の試験問題にどれだけ近いかを感覚で書いていきます。

### 某[AWS](http://d.hatena.ne.jp/keyword/AWS)社の研修でも使っていると噂のサイトで問題を解く

- 質

[https://acloudguru.com/:title](A%20Cloud%20Guru)と言われるCloud Serviceのト[レーニン](http://d.hatena.ne.jp/keyword/%A5%EC%A1%BC%A5%CB%A5%F3)グサイトです。
全て英語なのですが、某Cloudベンダーの社員も研修とかで使ったりしていると聞いたことがあるので質は高いと思います。
Azure知識が0なので質の高い解説がありものからあたっていくのがいいと思います。

- 使い方

自分はAZ-104,AZ-303,AZ-304のト[レーニン](http://d.hatena.ne.jp/keyword/%A5%EC%A1%BC%A5%CB%A5%F3)グコースがあります。
単元ごとに英語での解説動画がありますが、自分は模擬問題だけ解きました。
解くと解説と関連するドキュメントのLinkもあり勉強しやすいです。
全部英語なのでDeepLで解説を訳して学習しました。2~3周は解説を読み込みました。
時間がある人は自分の苦手なところは解説動画をみるのもいいと思います。

- 実際の試験との近さ

10%~20%ぐらいです。これだけ解いても合格するのは難しいとは思います。
模擬問題と実際の試験だと形式も若干違ったりしました。
実際の試験だとケース問題がありますが、A Cloud Guruだとそれが省略されて出題されたりしているので、
これだけ解いて受験すると主題形式に戸惑ったりしてしまいます。

### Udemyにある怪しい試験問題集を解く

たまにUdemyで講座を取り消されているような怪しい問題集です。
AZ-304はA Cloud Guruと後述の問題集だけで受けたのですが、6割で合格点の7割には届かなかったので
AZ-303とAZ-304はこれを使いました。

- 質

全編英語ですが解説と関連ドキュメントのリンクがついていますので、回答の質は高いと思います。
またA Cloud Guruとは違い実際の問題と同じ形式です。なのでケース問題とかもこれで問題になれることができます。
後述する問題集よりは質がいいので英語でもいい人にはおすすめです。

- 使い方

問題をといて解答と解説と関連ドキュメントをひたすら読んでいきます。

- 実際の試験との近さ

問題数も多いので網羅性が高いです。
30~40%以上は確実に得点源を確保することができると思います。
特にAZ-304は文章や図から回答のヒントを読み込むト[レーニン](http://d.hatena.ne.jp/keyword/%A5%EC%A1%BC%A5%CB%A5%F3)グが必要です。
これは解説と関連ドキュメントのリンクつきなのでAZ-303とAZ-304を受験するなら解いておくと合格率が上がります。

[AZ-303 - MS Azure Architect Technologies - Practice Tests | Udemy](https://www.udemy.com/share/105KK23@NUEDb8k81DY-eEeqCNWxVAdA35CJ0kOdjA6noVPhUpVUNSj_y2lfXQERTGAfng==/)

[AZ-304 - Microsoft Azure Architect Design - Practice Tests | Udemy](https://www.udemy.com/share/105e2i3@W3TWv6yiNTjvzYWzJvbpuqVMgPJop5e-d5v0GyObBM46sE8aOVo9ykWL--AsRg==/)

### [Amazon](http://d.hatena.ne.jp/keyword/Amazon)で売っているillegal風な怪しい問題集を解く

たまに[Kindle](http://d.hatena.ne.jp/keyword/Kindle)で発売停止になったりする怪しい問題集です。
Azure試験問題を掲載しているサイトの問題を自動翻訳しているだけです。
なのでネットで問題を探して解くのもありだと思いますが、
[機械翻訳](http://d.hatena.ne.jp/keyword/%B5%A1%B3%A3%CB%DD%CC%F5)でもいいから日本語で解きたい人には買うのはありだと思います。

- 質

まず解説がありません。一問一答形式で問題と答えのみです。
元にされている問題もおそらく非公式なもので答えが本当に正しいかは怪しいです。
ただ出題内容が本番の試験に近いので解いておくと実際の試験で戸惑う確率は下げられます。

- 使い方

解説がないのでひたすら問題を解いて答えを覚えるです。
理解できないときは公式ドキュメントにあたって理解を深めます。

- 実際の試験との近さ

問題数も多いので網羅性が高いです。
30~50%以上は確実に得点源を確保することができると思います。
[AWS](http://d.hatena.ne.jp/keyword/AWS)や[GCP](http://d.hatena.ne.jp/keyword/GCP)など[クラウド](http://d.hatena.ne.jp/keyword/%A5%AF%A5%E9%A5%A6%A5%C9)知識があればAZ-104はこれだけやるでも受かると思います。

[![ズバリ！！的中問題集 AZ-104 マイクロソフト アジュール 管理者 認定試験 Microsoft Azure Administrator](/images/azure-az104-az303-az304-solutions-architect-expert/azure-az104-az303-az304-solutions-architect-expert-0.jpg "ズバリ！！的中問題集 AZ-104 マイクロソフト アジュール 管理者 認定試験 Microsoft Azure Administrator")](https://www.amazon.co.jp/exec/obidos/ASIN/B09NJXWJ7W/tokusa1093-22/)

[ズバリ！！的中問題集 AZ-104 マイクロソフト アジュール 管理者 認定試験 Microsoft Azure Administrator](https://www.amazon.co.jp/exec/obidos/ASIN/B09NJXWJ7W/tokusa1093-22/)

- 作者:[ITベンダー資格試験研究会](http://d.hatena.ne.jp/keyword/IT%A5%D9%A5%F3%A5%C0%A1%BC%BB%F1%B3%CA%BB%EE%B8%B3%B8%A6%B5%E6%B2%F1)

[Amazon](https://www.amazon.co.jp/exec/obidos/ASIN/B09NJXWJ7W/tokusa1093-22/)

[![ズバリ！！ 的中問題集 AZ-303 マイクロソフト　アジュール Microsoft Azure Architect Technologies 日本語版](/images/azure-az104-az303-az304-solutions-architect-expert/azure-az104-az303-az304-solutions-architect-expert-0.jpg "ズバリ！！ 的中問題集 AZ-303 マイクロソフト　アジュール Microsoft Azure Architect Technologies 日本語版")](https://www.amazon.co.jp/exec/obidos/ASIN/B09NKYTZML/tokusa1093-22/)

[ズバリ！！ 的中問題集 AZ-303 マイクロソフト　アジュール Microsoft Azure Architect Technologies 日本語版](https://www.amazon.co.jp/exec/obidos/ASIN/B09NKYTZML/tokusa1093-22/)

- 作者:[ITベンダー資格試験研究会](http://d.hatena.ne.jp/keyword/IT%A5%D9%A5%F3%A5%C0%A1%BC%BB%F1%B3%CA%BB%EE%B8%B3%B8%A6%B5%E6%B2%F1)

[Amazon](https://www.amazon.co.jp/exec/obidos/ASIN/B09NKYTZML/tokusa1093-22/)

[![ズバリ！！ 的中問題集 AZ-304 マイクロソフト アジュール Microsoft Azure Architect Design 日本語版](/images/azure-az104-az303-az304-solutions-architect-expert/azure-az104-az303-az304-solutions-architect-expert-0.jpg "ズバリ！！ 的中問題集 AZ-304 マイクロソフト アジュール Microsoft Azure Architect Design 日本語版")](https://www.amazon.co.jp/exec/obidos/ASIN/B09NKZG1HB/tokusa1093-22/)

[ズバリ！！ 的中問題集 AZ-304 マイクロソフト アジュール Microsoft Azure Architect Design 日本語版](https://www.amazon.co.jp/exec/obidos/ASIN/B09NKZG1HB/tokusa1093-22/)

- 作者:[ITベンダー資格試験研究会](http://d.hatena.ne.jp/keyword/IT%A5%D9%A5%F3%A5%C0%A1%BC%BB%F1%B3%CA%BB%EE%B8%B3%B8%A6%B5%E6%B2%F1)

[Amazon](https://www.amazon.co.jp/exec/obidos/ASIN/B09NKZG1HB/tokusa1093-22/)

## まとめ

Azure知識0からAzure Solutions Architect Expertの資格を一ヶ月で取る方法を説明していきました。
もちろんこれでAzureの知識がついたとはとてもではないですが、言えません。

ただこれで頻出するキーワードや[AWS](http://d.hatena.ne.jp/keyword/AWS)や[GCP](http://d.hatena.ne.jp/keyword/GCP)に該当するAzureのキーワード。
それに重要そうなドキュメントのリンクなどを知ることができました。

[AWS](http://d.hatena.ne.jp/keyword/AWS)や[GCP](http://d.hatena.ne.jp/keyword/GCP)やAzureなどは毎年機能追加がありドキュメントも日々更新されています。
そんなCloud製品を使っていく上でこんな機能があったなとか、ドキュメントがあったなと検索キーワードがあると
役に立つと思います。

なのでこの試験を受かればAzure Solutions Architectになるではなく、
今後なっていくために役に立つものだと思います。資格に証明期限があるのもそのためだと思います。(あと資格ビジネスですね)。

ベンダーの資格を持ってなくても使いこなしている人は実際多数だと思います。一方、[AWS](http://d.hatena.ne.jp/keyword/AWS)の資格とかで[Twitter](http://d.hatena.ne.jp/keyword/Twitter)にたくさん持っている人がいますが、あれはそういう芸風だと思っています(どういう芸風?)。

どんな道を目指すかは人それぞれだと思いますが、本記事が[クラウド](http://d.hatena.ne.jp/keyword/%A5%AF%A5%E9%A5%A6%A5%C9)技術の勉強の一助となれば幸いです。
