import { memo, useState } from "react";
import { Search, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";
import type { Platform } from "@/types";
import { PLATFORMS, getPlatformLabel } from "@/utils/dataHelpers";

const PLATFORM_ICONS: Record<Platform, string> = {
  instagram: "📸",
  youtube: "▶️",
  tiktok: "🎵",
};

interface PlatformFilterProps {
  selected: Platform;
  onChange: (platform: Platform) => void;
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

function PlatformFilterInner({
  selected,
  onChange,
  searchQuery,
  onSearchChange,
}: PlatformFilterProps) {
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  return (
    <div className="mb-6 space-y-4">
      <div className="flex flex-wrap gap-2 justify-center bg-gray-100/50 dark:bg-gray-800/50 p-1.5 rounded-2xl w-fit mx-auto border border-gray-200 dark:border-gray-700/50 backdrop-blur-sm">
        {PLATFORMS.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => onChange(p)}
            className={clsx(
              "relative flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium",
              "transition-all duration-200 ease-out outline-none",
              selected === p
                ? "text-violet-700 dark:text-white"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
            )}
          >
            {selected === p && (
              <motion.div
                layoutId="activePlatform"
                className="absolute inset-0 bg-white dark:bg-gray-700 rounded-xl shadow-sm border border-gray-200/50 dark:border-gray-600/50"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            <span className="relative z-10 text-base">{PLATFORM_ICONS[p]}</span>
            <span className="relative z-10">{getPlatformLabel(p)}</span>
          </button>
        ))}
      </div>

      <motion.div 
        className="relative max-w-md mx-auto"
        animate={{ scale: isSearchFocused ? 1.02 : 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <Search className={clsx(
          "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors",
          isSearchFocused ? "text-violet-500" : "text-gray-400"
        )} />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          onFocus={() => setIsSearchFocused(true)}
          onBlur={() => setIsSearchFocused(false)}
          placeholder="Search by username or name..."
          className={clsx(
            "w-full pl-10 pr-10 py-2.5 rounded-xl text-sm",
            "bg-white dark:bg-gray-800 border",
            "text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500",
            "transition-all duration-200 outline-none",
            isSearchFocused 
              ? "border-violet-300 dark:border-violet-600 ring-4 ring-violet-500/10 shadow-sm" 
              : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
          )}
        />
        <AnimatePresence>
          {searchQuery && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8, rotate: -90 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.8, rotate: 90 }}
              transition={{ duration: 0.15 }}
              onClick={() => onSearchChange("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              aria-label="Clear search"
            >
              <X className="w-4 h-4" />
            </motion.button>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

export const PlatformFilter = memo(PlatformFilterInner);
