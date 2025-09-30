import { pointsConfig } from '../../config/points';

export function calculateMaximumCombatPoints(scaling: number) {
  const {
    infernalCapePoints,
    bloodTorvaPoints,
    dizanasQuiverPoints,
    maximumCombatAchievementPoints,
    radiantOathplatePoints,
  } = pointsConfig;
  const maximumTzhaarCapePoints = infernalCapePoints;

  return Math.floor(
    (maximumCombatAchievementPoints +
      maximumTzhaarCapePoints +
      bloodTorvaPoints +
      radiantOathplatePoints +
      dizanasQuiverPoints) *
      scaling,
  );
}
