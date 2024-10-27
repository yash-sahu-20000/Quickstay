import { combineReducers } from "redux";
import searchReducer from "./searchReducer/searchReducer";
import authReducer from "./authReducer/authReducer";

const rootReducer = combineReducers({
  search: searchReducer,
  auth: authReducer
});

export default rootReducer;