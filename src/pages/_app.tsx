import 'bootstrap/dist/css/bootstrap.min.css';
import Providers from '@/components/Providers';
import '@/styles/globals.css';
import type { AppProps } from 'next/app';

import styles from '@/styles/App.module.css';
import Sidebar from '@/components/Sidebar';
import Box from '@mui/material/Box';

export default function App({ Component, pageProps }: AppProps) {
  const { session } = pageProps;
  const isUserLoggedIn = !!(session && session.user);
  console.log(isUserLoggedIn);
  return (
    <Providers pageProps={pageProps}>
      <Box sx={{ display: 'flex' }}>
        {isUserLoggedIn && <Sidebar />}
        <Component {...pageProps} />
      </Box>
    </Providers>
  );
}
