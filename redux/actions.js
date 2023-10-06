export const SET_COLOR_BACKGROUND = "SET_COLOR_BACKGROUND";
export const SET_COLOR_PRIMARY = "SET_COLOR_PRIMARY";

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
  
