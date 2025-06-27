import { createAction, createReducer } from "@reduxjs/toolkit";
import { State } from "../utils/interfaces/state";

const initialMeasurement: State["units"] = "M";

const setMeasurement = createAction<State["units"]>("setMeasurement");

const reducer = createReducer(initialMeasurement, (builder) => {
  builder.addCase(setMeasurement, (state: State["units"], action) => {
    state = action.payload;
  });
});

export { setMeasurement };

export default reducer;
