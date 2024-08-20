import {
  PropsWithChildren,
  useCallback,
  useMemo,
  useState,
  createContext,
  useContext,
} from "react";
import { Box, Unstable_Grid2 } from "@mui/material";
import { AgFilterModel } from "@/api/shared/agGridUtils/filter";
import { AgSortModel } from "@/api/shared/agGridUtils/sort";
import { isEmpty } from "lodash";
import { AgGridReact, AgGridReactProps } from "ag-grid-react";
import {
  ICellRendererParams,
  ICellEditorParams,
  IDatasource,
  ColDef,
  GetRowIdFunc,
  GridApi,
  GridReadyEvent,
} from "ag-grid-community";
import { TypographyCell } from "@/ui/shared/components/tables/TypographyCell";
import { useGridTheme } from "@/ui/shared/components/tables/useGridTheme";

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

export interface Column<TData extends Data>
  extends Omit<ColDef<TData>, "cellRenderer" | "cellEditor"> {
  cellRenderer?: (params: ICellRendererParams<TData>) => JSX.Element;
  cellEditor?: (params: ICellEditorParams<TData>) => JSX.Element;
}

export type ColumnConfig = Pick<
  Column<never>,
  "headerName" | "width" | "sortable" | "filter"
>;

export const handleCellEdited = ({
  rowIndex,
  column,
  api,
}: ICellEditorParams) => {
  setTimeout(() => {
    api.setFocusedCell(rowIndex, column);
  }, 0);
  api.refreshInfiniteCache();
};

export const handleCellEditorClosed = ({
  rowIndex,
  column,
  api,
}: ICellEditorParams) => {
  api.stopEditing();
  setTimeout(() => {
    api.setFocusedCell(rowIndex, column);
  }, 0);
};

const GridApiContext = createContext<GridApi | undefined>(undefined);

export const useGridApi = () => {
  const context = useContext(GridApiContext);
  if (context === undefined) {
    throw new Error("useGridApi must be used within a GridApiProvider");
  }
  return context;
};

export const InfiniteTable = <TData extends Data>({
  rowHeight,
  getRows,
  columnDefs,
  onGridReady,
  onFirstDataRendered,
  children,
}: PropsWithChildren<{
  rowHeight?: AgGridReactProps["rowHeight"];
  onFirstDataRendered?: AgGridReactProps["onFirstDataRendered"];
  getRows: GetRows<TData>;
  columnDefs: Column<TData>[];
  onGridReady?: (api: GridApi<TData>) => void;
}>) => {
  const gridTheme = useGridTheme();
  const [api, setApi] = useState<GridApi<TData>>();

  const onGridReadyInternal = useCallback(
    (params: GridReadyEvent) => {
      setApi(params.api);
      onGridReady && onGridReady(params.api);
    },
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
    <Box display="flex" flexGrow={1} flexDirection="column">
      <GridApiContext.Provider value={api}>
        <Unstable_Grid2 container spacing={1}>
          {children}
        </Unstable_Grid2>
      </GridApiContext.Provider>
      <Box flexGrow={1} className={gridTheme} mt={1}>
        <AgGridReact
          tooltipShowDelay={300}
          rowSelection="multiple"
          rowHeight={rowHeight}
          onGridReady={onGridReadyInternal}
          getRowId={getRowId}
          alwaysShowVerticalScroll
          infiniteInitialRowCount={100}
          rowModelType="infinite"
          datasource={datasource}
          defaultColDef={defaultColDef}
          columnDefs={columnDefs}
          onFirstDataRendered={onFirstDataRendered}
        />
      </Box>
    </Box>
  );
};
