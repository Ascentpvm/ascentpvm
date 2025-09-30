import { calculateBonusPoints } from './calculate-bonus-points';
import { calculateCollectionLogSlotPoints } from './calculate-collection-log-slot-points';

export function calculateCollectionLogAndCluesPoints(
  collectionLogSlotPoints: number,
  totalCollectionLogSlots: number,
  clueScrollPoints: number,
  collectionLogBonusPoints: number,
  multiplier: number,
  scaling: number,
) {
  const totalPointsAvailable = calculateCollectionLogSlotPoints(
    totalCollectionLogSlots,
    scaling,
  );
  const pointsAwarded = collectionLogSlotPoints + clueScrollPoints;
  const bonusPointsAwarded = calculateBonusPoints(pointsAwarded, multiplier) + collectionLogBonusPoints;

  const pointsRemaining =
    totalPointsAvailable - (pointsAwarded - clueScrollPoints);
  const pointsAwardedPercentage =
    (pointsAwarded - clueScrollPoints) / totalPointsAvailable;

  return {
    pointsAwarded: Math.floor(pointsAwarded + bonusPointsAwarded),
    pointsRemaining,
    pointsAwardedPercentage,
    bonusPointsAwarded: Math.floor(bonusPointsAwarded),
  };
}
