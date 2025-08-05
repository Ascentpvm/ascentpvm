import {
  swiftBladeLmsPointsRequired,
  ehbRates,
} from '@/app/rank-calculator/config/efficiency-rates';
import { calculateXpOrTimeBasedItemPoints } from '@/app/rank-calculator/utils/calculate-xp-or-time-based-item-points';
import { formatWikiImageUrl } from '@/app/rank-calculator/utils/format-wiki-url';
import { ItemCategory } from '@/app/schemas/items';
import {
  singleItem,
} from '../utils/item-builders';

export const miscellaneous: ItemCategory = {
  image: formatWikiImageUrl('Inventory', 'category'),
  items: [
    singleItem({
      name: "Bryophyta's essence",
      collectionLogCategory: 'bryophyta',
      targetDropSources: ["Chest (Bryophyta's lair)#Members"]
    }),
    singleItem({
      name: 'Dragon warhammer',
      collectionLogCategory: 'miscellaneous',
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
