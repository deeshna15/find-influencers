import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { useProfileStore } from "@/store/useProfileStore";
import { ListChecks } from "lucide-react";

interface LayoutProps {
  children: ReactNode;
  title?: string;
}

export function Layout({ children, title }: LayoutProps) {
  const selectedProfiles = useProfileStore((s) => s.selectedProfiles);
  const toggleSidebar = useProfileStore((s) => s.toggleSidebar);
  const count = selectedProfiles.length;

  return (
    <div className="min-h-screen text-gray-900 dark:text-gray-100 selection:bg-violet-200 dark:selection:bg-violet-900">
      <header className="sticky top-0 z-40 glass-panel border-b-0 rounded-b-2xl mx-2 mt-2">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-2.5 text-lg font-bold tracking-tight text-gray-900 dark:text-white hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
          >
            <svg
              className="w-7 h-7 text-violet-600"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
            </svg>
            Wobb
          </Link>

          <div className="flex items-center gap-3">
            {count > 0 && (
              <span className="hidden sm:inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
                {count} selected
              </span>
            )}
            <button
              onClick={toggleSidebar}
              className="relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 bg-white/50 dark:bg-gray-800/50 hover:bg-white dark:hover:bg-gray-700 shadow-sm transition-all duration-200 hover:scale-105 active:scale-95"
              aria-label={`Selected profiles list (${count} items)`}
            >
              <ListChecks className="w-5 h-5" />
              <span className="hidden sm:inline">My List</span>
              {count > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center text-[10px] font-bold text-white bg-violet-600 rounded-full">
                  {count > 9 ? "9+" : count}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {title && (
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 dark:text-white mb-6">
            {title}
          </h1>
        )}
        {children}
      </main>
    </div>
  );
}
