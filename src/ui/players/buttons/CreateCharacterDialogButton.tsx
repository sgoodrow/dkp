"use client";

import { trpc } from "@/api/views/trpc/trpc";
import { AddCircle } from "@mui/icons-material";
import {
  Autocomplete,
  Button,
  Checkbox,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  FormLabel,
  IconButton,
  Stack,
  TextField,
  Tooltip,
} from "@mui/material";
import { FC, useState } from "react";
import { useForm } from "@tanstack/react-form";

const DIALOG_TITLE_ID = "create-character-dialog-title";

export const CreateCharacterDialogButton: FC<{}> = ({}) => {
  const [open, setOpen] = useState(false);
  const [isBot, setIsBot] = useState(false);

  const { Field, Subscribe, handleSubmit, reset, useStore } = useForm({
    defaultValues: {
      name: "",
      classId: -1,
      raceId: -1,
      isBot,
    },
    onSubmit: async ({ value }) => {
      mutate({
        name: value.name,
        raceId: value.raceId,
        classId: value.classId,
        isBot: value.isBot,
      });
    },
  });

  const currentRaceId = useStore((state) => state.values.raceId);
  const currentClassId = useStore((state) => state.values.classId);

  const { data: isAdmin } = trpc.user.isAdmin.useQuery();
  const { data: classes } = trpc.character.getClasses.useQuery({
    raceId: currentRaceId === -1 ? undefined : currentRaceId,
  });
  const { data: races } = trpc.character.getRaces.useQuery({
    classId: currentClassId === -1 ? undefined : currentClassId,
  });

  const utils = trpc.useUtils();

  const { mutate } = trpc.character.create.useMutation({
    onSuccess: () => {
      reset();
      setOpen(false);
      utils.character.get.invalidate();
    },
  });

  return (
    <>
      <Tooltip title="Create a new character.">
        <IconButton color="primary" onClick={() => setOpen(true)} size="small">
          <AddCircle />
        </IconButton>
      </Tooltip>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby={DIALOG_TITLE_ID}
        fullWidth
        disableRestoreFocus
        maxWidth="sm"
      >
        <DialogTitle id={DIALOG_TITLE_ID}>Create New Character</DialogTitle>
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
            {
              <Field
                name="name"
                validators={{
                  onChange: ({ value }) => {
                    if (value.length < 4) {
                      return "Name must be at least 3 characters long";
                    }
                    if (!/^[a-zA-Z]*$/.test(value)) {
                      return "Name can only contain letters";
                    }
                  },
                  onChangeAsyncDebounceMs: 100,
                  onChangeAsync: async ({ value }) => {
                    const isNameAvailable =
                      await utils.character.isNameAvailable.fetch({
                        name: value,
                      });
                    if (!isNameAvailable) {
                      return "Name already in use";
                    }
                  },
                }}
                // eslint-disable-next-line react/no-children-prop
                children={(field) => {
                  return (
                    <TextField
                      value={field.state.value}
                      onChange={(e) => {
                        e.stopPropagation();
                        field.handleChange(e.target.value);
                      }}
                      required
                      label="Name"
                      autoFocus
                      fullWidth
                      error={
                        field.state.meta.isTouched &&
                        field.state.meta.errors.length > 0
                      }
                      helperText={
                        field.state.meta.isTouched &&
                        field.state.meta.errors.length > 0
                          ? field.state.meta.errors.join(",")
                          : "Enter the first name of the character"
                      }
                    />
                  );
                }}
              />
            }
            <Field
              name="raceId"
              // eslint-disable-next-line react/no-children-prop
              children={(field) => (
                <Autocomplete
                  value={races?.find(({ id }) => id === field.state.value)}
                  onChange={(e, newValue) => {
                    e.stopPropagation();
                    field.handleChange(newValue?.id ?? -1);
                  }}
                  options={races || []}
                  fullWidth
                  autoHighlight
                  autoSelect
                  getOptionLabel={({ name }) => name}
                  renderInput={(params) => (
                    <TextField {...params} required label="Race" />
                  )}
                />
              )}
            />
            <Field
              name="classId"
              // eslint-disable-next-line react/no-children-prop
              children={(field) => (
                <Autocomplete
                  value={classes?.find(({ id }) => id === field.state.value)}
                  onChange={(e, newValue) => {
                    e.stopPropagation();
                    field.handleChange(newValue?.id ?? -1);
                  }}
                  options={classes || []}
                  fullWidth
                  autoHighlight
                  autoSelect
                  getOptionLabel={({ name }) => name}
                  renderInput={(params) => (
                    <TextField {...params} required label="Class" />
                  )}
                />
              )}
            />
            {isAdmin && (
              <FormGroup>
                <FormLabel component="legend">Admin only options</FormLabel>
                <FormControlLabel
                  control={
                    <Checkbox
                      value={isBot}
                      onChange={(e) => setIsBot(e.target.checked)}
                    />
                  }
                  label="Bot"
                />
                <FormHelperText>
                  Indicate if this character is a bot. Bot characters require a
                  pilot to be assigned on raid activities.
                </FormHelperText>
              </FormGroup>
            )}
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
                    Create
                  </Button>
                );
              }}
            />
          </Stack>
        </DialogContent>
      </Dialog>
    </>
  );
};
