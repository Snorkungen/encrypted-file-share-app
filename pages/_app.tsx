import '../styles/globals.css';
import { NextUIProvider, createTheme } from '@nextui-org/react';
import type { AppProps } from 'next/app'

const darkTheme = createTheme({
  type: "dark",
  theme: {
    colors: {
      background: '#223252',
      foreground: '#e3e3e3',
    }
  }
});

function MyApp({ Component, pageProps }: AppProps) {

  return (
    <NextUIProvider theme={darkTheme}>
      <Component {...pageProps} />
    </NextUIProvider>
  );
}

export default MyApp
