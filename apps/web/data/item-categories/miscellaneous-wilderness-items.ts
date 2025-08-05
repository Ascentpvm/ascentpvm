import { ItemCategory } from '@/app/schemas/items';
import { compoundItem, singleItem } from '../utils/item-builders';

export const miscellaneousWildernessItems: ItemCategory = {
  image:
    'https://oldschool.runescape.wiki/images/Pkskull_%28Steam_Emoticon%29.png',
  items: [
    compoundItem({
      name: 'Odium ward',
      requiredItems: [
        { clogName: 'Odium shard 1' },
        { clogName: 'Odium shard 2' },
        { clogName: 'Odium shard 3' },
      ],
      collectionLogCategories: [
        'crazy_archaeologist',
        'scorpia',
        'chaos_fanatic',
      ],
    }),
    compoundItem({
      name: 'Malediction ward',
      requiredItems: [
        { clogName: 'Malediction shard 1' },
        { clogName: 'Malediction shard 2' },
        { clogName: 'Malediction shard 3' },
      ],
      collectionLogCategories: [
        'crazy_archaeologist',
        'scorpia',
        'chaos_fanatic',
      ],
    }),
    singleItem({
      name: 'Dragon pickaxe',
      collectionLogCategory: 'venenatis_and_spindel',
      targetDropSources: ['Artio', 'Spindel', "Calvar'ion"],
    }),
  ],
};
