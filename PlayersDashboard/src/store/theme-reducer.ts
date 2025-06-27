import { createAction, createReducer } from "@reduxjs/toolkit";
import { State } from "../utils/interfaces/state";

/**
 * Initial theme state (defaults to light mode).
 */
const initialState: State["theme"] = "light" as const;

/**
 * Action to set the application theme (light or dark).
 */
const setTheme = createAction<State["theme"]>("setTheme");

/**
 * Reducer for managing application theme state.
 * Handles switching between light and dark themes.
 */
const reducer = createReducer<State["theme"]>(initialState, (builder) => {
  builder.addCase(setTheme, (_, action) => {
    return action.payload;
  });
});

export { setTheme };

export default reducer;
