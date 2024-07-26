import { Box, PaletteMode, useTheme } from "@mui/material";
import { OverflowTooltipTypography } from "@/ui/shared/components/typography/OverflowTooltipTypography";
import { AgGridReact } from "ag-grid-react";
import { ICellRendererParams, ColDef } from "ag-grid-community";
import { exhaustiveSwitchCheck } from "@/ui/shared/utils/exhaustiveSwitchCheck";
import { Cell } from "@/ui/shared/components/table/Cell";
import "ag-grid-community/styles/ag-grid.css";
import "./theme.css";
import { AgFilterModel } from "@/api/shared/agGridUtils/filter";
import { AgSortModel } from "@/api/shared/agGridUtils/sort";
import { isEmpty } from "lodash";

const getThemeName = ({ mode }: { mode: PaletteMode }) => {
  switch (mode) {
    case "dark":
      return "ag-theme-alpine-dark";
    case "light":
      return "ag-theme-alpine";
    default:
      return exhaustiveSwitchCheck(mode);
  }
};

type GetRows<TData = any> = (params: {
  startRow: number;
  endRow: number;
  filterModel: AgFilterModel;
  sortModel: AgSortModel;
}) => Promise<{
  totalRowCount: number;
  rows: TData[];
}>;

export const InfiniteTable = <TData,>({
  getRows,
  columnDefs,
}: {
  getRows: GetRows<TData>;
  columnDefs: ColDef<TData>[] | null;
}) => {
  const theme = useTheme();
  const { mode } = theme.palette;

  return (
    <Box flexGrow={1} className={getThemeName({ mode })}>
      <AgGridReact
        infiniteInitialRowCount={100}
        rowModelType="infinite"
        datasource={{
          getRows: async (params) => {
            const {
              startRow,
              endRow,
              filterModel,
              sortModel,
              successCallback,
              failCallback,
            } = params;
            if (startRow === undefined || endRow === undefined) {
              throw new Error("startRow and endRow must be defined");
            }
            try {
              const { rows, totalRowCount } = await getRows({
                startRow,
                endRow,
                filterModel: isEmpty(filterModel) ? undefined : filterModel,
                sortModel,
              });
              successCallback(rows, totalRowCount);
            } catch (err) {
              failCallback();
              throw err;
            }
          },
        }}
        defaultColDef={{
          sortable: false,
          filterParams: {
            closeOnApply: true,
            maxNumConditions: 1,
            buttons: ["apply", "reset", "cancel"],
          },
          cellRenderer: (props: ICellRendererParams) => (
            <Cell isLoading={props.value === undefined}>
              <OverflowTooltipTypography height="100%" alignContent="center">
                {props.value}
              </OverflowTooltipTypography>
            </Cell>
          ),
        }}
        columnDefs={columnDefs}
      />
    </Box>
  );
};
