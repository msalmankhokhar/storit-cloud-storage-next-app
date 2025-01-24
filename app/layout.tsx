import type { Metadata } from "next";
import { Poppins as Font } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster"
import NextTopLoader from 'nextjs-toploader';

const font = Font({
  subsets: ['latin'],
  weight: [ '100', '200', '300', '400', '500', '600', '700', '800', '900' ],
  variable: '--font-poppins'
})

export const metadata: Metadata = {
  title: "Storit",
  description: "Storit - The only storage solution",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${font.variable} font-poppins antialiased`}
      >
        <NextTopLoader
          color="#EA6365"
        />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
