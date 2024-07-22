import { Box, PaletteMode, Skeleton, useTheme } from "@mui/material";
import { FC } from "react";
import { OverflowTooltipTypography } from "@/ui/shared/components/typography/OverflowTooltipTypography";
import { AgGridReact } from "ag-grid-react";
import {
  ICellRendererParams,
  IDatasource,
  GridOptions,
} from "ag-grid-community";
import { exhaustiveSwitchCheck } from "@/ui/shared/utils/exhaustiveSwitchCheck";
import { Cell } from "@/ui/shared/components/table/Cell";
import "ag-grid-community/styles/ag-grid.css";
import "./theme.css";

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

export const InfiniteTable: FC<{
  datasource?: IDatasource;
  columnDefs: GridOptions["columnDefs"];
}> = ({ datasource, columnDefs }) => {
  const theme = useTheme();
  const { mode } = theme.palette;
  return (
    <Box flexGrow={1} className={getThemeName({ mode })}>
      <AgGridReact
        infiniteInitialRowCount={100}
        rowModelType="infinite"
        datasource={datasource}
        defaultColDef={{
          filterParams: {
            closeOnApply: true,
            maxNumConditions: 1,
            buttons: ["apply", "reset", "cancel"],
          },
          cellRenderer: (props: ICellRendererParams) => (
            <Cell isLoading={props.value === undefined}>
              {props.value}
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
