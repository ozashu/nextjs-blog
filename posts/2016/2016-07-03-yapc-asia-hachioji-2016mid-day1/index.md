---
title: "【報告】YAP(achimon)C::Asia Hachioji 2016midの感想【一日目】"
date: "2016-07-03"
---

ブログを書くまでがYAP(achimon)Cなのかな？
05:00まで新宿で飲んでいたけど、頑張って昼前に起きました。
ひっさびさの勉強会(というかカンファレンス)に行ってきてやっていくぞ！
という気持ちが高まったので感想ブログ書きます。
最近ではポエムと言うのでしょうか、
そういうのは気にせず書いていくぞ！

## 参加したセッション

- [MySQL](http://d.hatena.ne.jp/keyword/MySQL) 5.7 + [MySQL](http://d.hatena.ne.jp/keyword/MySQL) Fabric + [MySQL](http://d.hatena.ne.jp/keyword/MySQL) Routerでぼっこぼこに {する|された} はなし
- [AWS](http://d.hatena.ne.jp/keyword/AWS)のオートスケールとなかよく付き合う
- 「全国タクシー」を支える[クラウド](http://d.hatena.ne.jp/keyword/%A5%AF%A5%E9%A5%A6%A5%C9)インフラ([AWS](http://d.hatena.ne.jp/keyword/AWS)とAzureと、時々[GCP](http://d.hatena.ne.jp/keyword/GCP))
- Fluentdが新Plugin [API](http://d.hatena.ne.jp/keyword/API)実装においていかに自由すぎる旧[API](http://d.hatena.ne.jp/keyword/API)との互換性を確保したかの話
- Browser Extension開発四方山話
- HashiCorp Vaultで[MySQL](http://d.hatena.ne.jp/keyword/MySQL)アカウントを管理しよう
- [LT]DMM英会話はいいぞ by hiragram
- [LT]エンジニアやエンジニアを目指している人が見るべきアニメ by すてにゃん
- [LT] ESLintを使ってES2015の記法を覚える by sota1235
- [LT応募] [PHP](http://d.hatena.ne.jp/keyword/PHP)のライブラリをcomposer経由で公開した話 by にゃー (mirai\_iro)
- [LT]そんな[スクラム](http://d.hatena.ne.jp/keyword/%A5%B9%A5%AF%A5%E9%A5%E0)なら止めちまえ by i47\_rozary
- [LT] おまえらのBBQは間違っている by Daisuke Maki (lestrrat)

## セッションの感想

- [MySQL](http://d.hatena.ne.jp/keyword/MySQL) 5.7 + [MySQL](http://d.hatena.ne.jp/keyword/MySQL) Fabric + [MySQL](http://d.hatena.ne.jp/keyword/MySQL) Routerでぼっこぼこに {する|された} はなし

MySQL5.7のおはなし
mysqlfailoverはread\_onlyをいじられない劣化MHAときき、MHA使っていこって思いました。
[MySQL](http://d.hatena.ne.jp/keyword/MySQL) Fabricで死ぬまで使い続けて検証してて凄いなと思いました。
地雷原を踏み抜くモチベーションはどこから湧いてくるのだろうか、
なんて思っていたら「技術は勝手には枯れないから誰かが枯らしにいかないといけない」
と言っていたのでなるほどと思った。
枯れた技術は勝手に枯れてないで、誰かが除草剤撒いて枯らしているらしい。
slackに[MySQL](http://d.hatena.ne.jp/keyword/MySQL) Casualがあるらしい。今ってslackで技術の話がされているのか。
MLは古いのかしら。プロダクトのチャンネルに入って技術追っていきたい。
知らなかったから乗り遅れてる感じがして焦る。

- [AWS](http://d.hatena.ne.jp/keyword/AWS)のオートスケールとなかよく付き合う

[fujiwara](http://d.hatena.ne.jp/keyword/fujiwara)さんて[カヤック](http://d.hatena.ne.jp/keyword/%A5%AB%A5%E4%A5%C3%A5%AF)の人だったんですね。ヒカリエの人と勘違いしていた。
弊社はオートスケール使ってるのかな。手動で増設している認識だぞ。。
アクセスの増減に合わせて[インスタンス](http://d.hatena.ne.jp/keyword/%A5%A4%A5%F3%A5%B9%A5%BF%A5%F3%A5%B9)をたてるの便利っぽいし、お金の節約になるらしい。
ただwebサーバをいくら増やしても、
RDSが[ボトルネック](http://d.hatena.ne.jp/keyword/%A5%DC%A5%C8%A5%EB%A5%CD%A5%C3%A5%AF)になればEC2をいくら増やせても、負荷の増大が早過ぎると間に合わないとのこと。
CMがあるから、事前にアクセスが増えることがわかるなら、予め台数を増やせばok。
障害が発生した[インスタンス](http://d.hatena.ne.jp/keyword/%A5%A4%A5%F3%A5%B9%A5%BF%A5%F3%A5%B9)は自動で削除してくれる。そして、代わりの新しい[インスタンス](http://d.hatena.ne.jp/keyword/%A5%A4%A5%F3%A5%B9%A5%BF%A5%F3%A5%B9)を自動で起動してくれる。
つまり設定された台数を保とうとしれくれるもの。
[インスタンス](http://d.hatena.ne.jp/keyword/%A5%A4%A5%F3%A5%B9%A5%BF%A5%F3%A5%B9)削除はterminateになるので、くっついてるEBSも削除されてしまう。
これってログとかも消えてしまうから、S3とかへfluentd使ってログを飛ばす必要があるんだね。
小規模ならオートスケールあってもなくても、金額的に特にかわらないらしいので、
個人とかなら使わなそうだなあ。
オートスケールを考慮していないシステムにあとから導入するといろいろ大変らしい。
minはこの台数を最低限維持しようとするなので、一時的にminの台数を下回ることがある。
desired(希望台数)この台数を維持しようとする。スケーリングポリシーのアクセスにあわせた台数にしてくれる。
OSは起動するけどヘルスチェックが通らないと課金地獄になる。
maxはこの台数以上は起動しない。低めに設定するとスケールできないことがある。
スケーリングポリシーはCloudWatchのメトリクスを元にしたアラームをトリガにする。
spotかdemandか。spotは入札価格をスポット価格が上回ると[インスタンス](http://d.hatena.ne.jp/keyword/%A5%A4%A5%F3%A5%B9%A5%BF%A5%F3%A5%B9)削除されることある。
動作中のスポット価格(需要と供給の価格)できまる。安い時は安いが使いドコロが難しい。
起動した[インスタンス](http://d.hatena.ne.jp/keyword/%A5%A4%A5%F3%A5%B9%A5%BF%A5%F3%A5%B9)がpullさせる。AMIを毎回作る。起動するだけでOKだけど、
設定変更やアプリ修正で毎回AMIを作りなおさないといけない。
デプロイ頻度が多くないサービスなら可能。
S3などに[アーカイブ](http://d.hatena.ne.jp/keyword/%A5%A2%A1%BC%A5%AB%A5%A4%A5%D6)を保存、各[インスタンス](http://d.hatena.ne.jp/keyword/%A5%A4%A5%F3%A5%B9%A5%BF%A5%F3%A5%B9)で取得、展開する。[AWS](http://d.hatena.ne.jp/keyword/AWS) CodeDeploy,mamiyaなどを使う。
もしくは[rsync](http://d.hatena.ne.jp/keyword/rsync)などでプル型デプロイの自作はbuild途中の状態が取得されないように気をつけよう。
Gitから取得してデプロイは小規模でやっていくならよいが、[リポジトリ](http://d.hatena.ne.jp/keyword/%A5%EA%A5%DD%A5%B8%A5%C8%A5%EA)ツールなので正しい使い方ではない。
あるホストから全台に○○([ssh](http://d.hatena.ne.jp/keyword/ssh))という発想をやめる。
監視で必要なこと動的に監視対象を増減できるツールを使う。mackerekやzabbixを使い、
一台一台みるより、オートスケーリンググループ全台を集約したメトリクスをみる。
一台落ちたぐらいでくよくよしない。監視停止にに失敗することもある。
個別の[インスタンス](http://d.hatena.ne.jp/keyword/%A5%A4%A5%F3%A5%B9%A5%BF%A5%F3%A5%B9)にこだわりすぎない。プロセスみたいなもの。
[インスタンス](http://d.hatena.ne.jp/keyword/%A5%A4%A5%F3%A5%B9%A5%BF%A5%F3%A5%B9)に永続物を残さない。ディスクでなくメモリみたいなものと考える。
この発想てないんだよね。一台一台落ちないようにしている。。。
でもこの考えはSRE的にはどうなるのかなあ。
[CPU使用率](http://d.hatena.ne.jp/keyword/CPU%BB%C8%CD%D1%CE%A8)は40~50%ぐらいで起動するのがよい。100%が50%の二倍の処理ではない。
サーバの性能処理をフルに使わせるのも重要なのかなと思っていましたが、
分散処理が大事。
減らすときは直近1時間の最高が25%になったら。増やすときは大胆に、減らすときはすぐ減らさないのがキモ。
HTTPでアプリが応答したらOKにするヘルスチェックがよい。
EC2で、最新では大丈夫だけど、過去に使用されたことがある[IPアドレス](http://d.hatena.ne.jp/keyword/IP%A5%A2%A5%C9%A5%EC%A5%B9)が再割当てされた[インスタンス](http://d.hatena.ne.jp/keyword/%A5%A4%A5%F3%A5%B9%A5%BF%A5%F3%A5%B9)がRedisにつながらないことがあったらしい。
こういうことに気づけるためにもアプリケーションレベルのヘルスチェックをしとくとよい。
ヘルスチェックが通らないと[インスタンス](http://d.hatena.ne.jp/keyword/%A5%A4%A5%F3%A5%B9%A5%BF%A5%F3%A5%B9)が落ちるから。

- 「全国タクシー」を支える[クラウド](http://d.hatena.ne.jp/keyword/%A5%AF%A5%E9%A5%A6%A5%C9)インフラ([AWS](http://d.hatena.ne.jp/keyword/AWS)とAzureと、時々[GCP](http://d.hatena.ne.jp/keyword/GCP))

発表している方がモ[ダン](http://d.hatena.ne.jp/keyword/%A5%C0%A5%F3)な環境でないとか言ってたけど、
サーバの構成とかみるとそんなことなくてモ[ダン](http://d.hatena.ne.jp/keyword/%A5%C0%A5%F3)にやっていると思いました。
会社的に物理サーバとかで管理してそ〜とか思ったので意外でした。
[AWS](http://d.hatena.ne.jp/keyword/AWS)はわかるけど、なんでAzureも使っているのかなあ。
Azureをなんで使うのかききたかったなあ。
辞めていくことも決めてないのかしら。

- Fluentdが新Plugin [API](http://d.hatena.ne.jp/keyword/API)実装においていかに自由すぎる旧[API](http://d.hatena.ne.jp/keyword/API)との互換性を確保したかの話

fluentdやっていきたい。
新しいverが発表するときに、古いverで動いているpluginをいじらないでも
使えるようにすることの大変さが伝わってきたし、
ユーザが離れないようにするために大事なことなんだなあと思いました。
新しいverをみんな使っていこう。

- Browser Extension開発四方山話

extension友達っていいな。
[vivaldi](http://d.hatena.ne.jp/keyword/vivaldi)とかの拡張とか作っていきたいと思いました。

- HashiCorp Vaultで[MySQL](http://d.hatena.ne.jp/keyword/MySQL)アカウントを管理しよう

HashiCorp Vaultは機密情報を管理してくれるものらしい。
アカウント管理がめんどくさそうな運用だなあと思ったけど、
お客さんの情報を取り扱っている[ECサイト](http://d.hatena.ne.jp/keyword/EC%A5%B5%A5%A4%A5%C8)の会社の人らしいので
上場企業だから厳しいんだろうなあと思いました。
上場すると[コンプライアンス](http://d.hatena.ne.jp/keyword/%A5%B3%A5%F3%A5%D7%A5%E9%A5%A4%A5%A2%A5%F3%A5%B9)が厳しくなるので仕方ないんだと思います。

- [LT]DMM英会話はいいぞ by hiragram

DMM英会話やっていくぞって気持ちになった。

- [LT]エンジニアやエンジニアを目指している人が見るべきアニメ by すてにゃん

さすらいのお勉強野郎ｗ
[BPS](http://d.hatena.ne.jp/keyword/BPS)最高ですよね〜
slackのクライアントをいじって上司のアイコンと発言をアニメヒロインにするの
いいソリューションw
実装していくぞ！

- [LT] ESLintを使ってES2015の記法を覚える by sota1235

ESLintで叱られてやっていく
JSとかよくわからないな〜

- [LT応募] [PHP](http://d.hatena.ne.jp/keyword/PHP)のライブラリをcomposer経由で公開した話 by にゃー (mirai\_iro)

たのしくやっていく
発表するの大事だと思いました。

- [LT]そんな[スクラム](http://d.hatena.ne.jp/keyword/%A5%B9%A5%AF%A5%E9%A5%E0)なら止めちまえ by i47\_rozary

オレオレ[スクラム](http://d.hatena.ne.jp/keyword/%A5%B9%A5%AF%A5%E9%A5%E0)を使って失敗しているよくある話。
[スクラム](http://d.hatena.ne.jp/keyword/%A5%B9%A5%AF%A5%E9%A5%E0)マスターが聴いたら、その使い方じゃダメって言われるやつでは。
[スクラム](http://d.hatena.ne.jp/keyword/%A5%B9%A5%AF%A5%E9%A5%E0)をカスタマイズで使って、オリジナルの使われ方しないけど
[スクラム](http://d.hatena.ne.jp/keyword/%A5%B9%A5%AF%A5%E9%A5%E0)はダメだって言われる可哀想な子。
PMは唯一解がないので、適当なものを使ってやっていこう。

- [LT] おまえらのBBQは間違っている by Daisuke Maki (lestrrat)

僕たちは今まで紙を食べていたんだ
ヒントは3cm以上

## まとめ

懇親会とか初めてだったので、何を話せばいいかもわからないし、
知り合いが０なので緊張して店の前で何分も待ち意を決して入店した。
隣の席が[fujiwara](http://d.hatena.ne.jp/keyword/fujiwara)さんで早速ビビった。
でも質問したら優しく答えてくれた。
上場したら待遇とか変わりましたか？とか
子育てってどうですかとか、
ISUCONでなんでそんな強いんですかとか質問したら答えてくれた。
優しい大人だ。尊敬。
スキルセットは業務のために揃えていくもので、コンテストで勝つために揃えるものじゃないよ
って言われて、色々ともやもやしていたキャリアとかモチベーションがなんか解決した感じがしました。
モチベーションが全回復したのでやっていきたい。
あと勉強会で発表していくのが言いって言われたのでやっていきたい。
あと酔ったkoemuさんにやっていかないと明日死ぬぞって言われたのでやっていくぞ！
勉強会でも発表しろと圧をかけられたからやっていくぞ！
すてにゃんさんとアニメの話したかったな。
あとごまさんには結婚おめでとうございますをいい忘れた。
ペパボの[Android](http://d.hatena.ne.jp/keyword/Android)エンジニアの人は名前聞き忘れたのが残念。
エンジニアの友達というか知り合いが0なので辛い。
発表していかないと知られないし、発表していこう。
コミュ力も鍛えていこう。
外の人と会うのは最高なのでもっと勉強会とかカンファレンスに行こう！
２日目もやっていくぞ！

以上。
