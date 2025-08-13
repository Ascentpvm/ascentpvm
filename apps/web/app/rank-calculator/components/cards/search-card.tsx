'use client';

import { Text, Flex } from '@radix-ui/themes';
import { DataCard } from '../data-card';
import { Input } from '../input';

export function SearchCard({
  query,
  onChange,
}: {
  query: string;
  onChange: (value: string) => void;
}) {
  return (
    <DataCard.Root>
      <DataCard.Row
        left={<Text weight="medium">Search</Text>}
        right={<Text>Explore your clog</Text>}
      />
      <DataCard.Row
        right={<Text>Show Missing Clogs</Text>}

        left={<Input
        value={query}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search your clog..."
        size="1"
        hasError={false}
        />}
      />
          </DataCard.Root>
  );
}
