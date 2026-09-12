---
title: "EKS環境に対してlocust podをskaffoldでデプロイして負荷試験準備した"
date: "2020-05-14"
---

EKSは別に関係ないです。
[負荷試験](http://d.hatena.ne.jp/keyword/%C9%E9%B2%D9%BB%EE%B8%B3)環境を用意した時、skaffoldでlocust環境を用意したので、そのメモ。

## 事前準備

1. docker [daemon](http://d.hatena.ne.jp/keyword/daemon)の起動とskaffoldのインストール
2. ecrにimageを置くための[リポジトリ](http://d.hatena.ne.jp/keyword/%A5%EA%A5%DD%A5%B8%A5%C8%A5%EA)を用意

## Description

Projectのlocustを動かすmanifestとシナリオ群を用意する。

## パッケージ構成はこんな感じになった

```
├── Dockerfile                    //locustのimageの元
├── README.md                     //説明書
├── src                           //シナリオ置き場
│   └── {scenario_name}.py        // シナリオ
├── scripts                       //locust起動script置き場
│   └── docker-entrypoint.sh
└── deployment                    // シナリオmanifest置き場
     ├── helm                     // シナリオ毎にpathを切ります
     │  ├── Chart.yaml            // locustで実行するスクリプト
     │  ├── templates             // 
     │  │  ├─ _helpers.tpl        // helmのhelper
     │  │  ├─ master-deploy.yaml  // locustのmasterのmanifest
     │  │  ├─ master-svc.yaml     // locustのmasterのserviceのmanifest
     │  │  ├─ worker-deploy.yaml  // locustのworkerのmanifest
     │  │  └- worker-hpa.yaml    // hpaのmanifest
     │  └── values.yaml           // locustのチャートの値
     ├── helm_vars                // シナリオ毎にpathを切ります
     │  └─ values.yaml            // locustのチャートの値のoverride用
     └── skaffold.yaml            // skaffoldのmanifest
```

## locust

[locust自体はこの方がやっていることをそのまま参考にしています](https://github.com/karol-brejna-i/locust-experiments/tree/master/docker-image)

`docker-entrypoint.sh`はこんな感じにした。

```
#!/usr/bin/env sh

if [ -z "${TARGET_URL}" ]; then
    echo "ERROR: TARGET_URL not configured" >&2
    exit 1
fi

LOCUST_MODE="${LOCUST_MODE:=standalone}"
_LOCUST_OPTS="-f ${LOCUSTFILE_PATH:-/locustfile.py} -H ${TARGET_URL}"

if [ "${LOCUST_MODE}" = "master" ]; then
    _LOCUST_OPTS="${_LOCUST_OPTS} --master"
elif [ "${LOCUST_MODE}" = "slave" ]; then
    if [ -z "${LOCUST_MASTER_HOST}" ]; then
        echo "ERROR: MASTER_HOST is empty. Slave mode requires a master" >&2
        exit 1
    fi

    _LOCUST_OPTS="${_LOCUST_OPTS} --slave --master-host=${LOCUST_MASTER_HOST} --master-port=${LOCUST_MASTER_PORT:-5557}"
fi

echo "Starting Locust in ${LOCUST_MODE} mode..."
echo "$ locust ${LOCUST_OPTS} ${_LOCUST_OPTS}"

exec locust ${LOCUST_OPTS} ${_LOCUST_OPTS}
```

`Dockerfile` はこんな感じ

`ENTRYPOINT ["./docker-entrypoint.sh"]` にしたらpermission errorで実行できなかった。

```
FROM python:3.8-alpine
RUN apk add --no-cache -U zeromq-dev ca-certificates
COPY requirements.txt /tmp
RUN apk add --no-cache -U --virtual build-deps libffi-dev g++ gcc linux-headers &&\
    pip install --upgrade pip &&\
    pip install -r /tmp/requirements.txt && \
    apk del build-deps
EXPOSE 443 5557 5558
WORKDIR /locust
COPY ./src src
COPY ./scripts/docker-entrypoint.sh .
ENTRYPOINT ["sh", "./docker-entrypoint.sh"]
```

locustのmasterとworkerの[マニフェスト](http://d.hatena.ne.jp/keyword/%A5%DE%A5%CB%A5%D5%A5%A7%A5%B9%A5%C8)はhelmで書いて、
サービス毎にシナリオを追加できるようにしました。

`master-deploy.yaml` の中身

## skaffold.[yaml](http://d.hatena.ne.jp/keyword/yaml)

こんな感じに[マニフェスト](http://d.hatena.ne.jp/keyword/%A5%DE%A5%CB%A5%D5%A5%A7%A5%B9%A5%C8)作成
profilesを使って、対象を分けた。

```
apiVersion: skaffold/v1
kind: Config

build:
  local: {}
  artifacts:
    - image: {{AWSアカウントID}}.dkr.ecr.ap-northeast-1.amazonaws.com/project/locust
      context: .
  tagPolicy:
    sha256: {}
portForward:

profiles:
  - name: project-locust1
    deploy:
      kubeContext: arn:aws:eks:ap-northeast-1:{{AWSアカウントID}}:cluster/{{クラスタ名}}
      helm:
        releases:
          - name: project-locust1
            namespace: locust-test
            chartPath: ./deployment/helm
            valuesFiles:
              - ./deployment/helm_vars/locust1-values.yaml
            values:
              image: {{AWSアカウントID}}.dkr.ecr.ap-northeast-1.amazonaws.com/project/locust
            imageStrategy:
              helm: {}
  - name: project-locust2
    deploy:
      kubeContext: arn:aws:eks:ap-northeast-1:{{AWSアカウントID}}:cluster/{{クラスタ名}}
      helm:
        releases:
          - name: project-locust2
            namespace: locust-test
            chartPath: ./deployment/helm
            valuesFiles:
              - ./deployment/helm_vars/locust2-values.yaml
            values:
              image: {{AWSアカウントID}}.dkr.ecr.ap-northeast-1.amazonaws.com/project/locust
            imageStrategy:
              helm: {}
    portForward:
      - resourceType: service
        resourceName: locust2-master-svc
        namespace: locust-test
        port: 8089
```

## Usage

deployとdeleteはこんな感じ。
`-p` でprofileを指定して、locustのターゲットを指定した。

```
## deploy
$ skaffold run -f deployment/skaffold.yaml -p project-locust1

## delete
$ skaffold delete -f deployment/skaffold.yaml -p project-locust1
```

## 新規にシナリオを追加したい時

以下の手順で増やしていけばいいだけ。

1. `src` 配下にシナリオを追加
2. `helm_vars` 配下にシナリオごとに変更したい値をoverrideさせる[yaml](http://d.hatena.ne.jp/keyword/yaml)を書く
3. `skaffold.yaml` の `profiles` に追加したいシナリオの情報を追記する

## 番外編

aws2コマンドにしたら[aws](http://d.hatena.ne.jp/keyword/aws) ecrへのloginコマンドが変わっていた。
以下でイケました。

```
 aws ecr get-login-password \
              --region {{リージョン名}} \
          | docker login \
              --username AWS \
              --password-stdin {{AWSアカウントID}}.dkr.ecr.ap-northeast-1.amazonaws.com
```

## 参考URL

[【AWS】初めてのECR](https://qiita.com/3utama/items/b19e2239edb6996a735f)

[今度はあんまりゴツくない！？「わりとゴツいKubernetesハンズオン」そのあとに](https://qiita.com/Kta-M/items/83db480075caabcb0b7a#skaffold%E3%81%AE%E8%A8%AD%E5%AE%9A%E3%83%95%E3%82%A1%E3%82%A4%E3%83%AB%E3%82%92%E8%AA%BF%E6%95%B4)

[[アップデート]AWS CLI v2 で $ aws ecr get-login を使うときの注意点](https://dev.classmethod.jp/articles/aws-cli-v2-ecr-get-login-password/)

[Locustを触ってみた](https://qiita.com/rhirabay/items/bf9c6c2b75412668377b)

[Google発のコンテナアプリケーション開発支援ツール「Skaffold」や「Kaniko」を使ってみる](https://knowledge.sakura.ad.jp/15321/)

[skaffold run](https://skaffold.dev/docs/references/cli/#skaffold-run)

[Kubernetesのアプリケーション開発で楽をしたい。そうだ、Skaffoldを使ってみよう！](https://www.skyarch.net/blog/?p=16368)

[/docker-entrypoint.sh": permission denied](https://github.com/composer/docker/issues/7)
