import { CombatDiaryTier } from '@/app/schemas/custom-diaries';
import { invert } from 'lodash';

export const customDiaryTierBonusPoints = {
  Easy: 500,
  Hard: 1000,
  Master: 2000,
  Grandmaster: 4000,
} as const satisfies Record<CombatDiaryTier, number>;

export const customDiaryTierNameByBonusPoints = invert(
  customDiaryTierBonusPoints,
);

export const clogDiaryTierBonusPoints = {
  Easy: 250,
  Medium: 500,
  Hard: 750,
  Elite: 1500,
  Grandmaster: 4000
}

export const clogDiaryTierNameByBonusPoints = invert(
  clogDiaryTierBonusPoints
);