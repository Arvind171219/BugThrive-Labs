import { Cloud, Fingerprint, Globe, Network, ShieldCheck, Swords, type LucideIcon } from "lucide-react";

import type { CategoryId } from "@/types";

export interface CategoryMeta {
  id: CategoryId;
  name: string;
  icon: LucideIcon;
  /** Tailwind classes — kept as full strings so the JIT compiler picks them up. */
  text: string;
  bg: string;
  border: string;
  bar: string;
  gradient: string;
}

export const categories: Record<CategoryId, CategoryMeta> = {
  "web-security": {
    id: "web-security",
    name: "Web Security",
    icon: Globe,
    text: "text-cyan-400",
    bg: "bg-cyan-400/10",
    border: "border-cyan-400/25",
    bar: "bg-cyan-400",
    gradient: "from-cyan-500/30 via-cyan-500/5",
  },
  "network-security": {
    id: "network-security",
    name: "Network Security",
    icon: Network,
    text: "text-amber-400",
    bg: "bg-amber-400/10",
    border: "border-amber-400/25",
    bar: "bg-amber-400",
    gradient: "from-amber-500/30 via-amber-500/5",
  },
  "cloud-security": {
    id: "cloud-security",
    name: "Cloud Security",
    icon: Cloud,
    text: "text-sky-400",
    bg: "bg-sky-400/10",
    border: "border-sky-400/25",
    bar: "bg-sky-400",
    gradient: "from-sky-500/30 via-sky-500/5",
  },
  "red-team": {
    id: "red-team",
    name: "Red Team",
    icon: Swords,
    text: "text-rose-400",
    bg: "bg-rose-400/10",
    border: "border-rose-400/25",
    bar: "bg-rose-400",
    gradient: "from-rose-500/30 via-rose-500/5",
  },
  "blue-team": {
    id: "blue-team",
    name: "Blue Team",
    icon: ShieldCheck,
    text: "text-blue-400",
    bg: "bg-blue-400/10",
    border: "border-blue-400/25",
    bar: "bg-blue-400",
    gradient: "from-blue-500/30 via-blue-500/5",
  },
  "digital-forensics": {
    id: "digital-forensics",
    name: "Digital Forensics",
    icon: Fingerprint,
    text: "text-violet-400",
    bg: "bg-violet-400/10",
    border: "border-violet-400/25",
    bar: "bg-violet-400",
    gradient: "from-violet-500/30 via-violet-500/5",
  },
};

export const categoryList = Object.values(categories);
