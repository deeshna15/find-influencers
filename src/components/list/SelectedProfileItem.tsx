import { memo } from "react";
import { Trash2 } from "lucide-react";
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
    <div
      className={clsx(
        "flex items-center gap-3 p-3 rounded-xl",
        "bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800",
        "group transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-800"
      )}
    >
      <img
        src={profile.picture}
        alt={`${profile.fullname}'s avatar`}
        className="w-10 h-10 rounded-full ring-1 ring-gray-200 dark:ring-gray-700"
        loading="lazy"
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1">
          <span className="text-sm font-medium text-gray-900 dark:text-white truncate">
            @{profile.username}
          </span>
          <VerifiedBadge verified={profile.is_verified} />
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
          {profile.fullname}
        </p>
        <p className="text-[10px] text-gray-400 dark:text-gray-500">
          {formatFollowers(profile.followers)} followers
        </p>
      </div>
      <button
        onClick={() => removeProfile(profile.user_id)}
        className={clsx(
          "p-1.5 rounded-lg text-gray-400",
          "opacity-0 group-hover:opacity-100",
          "hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500",
          "transition-all duration-200",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:opacity-100"
        )}
        aria-label={`Remove ${profile.fullname} from list`}
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
}

export const SelectedProfileItem = memo(SelectedProfileItemInner);
