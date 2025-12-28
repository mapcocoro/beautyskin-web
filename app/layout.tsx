import type { Metadata } from "next";
import { M_PLUS_Rounded_1c } from "next/font/google";
import "./globals.css";

const mPlusRounded = M_PLUS_Rounded_1c({
  weight: ['400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: "美肌コンシェルジュ | AI美容アドバイス",
  description: "AIを活用したパーソナライズされた美容・スキンケアアドバイス。あなたの肌の悩みに合わせた専門的なケア方法をご提案します。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={`${mPlusRounded.className} antialiased`}>
        {children}
      </body>
    </html>
  );
}
