import { Box, FormControlLabel, FormHelperText, Switch } from "@mui/material";
import { FC } from "react";

export const LabeledSwitch: FC<{
  label: string;
  helperText: string;
  switched: boolean;
  onChange: (checked: boolean) => void;
}> = ({ label, helperText, switched, onChange }) => {
  return (
    <Box>
      <FormControlLabel
        sx={{
          ml: 0,
          width: "100%",
        }}
        control={
          <Switch
            value={switched}
            onChange={(e) => onChange(e.target.checked)}
          />
        }
        label={label}
      />
      <FormHelperText>{helperText}</FormHelperText>
    </Box>
  );
};
