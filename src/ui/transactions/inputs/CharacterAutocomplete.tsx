"use client";

import { trpc } from "@/api/views/trpc/trpc";
import { Autocomplete, TextField } from "@mui/material";
import { FC, useState } from "react";
import { useDebounceValue } from "usehooks-ts";

export const CharacterAutocomplete: FC<{
  label: string;
  onChange: (newValue: number) => void;
  defaultValue?: { id: number; label: string };
}> = ({ label, onChange, defaultValue }) => {
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounceValue(search, 300);

  const { data = [], isLoading } = trpc.character.getByNameIncludes.useQuery({
    search: debouncedSearch,
    take: 100,
  });

  return (
    <Autocomplete
      defaultValue={defaultValue}
      filterOptions={(x) => x}
      isOptionEqualToValue={(a, b) => a.id === b.id}
      inputValue={search}
      onInputChange={(e, newValue) => {
        e?.stopPropagation();
        setSearch(newValue);
      }}
      onChange={(e, newValue) => {
        e?.stopPropagation();
        onChange(newValue?.id || -1);
      }}
      options={data.map((p) => ({
        id: p.id,
        label: p.name,
      }))}
      loading={isLoading}
      fullWidth
      autoHighlight
      autoSelect
      renderInput={(params) => (
        <TextField {...params} required autoFocus label={label} />
      )}
    />
  );
};
