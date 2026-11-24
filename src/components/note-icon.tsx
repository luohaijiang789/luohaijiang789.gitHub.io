import {
  Network,
  Package,
  ShieldCheck,
  FlaskConical,
  Lightbulb,
  PenTool,
  Compass,
  FileText,
} from "lucide-react";
const icons: Record<string, typeof FileText> = {
  http: Network,
  "software-delivery": Package,
  "tool-boundaries": ShieldCheck,
  "tool-guard": FlaskConical,
  evidence: Lightbulb,
  "visual-explanation": PenTool,
  "job-research": Compass,
};
export function NoteIcon({ slug, size = 20 }: { slug: string; size?: number }) {
  const Icon = icons[slug] || FileText;
  return <Icon size={size} strokeWidth={1.6} aria-hidden="true" />;
}
