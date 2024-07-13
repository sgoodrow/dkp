import { FC } from "react";
import { ApiKeysCard } from "@/ui/apiKeys/cards/ApiKeyCard";
import { Stack } from "@mui/material";

export const ApiKeysRoutePage: FC<{}> = () => {
  return (
    <Stack spacing={1}>
      <ApiKeysCard />
    </Stack>
  );
};
