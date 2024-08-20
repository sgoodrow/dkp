"use client";

import { trpc } from "@/api/views/trpc/trpc";
import { InstallFailedDialog } from "@/ui/install/dialogs/InstallFailedDialog";
import { InstallStartDialog } from "@/ui/install/dialogs/InstallStartDialog";
import { FC, useState } from "react";
import { uiRoutes } from "@/app/uiRoutes";
import { useRouter } from "next/navigation";

export const InstallRoutePage: FC<{}> = ({}) => {
  const [tryAgain, setTryAgain] = useState<boolean | null>(null);
  const { replace } = useRouter();

  const { data: attempt, isRefetching } = trpc.install.getLatest.useQuery();

  return attempt === undefined ? null : attempt === null || tryAgain ? (
    <InstallStartDialog
      onSuccess={() => replace(uiRoutes.migrate.href())}
      onError={() => setTryAgain(true)}
      isLoading={isRefetching}
    />
  ) : attempt.status === "FAIL" ? (
    <InstallFailedDialog
      onTryAgain={() => setTryAgain(true)}
      installedRaces={attempt.installedRaces}
      installedClasses={attempt.installedClasses}
      installedRaceClassCombinations={attempt.installedRaceClassCombinations}
      installedItems={attempt.installedItems}
      installedGuild={attempt.installedGuild}
    />
  ) : null;
};
