// pages/_app.js
import '../styles/globals.css';  // <-- your global CSS here

export default function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}
