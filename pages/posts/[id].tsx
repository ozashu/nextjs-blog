import Layout from '../../components/layout'
import { getAllPostIds, getPostData } from '../../lib/posts'
import Head from 'next/head'
import Date from '../../components/date'
import { GetStaticProps, GetStaticPaths } from 'next'

export default function Post({
  postData
}: {
    postData: {
      title: string
      date: string
      contentHtml: string
    }
  }) {
  return (
    <Layout wide>
      <Head>
        <title>{postData.title}</title>
      </Head>
      <article>
        <h1 className="my-4 text-3xl leading-snug font-extrabold tracking-tight">
          {postData.title}
        </h1>
        <div className="text-gray-400">
          <Date dateString={postData.date} />
        </div>
        <div
          className="prose mt-6 max-w-none"
          dangerouslySetInnerHTML={{ __html: postData.contentHtml }}
        />
      </article>
    </Layout>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = getAllPostIds()
  return {
    paths,
    fallback: false
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const postData = await getPostData(params.id as string)
  return {
    props: {
      postData
    }
  }
}
