import type { AppProps } from 'next/app'
import { ChakraProvider } from '@chakra-ui/react'
import theme from '@/styles/theme';
import { ContextProvider } from '@/src/context';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <ContextProvider>
        <ChakraProvider theme={theme}>
          <Component {...pageProps} />
        </ChakraProvider>
      </ContextProvider>

    </>
  )
}
