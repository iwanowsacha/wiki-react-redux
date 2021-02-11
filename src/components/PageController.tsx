import React, { useEffect } from 'react';
import { ipcRenderer } from 'electron';
import { useDispatch, useSelector } from 'react-redux';
import {
  loadDocuments,
  toggleIsEditing,
  getDocumentType,
} from '../features/general/generalSlice';
import PageIndex from './Index/PageIndex';
import Header from './Header';
import PageList from '../features/list/PageList';
import loadList from '../utils/loaders';

export default function PageController() {
  const dispatch = useDispatch();
  const documentType = useSelector(getDocumentType);

  useEffect(() => {
    ipcRenderer
      .invoke('documents')
      .then((result) => {
        dispatch(loadDocuments(result));
        return true;
      })
      .catch(console.log);
  });

  const handleEditSaveClick = (type: string) => {
    if (type === 'save' || type === 'edit') dispatch(toggleIsEditing());
  };

  ipcRenderer.on('new-list', () => {
    dispatch(loadList(''));
  });

  ipcRenderer.on('open-list-link', (_event, title) => {
    dispatch(loadList(title));
  })

  let page = null;
  switch (documentType) {
    case 'index':
      page = <PageIndex />;
      break;
    case 'list':
      page = <PageList />;
      break;
    default:
      page = <div>Not found</div>;
      break;
  }

  return (
    <div className="flex flex-col min-h-full">
      <Header
        showESButtons
        showMenuButton
        onHeaderButtonClick={handleEditSaveClick}
      />
      {page}
    </div>
  );
}
