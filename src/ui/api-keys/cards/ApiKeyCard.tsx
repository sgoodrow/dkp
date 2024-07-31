"use client";

import { trpc } from "@/api/views/trpc/trpc";
import { CreateApiKeyDialogButton } from "@/ui/api-keys/buttons/CreateApiKeyDialogButton";
import { LabeledCard } from "@/ui/shared/components/cards/LabeledCard";
import { RemoveCircle } from "@mui/icons-material";
import { IconButton, Skeleton, Stack, Typography } from "@mui/material";
import dayjs from "dayjs";
import { FC } from "react";

const LABEL_ID = "api-keys-card";

export const ApiKeysCard: FC = () => {
  const utils = trpc.useUtils();
  const { data: apiKeys } = trpc.apiKey.getAll.useQuery();
  const { mutate: deleteApiKey } = trpc.apiKey.delete.useMutation({
    onSuccess: () => {
      utils.apiKey.getAll.invalidate();
    },
  });

  const handleRemoveApiKey = (apiKeyId: number) => {
    deleteApiKey({
      apiKeyId,
    });
  };

  return (
    <LabeledCard
      title="API Keys"
      titleInfo="Create API keys which you can use to invoke a prompt from another application."
      titleBar={<CreateApiKeyDialogButton />}
      labelId={LABEL_ID}
    >
      {apiKeys?.length === 0 ? (
        <Typography>You have no API keys.</Typography>
      ) : apiKeys === undefined ? (
        <ApiKey />
      ) : (
        apiKeys.map((k) => (
          <ApiKey
            key={k.id}
            apiKeyId={k.id}
            name={k.name}
            expires={k.expires}
            scopes={k.scopes}
            onClickRemove={handleRemoveApiKey}
          />
        ))
      )}
    </LabeledCard>
  );
};

const ApiKey: FC<{
  apiKeyId?: number;
  name?: string;
  expires?: Date;
  scopes?: string[];
  onClickRemove?: (id: number) => void;
}> = ({ apiKeyId, name, expires, scopes, onClickRemove }) => {
  const handleRemove = () => {
    if (apiKeyId === undefined || onClickRemove === undefined) {
      return;
    }
    onClickRemove(apiKeyId);
  };

  return (
    <Stack direction="row" spacing={1} alignItems="center">
      <IconButton
        color="error"
        size="small"
        onClick={() => handleRemove()}
        disabled={apiKeyId === undefined}
      >
        <RemoveCircle fontSize="small" />
      </IconButton>
      <Stack direction="row" alignItems="baseline" flexGrow={1} spacing={1}>
        <Typography variant="h5">
          {name || <Skeleton width="100px" />}
        </Typography>
        <Typography color="text.secondary">
          {expires !== undefined ? (
            <>Expires {dayjs(expires).fromNow()}</>
          ) : (
            <Skeleton width="100px" />
          )}
        </Typography>
        {!!scopes?.length && (
          <Typography color="text.secondary">({scopes.join(",")})</Typography>
        )}
      </Stack>
    </Stack>
  );
};
