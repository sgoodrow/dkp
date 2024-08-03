import { ICellRendererParams } from "ag-grid-community";
import { FC } from "react";
import { LoadingCell } from "@/ui/shared/components/tables/LoadingCell";
import { CellLayout } from "@/ui/shared/components/tables/CellLayout";
import { Box, Stack } from "@mui/material";
import { RaidActivityTypeRow } from "@/ui/raid-activity-types/tables/RaidActivityTypesTable";
import { OverflowTooltipTypography } from "@/ui/shared/components/typography/OverflowTooltipTypography";
import pluralize from "pluralize";
import { AssignRaidActivityTypeNameIconButton } from "@/ui/raid-activity-types/buttons/AssignRaidActivityTypeNameIconButton";

export const RaidActivityTypeNameCell: FC<
  ICellRendererParams<RaidActivityTypeRow> & { onAssign: () => void }
> = ({ data, onAssign }) => {
  return data === undefined ? (
    <LoadingCell />
  ) : (
    <CellLayout>
      <Stack direction="row" spacing={1}>
        <AssignRaidActivityTypeNameIconButton
          raidActivityTypeId={data.id}
          name={data.name}
          onAssign={onAssign}
        />
        <Box overflow="auto">
          <OverflowTooltipTypography>{data.name}</OverflowTooltipTypography>
          <OverflowTooltipTypography variant="body2" color="text.secondary">
            {data._count.raidActivities}{" "}
            {pluralize("instance", data._count.raidActivities)}
          </OverflowTooltipTypography>
        </Box>
      </Stack>
    </CellLayout>
  );
};
