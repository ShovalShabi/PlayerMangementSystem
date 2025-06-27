import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  Divider,
  Grid,
  Tooltip,
  Drawer as MuiDrawer,
  styled,
} from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import { Positions } from "../utils/enums/Positions";
import { colorTokens } from "../theme";
import listOfCountries from "../utils/objects/countries-object";
import { Filters } from "../utils/interfaces/filters";
import useDebounce from "../hooks/useDebounce";
import NameFilter from "./filters/NameFilter";
import NationalityFilter from "./filters/NationalityFilter";
import HeightFilter from "./filters/HeightFilter";
import PositionFilter from "./filters/PositionFilter";
import AgeFilter from "./filters/AgeFilter";
import { useDispatch } from "react-redux";
import { resetFiltersStore } from "../store/filters-reducer";

const drawerWidth = 300;

/**
 * Styled permanent drawer for filter controls.
 * Expands or collapses based on the `open` prop.
 */
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

/**
 * Props for FilterComponentDrawer.
 * @property open Whether the drawer is open.
 * @property onClose Callback to close the drawer.
 * @property onOpen Callback to open the drawer.
 * @property filters Current filter values.
 * @property updateAPIRequest Function to update a filter value (triggers API call).
 * @property heightUnit Unit for height fields ("m" for meters, "ft" for feet).
 */
interface FilterComponentDrawerProps {
  open: boolean;
  onClose: () => void;
  onOpen: () => void;
  filters: Filters;
  updateAPIRequest: (field: string, value: unknown) => void;
  heightUnit: "m" | "ft";
}

/**
 * Drawer component for filtering the player list by name, nationality, age, height, and position.
 *
 * Includes debounced filter updates and unit conversion for height.
 *
 * @param props FilterComponentDrawerProps
 */
const FilterComponentDrawer: React.FC<FilterComponentDrawerProps> = ({
  open,
  onClose,
  onOpen,
  filters,
  updateAPIRequest: onFilterChange,
  heightUnit,
}) => {
  const dispatch = useDispatch();
  // Local state for each filter
  const [name, setName] = useState(filters.name);
  const [nationality, setNationality] = useState(filters.nationality);
  const [minAge, setMinAge] = useState(filters.minAge);
  const [maxAge, setMaxAge] = useState(filters.maxAge);
  const [minHeight, setMinHeight] = useState(filters.minHeight);
  const [maxHeight, setMaxHeight] = useState(filters.maxHeight);
  const [minHeightFt, setMinHeightFt] = useState("");
  const [maxHeightFt, setMaxHeightFt] = useState("");
  const [positions, setPositions] = useState(filters.positions);

  // Sync ft fields when switching units or meters change
  useEffect(() => {
    if (heightUnit === "ft") {
      setMinHeightFt(
        minHeight ? (parseFloat(minHeight) * 3.28084).toFixed(2) : ""
      );
      setMaxHeightFt(
        maxHeight ? (parseFloat(maxHeight) * 3.28084).toFixed(2) : ""
      );
    }
  }, [heightUnit, minHeight, maxHeight]);

  const handleResetFilters = () => {
    setNationality([]);
    setMinAge("");
    setMaxAge("");
    setMinHeight("");
    setMaxHeight("");
    setMinHeightFt("");
    setMaxHeightFt("");
    setName("");
    setPositions([]);
    dispatch(resetFiltersStore());
  };
  // Debounced values
  const debouncedName = useDebounce(name, 500);
  const debouncedNationality = useDebounce(nationality, 500);
  const debouncedMinAge = useDebounce(minAge, 500);
  const debouncedMaxAge = useDebounce(maxAge, 500);
  // For height, debounce the displayed value in the current unit
  const debouncedMinHeight = useDebounce(
    heightUnit === "ft" ? minHeightFt : minHeight,
    500
  );
  const debouncedMaxHeight = useDebounce(
    heightUnit === "ft" ? maxHeightFt : maxHeight,
    500
  );
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
    // Only update API with meters
    if (heightUnit === "ft") {
      const meters = debouncedMinHeight
        ? (parseFloat(debouncedMinHeight) / 3.28084).toFixed(2)
        : "";
      if (meters !== filters.minHeight) {
        onFilterChange("minHeight", meters);
      }
    } else {
      if (debouncedMinHeight !== filters.minHeight) {
        onFilterChange("minHeight", debouncedMinHeight);
      }
    }
  }, [debouncedMinHeight, filters.minHeight, onFilterChange, heightUnit]);

  useEffect(() => {
    if (heightUnit === "ft") {
      const meters = debouncedMaxHeight
        ? (parseFloat(debouncedMaxHeight) / 3.28084).toFixed(2)
        : "";
      if (meters !== filters.maxHeight) {
        onFilterChange("maxHeight", meters);
      }
    } else {
      if (debouncedMaxHeight !== filters.maxHeight) {
        onFilterChange("maxHeight", debouncedMaxHeight);
      }
    }
  }, [debouncedMaxHeight, filters.maxHeight, onFilterChange, heightUnit]);

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
                <NameFilter value={name} onChange={setName} disabled={!open} />
              </Grid>
              <Grid item>
                <NationalityFilter
                  value={nationality}
                  onChange={setNationality}
                  options={listOfCountries}
                  disabled={!open}
                />
              </Grid>
              <Grid item>
                <AgeFilter
                  min={minAge}
                  max={maxAge}
                  onMinChange={setMinAge}
                  onMaxChange={setMaxAge}
                  disabled={!open}
                />
              </Grid>
              <Grid item>
                <HeightFilter
                  min={heightUnit === "ft" ? minHeightFt : minHeight}
                  max={heightUnit === "ft" ? maxHeightFt : maxHeight}
                  onMinChange={
                    heightUnit === "ft" ? setMinHeightFt : setMinHeight
                  }
                  onMaxChange={
                    heightUnit === "ft" ? setMaxHeightFt : setMaxHeight
                  }
                  unit={heightUnit}
                  disabled={!open}
                />
              </Grid>
              <Grid item>
                <PositionFilter
                  value={positions}
                  onChange={setPositions}
                  options={positionOptions}
                  disabled={!open}
                />
              </Grid>
              <Grid item>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    mt: 1,
                  }}
                >
                  <Tooltip title="Reset all filters">
                    <IconButton
                      color="primary"
                      onClick={handleResetFilters}
                      size="large"
                      sx={{ mt: 0 }}
                    >
                      <RestartAltIcon fontSize="inherit" />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </>
      )}
    </Drawer>
  );
};

export default FilterComponentDrawer;
