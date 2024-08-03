"use client";

import { trpc } from "@/api/views/trpc/trpc";
import { FC, useMemo } from "react";
import {
  Column,
  InfiniteTable,
} from "@/ui/shared/components/tables/InfiniteTable";
import { CopyToClipboardIconButton } from "@/ui/shared/components/buttons/CopyToClipboardIconButton";
import { monitoringIds } from "@/ui/shared/constants/monitoringIds";
import { uiRoutes } from "@/app/uiRoutes";
import { useSession } from "next-auth/react";
import { LoadingCell } from "@/ui/shared/components/tables/LoadingCell";
import { CharacterLink } from "@/ui/shared/components/links/CharacterLink";
import { ClassName } from "@/ui/shared/components/static/ClassName";
import { TrpcRouteOutputs } from "@/api/views/trpc/trpcRoutes";
import { CellLayout } from "@/ui/shared/components/tables/CellLayout";

type Row = TrpcRouteOutputs["character"]["getManyByUserId"]["rows"][number];

export const MyCharactersTable: FC<{}> = ({}) => {
  const utils = trpc.useUtils();
  const session = useSession();

  const columnDefs: Column<Row>[] = useMemo(
    () => [
      {
        headerName: "",
        field: "id",
        width: 50,
        resizable: false,
        cellRenderer: (props) => (
          <CopyToClipboardIconButton
            data-monitoring-id={monitoringIds.COPY_CHARACTER_LINK_TO_CLIPBOARD}
            value={
              props.value === undefined || session.data?.user?.id === undefined
                ? ""
                : uiRoutes.character.href({
                    playerId: session.data.user.id,
                    characterId: props.value,
                  })
            }
            label="Copy character link"
          />
        ),
      },
      {
        headerName: "Name",
        field: "name",
        flex: 1,
        filter: "agTextColumnFilter",
        cellRenderer: (props) =>
          props.data === undefined ? (
            <LoadingCell />
          ) : (
            <CellLayout>
              <CharacterLink character={props.data} />
            </CellLayout>
          ),
      },
      {
        headerName: "Class",
        field: "class.name",
        flex: 1,
        filter: "agTextColumnFilter",
        cellRenderer: (props) =>
          props.data == undefined ? (
            <LoadingCell />
          ) : (
            <CellLayout>
              <ClassName
                className={props.data?.class.name}
                colorHexDark={props.data?.class.colorHexDark}
                colorHexLight={props.data?.class.colorHexLight}
              />
            </CellLayout>
          ),
      },
      {
        headerName: "Race",
        field: "race.name",
        flex: 1,
        filter: "agTextColumnFilter",
      },
    ],
    [session],
  );

  return (
    <InfiniteTable
      getRows={utils.character.getManyByUserId.fetch}
      columnDefs={columnDefs}
    />
  );
};
