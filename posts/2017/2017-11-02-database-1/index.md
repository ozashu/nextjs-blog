---
title: "データベース①"
date: "2017-11-02"
---

データベースについて必要なキーワードをまとめていきます。

# [トランザクション](http://d.hatena.ne.jp/keyword/%A5%C8%A5%E9%A5%F3%A5%B6%A5%AF%A5%B7%A5%E7%A5%F3)と同時実行制御

## [トランザクション](http://d.hatena.ne.jp/keyword/%A5%C8%A5%E9%A5%F3%A5%B6%A5%AF%A5%B7%A5%E7%A5%F3)について

- 複数のクエリをひとまとまりにした処理で、commit時に処理を確定する

## ACID

特性について、各頭文字それぞれ

Atomicity(原子性)

- データ操作が全部成功or全部失敗のどちらかになることを保証

Consistency(一貫性)

- データ操作での整合性が守られていること

Isolation(分離性もしくは隔離性、独立性)

- それぞれの処理が矛盾なく実行されること

Durability(持続性)
\* [トランザクション](http://d.hatena.ne.jp/keyword/%A5%C8%A5%E9%A5%F3%A5%B6%A5%AF%A5%B7%A5%E7%A5%F3)処理が完了し、完了通知をユーザが受けた時点で、その操作が永続的となり結果が失われないこと

## [ANSI](http://d.hatena.ne.jp/keyword/ANSI)/ISO [SQL](http://d.hatena.ne.jp/keyword/SQL)標準

[ANSI](http://d.hatena.ne.jp/keyword/ANSI)/ISO [SQL](http://d.hatena.ne.jp/keyword/SQL)標準 について

- アンシーは米国内の工業分野の標準化組織で、ベンダーに依存しない[SQL](http://d.hatena.ne.jp/keyword/SQL)のこと

## [ANSI](http://d.hatena.ne.jp/keyword/ANSI)/ISO [SQL](http://d.hatena.ne.jp/keyword/SQL)標準 が定義する分離レベルについて

非コミット読み取り(リードアンコミッテッド)

- 読込 のタイミングによっては読込がブロックされる場合がある時に選ぶとブロックしない

コミット済み読み取り(リードコミッテッド)

- 初回クエリ発行時にコミットされているデータを読み込み、その後は最新のクエリの実行開始時点でコミットされたデータを読む

再読み込み可能読み込み(リピータブルリード)

- 初回クエリ発行時にコミットされているデータを読み込み、その後も同じ結果セットが返され他の[トランザクション](http://d.hatena.ne.jp/keyword/%A5%C8%A5%E9%A5%F3%A5%B6%A5%AF%A5%B7%A5%E7%A5%F3)がコミットしても、反映されない

直列化可能(シ[リアラ](http://d.hatena.ne.jp/keyword/%A5%EA%A5%A2%A5%E9)イザブル)

- 複数の[トランザクション](http://d.hatena.ne.jp/keyword/%A5%C8%A5%E9%A5%F3%A5%B6%A5%AF%A5%B7%A5%E7%A5%F3)処理を順次実行させる

## 分離レベルの緩和によって起こる 3 つの現象について

ダーティリード

- ある[トランザクション](http://d.hatena.ne.jp/keyword/%A5%C8%A5%E9%A5%F3%A5%B6%A5%AF%A5%B7%A5%E7%A5%F3)がコミットされる前に、別の[トランザクション](http://d.hatena.ne.jp/keyword/%A5%C8%A5%E9%A5%F3%A5%B6%A5%AF%A5%B7%A5%E7%A5%F3)からデータを読み出せてしまう現象

曖昧な読み取り

- ある[トランザクション](http://d.hatena.ne.jp/keyword/%A5%C8%A5%E9%A5%F3%A5%B6%A5%AF%A5%B7%A5%E7%A5%F3)が以前読み込んだデータを再度読み込んだ時、2回目以降の結果が1回目と異なる現象

ファントムリード

- ある[トランザクション](http://d.hatena.ne.jp/keyword/%A5%C8%A5%E9%A5%F3%A5%B6%A5%AF%A5%B7%A5%E7%A5%F3)を読み込んだ時、選択できるデータが現れたり、消えたりする現象

## ロック[タイムアウト](http://d.hatena.ne.jp/keyword/%A5%BF%A5%A4%A5%E0%A5%A2%A5%A6%A5%C8)と[デッドロック](http://d.hatena.ne.jp/keyword/%A5%C7%A5%C3%A5%C9%A5%ED%A5%C3%A5%AF)

ロック[タイムアウト](http://d.hatena.ne.jp/keyword/%A5%BF%A5%A4%A5%E0%A5%A2%A5%A6%A5%C8)について

- 更新と更新で、後からきた[トランザクション](http://d.hatena.ne.jp/keyword/%A5%C8%A5%E9%A5%F3%A5%B6%A5%AF%A5%B7%A5%E7%A5%F3)がロックを取得しようとして、ブロックされる。一定時間まって、その間にロックが取得できない場合はロック待ち[タイムアウト](http://d.hatena.ne.jp/keyword/%A5%BF%A5%A4%A5%E0%A5%A2%A5%A6%A5%C8)となる

[デッドロック](http://d.hatena.ne.jp/keyword/%A5%C7%A5%C3%A5%C9%A5%ED%A5%C3%A5%AF)について

- ロックを保持したまま、お互いにロック済みのリソースに対してロックが必要な処理を行っても、状況が変わらない状態

# テーブル設計の基礎

## ルール

主キーについて説明できる

- 必ずレコードを一行に特定できる情報

## 識別子

- データを一意に特定できるID

## 正規形について

第1正規形について

- テーブルのセルに複合的な値を含んでいない

第2正規形について

- 全ての列が主キーのみに関数従属をもち、主キーの一部にだけ従属するという列は存在しない

第3正規形について

- 推移関数従属がある場合はテーブルを分ける。

## ER 図

ER 図について

エンティティ

- 現実世界にある特定の型(クラス)

リレーションシップ

- エンティティ間に成立する1:多、多:1, 多:多の[写像](http://d.hatena.ne.jp/keyword/%BC%CC%C1%FC)

# バックアップと[リカバリ](http://d.hatena.ne.jp/keyword/%A5%EA%A5%AB%A5%D0%A5%EA)

## [DBMS](http://d.hatena.ne.jp/keyword/DBMS) が持つ 3 つの仕組み

## WAL について

DBのデータファイルへの変更を直接行わず、「ログ」として変更内容を記述した「ロ[グレコ](http://d.hatena.ne.jp/keyword/%A5%B0%A5%EC%A5%B3)ード」を書き込み、同期する仕組み
\* ディスクに連続的に書き込むため、ランダムに書き込むよりパフォーマンスがいい
\* ディスクへの書き込み容量、回数を減らすことができる
\* データベースバッファを利用して、データベースのデータファイルへの変更を効率よく行える
\* [MySQL](http://d.hatena.ne.jp/keyword/MySQL)では[InnoDB](http://d.hatena.ne.jp/keyword/InnoDB)ログ

## データベースバッファについて

データファイルへの入出力をデータベースバッファ経由に一本化
[MySQL](http://d.hatena.ne.jp/keyword/MySQL)の場合

1. 更新対象のデータを含むページが、バッファプールにあるかどうか確認され、なければデータファイルからバッファプールに読み込まれる
2. 更新がバッファプールの当該ページに対して行われる
3. 上記2の更新内容が、コミットとともにログに記録される。バッファプールで変更されたが、まだデータファイルに書き込まれていないページは、ダーティページとしてバッファプール内で扱われる
4. ダーティページは後から適当なタイミングでまとめてデータファイルに書き込まれる(チェックポイント)
5. チェックポイント以前のログファイルは不要になる。また、更新とともに手順が繰り返される

## クラッシュ[リカバリ](http://d.hatena.ne.jp/keyword/%A5%EA%A5%AB%A5%D0%A5%EA)について

- WAL: 最後にコミットした[トランザクション](http://d.hatena.ne.jp/keyword/%A5%C8%A5%E9%A5%F3%A5%B6%A5%AF%A5%B7%A5%E7%A5%F3)の更新情報をもつ
- データベースバッファ:クラッシュにより内容はすべて失われる
- データベースファイル:最後のチェックポイントまでの更新情報を待つ
- ロール[フォワ](http://d.hatena.ne.jp/keyword/%A5%D5%A5%A9%A5%EF)ード
  - クラッシュ後、再起動するとWALとデータベースファイルのチェックポイント後の更新情報を使って、データベースファイルをクラッシュ時までにコミットされた状態に戻す
  - ロール[フォワ](http://d.hatena.ne.jp/keyword/%A5%D5%A5%A9%A5%EF)ード[リカバリ](http://d.hatena.ne.jp/keyword/%A5%EA%A5%AB%A5%D0%A5%EA)(バイナリログ(WAL)を使用して[フルバック](http://d.hatena.ne.jp/keyword/%A5%D5%A5%EB%A5%D0%A5%C3%A5%AF)アップ時点以降、任意のポイントまでリストアする)

## [リカバリ](http://d.hatena.ne.jp/keyword/%A5%EA%A5%AB%A5%D0%A5%EA)

PITR(Point-in-time recovery) について

- [MySQL](http://d.hatena.ne.jp/keyword/MySQL)(バイナリログ)
  - PITRにはバイナリログ
    - クラッシュ[リカバリ](http://d.hatena.ne.jp/keyword/%A5%EA%A5%AB%A5%D0%A5%EA)には[InnoDB](http://d.hatena.ne.jp/keyword/InnoDB)ログ
- [PostgreSQL](http://d.hatena.ne.jp/keyword/PostgreSQL)(WALログ)

## バックアップ 3 つの観点

ホットバックアップとコールドバックアップ

- ホットバックアップについて
  - オンラインバックアップとも呼ばれ、バックアップ対象のデータベースを停止せず、稼働したままバックアップデータを取得する
  - mysqldump
- コールドバックアップについて
  - オフラインバックアップとも呼ばれ、バックアップ対象のデータベースを停止し、バックアップデータを取得
  - データ[ディレクト](http://d.hatena.ne.jp/keyword/%A5%C7%A5%A3%A5%EC%A5%AF%A5%C8)リ以下の[ディレクト](http://d.hatena.ne.jp/keyword/%A5%C7%A5%A3%A5%EC%A5%AF%A5%C8)リとファイルをOSのコマンドでコピー

論理バックアップと物理バックアップ

- 論理バックアップについて
  - [SQL](http://d.hatena.ne.jp/keyword/SQL)ベースのバックアップで、テキスト形式に準じるフォーマットでバックアップ
- 物理バックアップについて
  - データ領域をダンプして、バイナリなどバックアップ
