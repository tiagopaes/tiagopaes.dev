import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import GoogleFonts from 'google-fonts'
import { useEffect } from 'react'

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    GoogleFonts.add({
      'Poppins': '400,500,600,700'
    })
  })
  return <Component {...pageProps} />
}
