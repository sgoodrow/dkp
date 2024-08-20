"use client";

import { trpc } from "@/api/views/trpc/trpc";
import { app } from "@/shared/constants/app";
import { InstallStartField } from "@/ui/install/dialogs/InstallStartDialog";
import { DiscordRolesAutocomplete } from "@/ui/install/inputs/DiscordRolesAutocomplete";
import { DiscordServerAutocomplete } from "@/ui/install/inputs/DiscordServerAutocomplete";
import { SiteLink } from "@/ui/shared/components/links/SiteLink";
import { monitoringIds } from "@/ui/shared/constants/monitoringIds";
import { getHelperText } from "@/ui/shared/utils/formHelpers";
import { DialogContentText } from "@mui/material";
import { FC } from "react";

export const InstallStartDialogConnectDiscordForm: FC<{
  Field: InstallStartField;
}> = ({ Field }) => {
  const utils = trpc.useUtils();

  const handleRoleValidation = async ({
    value,
    discordServerId,
  }: {
    value: string;
    discordServerId: string;
  }) => {
    if (!value) {
      return;
    }
    if (!discordServerId) {
      return "Select a discord server";
    }
    const roles = await utils.discord.getServerRoles.fetch({
      discordServerId,
    });
    if (!roles.map((r) => r.roleId).includes(value)) {
      return "Role is not on the selected server";
    }
  };

  return (
    <>
      <DialogContentText>
        Connect to Discord to enable display of member names and roles from your
        server.
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
      </DialogContentText>
      <Field name="discordServerId" key="discordServerId">
        {(field) => (
          <DiscordServerAutocomplete
            label="Discord server"
            value={field.state.value}
            onChange={(newValue) => {
              field.handleChange(newValue);
            }}
            required
            autoFocus
            fullWidth
          />
        )}
      </Field>
      <Field
        name="discordOwnerRoleId"
        key="discordOwnerRoleId"
        validators={{
          onChangeListenTo: ["discordServerId"],
          onChangeAsyncDebounceMs: 300,
          onChangeAsync: async ({ value, fieldApi }) =>
            handleRoleValidation({
              value,
              discordServerId: fieldApi.form.state.values.discordServerId,
            }),
        }}
      >
        {(field) => (
          <DiscordRolesAutocomplete
            label="Discord owner role"
            discordServerId={field.form.state.values.discordServerId}
            value={field.state.value}
            onChange={(newValue) => {
              field.handleChange(newValue);
            }}
            required
            fullWidth
            {...getHelperText({
              helperText:
                "Owners are a class of admin that have elevated privileges",
              field,
            })}
          />
        )}
      </Field>
      <Field
        name="discordHelperRoleId"
        key="discordHelperRoleId"
        validators={{
          onChangeListenTo: ["discordServerId"],
          onChangeAsyncDebounceMs: 300,
          onChangeAsync: async ({ value, fieldApi }) =>
            handleRoleValidation({
              value,
              discordServerId: fieldApi.form.state.values.discordServerId,
            }),
        }}
      >
        {(field) => (
          <DiscordRolesAutocomplete
            label="Discord helper role"
            discordServerId={field.form.state.values.discordServerId}
            value={field.state.value}
            onChange={(newValue) => {
              field.handleChange(newValue);
            }}
            required
            fullWidth
            {...getHelperText({
              helperText:
                "Helpers are a class of admin that can verify and reconcile records",
              field,
            })}
          />
        )}
      </Field>
    </>
  );
};
