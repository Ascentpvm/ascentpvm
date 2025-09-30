import { formatWikiImageUrl } from '@/app/rank-calculator/utils/format-wiki-url';
import { ItemCategory } from '@/app/schemas/items';
import { compoundItem } from '../utils/item-builders';

export const perilousMoons: ItemCategory = {
  image: formatWikiImageUrl('Blood Moon', 'category'),
  items: [
    compoundItem({
      name: 'Eclipse moon armour',
      image: formatWikiImageUrl('Eclipse atlatl', 'category'),
      requiredItems: [
        { clogName: 'Eclipse moon helm' },
        { clogName: 'Eclipse moon chestplate' },
        { clogName: 'Eclipse moon tassets' },
        { clogName: 'Eclipse atlatl' },
      ],
      collectionLogCategories: ['moons_of_peril'],
    }),

    compoundItem({
      name: 'Blood moon armour',
      image: formatWikiImageUrl('Dual macuahuitl', 'category'),
      requiredItems: [
        { clogName: 'Blood moon helm' },
        { clogName: 'Blood moon chestplate' },
        { clogName: 'Blood moon tassets' },
        { clogName: 'Dual macuahuitl' }
      ],
      collectionLogCategories: ['moons_of_peril'],
    }),
    compoundItem({
      name: 'Blue moon armour',
      image: formatWikiImageUrl('Blue moon spear', 'category'),
      requiredItems: [
        { clogName: 'Blue moon helm' },
        { clogName: 'Blue moon chestplate' },
        { clogName: 'Blue moon tassets' },
        { clogName: 'Blue moon spear' }
      ],
      collectionLogCategories: ['moons_of_peril'],
    }),
  ],
};
