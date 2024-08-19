import { Html, Head, Main, NextScript } from 'next/document'
import Script from 'next/script'

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body>
        <Main />
        <NextScript />
        {/* <Script defer src="https://ranforte.disqus.com/embed.js"/> */}
        {/* <Script defer src="https://cdn.commento.io/js/commento.js"/> */}
      </body>
    </Html>
  )
}
