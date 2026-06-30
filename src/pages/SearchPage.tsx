import { useState, useCallback, useMemo } from "react";
import type { Platform } from "@/types";
import { Layout } from "@/components/layout/Layout";
import { PlatformFilter } from "@/components/search/PlatformFilter";
import { ProfileList } from "@/components/profile/ProfileList";
import { extractProfiles, filterProfiles } from "@/utils/dataHelpers";
import { useDebounce } from "@/hooks/useDebounce";

export function SearchPage() {
  const [platform, setPlatform] = useState<Platform>("instagram");
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  const allProfiles = useMemo(
    () => extractProfiles(platform),
    [platform]
  );

  const filtered = useMemo(
    () => filterProfiles(allProfiles, debouncedSearchQuery),
    [allProfiles, debouncedSearchQuery]
  );

  const handlePlatformChange = useCallback((p: Platform) => {
    setPlatform(p);
    setSearchQuery("");
  }, []);

  const handleSearchChange = useCallback((value: string) => {
    setSearchQuery(value);
  }, []);

  const handleProfileClick = useCallback(() => {}, []);

  return (
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

      <p className="text-xs text-gray-400 dark:text-gray-500 mb-4 text-center">
        Showing{" "}
        <span className="font-medium text-gray-600 dark:text-gray-300">
          {filtered.length}
        </span>{" "}
        of {allProfiles.length} on{" "}
        <span className="font-medium text-gray-600 dark:text-gray-300 capitalize">
          {platform}
        </span>
      </p>

      <ProfileList
        profiles={filtered}
        platform={platform}
        onProfileClick={handleProfileClick}
      />
    </Layout>
  );
}
