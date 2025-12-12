import { createStore, applyMiddleware, compose } from 'redux';
import rootReducer from './reducer';

const middleware = [];

const store = createStore(
  rootReducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(applyMiddleware(...middleware)));

export default store;
