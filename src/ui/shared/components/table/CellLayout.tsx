import { Stack, StackProps } from "@mui/material";

export const CellLayout: FCWithChildren<StackProps> = ({
  height = "100%",
  lineHeight = "normal",
  justifyContent = "center",
  children,
  ...rest
}) => (
  <Stack
    height={height}
    lineHeight={lineHeight}
    justifyContent={justifyContent}
    {...rest}
  >
    {children}
  </Stack>
);
