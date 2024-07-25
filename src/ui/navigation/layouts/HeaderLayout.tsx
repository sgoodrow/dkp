import { Box, Divider, Stack, Typography } from "@mui/material";
import { ReactNode } from "react";

// Ensures that actions of varying heights do not alter the vertical space
// occupied by the header.
const HEADER_HEIGHT = "32px";

export const HeaderLayout: FCWithChildren<{
  title: string;
  subtitle: string;
  actions?: ReactNode;
}> = ({ title, subtitle, actions, children }) => {
  return (
    <Stack spacing={3} flexGrow={1}>
      <Stack>
        <Stack
          direction="row"
          spacing={1}
          alignItems="baseline"
          height={HEADER_HEIGHT}
        >
          <Typography variant="h2">{title}</Typography>
          <Divider sx={{ flexGrow: 1, alignSelf: "center", pt: 1 }} />
          {actions}
        </Stack>
        <Typography variant="subtitle2">{subtitle}</Typography>
      </Stack>
      {children}
      <Box pt={1} />
    </Stack>
  );
};
