import { motion } from "framer-motion";
import type { UserProfileSummary } from "@/types";

interface InfluencerBackgroundProps {
  profiles: UserProfileSummary[];
}

export function InfluencerBackground({ profiles }: InfluencerBackgroundProps) {
  const displayProfiles = profiles.slice(0, 12);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
      {/* Animated background grid of influencer cards */}
      <div className="absolute inset-0 overflow-hidden">
        {displayProfiles.map((profile, index) => (
          <motion.div
            key={profile.user_id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 0.08, scale: 1 }}
            transition={{
              delay: index * 0.05,
              duration: 0.6,
              ease: "easeOut",
            }}
            className="absolute"
            style={{
              left: `${(index % 4) * 25}%`,
              top: `${Math.floor(index / 4) * 30}%`,
            }}
          >
            <motion.div
              animate={{
                y: [0, -20, 0],
                x: [0, 10, 0],
              }}
              transition={{
                duration: 6 + index * 0.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="relative w-64 h-80 rounded-3xl overflow-hidden backdrop-blur-xl"
            >
              {/* Card background */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/10 dark:from-white/3 dark:to-white/5 border border-white/20 dark:border-white/10" />

              {/* Image container */}
              <div className="relative w-full h-full overflow-hidden">
                <img
                  src={profile.picture}
                  alt={profile.fullname}
                  className="w-full h-full object-cover blur-sm"
                />
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              </div>

              {/* Profile info overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                <p className="font-bold text-lg truncate">@{profile.username}</p>
                <p className="text-xs text-gray-300 opacity-75 truncate">
                  {profile.fullname}
                </p>
              </div>
            </motion.div>
          </motion.div>
        ))}
      </div>

      {/* Gradient overlay to fade edges */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white dark:to-gray-950 pointer-events-none" />
    </div>
  );
}
