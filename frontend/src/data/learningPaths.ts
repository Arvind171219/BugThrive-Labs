import type { LearningPath } from "@/types";

export const learningPaths: LearningPath[] = [
  // Job-role paths: full career tracks that end in a certification exam.
  {
    id: "p-webpentester",
    type: "job-role",
    title: "Web Application Pentester",
    description: "Go from HTTP basics to finding critical bugs in real-world web apps.",
    category: "web-security",
    level: "Intermediate",
    courseIds: ["c-sqli", "c-owasp"],
    totalHours: 42,
    examId: "e-bcwp",
  },
  {
    id: "p-soc",
    type: "job-role",
    title: "SOC Analyst",
    description: "Build the monitoring, triage and detection skills SOC teams hire for.",
    category: "blue-team",
    level: "Beginner",
    courseIds: ["c-netfund", "c-soc", "c-sigma"],
    totalHours: 36,
    examId: "e-bcsa",
  },
  {
    id: "p-redteam",
    type: "job-role",
    title: "Red Team Operator",
    description: "Master Active Directory compromise and adversary emulation.",
    category: "red-team",
    level: "Advanced",
    courseIds: ["c-ad", "c-mitre"],
    totalHours: 48,
    examId: "e-bcro",
  },
  // Skill paths: focused on a single topic.
  {
    id: "p-traffic",
    type: "skill",
    title: "Network Traffic Analysis",
    description: "Read packets fluently and spot malicious traffic on the wire.",
    category: "network-security",
    level: "Beginner",
    courseIds: ["c-netfund", "c-wireshark"],
    totalHours: 15,
  },
  {
    id: "p-cloud",
    type: "skill",
    title: "Cloud Security Fundamentals",
    description: "Secure AWS workloads and Kubernetes clusters end-to-end.",
    category: "cloud-security",
    level: "Intermediate",
    courseIds: ["c-aws", "c-k8s"],
    totalHours: 22,
  },
  {
    id: "p-dfir",
    type: "skill",
    title: "DFIR Essentials",
    description: "Disk and memory forensics for incident responders.",
    category: "digital-forensics",
    level: "Intermediate",
    courseIds: ["c-winforensics", "c-volatility"],
    totalHours: 21,
  },
];

export function getPathById(id: string) {
  return learningPaths.find((p) => p.id === id);
}
