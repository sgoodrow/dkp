"use client";

import { FC, useState } from "react";
import {
  Button,
  DialogActions,
  Divider,
  Step,
  StepLabel,
  Stepper,
} from "@mui/material";

export const useFormSteps = <T extends readonly string[]>({
  steps,
  handleSubmit,
  disabledSteps,
}: {
  steps: T;
  handleSubmit: () => Promise<void>;
  disabledSteps?: Record<T[number], boolean | undefined>;
}) => {
  const [active, setActive] = useState<(typeof steps)[number]>(steps[0]);

  const activeIndex = steps.indexOf(active);

  const final = active === steps[steps.length - 1];

  const handleNext = () => {
    setActive((s) => steps[steps.indexOf(s) + 1]);
  };

  const handleBack = () => {
    setActive((s) => steps[steps.indexOf(s) - 1]);
  };

  const InternalStepper = () => (
    <>
      <Stepper activeStep={activeIndex} alternativeLabel>
        {steps.map((s) => (
          <Step key={s}>
            <StepLabel>{s}</StepLabel>
          </Step>
        ))}
      </Stepper>
      <Divider />
    </>
  );

  const Actions: FCWithChildren = ({ children }) => (
    <DialogActions sx={{ justifyContent: "space-between" }}>
      <Button
        disabled={activeIndex === 0}
        onClick={handleBack}
        color="secondary"
        tabIndex={-1}
      >
        Back
      </Button>
      {children}
    </DialogActions>
  );

  const NextButton: FC<{ disabled: boolean }> = ({ disabled }) => (
    <Button
      variant={final ? "contained" : "outlined"}
      type="submit"
      color={final ? "primary" : "secondary"}
      disabled={disabled || disabledSteps?.[active]}
    >
      {final ? "Finish" : "Next"}
    </Button>
  );

  const onSubmit = () => (final ? handleSubmit() : handleNext());

  return {
    Stepper: InternalStepper,
    Actions,
    NextButton,
    active,
    onSubmit,
  };
};
