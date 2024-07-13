"use client";

import { monitoringIds } from "@/ui/shared/constants/monitoringIds";
import {
  CopyToClipboardIconButton,
  CopyToClipboardIconButtonProps,
} from "@/ui/shared/components/buttons/CopyToClipboardIconButton";
import { useAbsoluteUrl } from "@/ui/shared/hooks/useAbsoluteUrl";
import { FC } from "react";

export const CopyCurrentLinkToClipboardButton: FC<
  Omit<CopyToClipboardIconButtonProps, "label" | "value" | "data-monitoring-id">
> = (props) => {
  const url = useAbsoluteUrl({ withUtmSource: true });
  return (
    <CopyToClipboardIconButton
      label="Copy link to clipboard"
      value={url}
      data-monitoring-id={monitoringIds.COPY_CURRENT_LINK_TO_CLIPBOARD}
      {...props}
    />
  );
};
