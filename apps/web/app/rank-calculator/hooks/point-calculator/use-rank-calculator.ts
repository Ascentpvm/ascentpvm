import { CommonPointCalculatorData } from '@/app/schemas/rank-calculator';
import { useWatch } from 'react-hook-form';
import { useCollectionLogAndCluesPointCalculator } from './collection-log-and-clues/use-collection-log-and-clues-point-calculator';
import { useNotableItemsPointCalculator } from './notable-items/use-notable-items-point-calculator';
import { useSkillingPointCalculator } from './skilling/use-skilling-point-calculator';
import { useCombatPointCalculator } from './combat/use-combat-point-calculator';
import { useRank } from '../use-rank';
import { useCompletionistStatus } from '../use-completionist-status';
import { RankCalculatorSchema } from '../../[player]/submit-rank-calculator-validation';
import { RankData } from '../../utils/calculators/calculate-rank';
import { calculateTotalPoints } from '../../utils/calculators/calculate-total-points';
import { rankThresholds } from '@/config/ranks';

export type RankCalculatorData = CommonPointCalculatorData & RankData;

export function useRankCalculator() {
  // Update completionist status when items change
  useCompletionistStatus();

  const rankStructure = useWatch<RankCalculatorSchema, 'rankStructure'>({
    name: 'rankStructure',
  });

  const collectionLogCount = useWatch<RankCalculatorSchema, 'collectionLogCount'>({
    name: 'collectionLogCount',
  });

  const { pointsAwarded: totalCollectionLogPoints } =
    useCollectionLogAndCluesPointCalculator();

  const { pointsAwarded: totalNotableItemsPoints } =
    useNotableItemsPointCalculator();

  const { pointsAwarded: totalSkillingPoints } = useSkillingPointCalculator();

  const { pointsAwarded: totalCombatPoints } = useCombatPointCalculator();
  let pointsAwarded = 0;
  if (rankStructure === 'Standard') {
    pointsAwarded = calculateTotalPoints(
      totalCollectionLogPoints,
      totalNotableItemsPoints,
      totalSkillingPoints,
      totalCombatPoints,
    );
  } else if (rankStructure === 'Clog') {
    pointsAwarded = collectionLogCount;
  }

  const { rank, nextRank, throttleReason } = useRank(pointsAwarded);

  let currentRankThreshold = 0;

  if (rank) {
    currentRankThreshold = rankThresholds[rankStructure][rank] ?? 0;
  }

  const nextRankThreshold = !nextRank
    ? pointsAwarded
    : rankThresholds[rankStructure][nextRank]!;

  const pointsRemaining = nextRankThreshold
    ? nextRankThreshold - pointsAwarded
    : pointsAwarded;

  const pointsAwardedPercentage = nextRankThreshold
    ? (pointsAwarded - currentRankThreshold) /
    (nextRankThreshold - currentRankThreshold)
    : pointsAwarded / nextRankThreshold;

  return {
    pointsAwarded,
    pointsAwardedPercentage,
    pointsRemaining,
    rank,
    nextRank,
    throttleReason,
  } satisfies RankCalculatorData;
}
