---
title: 個人開発サイトのStorybookをChromaticで公開してみました
description: 現在、Web開発の学習のためにショッピングサイトを作成しています。今回、Storybookのコアメンテナが開発しているChromaticを使うことで簡単にStorybookを公開できることを知り、公式感のあるサービスということもあって早速試してみました。
date: 2023-10-09
tag:
  - Storybook
  - Chromatic
published: true
---

import { Callout } from 'nextra/components'

現在、Web開発の学習のために[ショッピングサイト](https://next-bazaar.vercel.app/)を作成しています。フロントエンドの共通コンポーネントを[Storybook](https://storybook.js.org/)で管理しており、以前からせっかくなので公開したいなという気持ちがありました。今回、Storybookのコアメンテナが開発している[Chromatic](https://www.chromatic.com/)を使うことで簡単にStorybookを公開できることを知り、公式感のあるサービスということもあって早速試してみました。

<Callout type="info">Chromaticには、チームでUIのフィードバックを行うための様々な機能があるようですが、今回はStorybookを公開するためだけに使っています。</Callout>

## ChromaticでStorybookを公開する

ChromaticでStorybookを公開する方法は、以下のドキュメントを参考にしました。

- https://www.chromatic.com/docs/setup/
- https://www.chromatic.com/docs/github-actions/#support-for-actions-checkout-v2-and-above

最初のデプロイをしてみると、Chromatic上では以下のページが表示されました。

<div align="center" style={{ marginTop: "1rem" }}>
  <img src="/images/chromatic/first-build.png" alt="First Build" />
</div>

肝心のStorybookはどこから確認できるのか少し迷いましたが、下にスクロールしていくとリンクがありました。

<div align="center" style={{ marginTop: "1rem" }}>
  <img src="/images/chromatic/storybook-link.png" alt="Storybook Link" />
</div>

リンクをクリックすると、Storybookが表示されました🥳

<div align="center" style={{ marginTop: "1rem" }}>
  <img src="/images/chromatic/storybook.png" alt="Storybook" />
</div>

## `main`ブランチの最新のStorybookのURLを取得する

最後に、GitHubリポジトリの`README.md`にStorybookのリンクを追加しようと思ったのですが、ここで問題が1つありました。それは、デプロイごとにStorybookのURLが変わってしまうことです。

- 1回目のURL: https://65224f832ec3028e25f863e1-tqszkkyisb.chromatic.com/
- 2回目のURL: https://65224f832ec3028e25f863e1-sxmowkoksw.chromatic.com/

出来れば、`README.md`には`main`ブランチの最新のURLを追加したいのですが、このままでは`README.md`を毎回更新する必要があります。

何か情報がないかとChromaticのドキュメントを調べてみると、[GitHub Actionsの設定方法のページ](https://www.chromatic.com/docs/github-actions/#outputs)にヒントがありました。

<div align="center" style={{ marginTop: "1rem" }}>
  <img src="/images/chromatic/latest-storybook-url.png" alt="Storybook" />
</div>

どうやら、`https://<ブランチ名>--<プロジェクトID>.chromatic.com`というフォーマットで最新のStorybookのURLを取得できそうです。

ということで、以下のURLにアクセスしてみると、Storybookのページが表示されました👏

- https://main--65224f832ec3028e25f863e1.chromatic.com/

