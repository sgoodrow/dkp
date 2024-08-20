import { app } from "@/shared/constants/app";
import { PlayerLink } from "@/ui/shared/components/links/PlayerLink";
import { CellLayout } from "@/ui/shared/components/tables/CellLayout";
import {
  Column,
  handleCellEdited,
  handleCellEditorClosed,
} from "@/ui/shared/components/tables/InfiniteTable";
import { LoadingCell } from "@/ui/shared/components/tables/LoadingCell";
import { OverflowTooltipTypography } from "@/ui/shared/components/typography/OverflowTooltipTypography";
import { AssignTransactionPilotIconButton } from "@/ui/transactions/buttons/AssignTransactionPilotIconButton";
import { AssignTransactionPilotDialog } from "@/ui/transactions/dialogs/AssignTransactionPilotDialog";
import { TransactionRow } from "@/ui/transactions/tables/TransactionsTable";
import { Box, Stack } from "@mui/material";

export const getTransactionPilotColumn = ({
  editable = false,
}: {
  editable?: boolean;
}): Column<TransactionRow> => ({
  headerName: "Pilot",
  field: "wallet.user.discordMetadata.displayName",
  flex: 1,
  filter: "agTextColumnFilter",
  sortable: true,
  editable,
  cellEditor: (props) => {
    return (
      <AssignTransactionPilotDialog
        transactionId={props.data.id}
        pilot={props.data.wallet?.user || null}
        onAssign={() => handleCellEdited(props)}
        onClose={() => handleCellEditorClosed(props)}
      />
    );
  },
  cellRenderer: ({ data, api }) => {
    return data === undefined ? (
      <LoadingCell />
    ) : (
      <CellLayout>
        <Stack direction="row" spacing={1}>
          {editable && (
            <AssignTransactionPilotIconButton
              transactionId={data.id}
              pilot={data.wallet?.user || null}
              onAssign={() => api.refreshInfiniteCache()}
            />
          )}
          <Box alignContent="center" overflow="auto">
            {data.wallet === null ? (
              <OverflowTooltipTypography color="warning.main">
                {data.pilotCharacterName === null
                  ? "Pilot missing"
                  : app.copy.notRecognized}
              </OverflowTooltipTypography>
            ) : (
              <PlayerLink user={data.wallet.user} />
            )}
            <OverflowTooltipTypography
              variant="body2"
              color="text.secondary"
              tooltip={
                data.pilotCharacterName === null
                  ? "No pilot character name was uploaded."
                  : "The name of the pilot character that was uploaded."
              }
              placement="left"
            >
              {data.pilotCharacterName || "-"}
            </OverflowTooltipTypography>
          </Box>
        </Stack>
      </CellLayout>
    );
  },
});
