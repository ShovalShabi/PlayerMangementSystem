import type { GridColDef, GridValueGetter } from "@mui/x-data-grid";
import PlayerDTO from "../dtos/PlayerDTO";
import NationalityWithFlag from "./NationalityWithFlag";
import { Positions } from "../utils/enums/Positions";

/**
 * Value getter for positions field - joins array into comma-separated string.
 * @param _ Unused field parameter.
 * @param row The player data row.
 * @returns Comma-separated string of positions.
 */
const getPositions: GridValueGetter<PlayerDTO, unknown> = (_, row) =>
  Array.isArray(row.positions) ? row.positions.join(", ") : "";

/**
 * Value getter for age field - calculates age from date of birth.
 * @param _ Unused field parameter.
 * @param row The player data row.
 * @returns Calculated age in years.
 */
const getAge: GridValueGetter<PlayerDTO, unknown> = (_, row) => {
  if (!row.dateOfBirth) return "";
  const ageMs = Date.now() - new Date(row.dateOfBirth).getTime();
  const ageDate = new Date(ageMs);
  return Math.abs(ageDate.getUTCFullYear() - 1970); // Years since epoch
};

/**
 * Generates column definitions for the player data grid.
 * @param heightUnit The unit to display height in ("M" for meters, "FT" for feet).
 * @returns Array of column definitions for the data grid.
 */
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
