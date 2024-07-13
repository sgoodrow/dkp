import { SvgIcon } from "@mui/material";
import { CustomSvgIconProps } from "@/ui/shared/types/icons";
import { PlayArrowOutlined } from "@mui/icons-material";

export const TriangleDownIcon = (props: Omit<CustomSvgIconProps, "sx">) => {
  return (
    <SvgIcon
      {...props}
      component={PlayArrowOutlined}
      inheritViewBox
      sx={{ transform: "rotate(90deg)" }}
    />
  );
};
