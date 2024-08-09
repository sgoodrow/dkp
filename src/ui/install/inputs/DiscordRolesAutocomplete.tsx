"use client";

import { trpc } from "@/api/views/trpc/trpc";
import { Autocomplete, TextField, TextFieldProps } from "@mui/material";
import { FC } from "react";

export const DiscordRolesAutocomplete: FC<{
  discordServerId: string;
  label: string;
  defaultValue?: string;
  disabled?: boolean;
  required?: boolean;
  autoFocus?: boolean;
  fullWidth?: boolean;
  helperText?: TextFieldProps["helperText"];
  onChange: (newValue: string) => void;
}> = ({
  discordServerId,
  label,
  defaultValue,
  disabled,
  required,
  autoFocus,
  fullWidth,
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
      defaultValue={options.find((o) => o.id === defaultValue)}
      isOptionEqualToValue={(a, b) => a.id === b.id}
      onChange={(_, newValue) => {
        onChange(newValue?.id || "");
      }}
      options={options}
      loading={isLoading}
      fullWidth={fullWidth}
      autoFocus={autoFocus}
      disabled={disabled}
      autoHighlight
      autoSelect
      renderInput={(params) => (
        <TextField
          {...params}
          required={required}
          label={label}
          helperText={helperText}
        />
      )}
    />
  );
};
