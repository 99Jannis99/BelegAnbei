import {
  SET_COLOR_BACKGROUND,
  SET_COLOR_PRIMARY,
  SET_WELCOME_IMAGE,
  SET_LOGO_IMAGE,
  SET_DATA_UPDATE,
  SET_DATA_CUSTOMER,
  SET_DATA_SETTINGS,
  SET_DATA_LOCATIONS,
  SET_DATA_PERSONS,
  SET_DATA_MORE_INDEX,
  SET_DATA_MORE_PAGES,
  SET_DATA_MORE_FAQS,
  SET_DATA_TEXTSNIPPETS,
  SET_DATA_APPOINTMENTS,
  SET_DATA_MORE_DOWNLOADS,
  SET_DATA_MORE_VIDEOS,
  SET_DATA_NEWS,
  SET_DATA_MANDATES,
  SET_DATA_BELEGCATEGORIES,
  SET_DATA_DOCUMENTS,
  ADD_DATA_DOCUMENTS,
} from "./actions.js";

var RNFileSystem = require("react-native-fs");

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
  welcomeImage: `file://${RNFileSystem.DocumentDirectoryPath}/homeImg.jpg`,
  logoImage: `file://${RNFileSystem.DocumentDirectoryPath}/header.png`,
  lastUpdated: null,
};

export function imageReducer(state = imageInitialState, action) {
  switch (action.type) {
    case SET_WELCOME_IMAGE:
      return {
        ...state,
        welcomeImage: action.payload,
        lastUpdated: Date.now(),
      };
    case SET_LOGO_IMAGE:
      return {
        ...state,
        logoImage: action.payload,
        lastUpdated: Date.now(),
      };
    default:
      return state;
  }
}

const dataInitialState = {
  dataUpdate: "{}",
  dataCustomer: "{}",
  dataSettings: "{}",
  dataLocations: "{}",
  dataPersons: "{}",
  dataMoreIndex: "{}",
  dataMorePages: "{}",
  dataMoreFAQs: "{}",
  dataTextsnippets: "{}",
  dataAppointments: "{}",
  dataMoreDownloads: "{}",
  dataMoreVideos: "{}",
  dataNews: "{}",
  dataMandates: "{}",
  dataBelegcategories: "{}",
  dataDocuments: {},
};

export function dataReducer(state = dataInitialState, action) {
  switch (action.type) {
    case SET_DATA_UPDATE:
      return { ...state, dataUpdate: action.payload };
    case SET_DATA_CUSTOMER:
      return { ...state, dataCustomer: action.payload };
    case SET_DATA_SETTINGS:
      return { ...state, dataSettings: action.payload };
    case SET_DATA_LOCATIONS:
      return { ...state, dataLocations: action.payload };
    case SET_DATA_PERSONS:
      return { ...state, dataPersons: action.payload };
    case SET_DATA_MORE_INDEX:
      return { ...state, dataMoreIndex: action.payload };
    case SET_DATA_MORE_PAGES:
      return { ...state, dataMorePages: action.payload };
    case SET_DATA_MORE_FAQS:
      return { ...state, dataMoreFAQs: action.payload };
    case SET_DATA_TEXTSNIPPETS:
      return { ...state, dataTextsnippets: action.payload };
    case SET_DATA_APPOINTMENTS:
      return { ...state, dataAppointments: action.payload };
    case SET_DATA_MORE_DOWNLOADS:
      return { ...state, dataMoreDownloads: action.payload };
    case SET_DATA_MORE_VIDEOS:
      return { ...state, dataMoreVideos: action.payload };
    case SET_DATA_NEWS:
      return { ...state, dataNews: action.payload };
    case SET_DATA_MANDATES:
      return { ...state, dataMandates: action.payload };
    case SET_DATA_BELEGCATEGORIES:
      return { ...state, dataBelegcategories: action.payload };
    case SET_DATA_DOCUMENTS:
      return {
        ...state,
        dataDocuments: {
          ...action.payload,
        },
      };

    case ADD_DATA_DOCUMENTS:
      return {
        ...state,
        dataDocuments: {
          ...state.dataDocuments,
          ...action.payload,
        },
      };
    default:
      return state;
  }
}
