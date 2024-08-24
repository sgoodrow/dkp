"use client";

import { SiteLink } from "@/ui/shared/components/links/SiteLink";
import {
  AppBar,
  Button,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Skeleton,
  Stack,
  Toolbar,
} from "@mui/material";
import { FC } from "react";
import { Close } from "@mui/icons-material";
import { monitoringIds } from "@/ui/shared/constants/monitoringIds";
import { InfiniteTable } from "@/ui/shared/components/tables/InfiniteTable";
import { trpc } from "@/api/views/trpc/trpc";
import { LoadingCell } from "@/ui/shared/components/tables/LoadingCell";
import { useActivationKey } from "@/ui/shared/contexts/ActivationKeyContext";

export const MigrateInvalidCharactersDialog: FC<{
  siteUrl: string;
  invalidCharacterCount?: number;
  resetForm: () => void;
  onClose: () => void;
  onAuthorize: () => void;
}> = ({ siteUrl, invalidCharacterCount, resetForm, onClose, onAuthorize }) => {
  const activationKey = useActivationKey();

  const utils = trpc.useUtils();

  const { mutate, isPending } =
    trpc.migrate.restartCharacterMigration.useMutation({
      onSuccess: () => {
        resetForm();
        utils.migrate.invalidate();
        onClose();
      },
    });

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
          <DialogTitle sx={{ flex: 1 }}>Invalid Characters</DialogTitle>
          <Button
            disabled={isPending}
            onClick={() => {
              mutate({ activationKey });
            }}
            color="secondary"
            sx={{ mr: 1 }}
          >
            Retry Character Import
          </Button>
          <Button
            disabled={isPending}
            onClick={() => {
              onAuthorize();
              onClose();
            }}
            color="primary"
          >
            Skip Invalid
          </Button>
        </Toolbar>
      </AppBar>
      <DialogContent sx={{ display: "flex" }}>
        <Stack spacing={1} width={1}>
          <DialogContentText>
            Please either fix all{" "}
            {invalidCharacterCount === undefined ? (
              <Skeleton width="40px" />
            ) : (
              invalidCharacterCount
            )}{" "}
            characters or authorize that they be skipped. Skipped characters
            will not have their transactions imported.
            <br />
            <br />
            After fixing characters in the remote system, click retry to reset
            the character import and try again.
          </DialogContentText>
          <InfiniteTable
            getRows={utils.migrate.getManyInvalidCharacters.fetch}
            columnDefs={[
              {
                field: "name",
                headerName: "Name",
                flex: 1,
                sortable: true,
                filter: "agTextColumnFilter",
                cellRenderer: ({ data }) =>
                  data === undefined ? (
                    <LoadingCell />
                  ) : (
                    <SiteLink
                      label={data.name}
                      data-monitoring-id={monitoringIds.GOTO_EQDKP_CHARACTER}
                      href={`${siteUrl}/index.php/character/${data.remoteId}.html`}
                    />
                  ),
              },
              {
                field: "invalidName",
                headerName: "Invalid Name",
                headerTooltip:
                  "First name includes invalid letters such as numbers or punctuation.",
                cellRenderer: "agCheckboxCellRenderer",
                flex: 1,
                sortable: true,
              },
              {
                field: "duplicateNormalizedName",
                headerName: "Duplicate Name",
                headerTooltip: "First name is used by multiple characters.",
                cellRenderer: "agCheckboxCellRenderer",
                flex: 1,
                sortable: true,
              },
              {
                field: "missingOwner",
                headerName: "Missing Owner",
                headerTooltip: "Character does not have an owner.",
                cellRenderer: "agCheckboxCellRenderer",
                flex: 1,
                sortable: true,
              },
            ]}
          />
        </Stack>
      </DialogContent>
    </Dialog>
  );
};
