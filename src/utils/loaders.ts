import { createAsyncThunk } from '@reduxjs/toolkit';
import { ipcRenderer } from 'electron';

const loadList = createAsyncThunk('list/loadList', async (title: string) => {
  console.log(title);
  const data = ipcRenderer.invoke('read-list', title);
  return data;
});

export const resetState = createAsyncThunk('resetState', () => { return });

export default loadList;
