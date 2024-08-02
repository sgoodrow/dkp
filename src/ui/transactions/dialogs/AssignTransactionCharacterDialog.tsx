"use client";

import { trpc } from "@/api/views/trpc/trpc";
import {
  AssignDialogButton,
  FormDialog,
} from "@/ui/shared/components/dialogs/FormDialog";
import { CharacterLink } from "@/ui/shared/components/links/CharacterLink";
import { CharacterAutocomplete } from "@/ui/transactions/inputs/CharacterAutocomplete";
import { DialogContentText } from "@mui/material";
import { useForm } from "@tanstack/react-form";
import { FC } from "react";

export const AssignTransactionCharacterDialog: FC<{
  transactionId: number;
  character: {
    id: number;
    name: string;
    defaultPilotId: string | null;
  } | null;
  characterName: string;
  onAssign: () => void;
  onClose: () => void;
}> = ({ transactionId, character, characterName, onAssign, onClose }) => {
  const { Field, Subscribe, handleSubmit, reset } = useForm({
    defaultValues: {
      characterId: character?.id || -1,
    },
    onSubmit: async ({ value }) => {
      mutate({
        characterId: value.characterId,
        transactionId: transactionId,
      });
    },
  });

  const utils = trpc.useUtils();

  const { mutate } = trpc.wallet.updateTransaction.useMutation({
    onSuccess: () => {
      reset();
      onClose();
      utils.wallet.invalidate();
      onAssign();
    },
  });

  return (
    <FormDialog
      id="assign-transaction-character-dialog-title"
      title={`${character ? "Re-" : ""}Assign Transaction Character`}
      onSubmit={handleSubmit}
      onClose={onClose}
    >
      {character && (
        <DialogContentText>
          Are you sure you want to re-assign the character for this transaction?
          <br />
          <br />
          It is currently assigned to <CharacterLink character={character} />.
        </DialogContentText>
      )}
      <Field
        name="characterId"
        // eslint-disable-next-line react/no-children-prop
        children={(field) => (
          <CharacterAutocomplete
            label="Character"
            onChange={field.setValue}
            defaultValue={
              character
                ? { id: character.id, label: character.name }
                : { id: -1, label: characterName }
            }
          />
        )}
      />
      <Subscribe
        selector={(state) => ({
          canSubmit: state.canSubmit,
          isSubmitting: state.isSubmitting,
        })}
        // eslint-disable-next-line react/no-children-prop
        children={({ canSubmit, isSubmitting }) => (
          <AssignDialogButton disabled={!canSubmit || isSubmitting} />
        )}
      />
    </FormDialog>
  );
};
