import { formatWikiImageUrl } from '@/app/rank-calculator/utils/format-wiki-url';
import { ItemCategory } from '@/app/schemas/items';
import { singleItem } from '../utils/item-builders';

export const magicTrainingArena: ItemCategory = {
  image: formatWikiImageUrl("Mage's book detail", 'category'),
  items: [
    singleItem({
      name: 'Master wand',
      collectionLogCategory: 'magic_training_arena',
      points: 5,
    }),
    singleItem({
      name: 'Infinity boots',
      collectionLogCategory: 'magic_training_arena',
      points: 2,
    }),
  ],
};
