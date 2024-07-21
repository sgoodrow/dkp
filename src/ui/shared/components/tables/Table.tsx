"use client";

import { FC, memo, useMemo, useRef } from "react";
import {
  ColumnSizingColumn,
  ColumnSizingHeader,
  flexRender,
  Row,
} from "@tanstack/react-table";
import {
  useVirtualizer,
  VirtualItem,
  Virtualizer,
} from "@tanstack/react-virtual";
import { Box, Paper, Typography, useTheme } from "@mui/material";

const ELEVATION = 1;

export const Table = <TData,>({
  table,
  rowHeight,
  height,
}: {
  table: import("@tanstack/table-core").Table<TData>;
  rowHeight: number;
  height: number;
}) => {
  const columnSizingInfo = table.getState().columnSizingInfo;
  const columnSizing = table.getState().columnSizing;
  const { rows } = table.getRowModel();

  const tableContainerRef = useRef<HTMLDivElement>(null);

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

  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    estimateSize: () => rowHeight, //estimate row height for accurate scrollbar dragging
    getScrollElement: () => tableContainerRef.current,
    //measure dynamic row height, except in firefox because it measures table border height incorrectly
    measureElement:
      typeof window !== "undefined" &&
      navigator.userAgent.indexOf("Firefox") === -1
        ? (element) => element?.getBoundingClientRect().height
        : undefined,
    overscan: 5,
  });

  return (
    <Box
      ref={tableContainerRef}
      position="relative" //needed for sticky header
      height={height}
      sx={{
        overflowX: "auto",
      }}
      component={Paper}
      elevation={ELEVATION}
    >
      {/* table */}
      <Box width={table.getTotalSize()} sx={columnSizeVars}>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableHeaderRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHeaderCell key={header.id} headerId={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                  <TableHeaderCellResizer
                    getIsResizing={header.column.getIsResizing}
                    getResizeHandler={header.getResizeHandler}
                    resetSize={header.column.resetSize}
                  />
                </TableHeaderCell>
              ))}
            </TableHeaderRow>
          ))}
        </TableHeader>
        {table.getState().columnSizingInfo.isResizingColumn ? (
          <MemoizedTableBody rows={rows} rowVirtualizer={rowVirtualizer} />
        ) : (
          <TableBody rows={rows} rowVirtualizer={rowVirtualizer} />
        )}
      </Box>
    </Box>
  );
};

const TableHeader: FCWithChildren<{}> = ({ children }) => {
  const theme = useTheme();
  return (
    <Box
      position="sticky"
      top={0}
      zIndex={1}
      bgcolor={theme.palette.background.paper}
      sx={{
        backgroundImage: theme.overlays[ELEVATION],
      }}
      boxShadow={theme.shadows[3]}
    >
      {children}
    </Box>
  );
};

const TableBody = <TData,>({
  rows,
  rowVirtualizer,
}: {
  rows: Row<TData>[];
  rowVirtualizer: Virtualizer<HTMLDivElement, Element>;
}) => {
  return (
    <Box
      height={`${rowVirtualizer.getTotalSize()}px`} //tells scrollbar how big the table is
      position="relative" //needed for absolute positioning of rows
    >
      {rowVirtualizer.getVirtualItems().map((virtualRow) => {
        const row = rows[virtualRow.index] as Row<TData>;
        return (
          <TableBodyRow
            key={row.id}
            rowVirtualizer={rowVirtualizer}
            virtualRow={virtualRow}
          >
            {row.getVisibleCells().map((cell) => {
              return (
                <TableBodyCell key={cell.id} columnId={cell.column.id}>
                  {cell.renderValue<any>()}
                </TableBodyCell>
              );
            })}
          </TableBodyRow>
        );
      })}
    </Box>
  );
};

const MemoizedTableBody = memo(
  TableBody,
  (prev, next) => prev.rows === next.rows,
) as typeof TableBody;

const TableHeaderRow: FCWithChildren<{}> = ({ children }) => {
  return (
    <Box width="fit-content" display="flex">
      {children}
    </Box>
  );
};

const TableHeaderCell: FCWithChildren<{
  headerId: string;
}> = ({ headerId, children }) => {
  return (
    <Box
      width={`calc(var(--header-${headerId}-size) * 1px)`}
      p={1}
      position="relative"
    >
      <Typography variant="h6">{children}</Typography>
    </Box>
  );
};

const TableHeaderCellResizer: FC<{
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

const TableBodyRow: FCWithChildren<{
  rowVirtualizer: Virtualizer<HTMLDivElement, Element>;
  virtualRow: VirtualItem<Element>;
}> = ({ rowVirtualizer, virtualRow, children }) => {
  return (
    <Box
      display="flex"
      position="absolute"
      width="fit-content"
      height="30px"
      sx={{
        transform: `translateY(${virtualRow.start}px)`, //this should always be a
      }}
      ref={(node: Element | null | undefined) =>
        rowVirtualizer.measureElement(node)
      } //measure dynamic row height
      data-index={virtualRow.index} //needed for dynamic row height measurement
    >
      {children}
    </Box>
  );
};

const TableBodyCell: FCWithChildren<{ columnId: string }> = ({
  columnId,
  children,
}) => {
  const theme = useTheme();
  return (
    <Box
      height="30px"
      borderBottom={`1px solid ${theme.palette.divider}`}
      //   boxShadow="inset 0 0 0 1px lightgray;"
      px={1}
      overflow="hidden"
      textOverflow="ellipsis"
      alignContent="center"
      width={`calc(var(--col-${columnId}-size) * 1px)`}
    >
      {children}
    </Box>
  );
};
