import React, { useEffect } from 'react';
import { ipcRenderer } from 'electron';
import { useDispatch, useSelector } from 'react-redux';
import {
  toggleIsEditing,
  getDocumentType,
  toggleMenu,
} from '../features/general/generalSlice';
import PageIndex from './Index/PageIndex';
import Header from './Header';
import PageList from '../features/list/PageList';
import { loadList, loadDocuments } from '../utils/loaders';
import Spinner from './Spinner';
import PageArticle from '../features/article/PageArticle';

export default function PageController() {
  const dispatch = useDispatch();
  const documentType = useSelector(getDocumentType);

  useEffect(() => {
    console.log('dispatching');
    dispatch(loadDocuments());
  });

  const handleEditSaveClick = (type: string) => {
    if (type === 'save' || type === 'edit') dispatch(toggleIsEditing());
  };

  const handleMenuClick = () => dispatch(toggleMenu());

  ipcRenderer.on('new-list', () => dispatch(loadList('')));

  ipcRenderer.on('open-list', (_event, title) => dispatch(loadList(title)));

  let page = null;
  switch (documentType) {
    case 'index':
      page = <PageIndex />;
      break;
    case 'list':
      page = <PageList />;
      break;
    case 'article':
      page = <PageArticle />
      break;
    default:
      page = <Spinner />;
      break;
  }

  return (
    <div className="flex flex-col min-h-full">
      <Header
        showESButtons={documentType !== 'index' && documentType !== 'loading'}
        // showMenuButton={documentType === 'article' || documentType === 'list'}
        showMenuButton={documentType === 'article'}
        onESButtonClick={handleEditSaveClick}
        onMenuButtonClick={handleMenuClick}
      />
      {page}
    </div>
  );
}
