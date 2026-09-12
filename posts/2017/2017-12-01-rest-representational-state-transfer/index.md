---
title: "REST(Representational State Transfer)"
date: "2017-12-01"
---

## REST(Representational State Transfer)

Webシステム[アーキテクチャ](http://d.hatena.ne.jp/keyword/%A5%A2%A1%BC%A5%AD%A5%C6%A5%AF%A5%C1%A5%E3)の原則を定義したもの

## 原則

- Client-server
- Stateless
- Cacheable
- Uniform
- interface
- Layered system
- Code-on-demand(optional)

こういう考え方にしたがって作ろうよっていうもの
Webシステムのデザインといってよい

以下のものが求められている

- 可用性
  - いつでもちゃんと返事が来る,応答待ちにならない
- スケーラビリティー
  - 大量のリク[エス](http://d.hatena.ne.jp/keyword/%A5%A8%A5%B9)トを捌ける
- 耐故障性
  - サーバ側でマシンが落ちていても構わない

WEB系企業が推奨しているけど、原則6個を全て使えとは言っていない。

## 原則6個が言っていること

- Client-server:[ユーザインタフェース](http://d.hatena.ne.jp/keyword/%A5%E6%A1%BC%A5%B6%A5%A4%A5%F3%A5%BF%A5%D5%A5%A7%A1%BC%A5%B9)とデータストレージの関心事を分離
  - [ユーザインタフェース](http://d.hatena.ne.jp/keyword/%A5%E6%A1%BC%A5%B6%A5%A4%A5%F3%A5%BF%A5%D5%A5%A7%A1%BC%A5%B9)のポータビリティ、サーバのスケーラビリティ
- Stateless:リク[エス](http://d.hatena.ne.jp/keyword/%A5%A8%A5%B9)ト内にそれを理解するための情報を全て含み、サーバ側に状態を持たせない
  - スケーラビリティ、監視の容易性、故障からの復帰の容易性
  - ステートフルだとやりとりしていたサーバが落ちたら情報が消える。
- Cacheable:キャッシュ可能なものを明確に区別
  - 効率、スケーラビリティ
- Uniform interface:単一インターフェースに統一
  - 単純さ、インターフェースと機能の分離
  - [オブジェクト指向](http://d.hatena.ne.jp/keyword/%A5%AA%A5%D6%A5%B8%A5%A7%A5%AF%A5%C8%BB%D8%B8%FE)プログラミングのメソッドが沢山でてくる。
  - インターフェースはGET、PUT、POST、DELETEの4種類にする。
  - デザインをするのはGET、PUT、POST、DELETEのでしよう。
- Layered system: 階層構造による不要な詳細の隠蔽
  - 複雑さの軽減、依存性の低減
  - 自分の直下のレイヤーだけを知っていればいい
- Code-on-demand(optional):必要な機能の、クライアント側へのオンデマンドでの読み込み(オプション)
  - 実行時の拡張性
