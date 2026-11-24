"use client";
import { useState } from "react";
import { BookOpen, Clock3 } from "lucide-react";
import { NoteIcon } from "./note-icon";
import type { Note } from "@/lib/content";
export function NoteLibrary({ notes }: { notes: Omit<Note, "body">[] }) {
  const [topic, setTopic] = useState("全部");
  const topics = ["全部", ...new Set(notes.map((note) => note.topic))];
  const visible = notes.filter(
    (note) => topic === "全部" || note.topic === topic,
  );
  return (
    <div className="library">
      <div className="page-heading">
        <span className="page-eyebrow">
          <BookOpen size={16} />
          HAIJIANG / NOTES
        </span>
        <h1>我的笔记</h1>
        <p>关于计算机、AI 安全与工程实践。记录问题，也记录如何理解它。</p>
      </div>
      <div className="library-controls">
        <div className="topic-filters" role="group" aria-label="按主题筛选">
          {topics.map((item) => (
            <button
              key={item}
              aria-pressed={item === topic}
              onClick={() => setTopic(item)}
            >
              {item}
            </button>
          ))}
        </div>
      </div>
      <div className="library-meta" role="status">
        <span>{topic === "全部" ? "全部笔记" : topic}</span>
        <span>{visible.length} 篇记录</span>
      </div>
      <div className="note-grid">
        {visible.map((note) => (
          <a
            className="note-card"
            href={`/notes/${note.slug}/`}
            key={note.slug}
          >
            <div className="note-card-top">
              <span className={`note-icon tone-${note.order % 4}`}>
                <NoteIcon slug={note.slug} size={23} />
              </span>
              <span className="note-topic">{note.topic}</span>
            </div>
            <h2>{note.title}</h2>
            <p>{note.description}</p>
            <div className="note-card-bottom">
              <span>阅读笔记</span>
              <span>
                <Clock3 size={14} />约 {note.minutes} 分钟
              </span>
            </div>
          </a>
        ))}
      </div>
      <div className="library-end">
        <span></span>
        <BookOpen size={17} />
        <span></span>
      </div>
    </div>
  );
}
