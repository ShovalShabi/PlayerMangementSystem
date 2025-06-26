import React, { useState } from "react";
import { Box, Typography } from "@mui/material";
import type {
  GridColDef,
  GridPaginationModel,
  GridSlotsComponent,
} from "@mui/x-data-grid";
import PlayerDTO from "../dtos/PlayerDTO";
import ThemeModeSwitcher from "../components/ThemeModeSwitcher";
import FilterComponentDrawer from "../components/FilterComponentDrawer";
import CustomDataGrid from "../components/CustomDataGrid";
import useAlert from "../hooks/use-alert";
import PlayerModal from "../components/PlayerModal";
import AddIcon from "@mui/icons-material/Add";
import Button from "@mui/material/Button";
import DownloadIcon from "@mui/icons-material/Download";
import { handleUploadCsv } from "../utils/handlers/uploadCsvHandler";

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
  const [drawerOpen, setDrawerOpen] = useState(true);
  const { setAlert } = useAlert(); // Custom hook for displaying alerts
  const [playerModalOpen, setPlayerModalOpen] = useState(false);

  const filteredRows = dummyRows;

  const handleFilterChange = (field: string, value: unknown) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const handlePageChange = (model: GridPaginationModel) => {
    setPage(model.page);
    handleFilterChange("rowsPerPage", model.pageSize);
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
        onUploadClick={() => {}}
        onSearch={handleSearch}
      />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          transition: "margin 0.3s",
          ml: drawerOpen ? "100px" : 0,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
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
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            mt: 1,
            gap: 2,
          }}
        >
          <Button
            variant="outlined"
            color="primary"
            startIcon={<AddIcon />}
            sx={{
              fontWeight: 500,
              fontSize: 15,
              borderRadius: 2,
              boxShadow: "none",
              height: 48,
              minWidth: 180,
            }}
            onClick={() => setPlayerModalOpen(true)}
          >
            Add Player
          </Button>
          <Button
            variant="outlined"
            color="primary"
            startIcon={<DownloadIcon />}
            component="label"
            sx={{
              fontWeight: 500,
              fontSize: 15,
              borderRadius: 2,
              boxShadow: "none",
              height: 48,
              minWidth: 180,
            }}
          >
            Upload CSV
            <input
              type="file"
              accept=".csv"
              hidden
              onChange={async (e) => {
                if (e.target.files && e.target.files.length > 0) {
                  await handleUploadCsv(e.target.files[0], setAlert);
                  e.target.value = "";
                }
              }}
            />
          </Button>
        </Box>
        <PlayerModal
          open={playerModalOpen}
          mode="create"
          onClose={() => setPlayerModalOpen(false)}
          onSuccess={() => {
            setPlayerModalOpen(false);
            // Optionally refresh player list here
          }}
        />
      </Box>
    </Box>
  );
};

export default MainPage;
