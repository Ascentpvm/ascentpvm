import { Flex, Separator, Text } from '@radix-ui/themes';
import Image from 'next/image';
import { useFormContext } from 'react-hook-form';
import { CombatAchievementTier, TzHaarCape } from '@/app/schemas/osrs';
import { customDiaryTierNameByBonusPoints } from '@/config/custom-diaries';
import { DataCard } from '../data-card';
import { Select } from '../select';
import { EditableText } from '../editable-text';
import { useCombatPointCalculator } from '../../hooks/point-calculator/combat/use-combat-point-calculator';
import { formatNumber } from '../../utils/format-number';
import { RankCalculatorSchema } from '../../[player]/submit-rank-calculator-validation';
import { Checkbox } from '../checkbox';
import { ValidationTooltip } from '../validation-tooltip';

export function CombatCard() {
  const {
    combatAchievementTierPoints,
    ehbPoints,
    tzhaarCapePoints,
    bloodTorvaPoints,
    dizanasQuiverPoints,
    radiantOathplatePoints,
    bonusPointsAwarded,
  } = useCombatPointCalculator();
  const {
    formState: { defaultValues, errors },
    getValues,
  } = useFormContext<RankCalculatorSchema>();
  const [hasBloodTorva, hasDizanasQuiver, hasRadiantOathplate] = getValues([
    'hasBloodTorva',
    'hasDizanasQuiver',
    'hasRadiantOathplate',
  ]);

  return (
    <DataCard.Root>
      <DataCard.Row
        left={
          <Flex gap="2" align="center">
            <Image
              alt="Combat icon"
              src="/icons/combat.png"
              height={18}
              width={18}
              unoptimized
            />
            <Text role="heading" weight="medium" size="2">
              Combat
            </Text>
          </Flex>
        }
        right={'-'}
      />
      <Separator size="4" />
      <DataCard.Row
        left={
          <Text color="gray" size="2">
            EHB
          </Text>
        }
        center={
          <EditableText
            aria-label="Efficient hours bossed value"
            name="ehb"
            type="number"
            required
            min={0}
            defaultValue={defaultValues?.ehb}
            readOnly
          />
        }
        right={
          <Text
            aria-label="Efficient hours bossed points"
            color="gray"
            size="2"
          >
            {formatNumber(ehbPoints)}
          </Text>
        }
      />
      <DataCard.Row
        left={
          <Text color="gray" size="2">
            CA Tier
          </Text>
        }
        center={
          <Select
            aria-label="Combat achievement tier value"
            name="combatAchievementTier"
            placeholder="Choose a tier"
            options={CombatAchievementTier.options}
          />
        }
        right={
          <Text
            aria-label="Combat achievement tier points"
            color="gray"
            size="2"
          >
            {formatNumber(combatAchievementTierPoints)}
          </Text>
        }
      />
      <DataCard.Row
        left={
          <Text color="gray" size="2">
            TzHaar cape
          </Text>
        }
        center={
          <Select
            aria-label="TzHaar cape value"
            name="tzhaarCape"
            placeholder="Select a cape"
            options={TzHaarCape.options}
          />
        }
        right={
          <Text aria-label="TzHaar cape points" color="gray" size="2">
            {formatNumber(tzhaarCapePoints)}
          </Text>
        }
      />
      <DataCard.Row
        left={
          <ValidationTooltip
            error={errors.hasDizanasQuiver}
            color="gray"
            size="2"
          >
            <Text>Dizana&apos;s quiver</Text>
          </ValidationTooltip>
        }
        center={<Checkbox name="hasDizanasQuiver" checked={hasDizanasQuiver} />}
        right={
          <Text aria-label="Dizana's quiver points" color="gray" size="2">
            {formatNumber(dizanasQuiverPoints)}
          </Text>
        }
      />
      <DataCard.Row
        left={
          <ValidationTooltip error={errors.hasBloodTorva} color="gray" size="2">
            <Text>Blood torva</Text>
          </ValidationTooltip>
        }
        center={<Checkbox name="hasBloodTorva" checked={hasBloodTorva} />}
        right={
          <Text aria-label="Blood torva points" color="gray" size="2">
            {formatNumber(bloodTorvaPoints)}
          </Text>
        }
      />
      <DataCard.Row
        left={
          <ValidationTooltip error={errors.hasBloodTorva} color="gray" size="2">
            <Text>Radiant oathplate</Text>
          </ValidationTooltip>
        }
        center={
          <Checkbox name="hasRadiantOathplate" checked={hasRadiantOathplate} />
        }
        right={
          <Text aria-label="Radiant oathplate points" color="gray" size="2">
            {formatNumber(radiantOathplatePoints)}
          </Text>
        }
      />
      <DataCard.Row
        left={
          <Text color="gray" size="2">
            Ascent Diary Tier
          </Text>
        }
        center={
          <Text aria-label="Combat diary tier" size="2">
            {customDiaryTierNameByBonusPoints[bonusPointsAwarded] ?? 'None'}
          </Text>
        }
        right={
          <Text aria-label="Combat point bonus multiplier" size="2">
            {bonusPointsAwarded ? `+${formatNumber(bonusPointsAwarded)}` : '-'}
          </Text>
        }
      />
    </DataCard.Root>
  );
}
