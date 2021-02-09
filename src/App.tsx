import React from 'react';
import { Provider } from 'react-redux';
import store from './store/store';
import PageController from './components/PageController';

export default function App() {
  return (
    <Provider store={store}>
      <PageController />
    </Provider>
  );
}
