import { FC } from "react";
import { Box, ToggleButton, ToggleButtonGroup, Tooltip } from "@mui/material";
import { CustomFilterProps } from "ag-grid-react";
import {
  CheckBox,
  CheckBoxOutlineBlank,
  SvgIconComponent,
} from "@mui/icons-material";
import { FilterChangeButtons } from "@/ui/shared/components/tables/FilterChangeButtons";
import { BooleanFilter } from "@/api/shared/agGridUtils/filterTypes/boolean";

type BooleanFilterValue = "true" | "false" | "all";

export const BooleanColumnFilter: FC<
  CustomFilterProps<unknown, any, BooleanFilter>
> = ({ model, onModelChange, api }) => {
  const value =
    model?.filterType === "boolean"
      ? model.filter === true
        ? "true"
        : "false"
      : "all";

  const handleModelChange = (newValue: BooleanFilterValue) => {
    onModelChange(
      newValue === "all"
        ? null
        : {
            filterType: "boolean",
            type: "equals",
            filter: newValue === "true" ? true : false,
          },
    );
  };

  return (
    <>
      <Box className="ag-simple-filter-body-wrapper" textAlign="center">
        <ToggleButtonGroup
          value={value}
          exclusive
          onChange={(_, newValue) => handleModelChange(newValue)}
          aria-label="Boolean type filter"
          size="small"
          sx={{
            bgcolor: "var(--ag-background-color)",
          }}
        >
          <BooleanToggleButton
            value="true"
            label="Show true only"
            Icon={CheckBox}
          />
          <BooleanToggleButton
            value="false"
            label="Show false only"
            Icon={CheckBoxOutlineBlank}
          />
        </ToggleButtonGroup>
      </Box>
      <FilterChangeButtons
        onClear={() => {
          onModelChange(null);
          api.hidePopupMenu();
        }}
        onCancel={() => {
          api.hidePopupMenu();
        }}
      />
    </>
  );
};

const BooleanToggleButton: FC<{
  value: "true" | "false";
  label: string;
  Icon: SvgIconComponent;
}> = ({ value, label, Icon }) => {
  return (
    <ToggleButton
      sx={{
        color: "var(--ag-alpine-active-color)",
        borderColor: "var(--ag-alpine-active-color)",
        padding: 1,
      }}
      value={value}
      aria-label={label}
    >
      <Tooltip title={label}>
        <Icon height="1rem" fontSize="small" />
      </Tooltip>
    </ToggleButton>
  );
};
