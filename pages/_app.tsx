import { NextUIProvider, createTheme } from '@nextui-org/react';
import { ThemeProvider } from "next-themes";
import type { AppProps } from 'next/app'


function MyApp({ Component, pageProps }: AppProps) {
  const darkTheme = createTheme({
    type: "dark"
  })
  const lightTheme = createTheme({
    type: "light",
  })

  return (
    <ThemeProvider
      defaultTheme="system"
      attribute="class"
      value={{
        light: lightTheme.className,
        dark: darkTheme.className
      }}
    >
      <NextUIProvider >
        <Component {...pageProps} />
      </NextUIProvider>
    </ThemeProvider>
  );
}

export default MyApp
