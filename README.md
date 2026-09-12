# [https://ozashu.com/](https://ozashu.com/)

## 開発

```bash
yarn install
yarn dev
```

## 新しい投稿を書く

投稿は `posts/<year>/<YYYY-MM-DD-slug>/index.md` に配置します。ディレクトリ名
（`slug`）が投稿のURL（`/posts/<slug>`）になるため、後で別の年のフォルダに
移動した場合でも変更しないでください。

1. `posts/2026/2026-09-13-my-new-post/` のような新しいディレクトリを作成します。
2. その中に、フロントマターとMarkdownの内容を含む `index.md` ファイルを追加します。

   ```markdown
   ---
   title: "My New Post"
   date: "2026-09-13"
   ---

   ここに投稿の内容を書きます。
   ```

3. 投稿に画像が必要な場合は `public/images/<slug>/` に配置し、
   `![alt](/images/<slug>/photo.png)` のように絶対パスで参照します。
4. `yarn dev` を実行してローカルでプレビューします。投稿はトップページに
   `date` でソートされて表示され、`/posts/<slug>` からアクセスできます。

## About

- このサイトはTwitterの[Twemoji](https://github.com/twitter/twemoji)（CC-BY 4.0）を使用しています。
- 投稿のライセンス: ©2020 Shuhei Ozawa. All rights reserved.
- 投稿以外のコード: [MITライセンス](license-code.md)。
