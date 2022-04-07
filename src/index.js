import React from "react";
import { Provider } from "react-redux";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import store from "./store";
import "./api/server";
import { fetchTodos } from "./components/todos/todosSlice";

store.dispatch(fetchTodos());

// store.dispatch({ type: "todos/todoAdded", payload: "Learn about actions" });

const root = createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <App />
  </Provider>
);
