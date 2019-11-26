import { createStore } from "redux";

let initialState = {
  loggedIn: false,
  user: undefined
};

let reducer = (state, action) => {
  if (action.type === "login-success") {
    return {
      ...state,
      loggedIn: true,
      user: action.user
    };
  }
  if (action.type === "logout-success") {
    return {
      ...state,
      loggedIn: false,
      user: undefined
    };
  }
  return state;
};

let store = createStore(
  reducer,
  initialState,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

export default store;
