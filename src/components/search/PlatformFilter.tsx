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
    <div className="mb-8 space-y-5">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-wrap gap-3 justify-center bg-white/40 dark:bg-gray-800/40 p-2 rounded-3xl w-fit mx-auto border border-violet-200/50 dark:border-violet-800/30 backdrop-blur-xl shadow-lg"
      >
        {PLATFORMS.map((p, idx) => (
          <motion.button
            key={p}
            type="button"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 + idx * 0.05 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onChange(p)}
            className={clsx(
              "relative flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-bold",
              "transition-all duration-300 ease-out outline-none",
              selected === p
                ? "text-white"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
            )}
          >
            {selected === p && (
              <motion.div
                layoutId="activePlatform"
                className="absolute inset-0 bg-gradient-to-r from-violet-600 to-pink-500 rounded-2xl shadow-lg shadow-violet-500/30"
                transition={{ type: "spring", bounce: 0.3, duration: 0.5 }}
              />
            )}
            <span className="relative z-10 text-lg">{PLATFORM_ICONS[p]}</span>
            <span className="relative z-10">{getPlatformLabel(p)}</span>
          </motion.button>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="relative max-w-md mx-auto"
        animate={{ scale: isSearchFocused ? 1.05 : 1 }}
      >
        <motion.div
          animate={{
            boxShadow: isSearchFocused
              ? "0 0 30px rgba(139, 92, 246, 0.4)"
              : "0 0 10px rgba(139, 92, 246, 0.1)"
          }}
          transition={{ duration: 0.3 }}
          className="relative"
        >
          <Search className={clsx(
            "absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-all duration-300",
            isSearchFocused ? "text-violet-600 dark:text-violet-400" : "text-gray-500 dark:text-gray-400"
          )} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
            placeholder="Search creators by username or name..."
            className={clsx(
              "w-full pl-12 pr-12 py-3.5 rounded-2xl text-sm font-medium",
              "bg-white/70 dark:bg-gray-800/70 border-2 transition-all duration-300 outline-none",
              "text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400",
              isSearchFocused
                ? "border-violet-500 dark:border-violet-600 shadow-lg shadow-violet-500/20"
                : "border-gray-300 dark:border-gray-600 hover:border-violet-300 dark:hover:border-violet-700"
            )}
          />
          <AnimatePresence>
            {searchQuery && (
              <motion.button
                initial={{ opacity: 0, scale: 0.6, rotate: -90 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                exit={{ opacity: 0, scale: 0.6, rotate: 90 }}
                transition={{ duration: 0.2 }}
                onClick={() => onSearchChange("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
                aria-label="Clear search"
              >
                <X className="w-5 h-5" />
              </motion.button>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </div>
  );
}

export const PlatformFilter = memo(PlatformFilterInner);
