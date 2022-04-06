import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import store from "./store";
import "./api/server";

store.dispatch({ type: "todos/todoAdded", payload: "Learn about actions" });

const root = createRoot(document.getElementById("root"));
root.render(<App />);
