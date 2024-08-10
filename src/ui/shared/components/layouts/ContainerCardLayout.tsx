import { Box, Container, ContainerProps, Paper, Stack } from "@mui/material";

export const ContainerCardLayout: FCWithChildren<{
  maxWidth: ContainerProps["maxWidth"];
}> = ({ maxWidth, children }) => {
  return (
    <Box alignItems="center" display="flex" flexGrow={1}>
      <Container
        component={Paper}
        elevation={3}
        sx={{ zIndex: 1 }}
        maxWidth={maxWidth}
      >
        <Stack p={3} spacing={3}>
          {children}
        </Stack>
      </Container>
    </Box>
  );
};
