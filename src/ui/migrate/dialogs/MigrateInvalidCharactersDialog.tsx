"use client";
import { MigrateCharacterInvalid } from "@/shared/types/migrateTypes";
import { SiteLink } from "@/ui/shared/components/links/SiteLink";
import {
  AppBar,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Stack,
  Toolbar,
} from "@mui/material";
import { FC } from "react";
import { Close } from "@mui/icons-material";
import { DataTable } from "@/ui/shared/components/tables/DataTable";
import { monitoringIds } from "@/ui/shared/constants/monitoringIds";

export const MigrateInvalidCharactersDialog: FC<{
  siteUrl: string;
  invalidCharacters: MigrateCharacterInvalid[];
  onClose: () => void;
}> = ({ siteUrl, invalidCharacters, onClose }) => {
  return (
    <Dialog open onClose={onClose} fullScreen>
      <AppBar sx={{ position: "relative" }}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={onClose}
            aria-label="close"
          >
            <Close />
          </IconButton>
          <DialogTitle>Invalid Characters</DialogTitle>
        </Toolbar>
      </AppBar>
      <DialogContent sx={{ display: "flex" }}>
        <Stack spacing={1} width={1}>
          <DialogContentText>
            These characters will not be imported in the migration if the issues
            are not fixed.
            <br />
            <br />
            Note that their transactions will be imported and will need to be
            rejected or resolved.
          </DialogContentText>
          <DataTable
            data={invalidCharacters.map((c) => ({ ...c, id: c.eqdkpId }))}
            columnDefs={[
              {
                field: "name",
                headerName: "Name",
                flex: 1,
                cellRenderer: (props) => (
                  <SiteLink
                    label={props.data?.name}
                    data-monitoring-id={monitoringIds.GOTO_EQDKP_CHARACTER}
                    href={`${siteUrl}/index.php/character/${props.data?.id}.html`}
                  />
                ),
              },
              {
                field: "invalidName",
                headerName: "Invalid Name",
                headerTooltip:
                  "First name includes invalid letters such as numbers or punctuation.",
              },
              {
                field: "duplicateNormalizedName",
                headerName: "Duplicate Name",
                headerTooltip: "First name is used by multiple characters.",
              },
              {
                field: "invalidRaceClassCombination",
                headerName: "Invalid Race/Class",
                headerTooltip:
                  "Either the race or class is invalid, or the race and class combination is not permitted.",
              },
              {
                field: "missingOwner",
                headerName: "Missing Owner",
                headerTooltip: "Character does not have an owner.",
              },
            ]}
          />
        </Stack>
      </DialogContent>
    </Dialog>
  );
};
