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
              "bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl shadow-2xl border-l border-white/20 dark:border-gray-800"
            )}
            role="dialog"
            aria-modal="true"
            aria-label="Selected profiles"
          >
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-800">
                <div className="flex items-center gap-3">
                  <ListChecks className="w-5 h-5 text-violet-600" />
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    My List
                  </h2>
                  {count > 0 && (
                    <span className="px-2 py-0.5 text-xs font-medium bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 rounded-full">
                      {count}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {count > 0 && (
                    <button
                      onClick={clearList}
                      className={clsx(
                        "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium",
                        "text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20",
                        "transition-colors duration-200"
                      )}
                      aria-label="Clear all profiles from list"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Clear
                    </button>
                  )}
                  <button
                    ref={closeButtonRef}
                    onClick={() => setSidebarOpen(false)}
                    className={clsx(
                      "p-2 rounded-lg text-gray-500 dark:text-gray-400",
                      "hover:bg-gray-100 dark:hover:bg-gray-800",
                      "transition-colors duration-200",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
                    )}
                    aria-label="Close sidebar"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto px-4 py-4">
                {count === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center py-12">
                    <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
                      <ListChecks className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                    </div>
                    <h3 className="text-base font-medium text-gray-900 dark:text-white mb-1">
                      No profiles selected
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs">
                      Browse profiles and click "Add" to build your influencer list.
                    </p>
                  </div>
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
