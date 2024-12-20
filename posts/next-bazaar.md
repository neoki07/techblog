---
title: Web開発を学ぶために個人開発しているシステムの構成や実装上の工夫点をまとめます
description: 現在、Web開発の学習のためにショッピングサイトを作成しています。ゆる〜くコツコツと開発を進めており、気がつけば開発を始めてから約半年が経過していました。それによって、徐々にシステム構成や実装上の工夫点を自分でも覚えておけなくなっているので、ここにまとめておきます。
date: 2023-10-28
tag:
  - Web Development
  - Next Bazaar
published: true
---

import { Callout, FileTree } from 'nextra/components'

現在、Web開発の学習のためにショッピングサイトを作成しています。

- [Webサイト](https://next-bazaar.vercel.app/)
- [GitHubリポジトリ](https://github.com/neoki07/next-bazaar)

ゆる〜くコツコツと開発を進めており、気がつけば開発を始めてから約半年が経過していました。それによって、徐々にシステム構成や実装上の工夫点を自分でも覚えておけなくなっているので、ここにまとめておきます。

<Callout type="warning">約半年が経過していることから、既に思い出すこと・まとめることが大変になっています。よって、この記事は、一度にまとめるのではなく随時更新していく形にしていきます。</Callout>

## 技術スタックとシステム構成

技術スタックは次のようになっています。

| カテゴリ | 技術 |
| --- | --- |
| フロントエンド | TypeScript, React, Next.js (pages directory), TanStack Query, Mantine, React Hook Form, Zod, Orval |
| バックエンド | Go, Fiber, sqlc |
| データベース | Amazon RDS (PostgreSQL) |
| ストレージ | Amazon S3 |
| デプロイ | Vercel, AWS App Runner, Amazon ECR, Docker |
| CI/CD | GitHub Actions |
| その他 | Storybook, Chromatic, ESLint, Prettier, Jest, React Testing Library, Mock Service Worker, Swagger |

また、システム構成は、次の図のようになっています。

<img src="/imageshttps://github.com/neoki07/next-bazaar/blob/main/assets/system-architecture.png?raw=true" alt="システム構成図" />

フロントエンドとバックエンドのコードはともに、GitHubにプッシュすると自動的にデプロイされるようになっています。フロントエンドは、VercelとGitHubリポジトリを連携することで、自動的にVercelにデプロイされます。バックエンドは、GitHub Actionsを使ってDockerイメージのビルドとAmazon ECRへのプッシュを行い、その後、AWS App Runnerを使ってデプロイされます。

### 技術選定の方針

技術選定は、次のようなものを考慮して行いました。

- 学習のために、最近のWeb開発のトレンドを取り入れる
- 採用することで、シンプルな書き方で実装できたり、コードの自動生成などによって少ないコード量で実装ができたりするライブラリを選ぶ
    - 開発の負担を少なくすることで、システムの品質も高めやすくなると思っています
- 出来るだけ、最近も活発にメンテナンスされている技術を選ぶ
    - 主に、GitHubリポジトリのスター数や最終コミット日時、最近のコミット頻度を確認しています

#### プログラミング言語

プログラミング言語には、静的型付け言語であるTypeScriptとGoを選択しました。選択した理由としては、業務で動的型付け言語（JavaScript, PHP）を使った大規模なシステム開発を経験する中で、エラーの早期発見が難しいことや、型が明示されていないコードを理解するのに時間がかかることを課題に感じたからです。

#### フロントエンドのライブラリ選定

フロントエンドに関しては、自前で実装するのが難しい部分を、ライブラリに任せることで開発の負担を減らしました。例えば、次のような部分です。

- フォームの値の管理やバリデーション
    - 使用ライブラリ：React Hook Form, Zod
- APIとのやり取りや取得したデータのキャッシュ
    - 使用ライブラリ：TanStack Query
- ボタンなどの共通UIコンポーネント
    - 使用ライブラリ：Mantine

#### バックエンドの技術選定

この個人開発を始めるまで、Goの開発経験はありませんでした。また、REST APIの開発自体、業務でもそこまで経験していない時期でした。そのため、優れた教材を探して、その構成をベースにすることにしました。教材探しにはかなりこだわりましたが、最終的には、次の教材を参考にしました（Youtubeに無料で公開されているのですが、ボリュームも多く、かなり良い教材だと思います）。

https://www.youtube.com/playlist?list=PLy_6D98if3ULEtXtNSY_2qN21VCKgoQAE

ただし、教材の中ではWebフレームワークとしてGinを使っていましたが、あえて少し異なる環境にすると開発スキルが身につきやすいと考え、Fiberを使うことにしました（一応、GinとFiberの書き方を見比べて、大きくは変わらなさそうだという確認はあらかじめ行いました）。

## ディレクトリ構成

まず、フロントエンドもバックエンドも、1つのリポジトリにソースコードをまとめています。フロントエンドのコードは`web`ディレクトリに、バックエンドのコードは`api`ディレクトリにそれぞれ格納しています。

<FileTree>
  <FileTree.Folder name="." defaultOpen>
    <FileTree.Folder name="web" />
    <FileTree.Folder name="api" />
  </FileTree.Folder>
</FileTree>

同じリポジトリにまとめた理由は、フロントエンドとバックエンドの開発を同時に進めることができるからです。1人で開発する分には、別々のリポジトリにして分離するよりも、開発効率の観点で良いと考えました。また、後述しますが、Swaggerドキュメントを元に、フロントエンドからAPIに対してリクエストを送るコードを自動生成する仕組みを導入しているので、その点でも同じリポジトリにまとめた方が良いと考えました。

### フロントエンドのディレクトリ構成

フロントエンドのディレクトリ構成は、次のようになっています。

<FileTree>
  <FileTree.Folder name="web" defaultOpen>
    <FileTree.Folder name="src" defaultOpen>
      <FileTree.Folder name="api" />
      <FileTree.Folder name="components" />
      <FileTree.Folder name="features" />
      <FileTree.Folder name="hooks" />
      <FileTree.Folder name="page-components" />
      <FileTree.Folder name="pages" />
      <FileTree.Folder name="providers" />
      <FileTree.Folder name="test-utils" />
      <FileTree.Folder name="types" />
      <FileTree.Folder name="utils" />
    </FileTree.Folder>
  </FileTree.Folder>
</FileTree>

#### `api`ディレクトリ

Swaggerドキュメントを元に、Orvalというライブラリを使って自動生成された、APIとのやり取りに役立つコードを格納しています。

#### `components`ディレクトリ

全体で共通して使うコンポーネントを格納しています。現在は、React Hook Formの仕組みにMantineのUIを組み合わせたフォームコンポーネントや、Next.jsの`Image`コンポーネントをラップした画像コンポーネント、ページのレイアウトコンポーネントなどを格納しています。

#### `features`ディレクトリ

システムの機能ごとにディレクトリを分けて、その機能に関するコンポーネントやフックなどを格納しています。例えば、認証に関連するコンポーネントやフックは`auth`ディレクトリ、商品に関連するコンポーネントやフックは`products`ディレクトリに格納しています。

#### `hooks`ディレクトリ

全体で共通して使うフックを格納しています。

#### `pages`、`page-components`ディレクトリ

`pages`は、Next.jsで定義されている、ページコンポーネントを格納するディレクトリです。ただ、`pages`内にコンポーネントを置くと、Next.jsによって自動的にルーティングが設定されてしまい、コンポーネント分割などの自由度が低いです。そこで、ページの実態は`page-components`ディレクトリに置き、`pages`ディレクトリは、それらのコンポーネントをラップするだけにしています。これにより、`pages`ディレクトリは、ルーティングの責務だけを持つようにしています。

#### `providers`ディレクトリ

全体で共通して使うプロバイダを格納しています。

#### `test-utils`ディレクトリ

テストコードを実装するときに使うユーティリティ関数を格納しています。

#### `types`ディレクトリ

全体で共通して使う型を格納しています。

#### `utils`ディレクトリ

全体で共通して使うユーティリティ関数を格納しています。

### バックエンドのディレクトリ構成

<FileTree>
  <FileTree.Folder name="api" defaultOpen>
    <FileTree.Folder name="api" />
    <FileTree.Folder name="db" />
    <FileTree.Folder name="docs" />
    <FileTree.Folder name="scripts" />
    <FileTree.Folder name="test_util" />
    <FileTree.Folder name="token" />
    <FileTree.Folder name="util" />
    <FileTree.File name="main.go" />
  </FileTree.Folder>
</FileTree>

#### `api`ディレクトリ

APIに関するコードを格納しています。具体的には、サーバの起動処理や各エンドポイントのハンドラ、各ドメインのモデルやサービスを格納しています。

#### `db`ディレクトリ

sqlcによるDB操作のためのコードを格納しています。

#### `docs`ディレクトリ

swagというライブラリによって自動生成されるSwaggerドキュメントを格納しています。

#### `scripts`ディレクトリ

スクリプトを格納しています。現在は、DBに動作確認用の初期データを投入するスクリプトを格納しています。

#### `test_util`ディレクトリ

テストコードを実装するときに使うユーティリティ関数を格納しています。現在は、テストコード実行時に使用するDBをセットアップする関数などを格納しています。

#### `token`ディレクトリ

セッション管理に使うトークンを生成する関数を格納しています。

#### `util`ディレクトリ

全体で共通して使うユーティリティ関数を格納しています。

#### `main.go`

サーバの起動処理を記述したエンドポイントとなるファイルです。

## 実装上の工夫点

### API仕様に関するコードの自動生成

バックエンド側では、swagというライブラリを使って、次のような情報からSwaggerドキュメントを自動生成しています。

- APIのリクエストやレスポンスを表す構造体
- ハンドラの仕様を記述したコメント（ハンドラ関数の上に記述しています）

自動生成に使用するコードの一部を次に示します。

```go filename="api/domain/user/model.go" {3-6}
package user_domain

type LoginRequest struct {
	Email    string `json:"email" validate:"required,email" swaggertype:"string"`
	Password string `json:"password" validate:"required,min=8"`
}
```

```go filename="api/user_handler.go" {3-10}
package api

// @Summary      Login
// @Tags         Users
// @Param        body body user_domain.LoginRequest true "User object"
// @Success      200 {object} messageResponse
// @Failure      400 {object} errorResponse
// @Failure      401 {object} errorResponse
// @Failure      500 {object} errorResponse
// @Router       /users/login [post]
func (h *userHandler) login(c *fiber.Ctx) error {
    // ...
}
```

また、フロントエンド側では、Swaggerドキュメントを元に、Orvalというライブラリを使ってAPIとのやり取りに役立つコードを自動生成しています。具体的には、次のようなコードを生成しています。

- APIのリクエストやレスポンスの型定義
- APIとのやり取りを行うフック

自動生成されたコードの一部を次に示します。

```ts filename="src/api/model/userDomainLoginRequest.ts"
export interface UserDomainLoginRequest {
  email: string
  password: string
}
```

```ts filename="src/api/endpoints/users/users.ts"
import type { UseMutationOptions } from '@tanstack/react-query'
import { useMutation } from '@tanstack/react-query'
import type { ErrorType } from '../../custom-axios-instance'
import { customAxiosInstance } from '../../custom-axios-instance'
import type { ApiErrorResponse, UserDomainLoginRequest } from '../../model'

export const usePostUsersLogin = <
  TError = ErrorType<ApiErrorResponse>,
  TContext = unknown
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof postUsersLogin>>,
    TError,
    { data: UserDomainLoginRequest },
    TContext
  >
  request?: SecondParameter<typeof customAxiosInstance>
}) => {
  const mutationOptions = getPostUsersLoginMutationOptions(options)

  return useMutation(mutationOptions)
}
```

これらのコードからも分かるように、生成されたフックは内部でTanStack Queryが使われており、これがOrvalを使うことにした理由の1つです（個人的に、TanStack Queryは使いやすく、コードもシンプルに保てるライブラリだと思い、好んで使っていました）。

まとめると、バックエンド側に記述したAPIのリクエストやレスポンス、ハンドラの仕様から、フロントエンド側でAPIとのやり取りに役立つコードの自動生成までを行うことができます。これにより、API仕様の変更にフロントエンド側が追従できる仕組みとなっています。

### ログアウト時にAPIから取得したデータのキャッシュを削除する処理

APIから取得したデータは、TanStack Queryによって自動的にキャッシュされています。しかし、セキュリティの観点で、ログアウト時にはセキュアなデータのキャッシュ（ユーザが出品した商品の情報など）を削除する必要があります。ただ、中にはセキュアではないデータのキャッシュ（トップページの商品一覧情報など）もあるのですが、それらは削除しないようにしておきたいです。

<Callout type="info">ここでは、ログインしていないと取得できないデータのことを「セキュアなデータ」、ログインしていなくても取得できるデータのことを「セキュアではないデータ」と呼んでいます。</Callout>

キャッシュごとに削除するかどうかを管理するのは、単純に面倒だという問題もありますが、設定を間違えるとセキュアなデータがキャッシュされたままになってしまうというリスクもあります。

そこで、キャッシュを削除する仕組みを次のようにしました。

- 認証を必要としないキャッシュのキーに`non-credentials`を付与する
- ログアウト時に、`queryClient.removeQueries`を使って、`non-credentials`を含まないキャッシュを削除する

この仕組みを実現するコードを次に示します。

```ts filename="src/utils/query-key.ts"
import { QueryKey } from '@tanstack/react-query'

const QUERY_KEY_NON_CREDENTIALS = 'non-credentials'

export function addNonCredentialsToQueryKey(queryKey: QueryKey): QueryKey {
  return [QUERY_KEY_NON_CREDENTIALS, ...queryKey]
}

export function isNonCredentialsQueryKey(queryKey: QueryKey) {
  return queryKey[0] === QUERY_KEY_NON_CREDENTIALS
}

```

```ts filename="src/features/products/hooks/useGetProducts.tsx" {16}
// セキュアではないデータを取得するフック
export function useGetProducts({
  page,
  pageSize,
  categoryId,
}: UseGetProductsParams) {
  const params = {
    page_id: page,
    page_size: pageSize,
    category_id: categoryId,
  }
  const originalQueryKey = getGetProductsQueryKey(params)

  return useGetProductsQuery<GetProductsResultData>(params, {
    query: {
      queryKey: addNonCredentialsToQueryKey(originalQueryKey),
      select: transform,
    },
  })
}
```

```ts filename="src/features/auth/hooks/useAuth.tsx" {6-8}
export function useAuth(props?: UseAuthProps): UseAuthResult {
  // ...

  const logout = useCallback(async () => {
    logoutMutation.mutate()
    queryClient.removeQueries({
      predicate: (query) => !isNonCredentialsQueryKey(query.queryKey),
    })
  }, [logoutMutation, queryClient])

  // ...
}
```

このような仕組みにすることで、基本的にはすべてのキャッシュが削除され、残したいキャッシュに対して明示的に`non-credentials`を付与することになるので、セキュアなデータのキャッシュを削除し忘れる問題が発生しづらくなっていると思います。

### フロントエンドのfeaturesディレクトリ

フロントエンドのディレクトリ構成の中に、`features`ディレクトリを作っています。このディレクトリは、アプリケーションの機能ごとにディレクトリを分けて、その機能に関するコンポーネントやフックなどを格納するためのディレクトリです。このアイデアは、[Bulletproof React](https://github.com/alan2207/bulletproof-react)というReactアプリケーション向けのアーキテクチャを参考にしました。

#### `features`の中身の紹介

現在の`features`ディレクトリの中身を簡単に紹介すると、次のようになっています。

<FileTree>
  <FileTree.Folder name="features" defaultOpen>
    <FileTree.Folder name="auth" defaultOpen>
      <FileTree.Folder name="components" defaultOpen>
        <FileTree.File name="AuthGuard.tsx" />
      </FileTree.Folder>
      <FileTree.Folder name="hooks" defaultOpen>
        <FileTree.File name="useAuth.tsx" />
        <FileTree.File name="useCurrentUser.tsx" />
      </FileTree.Folder>
      <FileTree.Folder name="utils" defaultOpen>
        <FileTree.File name="getCurrentUser.ts" />
      </FileTree.Folder>
      <FileTree.File name="index.ts" />
    </FileTree.Folder>
    <FileTree.Folder name="products" defaultOpen>
      <FileTree.Folder name="components" defaultOpen>
        <FileTree.File name="ProductCard.tsx" />
        <FileTree.File name="ProductCardSkeleton.tsx" />
        <FileTree.File name="ProductForm.tsx" />
        <FileTree.File name="ProductList.tsx" />
      </FileTree.Folder>
      <FileTree.Folder name="hooks" defaultOpen>
        <FileTree.File name="useAddProduct.tsx" />
        <FileTree.File name="useGetMyProducts.tsx" />
        <FileTree.File name="useGetProduct.tsx" />
        <FileTree.File name="useGetProductCategories.tsx" />
        <FileTree.File name="useGetProducts.tsx" />
        <FileTree.File name="useUpdateProduct.tsx" />
      </FileTree.Folder>
      <FileTree.File name="index.ts" />
    </FileTree.Folder>
    <FileTree.Folder name="upload" defaultOpen>
      <FileTree.Folder name="file" defaultOpen>
        <FileTree.File name="index.ts" />
        <FileTree.File name="s3.ts" />
      </FileTree.Folder>
      <FileTree.File name="index.ts" />
    </FileTree.Folder>
  </FileTree.Folder>
</FileTree>

簡単に各ディレクトリや、その中に格納されているものを紹介します（ここで紹介していないものもありますが、長くなるので省略します）。

`auth`ディレクトリには、認証に関するものを格納しています。例えば、次のようなものがあります。

- 認証を必要とするページにログインしていないユーザがアクセスしたときに、ログインページにリダイレクトする`AuthGuard`コンポーネント
- ログインやログアウト、アカウント作成などの処理を行う関数を提供する`useAuth`フック
- ログインしているユーザの情報を取得する`useCurrentUser`フック

`products`ディレクトリには、商品に関するものを格納しています。例えば、次のようなものがあります。

- 商品の一覧を表示する`ProductList`コンポーネント
- 商品を出品するときに入力するフォームを表示する`ProductForm`コンポーネント
- 商品の追加・取得・更新を行うフック群

`upload`ディレクトリには、画像のアップロードに関するものを格納しています。例えば、次のようなものがあります。

- ファイルをS3にアップロードする関数

#### `features`ディレクトリを採用した理由

理由としては、次の2つがあります。

- 新しいファイルをどこに置くか考えるときに、機能によるカテゴリ分けが直感的に分かりやすいと感じたから
- 1つの機能に関するコンポーネントやフックの距離が近いほうが、構造の理解やファイル管理がしやすいと感じたから

このような理由から採用したのですが、実際に使ってみても考えやすい（脳への負担が少ない）構造だと感じました。

### Storybookによる共通コンポーネントの管理

このプロジェクトには、フォームコンポーネントや画像コンポーネントなど、汎用的な共通コンポーネントがあります。また、`features`ディレクトリ内にも、機能ごとに共通のコンポーネントがあります。これらのコンポーネントは、Storybookを使って管理しています。

Storybookを導入した一番の理由としては、企業のチーム開発で導入されている事例を見て、勉強しておきたいと思ったからです。本音を言うと、個人開発でも必要かどうかはあまり分かっていないのですが、勉強のために導入しています。

ただ、Storybookは、プロパティとして渡す値を変えることでコンポーネントの表示がどのように変わるのかを確認するプラットフォームとしてとても便利だと感じています。

共通コンポーネントは、様々なケースに対応するために、多くのプロパティを受け取れるようにすることがよくあると思います。ただし、その共通コンポーネントを使う側の視点からすると、どのような使い方ができるのかを網羅的に把握するのは難しいと思います。これは、個人で時間をかけて開発している場合でも同様だと思います。

Storybookを使うと、共通コンポーネントの実装者が表示パターンごとにストーリーを作成しておくことで、どのような使い方ができるのかをドキュメントとして残すことができます。例えば、このプロジェクトでは`Checkbox`コンポーネントの通常時・エラー発生時のストーリーを作成しています（以下の画像を参照）。こうしておくと、Storybook上でこれらの表示パターンを並べて確認できるので、使い方を網羅的に把握するのが簡単になります。

<div align="center" style={{ marginTop: "1rem" }}>
  <img src="/images/next-bazaar/storybook.png" alt="Storybook" />
</div>

### バックエンドのテストコードの実装方法

<Callout type="warning">後日記載予定です。</Callout>

### API関連コードのディレクトリ構造

<Callout type="warning">後日記載予定です。</Callout>
