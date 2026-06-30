import { memo, useCallback, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Plus, Check } from "lucide-react";
import clsx from "clsx";
import type { Platform, UserProfileSummary } from "@/types";
import { VerifiedBadge } from "@/components/ui/VerifiedBadge";
import { formatFollowers } from "@/utils/formatters";
import { useProfileStore } from "@/store/useProfileStore";
import { useToastStore } from "@/store/useToastStore";

interface ProfileCardProps {
  profile: UserProfileSummary;
  platform: Platform;
  onProfileClick?: (username: string) => void;
  variants?: any;
}

function ProfileCardInner({
  profile,
  platform,
  onProfileClick,
  variants,
}: ProfileCardProps) {
  const navigate = useNavigate();
  const addProfile = useProfileStore((s) => s.addProfile);
  const removeProfile = useProfileStore((s) => s.removeProfile);
  const inList = useProfileStore((s) => s.selectedProfiles.some((p) => p.user_id === profile.user_id));
  const addToast = useToastStore((s) => s.addToast);

  const cardRef = useRef<HTMLElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 20, stiffness: 300 };
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [5, -5]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-5, 5]), springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseXPos = e.clientX - rect.left;
    const mouseYPos = e.clientY - rect.top;
    mouseX.set(mouseXPos / width - 0.5);
    mouseY.set(mouseYPos / height - 0.5);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    mouseX.set(0);
    mouseY.set(0);
  };

  const handleCardClick = useCallback(() => {
    if (onProfileClick) onProfileClick(profile.username);
    navigate(`/profile/${profile.username}?platform=${platform}`);
  }, [navigate, profile.username, platform, onProfileClick]);

  const handleAddToList = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (inList) {
        removeProfile(profile.user_id);
        addToast(`Removed ${profile.fullname} from your list`, "info");
      } else {
        addProfile(profile);
        addToast(`Added ${profile.fullname} to your list`, "success");
      }
    },
    [inList, addProfile, removeProfile, profile, addToast]
  );

  return (
    <motion.article
      ref={cardRef as any}
      variants={variants || {
        hidden: { opacity: 0, y: 10, scale: 0.9 },
        show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4, type: "spring" } },
      }}
      initial={variants ? undefined : "hidden"}
      animate={variants ? undefined : "show"}
      whileHover={{ scale: 1.03, y: -5 }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onClick={handleCardClick}
      style={{
        rotateX,
        rotateY,
        transformPerspective: 1000,
      }}
      className={clsx(
        "relative overflow-hidden group flex items-center gap-4 p-5 rounded-2xl cursor-pointer glass-card hover-lift",
        "transition-all duration-300 ease-out border border-white/60 dark:border-gray-700/60",
        isHovered && "shadow-2xl shadow-violet-500/20 dark:shadow-violet-900/30"
      )}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleCardClick();
        }
      }}
      aria-label={`View profile of ${profile.fullname}`}
    >
      {/* Gradient Border Animation */}
      <motion.div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{
          background: "linear-gradient(135deg, rgba(139, 92, 246, 0.3), rgba(236, 72, 153, 0.2))",
          borderRadius: "inherit",
        }}
      />

      {/* Interactive Glow Effect */}
      {isHovered && (
        <motion.div
          className="pointer-events-none absolute inset-0 z-0"
          style={{
            background: useTransform(
              [mouseX, mouseY],
              ([x, y]) =>
                `radial-gradient(200px circle at ${(x + 0.5) * 100}% ${(y + 0.5) * 100}%, rgba(139, 92, 246, 0.25), transparent 70%)`
            ),
          }}
        />
      )}

      <motion.div
        whileHover={{ scale: 1.15, rotate: 5 }}
        transition={{ type: "spring", stiffness: 300 }}
        className="relative z-10"
      >
        <img
          src={profile.picture}
          alt={`${profile.fullname}'s avatar`}
          className="w-16 h-16 rounded-full ring-3 ring-white dark:ring-gray-800 object-cover shadow-lg"
          loading="lazy"
        />
        {profile.is_verified && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -bottom-1 -right-1 bg-gradient-to-r from-violet-600 to-pink-500 p-0.5 rounded-full"
          >
            <Check className="w-4 h-4 text-white" />
          </motion.div>
        )}
      </motion.div>

      <div className="relative z-10 flex-1 text-left min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-bold text-gray-900 dark:text-white truncate text-lg group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
            @{profile.username}
          </span>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-300 truncate font-medium">
          {profile.fullname}
        </p>
        <motion.p
          initial={{ opacity: 0.7 }}
          whileHover={{ opacity: 1 }}
          className="text-xs text-gray-500 dark:text-gray-400 mt-1 font-semibold"
        >
          {formatFollowers(profile.followers)} followers
        </motion.p>
      </div>

      <motion.button
        whileHover={{ scale: 1.1, rotate: 5 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleAddToList}
        className={clsx(
          "relative z-10 flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold",
          "transition-all duration-300 shadow-md",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
          inList
            ? "bg-gradient-to-r from-violet-600 to-pink-500 text-white shadow-lg shadow-pink-500/40 hover:shadow-pink-500/60"
            : "bg-white/70 dark:bg-gray-700/70 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 hover:bg-gradient-to-r hover:from-violet-500 hover:to-pink-500 hover:text-white hover:border-transparent hover:shadow-lg hover:shadow-violet-500/40"
        )}
        aria-label={inList ? `Remove ${profile.fullname} from list` : `Add ${profile.fullname} to list`}
      >
        <motion.div
          animate={inList ? { scale: [1, 1.3, 1] } : { scale: 1 }}
          transition={{ duration: 0.4 }}
        >
          {inList ? (
            <Check className="w-4 h-4" />
          ) : (
            <Plus className="w-4 h-4" />
          )}
        </motion.div>
        <span className="hidden sm:inline">
          {inList ? "In List" : "Add"}
        </span>
      </motion.button>
    </motion.article>
  );
}

export const ProfileCard = memo(ProfileCardInner);
