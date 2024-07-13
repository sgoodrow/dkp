"use client";
import {
  Tooltip,
  TooltipProps,
  Typography,
  TypographyProps,
} from "@mui/material";
import { useRef, useState } from "react";

type Props = Omit<TypographyProps, "ref" | "noWrap" | "children"> & {
  children: string | React.ReactNode;
  placement?: TooltipProps["placement"];
};

export const OverflowTooltipTypography: React.FC<Props> = ({
  children,
  placement,
  ...typographyProps
}) => {
  const [isOverflowed, setIsOverflowed] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const handleHover = (hover: boolean) => {
    if (!ref.current) {
      return;
    }
    setIsOverflowed(hover && ref.current.scrollWidth > ref.current.clientWidth);
  };

  const title = typeof children === "string" ? children : undefined;

  return (
    <Tooltip
      onMouseEnter={() => handleHover(true)}
      onMouseLeave={() => handleHover(false)}
      disableHoverListener={!isOverflowed}
      title={title}
      open={isOverflowed}
      placement={placement}
    >
      <Typography ref={ref} {...typographyProps} aria-label={undefined} noWrap>
        {children}
      </Typography>
    </Tooltip>
  );
};
