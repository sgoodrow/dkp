import { Box, List, ListItem } from "@mui/material";
import { FC, ReactNode } from "react";

export const BulletList: FC<{ items: ReactNode[] }> = ({ items }) => {
  return (
    <Box>
      <List sx={{ listStyleType: "disc", padding: "revert" }}>
        {items.map((i, index) => (
          <ListItem
            key={index}
            sx={{ display: "list-item" }}
            disableGutters
            disablePadding
          >
            {i}
          </ListItem>
        ))}
      </List>
    </Box>
  );
};
