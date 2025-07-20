import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Mobile browser optimization */}
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="format-detection" content="telephone=no" />

        {/* Touch icon for mobile */}
        <meta name="apple-touch-fullscreen" content="yes" />

        {/* Prevent zoom on form focus for iOS */}
        <meta name="apple-mobile-web-app-title" content="LeafyHealth Label Designer" />

        {/* Performance optimization */}
        <link rel="preconnect" href="/api" />
        <link rel="dns-prefetch" href="/api" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
