"use client";

import { trpc } from "@/api/views/trpc/trpc";
import { PlayerLink } from "@/ui/shared/components/links/PlayerLink";
import { UserAutocomplete } from "@/ui/transactions/inputs/UserAutocomplete";
import { Edit, Warning } from "@mui/icons-material";
import {
  Button,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Stack,
  Tooltip,
} from "@mui/material";
import { useForm } from "@tanstack/react-form";
import { FC, useState } from "react";

const DIALOG_TITLE_ID = "assign-pilot-dialog-title";

export const AssignPilotIconButtonDialog: FC<{
  transactionId: number;
  pilot: {
    id: string;
    displayName: string;
    discordMetadata: {
      roleIds: string[];
    } | null;
  } | null;
  onAssign: () => void;
}> = ({ transactionId, pilot, onAssign }) => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Tooltip
        disableInteractive
        title={
          pilot
            ? "Click to change the pilot for this transaction."
            : "Click to assign a pilot for this transaction."
        }
        placement="left"
      >
        <IconButton onClick={() => setOpen(true)}>
          {pilot ? <Edit /> : <Warning color="warning" />}
        </IconButton>
      </Tooltip>
      {open && (
        <AssignPilotDialog
          transactionId={transactionId}
          pilot={pilot}
          onAssign={onAssign}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
};

const AssignPilotDialog: FC<{
  transactionId: number;
  pilot: {
    id: string;
    displayName: string;
    discordMetadata: {
      roleIds: string[];
    } | null;
  } | null;
  onAssign: () => void;
  onClose: () => void;
}> = ({ transactionId, pilot, onAssign, onClose }) => {
  const { Field, Subscribe, handleSubmit, reset } = useForm({
    defaultValues: {
      pilotId: pilot?.id || "",
    },
    onSubmit: async ({ value }) => {
      mutate({
        pilotId: value.pilotId,
        transactionId: transactionId,
      });
    },
  });

  const utils = trpc.useUtils();

  const { mutate } = trpc.wallet.assignTransactionPilot.useMutation({
    onSuccess: () => {
      reset();
      onClose();
      utils.wallet.invalidate();
      onAssign();
    },
  });

  return (
    <Dialog
      open
      onClose={onClose}
      aria-labelledby={DIALOG_TITLE_ID}
      fullWidth
      disableRestoreFocus
      maxWidth="sm"
    >
      <DialogTitle id={DIALOG_TITLE_ID}>
        {pilot ? "Re-" : ""}Assign Transaction Pilot
      </DialogTitle>
      <DialogContent>
        <Stack
          component="form"
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleSubmit();
          }}
          display="flex"
          direction="column"
          spacing={2}
          mt={1}
        >
          {pilot && (
            <DialogContentText>
              Are you sure you want to re-assign the pilot for this transaction?
              <br />
              <br />
              It is currently assigned to <PlayerLink user={pilot} />.
            </DialogContentText>
          )}
          {
            <Field
              name="pilotId"
              // eslint-disable-next-line react/no-children-prop
              children={(field) => (
                <UserAutocomplete
                  label="Pilot"
                  onChange={field.setValue}
                  defaultValue={
                    pilot
                      ? { id: pilot.id, label: pilot.displayName }
                      : undefined
                  }
                />
              )}
            />
          }
          <Subscribe
            selector={(state) => ({
              canSubmit: state.canSubmit,
              isSubmitting: state.isSubmitting,
            })}
            // eslint-disable-next-line react/no-children-prop
            children={({ canSubmit, isSubmitting }) => {
              return (
                <Button
                  variant="contained"
                  type="submit"
                  color="primary"
                  disabled={!canSubmit || isSubmitting}
                  fullWidth
                >
                  Assign
                </Button>
              );
            }}
          />
        </Stack>
      </DialogContent>
    </Dialog>
  );
};
