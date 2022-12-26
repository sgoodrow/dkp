import { Box, Toolbar } from "@mui/material";
import type { FC, ReactNode } from "react";
import { useState } from "react";
import { Header } from "./header";
import { Sidebar } from "./sidebar";

export const Navigation: FC<{
  children: ReactNode;
}> = ({ children }) => {
  const [sidebarIsOpen, setSidebarIsOpen] = useState(true);
  const handleToggleSidebar = () => setSidebarIsOpen((open) => !open);
  return (
    <>
      <Header onToggleSidebar={handleToggleSidebar} />
      <Sidebar isOpen={sidebarIsOpen} />
      <Box
        component="main"
        display="flex"
        flexDirection="column"
        flexGrow={1}
        bgcolor="background.default"
        p={1}
      >
        <Toolbar />
        <Box display="flex" flexDirection="column" flexGrow={1}>
          {children}
        </Box>
      </Box>
    </>
  );
};
