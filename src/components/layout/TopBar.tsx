import { Bell } from "lucide-react";

interface Props {
  title: string;
  showAvatar?: boolean;
  initials?: string;
}

export function TopBar({ title, showAvatar = true, initials = "AH" }: Props) {
  return (
    <header className="sticky top-0 z-30 glass">
      <div className="flex items-center justify-between px-5 py-3">
        <div className="flex items-center gap-3">
          {showAvatar && (
            <div className="flex h-10 w-10 items-center justify-center rounded-pill bg-primary-900 text-sm font-semibold text-primary-foreground">
              {initials}
            </div>
          )}
        </div>
        <h1 className="absolute left-1/2 -translate-x-1/2 text-base font-semibold text-text-primary">
          {title}
        </h1>
        <button
          aria-label="Notifikasi"
          className="relative flex h-10 w-10 items-center justify-center rounded-pill bg-card border border-border press"
        >
          <Bell className="h-5 w-5 text-text-primary" />
          <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-pill bg-gold-400" />
        </button>
      </div>
    </header>
  );
}
