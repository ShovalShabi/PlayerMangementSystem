import { createAction, createReducer } from "@reduxjs/toolkit";
import Units from "../utils/types/units";

const initialMeasurement: Units = "M";

const setMeasurement = createAction<Units>("setMeasurement");

const reducer = createReducer<Units>(initialMeasurement, (builder) => {
  builder.addCase(setMeasurement, (_state, action) => action.payload);
});

export { setMeasurement };

export default reducer;
