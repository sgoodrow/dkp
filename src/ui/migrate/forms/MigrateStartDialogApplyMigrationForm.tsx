"use client";

import { trpc } from "@/api/views/trpc/trpc";
import { MigrateInvalidCharactersDialog } from "@/ui/migrate/dialogs/MigrateInvalidCharactersDialog";
import { ActionCard } from "@/ui/shared/components/cards/ActionCard";
import { BulletList } from "@/ui/shared/components/lists/BulletList";
import { BugReport, DirectionsRun } from "@mui/icons-material";
import { DialogContentText, Skeleton } from "@mui/material";
import pluralize from "pluralize";
import { FC, useState } from "react";

export const MigrateStartDialogApplyMigrationForm: FC<{
  siteUrl: string;
  dbUrl: string;
  botNamesCsv: string;
}> = ({ siteUrl, dbUrl, botNamesCsv }) => {
  const { data: dryRun, isRefetching } = trpc.migrate.getDryRun.useQuery(
    {
      dbUrl,
      botNamesCsv,
    },
    {
      refetchOnWindowFocus: false,
    },
  );
  const [open, setOpen] = useState(false);
  const utils = trpc.useUtils();

  const isRunning = isRefetching || dryRun === undefined;
  const invalidCharacters =
    dryRun?.outcomes.characters.flatMap((c) => (c.valid ? [] : c)) || [];

  return (
    <>
      <DialogContentText>
        We have collected all information needed to perform the migration.
        Below, you can review the statistics from a dry run and fix any issues.
        <br />
        <br />
        When you are ready, click finish to apply the migration.
      </DialogContentText>
      <ActionCard
        label="Perform a Dry Run"
        description={
          <BulletList
            items={[
              isRunning ? (
                <Skeleton />
              ) : (
                `${dryRun.outcomes.users.length} ${pluralize(
                  "user",
                  dryRun.outcomes.users.length,
                )}`
              ),
              isRunning ? (
                <Skeleton />
              ) : (
                `${dryRun.outcomes.characters.length} ${pluralize(
                  "character",
                  dryRun.outcomes.characters.length,
                )}`
              ),
              isRunning ? (
                <Skeleton />
              ) : (
                `${dryRun?.outcomes.raidActivityTypes.length} ${pluralize(
                  "raid activity type",
                  dryRun?.outcomes.raidActivityTypes.length,
                )}`
              ),
              isRunning ? (
                <Skeleton />
              ) : (
                `${dryRun?.outcomes.raidActivities.length} ${pluralize(
                  "raid activity",
                  dryRun?.outcomes.raidActivities.length,
                )}`
              ),
            ]}
          />
        }
        onClick={() => utils.migrate.getDryRun.invalidate()}
        Icon={DirectionsRun}
        loading={isRunning}
        disabled={isRunning}
      />
      {invalidCharacters.length > 0 && (
        <>
          <ActionCard
            label={`View Invalid Characters (${invalidCharacters.length})`}
            description="These characters have an invalid name, race or class, or are not associated with a user. Invalid characters cannot be imported and will be skipped. Their transactions will be created without an association to a character or user."
            onClick={() => setOpen(true)}
            autoFocus
            Icon={BugReport}
            loading={isRunning}
            disabled={isRunning}
          />
          {open && (
            <MigrateInvalidCharactersDialog
              siteUrl={siteUrl}
              invalidCharacters={invalidCharacters}
              onClose={() => setOpen(false)}
            />
          )}
        </>
      )}
    </>
  );
};
