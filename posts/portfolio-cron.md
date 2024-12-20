---
title: GitHub Actionsでポートフォリオサイトの情報を毎日更新する仕組みを作りました
description: 僕のポートフォリオサイトでは、アクティブに活動していることをアピールするために、GitHubのコントリビューション数を表示しています。そこで、GitHub Actionsで以下のようなワークフローファイルを作成することで、毎日決まった時刻に情報を取得し、静的なコンテンツとしてデプロイする仕組みを作りました。
date: 2023-09-24
tag:
  - GitHub Actions
published: true
---

僕の[ポートフォリオサイト](https://portfolio.neoki.me/ja)では、アクティブに活動していることをアピールするために、GitHubのコントリビューション数を表示しています。

<div align="center" style={{ marginTop: "1rem" }}>
  <img src="/images/portfolio-cron/portfolio.png" alt="Portfolio" />
</div>

よくある実装方法としては、ページを表示するときにクライアントサイドでGitHubから情報を取得して表示する方法があると思います。しかし、このサイトは、[Astro](https://docs.astro.build/ja)という高速なWebサイトを構築するためのフレームワークを使用しており、出来るだけ動的なコンテンツを減らしたいという思いがありました。また、そこまでリアルタイムに表示したい情報でもないと思いました。

そこで、GitHub Actionsで以下のようなワークフローファイルを作成することで、毎日決まった時刻に情報を取得し、静的なコンテンツとしてデプロイする仕組みを作りました。

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

- `schedule`を設定することで、毎日決まった時刻にワークフローが実行されるようになります。
- `update-github-data`ジョブで実行している`npm run fetch:github-data`は、自作したスクリプトを実行するためのコマンドです。このスクリプトは、GitHubのAPIに接続してコントリビューション数を取得し、以下のJavaScriptファイルとして保存しています（Astro内で扱いやすいように、各曜日ごとにグループ化してから保存しています）。
  ```js
  export const weeklyContributions = [
    [
      { contributionCount: 4, date: "2022-09-18" },
      { contributionCount: 5, date: "2022-09-25" },
      { contributionCount: 8, date: "2022-10-02" },
      // ...
    ],
    [
      { contributionCount: 2, date: "2022-09-19" },
      { contributionCount: 1, date: "2022-09-26" },
      { contributionCount: 1, date: "2022-10-03" },
    ],
    // ...
  ];
  ```
- `update-github-data`ジョブの最後のステップでは、上記スクリプトで更新したファイルをリポジトリにプッシュしています。
- `update-github-data`ジョブが終わった後にデプロイ処理を行います。


課題として、公開リポジトリにした場合、`git push`が失敗してしまいます（デフォルトブランチへの直接プッシュがブロックされるようです）。どうすれば良いのか少し調べたこともあるのですが、ポートフォリオサイトのソースコードを公開することをあまり考えていなかったので、すぐに諦めました。

ひとまず、プライベートリポジトリであれば問題なく動作するので、このまま運用していこうと思います。