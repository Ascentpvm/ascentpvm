'use client';

import { Text, Flex, Switch } from '@radix-ui/themes';
import { useState, useCallback, useEffect } from "react";
import { MixerHorizontalIcon } from "@radix-ui/react-icons";
import { DataCard } from '../data-card';
import { Input } from '../input';

export function SearchCard({
  query,
  onChange,
}: {
  query: string;
  onChange: (value: string) => void;
}) {

    // ---------- helpers: target ONLY center cards/rows (no :has()) ----------
  const centerCards = useCallback((): HTMLElement[] => {
    const set = new Set<HTMLElement>();
    document.querySelectorAll(".rt-TableRoot").forEach((root) => {
      const card = (root as HTMLElement).closest<HTMLElement>(".rt-BaseCard");
      if (card) set.add(card);
    });
    return Array.from(set);
  }, []);

  const centerRows = useCallback((): NodeListOf<HTMLElement> => {
    return document.querySelectorAll<HTMLElement>(".rt-TableRoot .rt-TableBody .rt-TableRow");
  }, []);
  // ------------------------------------------------------------------------

  const [missingOnly, setMissingOnly] = useState(false);

  const resetView = useCallback(() => {
    centerRows().forEach((r) => (r.style.display = ""));
    centerCards().forEach((c) => (c.style.display = ""));
  }, [centerCards, centerRows]);

  const applyMissingOnly = useCallback(() => {
    // Hide acquired rows in center
    centerRows().forEach((row) => {
      const cb = row.querySelector<HTMLInputElement>('input[type="checkbox"]');
      row.style.display = cb?.checked ? "none" : "";
    });
    // Hide 100% center cards or cards with no visible rows left
    centerCards().forEach((card) => {
      const pct = card.querySelector<HTMLSpanElement>('span[aria-label$="percentage complete"]');
      const isHundred = pct && pct.textContent?.trim() === "100%";
      const hasVisibleRow = card.querySelector(".rt-TableBody .rt-TableRow:not([style*='display: none'])");
      if (isHundred || !hasVisibleRow) card.style.display = "none";
    });
  }, [centerCards, centerRows]);

  // Load persisted toggle
  useEffect(() => {
    try {
      if (localStorage.getItem("missingOnly") === "1") setMissingOnly(true);
    } catch {
      console.log("Failed to read missingOnly from localStorage");
    }
  }, []);

  // Apply/reset when toggle changes
  useEffect(() => {
    resetView();
    if (missingOnly) applyMissingOnly();
  }, [missingOnly, resetView, applyMissingOnly]);

  // Persist toggle
  useEffect(() => {
    try {
      localStorage.setItem("missingOnly", missingOnly ? "1" : "0");
    } catch {
      console.log("Failed to write missingOnly to localStorage");
    }
  }, [missingOnly]);

  // Re-apply after SPA DOM updates while enabled
  useEffect(() => {
    if (!missingOnly) return;
    const mo = new MutationObserver(() => applyMissingOnly());
    mo.observe(document.documentElement, { childList: true, subtree: true });
    return () => mo.disconnect();
  }, [missingOnly, applyMissingOnly]);


  return (
    <DataCard.Root>
      <DataCard.Row
        left={<Text weight="medium">Search</Text>}
        right={<Text>Explore your clog</Text>}
      />
      <DataCard.Row
        right={
          <Flex align="center" gap="2">
              <MixerHorizontalIcon />
              <Text color="gray">Show Missing</Text>
              <Switch
                checked={missingOnly}
                onCheckedChange={setMissingOnly}
                size="2"
                color="gray"
                variant="soft"
                aria-label="Show only missing items"
              />
            </Flex>
        }
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
