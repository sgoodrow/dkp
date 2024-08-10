"use client";

import { FC, useMemo } from "react";
import {
  Column,
  handleCellEdited,
  handleCellEditorClosed,
  InfiniteTable,
} from "@/ui/shared/components/tables/InfiniteTable";
import { trpc } from "@/api/views/trpc/trpc";
import { LoadingCell } from "@/ui/shared/components/tables/LoadingCell";
import { TrpcRouteOutputs } from "@/api/views/trpc/trpcRoutes";
import { CellLayout } from "@/ui/shared/components/tables/CellLayout";
import { DateCell } from "@/ui/shared/components/tables/DateCell";
import { RaidActivityCell } from "@/ui/raid-activities/tables/RaidActivityCell";
import { PlayerLink } from "@/ui/shared/components/links/PlayerLink";
import { RaidActivityTypeNameCell } from "@/ui/raid-activity-types/tables/RaidActivityTypeNameCell";
import { RaidActivityTypeDefaultPayoutCell } from "@/ui/raid-activity-types/tables/RaidActivityTypeDefaultPayoutCell";
import { AssignRaidActivityTypeDefaultPayoutDialog } from "@/ui/raid-activity-types/dialogs/AssignRaidActivityTypeDefaultPayoutDialog";
import { AssignRaidActivityTypeNameDialog } from "@/ui/raid-activity-types/dialogs/AssignRaidActivityTypeNameDialog";
import { Unstable_Grid2 } from "@mui/material";
import { CreateRaidActivityTypeCard } from "@/ui/raid-activity-types/cards/CreateRaidActivityTypeCard";

export type RaidActivityTypeRow =
  TrpcRouteOutputs["raidActivity"]["getManyTypes"]["rows"][number];

export const RaidActivityTypesTable: FC<{}> = ({}) => {
  const utils = trpc.useUtils();
  const columnDefs = useMemo<Column<RaidActivityTypeRow>[]>(
    () => [
      {
        headerName: "Name",
        field: "name",
        editable: true,
        cellEditor: (props) => (
          <AssignRaidActivityTypeNameDialog
            raidActivityTypeId={props.data.id}
            name={props.data.name}
            onAssign={() => handleCellEdited(props)}
            onClose={() => handleCellEditorClosed(props)}
          />
        ),
        cellRenderer: (props) => (
          <RaidActivityTypeNameCell
            {...props}
            onAssign={() => props.api.refreshInfiniteCache()}
          />
        ),
      },
      {
        headerName: "Default Payout",
        field: "defaultPayout",
        width: 170,
        sortable: true,
        editable: true,
        filter: "agTextColumnFilter",
        cellEditor: (props) => (
          <AssignRaidActivityTypeDefaultPayoutDialog
            defaultPayout={props.data.defaultPayout}
            raidActivityTypeId={props.data.id}
            onAssign={() => handleCellEdited(props)}
            onClose={() => handleCellEditorClosed(props)}
          />
        ),
        cellRenderer: (props) => (
          <RaidActivityTypeDefaultPayoutCell
            {...props}
            onAssign={() => props.api.refreshInfiniteCache()}
          />
        ),
      },
      {
        headerName: "Last Updated",
        field: "updatedAt",
        width: 150,
        sortable: true,
        suppressNavigable: true,
        cellRenderer: (props) => <DateCell {...props} />,
      },
      {
        headerName: "Updated By",
        field: "updatedBy",
        suppressNavigable: true,
        cellRenderer: (props) =>
          props.data === undefined ? (
            <LoadingCell />
          ) : (
            <CellLayout>
              <PlayerLink user={props.data.updatedBy} />
            </CellLayout>
          ),
      },
      {
        headerName: "Latest Raid Activity",
        flex: 1,
        suppressNavigable: true,
        cellRenderer: (props) => (
          <RaidActivityCell
            data={
              props.data === undefined
                ? undefined
                : props.data.raidActivities?.[0] || null
            }
          />
        ),
      },
    ],
    [],
  );

  return (
    <InfiniteTable
      rowHeight={64}
      getRows={utils.raidActivity.getManyTypes.fetch}
      columnDefs={columnDefs}
    >
      <Unstable_Grid2 xs={12} sm={12} md={6} lg={4} xl={3}>
        <CreateRaidActivityTypeCard />
      </Unstable_Grid2>
    </InfiniteTable>
  );
};
