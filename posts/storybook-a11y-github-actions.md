---
title: Storybook + Axe + GitHub Actionsでアクセシビリティを自動テストする
description: GitHub Actionsのワークフロー上でアクセシビリティを自動でテストする方法を紹介します。
date: 2024-10-06
tag:
  - Storybook
  - Axe
  - GitHub Actions
  - CI
  - Accessibility
published: true
---

この記事では、GitHub Actionsのワークフロー上でアクセシビリティを自動でテストする方法を紹介します。
基本的には、Storybookの公式ドキュメントの[Accessibility tests](https://storybook.js.org/docs/writing-tests/accessibility-testing)や[Test runner](https://storybook.js.org/docs/writing-tests/test-runner)に書いてあるとおりです。

## Storybookのインストール

まずは、プロジェクトにStorybookをインストールします。

```sh
mkdir my-project
cd my-project
npx storybook@latest init
```

上記の手順のように、空のプロジェクトに対してStorybookをインストールする場合、どのフレームワークを使うか聞かれるので、任意のものを選択します。

<div align="center" style={{ marginTop: "1rem" }}>
  <img src="/storybook-a11y-github-actions/install-script-framework.png" alt="" />
</div>

Storybookのインストールが完了すると、自動的にブラウザでStorybookが起動します。

<div align="center" style={{ marginTop: "1rem" }}>
  <img src="/storybook-a11y-github-actions/storybook.png" alt="" />
</div>

## アクセシビリティのテストを実行する仕組みを作る

ここで紹介する仕組みでは、[Axe](https://www.deque.com/axe/)というアクセシビリティのテストツールを使います。Storybookの[Test runner](https://storybook.js.org/docs/writing-tests/test-runner)という仕組みを使うことで、ストーリーに対してAxeによるアクセシビリティテストを簡単に導入できます。

まずは、必要なnpmパッケージをインストールします。

```sh
npm install @storybook/test-runner axe-playwright --save-dev
```

次に、`package.json`にTest runnerを実行するスクリプトを追加します。

```sh
{
  "scripts": {
    "test-storybook": "test-storybook"
  }
}
```

その後、`.storybook/test-runner.ts`というファイルを作成し、Test runnerでアクセシビリティのテストを行うための設定を書きます。

```sh
import type { TestRunnerConfig } from '@storybook/test-runner';
import { injectAxe, checkA11y } from 'axe-playwright';

/*
 * See https://storybook.js.org/docs/writing-tests/test-runner#test-hook-api
 * to learn more about the test-runner hooks API.
 */
const config: TestRunnerConfig = {
  async preVisit(page) {
    await injectAxe(page);
  },
  async postVisit(page) {
    await checkA11y(page, '#storybook-root', {
      detailedReport: true,
      detailedReportOptions: {
        html: true,
      },
    });
  },
};

export default config;
```

これで、Test runnerでアクセシビリティのテストをする仕組みができました。

ローカル環境で試したい場合は、Storybookを起動後、`package.json`に追加した`test-storybook`スクリプトを実行すると動作します。

## アクセシビリティのテストを実行するGitHub Actionsのワークフローを作る

次に、先ほど設定したTest runnerを、GitHub Actionsのワークフロー上で実行できるようにしていきます。

[Storybookの公式ドキュメント](https://storybook.js.org/docs/writing-tests/test-runner#set-up-ci-to-run-tests)に、GitHub Actionsワークフロー上でTest runnerを実行する手順が書かれているので、これを参考にしていきます。

`.github/workflows/storybook-tests.yml`というファイルを作って、以下の内容を記載します。


```
name: Accessibility Tests

on: push

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npm run build-storybook --quiet
      - run: |
          npx concurrently -k -s first -n "SB,TEST" -c "magenta,blue" \
            "npx http-server storybook-static --port 6006 --silent" \
            "npx wait-on tcp:127.0.0.1:6006 && npm run test-storybook"
```

GitHubリポジトリに今回のプロジェクトをプッシュすると、自動的にGitHub Actionsのワークフローが実行され、アクセシビリティのテストができます。

<div align="center" style={{ marginTop: "1rem" }}>
  <img src="/storybook-a11y-github-actions/github-ci-result.png" alt="" />
</div>

ただし、`npx storybook@latest init`したときにStorybookによって作成されるコンポーネントには、Axeの基準ではアクセシビリティの問題があるようで、テストは失敗してしまいます😓
