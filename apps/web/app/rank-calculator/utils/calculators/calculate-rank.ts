import { Rank } from '@/config/enums';
import { RankStructure } from '@/app/schemas/rank-calculator';
import {
  rankRequiredCombatAchievements,
  rankRequiredItems,
  rankThresholds,
} from '@/config/ranks';
import type { RankCalculatorSchema } from '../../[player]/submit-rank-calculator-validation';
import { CombatAchievementTier } from '@/app/schemas/osrs';

export interface RankData {
  rank: Rank;
  nextRank: Rank | null;
  throttleReason: 'items' | 'Master CAs' | null;
}

export function calculateRank(
  acquiredItems: RankCalculatorSchema['acquiredItems'],
  combatAchievementTier: CombatAchievementTier,
  pointsAwarded: number,
  collectionLogSlots: number,
  rankStructure: RankStructure,
): RankData {
  const rankData = Object.entries(rankThresholds[rankStructure]) as [
    Rank,
    number,
  ][];
  const combatAchievementTiers = CombatAchievementTier.options;
  const achievedCombatAchievementTierIndex = combatAchievementTiers.indexOf(
    combatAchievementTier,
  );

  let currentRank: Rank = rankData[0][0];
  let nextRank: Rank | null = null;
  let throttleReason: 'items' | 'Master CAs' | null = null;

  const effectivePoints =
    rankStructure === 'Clog' ? collectionLogSlots : pointsAwarded;

  console.log(
    `Calculating rank for structure: ${rankStructure}, points: ${effectivePoints}`
  );

  for (let i = 0; i < rankData.length; i++) {
    const [rank, threshold] = rankData[i];

    if (effectivePoints < threshold) {
      break;
    }

    const hasRequiredItems =
      rankRequiredItems[rank]?.some((itemRequirements) =>
        itemRequirements.every((item) => acquiredItems[item]),
      ) ?? true;

    const hasRequiredCombatAchievements =
      (rankRequiredCombatAchievements[rank] &&
        combatAchievementTiers.indexOf(
          rankRequiredCombatAchievements[rank],
        ) <= achievedCombatAchievementTierIndex) ??
      true;

    if (!hasRequiredItems) {
      throttleReason = 'items';
      break;
    }

    if (!hasRequiredCombatAchievements) {
      throttleReason = 'Master CAs';
      break;
    }

    currentRank = rank;
    nextRank = rankData[i + 1]?.[0] ?? null;
  }

  return { rank: currentRank, nextRank, throttleReason };
}
