---
title: "GoでTravis-CIを使ってのテストとデプロイ"
date: "2019-05-07"
---

Goで何か書いた時にCIの設定をまとめてみた。
もっといい方法がありそうなので、ブラッシュアップしていきたい。
`golangci-lint` でsyntaxチェックして `goreleaser` でdeployの流れ。

- `.travis.yml`

[travis](http://d.hatena.ne.jp/keyword/travis)の設定は以下の用にする。

branches: ciの設定(ブランチがマスターブランチ以外にプッシュされた場合、CIは実行しないように)
notifications: slackの設定
jobs: lintチェックさせる。 `./bin/golangci-lint` pathに注意
deploy: deployはgoreleaserを使う

```
language: go
branches:
  only:
    - master 
go:
  - 1.11.x
env:
  - GO111MODULE=on
git:
  depth: 1
before_script:
  - curl -sfL https://install.goreleaser.com/github.com/golangci/golangci-lint.sh | sh -s v1.13.2
install: true
notifications:
  slack:
    secure: hogehoge
jobs:
  include:
    - stage: lint
      script:
        - go get -v -t -d ./...
        - ./bin/golangci-lint run --config .golangci.yml
    - stage: test
      script: go test -v -race -cover ./...
    - stage: build
      script: go build
deploy:
  - provider: script
    skip_cleanup: true
    script: curl -sL https://git.io/goreleaser | bash
    on:
      tags: true
```

- `.golangci.yml`

golangci configは以下の内容で大体十分。

```
run:
  deadline: 5m
linters:
  disable-all: true
  enable:
    - gofmt
    - golint
    - govet
    - staticcheck
    - unused
    - ineffassign
    - misspell
    - gocyclo
    - deadcode
    - typecheck
```

- `.goreleaser.yml`

builds.binary: バイナリ名
release: [github](http://d.hatena.ne.jp/keyword/github)の[リポジトリ](http://d.hatena.ne.jp/keyword/%A5%EA%A5%DD%A5%B8%A5%C8%A5%EA)のownerとnameを入れておきます。

```
before:
  hooks:
  - go mod download
builds:
  - binary: hogehoge
    goos:
      - darwin
      - linux
    goarch:
      - amd64
changelog:
  filters:
    exclude:
      - .github
      - Merge pull request
      - Merge branch
archive:
  format: tar.gz
  name_template: "{{ .ProjectName }}_{{ .Os }}_{{ .Arch }}"
  files:
    - README.md
  replacements:
    darwin: Darwin
    linux: Linux
    amd64: x86_64
release:
  github:
    owner: hogehoge
    name: hogehoge
```
