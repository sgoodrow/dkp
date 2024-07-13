import { OpenAiSettingsPane } from "@/ui/settings/panes/OpenAiSettingsPane";
import { ThemePane } from "@/ui/settings/panes/ThemePane";
import { Container, Stack } from "@mui/material";

export const SettingsRoutePage = () => {
  return (
    <Stack spacing={2} alignItems="center">
      <Container maxWidth="sm">
        <Stack spacing={3}>
          <OpenAiSettingsPane />
          <ThemePane />
        </Stack>
      </Container>
    </Stack>
  );
};
