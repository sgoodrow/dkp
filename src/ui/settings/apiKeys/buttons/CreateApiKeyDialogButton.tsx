"use client";

import { trpc } from "@/api/views/trpc/trpc";
import { AddBox } from "@mui/icons-material";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { FC, useState } from "react";
import dayjs from "dayjs";
import { CopyToClipboardButton } from "@/ui/shared/components/buttons/CopyToClipboardButton";
import { monitoringIds } from "@/ui/shared/constants/monitoringIds";
import { Scope, SCOPE } from "@/shared/constants/scopes";

const FORM_TITLE_ID = "create-api-key-title";
const RESULT_TITLE_ID = "created-api-key-title";

const getDefaultExpiresAt = () => dayjs().add(1, "week");
const getDefaultScopes = () =>
  Object.keys(SCOPE).reduce(
    (acc, scope) => ({ ...acc, [scope]: false }),
    {} as Record<Scope, boolean>,
  );

export const CreateApiKeyDialogButton: FC<{}> = ({}) => {
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [createdApiKey, setCreatedApiKey] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [expiresAt, setExpiresAt] = useState(getDefaultExpiresAt());
  const [scopeSelections, setScopeSelections] = useState(getDefaultScopes());

  const utils = trpc.useUtils();

  const { mutate, isPending } = trpc.apiKey.create.useMutation({
    onSuccess: (apiKey) => {
      utils.apiKey.getAll.invalidate();
      setName("");
      setExpiresAt(getDefaultExpiresAt());
      setScopeSelections(getDefaultScopes());
      setFormDialogOpen(false);
      setCreatedApiKey(apiKey);
    },
  });

  const scopes = Object.entries(scopeSelections)
    .filter(([, v]) => v)
    .map(([k, _]) => k as Scope);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (isPending || !expiresAt) {
      return;
    }
    mutate({
      name: name.trim(),
      expiresAt: expiresAt.toDate(),
      scopes: scopes,
    });
  };

  return (
    <>
      <Box display="flex" justifyContent="center">
        <Button
          startIcon={<AddBox />}
          variant="contained"
          onClick={() => setFormDialogOpen(true)}
          size="small"
        >
          New API Key
        </Button>
      </Box>
      <Dialog
        open={formDialogOpen}
        onClose={() => setFormDialogOpen(false)}
        aria-labelledby={FORM_TITLE_ID}
        fullWidth
        disableRestoreFocus
        maxWidth="sm"
      >
        <DialogTitle id={FORM_TITLE_ID}>Create New API Key</DialogTitle>
        <DialogContent>
          <Stack
            component="form"
            onSubmit={handleSubmit}
            display="flex"
            direction="column"
            spacing={2}
            mt={1}
          >
            <TextField
              label="Name"
              variant="outlined"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              fullWidth
              autoFocus
              autoComplete="off"
              disabled={isPending}
              helperText={"Enter a unique name for the API key."}
            />
            <DatePicker
              label="Expires At"
              value={expiresAt}
              onChange={(newValue) => newValue && setExpiresAt(newValue)}
            />
            <FormControl component="fieldset" variant="standard">
              <FormLabel component="legend">Scopes</FormLabel>
              <FormGroup>
                {Object.entries(scopeSelections).map(([scope, enabled]) => (
                  <FormControlLabel
                    key={scope}
                    control={
                      <Switch
                        checked={enabled}
                        onChange={(_, checked) => {
                          setScopeSelections((prev) => ({
                            ...prev,
                            [scope]: checked,
                          }));
                        }}
                        name={scope}
                      />
                    }
                    label={scope}
                  />
                ))}
              </FormGroup>
            </FormControl>
            <Button
              variant="contained"
              type="submit"
              color="primary"
              disabled={!name || !expiresAt || scopes.length === 0 || isPending}
              fullWidth
            >
              Create
            </Button>
          </Stack>
        </DialogContent>
      </Dialog>
      {createdApiKey && (
        <Dialog
          open
          onClose={() => setCreatedApiKey(null)}
          aria-labelledby={RESULT_TITLE_ID}
          fullWidth
          disableRestoreFocus
          maxWidth="sm"
        >
          <DialogTitle id={RESULT_TITLE_ID}>Created New API Key</DialogTitle>
          <DialogContent>
            <Stack spacing={1}>
              <Typography color="text.secondary">
                API keys shored be stored in a secure location. For that reason,
                we do not store your API key in our internal system at all.
                Please copy it now as it will not be shown again.
              </Typography>
              <Divider />
              <CopyToClipboardButton
                label="Copy API Key"
                data-monitoring-id={monitoringIds.COPY_API_KEY}
                value={createdApiKey}
                variant="contained"
              />
            </Stack>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};
