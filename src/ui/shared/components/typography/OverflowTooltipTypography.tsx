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
  const [isOverflowed, setIsOverflowed] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const handleHover = (hover: boolean) => {
    if (!ref.current) {
      return;
    }
    setIsOverflowed(hover && ref.current.scrollWidth > ref.current.clientWidth);
  };

  return (
    <Tooltip
      onMouseEnter={() => handleHover(true)}
      onMouseLeave={() => handleHover(false)}
      disableHoverListener={!isOverflowed && !tooltip}
      disableInteractive
      title={typeof children === "string" && isOverflowed ? children : tooltip}
      open={tooltip === undefined ? isOverflowed : undefined}
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
