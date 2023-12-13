export const SET_COLOR_BACKGROUND = "SET_COLOR_BACKGROUND";
export const SET_COLOR_PRIMARY = "SET_COLOR_PRIMARY";
export const SET_WELCOME_IMAGE = "SET_WELCOME_IMAGE";
export const SET_LOGO_IMAGE = "SET_LOGO_IMAGE";
export const SET_DATA_UPDATE = "SET_DATA_UPDATE";
export const SET_DATA_CUSTOMER = "SET_DATA_CUSTOMER";
export const SET_DATA_SETTINGS = "SET_DATA_SETTINGS";
export const SET_DATA_LOCATIONS = "SET_DATA_LOCATIONS";
export const SET_DATA_PERSONS = "SET_DATA_PERSONS";
export const SET_DATA_MORE_INDEX = "SET_DATA_MORE_INDEX";
export const SET_DATA_MORE_PAGES = "SET_DATA_MORE_PAGES";
export const SET_DATA_MORE_FAQS = "SET_DATA_MORE_FAQS";
export const SET_DATA_TEXTSNIPPETS = "SET_DATA_TEXTSNIPPETS";
export const SET_DATA_APPOINTMENTS = "SET_DATA_APPOINTMENTS";
export const SET_DATA_MORE_DOWNLOADS = "SET_DATA_MORE_DOWNLOADS";
export const SET_DATA_MORE_VIDEOS = "SET_DATA_MORE_VIDEOS";
export const SET_DATA_NEWS = "SET_DATA_NEWS";
export const SET_DATA_MANDATES = "SET_DATA_MANDATES";
export const SET_DATA_BELEGCATEGORIES = "SET_DATA_BELEGCATEGORIES";
export const SET_DATA_STYLE = "SET_DATA_STYLE";
export const SET_DATA_DOCUMENTS = "SET_DATA_DOCUMENTS";
export const ADD_DATA_DOCUMENTS = "ADD_DATA_DOCUMENTS";
export const SET_DATEV_CLIENT = "SET_DATEV_CLIENT";
export const SET_NAV_PAGE = "SET_NAV_PAGE";
export const SET_DATA_IDENTITIES = "SET_DATA_IDENTITIES";

export const setBackground = (background) => (dispatch) => {
  dispatch({
    type: SET_COLOR_BACKGROUND,
    payload: background,
  });
};

export const setPrimary = (primary) => (dispatch) => {
  dispatch({
    type: SET_COLOR_PRIMARY,
    payload: primary,
  });
};

export const setWelcomeImage = (welcomeImage) => (dispatch) => {
  dispatch({
    type: SET_WELCOME_IMAGE,
    payload: welcomeImage,
  });
};

export const setLogoImage = (logoImage) => (dispatch) => {
  dispatch({
    type: SET_LOGO_IMAGE,
    payload: logoImage,
  });
};

export const setDataUpdate = (data) => (dispatch) => {
  dispatch({
    type: SET_DATA_UPDATE,
    payload: data,
  });
};

export const setDataCustomer = (data) => (dispatch) => {
  dispatch({
    type: SET_DATA_CUSTOMER,
    payload: data,
  });
};

export const setDataSettings = (data) => (dispatch) => {
  dispatch({
    type: SET_DATA_SETTINGS,
    payload: data,
  });
};

export const setDataLocations = (data) => (dispatch) => {
  dispatch({
    type: SET_DATA_LOCATIONS,
    payload: data,
  });
};

export const setDataPersons = (data) => (dispatch) => {
  dispatch({
    type: SET_DATA_PERSONS,
    payload: data,
  });
};

export const setDataMoreIndex = (data) => (dispatch) => {
  dispatch({
    type: SET_DATA_MORE_INDEX,
    payload: data,
  });
};

export const setDataMorePages = (data) => (dispatch) => {
  dispatch({
    type: SET_DATA_MORE_PAGES,
    payload: data,
  });
};

export const setDataMoreFAQs = (data) => (dispatch) => {
  dispatch({
    type: SET_DATA_MORE_FAQS,
    payload: data,
  });
};

export const setDataTextsnippets = (data) => (dispatch) => {
  dispatch({
    type: SET_DATA_TEXTSNIPPETS,
    payload: data,
  });
};

export const setDataAppointments = (data) => (dispatch) => {
  dispatch({
    type: SET_DATA_APPOINTMENTS,
    payload: data,
  });
};

export const setDataMoreDownloads = (data) => (dispatch) => {
  dispatch({
    type: SET_DATA_MORE_DOWNLOADS,
    payload: data,
  });
};

export const setDataMoreVideos = (data) => (dispatch) => {
  dispatch({
    type: SET_DATA_MORE_VIDEOS,
    payload: data,
  });
};

export const setDataNews = (data) => (dispatch) => {
  dispatch({
    type: SET_DATA_NEWS,
    payload: data,
  });
};

export const setDataMandates = (data) => (dispatch) => {
  dispatch({
    type: SET_DATA_MANDATES,
    payload: data,
  });
};

export const setDataBelegcategories = (data) => (dispatch) => {
  dispatch({
    type: SET_DATA_BELEGCATEGORIES,
    payload: data,
  });
};

export const setDataStyle = (data) => (dispatch) => {
  dispatch({
    type: SET_DATA_STYLE,
    payload: data,
  });
};

export const setDataDocuments = (dataDocuments) => (dispatch) => {
  dispatch({
    type: SET_DATA_DOCUMENTS,
    payload: dataDocuments,
  });
};

export const addDataDocuments = (dataDocuments) => (dispatch) => {
  dispatch({
    type: ADD_DATA_DOCUMENTS,
    payload: dataDocuments,
  });
};

export const setDatevClient = (datevClient) => (dispatch) => {
  dispatch({
    type: SET_DATEV_CLIENT,
    payload: datevClient,
  });
};

export const setNavPage = (navPage) => (dispatch) => {
  dispatch({
    type: SET_NAV_PAGE,
    payload: navPage,
  });
};

export const setDataIdentities = (dataIdentities) => (dispatch) => {
  dispatch({
    type: SET_DATA_IDENTITIES,
    payload: dataIdentities,
  });
};