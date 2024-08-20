import { character } from "@/shared/utils/character";
import { MigrateStartField } from "@/ui/migrate/dialogs/MigrateStartDialog";
import { getHelperText } from "@/ui/shared/utils/formHelpers";
import { DialogContentText, TextField } from "@mui/material";
import { FC } from "react";

export const MigrateStartDialogPrepareBotsForm: FC<{
  Field: MigrateStartField;
}> = ({ Field }) => {
  return (
    <>
      <DialogContentText>
        Characters with no user association will not be imported unless their
        name is provided below.
      </DialogContentText>
      <Field
        name="botNamesCsv"
        validators={{
          onChange: ({ value }) => {
            if (!value) {
              return;
            }
            const names = value
              .split(",")
              .map((n) => n.trim())
              .filter(Boolean);
            const errors = names
              .map((n, i) => {
                if (n.length < 4) {
                  return `Name '${n}' is too short, must be at least 4 characters long`;
                }
                if (!character.isValidName(n)) {
                  return `Name ${n} is invalid, must only contain letters`;
                }
              })
              .filter(Boolean);

            if (errors.length > 0) {
              return errors.join(". ");
            }
          },
        }}
      >
        {(field) => (
          <TextField
            label={`Bot Names`}
            autoFocus
            fullWidth
            multiline
            rows={4}
            onChange={(e) => field.handleChange(e.target.value)}
            {...getHelperText({
              field,
              helperText: "Provide a comma-separated list of character names.",
            })}
          />
        )}
      </Field>
    </>
  );
};
