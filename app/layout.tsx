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
        <QueryClientProviderWrapper>{children}</QueryClientProviderWrapper>
      </body>
    </html>
  );
}

