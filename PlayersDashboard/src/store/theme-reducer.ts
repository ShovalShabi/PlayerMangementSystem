import { createAction, createReducer } from "@reduxjs/toolkit";
import { State } from "../utils/interfaces/state";

const initialState: State["theme"] = "light" as const;

const setTheme = createAction<State["theme"]>("setTheme");

const reducer = createReducer<State["theme"]>(initialState, (builder) => {
  builder.addCase(setTheme, (_, action) => {
    return action.payload;
  });
});

export { setTheme };

export default reducer;
