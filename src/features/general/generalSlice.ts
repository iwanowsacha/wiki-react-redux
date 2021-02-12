import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import loadList, { resetState } from '../../utils/loaders';
import { DirectoriesList, List } from '../../types';

interface GeneralState {
  documents: DirectoriesList;
  isEditing: boolean;
  documentType: string;
  snackbar: Array<string>;
}

const initialState: GeneralState = {
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
    loadDocuments: (state, action: PayloadAction<DirectoriesList>) => {
      Object.assign(state.documents, action.payload);
    },
    toggleIsEditing: (state) => {
      state.isEditing = !state.isEditing;
    },
    setSnackbar: (state, action: PayloadAction<Array<string>>) => {
      state.snackbar = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(
      loadList.fulfilled,
      (state, action: PayloadAction<{ document: List | null }>) => {
        const { document } = action.payload;
        // state.documentType = 'list';
        !document?.hasOwnProperty('title') ? state.isEditing = true : state.isEditing = false;
      }
    ).addCase(loadList.pending, (state) => {console.log('loading'); state.documentType = 'loading'});
  },
});

export const { loadDocuments, toggleIsEditing, setSnackbar } = slice.actions;

export const getDocuments = (state) => state.general.documents;
export const getIsEditing = (state) => state.general.isEditing;
export const getDocumentType = (state) => state.general.documentType;
export const getSnackbar = (state) => state.general.snackbar;

export default slice.reducer;
