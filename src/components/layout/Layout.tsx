import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useProfileStore } from "@/store/useProfileStore";
import { ListChecks, Sparkles } from "lucide-react";

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
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="sticky top-0 z-40 glass-panel border-b-0 rounded-b-3xl mx-2 mt-2 shadow-xl"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-2.5 group"
          >
            <motion.div
              whileHover={{ scale: 1.1, rotate: 10 }}
              whileTap={{ scale: 0.95 }}
              className="relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-pink-500 rounded-lg blur-md opacity-75 group-hover:opacity-100 transition-opacity" />
              <svg
                className="relative w-7 h-7 text-white"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
              </svg>
            </motion.div>
            <span className="text-lg font-bold tracking-tight bg-gradient-to-r from-violet-600 via-pink-500 to-cyan-500 bg-clip-text text-transparent group-hover:from-violet-700 group-hover:via-pink-600 group-hover:to-cyan-600 transition-all">
              Wobb
            </span>
          </Link>

          <div className="flex items-center gap-3">
            {count > 0 && (
              <motion.span
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="hidden sm:inline-flex items-center gap-1.5 text-sm bg-gradient-to-r from-violet-600 to-pink-500 bg-clip-text text-transparent font-semibold"
              >
                {count} selected
              </motion.span>
            )}
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleSidebar}
              className="relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white bg-gradient-to-r from-violet-600 to-pink-500 hover:from-violet-700 hover:to-pink-600 shadow-lg shadow-violet-500/30 transition-all duration-200 group"
              aria-label={`Selected profiles list (${count} items)`}
            >
              <ListChecks className="w-5 h-5 group-hover:animate-bounce" />
              <span className="hidden sm:inline">My List</span>
              {count > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-2 -right-2 w-6 h-6 flex items-center justify-center text-[11px] font-bold text-white bg-gradient-to-r from-pink-500 to-red-500 rounded-full shadow-lg"
                >
                  {count > 9 ? "9+" : count}
                </motion.span>
              )}
            </motion.button>
          </div>
        </div>
      </motion.header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {title && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="mb-8"
          >
            <div className="flex items-center gap-3 mb-2">
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="w-6 h-6 text-pink-500" />
              </motion.div>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight bg-gradient-to-r from-violet-600 via-pink-500 to-cyan-500 bg-clip-text text-transparent">
                {title}
              </h1>
            </div>
            <div className="h-1 w-20 bg-gradient-to-r from-violet-600 via-pink-500 to-cyan-500 rounded-full" />
          </motion.div>
        )}
        {children}
      </main>
    </div>
  );
}
