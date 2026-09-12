import Head from 'next/head'
import Link from 'next/link'

const name = 'Shuhei Ozawa'
export const siteTitle = 'My Website'

export default function Layout({
  children,
  home,
  wide
}: {
    children: React.ReactNode
    home?: boolean
    wide?: boolean
  }) {
  return (
    <div
      className={`mx-auto mb-24 mt-12 px-4 ${wide ? 'max-w-2xl' : 'max-w-xl'}`}
    >
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <meta
          name="description"
          content="It's my personal website using Next.js"
        />
        <meta
          property="og:image"
          content={`https://og-image.now.sh/${encodeURI(
            siteTitle
          )}.png?theme=light&md=0&fontSize=75px&images=https%3A%2F%2Fassets.zeit.co%2Fimage%2Fupload%2Ffront%2Fassets%2Fdesign%2Fnextjs-black-logo.svg`}
        />
        <meta name="og:title" content={siteTitle} />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      <header className="flex flex-col items-center">
        {home ? (
          <>
            <img
              src="/images/profile.jpg"
              className="h-32 w-32 rounded-full"
              alt={name}
            />
            <h1 className="my-4 text-4xl leading-tight font-extrabold tracking-tight">
              {name}
            </h1>
          </>
        ) : (
            <>
              <Link href="/">
                <img
                  src="/images/profile.jpg"
                  className="h-24 w-24 rounded-full"
                  alt={name}
                />
              </Link>
              <h2 className="my-4 text-2xl leading-snug">
                <Link href="/" className="text-inherit">
                  {name}
                </Link>
              </h2>
            </>
          )}
      </header>
      <main>{children}</main>
      {!home && (
        <div className="mt-12">
          <Link href="/">← Back to home</Link>
        </div>
      )}
    </div>
  )
}
