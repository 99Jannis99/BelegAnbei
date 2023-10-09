import {
  legacy_createStore as createStore,
  combineReducers,
  applyMiddleware,
} from "redux";
import thunk from "redux-thunk";
import colorReducer from "./reducers";
import { storeColors } from "../Functions/manageColors";

const rootReducer = combineReducers({ colorReducer });

export const Store = createStore(rootReducer, applyMiddleware(thunk));

// Abo für Store-Änderungen
Store.subscribe(() => {
  // Aktuellen State holen
  const { colorReducer } = Store.getState();

  // Farben im AsyncStorage speichern
  storeColors({
    background: colorReducer.background,
    primary: colorReducer.primary,
  });
});
