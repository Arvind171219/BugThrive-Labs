import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";

export function NotFoundPage() {
  return (
    <div className="flex flex-col items-center py-24 text-center">
      <p className="font-mono text-6xl font-bold text-primary">404</p>
      <h1 className="mt-4 text-2xl font-bold">Page not found</h1>
      <p className="mt-2 text-muted-foreground">The page you&apos;re looking for doesn&apos;t exist or has moved.</p>
      <Button asChild className="mt-6">
        <Link to="/dashboard">Go to dashboard</Link>
      </Button>
    </div>
  );
}
