import { z } from 'zod';
import { Rank } from './enums';
import { RankStructure } from '@/app/schemas/rank-calculator';
import type {
  CollectionLogItemName,
  CombatAchievementTier,
} from '@/app/schemas/osrs';

export const rankNames: Partial<Record<Rank, string>> = {};

export const StandardRank = Rank.extract([
  'Sapphire',
  'Emerald',
  'Red Topaz',
  'Zenyte',
  'Captain',
  'Astral',
  'Soul',
  'Completionist'
]);

export const ClogRank = Rank.extract([
  'Scribe',
  'Learner',
  'Teacher',
  'Councillor',
  'Assistant'
])
export type StandardRank = z.infer<typeof StandardRank>;
export type ClogRank = z.infer<typeof ClogRank>;

export const rankThresholds: Record<
  RankStructure,
  Partial<Record<Rank, number>>
> = {
  Clog: {
    'Scribe': 700,
    'Learner': 850,
    'Teacher': 1025,
    'Councillor': 1200,
    'Assistant': 1425
  },
  Standard: {
    Sapphire: 0,
    Emerald: 1500,
    'Red Topaz': 2250,
    Zenyte: 3000,
    Captain: 4100,
    Astral: 5300,
    Soul: 6800,
    Completionist: 9000,
  },
  'Deputy Owner': {
    'Deputy Owner': 0,
  },
  Staff: {
    Serenist: 0,
  },
} as const;

/**
 * Maps the required items needed to achieve each rank.
 * The items correspond to the form field on the page.
 */
export const rankRequiredItems: Partial<
  Record<Rank, CollectionLogItemName[][]>
> = {
  Sapphire: [
    ['Infernal Cape', "Dizana's Quiver (uncharged)", 'Avernic Defender Hilt','Dragon warhammer'],
    ['Infernal Cape', "Dizana's Quiver (uncharged)", 'Avernic Defender Hilt','Elder maul']
  ],
  Scribe: [
    ['Infernal Cape', "Dizana's Quiver (uncharged)", 'Avernic Defender Hilt','Dragon warhammer'],
    ['Infernal Cape', "Dizana's Quiver (uncharged)", 'Avernic Defender Hilt','Elder maul']
  ],

export const rankRequiredCombatAchievements: Partial<
  Record<Rank, CombatAchievementTier>
> = {
  Skulled: 'Master',
};
