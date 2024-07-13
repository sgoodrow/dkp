import { green, grey, lightBlue } from "@mui/material/colors";
import { experimental_extendTheme, listItemButtonClasses } from "@mui/material";
import NextLink, { LinkProps as NextLinkProps } from "next/link";
import { forwardRef } from "react";
import { font } from "@/ui/theme/font";
import { ArrowDownward } from "@mui/icons-material";

// Connect MUI to the NextJS router so that state is not lost when
// navigating between route segments.
//
// Note: This should be as simple as passing NextLink component directly
// into the default props for MUI's Button and Link, but there seems to be
// a bug causing an infinite loop.
//
// https://stackoverflow.com/questions/66226576/using-the-material-ui-link-component-with-the-next-js-link-component
const LinkBehavior = forwardRef<HTMLAnchorElement | null, NextLinkProps>(
  function LinkBehaviour(props, ref) {
    return <NextLink ref={ref} {...props} />;
  },
);

export const theme = experimental_extendTheme({
  typography: {
    fontFamily: font.style.fontFamily,
    h1: {
      fontSize: "2rem",
      fontWeight: 600,
      lineHeight: 1.2,
    },
    h2: {
      fontSize: "1.6rem",
      fontWeight: 600,
      lineHeight: 1.2,
    },
    h3: {
      fontSize: "1.4rem",
      fontWeight: 600,
      lineHeight: 1.2,
    },
    h4: {
      fontSize: "1.2rem",
      fontWeight: 600,
      lineHeight: 1.2,
    },
    h5: {
      fontSize: "1rem",
      fontWeight: 600,
      lineHeight: 1.2,
    },
    h6: {
      fontSize: "0.8rem",
      fontWeight: 600,
      lineHeight: 1.2,
    },
    subtitle1: {
      fontSize: "1.2rem",
      fontWeight: 300,
      lineHeight: 1.2,
    },
    subtitle2: {
      fontSize: "1rem",
      fontWeight: 300,
      lineHeight: 1.2,
    },
    body1: {
      fontSize: "1rem",
      fontWeight: 400,
      lineHeight: 1.2,
    },
    body2: {
      fontSize: "0.875rem",
      fontWeight: 400,
      lineHeight: 1.2,
    },
    button: {
      fontSize: "0.875rem",
      fontWeight: 500,
      lineHeight: 1.75,
      textTransform: "uppercase",
    },
    caption: {
      fontSize: "0.75rem",
      fontWeight: 300,
      lineHeight: 1.2,
    },
    overline: {
      fontSize: "0.75rem",
      fontWeight: 500,
      lineHeight: 2.66,
      textTransform: "uppercase",
    },
  },
  components: {
    MuiAccordion: {
      defaultProps: {
        disableGutters: true,
      },
      styleOverrides: {
        root: ({ theme }) => ({
          border: `1px solid ${theme.palette.divider}`,
          "&:not(:last-child)": {
            borderBottom: 0,
          },
          "&::before": {
            display: "none",
          },
        }),
      },
    },
    MuiAccordionSummary: {
      defaultProps: {
        expandIcon: <ArrowDownward />,
      },
      styleOverrides: {
        root: ({ theme }) => ({
          backgroundColor: `rgba(${theme.vars.palette.action.activeChannel}/${theme.vars.palette.action.hoverOpacity})`,
          "&:hover": {
            backgroundColor: `rgba(${theme.vars.palette.action.activeChannel}/${theme.vars.palette.action.focusOpacity})`,
          },
        }),
      },
    },
    MuiAccordionDetails: {
      styleOverrides: {
        root: ({ theme }) => ({
          padding: theme.spacing(2),
        }),
      },
    },
    MuiButton: {
      defaultProps: {
        variant: "outlined",
      },
    },
    MuiToggleButton: {
      defaultProps: {
        size: "small",
      },
    },
    MuiIconButton: {
      defaultProps: {
        size: "small",
      },
    },
    MuiTextField: {
      defaultProps: {
        size: "small",
        InputLabelProps: { shrink: true },
      },
    },
    MuiTooltip: {
      defaultProps: {
        arrow: true,
      },
    },
    MuiSkeleton: {
      defaultProps: {
        role: "progressbar",
      },
    },
    MuiList: {
      defaultProps: {
        dense: true,
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        // It's difficult to tell when a list item is selected, so we add a background
        //  color to make it more scannable.
        root: ({ theme }) => ({
          [listItemButtonClasses.selected]: {
            backgroundColor: `rgba(${theme.vars.palette.secondary.mainChannel}/${theme.vars.palette.action.selectedOpacity})`,
          },
          [`${listItemButtonClasses.selected}:hover`]: {
            backgroundColor: `rgba(${theme.vars.palette.secondary.mainChannel}/${theme.vars.palette.action.focusOpacity})`,
          },
        }),
      },
    },
    MuiLink: {
      defaultProps: {
        component: LinkBehavior,
        underline: "hover",
      },
    },
    MuiButtonBase: {
      defaultProps: {
        LinkComponent: LinkBehavior,
      },
    },
    MuiChip: {
      defaultProps: {
        size: "small",
      },
    },
    MuiDialog: {
      defaultProps: {
        disableScrollLock: true,
      },
    },
    MuiDialogContentText: {
      defaultProps: {
        component: "div",
      },
    },
    MuiTab: {
      styleOverrides: {
        // 1. It's difficult to tell the difference between a disabled tab and a normal tab,
        //    so we add a grey background to disabled tabs.
        // 2. It's difficult to tell if you're hovering a tab, so we add a feint primary
        //    background when hovering.
        // 3. The tabs don't typically have a background color, so they have no visible border;
        //    we give them rounded top corners and horizontal margin to evoke the tab aesthetic.
        root: ({ theme, ownerState }) => {
          const disabled = ownerState.disabled;
          return {
            borderTopLeftRadius: theme.shape.borderRadius,
            borderTopRightRadius: theme.shape.borderRadius,
            marginLeft: 1,
            marginRight: 1,
            backgroundColor: disabled
              ? theme.vars.palette.action.disabledBackground
              : undefined,
            ":hover": {
              backgroundColor: !disabled
                ? `rgba(${theme.vars.palette.primary.mainChannel}/${theme.vars.palette.action.hoverOpacity})`
                : undefined,
            },
          };
        },
      },
    },
  },
  colorSchemes: {
    light: {
      palette: {
        background: {
          default: grey[50],
        },
      },
    },
    dark: {
      palette: {
        primary: {
          main: green.A400,
        },
        secondary: {
          main: lightBlue.A200,
        },
        contrastThreshold: 3,
        background: {
          default: "#101010",
        },
      },
    },
  },
});
