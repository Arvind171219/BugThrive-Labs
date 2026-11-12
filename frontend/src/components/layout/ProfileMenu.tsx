import { useNavigate } from "react-router-dom";
import { Award, ChevronDown, LogOut, Medal, Settings, User } from "lucide-react";

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
import { student } from "@/data/mockData";

const menuItems = [
  { label: "My Profile", path: "/profile", icon: User },
  { label: "Achievements", path: "/achievements", icon: Medal },
  { label: "Certificates", path: "/certificates", icon: Award },
  { label: "Settings", path: "/settings", icon: Settings },
];

export function ProfileMenu() {
  const navigate = useNavigate();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-2 rounded-md p-1 outline-none transition-colors hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring">
        <Avatar className="h-8 w-8 border border-primary/40">
          <AvatarFallback className="bg-primary/15 font-mono text-xs font-bold text-primary">
            {student.initials}
          </AvatarFallback>
        </Avatar>
        <span className="hidden text-left md:block">
          <span className="block text-sm font-medium leading-tight">{student.name}</span>
          <span className="block font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
            {student.rank}
          </span>
        </span>
        <ChevronDown className="hidden h-4 w-4 text-muted-foreground md:block" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-60">
        <DropdownMenuLabel className="font-normal">
          <p className="text-sm font-medium">{student.name}</p>
          <p className="truncate text-xs text-muted-foreground">{student.email}</p>
          <p className="mt-1 font-mono text-[11px] text-primary">@{student.handle}</p>
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
        {/* Authentication arrives in a later phase. */}
        <DropdownMenuItem disabled>
          <LogOut className="text-muted-foreground" />
          Sign out
          <span className="ml-auto font-mono text-[10px] uppercase text-muted-foreground">Soon</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
