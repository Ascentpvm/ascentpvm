import { formatWikiImageUrl } from '@/app/rank-calculator/utils/format-wiki-url';
import { ItemCategory } from '@/app/schemas/items';
import { compoundItem, singleItem } from '../utils/item-builders';

export const magicTrainingArena: ItemCategory = {
  image: formatWikiImageUrl('Mage Training Arena Logo', 'category'),
  items: [
    singleItem({
      name: 'Master wand',
      collectionLogCategory: 'Magic_training_arena',
    }),
    singleItem({
      name: 'Infinity boots',
      collectionLogCategory: 'Magic_training_arena',
    }),
  ],
};
