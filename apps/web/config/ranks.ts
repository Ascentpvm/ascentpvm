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

export const rankEhcThresholds: Record<
  RankStructure,
  Partial<Record<Rank, number>>
> = {
  Clog: {
    'Scribe': 0,
    'Learner': 2600,
    'Teacher': 2900,
    'Councillor': 3200,
    'Assistant': 3200
  },
  Standard: {
    Sapphire: 0,
    Emerald: 0,
    'Red Topaz': 0,
    Zenyte: 0,
    Captain: 0,
    Astral: 0,
    Soul: 0,
    Completionist: 0,
  },
  'Deputy Owner': {
    'Deputy Owner': 0,
  },
  Staff: {
    Serenist: 0,
  }
} as const;

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
    ['Infernal cape', "Dizana's quiver (uncharged)", 'Avernic defender hilt', 'Dragon warhammer'],
    ['Infernal cape', "Dizana's quiver (uncharged)", 'Avernic defender hilt', 'Elder maul'],
  ],
  Scribe: [
    ['Infernal cape', "Dizana's quiver (uncharged)", 'Avernic defender hilt', 'Dragon warhammer'],
    ['Infernal cape', "Dizana's quiver (uncharged)", 'Avernic defender hilt', 'Elder maul'],
  ],
};

/**
 * Maps the required combat achievement tier needed to achieve each rank.
 */
export const rankRequiredCombatAchievements: Partial<
  Record<Rank, CombatAchievementTier>
> = {};


/**
 * Maps the required Boss Kill counts needed to achieve each rank.
 */
export const rankRequiredBossKills: Partial<Record<Rank, {
  toaExpertKillCount: number;
  chambersOfXericCmKillCount: number;
  tobKillCount: number;
}>> = {
  Sapphire: {
    toaExpertKillCount: 100,
    chambersOfXericCmKillCount: 25,
    tobKillCount: 100
  },
  Scribe: {
    toaExpertKillCount: 100,
    chambersOfXericCmKillCount: 25,
    tobKillCount: 100
  }
};

/**
 * Maps required levels for each rank.
 */

export const rankRequiredSlayerLevel: Partial<Record<Rank, number>> = {
  Sapphire: 95,
  Scribe: 95,
};