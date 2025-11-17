import type { Metadata } from "next";
import "./globals.css";
import { QueryClientProviderWrapper } from "./providers";

export const metadata: Metadata = {
  title: "ImageNet Categories Explorer (Hire Me)",
  description: "ImageNet Categories Explorer (Hire Me) made with Next.js 16 with React 19 and Prisma",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <main className="min-h-screen bg-gray-50 dark:bg-gray-950 py-12 px-4">
          <div className="max-w-6xl mx-auto">
            <QueryClientProviderWrapper>{children}</QueryClientProviderWrapper>
          </div>
        </main>
      </body>
    </html>
  );
}
