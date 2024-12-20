---
title: ポートフォリオサイトの情報を毎日更新する仕組みを見直しました
description: 僕のポートフォリオサイトでは、アクティブに活動していることをアピールするために、GitHubのコントリビューション数を表示しています。今回は、公開リポジトリでも動作するように、GitHub Actionsの設定を見直したので、その方法を紹介します。
date: 2023-10-02
tag:
  - GitHub Actions
  - Vercel
published: true
---

僕の[ポートフォリオサイト](https://portfoli.neoki.me/ja)では、アクティブに活動していることをアピールするために、GitHubのコントリビューション数を表示しています。

[以前の記事](https://techblog.neoki.me/portfolio-cron)で、変更をプッシュしたときに、GitHub Actionsで情報を取得してコミット→デプロイという方法で実現したことを紹介しました。ただ、この方法はリポジトリを公開すると動作しない（デフォルトブランチへの直接プッシュがブロックされる）問題がありました。

今回は、公開リポジトリでも動作するように、GitHub Actionsの設定を見直したので、その方法を紹介します（ふと、他の開発をしているときに思いついた方法で、かなりシンプルです。最初から思いつかなかったのが悔やまれます...）。

## 今までの方法

情報の更新は、GitHub Actionsのワークフロー内で、情報取得用のスクリプト（`npm run fetch:github-data`）を実行してコミットすることで実施していました。これは、ワークフローからリポジトリに直接プッシュしているため、公開リポジトリにすると動作しませんでした。

```yml
name: Deploy

on:
  schedule:
    - cron: '0 21 * * *'

jobs:
  update-github-data:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm install
      - run: npm run fetch:github-data
        env:
          GITHUB_USERNAME: ${{ secrets._GITHUB_USERNAME }}
          GITHUB_ACCESS_TOKEN: ${{ secrets._GITHUB_ACCESS_TOKEN }}
      - name: git setting
        run: |
          git config --local user.name "GitHub Action"
          git config --local user.email "action@github.com"
          git add src/data
          git commit -m "update github data"
          git pull
          git push

  deploy:
    needs: update-github-data
    # デプロイ用の設定
```

## 今回の方法

`package.json`に、情報を取得する処理を`prepare`スクリプトとして登録しました。`prepare`スクリプトは、パッケージのインストール時に自動的に実行される特別なものです。このポートフォリオサイトのホスティング先であるVercelでは、デプロイ時にパッケージのインストール処理が実行されるため、そのタイミングで情報の更新も自動的に行われるようになります。

```json
{
  "scripts": {
    // ...
    "prepare": "bun fetch:github-data",
    "fetch:github-data": "bun scripts/fetchGithubData.js"
  },
}
```

この変更により、ワークフローはデプロイするだけになり、公開リポジトリにしても動作するようになりました👏

```yml
name: Deploy

on:
  workflow_dispatch:
  schedule:
    - cron: '0 21 * * *'

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: --prod
          working-directory: ./
```

せっかくなので、この変更を機に公開したリポジトリを紹介しておきます。

[https://github.com/neoki07/portfolio](https://github.com/neoki07/portfolio)
