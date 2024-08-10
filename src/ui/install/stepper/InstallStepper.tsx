"use client";

import { trpc } from "@/api/views/trpc/trpc";
import { InstallAttemptPane } from "@/ui/install/panes/InstallAttemptPane";
import { InstallFormPane } from "@/ui/install/panes/InstallFormPane";
import { ContainerCardLayout } from "@/ui/shared/components/layouts/ContainerCardLayout";
import {
  Button,
  Divider,
  Stack,
  Step,
  StepLabel,
  Stepper,
  Typography,
} from "@mui/material";
import { InstallAttempt } from "@prisma/client";
import { useForm } from "@tanstack/react-form";
import { FC, useState } from "react";

const STEPS = ["Verify Identity", "Setup Guild", "Connect Discord"] as const;

export type InstallStep = (typeof STEPS)[number];

export const InstallStepper: FC<{}> = ({}) => {
  const [active, setActive] = useState<InstallStep>(STEPS[0]);
  const [installAttempt, setInstallAttempt] = useState<InstallAttempt | null>(
    null,
  );

  const { mutate: install, isPending: isInstalling } =
    trpc.install.start.useMutation({
      onSuccess: (data) => {
        setInstallAttempt(data);
      },
    });

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
      install({
        activationKey: value.activationKey,
        name: value.name,
        rulesLink: value.rulesLink,
        discordServerId: value.discordServerId,
        discordOwnerRoleId: value.discordOwnerRoleId,
        discordAdminRoleId: value.discordAdminRoleId,
      });
    },
  });

  const activeIndex = STEPS.indexOf(active);

  const final = active === STEPS[STEPS.length - 1];

  const handleNext = () => {
    setActive((s) => STEPS[STEPS.indexOf(s) + 1]);
  };

  const handleBack = () => {
    setActive((s) => STEPS[STEPS.indexOf(s) - 1]);
  };

  return isInstalling || installAttempt ? (
    <InstallAttemptPane
      {...installAttempt}
      onTryAgain={() => setInstallAttempt(null)}
    />
  ) : (
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
        <InstallFormPane active={active} Field={Field} />
        {activeIndex < STEPS.length && (
          <Stack direction="row" justifyContent="space-between">
            <Button
              disabled={activeIndex === 0}
              onClick={handleBack}
              color="secondary"
              tabIndex={-1}
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
  );
};
