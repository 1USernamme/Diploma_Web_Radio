import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Providers from "./providers";
import Header from "./components/Header"; // <-- Імпортуємо наш новий компонент
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Комплекс РЕЗ | Дипломний проєкт",
  description: "Спектральний аналітик радіоелектронних загроз",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uk">
      <body
        className={`${inter.className} bg-[#0b0f14] text-gray-100 min-h-screen`}
      >
        <Providers>
          <Header />

          <main>{children}</main>
        </Providers>
      </body>
    </html>
  );
}
