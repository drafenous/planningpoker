import '../styles/globals.scss'
import SSRProvider from 'react-bootstrap/SSRProvider';
import type { AppProps } from 'next/app'
import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'
config.autoAddCss = false

function MyApp({ Component, pageProps }: AppProps) {
  return <SSRProvider>
    <Component {...pageProps} />
  </SSRProvider>
}

export default MyApp
