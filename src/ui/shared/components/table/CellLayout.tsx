import { Box } from "@mui/material";

export const CellLayout: FCWithChildren<{}> = ({ children }) => (
  <Box height="100%" alignContent="center">
    {children}
  </Box>
);

export const CellEditorLayout: FCWithChildren<{}> = ({ children }) => (
  <Box height="100%" alignContent="center" ml={2}>
    {children}
  </Box>
);
