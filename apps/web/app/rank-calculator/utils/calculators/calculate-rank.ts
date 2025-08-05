import { Rank } from '@/config/enums';
import { RankStructure } from '@/app/schemas/rank-calculator';
import {
  rankRequiredBossKills,
  rankRequiredCombatAchievements,
  rankRequiredItems,
  rankRequiredSlayerLevel,
  rankThresholds,
  rankEhcThresholds,
} from '@/config/ranks';
import { RankCalculatorSchema } from '../../[player]/submit-rank-calculator-validation';
import { CollectionLogItemName, CombatAchievementTier } from '@/app/schemas/osrs';
import { useWatch } from 'react-hook-form';

export interface RankData {
  rank: Rank | null;
  nextRank: Rank | null;
  throttleReason: 'slayer level' | 'boss kc' | 'items' | 'Master CAs' | null;
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
  const cape = useWatch<RankCalculatorSchema, 'tzhaarCape'>({
    name: 'tzhaarCape',
  });
  const quiver = useWatch<RankCalculatorSchema, 'hasDizanasQuiver'>({
    name: 'hasDizanasQuiver'
  });
  const toaExpertKillCount = useWatch<RankCalculatorSchema, 'toaExpertKillCount'>({
    name: 'toaExpertKillCount',
  });
  const chambersOfXericCmKillCount = useWatch<RankCalculatorSchema, 'chambersOfXericCmKillCount'>({
    name: 'chambersOfXericCmKillCount',
  });
  const tobKillCount = useWatch<RankCalculatorSchema, 'tobKillCount'>({
    name: 'tobKillCount',
  });

  const slayerLevel = useWatch<RankCalculatorSchema, 'slayerLevel'>({
    name: 'slayerLevel',
  });

  const ehc = useWatch<RankCalculatorSchema, 'ehc'>({
    name: 'ehc',
  });

  const playerBossKillCounts = {
    chambersOfXericCmKillCount,
    toaExpertKillCount,
    tobKillCount,
  };

  let currentRank: Rank | null = null;
  let nextRank: Rank | null = null;
  let throttleReason: 'slayer level' | 'boss kc' | 'items' | 'Master CAs' | null = null;

  const effectivePoints =
    rankStructure === 'Clog' ? collectionLogSlots : pointsAwarded;

  console.log(
    `Calculating rank for structure: ${rankStructure}, points: ${effectivePoints}`
  );

  for (let i = 0; i < rankData.length; i++) {
    const [rank, threshold] = rankData[i];

    const rankEhcThreshold = rankEhcThresholds[rankStructure][rank] ?? 0;

    if (rankStructure === "Clog") {
      if (effectivePoints < threshold && ehc < rankEhcThreshold) {
        break;
      }
    }

    if (effectivePoints < threshold) {
      break;
    }

    const missingItems: CollectionLogItemName[] = [];
    const hasRequiredItems =
      rankRequiredItems[rank]?.some((itemRequirements) => {
        const isRequirementMet = itemRequirements.every((item) => {
          if (item == 'Infernal cape') {
            return cape === 'Infernal cape'
          }

          if (item == 'Dizana\'s quiver (uncharged)') {
            return quiver
          }
          const isAcquired = acquiredItems[item];
          if (!isAcquired) {
            missingItems.push(item);
          }
          return isAcquired;
        });
        return isRequirementMet;
      }) ?? true;

    const hasRequiredBossKillCount = rankRequiredBossKills[rank]
      ? Object.entries(rankRequiredBossKills[rank]).every(([key, value]) => {
        const playerKillCount = playerBossKillCounts[key as keyof typeof rankRequiredBossKills[Rank]];
        return playerKillCount >= value;
      })
      : true;

    const hasRequiredCombatAchievements =
      (rankRequiredCombatAchievements[rank] &&
        combatAchievementTiers.indexOf(
          rankRequiredCombatAchievements[rank],
        ) <= achievedCombatAchievementTierIndex) ??
      true;

    const hasRequiredSlayerLevel = rankRequiredSlayerLevel[rank]
      ? slayerLevel >= rankRequiredSlayerLevel[rank]
      : true;

    if (!hasRequiredItems) {
      throttleReason = 'items';
      nextRank = rank;
      break;
    }

    if (!hasRequiredCombatAchievements) {
      throttleReason = 'Master CAs';
      nextRank = rank;
      break;
    }

    if (!hasRequiredBossKillCount) {
      throttleReason = 'boss kc';
      nextRank = rank;
      break;
    }

    if (!hasRequiredSlayerLevel) {
      throttleReason = 'slayer level';
      nextRank = rank;
      break;
    }

    currentRank = rank;
    nextRank = rankData[i + 1]?.[0] ?? null;
  }

  return { rank: currentRank, nextRank, throttleReason };
}
