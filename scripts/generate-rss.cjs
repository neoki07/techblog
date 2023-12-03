const { promises: fs } = require('fs')
const path = require('path')
const RSS = require('rss')
const matter = require('gray-matter')
require('dotenv').config()

const appUrl = process.env.APP_URL

async function generate() {
  const feed = new RSS({
    title: "ot07's Tech Blog",
    site_url: appUrl,
    feed_url: path.join(appUrl, 'feed.xml')
  })

  const posts = await fs.readdir(path.join(__dirname, '..', 'pages', 'posts'))

  await Promise.all(
    posts.map(async (name) => {
      if (name.startsWith('index.')) return

      const content = await fs.readFile(
        path.join(__dirname, '..', 'pages', 'posts', name)
      )
      const frontmatter = matter(content)


      feed.item({
        title: frontmatter.data.title,
        url: path.join(appUrl, 'posts', name.replace(/\.mdx?/, '')),
        date: frontmatter.data.date,
        description: frontmatter.data.description,
        categories: frontmatter.data.tag.split(','),
        author: frontmatter.data.author
      })
    })
  )

  await fs.writeFile('./public/feed.xml', feed.xml({ indent: true }))
}

generate()
