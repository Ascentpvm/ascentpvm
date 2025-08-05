import JSum from 'jsum';
import {
  isCollectionLogItem,
  Item,
  ItemCategoryMap,
} from '@/app/schemas/items';
import { DroppedItemResponse } from '@/app/schemas/wiki';
import { itemList } from '@/data/item-list';
import { unstable_cache } from 'next/cache';
import * as itemPointMap from '@/app/rank-calculator/config/item-point-map';
import * as efficiencyData from '@/app/rank-calculator/config/efficiency-rates';
import * as Sentry from '@sentry/nextjs';
import { calculateItemPoints } from './calculate-item-points';
import { pointsConfig } from '../config/points';

const itemListChecksum = JSum.digest(itemList, 'SHA256', 'hex');
const efficiencyDataChecksum = JSum.digest(efficiencyData, 'SHA256', 'hex');
const itemPointMapChecksum = JSum.digest(itemPointMap, 'SHA256', 'hex');

// The core function without caching
const buildNotableItemListCore = async (dropRates: DroppedItemResponse) =>
  Object.entries(itemList).reduce<ItemCategoryMap>((acc, [key, category]) => {
    const items = category.items.map((item) => {
      if (item.points) {
        return item;
      }

      if (isCollectionLogItem(item)) {
        try {
          return {
            ...item,
            points: calculateItemPoints(dropRates, item.requiredItems),
          };
        } catch (error) {
          console.error(
            `Error calculating points for item ${item.name}:`,
            error,
          )
          Sentry.captureException(error);

          return { ...item, hasPointsError: true };
        }
      }

      throw new Error(`Could not calculate item points for ${item.name}`);
    }, []);

    return {
      ...acc,
      [key]: { ...category, items: items as NonEmptyArray<Item> },
    };
  }, {});


// Conditionally apply caching based on environment
export const buildNotableItemList = process.env.NODE_ENV === 'development'
  ? buildNotableItemListCore // No caching in development
  : unstable_cache( // Caching in production
    buildNotableItemListCore,
    [
      `points-per-hour:${pointsConfig.notableItemsPointsPerHour}`,
      `item-list:${itemListChecksum}`,
      `efficiency-data:${efficiencyDataChecksum}`,
      `item-point-map:${itemPointMapChecksum}`,
    ],
  );