import { memo } from "react";
import { Users } from "lucide-react";
import { motion } from "framer-motion";
import type { PlatformFilterType, UserProfileSummary } from "@/types";
import { ProfileCard } from "./ProfileCard";

interface ProfileListProps {
  profiles: UserProfileSummary[];
  platform: PlatformFilterType;
  onProfileClick: (username: string) => void;
}

const listVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};



function ProfileListInner({
  profiles,
  platform,
  onProfileClick,
}: ProfileListProps) {
  if (profiles.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center justify-center py-20 text-center"
      >
        <motion.div
          animate={{
            y: [0, -15, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="relative mb-6"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-violet-500 to-pink-500 rounded-full blur-xl opacity-30 animate-pulse" />
          <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-violet-100 to-pink-100 dark:from-violet-900/40 dark:to-pink-900/40 flex items-center justify-center shadow-lg">
            <Users className="w-10 h-10 text-violet-600 dark:text-violet-400" />
          </div>
        </motion.div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 bg-gradient-to-r from-violet-600 to-pink-500 bg-clip-text text-transparent">
          No profiles found
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-300 max-w-sm font-medium">
          Try adjusting your search keywords or switching platforms to discover amazing creators!
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={listVariants}
      initial="hidden"
      animate="show"
      key={platform}
      className="space-y-3 pb-4"
    >
      {profiles.map((profile, idx) => (
        <ProfileCard
          key={profile.user_id}
          profile={profile}
          platform={profile.platform || (platform === "all" ? "instagram" : platform)}
          onProfileClick={onProfileClick}
          variants={{
            hidden: { opacity: 0, y: 20, scale: 0.9 },
            show: {
              opacity: 1,
              y: 0,
              scale: 1,
              transition: {
                duration: 0.4,
                delay: idx * 0.05,
                type: "spring",
                stiffness: 100,
              }
            },
          }}
        />
      ))}
    </motion.div>
  );
}

export const ProfileList = memo(ProfileListInner);
