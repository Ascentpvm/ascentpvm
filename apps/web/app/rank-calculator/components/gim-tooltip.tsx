"use client";

import React from "react";
import { Text, IconButton, Tooltip } from "@radix-ui/themes";

export function GimTooltip() {
  return (
    <div style={{ position: "fixed", bottom: 40, right: 24, zIndex: 1000 }}>
      <Tooltip
        content={
            <Text size="3" as="span">
              <strong>GIM players:</strong> if you have received an item from your
              teammates, and it is not on your clog, you must manually mark it on
              your rank sheet.
            </Text>
        }
        side="left"
        align="center"
        delayDuration={0}
      >
        <IconButton
          aria-label="Show GIM info"
          variant="surface"
          size="3"
          style={{
            borderRadius: "50%",
            fontWeight: "bold",
            fontSize: 28,
          }}
        >
          !
        </IconButton>
      </Tooltip>
    </div>
  );
}