import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { evaluate } from "@mdx-js/mdx";
import * as runtime from "react/jsx-runtime";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeShiki from "@shikijs/rehype";
import { createElement } from "react";
import { PolicyDemo } from "@/components/policy-demo";
import { LegacyBackup } from "@/components/legacy-backup";
import { CodeBlock } from "@/components/code-block";

export type Note = {
  slug: string;
  filename: string;
  title: string;
  description: string;
  topic: string;
  body: string;
  order: number;
  minutes: number;
};
export type SearchNote = Pick<
  Note,
  "slug" | "title" | "description" | "topic"
> & { text: string };
export type Heading = { id: string; title: string; depth: number };
const topics: Record<string, string> = {
  http: "网络基础",
  "software-delivery": "工程基础",
  "tool-boundaries": "AI 安全",
  "tool-guard": "安全实验",
  evidence: "技术思考",
  "visual-explanation": "技术图解",
  "job-research": "职业研究",
};
const descriptions: Record<string, string> = {
  evidence: "区分观察、推断与结论，让每一次判断都有证据。",
  "visual-explanation": "从一句话开始，用位置、边界与文字讲清技术问题。",
  "job-research": "从真实岗位出发，用项目证据分析能力差距。",
};
const contentRoot = path.join(process.cwd(), "src/content/docs");
export function getNotes(): Note[] {
  return fs
    .readdirSync(path.join(contentRoot, "notes"))
    .filter((name) => /\.mdx?$/.test(name))
    .map((name) => {
      const slug = name.replace(/\.mdx?$/, "");
      const { data, content } = matter(
        fs.readFileSync(path.join(contentRoot, "notes", name), "utf8"),
      );
      if (typeof data.title !== "string" || !data.title.trim())
        throw new Error(`Missing note title: ${name}`);
      return {
        slug,
        filename: name,
        title: data.title,
        description: data.description || descriptions[slug] || "",
        topic: data.topic || topics[slug] || "技术笔记",
        body: content,
        order: data.sidebar?.order ?? 100,
        minutes: Math.max(
          1,
          Math.ceil(content.replace(/<[^>]+>/g, "").length / 500),
        ),
      };
    })
    .sort(
      (a, b) => a.order - b.order || a.title.localeCompare(b.title, "zh-CN"),
    );
}
export function getSearchNotes(): SearchNote[] {
  return getNotes().map(({ slug, title, description, topic, body }) => ({
    slug,
    title,
    description,
    topic,
    text: body.replace(/<[^>]+>/g, " ").replace(/[#*`]/g, ""),
  }));
}
export function getDocument(name: "about" | "archive") {
  const file = name === "about" ? "about.mdx" : "archive.md";
  const { data, content } = matter(
    fs.readFileSync(path.join(contentRoot, file), "utf8"),
  );
  return {
    title: String(data.title),
    description: String(data.description || ""),
    body: content,
  };
}
export async function renderContent(body: string) {
  const headings: Heading[] = [];
  function collectHeadings() {
    return (tree: unknown) => {
      type Node = {
        type?: string;
        tagName?: string;
        value?: string;
        properties?: { id?: string };
        children?: Node[];
      };
      const text = (node: Node): string =>
        node.value || node.children?.map(text).join("") || "";
      function walk(node: Node) {
        if (/^h[23]$/.test(node.tagName || "") && node.properties?.id)
          headings.push({
            id: node.properties.id,
            title: text(node),
            depth: Number(node.tagName![1]),
          });
        node.children?.forEach(walk);
      }
      walk(tree as Node);
    };
  }
  // Only compile trusted, repository-owned documents at build time. Never accept visitor MDX.
  const { default: Content } = await evaluate(body, {
    ...runtime,
    remarkPlugins: [remarkGfm],
    rehypePlugins: [
      rehypeSlug,
      collectHeadings,
      [rehypeShiki, { themes: { light: "github-light", dark: "github-dark" } }],
    ],
  });
  return {
    content: createElement(Content, {
      components: { PolicyDemo, LegacyBackup, pre: CodeBlock },
    }),
    headings,
  };
}
