import { uiRoutes } from "@/app/uiRoutes";
import { LinkButton } from "@/ui/shared/components/buttons/LinkButton";
import { Container, Stack } from "@mui/material";

export const AdminRoutePage = () => {
  return (
    <Stack spacing={2} alignItems="center">
      <Container maxWidth="sm">
        <Stack spacing={3}>
          <LinkButton
            href={uiRoutes.apiKeys.href()}
            data-monitoring-id={uiRoutes.apiKeys.dataMonitoringId}
            label={uiRoutes.apiKeys.name}
          />
        </Stack>
      </Container>
    </Stack>
  );
};
