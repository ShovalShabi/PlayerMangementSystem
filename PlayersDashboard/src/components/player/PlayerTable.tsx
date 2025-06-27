import React from "react";
import CustomDataGrid from "../CustomDataGrid";
import CustomNoRowsOverlay from "../CustomNoRowsOverlay";
import type {
  GridColDef,
  GridPaginationModel,
  GridSlotsComponent,
  GridRowParams,
} from "@mui/x-data-grid";
import PlayerDTO from "../../dtos/PlayerDTO";

interface PlayerTableProps {
  rows: PlayerDTO[];
  columns: GridColDef<PlayerDTO>[];
  loading: boolean;
  paginationModel: { page: number; pageSize: number };
  pageSizeOptions: number[];
  rowCount: number;
  onPaginationModelChange: (model: GridPaginationModel) => void;
  onRowClick: (params: GridRowParams) => void;
}

const PlayerTable: React.FC<PlayerTableProps> = ({
  rows,
  columns,
  loading,
  paginationModel,
  pageSizeOptions,
  rowCount,
  onPaginationModelChange,
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
  />
);

export default PlayerTable;
