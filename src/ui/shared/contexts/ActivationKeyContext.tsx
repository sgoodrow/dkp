"use client";

import { createContext, useState, useContext } from "react";
import { useForm } from "@tanstack/react-form";
import { FormDialog } from "@/ui/shared/components/dialogs/FormDialog";
import { Button, DialogContentText, TextField } from "@mui/material";
import { MaintainerLink } from "@/ui/shared/components/links/MaintainerLink";
import { trpc } from "@/api/views/trpc/trpc";
import { getHelperText } from "@/ui/shared/utils/formHelpers";

const Context = createContext<string>("");

export const ActivationKeyContextProvider: FCWithChildren<{}> = ({
  children,
}) => {
  const [activationKey, setActivationKey] = useState<string>("");

  const { Field, Subscribe, handleSubmit } = useForm({
    defaultValues: {
      activationKey: "",
    },
    onSubmit: async ({ value }) => {
      setActivationKey(value.activationKey);
    },
  });

  const utils = trpc.useUtils();

  return (
    <Context.Provider value={activationKey}>
      {activationKey ? (
        children
      ) : (
        <FormDialog
          id="activate-form"
          title="Verify Identity"
          hideBackdrop
          onSubmit={handleSubmit}
          onClose={() => null}
        >
          <DialogContentText>
            In order to perform the installation process, you must verify your
            identity by providing the activation key for this site.
            <br />
            <br />
            If you lost it, please contact <MaintainerLink />.
          </DialogContentText>
          <Field
            name="activationKey"
            key="activationKey"
            validators={{
              onChangeAsyncDebounceMs: 300,
              onChangeAsync: async ({ value }) => {
                if (!value) {
                  return;
                }
                const isValid = await utils.install.isValidActivationKey.fetch({
                  activationKey: value,
                });
                if (!isValid) {
                  return "Activation key is not valid";
                }
              },
            }}
          >
            {(field) => (
              <TextField
                label="Activation Key"
                value={field.state.value}
                onChange={(e) => {
                  field.handleChange(e.target.value);
                }}
                required
                autoFocus
                fullWidth
                {...getHelperText({
                  field,
                  helperText: "Enter the activation key you were provided",
                })}
              />
            )}
          </Field>
          <Subscribe
            selector={(state) => ({
              canSubmit: state.canSubmit,
              isSubmitting: state.isSubmitting,
            })}
          >
            {({ canSubmit, isSubmitting }) => (
              <Button
                variant="contained"
                type="submit"
                color="primary"
                disabled={!canSubmit || isSubmitting}
              >
                Submit
              </Button>
            )}
          </Subscribe>
        </FormDialog>
      )}
    </Context.Provider>
  );
};

export const useActivationKey = () => {
  const context = useContext(Context);
  if (context === undefined) {
    throw new Error(
      "useActivationKey must be used within an ActivationKeyContextProvider",
    );
  }
  return context;
};
