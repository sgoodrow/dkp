import { useCallback, useMemo } from "react";
import { Box, PaletteMode, useTheme } from "@mui/material";
import { exhaustiveSwitchCheck } from "@/ui/shared/utils/exhaustiveSwitchCheck";
import { AgFilterModel } from "@/api/shared/agGridUtils/filter";
import { AgSortModel } from "@/api/shared/agGridUtils/sort";
import { isEmpty } from "lodash";
import { AgGridReact } from "ag-grid-react";
import {
  ICellRendererParams,
  ICellEditorParams,
  IDatasource,
  ColDef,
  GetRowIdFunc,
  GridApi,
  GridReadyEvent,
} from "ag-grid-community";
import "ag-grid-community/styles/ag-grid.css";
import "./theme.css";
import { TypographyCell } from "@/ui/shared/components/table/TypographyCell";

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

type Data = {
  id: string | number;
};

export type GetRows<TData extends Data> = (params: {
  startRow: number;
  endRow: number;
  filterModel: AgFilterModel;
  sortModel: AgSortModel;
}) => Promise<{
  totalRowCount: number;
  rows: TData[];
}>;

// Fix the cellRenderer types.
export type Column<TData extends Data> = Omit<
  ColDef<TData>,
  "cellRenderer" | "cellEditor"
> & {
  cellRenderer?: (params: ICellRendererParams<TData>) => JSX.Element;
  cellEditor?: (params: ICellEditorParams<TData>) => JSX.Element;
};

export const InfiniteTable = <TData extends Data>({
  getRows,
  columnDefs,
  onGridReady,
}: {
  getRows: GetRows<TData>;
  columnDefs: Column<TData>[];
  onGridReady?: (api: GridApi<TData>) => void;
}) => {
  const theme = useTheme();
  const { mode } = theme.palette;

  const onGridReadyInternal = useCallback(
    (params: GridReadyEvent) => onGridReady && onGridReady(params.api),
    [onGridReady],
  );

  const getRowId: GetRowIdFunc = useCallback(
    (params) => `${params.data.id}`,
    [],
  );

  const datasource: IDatasource = useMemo(
    () => ({
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
    }),
    [getRows],
  );

  const defaultColDef: Column<TData> = useMemo(
    () => ({
      sortable: false,
      filterParams: {
        closeOnApply: true,
        maxNumConditions: 1,
        buttons: ["apply", "reset", "cancel"],
      },
      cellRenderer: ({ value }) => <TypographyCell>{value}</TypographyCell>,
    }),
    [],
  );

  return (
    <Box flexGrow={1} className={getThemeName({ mode })}>
      <AgGridReact
        onGridReady={onGridReadyInternal}
        getRowId={getRowId}
        alwaysShowVerticalScroll
        infiniteInitialRowCount={100}
        rowModelType="infinite"
        datasource={datasource}
        defaultColDef={defaultColDef}
        columnDefs={columnDefs}
      />
    </Box>
  );
};
