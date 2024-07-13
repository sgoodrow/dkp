import { Box, Stack } from "@mui/material";
import { ReactNode } from "react";

// Ensures that actions of varying heights do not alter the vertical space
// occupied by the header.
const HEADER_HEIGHT = "32px";

export const HeaderLayout: FCWithChildren<{
  breadcrumbs: ReactNode;
  actions?: ReactNode;
}> = ({ breadcrumbs, children, actions }) => {
  return (
    <Stack spacing={2} flexGrow={1}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="flex-start"
        height={HEADER_HEIGHT}
      >
        {breadcrumbs}
        {actions}
      </Box>
      {children}
      <Box pt={1} />
    </Stack>
  );
};
