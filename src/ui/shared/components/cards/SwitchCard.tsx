import { FC } from "react";
import {
  Card,
  CardActionArea,
  CardContent,
  Divider,
  Stack,
  Switch,
  Typography,
} from "@mui/material";

export const SwitchCard: FC<{
  label: string;
  description: string;
  checked: boolean;
  onClick: (newValue: boolean) => void;
}> = ({ label, description, checked, onClick }) => {
  return (
    <Card>
      <CardActionArea onClick={() => onClick(!checked)}>
        <CardContent>
          <Stack spacing={1}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Switch checked={checked} size="small" />
              <Typography>{label}</Typography>
            </Stack>
            <Divider />
            <Typography variant="body2" color="text.secondary">
              {description}
            </Typography>
          </Stack>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};
