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

export function getPlayerColumns(heightUnit: "m" | "ft"): GridColDef[] {
  return [
    { field: "firstName", headerName: "First Name", flex: 1 },
    { field: "lastName", headerName: "Last Name", flex: 1 },
    { field: "age", headerName: "Age", flex: 0.5, valueGetter: getAge },
    {
      field: "height",
      headerName: "Height",
      flex: 0.5,
      valueGetter: (value, row) => {
        if (typeof row.height !== "number") return "";
        if (heightUnit === "m") {
          return `${row.height.toFixed(2)} m`;
        } else {
          // 1 meter = 3.28084 feet
          const feet = row.height * 3.28084;
          return `${feet.toFixed(2)} ft`;
        }
      },
    },
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
}
