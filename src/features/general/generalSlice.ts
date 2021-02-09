import { createSlice } from '@reduxjs/toolkit';
import loadList from '../../store/loaders';
import { DirectoriesList } from '../../types';

type InitialStateType = {
  documents: DirectoriesList;
  isEditing: boolean;
  documentType: string;
  snackbar: Array<string>;
};

const initialState: InitialStateType = {
  documents: {
    articles: [],
    lists: [],
  },
  isEditing: false,
  documentType: 'index',
  snackbar: ['', ''],
};

export const slice = createSlice({
  name: 'general',
  initialState,
  reducers: {
    loadDocuments: (state, action) => {
      Object.assign(state.documents, action.payload);
    },
    toggleIsEditing: (state) => {
      state.isEditing = !state.isEditing;
    },
    setSnackbar: (state, action) => {
      state.snackbar = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loadList.fulfilled, (state, action) => {
      const { document } = action.payload;
      state.documentType = 'list';
      if (!document.hasOwnProperty('title')) state.isEditing = true;
    });
  },
});

export const { loadDocuments, toggleIsEditing, setSnackbar } = slice.actions;

export const getDocuments = (state: any) => state.general.documents;
export const getIsEditing = (state: any) => state.general.isEditing;
export const getDocumentType = (state: any) => state.general.documentType;
export const getSnackbar = (state: any) => state.general.snackbar;

export default slice.reducer;
