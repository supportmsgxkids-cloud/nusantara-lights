import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { KEYS, getFlag } from "@/lib/mock-auth";

export const Route = createFileRoute("/")({
  component: IndexRedirect,
});

function IndexRedirect() {
  const navigate = useNavigate();
  useEffect(() => {
    const onboarded = getFlag(KEYS.onboarded);
    const authed = getFlag(KEYS.authed);
    if (!onboarded) navigate({ to: "/onboarding", replace: true });
    else if (!authed) navigate({ to: "/login", replace: true });
    else navigate({ to: "/home", replace: true });
  }, [navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface">
      <div className="h-10 w-10 animate-pulse rounded-pill bg-primary-50" />
    </div>
  );
}
