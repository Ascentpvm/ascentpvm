import { ClueScrollTier } from '@/app/schemas/osrs';
import { clueScrollPoints } from '../../config/points';

type ClueScrollCounts = Record<ClueScrollTier, number>;

export function calculateClueScrollPoints(
  clueScrollCounts: ClueScrollCounts,
  scaling: number,
) {
  return (
    Object.entries(clueScrollCounts) as [ClueScrollTier, number][]
  ).reduce<{
    tierPoints: Record<ClueScrollTier, number>;
    totalPoints: number;
  }>(
    (acc, [tier, count]) => {
      const tierPoints = clueScrollPoints[tier] * count;
      const scaledTierPoints = Math.floor(tierPoints * scaling);

      return {
        ...acc,
        tierPoints: {
          ...acc.tierPoints,
          [tier]: scaledTierPoints,
        },
        totalPoints: acc.totalPoints + scaledTierPoints,
      };
    },
    {
      tierPoints: {
        Beginner: 0,
        Easy: 0,
        Medium: 0,
        Hard: 0,
        Elite: 0,
        Master: 0,
      },
      totalPoints: 0,
    },
  );
}
