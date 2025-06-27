import { createAction, createReducer } from "@reduxjs/toolkit";
import Units from "../utils/types/units";

/**
 * Initial measurement unit state (defaults to meters).
 */
const initialMeasurement: Units = "M";

/**
 * Action to set the measurement unit (M for meters, FT for feet).
 */
const setMeasurement = createAction<Units>("setMeasurement");

/**
 * Reducer for managing measurement unit state.
 * Handles switching between meters and feet for height display.
 */
const reducer = createReducer<Units>(initialMeasurement, (builder) => {
  builder.addCase(setMeasurement, (_state, action) => action.payload);
});

export { setMeasurement };

export default reducer;
