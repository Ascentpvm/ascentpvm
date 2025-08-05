import { formatWikiImageUrl } from '@/app/rank-calculator/utils/format-wiki-url';
import { ItemCategory } from '@/app/schemas/items';
import { singleItem } from '../utils/item-builders';

export const visages: ItemCategory = {
  image: formatWikiImageUrl('Draconic visage detail', 'category'),
  items: [
    singleItem({
      name: 'Dragonfire shield',
      clogName: 'Draconic visage',
      image: formatWikiImageUrl('Dragonfire shield'),
      collectionLogCategory: 'slayer',
      targetDropSources: ['Black dragon#Wilderness Slayer Cave'],
    }),
    singleItem({
      name: 'Dragonfire ward',
      clogName: 'Skeletal visage',
      image: formatWikiImageUrl('Dragonfire ward'),
      collectionLogCategory: 'vorkath',
    }),
  ],
};
