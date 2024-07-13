import { SidebarPane } from "@/ui/navigation/panes/SidebarPane";
import { Container } from "@mui/material";

export const PrivateRouteLayout: FCWithChildren<{}> = ({ children }) => {
  return (
    <SidebarPane>
      <Container
        maxWidth="xl"
        sx={{
          pt: 3,
        }}
      >
        {children}
      </Container>
    </SidebarPane>
  );
};
