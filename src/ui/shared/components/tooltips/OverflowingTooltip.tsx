"use client";

import { MILLISECONDS } from "@/shared/constants/time";
import { Box, Tooltip, TooltipProps } from "@mui/material";
import { FC, useEffect, useRef, useState } from "react";
import { useDebounceCallback, useHover } from "usehooks-ts";

type Direction = "x" | "y";
const EDGE_TOLERANCE = 10;
const SCROLL_DEBOUNCE_DURATION = 300 * MILLISECONDS;

export const OverflowingTooltip: FC<Partial<TooltipProps>> = ({
  title = "Scroll for more.",
  placement = "bottom",
  ...rest
}) => {
  return (
    <Tooltip title={title} placement={placement} {...rest}>
      <Box />
    </Tooltip>
  );
};

export const useIsOverflowing = <T extends HTMLElement>(
  direction: Direction,
) => {
  const ref = useRef<T | null>(null);
  const [isScrollable, setIsScrollable] = useState(false);
  const [isOverflowingEnd, setIsOverflowingEnd] = useState(false);
  const isHovered = useHover(ref);

  const handleScroll = useDebounceCallback(() => {
    if (!ref.current) return;
    const el = ref.current;
    const position = direction === "x" ? el.scrollLeft : el.scrollTop;
    const parentSize = direction === "x" ? el.clientWidth : el.clientHeight;
    const scrollSize = direction === "x" ? el.scrollWidth : el.scrollHeight;

    setIsScrollable(scrollSize > parentSize);
    setIsOverflowingEnd(position + parentSize < scrollSize - EDGE_TOLERANCE);
  }, SCROLL_DEBOUNCE_DURATION);

  useEffect(() => {
    handleScroll();
  }, [handleScroll, isHovered]);

  return {
    ref,
    isOverflowing: isOverflowingEnd && isHovered,
    handleScroll,
    isScrollable,
  };
};
