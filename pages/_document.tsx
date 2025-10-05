import { Html, Head, Main, NextScript} from 'next/document';

const Document = () => (
  <Html lang='es'>
    <Head>
     
      <link rel="icon" type="image/png" href="/images/icons/favicon-32x32.png" />
      <link rel="shortcut icon" type="image/png" href="/images/icons/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/images/icons/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/images/icons/favicon-32x32.png" />
      <link rel="apple-touch-icon" sizes="180x180" href="/images/icons/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="192x192" href="/images/icons/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="512x512" href="/images/icons/favicon-32x32.png" />
      
      <link rel="manifest" href="/site.webmanifest" />
      
      {/* Meta tags */}
      <meta name="theme-color" content="#22c55e" />
      <meta name="description" content="Sistema de Gestión Financiera - Control de ingresos y egresos" />
    </Head>
    <body>
      <Main />
      <NextScript />
    </body>
  </Html>
);

export default Document;
