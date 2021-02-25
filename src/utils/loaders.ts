import { createAsyncThunk } from '@reduxjs/toolkit';
import { ipcRenderer } from 'electron';

export const loadDocuments = createAsyncThunk('general/loadDocuments', () => {
  const docs = ipcRenderer.invoke('get-documents');
  return docs;
});

export const loadList = createAsyncThunk('list/loadList', (title: string) => {
  const data = ipcRenderer.invoke('read-list', title);
  return data;
});

export const loadArticle = createAsyncThunk(
  'article/loadArticle',
  (title: string) => {
    const data = ipcRenderer.invoke('read-article', title);
    return data;
  }
);
