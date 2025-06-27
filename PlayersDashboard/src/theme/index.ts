// Color Tokens and Theme Settings for MUI

/**
 * Interface representing color tokens for the theme.
 * Defines the structure of color values used throughout the application.
 */
interface ColorTokens {
  grey: {
    [key: number]: string;
  };
  primary: {
    [key: number]: string;
  };
  secondary: {
    [key: number]: string;
  };
}

/**
 * Color tokens that define a consistent color palette for the application.
 * These color codes are used in both light and dark themes with numbered shades.
 */
export const colorTokens: ColorTokens = {
  grey: {
    0: "#FFFFFF",
    10: "#F7F9FA", // Softer light grey
    50: "#F0F4F8", // Muted light grey
    100: "#E3E8EE", // Gentle grey
    200: "#CBD5E1", // Muted blue-grey
    300: "#94A3B8", // Muted blue-grey
    400: "#64748B", // Muted blue-grey
    500: "#475569", // Muted blue-grey
    600: "#334155", // Muted blue-grey
    700: "#1E293B", // Muted blue-grey
    800: "#0F172A", // Muted blue-grey
    900: "#0A0F1A", // Near-black
    1000: "#000000",
  },
  primary: {
    50: "#F1F8F5", // Softest green
    100: "#D1E7DD", // Muted green
    200: "#A7D7C5", // Gentle green
    300: "#7BC9B0", // Soft teal-green
    400: "#4FB49A", // Muted teal
    500: "#379683", // Main muted green
    600: "#287566", // Deeper muted green
    700: "#20594C", // Even deeper
    800: "#183D32", // Deepest
    900: "#10241A", // Near-black green
  },
  secondary: {
    50: "#F0F7FA", // Softest blue
    100: "#D0E7F5", // Muted blue
    200: "#A4C8E1", // Gentle blue
    300: "#7BAEDC", // Soft blue
    400: "#4F94C7", // Muted blue
    500: "#357ABD", // Main muted blue
    600: "#285C8F", // Deeper blue
    700: "#20476B", // Even deeper
    800: "#18324A", // Deepest
    900: "#101C29", // Near-black blue
  },
};

/**
 * Interface representing the complete theme settings structure.
 * Used to configure Material-UI theme with palette, typography, and component overrides.
 */
export interface ThemeSettings {
  palette: {
    mode: string; // Light or dark mode
    primary: {
      dark: string; // Dark shade of the primary color
      main: string; // Main shade of the primary color
      light: string; // Light shade of the primary color
    };
    neutral: {
      dark: string; // Dark shade of the neutral color
      main: string; // Main shade of the neutral color
      mediumMain: string; // Medium shade of the neutral color
      medium: string; // Another medium shade of the neutral color
      light: string; // Light shade of the neutral color
    };
    background: {
      default: string; // Default background color
      alt: string; // Alternative background color
    };
    secondary: {
      main: string;
      light: string;
      dark: string;
      contrastText: string;
    };
    action: {
      hover: string;
      selected: string;
      focus: string;
      active: string;
      disabled: string;
      disabledBackground: string;
    };
  };
  typography: {
    fontFamily: string; // Font family for the application
    fontSize: number; // Base font size
    h1: {
      fontFamily: string; // Font family for header 1
      fontSize: number; // Font size for header 1
    };
    h2: {
      fontFamily: string; // Font family for header 2
      fontSize: number; // Font size for header 2
    };
    h3: {
      fontFamily: string; // Font family for header 3
      fontSize: number; // Font size for header 3
    };
    h4: {
      fontFamily: string; // Font family for header 4
      fontSize: number; // Font size for header 4
    };
    h5: {
      fontFamily: string; // Font family for header 5
      fontSize: number; // Font size for header 5
    };
    h6: {
      fontFamily: string; // Font family for header 6
      fontSize: number; // Font size for header 6
    };
  };
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: number;
          textTransform: string;
          fontWeight: number;
          transition: string;
          boxShadow: string;
          backgroundColor: string;
          color: string;
          "&:hover": {
            backgroundColor: string;
            color: string;
          };
          "&:active": {
            backgroundColor: string;
            color: string;
          };
        };
        containedSecondary: {
          backgroundColor: string;
          color: string;
          "&:hover": {
            backgroundColor: string;
            color: string;
          };
          "&:active": {
            backgroundColor: string;
            color: string;
          };
        };
      };
    };
    MuiChip: {
      styleOverrides: {
        root: {
          background: string;
          color: string;
          fontWeight: number;
        };
      };
    };
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: number;
          boxShadow: string;
        };
      };
    };
    MuiDataGrid: {
      styleOverrides: {
        root: {
          borderRadius: number;
          border: string;
          background: string;
        };
        columnHeaders: {
          background: string;
          color: string;
          fontWeight: number;
          fontSize: number;
        };
        row: {
          "&:hover": {
            background: string;
          };
          transition: string;
        };
      };
    };
  };
}

/**
 * Generates complete theme settings based on the specified mode.
 *
 * Creates a comprehensive Material-UI theme configuration with:
 * - Dynamic color palette for light/dark modes
 * - Typography settings with Rubik font family
 * - Component style overrides for consistent UI
 *
 * @param mode The theme mode ('light' or 'dark').
 * @returns Complete theme configuration object for Material-UI.
 */
