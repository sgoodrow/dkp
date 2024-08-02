"use client";

import { FC, useMemo } from "react";
import { LabeledCard } from "@/ui/shared/components/cards/LabeledCard";
import { Box, Paper, Stack, Typography, useTheme } from "@mui/material";
import { trpc } from "@/api/views/trpc/trpc";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  LabelList,
  Tooltip,
} from "recharts";
import { groupBy } from "lodash";
import { getAbbreviations } from "@/shared/utils/stringUtils";
import { ClassName } from "@/ui/shared/components/static/ClassName";
import pluralize from "pluralize";
import { exhaustiveSwitchCheck } from "@/ui/shared/utils/exhaustiveSwitchCheck";

export const RaidActivityClassDistributionCard: FC<{ id: number }> = ({
  id,
}) => {
  const { data: characters } = trpc.character.getByRaidActivityId.useQuery({
    raidActivityId: id,
  });
  const { data: classes } = trpc.character.getClasses.useQuery({});
  const theme = useTheme();

  const data = useMemo(() => {
    if (characters === undefined || classes === undefined) {
      return;
    }

    const classAbbreviations = getAbbreviations(
      classes.map((c) => c.name),
      3,
    );

    const charactersByClass = groupBy(characters, (c) => c.classId);

    return classes.map((c) => ({
      name: classAbbreviations[c.name],
      value: charactersByClass[c.id]?.length || 0,
      class: c,
    }));
  }, [characters, classes]);

  return (
    <LabeledCard
      title="Class Distribution"
      labelId="raid-activity-classes-label"
    >
      <Typography>
        The distribution of classes in this raid activity.
      </Typography>
      <Box height="400px">
        <ResponsiveContainer>
          <BarChart data={data} layout="vertical" margin={{ right: 35 }}>
            <XAxis type="number" tick={false} />
            <YAxis
              type="category"
              dataKey="name"
              tick={false}
              allowDataOverflow
            />
            <Tooltip
              content={({ active, payload }) => {
                const bar = payload?.[0];
                if (!active || !bar) {
                  return null;
                }
                const { name, colorHexDark, colorHexLight } = bar.payload.class;
                return (
                  <Stack direction="row" component={Paper} p={1} spacing={0.5}>
                    <Typography>{bar.value}</Typography>
                    <ClassName
                      className={pluralize(name, Number(bar.value) || 0)}
                      colorHexDark={colorHexDark}
                      colorHexLight={colorHexLight}
                    />
                  </Stack>
                );
              }}
            />
            <Bar dataKey="value">
              {data?.map((entry) => (
                <Cell
                  key={entry.class.name}
                  fill={
                    theme.palette.mode === "light"
                      ? entry.class.colorHexLight
                      : theme.palette.mode === "dark"
                        ? entry.class.colorHexDark
                        : exhaustiveSwitchCheck(theme.palette.mode)
                  }
                />
              ))}
              <LabelList dataKey="name" position="left" />
              <LabelList dataKey="value" position="right" />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </LabeledCard>
  );
};
