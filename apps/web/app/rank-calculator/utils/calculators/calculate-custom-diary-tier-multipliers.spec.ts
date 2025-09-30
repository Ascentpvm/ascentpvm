import { customDiaryDiscordRoles } from '@/config/discord-roles';
import { calculateCombatDiaryTierBonusPoints } from './calculate-custom-diary-tier-multipliers';

it('calculates the correct tier multipliers', () => {
  const roles = new Set<string>([customDiaryDiscordRoles.Combat.get('Easy')!]);

  const { collectionLogBonusPoints, combatBonusPoints, skillingBonusPoints } =
    calculateCombatDiaryTierBonusPoints(roles);

  expect(collectionLogBonusPoints).toEqual(0.4);
  expect(combatBonusPoints).toEqual(0.3);
  expect(skillingBonusPoints).toEqual(0.1);
});

it('calculates the correct tier multipliers when multiple roles for the same diary are present', () => {
  const roles = new Set<string>([
    customDiaryDiscordRoles.Combat.get('Easy')!,
    customDiaryDiscordRoles.Combat.get('Hard')!,
  ]);

  const { collectionLogBonusPoints, combatBonusPoints, skillingBonusPoints } =
    calculateCombatDiaryTierBonusPoints(roles);

  expect(collectionLogBonusPoints).toEqual(0.4);
  expect(combatBonusPoints).toEqual(0.4);
  expect(skillingBonusPoints).toEqual(0.2);
});
