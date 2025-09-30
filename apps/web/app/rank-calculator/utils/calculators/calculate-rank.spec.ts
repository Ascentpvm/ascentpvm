import { calculateRank } from './calculate-rank';
import { Rank } from '@/config/enums';

it('returns Corporal if the player has the required points, but does not have titans/cox prayers', () => {
  const { rank } = calculateRank({}, 'Grandmaster', 100000, 500, 'Standard');

  expect(rank).toEqual<Rank>('Corporal');
});

it('returns Novice if the player has the required points, titans prayers, but does not have a defence reducing weapon', () => {
  const { rank } = calculateRank(
    { 'Deadeye prayer scroll': true, 'Mystic vigour prayer scroll': true },
    'Grandmaster',
    100000,
    500,
    'Standard',
  );

  expect(rank).toEqual<Rank>('Novice');
});

it('returns Novice if the player has the required points, cox prayers, but does not have a defence reducing weapon', () => {
  const { rank } = calculateRank(
    { 'Dexterous prayer scroll': true, 'Arcane prayer scroll': true },
    'Grandmaster',
    100000,
    500,
    'Standard',
  );

  expect(rank).toEqual<Rank>('Novice');
});

it('returns Novice if the player has the required points, a mix of titans/cox prayers, but does not have a defence reducing weapon', () => {
  const { rank } = calculateRank(
    { 'Deadeye prayer scroll': true, 'Arcane prayer scroll': true },
    'Grandmaster',
    100000,
    500,
    'Standard',
  );

  expect(rank).toEqual<Rank>('Novice');
});

it('returns General if the player has the required points, titans/cox prayers, and a defence reducing weapon, but does not have Grandmaster Combat Achievements', () => {
  const { rank } = calculateRank(
    {
      'Dexterous prayer scroll': true,
      'Arcane prayer scroll': true,
      'Dragon warhammer': true,
    },
    'Elite',
    100000,
    500,
    'Standard',
  );

  expect(rank).toEqual<Rank>('General');
});

it('returns Beast if the player has the required points, titans/cox prayers, a defence reducing weapon, and Grandmaster Combat Achievements', () => {
  const { rank } = calculateRank(
    {
      'Dexterous prayer scroll': true,
      'Arcane prayer scroll': true,
      'Dragon warhammer': true,
    },
    'Grandmaster',
    100000,
    500,
    'Standard',
  );

  expect(rank).toEqual<Rank>('Beast');
});
