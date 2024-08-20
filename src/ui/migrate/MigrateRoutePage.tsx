"use client";

import { trpc } from "@/api/views/trpc/trpc";
import { exhaustiveSwitchCheck } from "@/ui/shared/utils/exhaustiveSwitchCheck";
import { FC, useState } from "react";
import { MigrateStartDialog } from "@/ui/migrate/dialogs/MigrateStartDialog";
import { useRouter } from "next/navigation";
import { uiRoutes } from "@/app/uiRoutes";
import { MigrateFailedDialog } from "@/ui/migrate/dialogs/MigrateFailedDialog";
import { MigrateCompleteDialog } from "@/ui/migrate/dialogs/MigrateCompleteDialog";

export const MigrateRoutePage: FC<{}> = ({}) => {
  const [tryAgain, setTryAgain] = useState<boolean | null>(null);

  const { data: attempt, isRefetching } = trpc.migrate.getLatest.useQuery();

  const { replace } = useRouter();

  return attempt === undefined ? null : attempt === null || tryAgain ? (
    <MigrateStartDialog
      onSuccess={() => replace(uiRoutes.migrate.href())}
      onError={() => setTryAgain(true)}
      isLoading={isRefetching}
    />
  ) : attempt.status === "FAIL" ? (
    <MigrateFailedDialog
      onTryAgain={() => setTryAgain(true)}
      importedUsers={attempt.importedUsers}
      importedCharacters={attempt.importedCharacters}
      importedRaidActivityTypes={attempt.importedRaidActivityTypes}
      importedRaidActivities={attempt.importedRaidActivities}
    />
  ) : attempt.status === "COMPLETE" ? (
    <MigrateCompleteDialog />
  ) : (
    exhaustiveSwitchCheck(attempt.status)
  );
};
