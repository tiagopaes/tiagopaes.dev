import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en" className='scroll-smooth'>
      <Head>
        {/* Add the Poppins font to the <head> section */}
        <link
          href="https://fonts.googleapis.com/css?family=Poppins:400,500,600,700&display=swap"
          rel="stylesheet"
        />
      </Head>
      <body className='bg-gradient-to-b from-gray-800 to-gray-900 bg-fixed text-gray-50'>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
