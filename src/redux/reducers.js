// reducers.js
import {
  SET_COLOR_BACKGROUND,
  SET_COLOR_PRIMARY,
  SET_WELCOME_IMAGE,
  SET_LOGO_IMAGE
} from "./actions";

const colorInitialState = {
  background: "rgb(255, 255, 255)",
  primary: "rgb(0, 0, 0)",
};

export function colorReducer(state = colorInitialState, action) {
  switch (action.type) {
    case SET_COLOR_BACKGROUND:
      return { ...state, background: action.payload };
    case SET_COLOR_PRIMARY:
      return { ...state, primary: action.payload };
    default:
      return state;
  }
}

const imageInitialState = {
  welcomeImage: '',
  logoImage:"",
};

export function imageReducer(state = imageInitialState, action) {
  switch (action.type) {
    case SET_WELCOME_IMAGE:
      return { ...state, welcomeImage: action.payload };
      case SET_LOGO_IMAGE:
        return { ...state, logoImage: action.payload };
    default:
      return state;
  }
}
