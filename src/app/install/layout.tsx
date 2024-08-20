import { ActivationKeyContextProvider } from "@/ui/shared/contexts/ActivationKeyContext";
import { GradientBox } from "@/ui/shared/components/boxes/GradientBox";
import { ParticlesBox } from "@/ui/shared/components/boxes/ParticlesBox";

export default async function Layout({ children }: React.PropsWithChildren) {
  return (
    <GradientBox>
      <ParticlesBox />
      <ActivationKeyContextProvider>{children}</ActivationKeyContextProvider>
    </GradientBox>
  );
}
