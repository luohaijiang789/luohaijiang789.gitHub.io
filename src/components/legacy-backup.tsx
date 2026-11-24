"use client";
import { useState } from "react";
import {
  readProgress,
  writeProgress,
  normalizeProgress,
  STORAGE_KEY,
} from "@/lib/progress.mjs";
export function LegacyBackup() {
  const [status, setStatus] = useState("");
  function download() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const data = raw ? normalizeProgress(JSON.parse(raw)) : readProgress();
      const url = URL.createObjectURL(
        new Blob([JSON.stringify(data, null, 2)], { type: "application/json" }),
      );
      const a = document.createElement("a");
      a.href = url;
      a.download = "haijiang-learning-v1.json";
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      setStatus("备份已生成。");
    } catch {
      setStatus("无法读取历史记录，请检查浏览器存储设置或原始数据。");
    }
  }
  return (
    <div className="backup-panel">
      <div className="actions">
        <button className="button" data-export onClick={download}>
          导出历史备份
        </button>
        <label className="file-label">
          导入备份
          <input
            data-import
            type="file"
            accept="application/json,.json"
            onChange={async (event) => {
              const input = event.currentTarget;
              const file = input.files?.[0];
              if (!file) return;
              try {
                if (file.size > 1000000)
                  throw Error("请选择小于 1 MB 的 JSON 备份。");
                const data = normalizeProgress(JSON.parse(await file.text()));
                if (!confirm("导入将替换本机历史学习记录，确定继续？")) return;
                if (!writeProgress(data))
                  throw Error("浏览器无法保存，请检查存储设置。");
                setStatus("历史备份已导入。");
              } catch (error) {
                setStatus(
                  error instanceof Error ? error.message : "备份读取失败。",
                );
              } finally {
                input.value = "";
              }
            }}
          />
        </label>
      </div>
      <p data-backup-status role="status">
        {status}
      </p>
    </div>
  );
}
