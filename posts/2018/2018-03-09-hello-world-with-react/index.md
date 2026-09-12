---
title: "ReactでHello World!"
date: "2018-03-09"
---

## Node.jsのインストール

Homebrewでインストール

```
brew -v
brew update
brew install nodejs
node -v
```

## インストール用プロジェクトの作成

JSのプログラムをプロジェクト単位で管理。
`npm init -y` でパッケージの管理ファイル(`package.json`)を作成する。

```
mkdir hello_react
cd hello_react
npm init -y
```

## package.[json](http://d.hatena.ne.jp/keyword/json)の変更

1. desctiption(説明文)を記入
2. [Github](http://d.hatena.ne.jp/keyword/Github)で公開しないprivateなプロジェクトと指定
3. 開発ツールの起動[スクリプト](http://d.hatena.ne.jp/keyword/%A5%B9%A5%AF%A5%EA%A5%D7%A5%C8)startを定義
4. webpack実行用[スクリプト](http://d.hatena.ne.jp/keyword/%A5%B9%A5%AF%A5%EA%A5%D7%A5%C8)webpackを定義

```
{
  "name": "hello_react",
  "version": "1.0.0",
  "description": "Hello React", #1
  "private": true,              #2
  "main": "index.js",
  "scripts": {
    "start": "webpack-dev-server", #3
    "webpack": "webpack -d"        #4
  },
  "keywords": [],
  "author": "",
  "license": "ISC"
}
```

## npmパッケージをインストール

```
npm install react react-dom
npm install webpack webpack-cli webpack-dev-server --save-dev
npm install babel-cli babel-loader babel-preset-env babel-preset-react --save-dev
npm install eslint eslint-loader eslint-plugin-react --save-dev
npm install css-loader style-loader --save-dev
```

## インストール結果の確認用Reackコード

1. [ディレクト](http://d.hatena.ne.jp/keyword/%A5%C7%A5%A3%A5%EC%A5%AF%A5%C8)リー作成

```
mkdir src
mkdir public
```

1. .babelrc作成

```
vim .babelrc
cat .babelrc
{
  "presets": ["env", "react"]
}
```

1. .eslintrc.[json](http://d.hatena.ne.jp/keyword/json)作成

```
vim .eslintrc.json
cat .eslintrc.json
{
  "env": {
    "browser": true,
    "es6": true
  },
  "parserOptions": {
    "sourceType": "module",
    "ecmaFeatures": {
      "experimentalObjectRestSpread": true,
      "jsx": true
    }
  },
  "extends": ["eslint:recommended", "plugin:react/recommended"],
  "plugins": ["react"],
  "rules": {
    "no-console": "off"
  }
}
```

1. webpack.config.js作成

```
vim webpack.config.js
cat webpack.config.js
module.exports = {
  entry: {
    app: "./src/index.js"
  },
  output: {
    path: __dirname + '/public/js',
    filename: "[name].js"
  },
    devServer: {
    contentBase: __dirname + '/public',
    port: 8080,
    publicPath: '/js/'
  },
  devtool: "eval-source-map",
  mode: 'development',
  module: {
    rules: [{
      test: /\.js$/,
      enforce: "pre",
      exclude: /node_modules/,
      loader: "eslint-loader"
    }, {
      test: /\.css$/,
      loader: ["style-loader","css-loader"]
    }, {
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'babel-loader'
     }]
  }
};
```

1. public/index.html作成

```
vim public/index.html
cat public/index.html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
  <meta http-equiv="X-UA-Compatible" content="IE=Edge, chrome=1" />
  <title>React App</title>
</head>
<body>
  <div id="root"></div>
  <script type="text/javascript" src="js/app.js" charset="utf-8"></script>
</body>
</html>
```

1. src/index.js

```
vim src/index.js
cat src/index.js
import React from 'react'
import ReactDOM from 'react-dom'

ReactDOM.render(
  <h1>Hello, world!!</h1>,
  document.getElementById('root') 
)
```

1. 確認

```
npm start
```

ターミナルに `webpack: Compiled successfully.` が表示されたら [ブラウザー](http://d.hatena.ne.jp/keyword/%A5%D6%A5%E9%A5%A6%A5%B6%A1%BC)で
`http://localhost:8080` をアクセスして`Hello World!` と表示されたらOK.
