export const SET_COLOR_BACKGROUND = "SET_COLOR_BACKGROUND";
export const SET_COLOR_PRIMARY = "SET_COLOR_PRIMARY";
export const SET_WELCOME_IMAGE = "SET_WELCOME_IMAGE";
export const SET_LOGO_IMAGE = "SET_LOGO_IMAGE";

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
