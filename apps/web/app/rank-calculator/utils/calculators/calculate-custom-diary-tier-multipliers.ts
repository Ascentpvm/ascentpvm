import { customDiaryDiscordRoles } from '@/config/discord-roles';
import { clogDiaryTierBonusPoints, customDiaryTierBonusPoints } from '@/config/custom-diaries';

export function calculateCombatDiaryTierBonusPoints(
  discordRoles: Set<string> | null,
) {

  if (!discordRoles) {
    return {
      combatBonusPoints: 0,
      collectionLogBonusPoints: 0,
    };
  }

  // More readable imperative approach
  let combatBonusPoints = 0;
  const combatRoles = customDiaryDiscordRoles.Combat;
  for (const [tier, roleId] of combatRoles) {
    if (discordRoles.has(roleId)) {
      combatBonusPoints = customDiaryTierBonusPoints[tier];
    }
  }

  let collectionLogBonusPoints = 0;
  const clogRoles = customDiaryDiscordRoles.Clog;
  for (const [tier, roleId] of clogRoles) {
    if (discordRoles.has(roleId)) {
      collectionLogBonusPoints = clogDiaryTierBonusPoints[tier];
    }
  }

  return {
    combatBonusPoints,
    collectionLogBonusPoints,
  };
}
