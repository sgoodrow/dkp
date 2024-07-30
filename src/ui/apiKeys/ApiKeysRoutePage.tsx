import { FC } from "react";
import { ApiKeysCard } from "@/ui/apiKeys/cards/ApiKeyCard";
import { Stack } from "@mui/material";
import { TestButton } from "@/ui/apiKeys/buttons/TestButton";

export const ApiKeysRoutePage: FC<{}> = () => {
  return (
    <Stack spacing={1}>
      <ApiKeysCard />
      <TestButton />
    </Stack>
  );
};
