import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { remark } from 'remark'
import remarkGfm from 'remark-gfm'
import html from 'remark-html'
import highlight from 'rehype-highlight'

const postsDirectory = path.join(process.cwd(), 'posts')

// Posts live under posts/<year>/<slug>/index.md. The post id is the slug
// (the directory name), so it stays stable even if the post is moved to a
// different year folder.
function findPostSlugDirs(): { slug: string; dir: string }[] {
  const yearDirs = fs
    .readdirSync(postsDirectory, { withFileTypes: true })
    .filter(entry => entry.isDirectory())

  return yearDirs.flatMap(yearDir => {
    const yearPath = path.join(postsDirectory, yearDir.name)
    return fs
      .readdirSync(yearPath, { withFileTypes: true })
      .filter(entry => entry.isDirectory())
      .map(slugDir => ({
        slug: slugDir.name,
        dir: path.join(yearPath, slugDir.name)
      }))
  })
}

export function getSortedPostsData() {
  const allPostsData = findPostSlugDirs().map(({ slug, dir }) => {
    const fullPath = path.join(dir, 'index.md')
    const fileContents = fs.readFileSync(fullPath, 'utf8')

    // Use gray-matter to parse the post metadata section
    const matterResult = matter(fileContents)

    // Combine the data with the id
    return {
      id: slug,
      ...(matterResult.data as { date: string; title: string })
    }
  })
  // Sort posts by date
  return allPostsData.sort((a, b) => {
    if (a.date < b.date) {
      return 1
    } else {
      return -1
    }
  })
}

export function getAllPostIds() {
  return findPostSlugDirs().map(({ slug }) => {
    return {
      params: {
        id: slug
      }
    }
  })
}

export async function getPostData(id: string) {
  const { dir } = findPostSlugDirs().find(post => post.slug === id) ?? {}
  if (!dir) {
    throw new Error(`Post not found: ${id}`)
  }
  const fullPath = path.join(dir, 'index.md')
  const fileContents = fs.readFileSync(fullPath, 'utf8')

  // Use gray-matter to parse the post metadata section
  const matterResult = matter(fileContents)

  // Use remark to convert markdown into HTML string
  const processedContent = await remark()
    .use(remarkGfm)
    .use(html)
    .use(highlight)
    .process(matterResult.content)
  const contentHtml = processedContent.toString()

  // Combine the data with the id and contentHtml
  return {
    id,
    contentHtml,
    ...(matterResult.data as { date: string; title: string })
  }
}
