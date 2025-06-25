import React, { useEffect } from "react";
import {
  Box,
  Typography,
  IconButton,
  Divider,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
  Chip,
  Tooltip,
  Button,
  useTheme,
  styled,
  Drawer as MuiDrawer,
} from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import DownloadIcon from "@mui/icons-material/Download";
import SearchIcon from "@mui/icons-material/Search";
import { Positions } from "../dtos/Positions";
import { colorTokens } from "../theme";

const drawerWidth = 300;

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})<{ open?: boolean }>(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    "& .MuiDrawer-paper": {
      width: drawerWidth,
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
      overflowX: "hidden",
      background:
        theme.palette.mode === "dark"
          ? colorTokens.primary[900]
          : colorTokens.primary[50],
      p: 2,
    },
  }),
  ...(!open && {
    "& .MuiDrawer-paper": {
      width: 56,
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      overflowX: "hidden",
      background:
        theme.palette.mode === "dark"
          ? colorTokens.primary[900]
          : colorTokens.primary[50],
      p: 0,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
  }),
}));

const ages = Array.from({ length: 100 }, (_, i) => i);
const positionOptions = Object.values(Positions);

interface FilterComponentDrawerProps {
  open: boolean;
  onClose: () => void;
  onOpen: () => void;
  filters: {
    firstName: string;
    lastName: string;
    nationality: string;
    age: string;
    positions: string[];
  };
  onFilterChange: (field: string, value: unknown) => void;
  onUploadClick: () => void;
  onSearch: () => void;
}

const FilterComponentDrawer: React.FC<FilterComponentDrawerProps> = ({
  open,
  onClose,
  onOpen,
  filters,
  onFilterChange,
  onUploadClick,
  onSearch,
}) => {
  const theme = useTheme();

  useEffect(() => {
    if (!open) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [open, onClose]);

  return (
    <Drawer variant="permanent" open={open}>
      {open ? (
        <Box sx={{ display: "flex", alignItems: "center", p: 2, pb: 0 }}>
          <Typography variant="h6" sx={{ flex: 1 }}>
            Filters
          </Typography>
          <IconButton onClick={onClose}>
            <ChevronLeftIcon />
          </IconButton>
        </Box>
      ) : (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            height: "100%",
            justifyContent: "center",
          }}
        >
          <Tooltip title="Open filters" placement="right">
            <IconButton onClick={onOpen}>
              <ChevronRightIcon />
            </IconButton>
          </Tooltip>
        </Box>
      )}
      {open && (
        <>
          <Divider sx={{ mb: 2 }} />
          <Box
            sx={{ display: "flex", flexDirection: "column", height: "100%" }}
          >
            <Grid container spacing={2} direction="column" flex={1}>
              <Grid item>
                <TextField
                  label="First Name"
                  value={filters.firstName}
                  onChange={(e) => onFilterChange("firstName", e.target.value)}
                  fullWidth
                  size="small"
                />
              </Grid>
              <Grid item>
                <TextField
                  label="Last Name"
                  value={filters.lastName}
                  onChange={(e) => onFilterChange("lastName", e.target.value)}
                  fullWidth
                  size="small"
                />
              </Grid>
              <Grid item>
                <TextField
                  label="Nationality"
                  value={filters.nationality}
                  onChange={(e) =>
                    onFilterChange("nationality", e.target.value)
                  }
                  fullWidth
                  size="small"
                />
              </Grid>
              <Grid item>
                <FormControl fullWidth size="small">
                  <InputLabel>Age</InputLabel>
                  <Select
                    label="Age"
                    value={filters.age}
                    onChange={(e) => onFilterChange("age", e.target.value)}
                  >
                    <MenuItem value="">
                      <em>Any</em>
                    </MenuItem>
                    {ages.map((age) => (
                      <MenuItem key={age} value={age}>
                        {age}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item>
                <FormControl fullWidth size="small">
                  <InputLabel>Positions</InputLabel>
                  <Select
                    multiple
                    value={filters.positions}
                    onChange={(e) =>
                      onFilterChange("positions", e.target.value as string[])
                    }
                    input={<OutlinedInput label="Positions" />}
                    renderValue={(selected) => (
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                        {(selected as string[]).map((value) => (
                          <Chip
                            key={value}
                            label={value}
                            onDelete={() =>
                              onFilterChange(
                                "positions",
                                filters.positions.filter((pos) => pos !== value)
                              )
                            }
                          />
                        ))}
                      </Box>
                    )}
                  >
                    {positionOptions.map((pos) => (
                      <MenuItem key={pos} value={pos}>
                        {pos}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item>
                <Tooltip title="Upload CSV">
                  <Button
                    variant="outlined"
                    color="primary"
                    startIcon={<DownloadIcon />}
                    onClick={onUploadClick}
                    fullWidth
                    sx={{
                      bgcolor:
                        theme.palette.mode === "dark"
                          ? colorTokens.primary[800]
                          : colorTokens.primary[100],
                      color: theme.palette.primary.contrastText,
                      "&:hover": {
                        bgcolor: colorTokens.primary[300],
                      },
                      mt: 2,
                      fontWeight: 500,
                      fontSize: 15,
                      borderRadius: 2,
                      boxShadow: "none",
                    }}
                  >
                    Upload CSV
                  </Button>
                </Tooltip>
              </Grid>
              <Grid item>
                <Tooltip title="Search">
                  <Button
                    variant="outlined"
                    color="secondary"
                    startIcon={<SearchIcon />}
                    onClick={onSearch}
                    fullWidth
                    sx={{
                      bgcolor:
                        theme.palette.mode === "dark"
                          ? colorTokens.primary[800]
                          : colorTokens.primary[100],
                      color: theme.palette.secondary.main,
                      "&:hover": {
                        bgcolor: colorTokens.primary[300],
                      },
                      mt: 1,
                      fontWeight: 500,
                      fontSize: 15,
                      borderRadius: 2,
                      boxShadow: "none",
                    }}
                  >
                    Search
                  </Button>
                </Tooltip>
              </Grid>
            </Grid>
          </Box>
        </>
      )}
    </Drawer>
  );
};

export default FilterComponentDrawer;
