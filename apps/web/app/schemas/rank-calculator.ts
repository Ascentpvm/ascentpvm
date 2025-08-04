import { z } from 'zod';
import {
  CombatAchievementTier,
  DiaryLocation,
  DiaryTier,
  TzHaarCape,
} from './osrs';

export const RankStructure = z.enum([
  'Clog',
  'Standard',
  'Deputy Owner',
  'Seren',
]);

export type RankStructure = z.infer<typeof RankStructure>;

export const AchievementDiaryMap = z.record(DiaryLocation, DiaryTier);

export type AchievementDiaryMap = z.infer<typeof AchievementDiaryMap>;

export interface CommonPointCalculatorData {
  pointsAwarded: number;
  pointsAwardedPercentage: number;
  pointsRemaining: number;
}

export interface BonusPointCalculatorData {
  bonusPointsAwarded: number;
}

export const RankSubmissionStatus = z.enum(['Pending', 'Approved', 'Rejected']);

export type RankSubmissionStatus = z.infer<typeof RankSubmissionStatus>;

export const RankSubmissionMetadata = z.object({
  status: RankSubmissionStatus,
  discordMessageId: z.string(),
  submittedBy: z.string(),
  submittedAt: z.date(),
  actionedBy: z.string().nullable(),
  hasTemplePlayerStats: z.boolean(),
  hasTempleCollectionLog: z.boolean(),
  isTempleCollectionLogOutdated: z.boolean(),
  hasWikiSyncData: z.boolean(),
  automaticApproval: z.boolean().optional(),
});

export type RankSubmissionMetadata = z.infer<typeof RankSubmissionMetadata>;

export const RankSubmissionDiff = z.object({
  achievementDiaries: AchievementDiaryMap.nullable(),
  acquiredItems: z.array(z.string()).nullable(),
  combatAchievementTier: CombatAchievementTier.nullable(),
  totalLevel: z.number().nullable(),
  collectionLogCount: z.number().nullable(),
  tzhaarCape: TzHaarCape.nullable(),
  hasBloodTorva: z.boolean().nullable(),
  hasDizanasQuiver: z.boolean().nullable(),
  hasAchievementDiaryCape: z.boolean().nullable(),
});

export type RankSubmissionDiff = z.infer<typeof RankSubmissionDiff>;

export const PvmRankStructure = z.enum([
  'Standard',
  'Deputy Owner',
  'Seren',
]);

export type PvmRankStructure = z.infer<typeof PvmRankStructure>;

export const CollectionLogRankStructure = z.enum([
  'Beginner',
  'Intermediate',
  'Advanced',
  'Expert',
  'Master',
]);

export type CollectionLogRankStructure = z.infer<typeof CollectionLogRankStructure>;
