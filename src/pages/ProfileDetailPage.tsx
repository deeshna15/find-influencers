import { useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import {
  ArrowLeft,
  ExternalLink,
  Plus,
  Check,
  Users,
  MessageCircle,
  Heart,
  Eye,
  TrendingUp,
  FileText,
  BarChart3,
} from "lucide-react";
import { motion } from "framer-motion";
import clsx from "clsx";
import { Layout } from "@/components/layout/Layout";
import { VerifiedBadge } from "@/components/ui/VerifiedBadge";
import { StatCard } from "@/components/ui/StatCard";
import { Button } from "@/components/ui/Button";
import type { FullUserProfile, ProfileDetailResponse } from "@/types";
import { formatFollowers, formatEngagementRate } from "@/utils/formatters";
import { loadProfileByUsername } from "@/utils/profileLoader";
import { useProfileStore } from "@/store/useProfileStore";

export function ProfileDetailPage() {
  const { username } = useParams<{ username: string }>();
  const [searchParams] = useSearchParams();
  const platform = searchParams.get("platform") || "unknown";

  const [profileData, setProfileData] = useState<ProfileDetailResponse | null>(
    null
  );
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addProfile = useProfileStore((s) => s.addProfile);
  const removeProfile = useProfileStore((s) => s.removeProfile);
  const toggleSidebar = useProfileStore((s) => s.toggleSidebar);
  const selectedProfiles = useProfileStore((s) => s.selectedProfiles);

  useEffect(() => {
    if (!username) return;

    let cancelled = false;

    const loadProfile = async () => {
      try {
        const data = await loadProfileByUsername(username);
        if (!cancelled) {
          setProfileData(data);
          setLoaded(true);
        }
      } catch {
        if (!cancelled) {
          setError("Failed to load profile");
          setLoaded(true);
        }
      }
    };

    loadProfile();

    return () => {
      cancelled = true;
    };
  }, [username]);

  if (!username) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center py-16">
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            Invalid profile
          </p>
          <Link
            to="/"
            className="text-violet-600 dark:text-violet-400 hover:underline text-sm font-medium"
          >
            Back to search
          </Link>
        </div>
      </Layout>
    );
  }

  if (!loaded) {
    return (
      <Layout title={`@${username}`}>
        <div className="flex items-center justify-center py-16">
          <div className="flex items-center gap-3 text-gray-500 dark:text-gray-400">
            <svg
              className="animate-spin w-5 h-5"
              viewBox="0 0 24 24"
              fill="none"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
            Loading profile...
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !profileData) {
    return (
      <Layout title={`@${username}`}>
        <div className="flex flex-col items-center justify-center py-16">
          <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center mb-4">
            <span className="text-2xl">!</span>
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">
            Profile not found
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            {error || `Could not load profile details for ${username}`}
          </p>
          <Link
            to="/"
            className="text-violet-600 dark:text-violet-400 hover:underline text-sm font-medium"
          >
            Back to search
          </Link>
        </div>
      </Layout>
    );
  }

  const user: FullUserProfile = profileData.data.user_profile;
  const inList = selectedProfiles.some((p) => p.user_id === user.user_id);

  const handleAddToList = () => {
    if (inList) {
      removeProfile(user.user_id);
    } else {
      addProfile({
        user_id: user.user_id,
        username: user.username,
        url: user.url,
        picture: user.picture,
        fullname: user.fullname,
        is_verified: user.is_verified,
        followers: user.followers,
        engagements: user.engagements,
        engagement_rate: user.engagement_rate,
        handle: user.handle,
        avg_views: user.avg_views,
      });
      toggleSidebar();
    }
  };

  return (
    <Layout title={user.fullname}>
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors mb-6 bg-white/50 dark:bg-gray-800/50 px-4 py-2 rounded-xl backdrop-blur-sm"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to search
      </Link>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-2xl mx-auto"
      >
        <div className="glass-panel rounded-2xl p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
            <img
              src={user.picture}
              alt={`${user.fullname}'s avatar`}
              className="w-24 h-24 rounded-full ring-4 ring-gray-100 dark:ring-gray-700 shadow-lg"
            />
            <div className="flex-1 text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-1.5">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  @{user.username}
                </h2>
                <VerifiedBadge verified={user.is_verified} size="md" />
              </div>
              <p className="text-gray-500 dark:text-gray-400 mt-0.5">
                {user.fullname}
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 capitalize">
                {platform}
              </p>

              {user.description && (
                <p className="mt-3 text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                  {user.description}
                </p>
              )}

              <div className="mt-4 flex flex-wrap gap-2">
                {user.url && (
                  <a
                    href={user.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={clsx(
                      "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium",
                      "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300",
                      "hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    )}
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    View on platform
                  </a>
                )}
                <Button
                  onClick={handleAddToList}
                  variant={inList ? "secondary" : "primary"}
                  size="sm"
                >
                  {inList ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      In List
                    </>
                  ) : (
                    <>
                      <Plus className="w-3.5 h-3.5" />
                      Add to List
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-3">
          <StatCard
            label="Followers"
            value={formatFollowers(user.followers)}
            icon={<Users className="w-4 h-4" />}
          />
          <StatCard
            label="Engagement Rate"
            value={formatEngagementRate(user.engagement_rate)}
            icon={<TrendingUp className="w-4 h-4" />}
          />
          {user.posts_count !== undefined && (
            <StatCard
              label="Posts"
              value={user.posts_count.toLocaleString()}
              icon={<FileText className="w-4 h-4" />}
            />
          )}
          {user.avg_likes !== undefined && (
            <StatCard
              label="Avg Likes"
              value={formatFollowers(user.avg_likes)}
              icon={<Heart className="w-4 h-4" />}
            />
          )}
          {user.avg_comments !== undefined && (
            <StatCard
              label="Avg Comments"
              value={user.avg_comments.toLocaleString()}
              icon={<MessageCircle className="w-4 h-4" />}
            />
          )}
          {user.avg_views !== undefined && user.avg_views > 0 && (
            <StatCard
              label="Avg Views"
              value={formatFollowers(user.avg_views)}
              icon={<Eye className="w-4 h-4" />}
            />
          )}
          {user.engagements !== undefined && (
            <StatCard
              label="Engagements"
              value={formatFollowers(user.engagements)}
              icon={<BarChart3 className="w-4 h-4" />}
            />
          )}
        </div>
      </motion.div>
    </Layout>
  );
}
