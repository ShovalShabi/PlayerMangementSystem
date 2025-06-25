import React, { useState } from "react";
import { Box, Typography } from "@mui/material";
import type {
  GridColDef,
  GridPaginationModel,
  GridSlotsComponent,
} from "@mui/x-data-grid";
import PlayerDTO from "../dtos/PlayerDTO";
import ThemeModeSwitcher from "../components/ThemeModeSwitcher";
import UploadCSVModal from "../components/UploadCSVModal";
import FilterComponentDrawer from "../components/FilterComponentDrawer";
import CustomDataGrid from "../components/CustomDataGrid";

const columns: GridColDef[] = [
  { field: "firstName", headerName: "First Name", flex: 1 },
  { field: "lastName", headerName: "Last Name", flex: 1 },
  { field: "age", headerName: "Age", flex: 0.5 },
  { field: "height", headerName: "Height", flex: 0.5 },
  {
    field: "nationalities",
    headerName: "Nationality",
    flex: 1,
    valueGetter: (params: { row: PlayerDTO }) =>
      params.row.nationalities?.join(", "),
  },
  {
    field: "positions",
    headerName: "Positions",
    flex: 1,
    valueGetter: (params: { row: PlayerDTO }) =>
      params.row.positions?.join(", "),
  },
];

const dummyRows: PlayerDTO[] = [];

const CustomNoRowsOverlay = () => (
  <Box sx={{ p: 3, textAlign: "center", color: "text.secondary" }}>
    No matching players
  </Box>
);

const MainPage: React.FC = () => {
  const [filters, setFilters] = useState({
    firstName: "",
    lastName: "",
    nationality: "",
    age: "",
    positions: [] as string[],
    rowsPerPage: 10,
  });
  const [page, setPage] = useState(0);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(true);

  const filteredRows = dummyRows;

  const handleFilterChange = (field: string, value: unknown) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const handlePageChange = (model: GridPaginationModel) => {
    setPage(model.page);
    handleFilterChange("rowsPerPage", model.pageSize);
  };

  const handleUploadSubmit = (file: File | null) => {
    setUploadModalOpen(false);
  };

  const handleSearch = () => {
    // TODO: Implement search/filter logic
  };

  return (
    <Box
      sx={{
        display: "flex",
        bgcolor: "background.default",
        minHeight: "100vh",
      }}
    >
      <FilterComponentDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onOpen={() => setDrawerOpen(true)}
        filters={filters}
        onFilterChange={handleFilterChange}
        onUploadClick={() => setUploadModalOpen(true)}
        onSearch={handleSearch}
      />
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          transition: "margin 0.3s",
          ml: drawerOpen ? "100px" : 0,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", mb: 2, p: 2 }}>
          <Typography
            variant="h2"
            gutterBottom
            align="center"
            sx={{
              flex: 1,
              color: (theme) => theme.palette.primary.main,
              textShadow: "0 2px 8px rgba(55, 150, 131, 0.08)",
              fontWeight: 700,
              letterSpacing: 1,
            }}
          >
            Player Dashboard
          </Typography>
          <Box sx={{ flex: 0, ml: 2 }}>
            <ThemeModeSwitcher />
          </Box>
        </Box>
        <CustomDataGrid
          autoHeight
          rows={filteredRows}
          columns={columns}
          paginationModel={{ page, pageSize: filters.rowsPerPage }}
          pageSizeOptions={[5, 10, 15, 20, 25]}
          pagination
          rowCount={filteredRows.length}
          paginationMode="client"
          onPaginationModelChange={handlePageChange}
          sx={{ bgcolor: "background.paper" }}
          slots={
            {
              noRowsOverlay: CustomNoRowsOverlay,
              noResultsOverlay: CustomNoRowsOverlay,
            } as Partial<GridSlotsComponent>
          }
        />
        <UploadCSVModal
          open={uploadModalOpen}
          handleClose={() => setUploadModalOpen(false)}
          handleSubmit={handleUploadSubmit}
        />
      </Box>
    </Box>
  );
};

export default MainPage;
