"use client";

import { trpc } from "@/api/views/trpc/trpc";
import { useActivationKey } from "@/ui/shared/contexts/ActivationKeyContext";
import { MigrateStartField } from "@/ui/migrate/dialogs/MigrateStartDialog";
import { IconButton, Tooltip } from "@mui/material";
import { FC, useEffect, useMemo, useState } from "react";
import { Warning } from "@mui/icons-material";
import { MigrateInvalidCharactersDialog } from "@/ui/migrate/dialogs/MigrateInvalidCharactersDialog";
import { MigrateListItemLayout } from "@/ui/migrate/list/MigrateListItemLayout";

export const MigrateCharactersListItem: FC<{
  Field: MigrateStartField;
  enabled: boolean;
  botNamesCsv: string;
  invalidCharactersOk: boolean;
  dbUrl: string;
  siteUrl: string;
  resetForm: () => void;
  onReadyChange: (ready: boolean) => void;
}> = ({
  Field,
  enabled,
  botNamesCsv,
  invalidCharactersOk,
  dbUrl,
  siteUrl,
  resetForm,
  onReadyChange,
}) => {
  const activationKey = useActivationKey();
  const [dialogOpen, setDialogOpen] = useState(false);

  const { data } = trpc.migrate.getCharacterBatch.useQuery(
    {
      take: 1000,
      dbUrl,
    },
    {
      enabled,
    },
  );

  const batch = useMemo(() => data?.batch || null, [data?.batch]);

  const { mutate } = trpc.migrate.migrateCharacterBatch.useMutation({
    onSuccess: () => {
      utils.migrate.getCharacterBatch.invalidate();
    },
  });

  const utils = trpc.useUtils();

  useEffect(() => {
    if (!batch?.length || !enabled) {
      return;
    }
    mutate({
      activationKey,
      botNamesCsv,
      batch,
    });
  }, [activationKey, batch, botNamesCsv, enabled, mutate]);

  useEffect(() => {
    if (!data) {
      return;
    }
    onReadyChange(
      data.batch.length === 0 &&
        enabled &&
        (data.invalidCount === 0 || invalidCharactersOk),
    );
  }, [data, invalidCharactersOk, enabled, onReadyChange]);

  const showInvalidCharacters =
    data?.batch.length === 0 && !!data?.invalidCount && !invalidCharactersOk;

  return (
    <>
      <Field name="charactersReady">
        {(field) => (
          <MigrateListItemLayout
            data={data}
            enabled={enabled}
            completed={field.state.value}
            icon={
              showInvalidCharacters ? (
                <Tooltip title="Reconcile invalid characters">
                  <IconButton
                    sx={{ height: "24px", width: "24px" }}
                    onClick={() => setDialogOpen(true)}
                  >
                    <Warning color="warning" />
                  </IconButton>
                </Tooltip>
              ) : null
            }
            label="Characters"
          />
        )}
      </Field>
      <Field name="invalidCharactersOk">
        {(field) => (
          <>
            {dialogOpen && data?.invalidCount && (
              <MigrateInvalidCharactersDialog
                siteUrl={siteUrl}
                resetForm={resetForm}
                onClose={() => setDialogOpen(false)}
                onAuthorize={() => field.setValue(true)}
                invalidCharacterCount={data.invalidCount}
              />
            )}
          </>
        )}
      </Field>
    </>
  );
};
