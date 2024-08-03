"use client";

import { FC } from "react";
import { LabeledCard } from "@/ui/shared/components/cards/LabeledCard";
import {
  Box,
  Skeleton,
  Stack,
  Typography,
  Unstable_Grid2,
} from "@mui/material";
import { trpc } from "@/api/views/trpc/trpc";
import { StatCard } from "@/ui/shared/components/cards/StatCard";
import { transaction } from "@/shared/utils/transaction";
import { TransactionAmountTypography } from "@/ui/shared/components/typography/TransactionAmountTypography";
import { statsBy } from "@/shared/utils/mathUtils";
import { uniqBy } from "lodash";
import { CharacterLink } from "@/ui/shared/components/links/CharacterLink";
import { ItemLink } from "@/ui/shared/components/links/ItemLink";

export const RaidActivityContributionsCard: FC<{ id: number }> = ({ id }) => {
  const { data: summary } = trpc.raidActivity.get.useQuery({
    id,
  });
  const { data: wallet } = trpc.wallet.getCurrentUserWallet.useQuery();

  const mine =
    wallet === undefined
      ? undefined
      : summary?.transactions.filter((t) => t.walletId === wallet.id);

  const cleared = mine?.filter(transaction.isCleared);

  const pending = mine?.filter(transaction.isPending);

  const earned = statsBy(
    cleared?.filter((t) => ["ATTENDANCE", "ADJUSTMENT"].includes(t.type)),
    (t) => t.amount,
  );

  const spent = statsBy(
    cleared?.filter((t) => t.type === "PURCHASE"),
    (t) => t.amount,
  );

  const characters = cleared?.map((t) => t.character!);

  const items = cleared?.map((t) => t.item!);

  return (
    <LabeledCard
      title="My Contribution"
      labelId="raid-activity-contribution-label"
    >
      {cleared?.length === 0 && pending?.length === 0 ? (
        <Typography color="text.secondary">
          There are no records of you contributing to this raid activity.
        </Typography>
      ) : (
        <>
          <Typography>
            What you earned by contributing to this raid activity.
          </Typography>
          <Box>
            <Unstable_Grid2 container spacing={1}>
              <Unstable_Grid2 xs={6} sm={4}>
                <StatCard
                  label="DKP Earned"
                  value={
                    <TransactionAmountTypography
                      amount={earned ? earned.sum : earned}
                      positive
                    />
                  }
                />
              </Unstable_Grid2>
              <Unstable_Grid2 xs={6} sm={4}>
                <StatCard
                  label="DKP Spent"
                  value={
                    <TransactionAmountTypography
                      amount={spent ? spent.sum : spent}
                      positive={false}
                    />
                  }
                />
              </Unstable_Grid2>
              <Unstable_Grid2 xs={6} sm={4}>
                <StatCard
                  label="DKP Change"
                  value={
                    <TransactionAmountTypography
                      amount={
                        !earned
                          ? earned
                          : !spent
                            ? spent
                            : earned.sum - spent.sum
                      }
                      positive={
                        earned && spent ? earned.sum - spent.sum >= 0 : true
                      }
                    />
                  }
                />
              </Unstable_Grid2>
              <Unstable_Grid2 xs={6} sm={4}>
                <StatCard
                  label="Characters played"
                  value={
                    <Stack spacing={1}>
                      {characters === undefined ? (
                        <Skeleton />
                      ) : characters.length === 0 ? (
                        "None"
                      ) : (
                        uniqBy(characters, (c) => c.id).map((c) => (
                          <CharacterLink key={c.id} character={c} />
                        ))
                      )}
                    </Stack>
                  }
                />
              </Unstable_Grid2>
              <Unstable_Grid2 xs={6} sm={4}>
                <StatCard
                  label="Items purchased"
                  value={
                    <Stack spacing={1}>
                      {items === undefined ? (
                        <Skeleton />
                      ) : items.length === 0 ? (
                        "None"
                      ) : (
                        uniqBy(items, (i) => i.id).map((i) => (
                          <ItemLink key={i.id} item={i} itemName={i.name} />
                        ))
                      )}
                    </Stack>
                  }
                />
              </Unstable_Grid2>
              <Unstable_Grid2 xs={6} sm={4}>
                <StatCard
                  label="Pending transactions"
                  value={pending === undefined ? <Skeleton /> : pending.length}
                />
              </Unstable_Grid2>
            </Unstable_Grid2>
          </Box>
        </>
      )}
    </LabeledCard>
  );
};
