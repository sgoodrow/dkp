"use client";

import { FC } from "react";

export const FlagEmoji: FC<{
  value?: boolean;
}> = ({ value }) => {
  return value === undefined ? "❔" : value ? "✅" : "👎";
};
