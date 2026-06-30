import { memo } from "react";
import { Trash2, GripVertical } from "lucide-react";
import { Reorder, motion } from "framer-motion";
import clsx from "clsx";
import type { UserProfileSummary } from "@/types";
import { useProfileStore } from "@/store/useProfileStore";
import { VerifiedBadge } from "@/components/ui/VerifiedBadge";
import { formatFollowers } from "@/utils/formatters";

interface SelectedProfileItemProps {
  profile: UserProfileSummary;
}

function SelectedProfileItemInner({ profile }: SelectedProfileItemProps) {
  const removeProfile = useProfileStore((s) => s.removeProfile);

  return (
    <Reorder.Item
      value={profile}
      className={clsx(
        "relative flex items-center gap-3 p-4 rounded-2xl",
        "bg-white/70 dark:bg-gray-800/60 backdrop-blur-lg border border-white/60 dark:border-gray-700/60",
        "group transition-all duration-300 hover:shadow-lg hover:shadow-violet-500/20 dark:hover:shadow-violet-900/20",
        "cursor-grab active:cursor-grabbing overflow-hidden"
      )}
    >
      {/* Hover gradient background */}
      <motion.div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{
          background: "linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(236, 72, 153, 0.05))",
        }}
      />

      <motion.div
        whileHover={{ scale: 1.2 }}
        className="relative text-violet-400 dark:text-violet-500 opacity-0 group-hover:opacity-100 transition-all flex-shrink-0"
      >
        <GripVertical className="w-5 h-5" />
      </motion.div>

      <motion.img
        whileHover={{ scale: 1.15 }}
        src={profile.picture}
        alt={`${profile.fullname}'s avatar`}
        className="relative w-12 h-12 rounded-full ring-2 ring-white dark:ring-gray-800 pointer-events-none object-cover shadow-md"
        loading="lazy"
      />

      <div className="relative flex-1 min-w-0 pointer-events-none">
        <div className="flex items-center gap-1.5">
          <span className="text-sm font-bold text-gray-900 dark:text-white truncate group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
            @{profile.username}
          </span>
          <VerifiedBadge verified={profile.is_verified} />
        </div>
        <p className="text-xs text-gray-600 dark:text-gray-400 truncate font-medium">
          {profile.fullname}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-500 font-semibold">
          {formatFollowers(profile.followers)} followers
        </p>
      </div>

      <motion.button
        whileHover={{ scale: 1.15, rotate: -5 }}
        whileTap={{ scale: 0.85 }}
        onPointerDown={(e) => e.stopPropagation()}
        onClick={() => removeProfile(profile.user_id)}
        className={clsx(
          "relative p-2 rounded-lg text-gray-500 dark:text-gray-400",
          "opacity-0 group-hover:opacity-100",
          "hover:bg-red-100 dark:hover:bg-red-900/30 hover:text-red-600 dark:hover:text-red-400",
          "transition-all duration-200 cursor-pointer",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:opacity-100"
        )}
        aria-label={`Remove ${profile.fullname} from list`}
      >
        <Trash2 className="w-5 h-5" />
      </motion.button>
    </Reorder.Item>
  );
}

export const SelectedProfileItem = memo(SelectedProfileItemInner);
