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
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
    >
      <Layout title={user.fullname}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-bold text-white bg-gradient-to-r from-violet-600 to-pink-500 hover:from-violet-700 hover:to-pink-600 px-4 py-2.5 rounded-xl shadow-lg shadow-violet-500/30 transition-all hover:scale-105 active:scale-95 mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to search
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, type: "spring" }}
          className="max-w-2xl mx-auto"
        >
          <div className="glass-panel rounded-3xl p-6 sm:p-10 border border-white/60 dark:border-gray-700/60 shadow-2xl">
            <div className="flex flex-col sm:flex-row gap-8 items-center sm:items-start">
              <motion.div
                whileHover={{ scale: 1.05, rotate: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="relative"
              >
                <div className="absolute -inset-2 bg-gradient-to-r from-violet-500 via-pink-500 to-cyan-500 rounded-full opacity-0 group-hover:opacity-100 blur-xl transition-opacity" />
                <img
                  src={user.picture}
                  alt={`${user.fullname}'s avatar`}
                  className="relative w-32 h-32 rounded-full ring-4 ring-white dark:ring-gray-800 shadow-2xl object-cover"
                />
                {user.is_verified && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -bottom-2 -right-2 bg-gradient-to-r from-violet-600 to-pink-500 p-2 rounded-full shadow-lg"
                  >
                    <Check className="w-6 h-6 text-white" />
                  </motion.div>
                )}
              </motion.div>
              <div className="flex-1 text-center sm:text-left">
                <div className="flex items-center justify-center sm:justify-start gap-2.5 mb-2">
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-violet-600 via-pink-500 to-cyan-500 bg-clip-text text-transparent">
                    @{user.username}
                  </h2>
                </div>
                <p className="text-lg text-gray-700 dark:text-gray-200 font-semibold mt-1">
                  {user.fullname}
                </p>
                <p className="text-sm text-violet-600 dark:text-violet-400 mt-2 font-bold capitalize inline-block px-3 py-1 rounded-full bg-violet-100 dark:bg-violet-900/30">
                  {platform}
                </p>

                {user.description && (
                  <p className="mt-4 text-sm text-gray-600 dark:text-gray-300 leading-relaxed italic">
                    "{user.description}"
                  </p>
                )}

                <div className="mt-6 flex flex-wrap gap-3">
                  {user.url && (
                    <motion.a
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      href={user.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 shadow-lg shadow-cyan-500/30 transition-all"
                    >
                      <ExternalLink className="w-4 h-4" />
                      View on platform
                    </motion.a>
                  )}
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      onClick={handleAddToList}
                      variant={inList ? "secondary" : "primary"}
                      size="md"
                      className={inList ? "bg-gradient-to-r from-violet-600 to-pink-500 text-white shadow-lg shadow-pink-500/30" : ""}
                    >
                      {inList ? (
                        <>
                          <Check className="w-4 h-4" />
                          In My List
                        </>
                      ) : (
                        <>
                          <Plus className="w-4 h-4" />
                          Add to List
                        </>
                      )}
                    </Button>
                  </motion.div>
                </div>
              </div>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="mt-8 grid grid-cols-2 sm:grid-cols-3 gap-4"
          >
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
            >
              <StatCard
                label="Followers"
                value={formatFollowers(user.followers)}
                icon={<Users className="w-5 h-5" />}
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <StatCard
                label="Engagement Rate"
                value={formatEngagementRate(user.engagement_rate)}
                icon={<TrendingUp className="w-5 h-5" />}
              />
            </motion.div>
            {user.posts_count !== undefined && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45 }}
              >
                <StatCard
                  label="Posts"
                  value={user.posts_count.toLocaleString()}
                  icon={<FileText className="w-5 h-5" />}
                />
              </motion.div>
            )}
            {user.avg_likes !== undefined && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <StatCard
                  label="Avg Likes"
                  value={formatFollowers(user.avg_likes)}
                  icon={<Heart className="w-5 h-5" />}
                />
              </motion.div>
            )}
            {user.avg_comments !== undefined && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55 }}
              >
                <StatCard
                  label="Avg Comments"
                  value={user.avg_comments.toLocaleString()}
                  icon={<MessageCircle className="w-5 h-5" />}
                />
              </motion.div>
            )}
            {user.avg_views !== undefined && user.avg_views > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <StatCard
                  label="Avg Views"
                  value={formatFollowers(user.avg_views)}
                  icon={<Eye className="w-5 h-5" />}
                />
              </motion.div>
            )}
            {user.engagements !== undefined && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.65 }}
              >
                <StatCard
                  label="Engagements"
                  value={formatFollowers(user.engagements)}
                  icon={<BarChart3 className="w-5 h-5" />}
                />
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      </Layout>
    </motion.div>
  );
}
