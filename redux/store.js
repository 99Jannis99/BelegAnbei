import {
  legacy_createStore as createStore,
  combineReducers,
  applyMiddleware,
} from "redux";
import thunk from "redux-thunk";
import colorReducer from "./reducers";

const rootReducer = combineReducers({ colorReducer });

export const Store = createStore(rootReducer, applyMiddleware(thunk));
