import { createStore, applyMiddleware, compose } from "redux"
import thunk from "redux-thunk"
import { composeWithDevTools } from "redux-devtools-extension";
import { createWrapper } from "next-redux-wrapper"
import rootReducer from "./reducers/rootReducer"

const middleware = [thunk] 

// initial states here
const initalState = {};

export const store = createStore(
    rootReducer,
    initalState,
    composeWithDevTools(applyMiddleware(...middleware))
);

// assigning store to next wrapper
const makeStore = () => store;

export const wrapper = createWrapper(makeStore)