// pages/_app.js
import Router from 'next/router';
import '../styles/globals.css';  // <-- your global CSS here
// pages/_app.js
import 'nprogress/nprogress.css'; // Required for progress bar styling
import NProgress from 'nprogress';


NProgress.configure({ showSpinner: false });

Router.events.on('routeChangeStart', () => NProgress.start());
Router.events.on('routeChangeComplete', () => NProgress.done());
Router.events.on('routeChangeError', () => NProgress.done());
export default function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}
