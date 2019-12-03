import { createStore } from "redux";

let initialState = {
  loggedIn: false,
  user: undefined,
  hosts: [],
  eventIds: []
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
  if (action.type === "update-user") {
    return {
      ...state,
      user: action.user
    };
  }
  if (action.type === "get-eventIds") {
    return {
      ...state,
      eventIds: action.eventIds
    };
  }
  if (action.type === "get-hosts") {
    return {
      ...state,
      hosts: action.hosts
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
