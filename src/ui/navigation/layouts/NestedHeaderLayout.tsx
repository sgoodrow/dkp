import { uiRoutes } from "@/app/uiRoutes";
import { ArrowBack } from "@mui/icons-material";
import {
  Box,
  Divider,
  IconButton,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import { ReactNode } from "react";

export const NestedHeaderLayout: FCWithChildren<{
  name?: string;
  actions?: ReactNode;
}> = ({ name, actions, children }) => {
  return (
    <Stack spacing={3} flexGrow={1}>
      <Box>
        <Stack direction="row" spacing={1} alignItems="center">
          <IconButton href={uiRoutes.raidActivities.href()}>
            <ArrowBack />
          </IconButton>
          <Typography width={1} variant="h2">
            {name || <Skeleton />}
          </Typography>
          {actions && (
            <Divider sx={{ flexGrow: 1, alignSelf: "center", pt: 1 }} />
          )}
          {actions}
        </Stack>
      </Box>
      {children}
      <Box pt={1} />
    </Stack>
  );
};
