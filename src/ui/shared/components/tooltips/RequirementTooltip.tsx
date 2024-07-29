import { Check, CheckBoxOutlineBlank } from "@mui/icons-material";
import { Stack, Typography } from "@mui/material";
import { FC } from "react";

export const RequirementTooltip: FC<{
  label: string;
  satisfied: boolean;
  hidden?: boolean;
}> = ({ label, satisfied, hidden }) => {
  return hidden ? null : (
    <Stack direction="row" alignItems="center" spacing={0.5}>
      {satisfied ? (
        <Check fontSize="inherit" />
      ) : (
        <CheckBoxOutlineBlank fontSize="inherit" />
      )}
      <Typography fontSize="inherit">{label}</Typography>
    </Stack>
  );
};
