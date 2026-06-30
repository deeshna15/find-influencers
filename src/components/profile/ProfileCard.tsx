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
        hidden: { opacity: 0, y: 10 },
        show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
      }}
      initial={variants ? undefined : "hidden"}
      animate={variants ? undefined : "show"}
      whileHover={{ scale: 1.01 }}
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
        "relative overflow-hidden group flex items-center gap-4 p-4 rounded-2xl cursor-pointer glass-card",
        "transition-colors duration-200 ease-out border border-transparent dark:border-white/5"
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
      {/* Glow Effect */}
      {isHovered && (
        <motion.div
          className="pointer-events-none absolute inset-0 z-0 opacity-50"
          style={{
            background: useTransform(
              [mouseX, mouseY],
              ([x, y]) =>
                `radial-gradient(150px circle at ${(x + 0.5) * 100}% ${(y + 0.5) * 100}%, rgba(139, 92, 246, 0.15), transparent 70%)`
            ),
          }}
        />
      )}

      <img
        src={profile.picture}
        alt={`${profile.fullname}'s avatar`}
        className="relative z-10 w-12 h-12 rounded-full ring-2 ring-gray-100 dark:ring-gray-700 group-hover:ring-violet-200 dark:group-hover:ring-violet-800 transition-all"
        loading="lazy"
      />

      <div className="relative z-10 flex-1 text-left min-w-0">
        <div className="flex items-center gap-1">
          <span className="font-semibold text-gray-900 dark:text-white truncate">
            @{profile.username}
          </span>
          <VerifiedBadge verified={profile.is_verified} />
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
          {profile.fullname}
        </p>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
          {formatFollowers(profile.followers)} followers
        </p>
      </div>

      <button
        onClick={handleAddToList}
        className={clsx(
          "relative z-10 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium",
          "transition-all duration-200",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500",
          inList
            ? "bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400"
            : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-violet-100 dark:hover:bg-violet-900/30 hover:text-violet-600 dark:hover:text-violet-400"
        )}
        aria-label={inList ? `Remove ${profile.fullname} from list` : `Add ${profile.fullname} to list`}
      >
        {inList ? (
          <>
            <Check className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">In List</span>
          </>
        ) : (
          <>
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Add</span>
          </>
        )}
      </button>
    </motion.article>
  );
}

export const ProfileCard = memo(ProfileCardInner);
