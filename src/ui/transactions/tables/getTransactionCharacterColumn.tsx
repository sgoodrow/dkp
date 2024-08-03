import {
  Column,
  handleCellEdited,
  handleCellEditorClosed,
} from "@/ui/shared/components/tables/InfiniteTable";
import { AssignTransactionCharacterDialog } from "@/ui/transactions/dialogs/AssignTransactionCharacterDialog";
import { TransactionRow } from "@/ui/transactions/tables/TransactionsTable";
import { CellLayout } from "@/ui/shared/components/tables/CellLayout";
import { LoadingCell } from "@/ui/shared/components/tables/LoadingCell";
import { Box, Stack } from "@mui/material";
import { AssignTransactionCharacterIconButton } from "@/ui/transactions/buttons/AssignTransactionCharacterIconButton";
import { CharacterLink } from "@/ui/shared/components/links/CharacterLink";
import { app } from "@/shared/constants/app";
import { OverflowTooltipTypography } from "@/ui/shared/components/typography/OverflowTooltipTypography";

export const getTransactionCharacterColumn = ({
  editable = false,
}: {
  editable?: boolean;
}): Column<TransactionRow> => ({
  headerName: "Character",
  field: "characterId",
  flex: 1,
  editable,
  cellEditor: (props) => {
    return (
      <AssignTransactionCharacterDialog
        transactionId={props.data.id}
        character={props.data.character}
        characterName={props.data.characterName}
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
            <AssignTransactionCharacterIconButton
              transactionId={data.id}
              character={data.character}
              characterName={data.characterName}
              onAssign={() => api.refreshInfiniteCache()}
            />
          )}
          <Box overflow="auto">
            {data.character === null ? (
              <OverflowTooltipTypography color="warning.main">
                {app.copy.notRecognized}
              </OverflowTooltipTypography>
            ) : (
              <CharacterLink character={data.character} />
            )}
            <OverflowTooltipTypography
              variant="body2"
              color="text.secondary"
              tooltip="The name of the character that was uploaded."
              placement="left"
            >
              {data.characterName}
            </OverflowTooltipTypography>
          </Box>
        </Stack>
      </CellLayout>
    );
  },
});
