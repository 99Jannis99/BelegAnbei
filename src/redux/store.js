import {
  legacy_createStore as createStore,
  combineReducers,
  applyMiddleware,
} from "redux";
import thunk from "redux-thunk";
import {
  colorReducer,
  imageReducer,
  dataReducer,
  datevReducer,
} from "./reducers";
import {
  storeColors,
  storeImages,
  storeData,
  storeDatev,
} from "./AsyncManager";

const rootReducer = combineReducers({
  colorReducer,
  imageReducer,
  dataReducer,
  datevReducer, // Fügen Sie den dataReducer hinzu
});

export const Store = createStore(rootReducer, applyMiddleware(thunk));

// Abo für Store-Änderungen
Store.subscribe(() => {
  // Aktuellen State holen
  const {
    colorReducer,
    imageReducer,
    dataReducer,
    datevReducer,
  } = Store.getState();

  // Farben im AsyncStorage speichern
  storeColors({
    background: colorReducer.background,
    primary: colorReducer.primary,
  });
  storeImages({
    welcomeImage: imageReducer.welcomeImage,
    iconImage: imageReducer.iconImage,
    logoImage: imageReducer.logoImage,
  });
  // Daten speichern (implementieren Sie die Logik, die Sie benötigen)
  storeData({
    dataUpdate: dataReducer.dataUpdate,
    dataCustomer: dataReducer.dataCustomer,
    dataSettings: dataReducer.dataSettings,
    dataLocations: dataReducer.dataLocations,
    dataPersons: dataReducer.dataPersons,
    dataMoreIndex: dataReducer.dataMoreIndex,
    dataMorePages: dataReducer.dataMorePages,
    dataMoreFAQs: dataReducer.dataMoreFAQs,
    dataTextsnippets: dataReducer.dataTextsnippets,
    dataAppointments: dataReducer.dataAppointments,
    dataMoreDownloads: dataReducer.dataMoreDownloads,
    dataMoreVideos: dataReducer.dataMoreVideos,
    dataNews: dataReducer.dataNews,
    dataMandates: dataReducer.dataMandates,
    dataBelegcategories: dataReducer.dataBelegcategories,
    dataStyle: dataReducer.dataStyle,
    dataDocuments: dataReducer.dataDocuments,
    navPage: dataReducer.navPage,
    dataIdentities: dataReducer.dataIdentities,
  });

  storeDatev({
    datevClient: datevReducer.datevClient,
  });
});
