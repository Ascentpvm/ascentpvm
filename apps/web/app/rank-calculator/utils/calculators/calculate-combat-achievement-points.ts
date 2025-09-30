import { CombatAchievementTier } from '@/app/schemas/osrs';
import { combatAchievementTierPoints } from '../../config/points';

export function calculateCombatAchievementPoints(
  combatAchievementTier: CombatAchievementTier,
  scaling: number,
) {
  const tierPointMap = {
    None: 0,
    Easy: combatAchievementTierPoints.Easy,
    Medium: combatAchievementTierPoints.Medium,
    Hard: combatAchievementTierPoints.Hard,
    Elite: combatAchievementTierPoints.Elite,
    Master: combatAchievementTierPoints.Master,
    Grandmaster: combatAchievementTierPoints.Grandmaster,
  } satisfies Record<CombatAchievementTier, number>;

  return Math.floor(tierPointMap[combatAchievementTier] * scaling);
}
