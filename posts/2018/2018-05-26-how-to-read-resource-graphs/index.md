---
title: "リソースグラフの見方"
date: "2018-05-26"
---

[cacti](http://d.hatena.ne.jp/keyword/cacti)とgrafanaのグラフの見方について調べました。

# [cacti](http://d.hatena.ne.jp/keyword/cacti)グラフの見方

まずグラフを見るときは長いスパンでの確認と単位に気を付けること

## サーバステータス・OS系

- CPU Utilization
  - コアごとにCPU使用率を表示させる
- Context Switches
  - サーバ側がカウンタなので、前回の処理からの差分を描画
  - 「Context Switches」はCPUでの処理対象プロセスなどの切り替え回数を示している。
  - プロセスの並列度が高く単位時間あたりの処理が多いシステムでは、値が大きくなる。
- Forks
  - サーバ側がカウンタなので、前回の処理からの差分を描画
  - 「Forks」はプロセス処理であるForkの実行回数を示している。
  - プロセスの生成はCPUコストのかかる処理。
  - このグラフの値が常時大きい場合には、無駄なプロセス生成や外部プロセス呼び出しをしていないか、
    必要だとしても、それをライブラリ呼び出しに変更できないか要検討
- Interrupts
  - サーバ側がカウンタなので、前回の処理からの差分を描画
  - 「Interrupts」はネットワーク送受信などによる割り込みの数
  - ネットワーク送受信が多かったりすると増える。
- Load Average
  - サーバ側の値をそのまま表示
  - 1 Minute Average:データ取得時点から直近1分間の実行街キュー数の平均値
  - 5 Minute Average:データ取得時点から直近5分間の実行街キュー数の平均値
  - [ロードアベレージ](http://d.hatena.ne.jp/keyword/%A5%ED%A1%BC%A5%C9%A5%A2%A5%D9%A5%EC%A1%BC%A5%B8)の値を読み解くのが難しいため、性能面の指標としては使うことができない。
  - 値の変化は状況の変化を表している。
    負荷の指標としては、そのシステムが提供するサービス(HTTPなどの)[応答時間](http://d.hatena.ne.jp/keyword/%B1%FE%C5%FA%BB%FE%B4%D6)をチェックする
    性能の限界を越えると一気に[ロードアベレージ](http://d.hatena.ne.jp/keyword/%A5%ED%A1%BC%A5%C9%A5%A2%A5%D9%A5%EC%A1%BC%A5%B8)の値が跳ね上がる。
    急激な変化があった場合には、他の指標と見比べて、[ボトルネック](http://d.hatena.ne.jp/keyword/%A5%DC%A5%C8%A5%EB%A5%CD%A5%C3%A5%AF)が発生していないか確認する。
    [ロードアベレージ](http://d.hatena.ne.jp/keyword/%A5%ED%A1%BC%A5%C9%A5%A2%A5%D9%A5%EC%A1%BC%A5%B8)が高いから処理が遅くなることはありえず、処理がおそくなっていることが[ロードアベレージ](http://d.hatena.ne.jp/keyword/%A5%ED%A1%BC%A5%C9%A5%A2%A5%D9%A5%EC%A1%BC%A5%B8)として現れるという指標
- Memory
  - Used　Real:[実メモリ](http://d.hatena.ne.jp/keyword/%BC%C2%A5%E1%A5%E2%A5%EA)使用量
  - Buffers:バッファとして利用中のメモリ容量
  - Cache:キャッシュとして利用中のメモリ容量
  - Unused Real:[仮想メモリ](http://d.hatena.ne.jp/keyword/%B2%BE%C1%DB%A5%E1%A5%E2%A5%EA)使用量
  - Used Swap:Swapの読み書き量
  - Total Real:全メモリ容量
- ディスク関連のグラフ
  - Disk Elapsed IO Time (ms)
  - サーバ側がカウンタになっているので、前回の処理からの差分を描画
  - IO Time:I/O時間
  - IO Time Weighted:I/O総所要時間
  - 「IO Time」に対して「IO Time Weighted」が大きい場合、ディスクI/Oに対して性能が不足している。
- Disk Operations
  - サーバ側がカウンタになっているので、前回の処理からの差分を描画
  - Reads:ディスク読み込み要求数
  - Reads Merged:マージされたディスク読み込み要求数
  - Writes:ディスク書き込み要求数
  - Writes Merged:マージされたディスク書き込み要求数
  - 「Reads」+「Writes」＝「Io [Ops](http://d.hatena.ne.jp/keyword/Ops)」
  - 「Merged」はmergeされたI/O要求数
  - I/O処理を効率化するためにサーバがI/O要求をまとめることがある。
  - 基本的なI/O要求数は「Reads」と「Writes」で確認でき、「Merged」を見つけることで効率化の程度が確認できる
- Disk Read/Write Time
  - サーバ側がカウンタになっているので、前回の処理からの差分を描画
  - Time Spent Reading 読み込みに要した時間
  - Time Spent Reading 書き込みに要した時間
  - Disk Sectors Read/Written
  - Sectors Read:読み込みセクタ数
  - Sectors Written:書き込みセクタ数
- Disk Space
  - Used:利用中のディスク容量
  - Total:全容量
- [TCP](http://d.hatena.ne.jp/keyword/TCP) Connection
  - サーバの値をそのまま表示
  - 「ESTABLISHED or CLOSE-WAIT」「ESTABLISHED」ステータスのソケット数、「CLOSE\_WAIT」ステータスのソケット数
  - ESTABLISHED や CLOSE-WAITはプロセスがアタッチされた状態のため、
  - この数が大きいということはサーバ側の処理の並列数が高い
- Network Traffic
  - サーバ側がカウンタで、前回の処理からの差分を描画
  - Inbound Inbound Traffic(受信)
  - Outbound Outbound Traffic（送信）
- ネットワーク帯域利用量
  - 数値が頭うちになっていれば、ネットワーク帯域不足
- [APC](http://d.hatena.ne.jp/keyword/APC) cache purges
  - ※[Alternative](http://d.hatena.ne.jp/keyword/Alternative) [PHP](http://d.hatena.ne.jp/keyword/PHP) Cache ([APC](http://d.hatena.ne.jp/keyword/APC)) は、[PHP](http://d.hatena.ne.jp/keyword/PHP) の実行コードをキャッシュする仕組み
  - ファイルキャッシュと、ユーザのキャッシュで[APC](http://d.hatena.ne.jp/keyword/APC)がキャッシュを削除したサイズ
- [APC](http://d.hatena.ne.jp/keyword/APC) file cache hits and misses
  - Hits:ファイルキャッシュのヒット率
  - Misses:ファイルキャッシュのミス率
    キャッシュヒットとは、命令処理に必要なデータが[キャッシュメモリ](http://d.hatena.ne.jp/keyword/%A5%AD%A5%E3%A5%C3%A5%B7%A5%E5%A5%E1%A5%E2%A5%EA)に存在し、[キャッシュメモリ](http://d.hatena.ne.jp/keyword/%A5%AD%A5%E3%A5%C3%A5%B7%A5%E5%A5%E1%A5%E2%A5%EA)からデータを読み込むことができることです。
    またキャッシュミスとは、命令処理に必要なデータが[キャッシュメモリ](http://d.hatena.ne.jp/keyword/%A5%AD%A5%E3%A5%C3%A5%B7%A5%E5%A5%E1%A5%E2%A5%EA)に存在せず、[キャッシュメモリ](http://d.hatena.ne.jp/keyword/%A5%AD%A5%E3%A5%C3%A5%B7%A5%E5%A5%E1%A5%E2%A5%EA)からデータを読み込むことができないことです。
    キャッシュミスの場合、メインメモリ等にデータを探しに行きます。
- [APC](http://d.hatena.ne.jp/keyword/APC) file cache memory
  - OP CODE Cache: opcodeキャッシュにキャッシュされたファイル
  - User Itmes Cache:ユーザーおよびアイテムがキャッシュ
  - Memory Limit:[APC](http://d.hatena.ne.jp/keyword/APC)の[キャッシュメモリ](http://d.hatena.ne.jp/keyword/%A5%AD%A5%E3%A5%C3%A5%B7%A5%E5%A5%E1%A5%E2%A5%EA)の上限
- [APC](http://d.hatena.ne.jp/keyword/APC) user cache hits and misses
  - Hits:ユーザキャッシュのヒット率
  - Misses:ユーザキャッシュのミス率
- [Apache](http://d.hatena.ne.jp/keyword/Apache) Bytes
  - Bytes Sent:送信バイト数
  - [Apache](http://d.hatena.ne.jp/keyword/Apache)が送信したバイト数
- [Apache](http://d.hatena.ne.jp/keyword/Apache) CPU Load
  - [Apache](http://d.hatena.ne.jp/keyword/Apache)のCPU負荷
- [Apache](http://d.hatena.ne.jp/keyword/Apache) Requests
  - 発生したリク[エス](http://d.hatena.ne.jp/keyword/%A5%A8%A5%B9)ト数
- [Apache](http://d.hatena.ne.jp/keyword/Apache) Scoreboard
  - [Apache](http://d.hatena.ne.jp/keyword/Apache)リク[エス](http://d.hatena.ne.jp/keyword/%A5%A8%A5%B9)トの管理状態を表示
    pacheで実際にHTTPリク[エス](http://d.hatena.ne.jp/keyword/%A5%A8%A5%B9)トを処理するエンティティを「スロット」と呼ぶ。そして、スロットを集めた[Apache](http://d.hatena.ne.jp/keyword/Apache)のリク[エス](http://d.hatena.ne.jp/keyword/%A5%A8%A5%B9)ト処理の管理状態の記録をスコアボードと呼ぶ。
    スコアボードは、処理系にもよるが、大抵はOSの共有メモリを利用しており、リク[エス](http://d.hatena.ne.jp/keyword/%A5%A8%A5%B9)ト処理をするプロセス間で共有可能な記憶領域となっている。
    共有メモリが利用できない一部の旧式な処理系では、ファイルで管理するらしい。
    [[Apache](http://d.hatena.ne.jp/keyword/Apache)スコアボードの監視とチューニング ]（<http://www.ginnokagi.com/2008/03/apache.html>）
- [Apache](http://d.hatena.ne.jp/keyword/Apache) Workers
  - Idle workers:アイドルなプロセス数
  - Busy workers:ビ[ジー](http://d.hatena.ne.jp/keyword/%A5%B8%A1%BC)なプロセス数
    負荷が高い時間帯にIdleWorkersがゼロになる率が高い場合はMinSpareServersの値が小さいということになります。もっと大きい値にして、プロセス生成のオーバーヘッドを下げてやる必要があります。
    負荷が高い時間帯にIdleWorkersが大きな値を示している場合はプロセス＝メ[モリー](http://d.hatena.ne.jp/keyword/%A5%E2%A5%EA%A1%BC)が無駄使いされていることになりますから、MinSpareServersをもっと小さい値にします。その分のメ[モリー](http://d.hatena.ne.jp/keyword/%A5%E2%A5%EA%A1%BC)をバッファキャッシュ等に回してほうがよい。
    [mod\_statusでapacheの稼働状況を記録する](https://www.inter-office.co.jp/contents/83/)

## [MySQL](http://d.hatena.ne.jp/keyword/MySQL)

## ステータス関連のグラフ

- [MySQL](http://d.hatena.ne.jp/keyword/MySQL) Command Counters※Max 500
  - Questions:総[ステートメント](http://d.hatena.ne.jp/keyword/%A5%B9%A5%C6%A1%BC%A5%C8%A5%E1%A5%F3%A5%C8)実行回数
  - Com xxx :xxx[ステートメント](http://d.hatena.ne.jp/keyword/%A5%B9%A5%C6%A1%BC%A5%C8%A5%E1%A5%F3%A5%C8)を実行した回数
    SELECT文が実行された場合は「Com Select」がカウントアップ。
    ただし、クエリキャッシュにヒットした場合は「Questions」に計上されるが「Com Select」には計上されない
    このグラフからの[SQL](http://d.hatena.ne.jp/keyword/SQL)の量・内容・集中傾向を確認することで、チューニングの手がかりになる。
- [MySQL](http://d.hatena.ne.jp/keyword/MySQL) Connections※Max 120
  - サーバ側の値をそのまま表示しているもの
  - Max Connections:設定上の最大コネクション数
    - 起動して以来の最大同時コネクション数
  - Max Used Connections:最大同時接続コネクション数
  - Threads Connected:接続中のコネクション数
    - 同時接続数
      コネクションプールを使うと「Threads Connected」は多いものの。Connections」は少なくなる。
  - サーバ側がカウンタになっていて、前回の処理からの差分を描画しているもの
  - Aborted Clients:接続できたが切断されたコネクションの数
    - 接続が正常にできていたものの、「WAIT\_TIMEOUT」や「INTERACTIVE\_TIMEOUT」などにより、
    - 切断されたコネクションの数
  - Aborted Connects:接続できなかったコネクションの数
  - Connections:接続されたコネクションの数
- [MySQL](http://d.hatena.ne.jp/keyword/MySQL) Files and Tables※Max 2.0k
  - サーバ側の値をそのまま表示
  - Table Cache:テーブルキャッシュサイズ
  - Open Tables:開いたことのあるテーブル数
  - Open File:開いたことのあるファイル数
  - Opend Tables:今開いているテーブル数
- [MySQL](http://d.hatena.ne.jp/keyword/MySQL) Handlers※Max 600k
  - サーバ側がカウンタになっているので、前回からの処理からの差分を描画
  - Handler Write:「INSERT」の要求回数
  - Handler Update:「UPDATE」の要求回数
  - Handler Delete:「DELETE」の要求回数
  - Handler Read First:最初のエントリがインデックスから読み込まれた回数
    - この項目が多いときは、フルスキャンが多いかもしれないので要確認
  - Handler Read Key:キー(インデックス)に基づく読み込み回数
    - この項目が多いときは、適切にインデックスが付与されている証拠なのでいい傾向
  - Handler Read Next:キー順序での次レコードの読み込み要求回数
  - Handler Read Prev:キー順序での前レコードの読み込み要求回数
    - NextとPrevは範囲指定をしてインデックスカラムをスキャンした場合に増える
  - Handler Read Rnd:固定位置に基づくレコードの読み込み要求回数
    - [SQL](http://d.hatena.ne.jp/keyword/SQL)結果をソートすることが多い場合に増える。テーブルスキャンが多いか、インデックスなしの「JOIN」が多く、インデックスが適切に付与できていない可能性がある。
  - Handler Read Rnd Next:データファイルでの次レコードの読み込み要求回数
    - この項目が多いときは、テーブルスキャンが多く、インデックスが適切に付与できていない可能性あり
- [MySQL](http://d.hatena.ne.jp/keyword/MySQL) Network Traffic※Max i.0M
  - サーバ側がカウンタになっているので、前回の処理からの差分が描画
  - Bytes Sent:[MySQL](http://d.hatena.ne.jp/keyword/MySQL)からクライアントに送信したデータ量
  - Bytes Received:[MySQL](http://d.hatena.ne.jp/keyword/MySQL)がクライアントから受信したデータ量。
    単位がbytesなので注意(bitではない)通常はSentが圧倒的に多いが、[SQL](http://d.hatena.ne.jp/keyword/SQL)が長い、または投入データが大きい場合はReceivedも大きくなる。
- [MySQL](http://d.hatena.ne.jp/keyword/MySQL) Processlist※Max 4.0
  - サーバ側の値をそのまま表示
  - State Closing Tables:データをディスクにフラッシュしテーブルをクローズ中
  - State Copying To tmp Table:メモリ上の一時テーブルにデータをコピー中
  - State End:データ操作処理中
    - [SQL](http://d.hatena.ne.jp/keyword/SQL)文の「ALERT TABLE」、「CREATE VIEW」、「DELETE」、「INSERT」、「SELECT」、「UPDATE」の終了処理(クリーンアップ前)の状態
  - State Freeing Items:アイテム開放処理中
    - クリーンアップの次の工程で、クエリキャッシュを含めたいくつかのアイテムを開放している状態です。
  - State Init:[SQL](http://d.hatena.ne.jp/keyword/SQL)実行のための初期化中
    - [SQL](http://d.hatena.ne.jp/keyword/SQL)文の「ALERT TABLE」、「CREATE VIEW」、「DELETE」、「INSERT」、「SELECT」、「UPDATE」の実行準備中の状態
    - 具体的にはバイナリログや[InnoDB](http://d.hatena.ne.jp/keyword/InnoDB)ログのフラッシュ、クエリキャッシュのクリーンアップ等を実行しています。
  - State Locked:ロックされている(ロック開放待ち)
    - 「State」が「Locked」、「Table lock」、「Waiting for .\*lock」の合算。
    - ここでリストアップされていないものは「State Other」にすべて計上されている。
  - State Login:ログイン(認証処理など)処理中
  - State Preparing:クエリ[オプティマ](http://d.hatena.ne.jp/keyword/%A5%AA%A5%D7%A5%C6%A5%A3%A5%DE)イザ実行中
  - State Reading From Net:ネットワークから[SQL](http://d.hatena.ne.jp/keyword/SQL)を読み込み中
  - State Sending Date:SELECTによるデータ読みこみ、またはクライアントへのデータ送信中
  - State Sorting Result:一時テーブルを利用しないsort処理中
  - State Statistics:SQL実行計画決定の為の統計処理中
  - State Updating:UPDATEのためのデータ探索中またはUPDATE処理中
  - State Writing To Net:ネットワークへデータを草子中
  - State None：Stateなし
    - 「State」に値が設定されていないスレッド。
    - 例えばSLEEP中のスレッド等が該当します。
    - [トランザクション](http://d.hatena.ne.jp/keyword/%A5%C8%A5%E9%A5%F3%A5%B6%A5%AF%A5%B7%A5%E7%A5%F3)内で[SQL](http://d.hatena.ne.jp/keyword/SQL)と[SQL](http://d.hatena.ne.jp/keyword/SQL)の間もSLEEPになるので「State None」に計上されます。
  - State Other:その他
    - その他のState。下記マニュアルに記載。多数ある。
    - <http://dev.mysql.com/doc/refman/5.6/en/general-thread-states.html>
- [MySQL](http://d.hatena.ne.jp/keyword/MySQL) Thread※Max 8
  - サーバ側の値をそのまま表示しているものと、サーバ側がカウンタとなっていて、前回の処理からの差分を描画しているものがある。
    - サーバ側の値をそのまま表示
    - Thread Cache Size:スレッドキャッシュのサイズ
    - Thread Connected:接続中(利用中)のスレッド数
    - Threads Running:実行中ステータスのスレッド数
    - Threads Cached:キャッシュされていたスレッド数
  - 前回からの差分を描画
    - Threads Created:生成されたスレッド数
      「Threads Created」が高い値を示し続けるなら、
      「Thread Cache Size」を増やすと処理が効率化できるかもしれない。
- [MySQL](http://d.hatena.ne.jp/keyword/MySQL) Transaction Handler※Max600
  - サーバ側がカウンタになっているので、前回の処理からの差分を描画
  - Handler Commit:コミット要求数
  - Handler Rollback:[ロールバック](http://d.hatena.ne.jp/keyword/%A5%ED%A1%BC%A5%EB%A5%D0%A5%C3%A5%AF)要求数
  - Handler Savepoint:[セーブポイント](http://d.hatena.ne.jp/keyword/%A5%BB%A1%BC%A5%D6%A5%DD%A5%A4%A5%F3%A5%C8)要求数
  - Handler Savepoint Rollback:[セーブポイント](http://d.hatena.ne.jp/keyword/%A5%BB%A1%BC%A5%D6%A5%DD%A5%A4%A5%F3%A5%C8)[ロールバック](http://d.hatena.ne.jp/keyword/%A5%ED%A1%BC%A5%EB%A5%D0%A5%C3%A5%AF)要求数
    どの数値が多いから異常ということはないが、想定範囲から大幅に外れていないか確認は必要

## 性能関連のグラフ

- [MySQL](http://d.hatena.ne.jp/keyword/MySQL) Query Cache※Max 10k
  - サーバ側の値をそのまま表示
    - Qcache Queries In Cache：キャッシュに格納されている[SQL](http://d.hatena.ne.jp/keyword/SQL)数
  - サーバ側がカウンタになって、前回の処理からの差分を描画
    - Qcache Hits:キャッシュヒットした[SQL](http://d.hatena.ne.jp/keyword/SQL)数
    - Qcache Inserts:キャッシュに新しく登録された[SQL](http://d.hatena.ne.jp/keyword/SQL)数
    - Qcache Not Cached:キャッシュしない[SQL](http://d.hatena.ne.jp/keyword/SQL)数
    - Qcache Lowmem Prunes:キャッシュ容量不足によりキャッシュから削除された[SQL](http://d.hatena.ne.jp/keyword/SQL)数
      「Qcache Lowmem Prunes」が発生しているようであれば、クエリキャッシュのサイズを調整することで処理が効率化できるかもしれない
      合計[SQL](http://d.hatena.ne.jp/keyword/SQL)数は「Qcache Inserts」+「Qcache Hits」+「Qcache Not Cached」
- [MySQL](http://d.hatena.ne.jp/keyword/MySQL) Query Cache Memory
  - サーバ側がカウンタで前回の処理からの差分を描画
  - クエリキャッシュではブロック長は可変なので、「Qcache Free Memory」が多くも、
  - 「Qcache Free Blocks」が少ないと、キャッシュできる[SQL](http://d.hatena.ne.jp/keyword/SQL)数は少なくなる。
  - Qcache Cache Size:クエリキャッシュのサイズ
  - Qcache Free Memory:クエリキャッシュの空き容量
  - Qcahce Total Blocks:クエリキャッシュの総ブロック数
  - Qcache Free Blocks:クエリキャッシュの空きブロック数
- My Select Types
  - サーバ側がカウンタで前回の処理からの差分を描画
  - Select Full Join:インデックスを利用しないJOINの数
  - Select Full Range Join:関連テーブルで範囲検索したJOINの数
  - Select Range:ファーストテーブルを範囲検索した部分を利用したJOINの数
  - Select Range Check:インデックスなしのJOINの数
  - Select Scan:ファーストテーブルでフルスキャンを実行したJOINの数
    Select Full JoinとSelect Range Checkが0でない場合は、インデックスを見直す。
- [MySQL](http://d.hatena.ne.jp/keyword/MySQL) Sorts
  - サーバ側がカウンタで前回の処理からの差分を描画
  - Sort Rows:ソートしたレコード数
  - Sort Range:範囲指定ソートの回数
  - Sort Merge Passes:ソートで必要としたマージパスの回数
  - Sort Scan:テーブルスキャンでソートした回数
- [MySQL](http://d.hatena.ne.jp/keyword/MySQL) Table Locks
  - サーバ側がカウンタで前回の処理からの差分を描画
  - Table Locks Immediate:テーブルロックを直ちに実行した回数
  - Table Locks locks Waited:テーブルロックを実行するとき待ちが発生した回数
  - Slow Queries:スロークエリの数
    テーブルロックが発生すると処理の並列度が著しく下がるため、「Table Locks Waited」が0になるようにする。
- [MySQL](http://d.hatena.ne.jp/keyword/MySQL) Temporary Objects
  - サーバ側がカウンタで前回の処理からの差分を描画
  - Created Tmp Tables:作成した一時テーブルの数
  - Created Tmp Disk Tables:ディスク上に作成した一時テーブルの数
  - Created Tmp File:作成した一時ファイルの数
    「Created Tmp Disk Tables」に計上される一時テーブルは、
    一時テーブルのサイズが「tmp\_table\_size」を越えた場合にディスクに書き出されるもの。
    「Created Tmp File」に計上される一時ファイルは「sort\_buffer\_size」を
    越える大きな「ORDER\_BY」や「GROUP\_BY」により作成されます。

## [InnoDB](http://d.hatena.ne.jp/keyword/InnoDB)関連のグラフ

- [InnoDB](http://d.hatena.ne.jp/keyword/InnoDB) Buffer Pool Activity
  - サーバ側がカウンタで前回の処理からの差分を描画
  - Pages Created:作成されたページの数
  - Pages Read:読み込まれたページの数
  - Pages Written:書き込まれたページの数
  - デフォルト1ページ16KB
- [InnoDB](http://d.hatena.ne.jp/keyword/InnoDB)　Buffer　Pool
  - サーバ側の値をそのまま表示
  - Pool Size:バッファプールのサイズ(ページ数)
  - Database Pages:データがあるページ数
  - Free Pages:空きページ数
  - Modified Pages:書き換えが発生したダーティページ数
  - 単位がページ数で、デフォルトは1ページ16KB。
- [InnoDB](http://d.hatena.ne.jp/keyword/InnoDB) I/O
  - サーバ側がカウンタで前回の処理からの差分を描画
  - Fire Reads:OSでの読み込みI/O実行回数
  - Fire Writes:OSでの書き込みI/O実行回数
  - Log Reads:log書き込みI/O実行回数
  - Fire Fsysncs:OSでのfsyncs実行回数
- [InnoDB](http://d.hatena.ne.jp/keyword/InnoDB) I/O
  - サーバ側の値をそのまま表示
  - このグラフの数値すべてが0でない場合、ディスクI/Oが[ボトルネック](http://d.hatena.ne.jp/keyword/%A5%DC%A5%C8%A5%EB%A5%CD%A5%C3%A5%AF)になっている可能性がある。[InnoDB](http://d.hatena.ne.jp/keyword/InnoDB) I/Oグラフと併せて確認する
  - Pending Aio Log [Ios](http://d.hatena.ne.jp/keyword/Ios):insert bufferの非同期ログでの待ちI/O数
  - Pending Aio Sync [Ios](http://d.hatena.ne.jp/keyword/Ios):insert bufferの非同期syncでの待ちI/O数
  - Pending Chkp Writes:チェックポイントでの待ち
  - Pending Ibuf Aio Reads:insert bufferの非同期ログ読み込みでの待ちI/O数
  - Pending Log Flushes:ログフラッシュでの待ち
  - Pending Log Writes:ログ書き込みでの待ち
  - Pending Normal Aio Log Reads:通常の読み込み非同期I/Oでの待ち
  - Pending Normal Aio Log Writes:通常の書き込み非同期I/Oでの待ち
  - Pending Buf Pool Flushes:バッファプールフラッシュでの待ち
- [InnoDB](http://d.hatena.ne.jp/keyword/InnoDB) Insert Buffer
  - サーバ側がカウンタで前回の処理からの差分を描画
  - Ibuf Inserts 実行した書き込み要求数
  - Ibuf Merged　マージされたI/O要求数
  - Ibuf Merges　マージ処理回数
- [InnoDB](http://d.hatena.ne.jp/keyword/InnoDB) Lock
  - サーバ側がカウンタで前回の処理からの差分を描画とサーバ側の値をそのまま表示のものがある
  - サーバ側がカウンタで前回の処理からの差分を描画
    - [Innodb](http://d.hatena.ne.jp/keyword/Innodb) Log Buffer Size:ログバッファのサイズ
    - Unflushed Log:ログから書き出されていないデータ量
  - サーバ側の値をそのまま表示のものがある
    - Log Bytes Written:ログに書き込まれたデータ量
    - Log Bytes Flushed:ログから書き出されたデータ量
- [InnoDB](http://d.hatena.ne.jp/keyword/InnoDB) Row Operations
  - サーバ側がカウンタで前回の処理からの差分を描画
  - Row Read 読み込まれた行数
  - Rows Delete 削除された行数
  - Rows Updated 更新された行数
  - Rows Inserted 挿入された行数
- [InnoDB](http://d.hatena.ne.jp/keyword/InnoDB) Semaphores
  - サーバ側がカウンタで前回の処理からの差分を描画
  - [SQL](http://d.hatena.ne.jp/keyword/SQL)文の「SHOW ENGINE INNNODB STATUS」で取得する「SEMAPHORES」の値
  - Spin Rounds スピンロック獲得のためのラウンド数
  - Spin Waits スピンロック獲得待ち
  - Os Waits OSロック獲得待ち数
- [InnoDB](http://d.hatena.ne.jp/keyword/InnoDB) Transactions
  - サーバ側がカウンタで前回の処理からの差分を描画とサーバ側の値をそのまま表示のものがある
    - サーバ側の値をそのまま表示
    - [History](http://d.hatena.ne.jp/keyword/History) List undo領域にある未破棄の[トランザクション](http://d.hatena.ne.jp/keyword/%A5%C8%A5%E9%A5%F3%A5%B6%A5%AF%A5%B7%A5%E7%A5%F3)数
  - 前回からの差分を描画
    - [InnoDB](http://d.hatena.ne.jp/keyword/InnoDB) Transactions 生成された[トランザクション](http://d.hatena.ne.jp/keyword/%A5%C8%A5%E9%A5%F3%A5%B6%A5%AF%A5%B7%A5%E7%A5%F3)数
    - [SQL](http://d.hatena.ne.jp/keyword/SQL)文の「SHOW ENGINE [INNODB](http://d.hatena.ne.jp/keyword/INNODB) STATUS」で取得する「TRANSACTIONS」の値
- [MyISAM](http://d.hatena.ne.jp/keyword/MyISAM) Indexes
  - サーバ側がカウンタで前回の処理からの差分を描画
  - Key Read Requests キャッシュからのキーブロックの読み込み要求数
  - Key Reads ディスクからのキーブロックの読み込み回数
  - Key Write Requests キャッシュにキーブロックを書き込んだ要求数
  - Key Writes ディスクへのキーブロックの書き込み回数
  - [SQL](http://d.hatena.ne.jp/keyword/SQL)文の「SHOW GLOBAL STATUS」で取得する値
  - キャッシュミス率は「Key Reads」/「Key Read Requests」で計算
  - 「Key Reads」がほぼ0になるよう調整する

# Grafanaの見方

[5.1.6 サーバーステータス変数](https://dev.mysql.com/doc/refman/5.6/ja/server-status-variables.html)

- Table Locks
  - [cacti](http://d.hatena.ne.jp/keyword/cacti)と同じ
- Processlist
  - [cacti](http://d.hatena.ne.jp/keyword/cacti)と同じ
- [MySQL](http://d.hatena.ne.jp/keyword/MySQL) Threads
  - [cacti](http://d.hatena.ne.jp/keyword/cacti)と同じ
- query cache
  - [cacti](http://d.hatena.ne.jp/keyword/cacti)と同じ
- query cache memory
  - [cacti](http://d.hatena.ne.jp/keyword/cacti)と同じ
- [InnoDB](http://d.hatena.ne.jp/keyword/InnoDB) Log
  - [cacti](http://d.hatena.ne.jp/keyword/cacti)と同じ
- files and tables
  - [cacti](http://d.hatena.ne.jp/keyword/cacti)と同じ
- temporary objects
  - [cacti](http://d.hatena.ne.jp/keyword/cacti)と同じ
- sorts
  - [cacti](http://d.hatena.ne.jp/keyword/cacti)と同じ
- [InnoDB](http://d.hatena.ne.jp/keyword/InnoDB) insert buffer
  - [cacti](http://d.hatena.ne.jp/keyword/cacti)と同じ
- [InnoDB](http://d.hatena.ne.jp/keyword/InnoDB) Rows
  - [cacti](http://d.hatena.ne.jp/keyword/cacti)と同じ
- [MySQL](http://d.hatena.ne.jp/keyword/MySQL) Join/Scan
  - [cacti](http://d.hatena.ne.jp/keyword/cacti)と同じ
- [InnoDB](http://d.hatena.ne.jp/keyword/InnoDB) Buffer Pool Activity(Pages)
  - [cacti](http://d.hatena.ne.jp/keyword/cacti)と同じ
- [InnoDB](http://d.hatena.ne.jp/keyword/InnoDB) Row Lock Time
  - [InnoDB](http://d.hatena.ne.jp/keyword/InnoDB) Row Lock Time
- [InnoDB](http://d.hatena.ne.jp/keyword/InnoDB) Row Lock Waits
  - [InnoDB](http://d.hatena.ne.jp/keyword/InnoDB) Row Lock Waits
- [MySQL](http://d.hatena.ne.jp/keyword/MySQL) Capacity
  - Percentage Of Connectionsf
  - Percentage Of Buffer Pool
- [InnoDB](http://d.hatena.ne.jp/keyword/InnoDB) Buffer Pool Efficiency
  - [Innodb](http://d.hatena.ne.jp/keyword/Innodb)\_buffer\_pool\_read\_requests
  - [Innodb](http://d.hatena.ne.jp/keyword/Innodb)\_buffer\_pool\_reads
- [InnoDB](http://d.hatena.ne.jp/keyword/InnoDB) Current Lock Waits
  - [innodb](http://d.hatena.ne.jp/keyword/innodb) lock wait secs
- [MySQL](http://d.hatena.ne.jp/keyword/MySQL) Command
  - Com\_insert
  - Com\_update
  - Com\_delete
  - Com\_replace
  - Qcache\_hits
  - Com\_select
  - Com\_update multi
  - Com\_delete multi
  - Com\_set\_option
  - Questions"
    Com\_xxx [ステートメント](http://d.hatena.ne.jp/keyword/%A5%B9%A5%C6%A1%BC%A5%C8%A5%E1%A5%F3%A5%C8)カウンタ変数は、それぞれの xxx [ステートメント](http://d.hatena.ne.jp/keyword/%A5%B9%A5%C6%A1%BC%A5%C8%A5%E1%A5%F3%A5%C8)が実行された回数を示します。
    [ステートメント](http://d.hatena.ne.jp/keyword/%A5%B9%A5%C6%A1%BC%A5%C8%A5%E1%A5%F3%A5%C8)のタイプごとにステータス変数が 1 つあります。たとえば、Com\_delete および Com\_update はそれぞれ DELETE および UPDATE [ステートメント](http://d.hatena.ne.jp/keyword/%A5%B9%A5%C6%A1%BC%A5%C8%A5%E1%A5%F3%A5%C8)をカウントします。
    `Com_update multi`と`Com_delete multi`は複数テーブル構文を使用する DELETE および UPDATE [ステートメント](http://d.hatena.ne.jp/keyword/%A5%B9%A5%C6%A1%BC%A5%C8%A5%E1%A5%F3%A5%C8)に適用されます。
- 以下は `SHOW ENGINE INNODB STATUS\G` でも見れるステータス
- [なぜあなたは SHOW ENGINE INNODB STATUS を読まないのか](https://soudai.hatenablog.com/entry/2017/12/20/030013)
- [InnoDB](http://d.hatena.ne.jp/keyword/InnoDB) I/O
  - [cacti](http://d.hatena.ne.jp/keyword/cacti)と同じ
- [InnoDB](http://d.hatena.ne.jp/keyword/InnoDB) Transactions
  - [cacti](http://d.hatena.ne.jp/keyword/cacti)と同じ
- [InnoDB](http://d.hatena.ne.jp/keyword/InnoDB) I/O Pending
  - [cacti](http://d.hatena.ne.jp/keyword/cacti)と同じ
  - [InnoDB](http://d.hatena.ne.jp/keyword/InnoDB) Buffer Pool (Pages)
  - [cacti](http://d.hatena.ne.jp/keyword/cacti)と同じ
- [InnoDB](http://d.hatena.ne.jp/keyword/InnoDB) Buffer Pool (Pages)
  - [cacti](http://d.hatena.ne.jp/keyword/cacti)と同じ
- [InnoDB](http://d.hatena.ne.jp/keyword/InnoDB) checkpoint age
  - uncheckpointed bytes
- [InnoDB](http://d.hatena.ne.jp/keyword/InnoDB) Transactions Active / Locked
  - current transactions
  - read views
  - active transactions
    - 現在処理中の[トランザクション](http://d.hatena.ne.jp/keyword/%A5%C8%A5%E9%A5%F3%A5%B6%A5%AF%A5%B7%A5%E7%A5%F3)
- [InnoDB](http://d.hatena.ne.jp/keyword/InnoDB) Memory Allocation
  - additional pool alloc
  - total mem alloc
- Insert Buffer Usage
  - cell\_count
  - userd\_cells
  - free\_cells
- [InnoDB Adaptive Hash Index](https://dev.mysql.com/doc/refman/5.6/ja/glossary.html#glos_adaptive_hash_index)
  - Hash Index Cells Total
  - Hash Index Cells Used
