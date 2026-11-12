import { useNavigate } from "react-router-dom";
import { Award, ChevronDown, LogOut, Medal, Settings, User } from "lucide-react";

import { useAuth } from "@/auth/AuthContext";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const menuItems = [
  { label: "My Profile", path: "/profile", icon: User },
  { label: "Achievements", path: "/achievements", icon: Medal },
  { label: "Certificates", path: "/certificates", icon: Award },
  { label: "Settings", path: "/settings", icon: Settings },
];

export function initialsOf(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "?";
  const letters = parts.length === 1 ? parts[0].slice(0, 2) : parts[0][0] + parts[parts.length - 1][0];
  return letters.toUpperCase();
}

export function ProfileMenu() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  if (!user) return null;

  const roleLabel = user.role === "ADMIN" ? "Admin" : "Student";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-2 rounded-md p-1 outline-none transition-colors hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring">
        <Avatar className="h-8 w-8 border border-primary/40">
          <AvatarFallback className="bg-primary/15 font-mono text-xs font-bold text-primary">
            {initialsOf(user.fullName)}
          </AvatarFallback>
        </Avatar>
        <span className="hidden max-w-[10rem] text-left md:block">
          <span className="block truncate text-sm font-medium leading-tight">{user.fullName}</span>
          <span className="block font-mono text-[10px] uppercase tracking-wider text-muted-foreground">{roleLabel}</span>
        </span>
        <ChevronDown className="hidden h-4 w-4 text-muted-foreground md:block" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-60">
        <DropdownMenuLabel className="font-normal">
          <p className="truncate text-sm font-medium">{user.fullName}</p>
          <p className="truncate text-xs text-muted-foreground">{user.email}</p>
          <p className="mt-1 font-mono text-[11px] uppercase tracking-wider text-primary">{roleLabel}</p>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {menuItems.map(({ label, path, icon: Icon }) => (
            <DropdownMenuItem key={path} onSelect={() => navigate(path)}>
              <Icon className="text-muted-foreground" />
              {label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onSelect={() => {
            logout();
            navigate("/login", { replace: true });
          }}
        >
          <LogOut className="text-muted-foreground" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
