import { AboutAppDialog } from "@/ui/home/dialogs/AboutAppDialog";
import { QuestionMark } from "@mui/icons-material";
import { Box, IconButton, Tooltip } from "@mui/material";
import { FC, useState } from "react";

export const WelcomeDialogIconButton: FC<{}> = ({}) => {
  const [aboutAppDialogOpen, setAboutAppDialogOpen] = useState(false);
  return (
    <>
      <Tooltip title="Show help dialog." placement="right">
        <Box display="flex" justifyContent="center">
          <IconButton onClick={() => setAboutAppDialogOpen(true)}>
            <QuestionMark />
          </IconButton>
        </Box>
      </Tooltip>
      <AboutAppDialog
        open={aboutAppDialogOpen}
        onClose={() => setAboutAppDialogOpen(false)}
      />
    </>
  );
};
