import { getDocument, renderContent } from "@/lib/content";
export const metadata = {
  title: "关于这里",
  alternates: { canonical: "/about/" },
};
export default async function About() {
  const doc = getDocument("about");
  const { content } = await renderContent(doc.body);
  return (
    <div className="document-page">
      <div className="page-heading">
        <span className="page-eyebrow">ABOUT THIS SPACE</span>
        <h1>关于这里</h1>
        <p>一处记录知识、问题与实践的个人空间。</p>
      </div>
      <article className="prose">{content}</article>
    </div>
  );
}
