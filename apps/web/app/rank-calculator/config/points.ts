import {
  ClueScrollTier,
  CombatAchievementTier,
  DiaryLocation,
  DiaryTier,
  maximumTotalLevel,
} from '@/app/schemas/osrs';

export const achievementDiaryTierPoints = {
  None: 0,
  Easy: 0,
  Medium: 0,
  Hard: 0,
  Elite: 0,
} satisfies Record<DiaryTier, number>;

export const collectionLogSlotMilestonePoints = {
  100: 0,
  200: 0,
  300: 0,
  400: 0,
  500: 0,
  600: 0,
  700: 0,
  800: 0,
  900: 0,
  1000: 0,
  1100: 0,
  1200: 0,
  1300: 0,
} satisfies Record<number, number>;

export const clueScrollPoints = {
  Beginner: 0,
  Easy: 0,
  Medium: 0,
  Hard: 0,
  Elite: 0,
  Master: 0,
} satisfies Record<ClueScrollTier, number>;

export const totalLevelMilestonePoints = {
  1250: 0,
  1500: 0,
  1750: 0,
  2000: 0,
  2200: 0,
  [maximumTotalLevel]: 0,
} as const satisfies Record<number, number>;

export const combatAchievementTierPoints = {
  None: 0,
  Easy: 0,
  Medium: 0,
  Hard: 0,
  Elite: 0,
  Master: 0,
  Grandmaster: 0,
} satisfies Record<CombatAchievementTier, number>;

export const pointsConfig = {
  notableItemsPointsPerHour: 1,
  sailingOffset: 0,
  achievementDiaryCapePoints: 300,
  maximumTotalLevelPoints: 0,
  maximumAchievementDiaryPoints:
    DiaryLocation.options.length * achievementDiaryTierPoints.Elite,
  maximumCombatAchievementPoints: combatAchievementTierPoints.Grandmaster,
  bloodTorvaPoints: 0,
  dizanasQuiverPoints: 0,
  infernalCapePoints: 0,
  fireCapePoints: 0,
  radiantOathplatePoints: 0,
} as const satisfies Record<string, number>;
