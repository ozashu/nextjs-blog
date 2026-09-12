# [https://ozashu.com/](https://ozashu.com/)

## Development

```bash
yarn install
yarn dev
```

## Writing a new post

Posts live under `posts/<year>/<YYYY-MM-DD-slug>/index.md`. The directory
name (`slug`) becomes the post's URL (`/posts/<slug>`), so keep it stable
even if you later move the post to a different year folder.

1. Create a new directory, e.g. `posts/2026/2026-09-13-my-new-post/`.
2. Add an `index.md` file inside it with frontmatter and Markdown content:

   ```markdown
   ---
   title: "My New Post"
   date: "2026-09-13"
   ---

   Post content goes here.
   ```

3. If the post needs images, place them under `public/images/<slug>/` and
   reference them with an absolute path, e.g. `![alt](/images/<slug>/photo.png)`.
4. Run `yarn dev` to preview locally. The post appears on the top page,
   sorted by `date`, and is reachable at `/posts/<slug>`.

## About

- This site uses [Twemoji](https://github.com/twitter/twemoji) by Twitter (CC-BY 4.0).
- License for the posts: ©2020 Shuhei Ozawa. All rights reserved.
- Non-post code: [MIT License](license-code.md).
