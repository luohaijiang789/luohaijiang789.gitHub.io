"use client";
import { useState } from "react";
import { ShieldCheck } from "lucide-react";
import { evaluateCall } from "@/lib/policy.mjs";
export function PolicyDemo() {
  const [principal, setPrincipal] = useState("reader");
  const [action, setAction] = useState("read_note");
  const [resource, setResource] = useState("public-guide");
  const [result, setResult] = useState<{
    allowed: boolean;
    reason: string;
  } | null>(null);
  const check = () => setResult(evaluateCall(principal, { action, resource }));
  return (
    <section className="experiment" aria-labelledby="policy-demo-title">
      <div className="experiment-label">
        <ShieldCheck size={17} />
        交互实验
      </div>
      <h3 id="policy-demo-title">谁能访问什么？</h3>
      <p>本地规则演示，不连接模型或真实文件。身份模拟可信会话。</p>
      <div className="policy-fields">
        <label>
          可信会话身份
          <select
            data-policy-principal
            value={principal}
            onChange={(e) => setPrincipal(e.target.value)}
          >
            <option value="reader">Reader · 只读公开笔记</option>
            <option value="editor">Editor · 可编辑团队笔记</option>
            <option value="guest">Guest · 无权限</option>
          </select>
        </label>
        <label>
          调用操作
          <select
            data-policy-action
            value={action}
            onChange={(e) => setAction(e.target.value)}
          >
            <option value="read_note">read_note · 读取</option>
            <option value="update_note">update_note · 修改</option>
            <option value="export_data">export_data · 导出</option>
          </select>
        </label>
        <label>
          目标资源
          <select
            data-policy-resource
            value={resource}
            onChange={(e) => setResource(e.target.value)}
          >
            <option value="public-guide">public-guide · 公开指南</option>
            <option value="team-note">team-note · 团队笔记</option>
            <option value="payroll">payroll · 薪资数据</option>
          </select>
        </label>
      </div>
      <div className="actions">
        <button className="button primary" data-policy-run onClick={check}>
          检查权限
        </button>
        <button
          className="button"
          data-policy-attack
          onClick={() => {
            setAction("export_data");
            setResource("payroll");
            setResult(
              evaluateCall(principal, {
                action: "export_data",
                resource: "payroll",
              }),
            );
          }}
        >
          模拟恶意文档请求
        </button>
      </div>
      <p
        className={`policy-result ${result?.allowed ? "allowed" : result ? "denied" : ""}`}
        data-policy-result
        role="status"
      >
        {result
          ? `${result.allowed ? "允许执行" : "拒绝执行"}：${result.reason}`
          : "选择调用参数，检查执行层的判断。"}
      </p>
    </section>
  );
}
