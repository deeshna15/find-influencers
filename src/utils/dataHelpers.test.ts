import { describe, it, expect } from 'vitest';
import { filterProfiles } from './dataHelpers';
import type { UserProfileSummary } from '@/types';

const mockProfiles: UserProfileSummary[] = [
  {
    user_id: '1',
    username: 'alice',
    fullname: 'Alice Smith',
    picture: '',
    is_verified: true,
    followers: 100,
  } as UserProfileSummary,
  {
    user_id: '2',
    username: 'bob',
    fullname: 'Bob Jones',
    picture: '',
    is_verified: false,
    followers: 200,
  } as UserProfileSummary,
];

describe('filterProfiles', () => {
  it('returns all profiles when query is empty', () => {
    const result = filterProfiles(mockProfiles, '');
    expect(result).toHaveLength(2);
  });

  it('filters by username (case-insensitive)', () => {
    const result = filterProfiles(mockProfiles, 'ALICE');
    expect(result).toHaveLength(1);
    expect(result[0].username).toBe('alice');
  });

  it('filters by fullname (case-insensitive)', () => {
    const result = filterProfiles(mockProfiles, 'jones');
    expect(result).toHaveLength(1);
    expect(result[0].fullname).toBe('Bob Jones');
  });

  it('returns empty array when no match is found', () => {
    const result = filterProfiles(mockProfiles, 'charlie');
    expect(result).toHaveLength(0);
  });

  it('filters by platform name (case-insensitive)', () => {
    const profilesWithPlatforms: UserProfileSummary[] = [
      ...mockProfiles,
      {
        user_id: '3',
        username: 'charlie',
        fullname: 'Charlie Brown',
        picture: '',
        is_verified: false,
        followers: 300,
        platform: 'youtube',
      } as UserProfileSummary,
      {
        user_id: '4',
        username: 'diana',
        fullname: 'Diana Ross',
        picture: '',
        is_verified: true,
        followers: 400,
        platform: 'instagram',
      } as UserProfileSummary,
    ];
    const result = filterProfiles(profilesWithPlatforms, 'youtube');
    expect(result).toHaveLength(1);
    expect(result[0].username).toBe('charlie');

    const resultInsta = filterProfiles(profilesWithPlatforms, 'INSTAGRAM');
    expect(resultInsta).toHaveLength(1);
    expect(resultInsta[0].username).toBe('diana');
  });
});
