---
title: "これならわかるGit/Github入門"
date: "2017-01-27"
---

git/[github](http://d.hatena.ne.jp/keyword/github)についてよくわかっていないので、  
簡単に調べてまとめました。  
だいたい[Github](http://d.hatena.ne.jp/keyword/Github)実践入門のまとめですが。。  
これ[シュタインズゲート](http://d.hatena.ne.jp/keyword/%A5%B7%A5%E5%A5%BF%A5%A4%A5%F3%A5%BA%A5%B2%A1%BC%A5%C8)のルートを例にしてまとめたら楽しかったろうなあ後で思った。

## Git初期設定

gitの初期設定をしていきます

```
git config --global user.name "(your name)"
git config --global user.email "(your email)"
git config --global color.ui true
$ git config --global alias.co checkout
$ git config --global alias.st status
$ git config --global alias.br branch
$ git config --global alias.ci commit
git config -l
```

## [Github](http://d.hatena.ne.jp/keyword/Github)の設定と[チュートリアル](http://d.hatena.ne.jp/keyword/%A5%C1%A5%E5%A1%BC%A5%C8%A5%EA%A5%A2%A5%EB)

[公式サイトのガイド](https://guides.github.com/activities/hello-world/)でrepository作成、branchを切って,commit,pull request,mergeの一通りができます。  
[Github](http://d.hatena.ne.jp/keyword/Github)のアカウント作成、設定と[SSH](http://d.hatena.ne.jp/keyword/SSH)鍵の設定もしておきましょう。  
[SSH](http://d.hatena.ne.jp/keyword/SSH)鍵を作成してfingerprintの内容を[Github](http://d.hatena.ne.jp/keyword/Github)の[SSH](http://d.hatena.ne.jp/keyword/SSH)鍵に登録します。

```
$ ssh-keygen -t rsa -C メールアドレス
```

[SSH](http://d.hatena.ne.jp/keyword/SSH)接続できれば完了！

```
$ ssh -T git@github.com
```

## [github](http://d.hatena.ne.jp/keyword/github)にpushしてみる

[チュートリアル](http://d.hatena.ne.jp/keyword/%A5%C1%A5%E5%A1%BC%A5%C8%A5%EA%A5%A2%A5%EB)で作成した[リポジトリ](http://d.hatena.ne.jp/keyword/%A5%EA%A5%DD%A5%B8%A5%C8%A5%EA)にpushしてみる  
git cloneして[リポジトリ](http://d.hatena.ne.jp/keyword/%A5%EA%A5%DD%A5%B8%A5%C8%A5%EA)を持ってきます。

```
$ git clone git@github.com:hogehoge/hello-world.git
```

[リポジトリ](http://d.hatena.ne.jp/keyword/%A5%EA%A5%DD%A5%B8%A5%C8%A5%EA)を持ってこれていることを確認

```
$ cd hello-world/
$ ll
total 8
-rw-r--r--  1 hoge  hoge  xx  xx xx xx:xx README.md
```

かんたんな[スクリプト](http://d.hatena.ne.jp/keyword/%A5%B9%A5%AF%A5%EA%A5%D7%A5%C8)を上げてみます。  
[スクリプト](http://d.hatena.ne.jp/keyword/%A5%B9%A5%AF%A5%EA%A5%D7%A5%C8)は[リポジトリ](http://d.hatena.ne.jp/keyword/%A5%EA%A5%DD%A5%B8%A5%C8%A5%EA)に登録されていないので  
untracked filesとなり、git addしてねと言われています。  
親切ですね。

```
$ vim hello_world.php
$ git status
# On branch master
# Untracked files:
#   (use "git add <file>..." to include in what will be committed)
#
#   hello_world.php
nothing added to commit but untracked files present (use "git add" to track)
```

git addしてステージ領域登録してあげます。

`git add .`で全てのファイルをステージ領域にあげることができますが、  
上げたくないファイルはどうすればよいでしょうか。  
`.gitignore`ファイルを作成して`*.log`とかすればよいです。

```
$ git add hello_world.php
```

commitしましょう。

```
$ git commit -m "Add hello world script by php"

 create mode 100644 hello_world.php
```

git logでコミット内容を確認しましょう。  
`- p`オプションを付ければコミットメッセージの後ろにファイルの差分が表示されます。  
`--pretty=short`ではコミットメッセージの1行目のみを表示します。  
`--oneline`で一行のみ表示させます。  
`--stat`で、どこが変更されたかではなく、どのファイルが何箇所変更されたかをみることができます。

```
$ git log

    Add hello world script by php
```

commitできているので[Github](http://d.hatena.ne.jp/keyword/Github)にあげます。  
[Github](http://d.hatena.ne.jp/keyword/Github)に登録されていれば完了。

```
$ git push
```

## 変更差分の表示

git diffでワークツリー、ステージ領域、最新コミット間の差分を確認できます。  
差分がないと表示されません。  
README.mdという空ファイルを編集して確認してみます。

```
$ git diff
$ ll
total 0
-rw-r--r--  1 hoge  hoge  0  xx xx xx:xx README.md
```

`# Gitチュートリアル`と編集してみるとワークツリーとステージ領域の差分が表示されました。

```
$ vim README.md 
$ git diff
diff --git a/README.md b/README.md
index e69de29..cb5dc9f 100644
--- a/README.md
+++ b/README.md
@@ -0,0 +1 @@
+# Gitチュートリアル
```

git addでステージ領域に追加すると差分がないので、表示されません。  
最新コミットとの差分の確認はどうやるのでしょうか。  
`git diff HEAD`で確認できます。  
あとは問題なければコミットしてみましょう。  
HEADは作業しているブランチの最新コミットを参照するポインタです  
`git diff --cached`でもステージ領域に上がっていないけど、  
コミットされていないファイルの「どこがどう次のコミットで変更されるか」がわかります。

```
$ git add README.md 
$ git diff
$ git diff HEAD
diff --git a/README.md b/README.md
index e69de29..cb5dc9f 100644
--- a/README.md
+++ b/README.md
@@ -0,0 +1 @@
+# Gitチュートリアル
```

ちなみにgit addなどして、gitが管理したファイルはrmやmvを使うのでなく  
`git rm`や`git mv`でないといけませんので、ご注意を。

## ブランチの操作

ブランチができると複数人で作業ができるようになる便利概念です  
現在のブランチを確認すると、masterブランチにいます。

```
$ git branch
* master
```

ブランチを作成して、移動しましょう。

```
$ git checkout -b feature-A
Switched to a new branch 'feature-A'
$ git branch
* feature-A
 master
```

ちなみに上のコマンドは以下のコマンドを1行でやりました。

```
$ git branch feature-A
$ git checkout feature-A
```

今、コミットするとfeature-Aブランチにコミットされて、ブランチを育てることになります。  
以下の内容でコミットしてみます。

```
$ vim README.md 
$ cat README.md 
# Gitチュートリアル

- feature-A
$ git add README.md 
$ git commit -m "Add feature-A"
[feature-A 4948954] Add feature-A
 1 file changed, 2 insertions(+)
 ```

 masterブランチには反映されていないことを確認

 ```
$ git checkout master
Switched to branch 'master'
$ cat README.md 
# Gitチュートリアル
$ git checkout -
Switched to branch 'feature-A'
```

feature-Aブランチを統合ブランチであるmasterにマージしてみます。  
masterブランチに移動してgit merge –no-ff ブランチ名  
`--no-off`オプションを付けるとマージコミットのメッセージを記入するためにエディタが立ち上がります。

```
$ git checkout -
Switched to branch 'master'
$ git merge --no-ff feature-A
Merge made by the 'recursive' strategy.
 README.md | 2 ++
 1 file changed, 2 insertions(+)
```

git log –graphで視覚的にみると、トピックブランチ(feature-A)で  
コミットされた内容がマージされていることがわかります。

```
$ git log --graph
*   commit HASH値
|\  Merge: 1a433cc 4948954
| | Author: 
| | Date:   
| | 
| |     Merge branch 'feature-A'
| |   
| * commit HASH値
|/  Author: 
|   Date:   
|   
|       Add feature-A
|
```

## コミット変更操作

feature-Aブランチを分岐させる前に戻ってfix-bブランチを作成させるとします。  
`git reset --hart 戻りたい場所のハッシュ値`

```
$ git reset --hard 1a433ccb5a6acebe742234de5
```

fix-Bというブランチを切ってファイルを編集してcommitします。

```
$ git checkout -b fix-B
Switched to a new branch 'fix-B'
$ vim README.md 
$ cat README.md 
# Gitチュートリアル

- fix-B
$ git add .
$ git commit -m "Fix B"
[fix-B 01ee7fc] Fix B
 1 file changed, 2 insertions(+)
```

feature-Aブランチをmergeした後の状態に進み、fix-Bのブランチをmergeさせます。  
git relogでfeature-Aブランチをmergeした[ハッシュ値](http://d.hatena.ne.jp/keyword/%A5%CF%A5%C3%A5%B7%A5%E5%C3%CD)を  
masterブランチに戻り、git reset –hardで選択して戻ります。

```
$ git reflog
01ee7fc HEAD@{0}: commit: Fix B
1a433cc HEAD@{1}: checkout: moving from master to fix-B
1a433cc HEAD@{2}: reset: moving to 1a433ccb5a6acebe742234de5
0165311 HEAD@{3}: merge feature-A: Merge made by the 'recursive' strategy.
$ git checkout -
Switched to branch 'master'
$ git reset --hard 0165311
HEAD is now at 0165311 Merge branch 'feature-A'
```

fix-Bの内容をマージさせるとCONFLICTが発生しました。

```
$ git merge --no-ff fix-B
Auto-merging README.md
CONFLICT (content): Merge conflict in README.md
Automatic merge failed; fix conflicts and then commit the result.
```

ファイルを編集してCONFLICTを解消させましょう。

```
$ vim README.md 
# Gitチュートリアル

<<<<<<< HEAD
- feature-A
=======
- fix-B
>>>>>>> fix-B
```

今回は以下の内容に編集しました。

```
$ cat README.md 
# Gitチュートリアル

- feature-A
- fix-B
```

この状態でmergeさせることができるようになりました。

```
$ git add .
$ git commit -m "Fix conflict"
[master 30b1cb4] Fix conflict
```

コミットメッセージの編集もしてみましょう。

```
$ git commit --amend
[master 38ffc4c] Merge branch 'fix-b'
```

視覚的にみるとわかりやすいですね。

```
$ git log --graph
*   commit ハッシュ値
|\  Merge: 
| | Author: 
| | Date:   
| | 
| |     Merge branch 'fix-b'
| |   
| * commit ハッシュ値
| | Author: 
| | Date:  
| | 
| |     Fix B
| |     
* |   commit ハッシュ値
|\ \  Merge: 
| |/  Author: 
|/|   Date:   
| |   
| |       Merge branch 'feature-A'
| |   
| * commit ハッシュ値
|/  Author: 
|   Date:  
|   
|       Add feature-A
|
```

## 歴史改変

トピックブランチをマージする前に、すでにコミットした内容にちょっとしたミスを見つけたら、  
修正のコミットをして、改変しましょう。

featture-Cブランチを作成して試してみます。  
タイポをしたままcommitしてしまいました。  
これをマージする前に修正したい。

```
$ git checkout -b feature-C
Switched to a new branch 'feature-C'
$ vim README.md 
$ cat README.md 
# Gitチュートリアル

- feature-A
- fix-B
- feaaature-C
$ git commit -am "Add feature-C"
[feature-C 02f4faf] Add feature-C
 1 file changed, 1 insertion(+), 1 deletion(-)
```

Gitの歴史を改ざんしてしまいましょう。  
タイポしなかった世界線へと移動させます。  
今回は現在のブランチのHEADを含めた2つまでのcommitを対象にしてエディタを立ち上げさせます。

```
$ git rebase -i HEAD~2

pick 02f4faf Add feature-C
pick 7e0f931 Fix Typo

# Rebase 95aeef1..7e0f931 onto 95aeef1
#
# Commands:
#  p, pick = use commit
#  r, reword = use commit, but edit the commit message
#  e, edit = use commit, but stop for amending
#  s, squash = use commit, but meld into previous commit
#  f, fixup = like "squash", but discard this commit's log message
#  x, exec = run command (the rest of the line) using shell
#
# These lines can be re-ordered; they are executed from top to bottom.
#
# If you remove a line here THAT COMMIT WILL BE LOST.
#
# However, if you remove everything, the rebase will be aborted.
#
# Note that empty commits are commented out
```

下のように修正しましょう。

```
fix-up 7e0f931 Fix Typo
```

git logで確認すると[typo](http://d.hatena.ne.jp/keyword/typo)のコミットメッセージがなくなり、  
`Add feature-C`のコミットが書き換わっています。  
後はmasterブランチにマージします。

```
$ git checkout master
Switched to branch 'master'
$ git merge --no-ff feature-C
Merge made by the 'recursive' strategy.
 README.md | 1 +
 1 file changed, 1 insertion(+)
```

## Gitで育てた[リポジトリ](http://d.hatena.ne.jp/keyword/%A5%EA%A5%DD%A5%B8%A5%C8%A5%EA)を[Github](http://d.hatena.ne.jp/keyword/Github)に登録する

[Github](http://d.hatena.ne.jp/keyword/Github)上でgit-tutorialという[リポジトリ](http://d.hatena.ne.jp/keyword/%A5%EA%A5%DD%A5%B8%A5%C8%A5%EA)を作成します。  
[リポジトリ](http://d.hatena.ne.jp/keyword/%A5%EA%A5%DD%A5%B8%A5%C8%A5%EA)のパスが表示されるので、git remote addコマンドで指定します。

```
$ git remote add origin git@github.com:user-name/git-tutorial.git
```

git pushコマンドで現在のブランチのローカル[リポジトリ](http://d.hatena.ne.jp/keyword/%A5%EA%A5%DD%A5%B8%A5%C8%A5%EA)の内容を  
リモー[トリポジ](http://d.hatena.ne.jp/keyword/%A5%C8%A5%EA%A5%DD%A5%B8)トリに送信します。  
今回はmaster　=> master  
`- u`でローカル[リポジトリ](http://d.hatena.ne.jp/keyword/%A5%EA%A5%DD%A5%B8%A5%C8%A5%EA)の現在のブランチの上流はorigin[リポジトリ](http://d.hatena.ne.jp/keyword/%A5%EA%A5%DD%A5%B8%A5%C8%A5%EA)のmastertブランチであると設定したことになります。  
これをつけるとリモー[トリポジ](http://d.hatena.ne.jp/keyword/%A5%C8%A5%EA%A5%DD%A5%B8)トリの内容をgit pullするときに、  
このローカル[リポジトリ](http://d.hatena.ne.jp/keyword/%A5%EA%A5%DD%A5%B8%A5%C8%A5%EA)のブランチはoriginのmasterブランチから取得することになります。

```
$ git push -u origin master
```

pushが終わったら、[Github](http://d.hatena.ne.jp/keyword/Github)で内容を確認してみましょう。

## masterブランチ以外のブランチへ送信

リモー[トリポジ](http://d.hatena.ne.jp/keyword/%A5%C8%A5%EA%A5%DD%A5%B8)トリにはmaster以外のブランチも作成できるのでpushしてみます。

```
$ git checkout -b feature-D
$ git push -u origin feature-D
```

リモー[トリポジ](http://d.hatena.ne.jp/keyword/%A5%C8%A5%EA%A5%DD%A5%B8)トリの[Github](http://d.hatena.ne.jp/keyword/Github)にfeature-Dブランチが確認できました。

## リモー[トリポジ](http://d.hatena.ne.jp/keyword/%A5%C8%A5%EA%A5%DD%A5%B8)トリから取得

別の[ディレクト](http://d.hatena.ne.jp/keyword/%A5%C7%A5%A3%A5%EC%A5%AF%A5%C8)リにローカル[リポジトリ](http://d.hatena.ne.jp/keyword/%A5%EA%A5%DD%A5%B8%A5%C8%A5%EA)を用意して   
リモー[トリポジ](http://d.hatena.ne.jp/keyword/%A5%C8%A5%EA%A5%DD%A5%B8)トリのfeature-Dを取得して変更してみましょう。

```
$ mkdir git-tutorial2
$ cd git-tutorial2/
$ ll
$ git config -l
user.name=
user.email=
color.ui=true
$ git clone git@github.com:user-name/git-tutorial.git
$ cd git-tutorial/
```

`-a`をつけてリモー[トリポジ](http://d.hatena.ne.jp/keyword/%A5%C8%A5%EA%A5%DD%A5%B8)トリを含むブランチ情報を確認します。  
リモー[トリポジ](http://d.hatena.ne.jp/keyword/%A5%C8%A5%EA%A5%DD%A5%B8)トリにfeature-Dがあることを確認できました。

```
$ git branch -a
* master
  remotes/origin/HEAD -> origin/master
  remotes/origin/feature-D
  remotes/origin/master
```

feature-Dブランチをローカル[リポジトリ](http://d.hatena.ne.jp/keyword/%A5%EA%A5%DD%A5%B8%A5%C8%A5%EA)にチェックアウトしてみます。  
`git checkout -b 作成するブランチ名 リモートリポジトリにあるブランチ名`  
修正してcommitして、pushします。

```
$ git checkout -b feature-D origin/feature-D
Branch feature-D set up to track remote branch feature-D from origin.
Switched to a new branch 'feature-D'
$ git diff
$ vim README.md 
$ git diff
diff --git a/README.md b/README.md
index 50de722..125f990 100644
--- a/README.md
+++ b/README.md
@@ -3,3 +3,4 @@
 - feature-A
 - fix-B
 - feature-C
+- feature-D
$ git commit -am "Add feature-D"
[feature-D 4a5676c] Add feature-D
 1 file changed, 1 insertion(+)
$ git push

   feature-D -> feature-D
```

[Github](http://d.hatena.ne.jp/keyword/Github)上のfeature-Dブランチが修正されていることを確認

## 最新のリモー[トリポジ](http://d.hatena.ne.jp/keyword/%A5%C8%A5%EA%A5%DD%A5%B8)[トリブラ](http://d.hatena.ne.jp/keyword/%A5%C8%A5%EA%A5%D6%A5%E9)ンチを取得

ローカル[リポジトリ](http://d.hatena.ne.jp/keyword/%A5%EA%A5%DD%A5%B8%A5%C8%A5%EA)のfeature-Dブランチはcommitしていないので、  
リモー[トリポジ](http://d.hatena.ne.jp/keyword/%A5%C8%A5%EA%A5%DD%A5%B8)トリからgit pullでコードを取得してみましょう。

```
$ git pull origin feature-D
$ cat README.md 
# Gitチュートリアル

- feature-A
- fix-B
- feature-C
- feature-D
$ git branch
  feature-A
  feature-C
* feature-D
  fix-B
  master
```

取得できました。  
git push/pull を競合が起きないように気をつければ開発に便利ですね。

## [タグ機能](http://d.hatena.ne.jp/keyword/%A5%BF%A5%B0%B5%A1%C7%BD)

git logのコミットIDではわかりずらいとき、タグを付けると便利です。  
git logの最近のコミットにタグを付けるときは、タグ名を指定すればよいです。

```
$ git tag v1.0
$ git tag
```

`git show`はコミットの内容を表示しますが、IDを指定せずともタグ名で表示できます。

```
$ git show v1.0
```

他のコミットにタグを付けたいときはタグ名の後ろにコミットIDを指定すればよいです。  
また`-d`でタグを削除できます。

```
$ git tag v0.9 abb3e8e5440be9ef819aae3d3d10de3
$ git show v0.9
$ git tag -d v0.9
Deleted tag 'v0.9' (was abb3e8e)
```

とりあえず基本はこれぐらいで。
