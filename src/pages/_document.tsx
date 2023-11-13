import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="pt-br" className='scroll-smooth'>
      <Head>
        <link rel="icon" type="image/png" href="/profile-pic.png" />
        {process.env.NEXT_PUBLIC_VERCEL_ENV === 'production' &&
          <script defer data-domain="tiagopaes.dev" src="https://plausible.io/js/script.js"></script>
        }
      </Head>
      <body className='bg-zinc-900 text-gray-50'>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
