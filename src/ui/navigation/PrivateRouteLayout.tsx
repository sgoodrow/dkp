import { SidebarLayout } from "@/ui/navigation/layouts/SidebarLayout";
import { Container } from "@mui/material";

export const PrivateRouteLayout: FCWithChildren<{ isMobile: boolean }> = ({
  isMobile,
  children,
}) => {
  return (
    <SidebarLayout isMobile={isMobile}>
      <Container
        maxWidth="xl"
        sx={{
          pt: 3,
          display: "flex",
          flexGrow: 1,
        }}
      >
        {children}
      </Container>
    </SidebarLayout>
  );
};
