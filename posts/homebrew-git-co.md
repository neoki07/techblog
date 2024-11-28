---
title: 自作CLIツールをHomebrewで公開しました
description: 昔作成したCLIツールを、アップデートのついでにHomebrewでインストールできるようにしました。この記事では、その手順を紹介します。
date: 2023-11-05
tag:
  - Homebrew
  - Rust
  - CLI
  - OSS
published: true
---

> 追記：この記事で紹介している`git-co`は、`gibra`へと名前を変更しました。GitHubリポジトリは[こちら](https://github.com/neoki07/gibra)です。

昔作成したCLIツールを、アップデートのついでにHomebrewでインストールできるようにしました。この記事では、その手順を紹介します。

作成したツールについては、最後に紹介します。

## Homebrewでインストールできるようにする手順

### GitHubのリリース機能を使ったバイナリの公開

[こちら](https://blog.ymgyt.io/entry/release-rust-with-homebrew/)のサイトを参考にして、GitHubのリリース機能でバイナリを公開することにしました。

まず、以下の手順を実行して、バイナリを作成しました。

```sh
cd path/to/git-co
cargo build --release
cd target/release
tar -czf git-co-0.3.0-x86_64-apple-darwin.tar.gz git-co
shasum -a 256 git-co-0.3.0-x86_64-apple-darwin.tar.gz
```

SHA256の値は、Formulaファイルを作成するときに使います。

その後、GitHub上でリリースを作成して、そのリリースにアセットとしてバイナリをアップロードしました。

<div align="center" style={{ marginTop: "1rem" }}>
  <img src="/images/homebrew-git-co/github-release.png" alt="GitHub Release" />
</div>


### HomebrewのFormulaの作成

[こちら](https://nasaemon.hateblo.jp/entry/cli-tool-banasi)のサイトを参考にして、HomebrewのFormulaファイルを一元管理するリポジトリを作成することにしました。

僕は、`homebrew-tap`という名前のリポジトリを作成しました。

https://github.com/neoki07/homebrew-tap

その後、`git-co`用のFormulaファイルを作成しました。

```ruby
class GitCo < Formula
  desc "A CLI tool for branch switching by providing a selection-based checkout process"
  homepage "https://github.com/neoki07/git-co"
  url "https://github.com/neoki07/git-co/releases/download/v0.3.0/git-co-0.3.0-x86_64-apple-darwin.tar.gz"
  sha256 "972bf109ca9a0c02ecad10e383409258c6a1380c992d98f521c5234f09784a94"
  license "MIT"
  version "0.3.0"

  def install
    bin.install "git-co"
  end

  test do
    system "#{bin}/git-co --version"
  end
end
```

`url`の値には、先ほどアップロードしたバイナリのURLを指定し、`sha256`の値には、先ほどビルド時に`shasum`コマンドで算出したSHA256の値を指定します。

このFormulaファイルをプッシュことで、Homebrewでインストールできるようになります。インストールは、以下のコマンドで実行できます。

```sh
brew install neoki07/tap/git-co
```

## 作成したCLIツールの紹介

最後に、簡単にCLIツールの紹介をしておきます。`git-co`という名前のツールで、`git checkout`の代わりに使えるCLIツールです。`git-co`コマンドを実行すると、存在するブランチの一覧が表示され、その中から選択したブランチに切り替えることができます。

よろしければ、使ってみてください。

https://github.com/neoki07/git-co
