"use client";

import { trpc } from "@/api/views/trpc/trpc";
import { FC } from "react";

import React, { useState } from "react";
import {
  TextField,
  Button,
  Stack,
  IconButton,
  InputAdornment,
  Typography,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { GenAiProviderName } from "@prisma/client";

export const OpenAiSettingsPaneClient: FC<{}> = ({}) => {
  const { data } = trpc.genAi.provider.getApiKeyIdByProviderName.useQuery({
    providerName: GenAiProviderName.OPENAI,
  });
  const utils = trpc.useUtils();
  const { mutate, isPending } = trpc.genAi.provider.upsertApiKey.useMutation({
    onSettled: () => {
      setApiKey("");
    },
    onSuccess: () => {
      utils.genAi.provider.getApiKeyIdByProviderName.invalidate();
    },
  });

  const [apiKey, setApiKey] = useState("");
  const [showApiKey, setShowApiKey] = useState(false);

  const handleSave = () => {
    if (!data) {
      return;
    }
    mutate({
      apiKeyId: data.id,
      providerId: data.providerId,
      apiKey,
    });
  };

  const isFormValid = !!apiKey;

  return (
    <>
      <Typography variant="subtitle1">OpenAI</Typography>
      <Stack spacing={1}>
        <TextField
          label="API Key"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          placeholder={data ? "redacted" : undefined}
          type={showApiKey === false ? "text" : "password"}
          fullWidth
          required
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowApiKey((s) => !s)}
                  aria-label={showApiKey ? "Hide API Key" : "Show API Key"}
                >
                  {showApiKey ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <Button
          variant="contained"
          type="submit"
          onClick={() => handleSave()}
          disabled={!isFormValid || isPending}
          fullWidth
        >
          Save
        </Button>
      </Stack>
    </>
  );
};
