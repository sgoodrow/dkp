import { Box, BoxProps, List, ListItem } from "@mui/material";
import { FC, ReactNode } from "react";

export const BulletList: FC<{
  items: ReactNode[];
  maxHeight?: BoxProps["maxHeight"];
}> = ({ items, maxHeight }) => {
  return (
    <Box maxHeight={maxHeight} overflow="auto">
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
