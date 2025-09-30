import { memo } from 'react';
import { Box, Card, Flex, Separator, Table, Text } from '@radix-ui/themes';
import { FieldError, useWatch } from 'react-hook-form';
import { Item } from '@/app/schemas/items';
import { formatWikiImageUrl } from '../utils/format-wiki-url';
import { MemoisedItem } from './item';
import { stripEntityName } from '../utils/strip-entity-name';
import { EntityImage } from './entity-image';
import { parseInitials } from '../utils/parse-initials';
import { formatPercentage } from '../utils/format-percentage';
import { RankCalculatorSchema } from '../[player]/submit-rank-calculator-validation';

interface CategoryProps {
  title: string;
  image?: string;
  items: Item[];
  errors: (FieldError | undefined)[];
  query?: string;
}

export const Category = memo(
  ({
    title,
    items,
    image = formatWikiImageUrl(title, 'category'),
    errors,
    query,
  }: CategoryProps) => {
    // Create a map of item names to their acquired status
    const itemNames = items.map(({ name }) => stripEntityName(name));
    const fieldsArray = useWatch<RankCalculatorSchema, `acquiredItems.${string}`[]>({
      name: itemNames.map((name) => `acquiredItems.${name}` as const),
    });
    // Map item name to acquired value
    const fields: Record<string, boolean> = {};
    itemNames.forEach((name, idx) => {
      fields[name] = !!fieldsArray[idx];
    });
    // Map item name to error
    const errorsMap: Record<string, FieldError | undefined> = {};
    itemNames.forEach((name, idx) => {
      errorsMap[name] = errors[idx];
    });
    const completedCount = Object.values(fields).filter(Boolean).length;
    const percentComplete = formatPercentage(completedCount / items.length, 0);
    const queryLower = query?.toLowerCase() ?? '';

    const matchesCategory = title.toLowerCase().includes(queryLower);
    const visibleItems = items.filter(
      (item) => matchesCategory || item.name.toLowerCase().includes(queryLower),
    );
    if (!matchesCategory && visibleItems.length === 0) {
      return null;
    }

    return (
      <Card my="3">
        <Flex justify="between" align="center">
          <Flex align="center" gap="3">
            <EntityImage
              alt={`${title} icon`}
              src={image}
              size="3"
              height={40}
              width={40}
              fallback={parseInitials(title)}
            />
            <Box>
              <Box>
                <Text size="2" weight="medium">
                  {title}
                </Text>
              </Box>
              <Box>
                <Text aria-label={`${title} item count`} size="2" color="gray">
                  {`${completedCount} / ${items.length}`}
                </Text>
              </Box>
            </Box>
          </Flex>
          <Text
            aria-label={`${title} percentage complete`}
            color={percentComplete === '100%' ? 'green' : undefined}
            weight="medium"
            size="4"
          >
            {percentComplete}
          </Text>
        </Flex>
        <Separator
          size="4"
          my="3"
          style={{ backgroundColor: 'var(--accent-a4)' }}
        />
        <Table.Root size="1">
          <Table.Header>
            <Table.Row>
              <Text asChild weight="medium">
                <Table.ColumnHeaderCell>Item name</Table.ColumnHeaderCell>
              </Text>
              <Text asChild weight="medium">
                <Table.ColumnHeaderCell align="right">
                  Acquired?
                </Table.ColumnHeaderCell>
              </Text>
              <Text asChild weight="medium">
                <Table.ColumnHeaderCell width="100px" align="right">
                  Points
                </Table.ColumnHeaderCell>
              </Text>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {visibleItems.length > 0 ? (
              visibleItems.map((item) => {
                const nameKey = stripEntityName(item.name);
                return (
                  <MemoisedItem
                    key={item.name}
                    acquired={!!fields[nameKey]}
                    item={item}
                    error={errorsMap[nameKey]}
                  />
                );
              })
            ) : (
              <Table.Row>
                <Table.Cell colSpan={3}>
                  <Text size="2" color="gray">
                    No matching items
                  </Text>
                </Table.Cell>
              </Table.Row>
            )}
          </Table.Body>
        </Table.Root>
      </Card>
    );
  },
);

Category.displayName = 'Category';
