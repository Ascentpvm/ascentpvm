import { Rank } from '@/config/enums';
import { rankNames } from '@/config/ranks';

export function getRankName(rank: Rank | null): string {
  if (!rank) {
    return 'Unranked';
  }
  return rankNames[rank] ?? rank;
}
