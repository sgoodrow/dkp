import { Box, Divider, Stack, Typography } from "@mui/material";
import { ReactNode } from "react";

// Ensures that actions of varying heights do not alter the vertical space
// occupied by the header.
const HEADER_HEIGHT = "32px";

export const HeaderLayout: FCWithChildren<{
  uiRoute: {
    name: string;
    description: string;
  };
  actions?: ReactNode;
}> = ({ uiRoute, actions, children }) => {
  return (
    <Stack spacing={3} flexGrow={1}>
      <Box>
        <Stack
          direction="row"
          spacing={1}
          alignItems="baseline"
          height={HEADER_HEIGHT}
        >
          <Typography variant="h2">{uiRoute.name}</Typography>
          {actions && (
            <Divider sx={{ flexGrow: 1, alignSelf: "center", pt: 1 }} />
          )}
          {actions}
        </Stack>
        <Typography variant="subtitle2">{uiRoute.description}</Typography>
      </Box>
      {children}
      <Box pt={1} />
    </Stack>
  );
};
