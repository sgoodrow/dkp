import { AdobePdfDocumentIcon } from "@/ui/shared/components/icons/AdobePdfDocumentIcon";
import { ConfluenceIcon } from "@/ui/shared/components/icons/ConfluenceIcon";
import { GoogleDriveDocumentsIcon } from "@/ui/shared/components/icons/GoogleDriveDocumentsIcon";
import { GoogleDriveIcon } from "@/ui/shared/components/icons/GoogleDriveIcon";
import { GoogleDriveSlidesIcon } from "@/ui/shared/components/icons/GoogleDriveSlidesIcon";
import { GoogleDriveSpreadsheetIcon } from "@/ui/shared/components/icons/GoogleDriveSpreadsheetIcon";
import { SlackIcon } from "@/ui/shared/components/icons/SlackIcon";
import { Help, OpenInNew } from "@mui/icons-material";
import { SvgIconProps } from "@mui/material";
import { FC } from "react";

export const DataSourceIcon: FC<
  {
    datasource: string | null;
    documentType?: string | null;
    hovered?: boolean;
  } & SvgIconProps
> = ({ hovered, datasource, documentType, ...iconProps }) => {
  const SvgIcon = hovered
    ? OpenInNew
    : datasource === "gdrive"
      ? getGoogleDriveIcon(documentType)
      : datasource === "confluence"
        ? getConfluenceIcon(documentType)
        : datasource === "slackentgrid"
          ? getSlackIcon(documentType)
          : Help;
  return <SvgIcon {...iconProps} />;
};

const getGoogleDriveIcon = (documentType?: string | null) => {
  switch (documentType) {
    case "Spreadsheet":
      return GoogleDriveSpreadsheetIcon;
    case "Document":
      return GoogleDriveDocumentsIcon;
    case "Presentation":
      return GoogleDriveSlidesIcon;
    case "pdf":
      return AdobePdfDocumentIcon;
    case "Folder":
    default:
      return GoogleDriveIcon;
  }
};

const getConfluenceIcon = (documentType?: string | null) => {
  switch (documentType) {
    case "page":
    case "blogpost":
    default:
      return ConfluenceIcon;
  }
};

const getSlackIcon = (documentType?: string | null) => {
  switch (documentType) {
    case "Conversation":
      return SlackIcon;
    case "Presentation":
      return GoogleDriveSlidesIcon;
    case "Document":
      return GoogleDriveDocumentsIcon;
    case "pdf":
      return AdobePdfDocumentIcon;
    case "Text":
    default:
      return SlackIcon;
  }
};
