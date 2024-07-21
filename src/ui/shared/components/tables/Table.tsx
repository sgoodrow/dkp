"use client";

import { FC, memo, useMemo } from "react";
import {
  ColumnSizingColumn,
  ColumnSizingHeader,
  flexRender,
} from "@tanstack/react-table";
import { Box } from "@mui/material";

export const Table = <TData,>({
  table,
}: {
  table: import("@tanstack/table-core").Table<TData>;
}) => {
  const columnSizingInfo = table.getState().columnSizingInfo;
  const columnSizing = table.getState().columnSizing;

  /**
   * Instead of calling `column.getSize()` on every render for every header
   * and especially every data cell (very expensive),
   * we will calculate all column sizes at once at the root table level in a useMemo
   * and pass the column sizes down as CSS variables to the <table> element.
   */
  const columnSizeVars = useMemo(
    () =>
      table.getFlatHeaders().reduce<Record<string, number>>((acc, header) => {
        acc[`--header-${header.id}-size`] = header.getSize();
        acc[`--col-${header.column.id}-size`] = header.column.getSize();
        return acc;
      }, {}),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [table, columnSizingInfo, columnSizing],
  );

  return (
    <Box
      sx={{
        overflowX: "auto",
      }}
    >
      <Box
        border="1px solid lightgray"
        width={table.getTotalSize()}
        sx={columnSizeVars}
      >
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <TableHeader key={header.id} headerId={header.id}>
                {header.isPlaceholder
                  ? null
                  : flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}
                <Resizer
                  getIsResizing={header.column.getIsResizing}
                  getResizeHandler={header.getResizeHandler}
                  resetSize={header.column.resetSize}
                />
              </TableHeader>
            ))}
          </TableRow>
        ))}
        {table.getState().columnSizingInfo.isResizingColumn ? (
          <MemoizedTableBody table={table} />
        ) : (
          <TableBody table={table} />
        )}
      </Box>
    </Box>
  );
};

const TableBody = <TData,>({
  table,
}: {
  table: import("@tanstack/table-core").Table<TData>;
}) => {
  return (
    <div
      {...{
        className: "tbody",
      }}
    >
      {table.getRowModel().rows.map((row) => (
        <TableRow key={row.id}>
          {row.getVisibleCells().map((cell) => {
            return (
              <TableCell key={cell.id} columnId={cell.column.id}>
                {cell.renderValue<any>()}
              </TableCell>
            );
          })}
        </TableRow>
      ))}
    </div>
  );
};

const MemoizedTableBody = memo(
  TableBody,
  (prev, next) => prev.table.options.data === next.table.options.data,
) as typeof TableBody;

const Resizer: FC<{
  getResizeHandler: ColumnSizingHeader["getResizeHandler"];
  getIsResizing: ColumnSizingColumn["getIsResizing"];
  resetSize: ColumnSizingColumn["resetSize"];
}> = ({ getResizeHandler, getIsResizing, resetSize }) => {
  const resizeHandler = getResizeHandler();
  const isResizing = getIsResizing();
  return (
    <Box
      onDoubleClick={() => resetSize()}
      onMouseDown={resizeHandler}
      onTouchStart={resizeHandler}
      position="absolute"
      top={0}
      right={0}
      height={1}
      width="5px"
      bgcolor={isResizing ? "blue" : "rgba(0, 0, 0, 0.5)"}
      sx={{
        cursor: "col-resize",
        userSelect: "none",
        touchAction: "none",
        opacity: isResizing ? 1 : undefined,
        "&:hover": {
          opacity: 1,
        },
        "@media (hover: hover)": {
          opacity: 0, // Hidden by default on hover-supported devices
          "*:hover > &": {
            opacity: 1, // Visible when parent is hovered
          },
        },
      }}
    />
  );
};

const TableHeader: FCWithChildren<{
  headerId: string;
}> = ({ headerId, children }) => {
  return (
    <Box
      width={`calc(var(--header-${headerId}-size) * 1px)`}
      boxShadow="inset 0 0 0 1px lightgray"
      padding="2px 4px"
      overflow="hidden"
      textOverflow="ellipsis"
      alignContent="center"
      position="relative"
      fontWeight="bold"
      textAlign="center"
      height="30px"
    >
      {children}
    </Box>
  );
};

const TableRow: FCWithChildren<{}> = ({ children }) => {
  return (
    <Box width="fit-content" height="30px" display="flex">
      {children}
    </Box>
  );
};

const TableCell: FCWithChildren<{ columnId: string }> = ({
  columnId,
  children,
}) => {
  return (
    <Box
      height="30px"
      boxShadow="inset 0 0 0 1px lightgray;"
      padding="0.25rem"
      overflow="hidden"
      textOverflow="ellipsis"
      alignContent="center"
      width={`calc(var(--col-${columnId}-size) * 1px)`}
    >
      {children}
    </Box>
  );
};
