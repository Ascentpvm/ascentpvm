import { totalLevelMilestonePoints } from '../../config/points';

// View the function graph below
// https://www.desmos.com/calculator/pvb3brafeg
export function calculateTotalLevelPoints(
  totalLevel: number,
  _scaling: number,
) {
  if (!totalLevel) {
    return 0;
  }

  return Object.entries(totalLevelMilestonePoints).reduce(
    (totalPoints, [milestone, points]) => {
      if (totalLevel >= Number(milestone)) {
        return totalPoints + points;
      }

      return totalPoints;
    },
    0,
  );
}
