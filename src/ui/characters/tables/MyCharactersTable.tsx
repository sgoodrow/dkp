"use client";

import { trpc } from "@/api/views/trpc/trpc";
import { FC } from "react";
import { ICellRendererParams } from "ag-grid-community";
import { InfiniteTable } from "@/ui/shared/components/table/InfiniteTable";
import { CopyToClipboardIconButton } from "@/ui/shared/components/buttons/CopyToClipboardIconButton";
import { monitoringIds } from "@/ui/shared/constants/monitoringIds";
import { uiRoutes } from "@/app/uiRoutes";
import { useSession } from "next-auth/react";
import { Cell } from "@/ui/shared/components/table/Cell";
import { CharacterLink } from "@/ui/shared/components/links/CharacterLink";
import { ClassName } from "@/ui/shared/components/static/ClassName";

export const MyCharactersTable: FC<{}> = ({}) => {
  const utils = trpc.useUtils();
  const session = useSession();

  return (
    <InfiniteTable
      getRows={utils.character.getManyByUserId.fetch}
      columnDefs={[
        {
          headerName: "",
          field: "id",
          width: 50,
          resizable: false,
          cellRenderer: (props: ICellRendererParams) => (
            <CopyToClipboardIconButton
              data-monitoring-id={
                monitoringIds.COPY_CHARACTER_LINK_TO_CLIPBOARD
              }
              value={
                props.value === undefined ||
                session.data?.user?.id === undefined
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
          cellRenderer: (props: ICellRendererParams) => (
            <Cell isLoading={props.value === undefined}>
              <CharacterLink
                characterId={props.data?.id}
                characterName={props.data?.name}
              />
            </Cell>
          ),
        },
        {
          headerName: "Class",
          field: "class.name",
          flex: 1,
          filter: "agTextColumnFilter",
          cellRenderer: (props: ICellRendererParams) => (
            <Cell isLoading={props.data === undefined}>
              <ClassName
                className={props.data?.class.name}
                colorHexDark={props.data?.class.colorHexDark}
                colorHexLight={props.data?.class.colorHexLight}
              />
            </Cell>
          ),
        },
        {
          headerName: "Race",
          field: "race.name",
          flex: 1,
          filter: "agTextColumnFilter",
        },
      ]}
    />
  );
};
