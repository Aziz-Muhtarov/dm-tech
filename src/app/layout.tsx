import type { Metadata } from "next";
import "./global.scss";


export const metadata: Metadata = {
  title: "Детский Мир",
  description: "Детский Мир - маркетплейс детских товаров",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body>
        {children}
      </body>
    </html>
  );
}
