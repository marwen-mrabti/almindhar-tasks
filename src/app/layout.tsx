import "@/app/assets/css/globals.css";
import Header from "@/components/app-header/header";
import { Providers } from "@/components/providers";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Almindhar Tasks",
  description: "manage your tasks and projects from anywhere",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body
        className={cn(`${geistSans.variable} ${geistMono.variable} antialiased`,
          "bg-linear-to-tl from-background/10 to-secondary text-foreground relative",
          'grid grid-rows-[auto_1fr] min-h-screen w-full max-w-screen mx-auto overflow-x-hidden')}
      >
        <Providers>
          <Header />
          <main className="container grid grid-cols-1 mx-auto -bg-linear-60 from-background to-secondary">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
