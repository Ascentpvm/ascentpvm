import {
  swiftBladeLmsPointsRequired,
  ehbRates,
} from '@/app/rank-calculator/config/efficiency-rates';
import { calculateXpOrTimeBasedItemPoints } from '@/app/rank-calculator/utils/calculate-xp-or-time-based-item-points';
import { formatWikiImageUrl } from '@/app/rank-calculator/utils/format-wiki-url';
import { ItemCategory } from '@/app/schemas/items';
import {
  compoundItem,
  singleItem,
} from '../utils/item-builders';

export const miscellaneous: ItemCategory = {
  image: formatWikiImageUrl('Inventory', 'category'),
  items: [
    compoundItem({
      name: 'Godsword blade',
      requiredItems: [
        { clogName: 'Godsword shard 1' },
        { clogName: 'Godsword shard 2' },
        { clogName: 'Godsword shard 3' },
      ],
      collectionLogCategories: ['general_graardor'],
      points: 15
    }),
    singleItem({
      name: 'Dragon warhammer',
      collectionLogCategory: 'miscellaneous',
    }),
    singleItem({
      name: 'Dragon chainbody',
      collectionLogCategory: 'slayer',
    }),
    singleItem({
      name: 'Earthbound tecpatl',
      collectionLogCategory: 'slayer',
      targetDropSources: ['Earthen Nagua']
    }),
    singleItem({
      name: 'Sulphur blades',
      collectionLogCategory: 'miscellaneous',
      targetDropSources: ['Sulphur Nagua'],
      points: 2,
    }),
    singleItem({
      name: 'Swift blade',
      points: calculateXpOrTimeBasedItemPoints(
        swiftBladeLmsPointsRequired,
        ehbRates['LMS Points'],
      ),
      collectionLogCategory: 'last_man_standing',
    }),
  ],
};
