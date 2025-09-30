import { z } from 'zod';

export const CombatDiarySection = z.enum(['Combat']);

export type CombatDiarySection = z.infer<typeof CombatDiarySection>;

export const CombatDiaryTier = z.enum([
  'Easy',
  'Hard',
  'Master',
  'Grandmaster',
]);

export type CombatDiaryTier = z.infer<typeof CombatDiaryTier>;

export const ClogDiarySection = z.enum(['Collection Log & Clues'])

export type ClogDiarySection = z.infer<typeof ClogDiarySection>;

export const ClogDiaryTier = z.enum([
  'Easy',
  'Medium',
  'Hard',
  'Elite',
  'Grandmaster'
])

export type ClogDiaryTier = z.infer<typeof ClogDiaryTier>;