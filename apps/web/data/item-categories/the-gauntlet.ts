import { formatWikiImageUrl } from '@/app/rank-calculator/utils/format-wiki-url';
import { ItemCategory } from '@/app/schemas/items';
import { singleItem, compoundItem } from '../utils/item-builders';

export const theGauntlet: ItemCategory = {
  image: formatWikiImageUrl('Corrupted Youngllef chathead', 'category'),
  items: [
    compoundItem({
      name: 'Crystal helm',
      requiredItems: [
        { clogName: 'Crystal armour seed', targetDropSources: ['Reward Chest (The Gauntlet)#(Corrupted)'], },
      ],
      collectionLogCategories: ['the_gauntlet'],
    }),
    compoundItem({
      name: 'Crystal body',
      requiredItems: [
        { clogName: 'Crystal armour seed', amount: 3, targetDropSources: ['Reward Chest (The Gauntlet)#(Corrupted)'], },
      ],
      collectionLogCategories: ['the_gauntlet'],
    }),
    compoundItem({
      name: 'Crystal legs',
      requiredItems: [
        { clogName: 'Crystal armour seed', amount: 2, targetDropSources: ['Reward Chest (The Gauntlet)#(Corrupted)'], },
      ],

      collectionLogCategories: ['the_gauntlet'],
    }),
    singleItem({
      name: 'Enhanced crystal weapon seed (1)',
      clogName: 'Enhanced crystal weapon seed',
      requiredAmount: 1,
      collectionLogCategory: 'the_gauntlet',
      targetDropSources: ['Reward Chest (The Gauntlet)#(Corrupted)'],
    }),
    singleItem({
      name: 'Enhanced crystal weapon seed (2)',
      clogName: 'Enhanced crystal weapon seed',
      requiredAmount: 2,
      collectionLogCategory: 'the_gauntlet',
      targetDropSources: ['Reward Chest (The Gauntlet)#(Corrupted)'],
      ignoreAmountMultiplier: true,
    }),
    singleItem({
      name: 'Youngllef',
      collectionLogCategory: 'the_gauntlet',
      targetDropSources: ['Reward Chest (The Gauntlet)#(Corrupted)'],
    }),
  ],
};