export const themeSettings = (mode: string): object => {
  return {
    palette: {
      mode: mode,
      ...(mode === "dark"
        ? {
            primary: {
              dark: colorTokens.primary[200],
              main: colorTokens.primary[500],
              light: colorTokens.primary[800],
              contrastText: colorTokens.grey[0],
            },
            secondary: {
              dark: colorTokens.secondary[200],
              main: colorTokens.secondary[500],
              light: colorTokens.secondary[800],
              contrastText: colorTokens.grey[0],
            },
            neutral: {
              dark: colorTokens.grey[100],
              main: colorTokens.grey[200],
              mediumMain: colorTokens.grey[300],
              medium: colorTokens.grey[400],
              light: colorTokens.grey[700],
            },
            background: {
              default: colorTokens.grey[900],
              alt: colorTokens.grey[800],
            },
            action: {
              hover: colorTokens.primary[100],
              selected: colorTokens.primary[200],
              focus: colorTokens.primary[300],
              active: colorTokens.primary[500],
              disabled: colorTokens.grey[700],
              disabledBackground: colorTokens.grey[800],
            },
          }
        : {
            primary: {
              dark: colorTokens.primary[700],
              main: colorTokens.primary[500],
              light: colorTokens.primary[50],
              contrastText: colorTokens.grey[1000],
            },
            secondary: {
              dark: colorTokens.secondary[700],
              main: colorTokens.secondary[500],
              light: colorTokens.secondary[50],
              contrastText: colorTokens.grey[1000],
            },
            neutral: {
              dark: colorTokens.grey[700],
              main: colorTokens.grey[500],
              mediumMain: colorTokens.grey[400],
              medium: colorTokens.grey[300],
              light: colorTokens.grey[50],
            },
            background: {
              default: colorTokens.grey[10],
              alt: colorTokens.grey[0],
            },
            action: {
              hover: colorTokens.primary[100],
              selected: colorTokens.primary[200],
              focus: colorTokens.primary[300],
              active: colorTokens.primary[500],
              disabled: colorTokens.grey[200],
              disabledBackground: colorTokens.grey[100],
            },
          }),
    },
    typography: {
      fontFamily: ["Rubik", "sans-serif"].join(","),
      fontSize: 12,
      h1: {
        fontFamily: ["Rubik", "sans-serif"].join(","),
        fontSize: 40,
      },
      h2: {
        fontFamily: ["Rubik", "sans-serif"].join(","),
        fontSize: 32,
      },
      h3: {
        fontFamily: ["Rubik", "sans-serif"].join(","),
        fontSize: 24,
      },
      h4: {
        fontFamily: ["Rubik", "sans-serif"].join(","),
        fontSize: 20,
      },
      h5: {
        fontFamily: ["Rubik", "sans-serif"].join(","),
        fontSize: 16,
      },
      h6: {
        fontFamily: ["Rubik", "sans-serif"].join(","),
        fontSize: 14,
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            textTransform: "none",
            fontWeight: 600,
            transition: "background 0.2s, color 0.2s",
            boxShadow: "0 2px 8px 0 #1E7C3222",
            backgroundColor:
              mode === "dark"
                ? colorTokens.primary[700]
                : colorTokens.primary[500],
            color: mode === "dark" ? "#fff" : colorTokens.grey[0],
            "&:hover": {
              backgroundColor: mode === "dark" ? "#FFD600" : "#2DA94F", // yellow on dark, vibrant green on light
              color: mode === "dark" ? colorTokens.grey[900] : "#fff",
            },
            "&:active": {
              backgroundColor: mode === "dark" ? "#FFC400" : "#176327", // deeper yellow or darker green
              color: mode === "dark" ? colorTokens.grey[900] : "#fff",
            },
          },
          containedSecondary: {
            backgroundColor: "#FFD600",
            color: colorTokens.grey[900],
            "&:hover": {
              backgroundColor: "#FFC400",
              color: colorTokens.grey[0],
            },
            "&:active": {
              backgroundColor: "#FFB300",
              color: colorTokens.grey[0],
            },
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            background: mode === "dark" ? "#00D5FA22" : "#E6FBFF",
            color: mode === "dark" ? "#fff" : "#006B7D",
            fontWeight: 500,
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            boxShadow:
              mode === "dark" ? "0 2px 12px #00D5FA33" : "0 2px 12px #00A0BC22",
          },
        },
      },
      MuiDataGrid: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            border: "none",
            background:
              mode === "dark" ? colorTokens.grey[800] : colorTokens.grey[0],
          },
          columnHeaders: {
            background:
              mode === "dark"
                ? colorTokens.primary[800]
                : colorTokens.primary[50],
            color: mode === "dark" ? "#fff" : colorTokens.primary[700],
            fontWeight: 700,
            fontSize: 16,
          },
          row: {
            "&:hover": {
              background: mode === "dark" ? "#00D5FA11" : "#00D5FA11",
            },
            transition: "background 0.2s",
          },
        },
      },
    },
  };
};
