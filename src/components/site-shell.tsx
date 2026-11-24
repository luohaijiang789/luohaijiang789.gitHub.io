"use client";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import * as Dialog from "@radix-ui/react-dialog";
import {
  BookOpen,
  Search,
  Moon,
  Sun,
  Menu,
  X,
  Github,
  Info,
  Layers,
} from "lucide-react";
import { NoteIcon } from "./note-icon";
import type { SearchNote } from "@/lib/content";
export function SiteShell({
  notes,
  children,
}: {
  notes: SearchNote[];
  children: ReactNode;
}) {
  const pathname = usePathname();
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [dark, setDark] = useState(false);
  useEffect(() => {
    setDark(document.documentElement.dataset.theme === "dark");
    const key = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen((open) => !open);
      }
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, []);
  function theme() {
    const next = !dark;
    document.documentElement.dataset.theme = next ? "dark" : "light";
    setDark(next);
    try {
      localStorage.setItem("haijiang-theme", next ? "dark" : "light");
    } catch {}
  }
  const terms = query.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);
  const results = notes.filter((note) =>
    terms.every((term) =>
      `${note.title} ${note.description} ${note.topic} ${note.text}`
        .toLocaleLowerCase()
        .includes(term),
    ),
  );
  const nav = (mobile = false) => (
    <nav aria-label={mobile ? "移动导航" : "笔记导航"}>
      <a
        className={`nav-home ${pathname === "/" ? "active" : ""}`}
        href="/"
        onClick={() => setMenuOpen(false)}
      >
        <Layers size={18} />
        全部笔记<span aria-hidden="true">{notes.length}</span>
      </a>
      <p className="nav-label">笔记目录</p>
      <div className="nav-notes">
        {notes.map((note) => (
          <a
            key={note.slug}
            href={`/notes/${note.slug}/`}
            aria-current={
              pathname === `/notes/${note.slug}/` ? "page" : undefined
            }
            onClick={() => setMenuOpen(false)}
          >
            <NoteIcon slug={note.slug} size={17} />
            <span>{note.title}</span>
          </a>
        ))}
      </div>
      <a
        className={`nav-about ${pathname === "/about/" ? "active" : ""}`}
        href="/about/"
        onClick={() => setMenuOpen(false)}
      >
        <Info size={18} />
        关于这里
      </a>
    </nav>
  );
  return (
    <div className="app-shell">
      <a className="skip-link" href="#main-content">
        跳至正文
      </a>
      <aside className="sidebar">
        <a href="/" className="brand">
          <span className="brand-mark">
            <BookOpen size={22} />
          </span>
          <span>
            海江的笔记<small>个人知识库</small>
          </span>
        </a>
        {nav()}
        <div className="sidebar-bottom">
          <a
            href="https://github.com/luohaijiang789/luohaijiang789.gitHub.io"
            target="_blank"
            rel="noreferrer"
          >
            <Github size={17} />
            源码与内容
          </a>
          <span>记录 · 理解 · 实践</span>
        </div>
      </aside>
      <div className="workspace">
        <header className="topbar">
          <Dialog.Root open={menuOpen} onOpenChange={setMenuOpen}>
            <Dialog.Trigger asChild>
              <button className="icon-button mobile-menu" aria-label="菜单">
                <Menu size={20} />
              </button>
            </Dialog.Trigger>
            <Dialog.Portal>
              <Dialog.Overlay className="dialog-overlay" />
              <Dialog.Content className="mobile-drawer">
                <Dialog.Title className="drawer-title">海江的笔记</Dialog.Title>
                <Dialog.Description className="sr-only">
                  浏览全部笔记与关于页面
                </Dialog.Description>
                <Dialog.Close
                  className="icon-button drawer-close"
                  aria-label="关闭菜单"
                >
                  <X size={20} />
                </Dialog.Close>
                {nav(true)}
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
          <div className="breadcrumb">
            <span>知识库</span>
            <span className="crumb-divider">/</span>
            <span>
              {pathname.startsWith("/notes/")
                ? "笔记"
                : pathname === "/about/"
                  ? "关于"
                  : "全部笔记"}
            </span>
          </div>
          <div className="topbar-actions">
            <Dialog.Root
              open={searchOpen}
              onOpenChange={(open) => {
                setSearchOpen(open);
                if (!open) setQuery("");
              }}
            >
              <Dialog.Trigger asChild>
                <button className="search-trigger" aria-label="搜索笔记">
                  <Search size={17} />
                  <span>搜索笔记…</span>
                  <kbd>⌘ K</kbd>
                </button>
              </Dialog.Trigger>
              <Dialog.Portal>
                <Dialog.Overlay className="dialog-overlay" />
                <Dialog.Content className="search-dialog">
                  <Dialog.Title className="sr-only">搜索笔记</Dialog.Title>
                  <Dialog.Description className="sr-only">
                    搜索全部笔记的标题、摘要与正文
                  </Dialog.Description>
                  <div className="search-input-row">
                    <Search size={20} />
                    <input
                      aria-label="搜索笔记内容"
                      placeholder="搜索标题、正文、关键词…"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                    />
                    <Dialog.Close className="icon-button" aria-label="关闭搜索">
                      <X size={19} />
                    </Dialog.Close>
                  </div>
                  <div className="search-summary" role="status">
                    {query
                      ? `找到 ${results.length} 篇笔记`
                      : "全部笔记 · 支持正文搜索"}
                  </div>
                  <div className="search-results">
                    {results.map((note) => (
                      <a
                        className="search-result"
                        key={note.slug}
                        href={`/notes/${note.slug}/`}
                        onClick={() => setSearchOpen(false)}
                      >
                        <span className="search-result-icon">
                          <NoteIcon slug={note.slug} />
                        </span>
                        <span>
                          <strong>{note.title}</strong>
                          <small>
                            {note.topic} · {note.description}
                          </small>
                        </span>
                      </a>
                    ))}
                    {results.length === 0 && (
                      <p className="search-empty">
                        没有找到相关笔记，试试更短的关键词。
                      </p>
                    )}
                  </div>
                  <div className="search-footer">
                    <span>标题与正文均在本地检索</span>
                    <span>
                      <kbd>esc</kbd> 关闭
                    </span>
                  </div>
                </Dialog.Content>
              </Dialog.Portal>
            </Dialog.Root>
            <button
              className="icon-button theme-toggle"
              onClick={theme}
              aria-label={dark ? "切换到浅色主题" : "切换到深色主题"}
            >
              {dark ? <Sun size={19} /> : <Moon size={19} />}
            </button>
          </div>
        </header>
        <main id="main-content" tabIndex={-1}>
          {children}
        </main>
        <footer className="site-footer">
          <span>海江的笔记</span>
          <span>用清楚的记录，留下自己的理解。</span>
        </footer>
      </div>
    </div>
  );
}
