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
import { handleGetPlayersBySortAndFilter } from "../utils/handlers/getPlayerBySorAndFilterHandler";

const columns: GridColDef[] = [
  { field: "firstName", headerName: "First Name", flex: 1 },
  { field: "lastName", headerName: "Last Name", flex: 1 },
  { field: "age", headerName: "Age", flex: 0.5 },
  { field: "height", headerName: "Height", flex: 0.5 },
  {
    field: "nationalities",
    headerName: "Nationality",
    flex: 1,
    valueGetter: (params) =>
      params && params.row && Array.isArray(params.row.nationalities)
        ? params.row.nationalities.join(", ")
        : "",
  },
  {
    field: "positions",
    headerName: "Positions",
    flex: 1,
    valueGetter: (params) =>
      params && params.row && Array.isArray(params.row.positions)
        ? params.row.positions.join(", ")
        : "",
  },
];

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
  const [players, setPlayers] = useState<PlayerDTO[]>([]);
  const [totalPlayers, setTotalPlayers] = useState(0);
  const [loading, setLoading] = useState(false);

  // Map filters to API params
  const getApiParams = () => {
    return {
      name:
        filters.firstName || filters.lastName
          ? `${filters.firstName} ${filters.lastName}`.trim()
          : undefined,
      nationalities: filters.nationality ? [filters.nationality] : undefined,
      minAge: filters.age ? Number(filters.age) : undefined,
      maxAge: filters.age ? Number(filters.age) : undefined,
      positions: filters.positions.length > 0 ? filters.positions : undefined,
      page,
      size: filters.rowsPerPage,
      // Add sortBy/order if you have sort state
    };
  };

  // Fetch players when filters, page, or rowsPerPage change
  React.useEffect(() => {
    const fetchPlayers = async () => {
      setLoading(true);
      const params = getApiParams();
      const result = await handleGetPlayersBySortAndFilter(params, setAlert);
      if (result) {
        setPlayers(result.content || []);
        setTotalPlayers(result.totalElements || 0);
      } else {
        setPlayers([]);
        setTotalPlayers(0);
      }
      setLoading(false);
    };
    fetchPlayers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    filters.firstName,
    filters.lastName,
    filters.nationality,
    filters.age,
    filters.positions,
    page,
    filters.rowsPerPage,
  ]);

  const handleFilterChange = (field: string, value: unknown) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
    setPage(0); // Reset to first page on filter change
  };

  const handlePageChange = (model: GridPaginationModel) => {
    setPage(model.page);
    setFilters((prev) => ({ ...prev, rowsPerPage: model.pageSize }));
  };

  const handleSearch = () => {
    // Triggers useEffect by changing filters
    setPage(0);
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
          width: "100%",
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
        <Box sx={{ maxWidth: 1200, mx: "auto", width: "100%" }}>
          <CustomDataGrid
            rows={players}
            columns={columns}
            paginationModel={{ page, pageSize: filters.rowsPerPage }}
            pageSizeOptions={[5, 10, 15, 20, 25]}
            pagination
            rowCount={totalPlayers}
            paginationMode="server"
            onPaginationModelChange={handlePageChange}
            sx={{ bgcolor: "background.paper" }}
            loading={loading}
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
              mt: 2,
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
                width: "100%",
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
                width: "100%",
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
