import React from "react";
import { Box, Paper } from "@mui/material";
import { DataGrid, DataGridProps, GridColDef } from "@mui/x-data-grid";

// Optionally, allow columns to be passed as a prop, but if not, override flex values here
const adjustColumnFlex = (columns: GridColDef[]) =>
  columns.map((col) => ({ ...col, flex: col.flex ? col.flex * 0.7 : 0.7 }));

interface CustomDataGridProps extends DataGridProps {
  heightUnit?: "m" | "ft";
}

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
