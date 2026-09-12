---
title: "itamaeとvagrantでやるテスト駆動--その１-Apache,PHP編"
date: "2016-08-18"
---

`rake spec`を実行しつつItamaeで構築
hostとwebというサーバをたてて
hostに`serverspec`と`Itamae`をインストールし、
webを構築して、テストをしていきます。

```
mkdir serverspec_test
cd serverspec_test
```

Vagrantfileを作成します。

```
vagrant init bento/centos-6.7
vi Vagrantfile
```

以下のように編集

```
# config.vm.box = "bento/centos-6.7" #コメントアウトする

## 以下の設定を追記して hostとwebにIPアドレス割り振る

config.vm.define "host" do |node|　　
  node.vm.box = "bento/centos-6.7"
  node.vm.hostname = "host"
  node.vm.network :private_network, ip: "192.168.33.10"
end
config.vm.define "web" do |node|
  node.vm.box = "bento/centos-6.7"
  node.vm.hostname = "web"
  node.vm.network :private_network, ip: "192.168.33.11"
end
```

[vagrant](http://d.hatena.ne.jp/keyword/vagrant)を立ち上げてログインをします

```
$ vagrant up
$ vagrant status
$ vagrant ssh host
```

ホストからWEBへ[ssh](http://d.hatena.ne.jp/keyword/ssh)接続できるようにします。

```
[vagrant@host ~]$ ssh-keygen -N "" -f ~/.ssh/id_rsa
[vagrant@host ~]$ cat << FIN >> ~/.ssh/config
> Host web
>    HostName 192.168.33.11
> FIN
[vagrant@host ~]$ chmod 600 .ssh/config
[vagrant@host ~]$ ssh-copy-id web
[vagrant@host ~]$ ssh web
vagrant@192.168.33.11's password:
[vagrant@web ~]$ uname -n
web
```

環境構築をしていきます。
dotinstallのgitからミドル一式をインストールして、
gemでitamaeとserverspecをインストールします。

```
git clone https://github.com/dotinstallres/centos65.git
$ cd centos65
$ ./run.sh
$ exec $SHELL -l
$ gem list
$ gem install itamae serverspec
$ gem list
```

作業[ディレクト](http://d.hatena.ne.jp/keyword/%A5%C7%A5%A3%A5%EC%A5%AF%A5%C8)リを任意の場所に作っておきます。
また、Itamaeで使用するファイルも予め作っておきます。

```
$ mkdir myproject
$ cd myproject/
$ mkdir cookbooks
$ cd cookbooks/
$ touch recipe.rb
```

`serverspec-init`でテスト対象への
OSや接続方法、ホスト名などを入力します。

```
$ serverspec-init
Select OS type:

  1) UN*X
  2) Windows

Select number: 1

Select a backend type:

  1) SSH
  2) Exec (local)

Select number: 1

Vagrant instance y/n: n
Input target host name: web
 + spec/
 + spec/web/
 + spec/web/sample_spec.rb
 + spec/spec_helper.rb
 + Rakefile
 + .rspec
```

サンプルのテストファイルは削除し、
位置から空のテストファイルを作成していきましょう。

```
$ cd spec/
$ cd web/
$ rm sample_spec.rb
$ touch httpd_spec.rb
```

`httpd_spec.rb`に[Apache](http://d.hatena.ne.jp/keyword/Apache)のテストを書きます。

```
$ vi httpd_spec.rb
```

```
require 'spec_helper'
describe package('httpd') do
    it { should be_installed }
end
```

ここでテストを実行してテストが正常に失敗することを確認します。

```
$ rake spec
```

テストが通るように、
`recipe.rb`に[Apache](http://d.hatena.ne.jp/keyword/Apache)インストールの記述をします。

```
$ vi cookbooks/recipe.rb
```

> package '[httpd](http://d.hatena.ne.jp/keyword/httpd)'

itamaeを実行してテストが通ることを確認します。

```
$ itamae ssh -h web cookbooks/recipe.rb -n
$ itamae ssh -h web cookbooks/recipe.rb
$ rake spec
```

テストの際,[Rspec](http://d.hatena.ne.jp/keyword/Rspec)の記法として
ResourceとMatcherが出てきました。
これらの種類は公式サイトのRESOUCE TYPEから確認できます。

Resource
- 何をテストするのか
- [httpd](http://d.hatena.ne.jp/keyword/httpd)のpackage

Matcher
- どういう状態
- be\_installed

まずは[httpd](http://d.hatena.ne.jp/keyword/httpd)が[自動起動](http://d.hatena.ne.jp/keyword/%BC%AB%C6%B0%B5%AF%C6%B0)していて、80番ポートでLISTENしているかテストを書きます。
`be_enable`で[自動起動](http://d.hatena.ne.jp/keyword/%BC%AB%C6%B0%B5%AF%C6%B0)の設定で、`be_running`がスタートしているかです。

```
require 'spec_helper'
describe service('httpd') do
  it { should be_enabled }
  it { should be_running }
end

describe port(80) do
  it { should be_listening }
end
```

それでは[httpd](http://d.hatena.ne.jp/keyword/httpd)を[自動起動](http://d.hatena.ne.jp/keyword/%BC%AB%C6%B0%B5%AF%C6%B0)させます。
`:enable :start`で[自動起動](http://d.hatena.ne.jp/keyword/%BC%AB%C6%B0%B5%AF%C6%B0)させます。
デフォルトで80番ポートでLISTENします。

```
package 'httpd'

service 'httpd' do
  action [:enable, :start]
end
```

rake speckを実行してテストが成功することを確認

ファイルを転送して、中身のテストをしていきます。

index.htmlが存在して、中身が`Hello World`という文字列が含まれているか
テストを書きます。
オーナとグループが`apache`であることも確認します。

```
describe file('/var/www/html/index.html') do
  it { should be_file }
  it { should be_owned_by 'apache' }
  it { should be_grouped_into 'apache' }
  its(:content) { should match /Hello World/ }
end
```

filesフォルダを作り、
そこに転送用のindex.htmlを書きます。

```
$ mkdir cookbooks/files
$ vi cookbooks/files/index.html
<html>
Hello World
</html>
```

Itamaeではオーナとグループが`apache`のindex.html
`/var/www/html/`配下に転送させます。

```
remote_file '/var/www/html/index.html' do
  owner 'apache'
  group 'apache'
end
```

rake specを実行し、テストが成功することを確認

パッケージをまとめてインストールさせて、テストを実施する

[php](http://d.hatena.ne.jp/keyword/php)のテストを書いてみます。
新しくテストファイルを書きます。
eachメソッドを使いパッケージをインストールします。
`php、php-devel、php-mbstring、php-gd`が入っていることを確認します。

```
require 'spec_helper'

%w(php php-devel php-mbstring php-gd).each do |pkg|
  describe package(pkg) do
    it { should be_installed }
  end
end
```

Itamaeのレシピには以下を追加してパッケージをインストールさせます。

```
%w(php php-devel php-mbstring php-gd).each do |pkg|
  package pkg
end
```

rake speqを実行して、
[PHP](http://d.hatena.ne.jp/keyword/PHP)がインストールしたことを確認します。

[PHP](http://d.hatena.ne.jp/keyword/PHP)がインストールされたことを確認したら、
設定ファイルの中身を確認します。

[php](http://d.hatena.ne.jp/keyword/php)\_configというリソースを使っていきます。
[タイムゾーン](http://d.hatena.ne.jp/keyword/%A5%BF%A5%A4%A5%E0%A5%BE%A1%BC%A5%F3)が`Asia/Tokyo`であることを確認してみる
設定項目は`data.timezode`
値を確認するには`its(:value)`を使います。
shouldで文字列が同じでないといけないと書きます。

```
describe php_config('date.timezone') do
  its(:value) { should eq 'Asia/Tokyo' }
end
```

Itamaeではレシピに以下を追記
`/etc/php.ini`を`action :edit`で編集
blockを使い`|content|`で破壊的メソッドで置換をします。
[コメントアウト](http://d.hatena.ne.jp/keyword/%A5%B3%A5%E1%A5%F3%A5%C8%A5%A2%A5%A6%A5%C8)になっている`date.timezone`を
'date.timezone = Asia/Tokyo'に置換

```
file '/etc/php.ini' do
  action :edit
  block do |content|
    content.gsub!(';date.timezone =', 'date.timezone = Asia/Tokyo')
  end
end
```

rake specを実行し、
ファイルが編集されていることを確認します。

次に、[ディレクト](http://d.hatena.ne.jp/keyword/%A5%C7%A5%A3%A5%EC%A5%AF%A5%C8)リが存在するかテストしてみます。

ファイルや[ディレクト](http://d.hatena.ne.jp/keyword/%A5%C7%A5%A3%A5%EC%A5%AF%A5%C8)リを確認するテストファイルを作成します。
`file()`リソースを使い、Matcherで`be_directory`を使えばテストできますが、
commandリソースでコマンドを実行させて確認することもできる
今回ならlsコマンドを実行して、その結果をテストする
`its(:stdout)`で標準出力をテストできます。
今回は空白と[ディレクト](http://d.hatena.ne.jp/keyword/%A5%C7%A5%A3%A5%EC%A5%AF%A5%C8)リ名と行末の[正規表現](http://d.hatena.ne.jp/keyword/%C0%B5%B5%AC%C9%BD%B8%BD)でテストします。

```
require 'spec_helper'

# describe file('/home/vagrant/myapp') do
#   it { should be_directory }
# end

describe command('ls -la /home/vagrant') do
  its(:stdout) { should match /\smyapp$/ }
end
```

Itamaeのレシピでは[ディレクト](http://d.hatena.ne.jp/keyword/%A5%C7%A5%A3%A5%EC%A5%AF%A5%C8)リを作成するレシピを追記します

```
directory '/home/vagrant/myapp'
```
