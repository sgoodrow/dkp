"use client";

import {
  Tooltip,
  TooltipProps,
  Typography,
  TypographyProps,
} from "@mui/material";
import { useRef, useState } from "react";

type Props = Omit<TypographyProps, "ref" | "noWrap" | "title" | "children"> & {
  children: string | React.ReactNode;
  placement?: TooltipProps["placement"];
  tooltip?: TooltipProps["title"];
};

export const OverflowTooltipTypography: React.FC<Props> = ({
  children,
  placement,
  tooltip,
  ...typographyProps
}) => {
  const [isActive, setIsActive] = useState({
    hovered: false,
    overflowed: false,
  });
  const ref = useRef<HTMLDivElement>(null);
  const text = typeof children === "string" ? children : tooltip;
  const title = isActive.overflowed ? text : tooltip;
  const open = isActive.overflowed || (isActive.hovered && !!tooltip);

  const handleHover = (hover: boolean) => {
    if (!ref.current) {
      return;
    }
    setIsActive({
      hovered: hover,
      overflowed: hover && ref.current.scrollWidth > ref.current.clientWidth,
    });
  };

  return (
    <Tooltip
      onMouseEnter={() => handleHover(true)}
      onMouseLeave={() => handleHover(false)}
      disableHoverListener={!isActive.hovered && !tooltip}
      disableInteractive
      title={title}
      open={open}
      placement={placement}
    >
      <Typography
        ref={ref}
        {...typographyProps}
        aria-label={undefined}
        noWrap
        title={""}
      >
        {children}
      </Typography>
    </Tooltip>
  );
};
