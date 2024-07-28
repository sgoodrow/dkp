import { Refresh } from "@mui/icons-material";
import {
  Alert,
  AlertTitle,
  Box,
  Button,
  Tooltip,
  Typography,
} from "@mui/material";
import { useId } from "react";
import { useQueryErrorResetBoundary } from "@tanstack/react-query";
import { MaintainerLink } from "@/ui/shared/components/links/MaintainerLink";

export const ErrorPane: React.FC<{
  error?: Error;
  onReset: () => void;
}> = ({ error, onReset }) => {
  const queryReset = useQueryErrorResetBoundary();
  const alertTitleId = useId();

  const handleReset = () => {
    queryReset.reset();
    onReset();
  };

  console.error(error);

  return (
    <Alert
      severity="error"
      action={
        <Tooltip title="Click to reload.">
          <Button
            color="error"
            variant="text"
            endIcon={<Refresh />}
            onClick={handleReset}
          >
            Reload
          </Button>
        </Tooltip>
      }
    >
      <AlertTitle id={alertTitleId}>
        <Typography variant="h5">An error occurred</Typography>
      </AlertTitle>
      <Box role="region" aria-labelledby={alertTitleId}>
        <Typography>
          You can press reload to try again. If the issue persists, please
          contact me at <MaintainerLink />.
        </Typography>
      </Box>
    </Alert>
  );
};
