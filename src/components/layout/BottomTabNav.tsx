import { Link, useLocation } from "@tanstack/react-router";
import { Home, BookOpen, Moon, Users, User } from "lucide-react";

const tabs = [
  { to: "/home", label: "Beranda", icon: Home },
  { to: "/ilmu", label: "Ilmu", icon: BookOpen },
  { to: "/ibadah", label: "Ibadah", icon: Moon },
  { to: "/sosial", label: "Sosial", icon: Users },
  { to: "/profil", label: "Profil", icon: User },
] as const;

export function BottomTabNav() {
  const { pathname } = useLocation();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 px-3 pb-3 pt-2">
      <div
        className="mx-auto flex max-w-md items-center justify-around rounded-lg border border-border bg-card/95 px-2 py-2 backdrop-blur"
        style={{ boxShadow: "var(--shadow-docked)" }}
      >
        {tabs.map(({ to, label, icon: Icon }) => {
          const active = pathname.startsWith(to);
          return (
            <Link
              key={to}
              to={to}
              className="flex flex-1 flex-col items-center gap-1 py-1.5 press"
            >
              <span
                className={`flex h-9 w-12 items-center justify-center rounded-pill transition-colors ${
                  active ? "bg-primary-50" : "bg-transparent"
                }`}
              >
                <Icon
                  className={`h-5 w-5 ${active ? "text-primary-900" : "text-text-muted"}`}
                  strokeWidth={active ? 2.4 : 1.8}
                  fill={active ? "currentColor" : "none"}
                  fillOpacity={active ? 0.12 : 0}
                />
              </span>
              <span
                className={`text-[11px] font-medium ${
                  active ? "text-primary-900" : "text-text-muted"
                }`}
              >
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
