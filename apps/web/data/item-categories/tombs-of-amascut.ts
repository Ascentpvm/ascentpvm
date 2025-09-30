import { formatWikiImageUrl } from '@/app/rank-calculator/utils/format-wiki-url';
import { ItemCategory } from '@/app/schemas/items';
import { singleItem } from '../utils/item-builders';

export const tombsOfAmascut: ItemCategory = {
  image: formatWikiImageUrl('Tombs of Amascut - Expert Mode icon', 'category'),
  items: [
    singleItem({
      name: "Osmumten's fang",
      collectionLogCategory: 'tombs_of_amascut',
    }),
    singleItem({
      name: 'Lightbearer',
      collectionLogCategory: 'tombs_of_amascut',
    }),
    singleItem({
      name: "Elidinis' ward",
      collectionLogCategory: 'tombs_of_amascut',
    }),
    singleItem({
      name: 'Masori mask',
      collectionLogCategory: 'tombs_of_amascut',
    }),
    singleItem({
      name: 'Masori body',
      collectionLogCategory: 'tombs_of_amascut',
    }),
    singleItem({
      name: 'Masori chaps',
      collectionLogCategory: 'tombs_of_amascut',
    }),
    singleItem({
      name: "Tumeken's shadow",
      clogName: "Tumeken's shadow (uncharged)",
      collectionLogCategory: 'tombs_of_amascut',
    }),
    singleItem({
      name: "Tumeken's guardian",
      collectionLogCategory: 'tombs_of_amascut',
    }),
  ],
};
