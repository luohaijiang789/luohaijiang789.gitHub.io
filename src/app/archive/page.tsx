import { getDocument, renderContent } from "@/lib/content";
export const metadata = {
  title: "旧站内容存档",
  robots: { index: false, follow: true },
};
export default async function Archive() {
  const doc = getDocument("archive");
  const { content } = await renderContent(doc.body);
  return (
    <div className="document-page">
      <header className="page-heading">
        <h1>{doc.title}</h1>
        <p>{doc.description}</p>
      </header>
      <article className="prose">{content}</article>
    </div>
  );
}
