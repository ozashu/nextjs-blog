import Head from 'next/head'
import Layout, { siteTitle } from '../components/layout'
import { getSortedPostsData } from '../lib/posts'
import Link from 'next/link'
import Date from '../components/date'
import { GetStaticProps } from 'next'

export default function Home({
  allPostsData
}: {
    allPostsData: {
      date: string
      title: string
      id: string
    }[]
  }) {
  return (
    <Layout home>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <section className="text-lg leading-relaxed">
        <p>What's this blog?</p>
        <p>
          This is my personal website - Please contact{' '}
          <a href="https://twitter.com/oza_shu">me</a> if you need anything.
        </p>
      </section>
      <section className="pt-px text-lg leading-relaxed">
        <h2 className="my-4 text-2xl leading-snug">Blog</h2>
        <ul className="m-0 list-none p-0">
          {allPostsData.map(({ id, date, title }) => (
            <li className="mb-5" key={id}>
              <Link href={`/posts/${id}`}>{title}</Link>
              <br />
              <small className="text-gray-400">
                <Date dateString={date} />
              </small>
            </li>
          ))}
        </ul>
      </section>
    </Layout>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const allPostsData = getSortedPostsData()
  return {
    props: {
      allPostsData
    }
  }
}