import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { UserProfileSummary } from "@/types";

interface ProfileListState {
  selectedProfiles: UserProfileSummary[];
  sidebarOpen: boolean;
  addProfile: (profile: UserProfileSummary) => void;
  removeProfile: (userId: string) => void;
  clearList: () => void;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  isInList: (userId: string) => boolean;
  reorderProfiles: (profiles: UserProfileSummary[]) => void;
}

export const useProfileStore = create<ProfileListState>()(
  persist(
    (set, get) => ({
      selectedProfiles: [],
      sidebarOpen: false,

      addProfile: (profile) =>
        set((state) => {
          if (state.selectedProfiles.some((p) => p.user_id === profile.user_id)) {
            return state;
          }
          return { selectedProfiles: [...state.selectedProfiles, profile] };
        }),

      removeProfile: (userId) =>
        set((state) => ({
          selectedProfiles: state.selectedProfiles.filter(
            (p) => p.user_id !== userId
          ),
        })),

      clearList: () => set({ selectedProfiles: [] }),

      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),

      setSidebarOpen: (open) => set({ sidebarOpen: open }),

      isInList: (userId) => get().selectedProfiles.some((p) => p.user_id === userId),

      reorderProfiles: (profiles) => set({ selectedProfiles: profiles }),
    }),
    {
      name: "selected-profiles",
      partialize: (state) => ({ selectedProfiles: state.selectedProfiles }),
    }
  )
);
