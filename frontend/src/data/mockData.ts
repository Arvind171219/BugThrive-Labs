import type { Activity, Notification, Student } from "@/types";
import { courses } from "./courses";

/*
 * Mock data for the frontend. Replace with API calls once the backend
 * exposes dashboard/course endpoints.
 */

export { courses, getCourseById, getCourseBySlug } from "./courses";
export { learningPaths, getPathById } from "./learningPaths";
export { badges, exams, issuedCertificates } from "./credentials";

export const student: Student = {
  name: "Arvind",
  firstName: "Arvind",
  email: "arvind@example.com",
  handle: "0xarvind",
  initials: "AR",
  rank: "Pro Hacker",
  level: 14,
  xp: 8420,
  xpToNextLevel: 10000,
  learningHours: 86.5,
  hoursThisWeek: 6.2,
  streakDays: 12,
  longestStreak: 21,
  weeklyMinutes: [45, 60, 30, 75, 50, 90, 25],
};

export const recentActivity: Activity[] = [
  {
    id: "a1",
    type: "lesson",
    title: "Completed section",
    detail: "SSRF fundamentals — OWASP Top 10",
    time: "2 hours ago",
  },
  {
    id: "a2",
    type: "badge",
    title: "Earned badge",
    detail: "Kerberos Crusher — finished the Kerberos Attacks module",
    time: "5 hours ago",
  },
  {
    id: "a3",
    type: "quiz",
    title: "Solved question",
    detail: "Display filters — Packet Analysis with Wireshark",
    time: "Yesterday",
  },
  {
    id: "a4",
    type: "path",
    title: "Started skill path",
    detail: "Cloud Security Fundamentals",
    time: "3 days ago",
  },
  {
    id: "a5",
    type: "course",
    title: "Completed course",
    detail: "SQL Injection Deep Dive — certificate issued",
    time: "1 week ago",
  },
];

export const notifications: Notification[] = [
  {
    id: "n1",
    title: "New course available",
    message: "Memory Forensics with Volatility is now live.",
    time: "10 min ago",
    read: false,
  },
  {
    id: "n2",
    title: "Streak at risk",
    message: "Study today to keep your 12-day streak alive.",
    time: "1 hour ago",
    read: false,
  },
  {
    id: "n3",
    title: "Badge unlocked",
    message: "You earned “Kerberos Crusher”.",
    time: "5 hours ago",
    read: false,
  },
  {
    id: "n4",
    title: "Certificate ready",
    message: "Your SQL Injection Deep Dive certificate is ready to download.",
    time: "1 week ago",
    read: true,
  },
];

/* ---------- Derived collections ---------- */

export const enrolledCourses = courses.filter((c) => c.progress !== undefined);
export const completedCourses = enrolledCourses.filter((c) => c.progress === 100);
export const inProgressCourses = enrolledCourses.filter((c) => (c.progress ?? 0) < 100);
export const recommendedCourses = courses.filter((c) => c.progress === undefined);
export const newCourses = courses.filter((c) => c.isNew);
