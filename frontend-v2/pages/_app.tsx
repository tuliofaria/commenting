import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { AuthProvider } from '../contexts/AuthContext'
import { RealtimeProvider } from '../contexts/RealtimeContext'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <RealtimeProvider>
        <Component {...pageProps} />
      </RealtimeProvider>
    </AuthProvider>
  )
}

export default MyApp
