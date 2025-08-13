"use client";
import { ReactNode, useState, useCallback, useEffect } from "react";
import { useWatch } from "react-hook-form";
import { Box, Flex, IconButton, Text, Switch } from "@radix-ui/themes";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeftIcon, MixerHorizontalIcon } from "@radix-ui/react-icons";
import { useRank } from "../hooks/use-rank";
import { useRankCalculator } from "../hooks/point-calculator/use-rank-calculator";
import { getRankName } from "../utils/get-rank-name";
import { formatNumber } from "../utils/format-number";
import { getRankImageUrl } from "../utils/get-rank-image-url";

interface NavigationProps {
  actions: ReactNode;
  shouldRenderBackButton: boolean;
}

export function Navigation({ actions, shouldRenderBackButton }: NavigationProps) {
  const { pointsAwarded } = useRankCalculator();
  const { rank } = useRank(pointsAwarded);
  const rankName = getRankName(rank);

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
      (row as HTMLElement).style.display = cb && cb.checked ? "none" : "";
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
    } catch {}
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
    } catch {}
  }, [missingOnly]);

  // Re-apply after SPA DOM updates while enabled
  useEffect(() => {
    if (!missingOnly) return;
    const mo = new MutationObserver(() => applyMissingOnly());
    mo.observe(document.documentElement, { childList: true, subtree: true });
    return () => mo.disconnect();
  }, [missingOnly, applyMissingOnly]);

  return (
    <Box
      asChild
      p="3"
      gridArea="nav"
      position={{ initial: "fixed", md: "static" }}
      right={{ initial: "0", md: "auto" }}
      left={{ initial: "0", md: "auto" }}
      style={{
        background: "var(--color-background)",
        borderBottom: "1px solid var(--gray-5)",
        zIndex: 100,
      }}
    >
      <Flex align="center" justify="between" asChild>
        <nav role="navigation">
          <Flex gap="3" align="center">
            {shouldRenderBackButton && (
              <IconButton asChild color="gray" variant="soft">
                <Link href="/rank-calculator">
                  <ChevronLeftIcon />
                </Link>
              </IconButton>
            )}
            <Text
              size="2"
              as="div"
              style={{
                // @ts-expect-error custom CSS var
                "--line-height": "normal",
              }}
            >
              <Flex align="center" gap="1">
                <Text weight="medium">Rank:</Text>
                <Text color="gray">{rankName}</Text>
                <Box asChild display="inline-block">
                  {rank ? (
                    <Image
                      alt={`${rank} icon`}
                      src={getRankImageUrl(rank)}
                      width={18}
                      height={18}
                      unoptimized
                    />
                  ) : null}
                </Box>
              </Flex>
              <Text as="div">
                <Text weight="medium">Points:</Text>{" "}
                <Text color="gray">{formatNumber(pointsAwarded)}</Text>
              </Text>
            </Text>
          </Flex>

          <Flex align="center" justify="end" gap="2">
            {actions}

            {/* Radix Themes Switch + label */}
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
          </Flex>
        </nav>
      </Flex>
    </Box>
  );
}
