import type { GridColDef, GridValueGetter } from "@mui/x-data-grid";
import PlayerDTO from "../dtos/PlayerDTO";
import * as FlagIcons from "country-flag-icons/react/3x2";
import countryLabelToCodeMap from "../utils/objects/country-label-to-code-map";

const getPositions: GridValueGetter<PlayerDTO, unknown> = (_, row) =>
  Array.isArray(row.positions) ? row.positions.join(", ") : "";

const getAge: GridValueGetter<PlayerDTO, unknown> = (_, row) => {
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
      valueGetter: (_, row) => {
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
      renderCell: (params) => {
        const { row } = params;
        if (!Array.isArray(row.nationalities)) return "";
        return (
          <span>
            {row.nationalities.map((nat: string, idx: number) => {
              const code = countryLabelToCodeMap.get(nat) || "";
              const FlagComponent = code
                ? (
                    FlagIcons as Record<
                      string,
                      React.ComponentType<React.SVGProps<SVGSVGElement>>
                    >
                  )[code]
                : null;
              return (
                <span
                  key={nat}
                  style={{
                    marginRight: 8,
                    display: "inline-flex",
                    alignItems: "center",
                  }}
                >
                  {nat}
                  {FlagComponent && (
                    <FlagComponent
                      aria-label={nat}
                      style={{
                        marginLeft: 4,
                        width: 18,
                        height: 12,
                        display: "inline-block",
                        verticalAlign: "middle",
                      }}
                    />
                  )}
                  {idx < row.nationalities.length - 1 ? "," : ""}
                </span>
              );
            })}
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
