import { Flex, Separator, Text } from '@radix-ui/themes';
import {
  DiaryLocation,
  DiaryTier,
  maximumTotalLevel,
  minimumTotalLevel,
} from '@/app/schemas/osrs';
import Image from 'next/image';
import { useFormContext } from 'react-hook-form';
import { DataCard } from '../data-card';
import { Select } from '../select';
import { EditableText } from '../editable-text';
import { useSkillingPointCalculator } from '../../hooks/point-calculator/skilling/use-skilling-point-calculator';
import { formatNumber } from '../../utils/format-number';
import { RankCalculatorSchema } from '../../[player]/submit-rank-calculator-validation';
import { ValidationTooltip } from '../validation-tooltip';
import { Checkbox } from '../checkbox';
import { isAchievementDiaryCapeAchieved } from '../../utils/is-achievement-diary-cape-achieved';

export function SkillingCard() {
  const {
    totalLevelPoints,
    achievementDiariesPoints,
    ehpPoints,
    achievementDiaryCapePoints,
  } = useSkillingPointCalculator();
  const {
    formState: { defaultValues, errors },
    getValues,
    setValue,
  } = useFormContext<RankCalculatorSchema>();
  const hasAchievementDiaryCape = getValues('hasAchievementDiaryCape');

  return (
    <DataCard.Root>
      <DataCard.Row
        left={
          <Flex gap="2" align="center">
            <Image
              alt="Skills icon"
              src="/icons/skills.png"
              height={18}
              width={18}
              unoptimized
            />
            <Text role="heading" weight="medium" size="2">
              Skilling
            </Text>
          </Flex>
        }
      />
      <Separator size="4" />
      <DataCard.Row
        left={
          <Text color="gray" weight="medium" size="2">
            Category
          </Text>
        }
      />
      <DataCard.Row
        left={
          <Text color="gray" size="2">
            EHP
          </Text>
        }
        center={
          <EditableText
            aria-label="Efficient hours played value"
            name="ehp"
            required
            type="number"
            min={0}
            defaultValue={defaultValues?.ehp}
            readOnly
          />
        }
        right={
          <Text
            aria-label="Efficient hours played points"
            color="gray"
            size="2"
          >
            {formatNumber(ehpPoints)}
          </Text>
        }
      />
      <DataCard.Row
        left={
          <Text color="gray" size="2">
            Total level
          </Text>
        }
        center={
          <EditableText
            aria-label="Total level value"
            name="totalLevel"
            required
            type="number"
            min={minimumTotalLevel}
            max={maximumTotalLevel}
            defaultValue={defaultValues?.totalLevel}
            readOnly
          />
        }
        right={
          <Text aria-label="Total level points" color="gray" size="2">
            {formatNumber(totalLevelPoints)}
          </Text>
        }
      />
      {DiaryLocation.options.map((location) => (
        <DataCard.Row
          key={location}
          left={
            <Text color="gray" size="2">
              {location}
            </Text>
          }
          center={
            <Select<RankCalculatorSchema>
              aria-label={`${location} diary value`}
              name={`achievementDiaries.${location}`}
              placeholder="Choose a tier"
              options={DiaryTier.options}
              onValueChange={() => {
                const achievementDiaries = getValues('achievementDiaries');

                setValue(
                  'hasAchievementDiaryCape',
                  isAchievementDiaryCapeAchieved(achievementDiaries),
                );
              }}
            />
          }
          right={
            <Text aria-label={`${location} diary points`} color="gray" size="2">
              {formatNumber(achievementDiariesPoints[location])}
            </Text>
          }
        />
      ))}
      <DataCard.Row
        left={
          <ValidationTooltip
            error={errors.hasAchievementDiaryCape}
            color="gray"
            size="2"
          >
            <Text>Diary cape</Text>
          </ValidationTooltip>
        }
        center={
          <Checkbox
            name="hasAchievementDiaryCape"
            checked={hasAchievementDiaryCape}
            disabled
          />
        }
        right={
          <Text
            aria-label="Achievement diary cape points"
            color="gray"
            size="2"
          >
            {formatNumber(achievementDiaryCapePoints)}
          </Text>
        }
      />

    </DataCard.Root>
  );
}
