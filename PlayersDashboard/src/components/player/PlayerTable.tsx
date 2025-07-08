import React from "react";
import CustomDataGrid from "../CustomDataGrid";
import CustomNoRowsOverlay from "../CustomNoRowsOverlay";
import type {
  GridColDef,
  GridPaginationModel,
  GridSlotsComponent,
  GridRowParams,
  GridSortModel,
} from "@mui/x-data-grid";
import PlayerDTO from "../../dtos/PlayerDTO";

/**
 * Props for PlayerTable component.
 * @property rows Array of player data rows.
 * @property columns Column definitions for the data grid.
 * @property loading Whether the table is loading data.
 * @property paginationModel Current pagination state.
 * @property pageSizeOptions Options for page size selection.
 * @property rowCount Total number of rows (for server-side pagination).
 * @property onPaginationModelChange Callback for pagination changes.
 * @property onRowClick Callback when a row is clicked.
 */
interface PlayerTableProps {
  rows: PlayerDTO[];
  columns: GridColDef<PlayerDTO>[];
  loading: boolean;
  paginationModel: { page: number; pageSize: number };
  pageSizeOptions: number[];
  rowCount: number;
  onPaginationModelChange: (model: GridPaginationModel) => void;
  onSortModelChange: (model: GridSortModel) => void;
  onRowClick: (params: GridRowParams) => void;
}

/**
 * Displays a paginated, server-side data grid of players with custom overlays.
 *
 * @param props PlayerTableProps
 */
const PlayerTable: React.FC<PlayerTableProps> = ({
  rows,
  columns,
  loading,
  paginationModel,
  pageSizeOptions,
  rowCount,
  onPaginationModelChange,
  onSortModelChange,
  onRowClick,
}) => (
  <CustomDataGrid
    rows={rows}
    columns={columns}
    paginationModel={paginationModel}
    pageSizeOptions={pageSizeOptions}
    pagination
    rowCount={rowCount}
    paginationMode="server"
    onPaginationModelChange={onPaginationModelChange}
    sx={{ bgcolor: "background.paper" }}
    loading={loading}
    slots={
      {
        noRowsOverlay: CustomNoRowsOverlay,
        noResultsOverlay: CustomNoRowsOverlay,
      } as Partial<GridSlotsComponent>
    }
    onRowClick={onRowClick}
    onSortModelChange={onSortModelChange}
  />
);

export default PlayerTable;
