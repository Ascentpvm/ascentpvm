import { formatWikiImageUrl } from '@/app/rank-calculator/utils/format-wiki-url';
import { ItemCategory } from '@/app/schemas/items';
import { singleItem } from '../utils/item-builders';

export const dagannothKings: ItemCategory = {
  image: formatWikiImageUrl('Dagannoth Prime', 'category'),
  items: [
    singleItem({
      name: 'Archers rings',
      collectionLogCategory: 'dagannoth_kings',
    }),
    singleItem({
      name: 'Berserker ring',
      collectionLogCategory: 'dagannoth_kings',
    }),
    singleItem({
      name: 'Seers ring',
      collectionLogCategory: 'dagannoth_kings',
    }),
    singleItem({
      name: 'Warrior ring',
      collectionLogCategory: 'dagannoth_kings',
    }),
    singleItem({
      name: 'Seercull',
      collectionLogCategory: 'dagannoth_kings',
    }),
    singleItem({
      name: 'Mud battlestaff',
      collectionLogCategory: 'dagannoth_kings',
    }),
    singleItem({
      name: 'Dragon axe',
      collectionLogCategory: 'dagannoth_kings',
      points: 1,
    }),
    singleItem({
      name: 'Pet dagannoth prime',
      collectionLogCategory: 'dagannoth_kings',
    }),
    singleItem({
      name: 'Pet dagannoth rex',
      collectionLogCategory: 'dagannoth_kings',
    }),
    singleItem({
      name: 'Pet dagannoth supreme',
      collectionLogCategory: 'dagannoth_kings',
    }),
  ],
};
