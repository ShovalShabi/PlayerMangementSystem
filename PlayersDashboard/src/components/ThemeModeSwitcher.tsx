import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Box, Tooltip, IconButton } from "@mui/material";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import { State } from "../utils/interfaces/state";
import { setTheme } from "../store/theme-reducer";

const ThemeModeSwitcher: React.FC = () => {
  const mode = useSelector((state: State) => state.theme);
  const dispatch = useDispatch();

  return (
    <Box sx={{ minWidth: 56, mr: 2 }}>
      <Tooltip
        title={
          mode === "light" ? "Switch to dark mode" : "Switch to light mode"
        }
      >
        <IconButton
          color="primary"
          onClick={() =>
            dispatch(setTheme(mode === "light" ? "dark" : "light"))
          }
          aria-label="toggle theme mode"
        >
          {mode === "light" ? <LightModeIcon /> : <DarkModeIcon />}
        </IconButton>
      </Tooltip>
    </Box>
  );
};

export default ThemeModeSwitcher;
