import { MyCharactersCard } from "@/ui/home/cards/MyCharactersCard";
import { AppTitle } from "@/ui/shared/components/static/AppTitle";
import { Box, Stack, Unstable_Grid2 } from "@mui/material";

export const HomeRoutePage = () => {
  return (
    <Stack spacing={2} alignItems="center">
      <AppTitle subtitle />
      <Unstable_Grid2 container width={1} spacing={1}>
        <Unstable_Grid2 xs={12} sm={12} md={6} lg={4} xl={4}>
          <Box>
            <MyCharactersCard />
          </Box>
        </Unstable_Grid2>
      </Unstable_Grid2>
    </Stack>
  );
};
