"use client";

import { trpc } from "@/api/views/trpc/trpc";
import { MigrateStartField } from "@/ui/migrate/dialogs/MigrateStartDialog";
import { getHelperText } from "@/ui/shared/utils/formHelpers";
import { DialogContentText, TextField } from "@mui/material";
import { FC } from "react";

export const MigrateStartDialogConnectSourceForm: FC<{
  Field: MigrateStartField;
  dbUrl: string;
  siteUrl: string;
  siteApiKey: string;
}> = ({ Field, dbUrl, siteUrl, siteApiKey }) => {
  const utils = trpc.useUtils();
  return (
    <>
      <DialogContentText>
        Provide the connection details to access your EQ DKP Plus site and
        database.
        <br />
        <br />
        These values are not stored.
      </DialogContentText>
      <Field
        name="dbUrl"
        validators={{
          onChangeAsyncDebounceMs: 300,
          onChangeAsync: async ({ value }) => {
            if (!value || !siteUrl) {
              return;
            }
            const isValid = await utils.migrate.isValidConnection.fetch({
              dbUrl: value,
              siteUrl,
              siteApiKey,
            });
            if (!isValid) {
              return "Could not verify connection";
            }
          },
        }}
      >
        {(field) => (
          <TextField
            required
            label="Database URL"
            defaultValue={field.state.value}
            placeholder="mysql://user:password@localhost:3306/db"
            autoFocus
            fullWidth
            onChange={(e) => field.handleChange(e.target.value)}
            {...getHelperText({
              field,
              helperText:
                "A connection string that can be used to read from your EQ DKP Plus database.",
            })}
          />
        )}
      </Field>
      <Field
        name="siteUrl"
        validators={{
          onChangeAsyncDebounceMs: 300,
          onChangeAsync: async ({ value }) => {
            if (!value || !siteUrl) {
              return;
            }
            const isValid = await utils.migrate.isValidConnection.fetch({
              dbUrl,
              siteUrl: value,
              siteApiKey,
            });
            if (!isValid) {
              return "Could not verify connection";
            }
          },
        }}
      >
        {(field) => (
          <TextField
            required
            label="Site URL"
            defaultValue={field.state.value}
            placeholder="https://eqdkp-plus.com"
            fullWidth
            onChange={(e) => field.handleChange(e.target.value)}
            {...getHelperText({
              field,
              helperText: "The base URL of your EQ DKP Plus site.",
            })}
          />
        )}
      </Field>
      <Field
        name="siteApiKey"
        validators={{
          onChangeAsyncDebounceMs: 300,
          onChangeAsync: async ({ value }) => {
            if (!value || !siteUrl) {
              return;
            }
            const isValid = await utils.migrate.isValidConnection.fetch({
              dbUrl,
              siteUrl,
              siteApiKey: value,
            });
            if (!isValid) {
              return "Could not verify connection";
            }
          },
        }}
      >
        {(field) => (
          <TextField
            required
            label="Site API Key"
            defaultValue={field.state.value}
            fullWidth
            onChange={(e) => field.handleChange(e.target.value)}
            {...getHelperText({
              field,
              helperText:
                "An API key with read access to your EQ DKP Plus site.",
            })}
          />
        )}
      </Field>
    </>
  );
};
