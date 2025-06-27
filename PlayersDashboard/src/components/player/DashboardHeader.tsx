import React from "react";
import {
  Box,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
// import ThemeModeSwitcher from "../ThemeModeSwitcher"; // No longer needed here
import { Dispatch } from "@reduxjs/toolkit";
import { setMeasurement } from "../../store/measurement-reducer";

/**
 * Props for DashboardHeader component.
 * @property heightUnit The current height unit ("m" or "ft").
 * @property setHeightUnit Callback to change the height unit.
 * @property dispatch Redux dispatch function for updating measurement state.
 */
interface DashboardHeaderProps {
  heightUnit: string;
  setHeightUnit: (unit: string) => void;
  dispatch: Dispatch;
}

/**
 * Header section for the dashboard, allowing users to toggle between height units (meters/feet).
 *
 * @param props DashboardHeaderProps
 */
const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  heightUnit,
  setHeightUnit,
  dispatch,
}) => (
  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
    <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
      Height in:
    </Typography>
    <ToggleButtonGroup
      value={heightUnit}
      exclusive
      onChange={(_e, val) => {
        if (val) {
          setHeightUnit(val);
          dispatch(setMeasurement(val === "m" ? "M" : "FT"));
        }
      }}
      size="small"
      aria-label="height unit toggle"
    >
      <ToggleButton value="m" aria-label="meters">
        m
      </ToggleButton>
      <ToggleButton value="ft" aria-label="feet">
        ft
      </ToggleButton>
    </ToggleButtonGroup>
  </Box>
);

export default DashboardHeader;
