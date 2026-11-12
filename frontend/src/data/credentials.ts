import type { Badge, Exam, IssuedCertificate } from "@/types";

/** Certification exams unlocked by completing a job-role path. Mock data. */
export const exams: Exam[] = [
  {
    id: "e-bcwp",
    code: "BCWP",
    title: "BugThrive Certified Web Pentester",
    description: "A practical web application penetration test against a multi-application environment, followed by a professional report.",
    pathId: "p-webpentester",
    format: "Practical exam + written report",
    duration: "7 days",
    skills: ["Access control", "Injection", "SSRF", "Reporting"],
  },
  {
    id: "e-bcsa",
    code: "BCSA",
    title: "BugThrive Certified SOC Analyst",
    description: "Investigate a live incident in a SIEM, triage alerts and write detections for what you find.",
    pathId: "p-soc",
    format: "Practical investigation + incident report",
    duration: "5 days",
    skills: ["Alert triage", "Log analysis", "Detection rules", "Reporting"],
  },
  {
    id: "e-bcro",
    code: "BCRO",
    title: "BugThrive Certified Red Team Operator",
    description: "Compromise a hardened Active Directory forest while staying under the blue team's radar.",
    pathId: "p-redteam",
    format: "Practical engagement + debrief report",
    duration: "10 days",
    skills: ["AD exploitation", "Lateral movement", "OPSEC", "Reporting"],
  },
];

export const issuedCertificates: IssuedCertificate[] = [
  { id: "cert-1", courseId: "c-sqli", credentialId: "BTL-SQLI-7F3A21", issuedOn: "Nov 5, 2026" },
  { id: "cert-2", courseId: "c-soc", credentialId: "BTL-SOC1-29C4E8", issuedOn: "Oct 29, 2026" },
  { id: "cert-3", courseId: "c-netfund", credentialId: "BTL-NETF-B81D07", issuedOn: "Oct 21, 2026" },
];

export const badges: Badge[] = [
  { id: "b-first", name: "First Blood", description: "Solve your first question.", icon: "flag", rarity: "Common", earnedOn: "Sep 14, 2026" },
  { id: "b-sqli", name: "Injection Master", description: "Complete SQL Injection Deep Dive.", icon: "syringe", rarity: "Rare", earnedOn: "Nov 5, 2026" },
  { id: "b-packet", name: "Packet Sniffer", description: "Score 90%+ on a Wireshark quiz.", icon: "radar", rarity: "Common", earnedOn: "Nov 11, 2026" },
  { id: "b-kerberos", name: "Kerberos Crusher", description: "Finish the Kerberos Attacks module.", icon: "key", rarity: "Epic", earnedOn: "Nov 12, 2026" },
  { id: "b-streak7", name: "On Fire", description: "Keep a 7-day learning streak.", icon: "flame", rarity: "Common", earnedOn: "Nov 7, 2026" },
  { id: "b-night", name: "Night Owl", description: "Complete a section after midnight.", icon: "moon", rarity: "Common", earnedOn: "Oct 2, 2026" },
  { id: "b-streak30", name: "Unstoppable", description: "Keep a 30-day learning streak.", icon: "flame", rarity: "Epic", progress: { current: 12, target: 30 } },
  { id: "b-path", name: "Path Finder", description: "Complete any learning path.", icon: "route", rarity: "Rare", progress: { current: 0, target: 1 } },
  { id: "b-cloud", name: "Cloud Guardian", description: "Complete AWS Cloud Security Essentials.", icon: "cloud", rarity: "Rare", progress: { current: 28, target: 100 } },
  { id: "b-dfir", name: "Forensic Investigator", description: "Complete the DFIR Essentials path.", icon: "search", rarity: "Epic", progress: { current: 0, target: 2 } },
  { id: "b-cert", name: "Certified", description: "Pass any BugThrive certification exam.", icon: "trophy", rarity: "Legendary", progress: { current: 0, target: 1 } },
];
