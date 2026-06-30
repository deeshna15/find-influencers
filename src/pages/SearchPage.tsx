import { useState, useCallback, useMemo } from "react";
import type { Platform } from "@/types";
import { Layout } from "@/components/layout/Layout";
import { PlatformFilter } from "@/components/search/PlatformFilter";
import { ProfileList } from "@/components/profile/ProfileList";
import { extractProfiles, filterProfiles } from "@/utils/dataHelpers";
import { useDebounce } from "@/hooks/useDebounce";
import { motion } from "framer-motion";
import { SlidersHorizontal, CheckCircle2 } from "lucide-react";
import clsx from "clsx";

export type SortOption = "default" | "followers_desc" | "followers_asc";

export function SearchPage() {
  const [platform, setPlatform] = useState<Platform>("instagram");
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  
  const [sortBy, setSortBy] = useState<SortOption>("default");
  const [verifiedOnly, setVerifiedOnly] = useState(false);

  const allProfiles = useMemo(
    () => extractProfiles(platform),
    [platform]
  );

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

  const handlePlatformChange = useCallback((p: Platform) => {
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
      <Layout title="Find Influencers">
        <p className="text-gray-500 dark:text-gray-400 mb-6 text-center text-sm sm:text-base">
          Browse top creators across social platforms
        </p>

        <PlatformFilter
          selected={platform}
          onChange={handlePlatformChange}
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
        />

        {/* Sort and Filter Controls */}
        <div className="max-w-xl mx-auto mb-6 flex flex-wrap items-center justify-center gap-6 px-4">
          <div className="flex items-center gap-2 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
             <SlidersHorizontal className="w-4 h-4 text-violet-500" />
             <select
               value={sortBy}
               onChange={(e) => setSortBy(e.target.value as SortOption)}
               className="bg-transparent text-sm text-gray-700 dark:text-gray-200 font-medium focus:outline-none cursor-pointer hover:text-violet-600 transition-colors"
             >
               <option value="default" className="text-gray-900">Default Order</option>
               <option value="followers_desc" className="text-gray-900">Followers: High to Low</option>
               <option value="followers_asc" className="text-gray-900">Followers: Low to High</option>
             </select>
          </div>
          
          <button
            onClick={() => setVerifiedOnly(prev => !prev)}
            className={clsx(
              "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 border shadow-sm backdrop-blur-sm",
              verifiedOnly
                ? "bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300 border-violet-200 dark:border-violet-800 scale-[1.02]"
                : "bg-white/50 dark:bg-gray-800/50 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:bg-white dark:hover:bg-gray-800"
            )}
          >
            <CheckCircle2 className={clsx("w-4 h-4 transition-colors", verifiedOnly ? "text-violet-600 dark:text-violet-400" : "text-gray-400")} />
            Verified Only
          </button>
        </div>

        <p className="text-xs text-gray-400 dark:text-gray-500 mb-4 text-center">
          Showing{" "}
          <span className="font-medium text-gray-600 dark:text-gray-300">
            {filteredAndSorted.length}
          </span>{" "}
          of {allProfiles.length} on{" "}
          <span className="font-medium text-gray-600 dark:text-gray-300 capitalize">
            {platform}
          </span>
        </p>

        <ProfileList
          profiles={filteredAndSorted}
          platform={platform}
          onProfileClick={handleProfileClick}
        />
      </Layout>
    </motion.div>
  );
}
