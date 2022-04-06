import { combineReducers } from "redux";
import filtersReducer from "./components/filters/filtersSlice";
import todosReducer from "./components/todos/todosSlice";

const rootReducer = combineReducers({
  todos: todosReducer,
  filters: filtersReducer,
});

export default rootReducer;
