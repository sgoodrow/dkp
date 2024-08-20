import { PropsWithChildren, useCallback, useMemo } from "react";
import { Box } from "@mui/material";
import { AgGridReact, AgGridReactProps } from "ag-grid-react";
import { ICellRendererParams, ColDef, GetRowIdFunc } from "ag-grid-community";
import { TypographyCell } from "@/ui/shared/components/tables/TypographyCell";
import { useGridTheme } from "@/ui/shared/components/tables/useGridTheme";

type Data = {
  id: string | number;
};

export interface Column<TData extends Data>
  extends Omit<ColDef<TData>, "cellRenderer"> {
  cellRenderer?: (params: ICellRendererParams<TData>) => JSX.Element;
}

export const DataTable = <TData extends Data>({
  rowHeight,
  data,
  columnDefs,
}: PropsWithChildren<{
  rowHeight?: AgGridReactProps["rowHeight"];
  data: TData[];
  columnDefs: Column<TData>[];
}>) => {
  const gridTheme = useGridTheme();

  const getRowId: GetRowIdFunc = useCallback(
    (params) => `${params.data.id}`,
    [],
  );

  const defaultColDef: Column<TData> = useMemo(
    () => ({
      cellRenderer: ({ value }) => <TypographyCell>{value}</TypographyCell>,
    }),
    [],
  );

  return (
    <Box flexGrow={1} className={gridTheme} mt={1}>
      <AgGridReact
        rowSelection="multiple"
        rowHeight={rowHeight}
        getRowId={getRowId}
        alwaysShowVerticalScroll
        rowData={data}
        defaultColDef={defaultColDef}
        columnDefs={columnDefs}
        tooltipShowDelay={0}
      />
    </Box>
  );
};
