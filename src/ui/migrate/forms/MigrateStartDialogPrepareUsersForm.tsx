"use client";

import { trpc } from "@/api/views/trpc/trpc";
import { useActivationKey } from "@/ui/shared/contexts/ActivationKeyContext";
import { MigrateStartField } from "@/ui/migrate/dialogs/MigrateStartDialog";
import { StatCard } from "@/ui/shared/components/cards/StatCard";
import { exhaustiveSwitchCheck } from "@/ui/shared/utils/exhaustiveSwitchCheck";
import { Button, DialogContentText, Skeleton } from "@mui/material";
import { FC, useEffect, useMemo } from "react";

export const MigrateStartDialogPrepareUsersForm: FC<{
  Field: MigrateStartField;
  dbUrl: string;
  siteUrl: string;
  siteApiKey: string;
  onPreparedUsersChange: (usersReady: boolean) => void;
}> = ({ Field, dbUrl, siteUrl, siteApiKey, onPreparedUsersChange }) => {
  const activationKey = useActivationKey();
  const { data } = trpc.migrate.getPreparationBatch.useQuery({
    take: 100,
  });

  const { mutate: initializeUsers, isPending: isInitializingUsers } =
    trpc.migrate.startPreparation.useMutation({
      onSuccess: () => {
        utils.migrate.getPreparationBatch.invalidate();
      },
    });

  const { mutate: prepareUsers, isPending: isPreparingUsers } =
    trpc.migrate.prepareUserBatch.useMutation({
      onSuccess: ({}) => {
        utils.migrate.getPreparationBatch.invalidate();
      },
    });

  const utils = trpc.useUtils();

  const batch = useMemo(() => {
    return data?.users || [];
  }, [data?.users]);

  useEffect(() => {
    if (!batch.length) {
      return;
    }
    prepareUsers({
      activationKey,
      siteUrl,
      siteApiKey,
      batch,
    });
  }, [activationKey, siteApiKey, siteUrl, batch, prepareUsers]);

  useEffect(() => {
    if (!data) {
      return;
    }
    onPreparedUsersChange(data.status.countWithEmails === data.status.count);
  }, [data, onPreparedUsersChange]);

  return (
    <>
      <Field name="usersReady">
        {(field) => (
          <StatCard
            label="Users ready"
            value={
              data === undefined ? (
                <Skeleton />
              ) : data.status.count === 0 ? (
                "None yet"
              ) : (
                `${data.status.countWithEmails} of ${data.status.count}`
              )
            }
            loading={isPreparingUsers}
          />
        )}
      </Field>
      {data === undefined ? null : data.status.state === "NOT_STARTED" ? (
        <>
          <DialogContentText>
            Before applying the migration, we need to sync metadata about the
            users that will be imported so that they can be identified when they
            sign in.
            <br />
            <br />
            When you are ready, start the initialization process and then wait
            for it to complete.
          </DialogContentText>
          <Button
            fullWidth
            onClick={() => initializeUsers({ activationKey, dbUrl })}
            disabled={isInitializingUsers || status === undefined}
          >
            Initialize Users
          </Button>
        </>
      ) : data.status.state === "PREPARING" ? (
        <>
          <DialogContentText>
            User metadata is being synced.
            <br />
            <br />
            This may take a few minutes depending on how many users you have.
          </DialogContentText>
        </>
      ) : data.status.state === "DONE" ? (
        <DialogContentText>
          All users are ready to be imported.
          <br />
          <br />
          Proceed to the next step to perform a dry run.
        </DialogContentText>
      ) : (
        exhaustiveSwitchCheck(data.status.state)
      )}
    </>
  );
};
