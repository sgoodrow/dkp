"use client";

import { trpc } from "@/api/views/trpc/trpc";
import { app } from "@/shared/constants/app";
import { DiscordRolesAutocomplete } from "@/ui/install/inputs/DiscordRolesAutocomplete";
import { DiscordServerAutocomplete } from "@/ui/install/inputs/DiscordServerAutocomplete";
import { InstallStep } from "@/ui/install/stepper/InstallStepper";
import { MaintainerLink } from "@/ui/shared/components/links/MaintainerLink";
import { SiteLink } from "@/ui/shared/components/links/SiteLink";
import { monitoringIds } from "@/ui/shared/constants/monitoringIds";
import { exhaustiveSwitchCheck } from "@/ui/shared/utils/exhaustiveSwitchCheck";
import { TextField, Typography } from "@mui/material";
import { FieldComponent } from "@tanstack/react-form";
import { FC } from "react";

export const InstallFormPane: FC<{
  active: InstallStep;
  Field: FieldComponent<
    {
      activationKey: string;
      name: string;
      rulesLink: string;
      discordServerId: string;
      discordOwnerRoleId: string;
      discordHelperRoleId: string;
    },
    undefined
  >;
}> = ({ active, Field }) => {
  const utils = trpc.useUtils();
  return (
    <>
      <Typography sx={{ alignSelf: "center" }} variant="h2">
        {active}
      </Typography>
      {active === "Verify Identity" ? (
        <>
          <Typography>
            In order to complete the installation process, you must verify your
            identity by providing the activation key for this environment.
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
                const isValid = await utils.install.isValidActivationKey.fetch({
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
            <br />
            <br />
            These fields can be changed later via the admin settings.
          </Typography>
          <Field
            name="name"
            key="name"
            // eslint-disable-next-line react/no-children-prop
            children={(field) => (
              <TextField
                label="Guild name"
                value={field.state.value}
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
            Connect to Discord to enable display of member names and roles from
            your server.
            <br />
            <br />
            First,{" "}
            <SiteLink
              data-monitoring-id={monitoringIds.ADD_BOT_TO_DISCORD}
              label={`invite the ${app.icon} ${app.name} bot to your Discord server`}
              href="https://discord.com/oauth2/authorize?client_id=1054652766909386753"
            />
            , then select your server from the list below.
            <br />
            <br />
            Role fields can be changed later via the admin settings.
          </Typography>
          {/* TODO: add a button to refresh server list */}
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
                required
                fullWidth
              />
            )}
          />
          <Field
            name="discordHelperRoleId"
            key="discordHelperRoleId"
            validators={{
              onChangeListenTo: ["discordServerId"],
            }}
            // eslint-disable-next-line react/no-children-prop
            children={(field) => (
              <DiscordRolesAutocomplete
                label="Discord helper role"
                discordServerId={field.form.state.values.discordServerId}
                onChange={(newValue) => {
                  field.handleChange(newValue);
                }}
                required
                fullWidth
                helperText="Helpers are a class of administrators that can verify and reconcile records"
              />
            )}
          />
        </>
      ) : (
        exhaustiveSwitchCheck(active)
      )}
    </>
  );
};
