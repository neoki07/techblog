---
title: Changesetsの公開処理をpublishスクリプトで行うと失敗してしまう
description: Changesetsの公開処理をpublishスクリプトで行うとGitHub Actionsワークフローが失敗してしまう問題について解決策を記載しています。
date: 2024-11-02
tag:
  - Changesets
  - npm
published: true
---

[こちら](https://github.com/neoki07/prettier-plugin-astro-organize-imports)の自作パッケージのバージョニングのために[Changesets](https://github.com/changesets/changesets)を使っているのですが、npmに公開するためのGitHub Actionsワークフローが失敗する問題がありました。

<div align="center" style={{ marginTop: "1rem" }}>
  <img src="/images/changesets-publish/workflow-failed.png" alt="" />
</div>

公開処理のログを見てみると以下のようなメッセージが記載されており、なぜかすでにnpmに公開されているようです。
> You cannot publish over the previously published versions: x.y.z. 

また、ワークフローは失敗しているのに、確かにnpmを見ると新しいバージョンが公開されていました。

<div align="center" style={{ marginTop: "1rem" }}>
  <img src="/images/changesets-publish/npm.png" alt="" />
</div>

これらの状況から、公開処理が2回実行されており、2回目の実行でエラーが出ているのではないかと思いました。ChangesetsのIssueを調べてみると、[こちらのIssue](https://github.com/changesets/changesets/issues/964)が関係してそうです。これによると、`publish`スクリプトで公開するように設定していると2回実行されてしまうようです。

```json
"scripts": {
  "publish": "changeset publish",
},
```

以下のように、`publish`以外のスクリプト名に変更すると、ワークフローが失敗することなく公開できるようになります。

```json
"scripts": {
  "release": "changeset publish",
},
```
