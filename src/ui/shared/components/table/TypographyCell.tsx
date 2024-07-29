import { CellLayout } from "@/ui/shared/components/table/CellLayout";
import { OverflowTooltipTypography } from "@/ui/shared/components/typography/OverflowTooltipTypography";
import { TypographyProps } from "@mui/material";

export const TypographyCell: FCWithChildren<{
  color?: TypographyProps["color"];
  variant?: TypographyProps["variant"];
}> = ({ children, color, variant }) => {
  return (
    <CellLayout>
      <OverflowTooltipTypography
        height="100%"
        alignContent="center"
        color={color}
        placement="left"
        variant={variant}
      >
        {children}
      </OverflowTooltipTypography>
    </CellLayout>
  );
};
