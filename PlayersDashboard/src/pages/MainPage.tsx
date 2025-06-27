import React, { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import type { GridPaginationModel, GridRowParams } from "@mui/x-data-grid";
import PlayerDTO from "../dtos/PlayerDTO";
import ThemeModeSwitcher from "../components/ThemeModeSwitcher";
import FilterComponentDrawer from "../components/FilterComponentDrawer";
import useAlert from "../hooks/useAlert";
import PlayerModal from "../components/PlayerModal";
import AddIcon from "@mui/icons-material/Add";
import Button from "@mui/material/Button";
import { handleUploadCsv } from "../utils/handlers/uploadCsvHandler";
import { handleGetPlayersBySortAndFilter } from "../utils/handlers/getPlayerBySorAndFilterHandler";
import LoadingModal from "../components/LoadingModal";
import { useSelector, useDispatch } from "react-redux";
import { State } from "../utils/interfaces/state";
import { setFiltersStore } from "../store/filters-reducer";
import SoccerBallComponent from "../components/SoccerBallComponent";
import Footer from "../components/Footer";
import PlayerTable from "../components/player/PlayerTable";
import UploadCSVButton from "../components/player/UploadCSVButton";
import DashboardHeader from "../components/player/DashboardHeader";
import { getPlayerColumns } from "../components/playerColumns";

const MainPage: React.FC = () => {
  const storedFilters = useSelector((state: State) => state.filters);
  const storedMeasurement = useSelector((state: State) => state.units);

  const [apiLoading, setApiLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(true);
  const { setAlert } = useAlert(); // Custom hook for displaying alerts
  const [playerModalOpen, setPlayerModalOpen] = useState(false);
  const [players, setPlayers] = useState<PlayerDTO[]>([]);
  const [totalPlayers, setTotalPlayers] = useState(0);
  const [selectedPlayerId, setSelectedPlayerId] = useState<number | null>(null);
  const [modalMode, setModalMode] = useState<"create" | "update">("create");
  const [heightUnit, setHeightUnit] = useState(
    storedMeasurement ? storedMeasurement.toLowerCase() : "m"
  );
  const [csvUploadLoading, setCsvUploadLoading] = useState(false);

  // Filters state
  const [filters, setFilters] = useState(storedFilters);

  const dispatch = useDispatch();

  // Map filters to API params
  const getApiParams = (currentFilters = filters) => {
    return {
      name: currentFilters.name || undefined,
      nationalities:
        currentFilters.nationality.length > 0
          ? currentFilters.nationality
          : undefined,
      minAge: currentFilters.minAge ? Number(currentFilters.minAge) : undefined,
      maxAge: currentFilters.maxAge ? Number(currentFilters.maxAge) : undefined,
      minHeight: currentFilters.minHeight
        ? Number(currentFilters.minHeight)
        : undefined,
      maxHeight: currentFilters.maxHeight
        ? Number(currentFilters.maxHeight)
        : undefined,
      positions:
        currentFilters.positions.length > 0
          ? currentFilters.positions
          : undefined,
      page,
      size: currentFilters.rowsPerPage,
    };
  };

  // Update filters and fetch players
  const updateAPIRequest = (field: string, value: unknown) => {
    setFilters((prev) => {
      const updated = { ...prev, [field]: value };
      dispatch(setFiltersStore(updated));
      fetchPlayers(updated);
      return updated;
    });
    setPage(0);
  };

  // Fetch players function
  const fetchPlayers = async (currentFilters = filters) => {
    setApiLoading(true);
    try {
      const params = getApiParams(currentFilters);
      const result = await handleGetPlayersBySortAndFilter(params, setAlert);
      if (result) {
        setPlayers(result.content || []);
        setTotalPlayers(result.totalElements || 0);
      } else {
        setPlayers([]);
        setTotalPlayers(0);
      }
    } catch (error) {
      setPlayers([]);
      setTotalPlayers(0);
      console.error("Error fetching players:", error);
    } finally {
      setApiLoading(false);
    }
  };

  // Initial load of players on mount
  useEffect(() => {
    fetchPlayers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePageChange = async (model: GridPaginationModel) => {
    setPage(model.page);
    setFilters((prev) => ({ ...prev, rowsPerPage: model.pageSize }));
    setApiLoading(true);
    try {
      const params = getApiParams({ ...filters, rowsPerPage: model.pageSize });
      params.page = model.page;
      const result = await handleGetPlayersBySortAndFilter(params, setAlert);
      if (result) {
        setPlayers(result.content || []);
        setTotalPlayers(result.totalElements || 0);
      } else {
        setPlayers([]);
        setTotalPlayers(0);
      }
    } catch (error) {
      setPlayers([]);
      setTotalPlayers(0);
      console.error("Error fetching players:", error);
    } finally {
      setApiLoading(false);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        bgcolor: "background.default",
        minHeight: "100vh",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Soccer Ball SVG above background but below content */}
      <SoccerBallComponent />
      <FilterComponentDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onOpen={() => setDrawerOpen(true)}
        filters={filters}
        updateAPIRequest={updateAPIRequest}
        heightUnit={heightUnit as "m" | "ft"}
      />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          transition: "margin 0.3s",
          ml: drawerOpen ? "100px" : 0,
          position: "relative",
          zIndex: 1,
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
          <Box sx={{ mb: 2 }}>
            <DashboardHeader
              heightUnit={heightUnit}
              setHeightUnit={setHeightUnit}
              dispatch={dispatch}
            />
          </Box>
          <LoadingModal open={apiLoading} message="Loading players..." />
          <PlayerTable
            rows={players}
            columns={getPlayerColumns(heightUnit === "m" ? "M" : "FT")}
            loading={apiLoading}
            paginationModel={{ page, pageSize: filters.rowsPerPage }}
            pageSizeOptions={[5, 10, 15, 20, 25]}
            rowCount={totalPlayers}
            onPaginationModelChange={handlePageChange}
            onRowClick={(params: GridRowParams) => {
              setSelectedPlayerId(params.row.id);
              setModalMode("update");
              setPlayerModalOpen(true);
            }}
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
            <UploadCSVButton
              onUpload={async (file) => {
                setCsvUploadLoading(true);
                try {
                  await handleUploadCsv(file, setAlert, fetchPlayers);
                } finally {
                  setCsvUploadLoading(false);
                }
              }}
              loading={csvUploadLoading}
            />
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
            fetchPlayers();
          }}
        />
        {/* Trademark Footer */}
        <Footer />
      </Box>
    </Box>
  );
};

export default MainPage;
