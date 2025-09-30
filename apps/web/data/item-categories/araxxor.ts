import { ItemCategory } from '@/app/schemas/items';
import { singleItem } from '../utils/item-builders';

export const araxxor: ItemCategory = {
  items: [
    singleItem({
      name: 'Noxious blade',
      collectionLogCategory: 'araxxor',
    }),
    singleItem({
      name: 'Noxious point',
      collectionLogCategory: 'araxxor',
    }),
    singleItem({
      name: 'Noxious pommel',
      collectionLogCategory: 'araxxor',
    }),
    singleItem({
      name: 'Araxyte fang',
      collectionLogCategory: 'araxxor',
    }),
    singleItem({
      name: 'Jar of venom',
      collectionLogCategory: 'araxxor',
    }),
    singleItem({
      name: 'Nid',
      collectionLogCategory: 'araxxor',
    }),
  ],
};
