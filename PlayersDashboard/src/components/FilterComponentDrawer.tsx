import React, { useEffect, useState } from "react";
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
  Tooltip,
  Drawer as MuiDrawer,
  styled,
  SelectChangeEvent,
  Collapse,
} from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import CloseIcon from "@mui/icons-material/Close";
import { Positions } from "../dtos/Positions";
import { colorTokens } from "../theme";
import listOfCountries from "../utils/objects/countries-object";

const drawerWidth = 300;

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop: string) => prop !== "open",
})<{ open?: boolean }>(({ theme, open }) => ({
  width: open ? drawerWidth : 56,
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

const positionOptions = Object.values(Positions);

interface FilterComponentDrawerProps {
  open: boolean;
  onClose: () => void;
  onOpen: () => void;
  filters: {
    name: string;
    nationality: string[];
    minAge: string;
    maxAge: string;
    minHeight: string;
    maxHeight: string;
    positions: string[];
  };
  onFilterChange: (field: string, value: unknown) => void;
}

const FilterComponentDrawer: React.FC<FilterComponentDrawerProps> = ({
  open,
  onClose,
  onOpen,
  filters,
  onFilterChange,
}) => {
  const [nationalityOpen, setNationalityOpen] = useState(false);
  const [positionsOpen, setPositionsOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [open, onClose]);

  const handleNationalityChange = (event: SelectChangeEvent<string[]>) => {
    const value = event.target.value;
    onFilterChange("nationality", value);
    // Close dropdown after selection
    setNationalityOpen(false);
  };

  const handlePositionChange = (event: SelectChangeEvent<string[]>) => {
    const value = event.target.value;
    onFilterChange("positions", value);
    // Close dropdown after selection
    setPositionsOpen(false);
  };

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
                  label="Name"
                  value={filters.name}
                  onChange={(e) => onFilterChange("name", e.target.value)}
                  fullWidth
                  size="small"
                  placeholder="Search by first or last name"
                />
              </Grid>
              <Grid item>
                <FormControl fullWidth size="small">
                  <InputLabel>Nationalities</InputLabel>
                  <Select
                    multiple
                    open={nationalityOpen}
                    onOpen={() => setNationalityOpen(true)}
                    onClose={() => setNationalityOpen(false)}
                    value={filters.nationality}
                    onChange={handleNationalityChange}
                    input={<OutlinedInput label="Nationalities" />}
                    renderValue={(selected) => (
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                        {(selected as string[]).map((value) => (
                          <Box
                            key={value}
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              backgroundColor: "primary.main",
                              color: "primary.contrastText",
                              borderRadius: 1,
                              px: 1,
                              py: 0.5,
                              fontSize: "0.75rem",
                              gap: 0.5,
                            }}
                          >
                            <Typography variant="caption">{value}</Typography>
                            <IconButton
                              size="small"
                              onMouseDown={(e) => {
                                e.stopPropagation();
                                e.preventDefault();
                                const newNationalities =
                                  filters.nationality.filter(
                                    (nat) => nat !== value
                                  );
                                onFilterChange("nationality", newNationalities);
                              }}
                              sx={{
                                color: "inherit",
                                p: 0.25,
                                "&:hover": {
                                  backgroundColor: "rgba(255,255,255,0.1)",
                                },
                              }}
                            >
                              <CloseIcon sx={{ fontSize: "0.875rem" }} />
                            </IconButton>
                          </Box>
                        ))}
                      </Box>
                    )}
                    MenuProps={{
                      PaperProps: {
                        style: {
                          maxHeight: 300,
                        },
                      },
                      TransitionComponent: Collapse,
                      transitionDuration: 200,
                    }}
                  >
                    {listOfCountries.map((country) => (
                      <MenuItem key={country.code} value={country.label}>
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <img
                            src={`https://flagcdn.com/w20/${country.code.toLowerCase()}.png`}
                            alt={`${country.label} flag`}
                            style={{
                              width: 20,
                              height: 15,
                              objectFit: "cover",
                            }}
                          />
                          <Typography>{country.label}</Typography>
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item>
                <Box sx={{ display: "flex", gap: 1 }}>
                  <TextField
                    label="Min Age"
                    type="number"
                    value={filters.minAge}
                    onChange={(e) => {
                      const value = e.target.value;
                      const maxAge = filters.maxAge;
                      if (maxAge && parseInt(value) > parseInt(maxAge)) {
                        onFilterChange("maxAge", value);
                      }
                      onFilterChange("minAge", value);
                    }}
                    fullWidth
                    size="small"
                    inputProps={{ min: 0, max: 100 }}
                  />
                  <TextField
                    label="Max Age"
                    type="number"
                    value={filters.maxAge}
                    onChange={(e) => {
                      const value = e.target.value;
                      const minAge = filters.minAge;
                      if (minAge && parseInt(value) < parseInt(minAge)) {
                        onFilterChange("minAge", value);
                      }
                      onFilterChange("maxAge", value);
                    }}
                    fullWidth
                    size="small"
                    inputProps={{ min: 0, max: 100 }}
                  />
                </Box>
              </Grid>
              <Grid item>
                <Box sx={{ display: "flex", gap: 1 }}>
                  <TextField
                    label="Min Height (m)"
                    type="number"
                    value={filters.minHeight}
                    onChange={(e) => {
                      const value = e.target.value;
                      const maxHeight = filters.maxHeight;
                      if (
                        maxHeight &&
                        parseFloat(value) > parseFloat(maxHeight)
                      ) {
                        onFilterChange("maxHeight", value);
                      }
                      onFilterChange("minHeight", value);
                    }}
                    fullWidth
                    size="small"
                    inputProps={{ min: 1.0, max: 2.5, step: 0.01 }}
                  />
                  <TextField
                    label="Max Height (m)"
                    type="number"
                    value={filters.maxHeight}
                    onChange={(e) => {
                      const value = e.target.value;
                      const minHeight = filters.minHeight;
                      if (
                        minHeight &&
                        parseFloat(value) < parseFloat(minHeight)
                      ) {
                        onFilterChange("minHeight", value);
                      }
                      onFilterChange("maxHeight", value);
                    }}
                    fullWidth
                    size="small"
                    inputProps={{ min: 1.0, max: 2.5, step: 0.01 }}
                  />
                </Box>
              </Grid>
              <Grid item>
                <FormControl fullWidth size="small">
                  <InputLabel>Positions</InputLabel>
                  <Select
                    multiple
                    open={positionsOpen}
                    onOpen={() => setPositionsOpen(true)}
                    onClose={() => setPositionsOpen(false)}
                    value={filters.positions}
                    onChange={handlePositionChange}
                    input={<OutlinedInput label="Positions" />}
                    renderValue={(selected) => (
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                        {(selected as string[]).map((value) => (
                          <Box
                            key={value}
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              backgroundColor: "primary.main",
                              color: "primary.contrastText",
                              borderRadius: 1,
                              px: 1,
                              py: 0.5,
                              fontSize: "0.75rem",
                              gap: 0.5,
                            }}
                          >
                            <Typography variant="caption">{value}</Typography>
                            <IconButton
                              size="small"
                              onMouseDown={(e) => {
                                e.stopPropagation();
                                e.preventDefault();
                                const newPositions = filters.positions.filter(
                                  (pos) => pos !== value
                                );
                                onFilterChange("positions", newPositions);
                              }}
                              sx={{
                                color: "inherit",
                                p: 0.25,
                                "&:hover": {
                                  backgroundColor: "rgba(255,255,255,0.1)",
                                },
                              }}
                            >
                              <CloseIcon sx={{ fontSize: "0.875rem" }} />
                            </IconButton>
                          </Box>
                        ))}
                      </Box>
                    )}
                    MenuProps={{
                      PaperProps: {
                        style: {
                          maxHeight: 300,
                        },
                      },
                      TransitionComponent: Collapse,
                      transitionDuration: 200,
                    }}
                  >
                    {positionOptions.map((pos) => (
                      <MenuItem key={pos} value={pos}>
                        {pos}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Box>
        </>
      )}
    </Drawer>
  );
};

export default FilterComponentDrawer;
