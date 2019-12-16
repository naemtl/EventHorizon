import { createStore } from "redux";

let initialState = {
  loggedIn: false,
  user: undefined,
  hosts: [],
  followedHosts: [],
  eventIds: [],
  autologinDone: false
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
  if (action.type === "autologin-done") {
    return {
      ...state,
      autologinDone: true
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
  if (action.type === "set-followed-hosts") {
    return {
      ...state,
      followedHosts: action.followedHosts
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
