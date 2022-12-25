import { Button } from "@mui/material";
import { useUsername } from "~/utils";

export default () => {
  const username = useUsername();
  return (
    <>
      <Button onClick={() => console.log("button clicked")}>
        Hi {username}
      </Button>
    </>
  );
};
