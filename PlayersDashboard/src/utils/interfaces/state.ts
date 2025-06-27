import { Filters } from "./filters";

interface State {
  theme: "light" | "dark";
  filters: Filters;
  units: "M" | "FT";
}

export type { State };
