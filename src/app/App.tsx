import React from 'react';
import { Provider } from 'react-redux';
import 'tinymce/tinymce';
import 'tinymce/icons/default';
import 'tinymce/themes/silver';
import 'tinymce/plugins/paste';
import 'tinymce/plugins/link';
import 'tinymce/plugins/image';
import 'tinymce/plugins/table';
import 'tinymce/skins/ui/oxide/skin.min.css';
import 'tinymce/skins/ui/oxide/content.min.css';
import 'tinymce/skins/content/default/content.min.css';
import store from './store';
import PageController from '../components/PageController';

export default function App() {
  return (
    <Provider store={store}>
      <PageController />
    </Provider>
  );
}
