import { formatWikiImageUrl } from '@/app/rank-calculator/utils/format-wiki-url';
import { ItemCategory } from '@/app/schemas/items';
import { singleItem } from '../utils/item-builders';

export const amoxliatl: ItemCategory = {
  image: formatWikiImageUrl('Amoxliatl_chathead', 'category'),
  items: [
    singleItem({
      name: 'Glacial temotli',
      collectionLogCategory: 'amoxliatl',
      targetDropSources: ['Amoxliatl']
    }),
    singleItem({
      name: 'Pendant of ates (inert)',
      collectionLogCategory: 'amoxliatl',
      targetDropSources: ['Amoxliatl']
    }),
    singleItem({
      name: 'Moxi',
      collectionLogCategory: 'amoxliatl',
    }),
  ],
};
