import { AboutAppDialog } from "@/ui/home/dialogs/AboutAppDialog";
import { SideBarButton } from "@/ui/navigation/buttons/SidebarButton";
import { monitoringIds } from "@/ui/shared/constants/monitoringIds";
import { QuestionMark } from "@mui/icons-material";
import { FC, useState } from "react";

export const WelcomeDialogButton: FC<{
  hideButtonLabel: boolean;
  fullScreenDialog: boolean;
}> = ({ hideButtonLabel = false, fullScreenDialog = false }) => {
  const [aboutAppDialogOpen, setAboutAppDialogOpen] = useState(false);
  return (
    <>
      <SideBarButton
        dataMonitoringId={monitoringIds.TOGGLE_HELP_OPEN}
        label="Help"
        icon={<QuestionMark />}
        onClick={() => setAboutAppDialogOpen(true)}
        selected={aboutAppDialogOpen}
        hideLabel={hideButtonLabel}
      />
      <AboutAppDialog
        open={aboutAppDialogOpen}
        onClose={() => setAboutAppDialogOpen(false)}
        fullScreen={fullScreenDialog}
      />
    </>
  );
};
