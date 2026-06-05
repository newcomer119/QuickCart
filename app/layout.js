import { Outfit } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { AppContextProvider } from "@/context/AppContext";
import { Toaster } from "react-hot-toast";
import { ClerkProvider } from "@clerk/nextjs";
import LoadingOverlayWrapper from "@/components/LoadingOverlayWrapper";
import WhatsAppButton from "@/components/WhatsAppButton";

const outfit = Outfit({ subsets: ["latin"], weight: ["300", "400", "500"] });

export const metadata = {
  title: "Custom 3D Printing & Premium PLA+ Filament Store India | Filament Freaks",
  description: "Filament Freaks offers custom 3D printing services, personalized 3D printed products, lamps, word art, prototypes, and premium PLA+ filaments across India.",
  alternates: {
    canonical: "https://www.filamentfreaks.com",
    languages: {
      "en-US": "https://www.filamentfreaks.com/en",
    },
  },
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
    other: [
      { rel: 'android-chrome-192x192', url: '/android-chrome-192x192.png' },
      { rel: 'android-chrome-512x512', url: '/android-chrome-512x512.png' },
    ],
  },
  manifest: '/site.webmanifest',
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <head>
          <Script id="gtm-script" strategy="afterInteractive">
            {`
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','GTM-TNZ8PTKV');
            `}
          </Script>
          <link rel="icon" href="/favicon.ico" sizes="any" />
          <link rel="icon" href="/favicon-16x16.png" type="image/png" sizes="16x16" />
          <link rel="icon" href="/favicon-32x32.png" type="image/png" sizes="32x32" />
          <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
          <link rel="manifest" href="/site.webmanifest" />
        </head>
        <body className={`${outfit.className} antialiased text-gray-700`}>
          <noscript>
            <iframe
              src="https://www.googletagmanager.com/ns.html?id=GTM-TNZ8PTKV"
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
            />
          </noscript>
          <Toaster />
          <AppContextProvider>
            <LoadingOverlayWrapper />
            {children}
            <WhatsAppButton />
            <Toaster position="top-center" reverseOrder={false} />
          </AppContextProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
