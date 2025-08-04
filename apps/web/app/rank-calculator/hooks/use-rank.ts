import { useWatch } from 'react-hook-form';
import { RankCalculatorSchema } from '../[player]/submit-rank-calculator-validation';
import { calculateRank } from '../utils/calculators/calculate-rank';

export function useRank(pointsAwarded: number) {
  const rankStructure = useWatch<RankCalculatorSchema, 'rankStructure'>({
    name: 'rankStructure',
  });
  const acquiredItems = useWatch<RankCalculatorSchema, 'acquiredItems'>({
    name: 'acquiredItems',
  });
  const combatAchievementTier = useWatch<
    RankCalculatorSchema,
    'combatAchievementTier'
  >({
    name: 'combatAchievementTier',
  });
  const collectionLogCount = useWatch<RankCalculatorSchema, 'collectionLogCount'>({
    name: 'collectionLogCount',
  });

  return calculateRank(
    acquiredItems,
    combatAchievementTier,
    pointsAwarded,
    collectionLogCount,
    rankStructure,
  );
}
