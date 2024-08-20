"use client";

import { InstallStartField } from "@/ui/install/dialogs/InstallStartDialog";
import { DialogContentText, TextField } from "@mui/material";
import { FC } from "react";

export const InstallStartDialogSetupGuildForm: FC<{
  Field: InstallStartField;
}> = ({ Field }) => {
  return (
    <>
      <DialogContentText>
        Provide some information about your guild to get started.
        <br />
        <br />
        These fields can be changed later via the admin settings.
      </DialogContentText>
      <Field name="name" key="name">
        {(field) => (
          <TextField
            label="Guild name"
            defaultValue={field.state.value}
            onChange={(e) => {
              field.handleChange(e.target.value);
            }}
            required
            autoFocus
            fullWidth
          />
        )}
      </Field>
      <Field name="rulesLink" key="rulesLink">
        {(field) => (
          <TextField
            label="Guild rules link"
            defaultValue={field.state.value}
            onChange={(e) => {
              field.handleChange(e.target.value);
            }}
            fullWidth
            helperText="The guild rules will be displayed as a link in the sidebar"
          />
        )}
      </Field>
    </>
  );
};
