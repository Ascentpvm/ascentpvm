import { useWatch } from 'react-hook-form';
import { useFormContext } from 'react-hook-form';
import { useEffect } from 'react';
import { RankCalculatorSchema } from '../[player]/submit-rank-calculator-validation';
import { itemList } from '@/data/item-list';
import { stripEntityName } from '../utils/strip-entity-name';
import { itemPointOverrides } from '../config/item-point-map';

export function useCompletionistStatus() {
    const { setValue } = useFormContext<RankCalculatorSchema>();

    const acquiredItems = useWatch<RankCalculatorSchema, 'acquiredItems'>({
        name: 'acquiredItems',
    });

    useEffect(() => {
        // Get all items that give points
        const itemsThatGivePoints = Object.values(itemList)
            .flatMap(({ items }) => items)
            .filter(({ name }) => {
                const override = itemPointOverrides[name as keyof typeof itemPointOverrides]
                return override != null ? override > 0 : true
            })
            .map(({ name }) => stripEntityName(name));


        // Check if all items that give points are acquired
        let isCompletionist = true;
        itemsThatGivePoints
            .forEach((name) => {
                if (
                    itemsThatGivePoints.includes(name) &&
                    !acquiredItems[name]
                ) {
                    console.log("🔍 Missing item for completionist:", name);
                    isCompletionist = false;
                }
            });

        // Update the form value
        setValue('isCompletionist', isCompletionist, {
            shouldDirty: true,
        });
    }, [acquiredItems, setValue]);
} 