"use client";

import { trpc } from "@/api/views/trpc/trpc";
import { app } from "@/shared/constants/app";
import { DiscordRolesAutocomplete } from "@/ui/install/inputs/DiscordRolesAutocomplete";
import { DiscordServerAutocomplete } from "@/ui/install/inputs/DiscordServerAutocomplete";
import { InstallAttemptPane } from "@/ui/install/panes/InstallAttemptPane";
import { ContainerCardLayout } from "@/ui/shared/components/layouts/ContainerCardLayout";
import { MaintainerLink } from "@/ui/shared/components/links/MaintainerLink";
import { SiteLink } from "@/ui/shared/components/links/SiteLink";
import { monitoringIds } from "@/ui/shared/constants/monitoringIds";
import { exhaustiveSwitchCheck } from "@/ui/shared/utils/exhaustiveSwitchCheck";
import {
  Button,
  Divider,
  Stack,
  Step,
  StepLabel,
  Stepper,
  TextField,
  Typography,
} from "@mui/material";
import { useForm } from "@tanstack/react-form";
import { FC, useState } from "react";

const STEPS = ["Verify Identity", "Setup Guild", "Connect Discord"] as const;

type Steps = (typeof STEPS)[number];

export const InstallStepper: FC<{}> = ({}) => {
  const [active, setActive] = useState<Steps>(STEPS[0]);
  const [retrying, setRetrying] = useState(false);

  const { data: latest } = trpc.install.getLatest.useQuery();

  const { Field, Subscribe, handleSubmit } = useForm({
    defaultValues: {
      activationKey: "",
      name: "",
      rulesLink: "",
      discordServerId: "",
      discordOwnerRoleId: "",
      discordAdminRoleId: "",
    },
    onSubmit: async ({ value }) => {
      mutate({
        activationKey: value.activationKey,
        name: value.name,
        rulesLink: value.rulesLink,
        discordServerId: value.discordServerId,
        discordOwnerRoleId: value.discordOwnerRoleId,
        discordAdminRoleId: value.discordAdminRoleId,
      });
    },
  });

  const utils = trpc.useUtils();

  const { mutate } = trpc.install.start.useMutation({
    onSettled: () => {
      utils.install.getLatest.invalidate();
      setRetrying(false);
    },
  });

  const activeIndex = STEPS.indexOf(active);

  const final = active === STEPS[STEPS.length - 1];

  const handleNext = () => {
    setActive((s) => STEPS[STEPS.indexOf(s) + 1]);
  };

  const handleBack = () => {
    if (activeIndex === 0 && retrying) {
      setRetrying(false);
      return;
    }
    setActive((s) => STEPS[STEPS.indexOf(s) - 1]);
  };

  return latest === undefined ? null : latest === null || retrying ? (
    <ContainerCardLayout maxWidth="sm">
      <Typography sx={{ alignSelf: "center" }} variant="h1">
        Install
      </Typography>
      <Stepper activeStep={activeIndex} alternativeLabel>
        {STEPS.map((s) => (
          <Step key={s}>
            <StepLabel>{s}</StepLabel>
          </Step>
        ))}
      </Stepper>
      <Divider />
      <Stack
        component="form"
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          if (final) {
            handleSubmit();
          } else {
            handleNext();
          }
        }}
        display="flex"
        direction="column"
        spacing={3}
      >
        <Typography sx={{ alignSelf: "center" }} variant="h2">
          {active}
        </Typography>
        {active === "Verify Identity" ? (
          <>
            <Typography>
              In order to complete the installation process, you must verify
              your identity by providing the activation key for this
              environment.
              <br />
              <br />
              If you lost it, please contact <MaintainerLink />.
            </Typography>
            <Field
              name="activationKey"
              key="activationKey"
              validators={{
                onChangeAsyncDebounceMs: 300,
                onChangeAsync: async ({ value }) => {
                  const isValid =
                    await utils.install.isValidActivationKey.fetch({
                      activationKey: value,
                    });
                  if (!isValid) {
                    return "Activation key is not valid";
                  }
                },
              }}
              // eslint-disable-next-line react/no-children-prop
              children={(field) => (
                <TextField
                  label="Activation Key"
                  value={field.state.value}
                  defaultValue={field.state.value}
                  onChange={(e) => {
                    field.handleChange(e.target.value);
                  }}
                  required
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
                      : "Enter the activation key you were provided"
                  }
                />
              )}
            />
          </>
        ) : active === "Setup Guild" ? (
          <>
            <Typography>
              Provide some information about your guild to get started.
            </Typography>
            <Field
              name="name"
              key="name"
              // eslint-disable-next-line react/no-children-prop
              children={(field) => (
                <TextField
                  label="Guild name"
                  value={field.state.value}
                  defaultValue={field.state.value}
                  onChange={(e) => {
                    field.handleChange(e.target.value);
                  }}
                  required
                  autoFocus
                  fullWidth
                />
              )}
            />
            <Field
              name="rulesLink"
              key="rulesLink"
              // eslint-disable-next-line react/no-children-prop
              children={(field) => (
                <TextField
                  label="Guild rules link"
                  value={field.state.value}
                  defaultValue={field.state.value}
                  onChange={(e) => {
                    field.handleChange(e.target.value);
                  }}
                  fullWidth
                  helperText="The guild rules will be displayed as a link in the sidebar"
                />
              )}
            />
          </>
        ) : active === "Connect Discord" ? (
          <>
            <Typography>
              Connect to Discord to enable display of member names and roles
              from your server.
              <br />
              <br />
              First,{" "}
              <SiteLink
                data-monitoring-id={monitoringIds.ADD_BOT_TO_DISCORD}
                label={`invite the ${app.icon} ${app.name} bot to your Discord server`}
                href="https://discord.com/oauth2/authorize?client_id=1054652766909386753"
              />
              , then select your server from the list below.
            </Typography>
            <Field
              name="discordServerId"
              key="discordServerId"
              // eslint-disable-next-line react/no-children-prop
              children={(field) => (
                <DiscordServerAutocomplete
                  label="Discord server"
                  onChange={(newValue) => {
                    field.handleChange(newValue);
                  }}
                  defaultValue={field.state.value}
                  required
                  autoFocus
                  fullWidth
                />
              )}
            />
            <Field
              name="discordOwnerRoleId"
              key="discordOwnerRoleId"
              validators={{
                onChangeListenTo: ["discordServerId"],
              }}
              // eslint-disable-next-line react/no-children-prop
              children={(field) => (
                <DiscordRolesAutocomplete
                  label="Discord owner role"
                  discordServerId={field.form.state.values.discordServerId}
                  onChange={(newValue) => {
                    field.handleChange(newValue);
                  }}
                  defaultValue={field.state.value}
                  disabled={!field.form.state.values.discordOwnerRoleId}
                  required
                  fullWidth
                  helperText="Owners can modify these settings at a future date"
                />
              )}
            />
            <Field
              name="discordAdminRoleId"
              key="discordAdminRoleId"
              validators={{
                onChangeListenTo: ["discordServerId"],
              }}
              // eslint-disable-next-line react/no-children-prop
              children={(field) => (
                <DiscordRolesAutocomplete
                  label="Discord admin role"
                  discordServerId={field.form.state.values.discordServerId}
                  onChange={(newValue) => {
                    field.handleChange(newValue);
                  }}
                  defaultValue={field.state.value}
                  disabled={!field.form.state.values.discordServerId}
                  required
                  fullWidth
                  helperText="Admins can create and modify records in the application"
                />
              )}
            />
          </>
        ) : (
          exhaustiveSwitchCheck(active)
        )}
        {activeIndex < STEPS.length && (
          <Stack direction="row" justifyContent="space-between">
            <Button
              disabled={activeIndex === 0 && !retrying}
              onClick={handleBack}
              color="secondary"
            >
              Back
            </Button>
            <Subscribe
              selector={(state) => ({
                canSubmit: state.canSubmit,
                isSubmitting: state.isSubmitting,
              })}
              // eslint-disable-next-line react/no-children-prop
              children={({ canSubmit, isSubmitting }) => (
                <Button
                  variant={final ? "contained" : "outlined"}
                  type="submit"
                  color={final ? "primary" : "secondary"}
                  disabled={!canSubmit || isSubmitting}
                >
                  {final ? "Finish" : "Next"}
                </Button>
              )}
            />
          </Stack>
        )}
      </Stack>
    </ContainerCardLayout>
  ) : (
    <InstallAttemptPane latest={latest} onTryAgain={() => setRetrying(true)} />
  );
};
