import type { GridColDef, GridValueGetter } from "@mui/x-data-grid";
import PlayerDTO from "../dtos/PlayerDTO";

const getNationalities: GridValueGetter<PlayerDTO, unknown> = (value, row) =>
  Array.isArray(row.nationalities) ? row.nationalities.join(", ") : "";

const getPositions: GridValueGetter<PlayerDTO, unknown> = (value, row) =>
  Array.isArray(row.positions) ? row.positions.join(", ") : "";

const getAge: GridValueGetter<PlayerDTO, unknown> = (value, row) => {
  if (!row.dateOfBirth) return "";
  const ageMs = Date.now() - new Date(row.dateOfBirth).getTime();
  const ageDate = new Date(ageMs);
  return Math.abs(ageDate.getUTCFullYear() - 1970); // Years since epoch
};

const PlayerColumns: GridColDef[] = [
  { field: "firstName", headerName: "First Name", flex: 1 },
  { field: "lastName", headerName: "Last Name", flex: 1 },
  { field: "age", headerName: "Age", flex: 0.5, valueGetter: getAge },
  { field: "height", headerName: "Height", flex: 0.5 },
  {
    field: "nationalities",
    headerName: "Nationality",
    flex: 1,
    valueGetter: getNationalities,
  },
  {
    field: "positions",
    headerName: "Positions",
    flex: 1,
    valueGetter: getPositions,
  },
];

export default PlayerColumns;
