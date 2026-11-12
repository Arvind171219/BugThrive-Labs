import { Menu } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Logo } from "./Logo";
import { NotificationsMenu } from "./NotificationsMenu";
import { ProfileMenu } from "./ProfileMenu";
import { SearchBox } from "./SearchBox";

interface TopbarProps {
  search: string;
  onSearchChange: (value: string) => void;
  onMenuClick: () => void;
}

export function Topbar({ search, onSearchChange, onMenuClick }: TopbarProps) {
  return (
    <header className="fixed inset-x-0 top-0 z-50 h-16 border-b border-primary/10 bg-background/85 backdrop-blur-md">
      <div className="flex h-full items-center gap-3 px-4 lg:px-6">
        <Button variant="ghost" size="icon" className="lg:hidden" onClick={onMenuClick} aria-label="Open navigation">
          <Menu className="h-5 w-5" />
        </Button>

        <div className="shrink-0 lg:w-56">
          <Logo />
        </div>

        <div className="flex min-w-0 flex-1 justify-center px-2">
          <SearchBox value={search} onChange={onSearchChange} />
        </div>

        <div className="flex shrink-0 items-center gap-1 sm:gap-2">
          <NotificationsMenu />
          <ProfileMenu />
        </div>
      </div>
    </header>
  );
}
