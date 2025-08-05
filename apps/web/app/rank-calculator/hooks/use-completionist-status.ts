import { useWatch } from 'react-hook-form';
import { useFormContext } from 'react-hook-form';
import { useEffect } from 'react';
import { RankCalculatorSchema } from '../[player]/submit-rank-calculator-validation';
import { itemList } from '@/data/item-list';
import { stripEntityName } from '../utils/strip-entity-name';

export function useCompletionistStatus() {
    const { setValue } = useFormContext<RankCalculatorSchema>();

    const acquiredItems = useWatch<RankCalculatorSchema, 'acquiredItems'>({
        name: 'acquiredItems',
    });

    useEffect(() => {
        // Get all items that give points
        const itemsThatGivePoints = Object.values(itemList)
            .flatMap(({ items }) => items)
            .filter(({ points }) => points > 0)
            .map(({ name }) => stripEntityName(name));

        // Check if all items that give points are acquired
        let isCompletionist = true;
        for (const item of itemsThatGivePoints) {
            if (acquiredItems[item] !== true) {
                isCompletionist = false;
                break;
            }
        }

        // Update the form value
        setValue('isCompletionist', isCompletionist, {
            shouldDirty: true,
        });
    }, [acquiredItems, setValue]);
} 