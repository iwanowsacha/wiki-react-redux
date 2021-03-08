import React, { useEffect } from 'react';
import { ipcRenderer } from 'electron';
import { useDispatch, useSelector } from 'react-redux';
import {
  toggleIsEditing,
  getDocumentType,
  toggleMenu,
  getDocumentTitle,
  setDocumentTypeIndex,
} from '../features/general/generalSlice';
import PageIndex from './Index/PageIndex';
import Header from './Header';
import PageList from '../features/list/PageList';
import { loadList, loadDocuments, loadArticle } from '../utils/loaders';
import Spinner from './Spinner';
import PageArticle from '../features/article/PageArticle';

export default function PageController() {
  const dispatch = useDispatch();
  const documentType = useSelector(getDocumentType);
  const documentTitle = useSelector(getDocumentTitle);

  useEffect(() => {
    dispatch(loadDocuments());
  });

  const handleEditSaveClick = (type: string) => {
    if (type === 'save' || type === 'edit') dispatch(toggleIsEditing());
  };

  const handleDeleteClick = () => {
    if (!documentTitle) return;
    ipcRenderer.invoke('delete-document', documentTitle, documentType);
  }

  const handleMenuClick = () => dispatch(toggleMenu());

  ipcRenderer?.on('new-list', () => {
    dispatch(loadList(''));
  });

  ipcRenderer?.on('new-article', () => {
    dispatch(loadArticle(''));
  });

  ipcRenderer?.on('open-list', (_event, title) => {
    dispatch(loadList(title));
  });

  ipcRenderer?.on('open-article', (_event, title) => {
    dispatch(loadArticle(title));
  });

  ipcRenderer?.on('open-index', () => dispatch(setDocumentTypeIndex()));

  let page = null;
  switch (documentType) {
    case 'index':
      page = <PageIndex />;
      break;
    case 'list':
      page = <PageList />;
      break;
    case 'article':
      page = <PageArticle />;
      break;
    default:
      page = <Spinner />;
      break;
  }

  return (
    <div className="flex flex-col min-h-full">
      <Header
        showESButtons={documentType !== 'index' && documentType !== 'loading'}
        showMenuButton={documentType === 'article' || documentType === 'list'}
        onESButtonClick={handleEditSaveClick}
        onDeleteButtonClick={handleDeleteClick}
        onMenuButtonClick={handleMenuClick}
      />
      {page}
    </div>
  );
}
