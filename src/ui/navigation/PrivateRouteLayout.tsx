import { SidebarPane } from "@/ui/navigation/panes/SidebarPane";
import { Container } from "@mui/material";
import { headers } from "next/headers";

export const PrivateRouteLayout: FCWithChildren<{}> = ({ children }) => {
  const headersList = headers();
  const userAgent = headersList.get("user-agent") || "";
  const isMobile = /mobile/i.test(userAgent);
  return (
    <SidebarPane isMobile={isMobile}>
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
