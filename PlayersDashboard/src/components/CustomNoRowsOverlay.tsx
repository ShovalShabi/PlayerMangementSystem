import { Box } from "@mui/material";

/**
 * Custom overlay component for DataGrid when there are no rows to display.
 *
 * Displays a user-friendly message when the player list is empty.
 */
const CustomNoRowsOverlay = () => (
  <Box sx={{ p: 3, textAlign: "center", color: "text.secondary" }}>
    There are no players at the moment.
  </Box>
);

export default CustomNoRowsOverlay;
