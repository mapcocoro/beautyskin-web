import type { Metadata } from "next";
import "./globals.css";

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
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
