import { createStore, applyMiddleware } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import thunkMiddleware from "redux-thunk";
import rootReducer from "./reducer";
import { delayedMessageMiddleware, print1, print2, print3 } from "./exampleAddons/middleware";

const middlewareEnhancer = composeWithDevTools(applyMiddleware(thunkMiddleware));

// const composedEnhancer = compose(sayHiOnDispatch, includeMeaningOfLife);

const store = createStore(rootReducer, middlewareEnhancer);

export default store;
