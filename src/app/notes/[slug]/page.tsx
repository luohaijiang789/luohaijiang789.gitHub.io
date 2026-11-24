import { notFound } from "next/navigation";
import { ChevronLeft, Clock3, Github } from "lucide-react";
import { getNotes, renderContent } from "@/lib/content";
export const dynamicParams = false;
export function generateStaticParams() {
  return getNotes().map((note) => ({ slug: note.slug }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const note = getNotes().find((note) => note.slug === slug);
  return {
    title: note?.title,
    description: note?.description,
    alternates: { canonical: `/notes/${slug}/` },
  };
}
export default async function NotePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const notes = getNotes();
  const index = notes.findIndex((note) => note.slug === slug);
  if (index < 0) notFound();
  const note = notes[index];
  const { content, headings } = await renderContent(note.body);
  return (
    <div className="reading-layout">
      <div className="reading-main">
        <a className="back-link" href="/">
          <ChevronLeft size={16} />
          全部笔记
        </a>
        <header className="article-header">
          <div className="article-meta">
            <span className="topic-badge">{note.topic}</span>
            <span>
              <Clock3 size={15} />
              预计阅读 {note.minutes} 分钟
            </span>
          </div>
          <h1>{note.title}</h1>
          <p>{note.description}</p>
        </header>
        <details className="mobile-toc">
          <summary>本文目录</summary>
          <nav aria-label="本文目录（移动端）">
            {headings.map((heading) => (
              <a key={heading.id} href={`#${heading.id}`}>
                {heading.title}
              </a>
            ))}
          </nav>
        </details>
        <article className="prose">{content}</article>
        <div className="article-source">
          <Github size={16} />
          <a
            href={`https://github.com/luohaijiang789/luohaijiang789.gitHub.io/tree/main/src/content/docs/notes/${note.filename}`}
            target="_blank"
            rel="noreferrer"
          >
            查看原文与修改记录
          </a>
        </div>
        <nav className="article-neighbors" aria-label="相邻笔记">
          {index > 0 ? (
            <a href={`/notes/${notes[index - 1].slug}/`}>
              <small>上一篇</small>
              <span>{notes[index - 1].title}</span>
            </a>
          ) : (
            <span />
          )}
          {index < notes.length - 1 && (
            <a href={`/notes/${notes[index + 1].slug}/`}>
              <small>下一篇</small>
              <span>{notes[index + 1].title}</span>
            </a>
          )}
        </nav>
      </div>
      <aside className="article-toc">
        <div className="toc-sticky">
          <p>本文目录</p>
          <nav aria-label="本文目录">
            {headings.map((heading) => (
              <a
                className={heading.depth === 3 ? "nested" : ""}
                key={heading.id}
                href={`#${heading.id}`}
              >
                {heading.title}
              </a>
            ))}
          </nav>
          <a className="toc-top" href="#main-content">
            回到顶部
          </a>
        </div>
      </aside>
    </div>
  );
}
