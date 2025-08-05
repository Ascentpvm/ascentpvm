import {
  estimatedHoursToAcquireBarrowsGloves,
  estimatedHoursToAcquireBookOfTheDead,
  estimatedHoursToObtainBottomlessCompostBucket,
  estimatedHoursToAcquireGracefulSet,
  estimatedHoursToAcquireMusicCape,
  estimatedHoursToAcquireQuestCape,
  swiftBladeLmsPointsRequired,
  ehbRates,
} from '@/app/rank-calculator/config/efficiency-rates';
import { calculateXpOrTimeBasedItemPoints } from '@/app/rank-calculator/utils/calculate-xp-or-time-based-item-points';
import { formatWikiImageUrl } from '@/app/rank-calculator/utils/format-wiki-url';
import { ItemCategory } from '@/app/schemas/items';
import { Quest } from '@/app/schemas/osrs';
import {
  questItem,
  singleItem,
  compoundItem,
  manualItem,
} from '../utils/item-builders';

export const miscellaneous: ItemCategory = {
  image: formatWikiImageUrl('Inventory', 'category'),
  items: [
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
