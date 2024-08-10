"use client";

import { trpc } from "@/api/views/trpc/trpc";
import { Autocomplete, TextField, TextFieldProps } from "@mui/material";
import { FC } from "react";

export const DiscordServerAutocomplete: FC<{
  label: string;
  required?: boolean;
  autoFocus?: boolean;
  fullWidth?: boolean;
  helperText?: TextFieldProps["helperText"];
  onChange: (newValue: string) => void;
}> = ({ label, required, autoFocus, fullWidth, helperText, onChange }) => {
  const { data = [], isLoading } = trpc.discord.getUserServers.useQuery();
  const options = data.map((o) => ({
    id: o.id,
    label: o.name,
  }));

  return (
    <Autocomplete
      isOptionEqualToValue={(a, b) => a.id === b.id}
      onChange={(_, newValue) => {
        onChange(newValue?.id || "");
      }}
      options={options}
      loading={isLoading}
      fullWidth={fullWidth}
      autoFocus={autoFocus}
      autoHighlight
      autoSelect
      renderInput={(params) => (
        <TextField
          {...params}
          required={required}
          label={label}
          autoFocus={autoFocus}
          helperText={helperText}
        />
      )}
    />
  );
};
