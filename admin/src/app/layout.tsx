import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Suspense } from 'react';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import { RefineContext } from '../components/refine-context';
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "芋道云 NestJS + NextJS 管理后台",
  description: "基于 NestJS, Next.js, Refine 和 Ant Design 6 的快速开发后台管理系统",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className="h-full">
      <body className={`${inter.className} h-full`}>
        <AntdRegistry>
          <Suspense fallback={<div>Loading...</div>}>
            <RefineContext>
              {children}
            </RefineContext>
          </Suspense>
        </AntdRegistry>
      </body>
    </html>
  );
}
