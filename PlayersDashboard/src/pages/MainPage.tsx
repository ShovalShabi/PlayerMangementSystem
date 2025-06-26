import React, { useState } from "react";
import {
  Box,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import type { GridPaginationModel, GridSlotsComponent } from "@mui/x-data-grid";
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
import CustomNoRowsOverlay from "../components/CustomNoRowsOverlay";
import { getPlayerColumns } from "../components/playerColumns";

const MainPage: React.FC = () => {
  const [filters, setFilters] = useState({
    firstName: "",
    lastName: "",
    nationality: "",
    minAge: "",
    maxAge: "",
    minHeight: "",
    maxHeight: "",
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
  const [selectedPlayerId, setSelectedPlayerId] = useState<number | null>(null);
  const [modalMode, setModalMode] = useState<"create" | "update">("create");
  const [heightUnit, setHeightUnit] = useState<"m" | "ft">("m");

  // Map filters to API params
  const getApiParams = () => {
    return {
      name:
        filters.firstName || filters.lastName
          ? `${filters.firstName} ${filters.lastName}`.trim()
          : undefined,
      nationalities: filters.nationality ? [filters.nationality] : undefined,
      minAge: filters.minAge ? Number(filters.minAge) : undefined,
      maxAge: filters.maxAge ? Number(filters.maxAge) : undefined,
      minHeight: filters.minHeight ? Number(filters.minHeight) : undefined,
      maxHeight: filters.maxHeight ? Number(filters.maxHeight) : undefined,
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
    filters.minAge,
    filters.maxAge,
    filters.minHeight,
    filters.maxHeight,
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
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Box>
              <Typography
                variant="subtitle1"
                sx={{ mr: 1, fontWeight: 500, display: "inline" }}
              >
                Height in:
              </Typography>
              <ToggleButtonGroup
                value={heightUnit}
                exclusive
                onChange={(_e, val) => val && setHeightUnit(val)}
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
          </Box>
          <CustomDataGrid
            rows={players}
            columns={getPlayerColumns(heightUnit)}
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
            onRowClick={(params) => {
              setSelectedPlayerId(params.row.id);
              setModalMode("update");
              setPlayerModalOpen(true);
            }}
            heightUnit={heightUnit}
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
          mode={modalMode}
          playerId={
            modalMode === "update" ? selectedPlayerId ?? undefined : undefined
          }
          onClose={() => {
            setPlayerModalOpen(false);
            setModalMode("create");
            setSelectedPlayerId(null);
          }}
          onSuccess={() => {
            setPlayerModalOpen(false);
            setModalMode("create");
            setSelectedPlayerId(null);
            // Optionally refresh player list here
          }}
        />
      </Box>
    </Box>
  );
};

export default MainPage;
