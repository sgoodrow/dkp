"use client";

import { NONE_ASSOCIATED } from "@/ui/shared/components/static/copy";
import { Box, BoxProps, List, ListItem, ListItemText } from "@mui/material";
import {
  DataGridPro,
  DataGridProProps,
  GridFetchRowsParams,
  GridValidRowModel,
  gridClasses,
  useGridApiRef,
} from "@mui/x-data-grid-pro";
import { useState } from "react";
import { useDebounceCallback } from "usehooks-ts";

const DEBOUNCE_DURATION_MS = 200;
const LOADING_ROW_COUNT = 10;

type Props<R extends GridValidRowModel> = Omit<
  DataGridProProps<R>,
  | "sortingMode"
  | "filterMode"
  | "rowsLoadingMode"
  | "hideFooter"
  | "apiRef"
  | "rows"
  | "rowCount"
  | "onFetchRows"
> & {
  loader: ReturnType<typeof useDataGridLazyLoader<R>>;
  height: BoxProps["height"];
};

export const LazyLoadDataGrid = <R extends GridValidRowModel>({
  loader,
  height,
  sx,
  ...props
}: Props<R>) => {
  const { apiRef, initialRows, currentRowCount, handleFetchRows } = loader;
  return currentRowCount === 0 ? (
    <List disablePadding>
      <ListItem>
        <ListItemText primary={NONE_ASSOCIATED} />
      </ListItem>
    </List>
  ) : (
    <Box height={height}>
      <DataGridPro<R>
        // There is an issue setting style overrides in theme.tsx for DataGrid, so we do it here.
        // Issue: https://github.com/mui/mui-x/issues/7619
        sx={{
          [`& .${gridClasses.filler}`]: {
            backgroundColor: "background.default",
          },
          ...sx,
        }}
        apiRef={apiRef}
        rows={initialRows}
        rowCount={currentRowCount || LOADING_ROW_COUNT}
        onFetchRows={handleFetchRows}
        hideFooter
        sortingMode="server"
        filterMode="server"
        rowsLoadingMode="server"
        {...props}
      />
    </Box>
  );
};

type Data<R> = {
  rows: R[];
  totalCount: number;
};

// This hook facilitates lazy loading of data into the MUI Data Grid Pro component.
// Note that the initial data fetch is cached with react-query, however subsequent
// data from viewport scroll events are not cached. We use a hook instead of inlining
// the capability into the component so that the current row count state can be lifted.
// https://mui.com/x/react-data-grid/row-updates/#lazy-loading
export const useDataGridLazyLoader = <R extends GridValidRowModel>(options: {
  fetchRows: (
    firstRowToRender: number,
    lastRowToRender: number,
  ) => Promise<Data<R>>;
  initialData?: Data<R>;
}) => {
  const { fetchRows, initialData } = options;
  const [rowCount, setRowCount] = useState<number>();
  const apiRef = useGridApiRef();

  const handleFetchRows = useDebounceCallback(
    async ({ firstRowToRender, lastRowToRender }: GridFetchRowsParams) => {
      const { rows, totalCount } = await fetchRows(
        firstRowToRender,
        lastRowToRender,
      );
      apiRef.current?.unstable_replaceRows(firstRowToRender, rows);
      setRowCount(totalCount);
    },
    DEBOUNCE_DURATION_MS,
  );

  return {
    apiRef,
    handleFetchRows,
    initialRows: initialData?.rows || [],
    currentRowCount: rowCount || initialData?.totalCount,
  };
};
