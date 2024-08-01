import {
  Card,
  CardActionArea,
  CardContent,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import { SvgIconComponent } from "@mui/icons-material";

export const ActionCard: FCWithChildren<{
  Icon: SvgIconComponent;
  label: string;
  description: string;
  onClick: () => void;
}> = ({ Icon, label, description, onClick, children }) => {
  return (
    <Card>
      <CardActionArea onClick={() => onClick()}>
        <CardContent>
          <Stack spacing={1}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Icon />
              <Typography>{label}</Typography>
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
