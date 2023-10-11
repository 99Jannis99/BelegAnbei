import {
  legacy_createStore as createStore,
  combineReducers,
  applyMiddleware,
} from "redux";
import thunk from "redux-thunk";
import { colorReducer, imageReducer } from "./reducers";
import { storeColors, storeImages } from "../Functions/AsyncManager";

const rootReducer = combineReducers({ colorReducer, imageReducer });

export const Store = createStore(rootReducer, applyMiddleware(thunk));

// Abo für Store-Änderungen
Store.subscribe(() => {
  // Aktuellen State holen
  const { colorReducer, imageReducer } = Store.getState();

  // Farben im AsyncStorage speichern
  storeColors({
    background: colorReducer.background,
    primary: colorReducer.primary,
  });
  storeImages({
    welcomeImage: imageReducer.welcomeImage,
    logoImage: imageReducer.logoImage,
  });
});
