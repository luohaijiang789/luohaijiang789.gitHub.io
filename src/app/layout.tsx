import type { Metadata } from "next";
import { SiteShell } from "@/components/site-shell";
import { getSearchNotes } from "@/lib/content";
import "./globals.css";
export const metadata: Metadata = {
  metadataBase: new URL("https://luohaijiang789.github.io"),
  title: { default: "海江的笔记", template: "%s · 海江的笔记" },
  description: "关于计算机基础、AI 安全与工程实践的个人笔记。",
  icons: { icon: "/favicon.svg" },
};
const themeScript = `try{var t=localStorage.getItem('haijiang-theme');document.documentElement.dataset.theme=t==='dark'?'dark':'light'}catch{document.documentElement.dataset.theme='light'}`;
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <SiteShell notes={getSearchNotes()}>{children}</SiteShell>
      </body>
    </html>
  );
}
