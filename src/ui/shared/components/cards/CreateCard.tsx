import {
  Card,
  CardActionArea,
  CardContent,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import { Add } from "@mui/icons-material";

export const CreateCard: FCWithChildren<{
  description: string;
  onClick: () => void;
}> = ({ description, onClick, children }) => {
  return (
    <Card>
      <CardActionArea onClick={() => onClick()}>
        <CardContent>
          <Stack spacing={1}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Add />
              <Typography>Create new</Typography>
            </Stack>
            <Divider />
            <Typography variant="body2" color="text.secondary">
              {description}
            </Typography>
          </Stack>
        </CardContent>
      </CardActionArea>
      {children}
    </Card>
  );
};
