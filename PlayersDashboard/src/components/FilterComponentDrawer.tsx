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
import { Filters } from "../utils/interfaces/filters";
import useDebounce from "../hooks/useDebounce";

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
  filters: Filters;
  updateAPIRequest: (field: string, value: unknown) => void;
}

const FilterComponentDrawer: React.FC<FilterComponentDrawerProps> = ({
  open,
  onClose,
  onOpen,
  filters,
  updateAPIRequest: onFilterChange,
}) => {
  const [nationalityOpen, setNationalityOpen] = useState(false);
  const [positionsOpen, setPositionsOpen] = useState(false);

  // Local state for each filter
  const [name, setName] = useState(filters.name);
  const [nationality, setNationality] = useState(filters.nationality);
  const [minAge, setMinAge] = useState(filters.minAge);
  const [maxAge, setMaxAge] = useState(filters.maxAge);
  const [minHeight, setMinHeight] = useState(filters.minHeight);
  const [maxHeight, setMaxHeight] = useState(filters.maxHeight);
  const [positions, setPositions] = useState(filters.positions);

  // Debounced values
  const debouncedName = useDebounce(name, 500);
  const debouncedNationality = useDebounce(nationality, 500);
  const debouncedMinAge = useDebounce(minAge, 500);
  const debouncedMaxAge = useDebounce(maxAge, 500);
  const debouncedMinHeight = useDebounce(minHeight, 500);
  const debouncedMaxHeight = useDebounce(maxHeight, 500);
  const debouncedPositions = useDebounce(positions, 500);

  // Effects to update API after debounce
  useEffect(() => {
    if (debouncedName !== filters.name) {
      onFilterChange("name", debouncedName);
    }
  }, [debouncedName, filters.name, onFilterChange]);

  useEffect(() => {
    if (debouncedNationality !== filters.nationality) {
      onFilterChange("nationality", debouncedNationality);
    }
  }, [debouncedNationality, filters.nationality, onFilterChange]);

  useEffect(() => {
    if (debouncedMinAge !== filters.minAge) {
      onFilterChange("minAge", debouncedMinAge);
    }
  }, [debouncedMinAge, filters.minAge, onFilterChange]);

  useEffect(() => {
    if (debouncedMaxAge !== filters.maxAge) {
      onFilterChange("maxAge", debouncedMaxAge);
    }
  }, [debouncedMaxAge, filters.maxAge, onFilterChange]);

  useEffect(() => {
    if (debouncedMinHeight !== filters.minHeight) {
      onFilterChange("minHeight", debouncedMinHeight);
    }
  }, [debouncedMinHeight, filters.minHeight, onFilterChange]);

  useEffect(() => {
    if (debouncedMaxHeight !== filters.maxHeight) {
      onFilterChange("maxHeight", debouncedMaxHeight);
    }
  }, [debouncedMaxHeight, filters.maxHeight, onFilterChange]);

  useEffect(() => {
    if (debouncedPositions !== filters.positions) {
      onFilterChange("positions", debouncedPositions);
    }
  }, [debouncedPositions, filters.positions, onFilterChange]);

  useEffect(() => {
    if (!open) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [open, onClose]);

  const handleNationalityChange = (event: SelectChangeEvent<string[]>) => {
    const value = event.target.value as string[];
    setNationality(value);
    setNationalityOpen(false);
  };

  const handlePositionChange = (event: SelectChangeEvent<string[]>) => {
    const value = event.target.value as string[];
    setPositions(value);
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
                  value={name}
                  onChange={(e) => setName(e.target.value)}
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
                    value={nationality}
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
                                const newNationalities = nationality.filter(
                                  (nat) => nat !== value
                                );
                                setNationality(newNationalities);
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
                    value={minAge}
                    onChange={(e) => setMinAge(e.target.value)}
                    fullWidth
                    size="small"
                    inputProps={{ min: 0, max: 100 }}
                  />
                  <TextField
                    label="Max Age"
                    type="number"
                    value={maxAge}
                    onChange={(e) => setMaxAge(e.target.value)}
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
                    value={minHeight}
                    onChange={(e) => setMinHeight(e.target.value)}
                    fullWidth
                    size="small"
                    inputProps={{ min: 1.0, max: 2.5, step: 0.01 }}
                  />
                  <TextField
                    label="Max Height (m)"
                    type="number"
                    value={maxHeight}
                    onChange={(e) => setMaxHeight(e.target.value)}
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
                    value={positions}
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
                                const newPositions = positions.filter(
                                  (pos) => pos !== value
                                );
                                setPositions(newPositions);
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
