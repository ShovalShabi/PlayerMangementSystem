import React from "react";
import { Box, Paper } from "@mui/material";
import { DataGrid, DataGridProps, GridColDef } from "@mui/x-data-grid";

/**
 * Adjusts the flex value of each column for consistent sizing.
 * @param columns Array of column definitions.
 * @returns New array of columns with adjusted flex values.
 */
const adjustColumnFlex = (columns: GridColDef[]) =>
  columns.map((col) => ({ ...col, flex: col.flex ? col.flex * 0.7 : 0.7 }));

/**
 * Props for CustomDataGrid.
 * @property heightUnit Optional unit for height display ("M" for meters, "FT" for feet).
 * Inherits all DataGridProps from MUI X DataGrid.
 */
interface CustomDataGridProps extends DataGridProps {
  heightUnit?: "M" | "FT";
}

/**
 * A styled wrapper around MUI's DataGrid with custom column flex adjustment and layout.
 *
 * @param props CustomDataGridProps
 */
const CustomDataGrid: React.FC<CustomDataGridProps> = (props) => {
  const columns = props.columns
    ? adjustColumnFlex(props.columns as GridColDef[])
    : (props.columns as GridColDef[]);
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        width: "100%",
        mt: 8,
      }}
    >
      <Paper
        elevation={3}
        sx={{ maxWidth: 1200, width: "100%", mx: "auto", p: 2 }}
      >
        <DataGrid {...props} columns={columns} />
      </Paper>
    </Box>
  );
};

export default CustomDataGrid;
