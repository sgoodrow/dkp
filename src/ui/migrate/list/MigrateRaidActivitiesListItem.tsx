"use client";

import { trpc } from "@/api/views/trpc/trpc";
import { useActivationKey } from "@/ui/shared/contexts/ActivationKeyContext";
import { MigrateStartField } from "@/ui/migrate/dialogs/MigrateStartDialog";
import { FC, useEffect, useMemo } from "react";
import { MigrateListItemLayout } from "@/ui/migrate/list/MigrateListItemLayout";

export const MigrateRaidActivitiesListItem: FC<{
  Field: MigrateStartField;
  enabled: boolean;
  dbUrl: string;
  onReadyChange: (ready: boolean) => void;
}> = ({ Field, enabled, dbUrl, onReadyChange }) => {
  const activationKey = useActivationKey();
  const { data } = trpc.migrate.getRaidActivitiesBatch.useQuery(
    {
      take: 250,
      dbUrl,
    },
    {
      enabled,
    },
  );

  const { mutate } = trpc.migrate.migrateRaidActivitiesBatch.useMutation({
    onSuccess: () => {
      utils.migrate.getRaidActivitiesBatch.invalidate();
    },
  });

  const utils = trpc.useUtils();

  const batch = useMemo(() => data?.batch || null, [data?.batch]);

  useEffect(() => {
    if (!batch?.length || !enabled) {
      return;
    }
    mutate({
      activationKey,
      batch,
    });
  }, [activationKey, batch, enabled, mutate]);

  useEffect(() => {
    if (!data) {
      return;
    }
    onReadyChange(data.batch.length === 0 && enabled);
  }, [data, enabled, onReadyChange]);

  return (
    <Field name="raidActivitiesReady">
      {(field) => (
        <MigrateListItemLayout
          data={data}
          enabled={enabled}
          completed={field.state.value}
          label="Raid Activities"
        />
      )}
    </Field>
  );
};
