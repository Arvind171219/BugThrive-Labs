import { useState } from "react";
import { Outlet, useOutletContext } from "react-router-dom";

import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";

export interface LayoutContext {
  search: string;
  setSearch: (value: string) => void;
}

export function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [search, setSearch] = useState("");

  return (
    <div className="min-h-screen">
      <Topbar search={search} onSearchChange={setSearch} onMenuClick={() => setSidebarOpen(true)} />
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <main className="pt-16 lg:pl-64">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <Outlet context={{ search, setSearch } satisfies LayoutContext} />
        </div>
      </main>
    </div>
  );
}

export function useLayoutContext() {
  return useOutletContext<LayoutContext>();
}
