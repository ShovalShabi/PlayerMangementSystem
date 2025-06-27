import type { GridColDef, GridValueGetter } from "@mui/x-data-grid";
import PlayerDTO from "../dtos/PlayerDTO";
import NationalityWithFlag from "./NationalityWithFlag";
import { Positions } from "../dtos/Positions";

const getPositions: GridValueGetter<PlayerDTO, unknown> = (_, row) =>
  Array.isArray(row.positions) ? row.positions.join(", ") : "";

const getAge: GridValueGetter<PlayerDTO, unknown> = (_, row) => {
  if (!row.dateOfBirth) return "";
  const ageMs = Date.now() - new Date(row.dateOfBirth).getTime();
  const ageDate = new Date(ageMs);
  return Math.abs(ageDate.getUTCFullYear() - 1970); // Years since epoch
};

export function getPlayerColumns(heightUnit: "M" | "FT"): GridColDef[] {
  return [
    { field: "firstName", headerName: "First Name", flex: 1 },
    { field: "lastName", headerName: "Last Name", flex: 1 },
    { field: "age", headerName: "Age", flex: 0.5, valueGetter: getAge },
    {
      field: "height",
      headerName: "Height",
      flex: 0.5,
      valueGetter: (_, row) => {
        if (typeof row.height !== "number") return "";
        if (heightUnit === "M") {
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
      renderCell: (params) => {
        const { row } = params;
        if (!Array.isArray(row.nationalities)) return "";
        return (
          <span>
            {row.nationalities.map((nat: string, idx: number) => (
              <span
                key={nat}
                style={{
                  marginRight: 8,
                  display: "inline-flex",
                  alignItems: "center",
                }}
              >
                <NationalityWithFlag nationality={nat} />
                {idx < row.nationalities.length - 1 ? "," : ""}
              </span>
            ))}
          </span>
        );
      },
    },
    {
      field: "positions",
      headerName: "Positions",
      flex: 1,
      valueGetter: getPositions,
    },
  ];
}

export const positionOptions = Object.values(Positions);
