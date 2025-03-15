import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "./global.scss";

export const metadata: Metadata = {
  title: "Детский Мир",
  description: "Детский Мир - маркетплейс детских товаров",
};

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-nunito",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className={nunito.variable}>
      <body>
        {children}
      </body>
    </html>
  );
}
