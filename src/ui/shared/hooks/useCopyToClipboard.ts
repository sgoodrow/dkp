import { enqueueSnackbar } from "notistack";
import { useCopyToClipboard as useCopyToClipboardTs } from "usehooks-ts";

export const useCopyToClipboard = () => {
  const [, copyTs] = useCopyToClipboardTs();
  return (value?: string) => {
    if (!value) {
      return;
    }
    copyTs(value);
    enqueueSnackbar("Copied to clipboard", {
      variant: "success",
    });
  };
};
