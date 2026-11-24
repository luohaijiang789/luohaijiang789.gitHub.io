"use client";
import { useRef, useState, type ComponentPropsWithoutRef } from "react";
import { Check, Copy } from "lucide-react";
export function CodeBlock({
  children,
  ...props
}: ComponentPropsWithoutRef<"pre">) {
  const ref = useRef<HTMLPreElement>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");
  async function copy() {
    try {
      await navigator.clipboard.writeText(ref.current?.textContent || "");
      setCopied(true);
      setError("");
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setError("复制失败，请选择代码后手动复制。");
    }
  }
  return (
    <div className="code-block">
      <button className="copy-button" onClick={copy} aria-label="复制代码">
        {copied ? <Check size={15} /> : <Copy size={15} />}
        <span>{copied ? "已复制" : "复制"}</span>
      </button>
      <pre ref={ref} {...props}>
        {children}
      </pre>
      {error && <p role="status">{error}</p>}
    </div>
  );
}
