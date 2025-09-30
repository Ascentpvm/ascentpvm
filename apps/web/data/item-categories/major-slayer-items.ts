import {
  estimatedHoursForImbuedHeart,
} from '@/app/rank-calculator/config/efficiency-rates';
import { calculateXpOrTimeBasedItemPoints } from '@/app/rank-calculator/utils/calculate-xp-or-time-based-item-points';
import { formatWikiImageUrl } from '@/app/rank-calculator/utils/format-wiki-url';
import { ItemCategory } from '@/app/schemas/items';
import { singleItem } from '../utils/item-builders';

export const majorSlayerItems: ItemCategory = {
  image: formatWikiImageUrl('Slayer icon (detail)', 'category'),
  items: [
    singleItem({
      name: 'Black mask',
      collectionLogCategory: 'slayer',
      clogName: 'Black mask (10)',
      targetDropSources: ['Cave horror'],
    }),
    singleItem({
      name: 'Neitiznot faceguard',
      clogName: 'Basilisk jaw',
      image: formatWikiImageUrl('Neitiznot faceguard'),
      collectionLogCategory: 'slayer',
      targetDropSources: ['Basilisk Knight'],
    }),
    singleItem({
      name: 'Imbued heart',
      collectionLogCategory: 'slayer',
      points: calculateXpOrTimeBasedItemPoints(estimatedHoursForImbuedHeart),
    }),
    singleItem({
      name: 'Aranea boots',
      collectionLogCategory: 'slayer',
      targetDropSources: ['Araxyte#Level 146'],
    }),
  ],
};
