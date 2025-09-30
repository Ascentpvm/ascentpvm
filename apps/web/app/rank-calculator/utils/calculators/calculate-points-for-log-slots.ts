import { collectionLogSlotMilestonePoints } from '../../config/points';

export function calculatePointsForLogSlots(
  collectionLogSlotCount: number,
  _scaling: number,
) {
  return Object.entries(collectionLogSlotMilestonePoints).reduce(
    (totalPoints, [milestone, points]) => {
      const milestoneCount = Number(milestone);

      if (collectionLogSlotCount >= milestoneCount) {
        return totalPoints + points;
      }
      return totalPoints;
    },
    0,
  );
}
