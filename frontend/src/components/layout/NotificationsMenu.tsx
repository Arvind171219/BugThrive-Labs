import { useState } from "react";
import { Bell } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { notifications as initialNotifications } from "@/data/mockData";
import { cn } from "@/lib/utils";

export function NotificationsMenu() {
  const [items, setItems] = useState(initialNotifications);
  const unread = items.filter((n) => !n.read).length;

  const markRead = (id: string) => setItems((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  const markAllRead = () => setItems((prev) => prev.map((n) => ({ ...n, read: true })));

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative" aria-label={`Notifications (${unread} unread)`}>
          <Bell className="h-5 w-5" />
          {unread > 0 && (
            <span className="absolute right-1.5 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 font-mono text-[10px] font-bold text-primary-foreground">
              {unread}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 p-0">
        <div className="flex items-center justify-between px-4 py-3">
          <DropdownMenuLabel className="p-0">Notifications</DropdownMenuLabel>
          {unread > 0 && (
            <button
              type="button"
              onClick={markAllRead}
              className="font-mono text-[11px] font-bold uppercase tracking-wider text-primary hover:underline"
            >
              Mark all read
            </button>
          )}
        </div>
        <DropdownMenuSeparator className="mx-0 my-0" />
        <div className="max-h-96 overflow-y-auto p-1">
          {items.map((n) => (
            <DropdownMenuItem
              key={n.id}
              onSelect={(e) => {
                e.preventDefault();
                markRead(n.id);
              }}
              className="items-start gap-3 px-3 py-2.5"
            >
              <span
                className={cn("mt-1.5 h-2 w-2 shrink-0 rounded-full", n.read ? "bg-transparent" : "bg-primary")}
                aria-hidden
              />
              <span className="min-w-0 flex-1">
                <span className={cn("block text-sm", n.read ? "text-muted-foreground" : "font-medium")}>{n.title}</span>
                <span className="block text-xs text-muted-foreground">{n.message}</span>
                <span className="mt-1 block font-mono text-[10px] uppercase tracking-wider text-muted-foreground/70">
                  {n.time}
                </span>
              </span>
            </DropdownMenuItem>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
