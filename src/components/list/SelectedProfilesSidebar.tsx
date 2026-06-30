import { useEffect, useRef, useCallback } from "react";
import { X, Trash2, ListChecks } from "lucide-react";
import { motion, AnimatePresence, Reorder } from "framer-motion";
import clsx from "clsx";
import { useProfileStore } from "@/store/useProfileStore";
import { SelectedProfileItem } from "./SelectedProfileItem";

export function SelectedProfilesSidebar() {
  const selectedProfiles = useProfileStore((s) => s.selectedProfiles);
  const sidebarOpen = useProfileStore((s) => s.sidebarOpen);
  const setSidebarOpen = useProfileStore((s) => s.setSidebarOpen);
  const clearList = useProfileStore((s) => s.clearList);
  const panelRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const count = selectedProfiles.length;

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") setSidebarOpen(false);
    },
    [setSidebarOpen]
  );

  useEffect(() => {
    if (sidebarOpen) {
      document.addEventListener("keydown", handleKeyDown);
      closeButtonRef.current?.focus();
    }
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [sidebarOpen, handleKeyDown]);

  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [sidebarOpen]);

  return (
    <AnimatePresence>
      {sidebarOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
            aria-hidden="true"
          />

          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            ref={panelRef}
            className={clsx(
              "fixed inset-y-0 right-0 z-50 w-full max-w-md",
              "bg-gradient-to-b from-white via-gray-50 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 backdrop-blur-2xl shadow-2xl border-l border-white/40 dark:border-gray-800/60"
            )}
            role="dialog"
            aria-modal="true"
            aria-label="Selected profiles"
          >
            <div className="flex flex-col h-full">
              <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="flex items-center justify-between px-6 py-5 border-b border-gradient border-gray-200 dark:border-gray-700/50 bg-gradient-to-r from-violet-50 via-transparent to-pink-50 dark:from-violet-900/20 dark:via-transparent dark:to-pink-900/20"
              >
                <div className="flex items-center gap-4">
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    <ListChecks className="w-6 h-6 text-violet-600 dark:text-violet-400" />
                  </motion.div>
                  <div>
                    <h2 className="text-xl font-bold bg-gradient-to-r from-violet-600 to-pink-500 bg-clip-text text-transparent">
                      My List
                    </h2>
                  </div>
                  {count > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="px-3 py-1 text-sm font-bold bg-gradient-to-r from-violet-600 to-pink-500 text-white rounded-full"
                    >
                      {count}
                    </motion.span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {count > 0 && (
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={clearList}
                      className={clsx(
                        "flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold",
                        "text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30",
                        "transition-all duration-200 hover:scale-105"
                      )}
                      aria-label="Clear all profiles from list"
                    >
                      <Trash2 className="w-4 h-4" />
                      Clear
                    </motion.button>
                  )}
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.95 }}
                    ref={closeButtonRef}
                    onClick={() => setSidebarOpen(false)}
                    className={clsx(
                      "p-2 rounded-lg text-gray-600 dark:text-gray-400",
                      "hover:bg-gray-200 dark:hover:bg-gray-700",
                      "transition-all duration-200",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
                    )}
                    aria-label="Close sidebar"
                  >
                    <X className="w-5 h-5" />
                  </motion.button>
                </div>
              </motion.div>

              <div className="flex-1 overflow-y-auto px-4 py-6">
                {count === 0 ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center h-full text-center py-12"
                  >
                    <motion.div
                      animate={{
                        y: [0, -15, 0],
                        scale: [1, 1.1, 1],
                      }}
                      transition={{ duration: 3, repeat: Infinity }}
                      className="relative mb-6"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-violet-500 to-pink-500 rounded-full blur-xl opacity-30 animate-pulse" />
                      <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-violet-100 to-pink-100 dark:from-violet-900/40 dark:to-pink-900/40 flex items-center justify-center shadow-lg">
                        <ListChecks className="w-10 h-10 text-violet-600 dark:text-violet-400" />
                      </div>
                    </motion.div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 bg-gradient-to-r from-violet-600 to-pink-500 bg-clip-text text-transparent">
                      Start Building Your List
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300 max-w-xs font-medium">
                      Browse creators and click "Add" to save your favorite influencers here.
                    </p>
                  </motion.div>
                ) : (
                  <Reorder.Group
                    axis="y"
                    values={selectedProfiles}
                    onReorder={useProfileStore.getState().reorderProfiles}
                    className="space-y-2 list-none p-0 m-0"
                  >
                    {selectedProfiles.map((profile) => (
                      <SelectedProfileItem
                        key={profile.user_id}
                        profile={profile}
                      />
                    ))}
                  </Reorder.Group>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
