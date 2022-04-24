import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { store } from './app/store';
import { Provider } from 'react-redux';
import * as serviceWorker from './serviceWorker';
// import "typeface-roboto";

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// store.dispatch(set({lesson: { name:'Maths', grade: '8'},i:{day:0,class:1,lesson:2}}))
// store.dispatch(set({lesson: { name:'English', grade: '8'},i:{day:0,class:1,lesson:3}}))
// store.dispatch(move({iFrom:{day:0,class:1,lesson:2}, iTo:{day:0,class:1,lesson:3}}))


// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA