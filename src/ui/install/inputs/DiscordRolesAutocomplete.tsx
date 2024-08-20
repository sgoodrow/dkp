"use client";

import { trpc } from "@/api/views/trpc/trpc";
import { Autocomplete, TextField, TextFieldProps } from "@mui/material";
import { FC } from "react";

export const DiscordRolesAutocomplete: FC<{
  discordServerId: string;
  label: string;
  value: string;
  required?: boolean;
  autoFocus?: boolean;
  fullWidth?: boolean;
  error?: TextFieldProps["error"];
  helperText?: TextFieldProps["helperText"];
  onChange: (newValue: string) => void;
}> = ({
  discordServerId,
  label,
  value,
  required,
  autoFocus,
  fullWidth,
  error,
  helperText,
  onChange,
}) => {
  const { data = [], isLoading } = trpc.discord.getServerRoles.useQuery(
    { discordServerId },
    { enabled: !!discordServerId },
  );
  const options = data.map((o) => ({
    id: o.roleId,
    label: o.name,
  }));

  return (
    <Autocomplete
      isOptionEqualToValue={(a, b) => a.id === b.id}
      value={options.find((o) => o.id === value) || null}
      onChange={(_, newValue) => {
        onChange(newValue?.id || "");
      }}
      options={options}
      loading={isLoading}
      fullWidth={fullWidth}
      autoFocus={autoFocus}
      // disabled={!discordServerId}
      autoHighlight
      autoSelect
      renderInput={(params) => (
        <TextField
          {...params}
          required={required}
          label={label}
          helperText={helperText}
          error={error}
        />
      )}
    />
  );
};
