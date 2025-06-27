import { createAction, createReducer } from "@reduxjs/toolkit";
import { Filters } from "../utils/interfaces/filters";

/**
 * Initial filter state with default values for all filter fields.
 */
const initialFilters: Filters = {
  name: "",
  nationality: [],
  minAge: "",
  maxAge: "",
  minHeight: "",
  maxHeight: "",
  positions: [],
  rowsPerPage: 10,
};

/**
 * Action to set the complete filter state.
 */
const setFilters = createAction<Filters>("setFilters");

/**
 * Action to reset all filters to their initial values.
 */
const resetFilters = createAction<void>("resetFilters");

/**
 * Reducer for managing player filter state.
 * Handles setting and resetting filters for player search and pagination.
 */
const reducer = createReducer(initialFilters, (builder) => {
  builder.addCase(setFilters, (state: Filters, action) => {
    state.name = action.payload.name;
    state.nationality = [...action.payload.nationality];
    state.minAge = action.payload.minAge;
    state.maxAge = action.payload.maxAge;
    state.minHeight = action.payload.minHeight;
    state.maxHeight = action.payload.maxHeight;
    state.positions = action.payload.positions;
  });
  builder.addCase(resetFilters, (state: Filters) => {
    Object.assign(state, initialFilters);
  });
});

export { setFilters as setFiltersStore, resetFilters as resetFiltersStore };

export default reducer;
