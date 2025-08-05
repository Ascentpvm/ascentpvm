import { formatWikiImageUrl } from '@/app/rank-calculator/utils/format-wiki-url';
import { ItemCategory } from '@/app/schemas/items';
import { singleItem } from '../utils/item-builders';

export const revenants: ItemCategory = {
  image: formatWikiImageUrl('Revenant ork', 'category'),
  items: [
    singleItem({
      name: 'Amulet of avarice',
      collectionLogCategory: 'revenants',
      targetDropSources: ['Revenant ork#On-task'],
    }),
    singleItem({
      name: "Viggora's chainmace",
      clogName: "Viggora's chainmace (u)",
      collectionLogCategory: 'revenants',
      targetDropSources: ['Revenant ork#On-task'],
    }),
    singleItem({
      name: "Craw's bow",
      clogName: "Craw's bow (u)",
      collectionLogCategory: 'revenants',
      targetDropSources: ['Revenant ork#On-task'],
    }),
    singleItem({
      name: "Thammaron's sceptre",
      clogName: "Thammaron's sceptre (u)",
      collectionLogCategory: 'revenants',
      targetDropSources: ['Revenant ork#On-task'],
    }),
  ],
};
