import { useState, useCallback, useMemo } from "react";
import type { PlatformFilterType } from "@/types";
import { Layout } from "@/components/layout/Layout";
import { PlatformFilter } from "@/components/search/PlatformFilter";
import { ProfileList } from "@/components/profile/ProfileList";
import { InfluencerBackground } from "@/components/background/InfluencerBackground";
import { extractProfiles, filterProfiles } from "@/utils/dataHelpers";
import { useDebounce } from "@/hooks/useDebounce";
import { motion } from "framer-motion";
import { SlidersHorizontal, CheckCircle2 } from "lucide-react";
import clsx from "clsx";

export type SortOption = "default" | "followers_desc" | "followers_asc";

export function SearchPage() {
  const [platform, setPlatform] = useState<PlatformFilterType>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  
  const [sortBy, setSortBy] = useState<SortOption>("default");
  const [verifiedOnly, setVerifiedOnly] = useState(false);

  const allProfiles = useMemo(() => {
    if (platform === "all") {
      const instagram = extractProfiles("instagram");
      const youtube = extractProfiles("youtube");
      const tiktok = extractProfiles("tiktok");
      return [...instagram, ...youtube, ...tiktok];
    }
    return extractProfiles(platform);
  }, [platform]);

  const filteredAndSorted = useMemo(() => {
    let result = filterProfiles(allProfiles, debouncedSearchQuery);
    
    if (verifiedOnly) {
      result = result.filter(p => p.is_verified);
    }
    
    if (sortBy === "followers_desc") {
      result = [...result].sort((a, b) => b.followers - a.followers);
    } else if (sortBy === "followers_asc") {
      result = [...result].sort((a, b) => a.followers - b.followers);
    }
    
    return result;
  }, [allProfiles, debouncedSearchQuery, verifiedOnly, sortBy]);

  const handlePlatformChange = useCallback((p: PlatformFilterType) => {
    setPlatform(p);
    setSearchQuery("");
  }, []);

  const handleSearchChange = useCallback((value: string) => {
    setSearchQuery(value);
  }, []);

  const handleProfileClick = useCallback(() => {}, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
    >
      <InfluencerBackground profiles={allProfiles} />
      <Layout title="Find Influencers">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-gray-600 dark:text-gray-300 mb-8 text-center text-sm sm:text-base font-medium"
        >
          Discover amazing creators and influencers across your favorite social platforms
        </motion.p>

        <PlatformFilter
          selected={platform}
          onChange={handlePlatformChange}
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
        />

        {/* Sort and Filter Controls */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="max-w-2xl mx-auto mb-8 flex flex-wrap items-center justify-center gap-4 px-4"
        >
          <div className="flex items-center gap-2 bg-white/60 dark:bg-gray-800/60 backdrop-blur-lg px-4 py-3 rounded-2xl border border-violet-200/50 dark:border-violet-800/30 shadow-lg hover-lift">
             <SlidersHorizontal className="w-5 h-5 text-violet-600 dark:text-violet-400" />
             <select
               value={sortBy}
               onChange={(e) => setSortBy(e.target.value as SortOption)}
               className="bg-transparent text-sm text-gray-700 dark:text-gray-200 font-medium focus:outline-none cursor-pointer hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
             >
               <option value="default" className="text-gray-900">Default Order</option>
               <option value="followers_desc" className="text-gray-900">Followers: High to Low</option>
               <option value="followers_asc" className="text-gray-900">Followers: Low to High</option>
             </select>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setVerifiedOnly(prev => !prev)}
            className={clsx(
              "flex items-center gap-2 px-5 py-3 rounded-2xl text-sm font-bold transition-all duration-300 border shadow-lg backdrop-blur-lg",
              verifiedOnly
                ? "bg-gradient-to-r from-violet-500 to-pink-500 text-white border-violet-400 dark:border-violet-600 scale-105 shadow-violet-500/40"
                : "bg-white/60 dark:bg-gray-800/60 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:from-violet-500 hover:to-pink-500 hover-lift"
            )}
          >
            <CheckCircle2 className={clsx("w-5 h-5 transition-all", verifiedOnly ? "text-white animate-bounce" : "text-gray-400")} />
            Verified Only
          </motion.button>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-sm text-gray-500 dark:text-gray-400 mb-6 text-center font-semibold"
        >
          Showing{" "}
          <motion.span
            key={filteredAndSorted.length}
            initial={{ scale: 1.2, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="font-bold bg-gradient-to-r from-violet-600 to-pink-500 bg-clip-text text-transparent"
          >
            {filteredAndSorted.length}
          </motion.span>{" "}
          of {allProfiles.length} on{" "}
          <span className="font-bold bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent capitalize">
            {platform === "all" ? "all platforms" : platform}
          </span>
        </motion.p>

        <ProfileList
          profiles={filteredAndSorted}
          platform={platform}
          onProfileClick={handleProfileClick}
        />
      </Layout>
    </motion.div>
  );
}
