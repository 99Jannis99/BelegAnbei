import { useReducer } from "react";
import { SET_COLOR_BACKGROUND, SET_COLOR_PRIMARY } from "./actions";

const initialState = {
  background: "red",
  primary: "yellow",
};

function colorReducer(state = initialState, action) {
  switch (action.type) {
    case SET_COLOR_BACKGROUND:
      return { ...state, background: action.payload };
      break;
    case SET_COLOR_PRIMARY:
      return { ...state, primary: action.payload };
      break;
    default:
      return state;
      break;
  }
}

export default colorReducer;
