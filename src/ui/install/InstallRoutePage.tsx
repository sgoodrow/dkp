import { InstallStepper } from "@/ui/install/stepper/InstallStepper";
import { GradientBox } from "@/ui/shared/components/boxes/GradientBox";
import { ParticlesBox } from "@/ui/shared/components/boxes/ParticlesBox";
import { FC } from "react";

export const InstallRoutePage: FC<{}> = ({}) => {
  return (
    <GradientBox>
      <ParticlesBox />
      <InstallStepper />
    </GradientBox>
  );
};
