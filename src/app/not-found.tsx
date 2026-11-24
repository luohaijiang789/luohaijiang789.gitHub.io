export default function NotFound() {
  return (
    <div className="not-found">
      <span className="page-eyebrow">404 / PAGE NOT FOUND</span>
      <h1>这篇笔记还不在这里</h1>
      <p>页面可能已移动，可以返回目录或搜索关键词。</p>
      <a className="button primary" href="/">
        回到笔记目录
      </a>
    </div>
  );
}
