import { z } from 'zod';
import {
  ClueScrollTier,
  CombatAchievementTier,
  DiaryLocation,
  DiaryTier,
  maximumTotalLevel,
  minimumTotalLevel,
  TzHaarCape,
} from '@/app/schemas/osrs';
import { PlayerName } from '@/app/schemas/player';
import { RankStructure } from '@/app/schemas/rank-calculator';
import { Rank } from '@/config/enums';
import { pickBy } from 'lodash';
import { isAchievementDiaryCapeAchieved } from '../utils/is-achievement-diary-cape-achieved';

export const RankCalculatorSchema = z.object({
  acquiredItems: z
    .record(z.boolean().optional())
    .transform((data) => pickBy(data, (val) => val)),
  achievementDiaries: z.record(DiaryLocation, DiaryTier),
  joinDate: z.coerce.date(),
  collectionLogCount: z.coerce.number().nonnegative(),
  collectionLogTotal: z.coerce.number().nonnegative(),
  combatAchievementTier: CombatAchievementTier,
  ehb: z.coerce.number().nonnegative(),
  ehp: z.coerce.number().nonnegative(),
  ehc: z.coerce.number().nonnegative(),
  isCompletionist: z.boolean().default(false),
  totalLevel: z.coerce.number().min(minimumTotalLevel).max(maximumTotalLevel),
  playerName: PlayerName,
  rankStructure: RankStructure,
  rank: Rank,
  points: z.coerce.number().nonnegative(),
  proofLink: z.union([z.string().url().nullish(), z.literal('')]),
  tzhaarCape: TzHaarCape,
  tobKillCount: z.coerce.number().nonnegative().default(0),
  toaExpertKillCount: z.coerce.number().nonnegative().default(0),
  slayerLevel: z.coerce.number().nonnegative().default(1),
  chambersOfXericCmKillCount: z.coerce.number().nonnegative().default(0),
  hasBloodTorva: z.boolean().default(false),
  hasRadiantOathplate: z.boolean().default(false),
  hasDizanasQuiver: z.boolean().default(false),
  hasAchievementDiaryCape: z.boolean().default(false),
  combatBonusPoints: z.number().min(0).default(0),
  skillingBonusPoints: z.number().min(0).default(0),
  collectionLogBonusPoints: z.number().min(0).default(0),
  notableItemsBonusPoints: z.number().min(0).default(0),
  clueScrollCounts: z
    .record(ClueScrollTier, z.coerce.number().nonnegative())
    .refine((obj): obj is Required<typeof obj> =>
      ClueScrollTier.options.every((key) => obj[key] != null),
    ),
});

export type RankCalculatorSchema = z.infer<typeof RankCalculatorSchema>;

export const RankCalculatorValidator = RankCalculatorSchema.superRefine(
  ({ achievementDiaries, hasAchievementDiaryCape }, ctx) => {
    if (
      hasAchievementDiaryCape &&
      !isAchievementDiaryCapeAchieved(achievementDiaries)
    ) {
      ctx.addIssue({
        code: 'custom',
        message:
          'You must have all achievement diaries completed to have the cape.',
        path: ['hasAchievementDiaryCape'],
      });
    }
  },
);
