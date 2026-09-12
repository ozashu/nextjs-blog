---
title: "CentOSにPythonの環境構築"
date: "2016-07-28"
---

[Python](http://d.hatena.ne.jp/keyword/Python)の環境構築についてです。
pyenv,virtualenv,pyvenvとややこしくて困惑しました。
私と同じような人は(ここを読むといいかも)<http://qiita.com/nobolis/items/12a464557f2ae007e9a1>

[github](http://d.hatena.ne.jp/keyword/github)からpyenvをチェックアウトします。

```
# git clone https://github.com/yyuu/pyenv.git ~/.pyenv
```

PyenvのPathを通します。

```
# echo 'export PYENV_ROOT=$HOME/.pyenv' >> ~/.bash_profile
# echo 'export PATH=$PYENV_ROOT/bin:$PATH' >> ~/.bash_profile
# echo 'eval "$(pyenv init -)"' >> ~/.bash_profile
# echo $PYENV_ROOT
```

設定を保存します。

```
# source ~/.bash_profile
# echo $PYENV_ROOT
/root/.pyenv
# echo $HOME
/root
```

※ [zsh](http://d.hatena.ne.jp/keyword/zsh)を使用している人は`source ~/.zshenv`などに変更します。

インストールできるバージョンを確認します。

```
# pyenv install -l
```

2.7.12をインストールします。

```
# pyenv install 2.7.12
Downloading Python-2.7.12.tar.xz...
-> https://www.python.org/ftp/python/2.7.12/Python-2.7.12.tar.xz
Installing Python-2.7.12...
WARNING: The Python bz2 extension was not compiled. Missing the bzip2 lib?
Installed Python-2.7.12 to /root/.pyenv/versions/2.7.12
```

WARNINGがでました。

こちらを参考にbuildします。[Common build problems](https://github.com/yyuu/pyenv/wiki/Common-build-problems)

```
# yum install zlib-devel bzip2 bzip2-devel readline-devel sqlite sqlite-devel openssl-devel
```

今回は`bzip2-devel`がないことがWARNINGの原因でした。

再インストールしてWARNINGが出ないことを確認しました。

```
# pyenv install 2.7.12
pyenv: /root/.pyenv/versions/2.7.12 already exists
continue with installation? (y/N) y
Downloading Python-2.7.12.tar.xz...
-> https://www.python.org/ftp/python/2.7.12/Python-2.7.12.tar.xz
Installing Python-2.7.12...
Installed Python-2.7.12 to /root/.pyenv/versions/2.7.12
```

次に3.5.2をインストールします。

```
# pyenv install 3.5.2
pyenv: /root/.pyenv/versions/3.5.2 already exists
continue with installation? (y/N) y
Downloading Python-3.5.2.tar.xz...
-> https://www.python.org/ftp/python/3.5.2/Python-3.5.2.tar.xz
Installing Python-3.5.2...
Installed Python-3.5.2 to /root/.pyenv/versions/3.5.2
```

デフォルトの[Python](http://d.hatena.ne.jp/keyword/Python)のversionは2.6.6でした。
早速2.7.12に変えてみます。

```
# python --version
Python 2.6.6
# pyenv
--version           exec                hooks               local               root                uninstall           version-file-read   version-origin      which
commands            global              init                prefix              shell               version             version-file-write  versions
completions         help                install             rehash              shims               version-file        version-name        whence
# pyenv global 2.7.12
# python --version
Python 2.7.12
```

pipを最新のものにしましょう。

```
[root@shuhei src]# pip install --upgrade pip
Collecting pip
  Downloading pip-8.1.2-py2.py3-none-any.whl (1.2MB)
    100% |████████████████████████████████| 1.2MB 617kB/s
Installing collected packages: pip
  Found existing installation: pip 8.1.1
    Uninstalling pip-8.1.1:
      Successfully uninstalled pip-8.1.1
Successfully installed pip-8.1.2
```

virtualenvは、同じ([python](http://d.hatena.ne.jp/keyword/python))バージョンで違う環境を作成するためのものです。

インストールして設定を`.bash_profile`に書き込みます。

```
# git clone https://github.com/yyuu/pyenv-virtualenv.git ~/.pyenv/plugins/pyenv-virtualenv
# echo 'eval "$(pyenv virtualenv-init -)"' >> ~/.bash_profile
# source ~/.bash_profile
```

新しい[python](http://d.hatena.ne.jp/keyword/python)環境の作成は、`pyenv virtualenv [version] <virtualenv-name>`で作成できます。
ここでは3.5.2の環境の`new_3.5.2`を作成してみます。

```
# pyenv virtualenv 3.5.2 new_3.5.2
Ignoring indexes: https://pypi.python.org/simple
Requirement already satisfied (use --upgrade to upgrade): setuptools in /root/.pyenv/versions/3.5.2/envs/new_3.5.2/lib/python3.5/site-packages
Requirement already satisfied (use --upgrade to upgrade): pip in /root/.pyenv/versions/3.5.2/envs/new_3.5.2/lib/python3.5/site-packages
```

pyvenvは2.7系ではインストールされていませんでした。3.3以降を使用している人向けですね。

```
# python --version
Python 2.7.12
# pyvenv tutorial-env
pyenv: pyvenv: command not found

The `pyvenv' command exists in these Python versions:
  3.5.2
```

pyenvの他の環境作成の方法として、pyvenvについて
[Python](http://d.hatena.ne.jp/keyword/Python)[チュートリアル](http://d.hatena.ne.jp/keyword/%A5%C1%A5%E5%A1%BC%A5%C8%A5%EA%A5%A2%A5%EB)に説明が記載されていました。

> 仮想環境を置きたい[ディレクト](http://d.hatena.ne.jp/keyword/%A5%C7%A5%A3%A5%EC%A5%AF%A5%C8)リに移動して、
> pyvenvに仮想環境の[ディレクト](http://d.hatena.ne.jp/keyword/%A5%C7%A5%A3%A5%EC%A5%AF%A5%C8)リ名をつけて実行すればよいです。
> ここでの仮想環境とはアプリケーションが依存するソフトウェアを格納した[ディレクト](http://d.hatena.ne.jp/keyword/%A5%C7%A5%A3%A5%EC%A5%AF%A5%C8)リのことです。
> 仮想環境は[環境変数](http://d.hatena.ne.jp/keyword/%B4%C4%B6%AD%CA%D1%BF%F4)を利用して切り替えを行います。virtualenvでは[Python](http://d.hatena.ne.jp/keyword/Python)の
> パッケージをシステム[ディレクト](http://d.hatena.ne.jp/keyword/%A5%C7%A5%A3%A5%EC%A5%AF%A5%C8)リやユーザー[ディレクト](http://d.hatena.ne.jp/keyword/%A5%C7%A5%A3%A5%EC%A5%AF%A5%C8)リに配置するのではなく、
> アプリケーション専用の分離された[ディレクト](http://d.hatena.ne.jp/keyword/%A5%C7%A5%A3%A5%EC%A5%AF%A5%C8)リに配置します。
> これにより、プロジェクト毎に利用する[Python](http://d.hatena.ne.jp/keyword/Python)[バイ](http://d.hatena.ne.jp/keyword/%A5%D0%A5%A4)ナリや依存ライブラリを
> 簡単に切り替えることができるようになります。
>
> `utorial-env`という[ディレクト](http://d.hatena.ne.jp/keyword/%A5%C7%A5%A3%A5%EC%A5%AF%A5%C8)リを作り、[Python](http://d.hatena.ne.jp/keyword/Python)[インタープリタ](http://d.hatena.ne.jp/keyword/%A5%A4%A5%F3%A5%BF%A1%BC%A5%D7%A5%EA%A5%BF)、標準ライブラリなどの
> サポートファイルを[ディレクト](http://d.hatena.ne.jp/keyword/%A5%C7%A5%A3%A5%EC%A5%AF%A5%C8)リツリーを生成します。
> また、生成し仮想環境はアクティベートする必要があります。
> virtualencをアクティベートすると、シェルのプロンプトが使っているvirtualenvを示すものに変わり、
> また`python`を入力した時に、特定バージョンの指定のインストール実体が実行されるように環境が変わります。

```
# pyenv global 3.5.2
# pyvenv tutorial-env
# source tutorial-env/bin/activate
(tutorial-env) # python
Python 3.5.2 (default, Jul 18 2016, 05:05:01)
[GCC 4.4.7 20120313 (Red Hat 4.4.7-17)] on linux
Type "help", "copyright", "credits" or "license" for more information.
>>> import sys
>>> sys.path
['', '/root/.pyenv/versions/3.5.2/lib/python35.zip', '/root/.pyenv/versions/3.5.2/lib/python3.5', '/root/.pyenv/versions/3.5.2/lib/python3.5/plat-linux', '/root/.pyenv/versions/3.5.2/lib/python3.5/lib-dynload', '/root/.pyenv/tutorial-env/lib/python3.5/site-packages']
```
