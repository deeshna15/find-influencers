import { describe, it, expect, beforeEach } from 'vitest';
import { useProfileStore } from './useProfileStore';
import type { UserProfileSummary } from '@/types';

const mockProfile: UserProfileSummary = {
  user_id: '1',
  username: 'testuser',
  fullname: 'Test User',
  picture: 'test.jpg',
  is_verified: true,
  followers: 1000,
  engagements: 500,
  engagement_rate: 5,
  url: 'https://test.com',
  handle: '@testuser',
};

describe('useProfileStore', () => {
  beforeEach(() => {
    useProfileStore.setState({
      selectedProfiles: [],
      sidebarOpen: false,
    });
  });

  it('should add a profile', () => {
    const { addProfile } = useProfileStore.getState();
    addProfile(mockProfile);
    
    expect(useProfileStore.getState().selectedProfiles).toHaveLength(1);
    expect(useProfileStore.getState().selectedProfiles[0]).toEqual(mockProfile);
  });

  it('should prevent duplicate entries', () => {
    const { addProfile } = useProfileStore.getState();
    addProfile(mockProfile);
    addProfile(mockProfile); // Attempt duplicate
    
    expect(useProfileStore.getState().selectedProfiles).toHaveLength(1);
  });

  it('should remove a profile', () => {
    const { addProfile, removeProfile } = useProfileStore.getState();
    addProfile(mockProfile);
    removeProfile(mockProfile.user_id);
    
    expect(useProfileStore.getState().selectedProfiles).toHaveLength(0);
  });

  it('should toggle sidebar', () => {
    const { toggleSidebar } = useProfileStore.getState();
    expect(useProfileStore.getState().sidebarOpen).toBe(false);
    
    toggleSidebar();
    expect(useProfileStore.getState().sidebarOpen).toBe(true);
    
    toggleSidebar();
    expect(useProfileStore.getState().sidebarOpen).toBe(false);
  });
});
