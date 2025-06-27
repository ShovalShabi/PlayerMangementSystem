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

interface DashboardHeaderProps {
  heightUnit: string;
  setHeightUnit: (unit: string) => void;
  dispatch: Dispatch;
}

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
