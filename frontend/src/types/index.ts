export type CategoryId =
  | "web-security"
  | "network-security"
  | "cloud-security"
  | "red-team"
  | "blue-team"
  | "digital-forensics";

export type Level = "Beginner" | "Intermediate" | "Advanced";

/** Difficulty tier: 0 (fundamentals) → 4 (expert). */
export type Tier = 0 | 1 | 2 | 3 | 4;

export type Domain = "Offensive" | "Defensive" | "General";

export interface Question {
  id: string;
  prompt: string;
  /** Mock only — answers will be verified server-side once the API exists. */
  answer: string;
  hint: string;
  points: number;
}

export interface Section {
  id: string;
  title: string;
  /** "interactive" sections will spawn a target machine in a later phase. */
  type: "reading" | "interactive";
  minutes: number;
  questions: Question[];
}

export interface CourseModule {
  id: string;
  title: string;
  sections: Section[];
}

export interface CheatSheetEntry {
  description: string;
  command: string;
}

export interface Course {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: CategoryId;
  domain: Domain;
  level: Level;
  tier: Tier;
  instructor: string;
  durationHours: number;
  rating: number;
  students: number;
  tags: string[];
  modules: CourseModule[];
  assessment: { title: string; description: string };
  cheatSheet: CheatSheetEntry[];
  isNew?: boolean;
  /** Present only when the student is enrolled. 0–100. */
  progress?: number;
  lastAccessed?: string;
}

export type PathType = "skill" | "job-role";

export interface LearningPath {
  id: string;
  type: PathType;
  title: string;
  description: string;
  category: CategoryId;
  level: Level;
  courseIds: string[];
  totalHours: number;
  /** Job-role paths end in a certification exam. */
  examId?: string;
}

export interface Exam {
  id: string;
  code: string;
  title: string;
  description: string;
  pathId: string;
  format: string;
  duration: string;
  skills: string[];
}

export interface IssuedCertificate {
  id: string;
  courseId: string;
  credentialId: string;
  issuedOn: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: "flag" | "syringe" | "radar" | "key" | "flame" | "route" | "cloud" | "search" | "moon" | "trophy";
  rarity: "Common" | "Rare" | "Epic" | "Legendary";
  earnedOn?: string;
  /** For locked badges: current / target. */
  progress?: { current: number; target: number };
}

export type ActivityType = "lesson" | "course" | "badge" | "quiz" | "path";

export interface Activity {
  id: string;
  type: ActivityType;
  title: string;
  detail: string;
  time: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
}

export interface Student {
  name: string;
  firstName: string;
  email: string;
  handle: string;
  initials: string;
  rank: string;
  level: number;
  xp: number;
  xpToNextLevel: number;
  learningHours: number;
  hoursThisWeek: number;
  streakDays: number;
  longestStreak: number;
  /** Mon–Sun, minutes studied this week */
  weeklyMinutes: number[];
}
