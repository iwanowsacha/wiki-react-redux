import React from 'react';
import { Provider } from 'react-redux';
import store from './store';
import PageController from '../components/PageController';
import '../../assets/tinymce/imports';

export default function App() {
  return (
    <Provider store={store}>
      <PageController />
    </Provider>
  );
}
