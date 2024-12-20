---
title: 手動でレンダリングするReactフック
description: 今後、ゆるゆると開発しているライブラリで、パフォーマンスを考慮して非制御コンポーネントを作成することがありそうです。そこで、手動でレンダリングしたい場合に使えるReactフックをメモしておきます。
date: 2023-09-16
tag:
  - React
  - React Hooks
published: true
---

今後、ゆるゆると開発しているライブラリで、パフォーマンスを考慮して非制御コンポーネントを作成することがありそうです。ただ、Reactアプリとしての利便性も考慮し、内部のデータが変更されたときに再レンダリングすることもできるようにしたいです。仕組みづくりの参考になりそうな[React Hook Form](https://react-hook-form.com/)というライブラリでは、`watch`の実装の中で、値が変更されると手動でレンダリングする仕組みがあるようでした。

そこで、手動でレンダリングしたい場合に使えるReactフックをメモしておきます。

```tsx
import { useCallback, useReducer } from 'react'

function useRerender() {
  const [, trigger] = useReducer(() => ({}), {})

  const rerender = useCallback(() => {
    trigger()
  }, [])

  return rerender
}
```

こちらの実装を参考にしました。

https://github.com/lilibraries/hooks/blob/master/src/useRerender.ts
