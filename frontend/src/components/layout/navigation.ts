import {
  Award,
  BookOpen,
  FlaskConical,
  LayoutDashboard,
  Medal,
  Route,
  Settings,
  Trophy,
  User,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  label: string;
  path: string;
  icon: LucideIcon;
  description: string;
}

export interface NavSection {
  title: string;
  items: NavItem[];
}

export const navSections: NavSection[] = [
  {
    title: "Learn",
    items: [
      { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard, description: "Your learning overview." },
      { label: "Browse Labs", path: "/labs", icon: FlaskConical, description: "Explore hands-on labs across every security domain." },
      { label: "Learning Paths", path: "/learning-paths", icon: Route, description: "Structured career tracks from beginner to expert." },
      { label: "My Learning", path: "/my-learning", icon: BookOpen, description: "All of your enrolled and completed courses." },
    ],
  },
  {
    title: "Progress",
    items: [
      { label: "Achievements", path: "/achievements", icon: Medal, description: "Badges and milestones you have unlocked." },
      { label: "Leaderboard", path: "/leaderboard", icon: Trophy, description: "See how you rank against other learners." },
      { label: "Certificates", path: "/certificates", icon: Award, description: "Download and share your earned certificates." },
    ],
  },
  {
    title: "Account",
    items: [
      { label: "Profile", path: "/profile", icon: User, description: "Your public hacker profile." },
      { label: "Settings", path: "/settings", icon: Settings, description: "Account, notification and privacy preferences." },
    ],
  },
];

export const allNavItems = navSections.flatMap((s) => s.items);
