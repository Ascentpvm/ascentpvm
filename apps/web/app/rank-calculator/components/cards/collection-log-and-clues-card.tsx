import { Flex, Separator, Text } from '@radix-ui/themes';
import Image from 'next/image';
import { useFormContext } from 'react-hook-form';
import { DataCard } from '../data-card';
import { EditableText } from '../editable-text';
import { useCollectionLogAndCluesPointCalculator } from '../../hooks/point-calculator/collection-log-and-clues/use-collection-log-and-clues-point-calculator';
import { formatNumber } from '../../utils/format-number';
import { RankCalculatorSchema } from '../../[player]/submit-rank-calculator-validation';
import { ClueScrollTier } from '@/app/schemas/osrs';

export function CollectionLogAndCluesCard() {
  const {
    collectionLogSlotPoints,
    clueScrollTierPoints,
  } = useCollectionLogAndCluesPointCalculator();
  const {
    getValues,
    formState: { defaultValues },
  } = useFormContext<RankCalculatorSchema>();
  const collectionLogTotal = getValues('collectionLogTotal');
  const ehc = getValues('ehc')

  return (
    <DataCard.Root>
      <DataCard.Row
        left={
          <Flex gap="2" align="center">
            <Image
              alt="Collection log icon"
              src="/icons/collection-log.png"
              height={17}
              width={18}
              unoptimized
            />
            <Text role="heading" weight="medium" size="2">
              Collection Log & Clues
            </Text>
          </Flex>
        }
      />
      <Separator size="4" />
      <DataCard.Row
        left={
          <Text color="gray" size="2">
            Collection Log slots
          </Text>
        }
        center={
          <EditableText
            aria-label="Collection log count"
            name="collectionLogCount"
            type="number"
            required
            min={0}
            max={collectionLogTotal}
            defaultValue={defaultValues?.collectionLogCount}
            readOnly
          />
        }
        right={
          <Text aria-label="Collection log slot points" color="gray" size="2">
            {formatNumber(collectionLogSlotPoints)}
          </Text>
        }
      />
      <DataCard.Row
        left={
          <Text color="gray" size="2">
            EHC
          </Text>
        }
        center={
          <Text size="2" style={{ color: 'white' }}>
            {formatNumber(ehc)}
          </Text>
        }
        right={
          <Text aria-label="EHC points" color="gray" size="2">
            {formatNumber(0)}
          </Text>
        }
      />
      {ClueScrollTier.options.map((tier) => (
        <DataCard.Row
          key={tier}
          left={
            <Text color="gray" size="2">
              {tier} clues
            </Text>
          }
          center={
            <EditableText
              aria-label={`${tier} clue count`}
              name={`clueScrollCounts.${tier}`}
              type="number"
              required
              min={0}
              defaultValue={defaultValues?.clueScrollCounts?.[tier]}
              readOnly
            />
          }
          right={
            <Text
              aria-label={`${tier} clue scroll points`}
              color="gray"
              size="2"
            >
              {formatNumber(clueScrollTierPoints[tier])}
            </Text>
          }
        />
      ))}
    </DataCard.Root>
  );
}
