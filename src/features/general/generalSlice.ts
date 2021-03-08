import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { loadList, loadDocuments, loadArticle } from '../../utils/loaders';
import { Article, DirectoriesList, List } from '../../types';

export interface GeneralState {
  documents: DirectoriesList;
  isEditing: boolean;
  isMenuOpen: boolean;
  documentType: string;
  documentTitle: string;
  snackbar: Array<string>;
}

const initialState: GeneralState = {
  documents: {
    articles: [],
    lists: [],
  },
  isEditing: false,
  isMenuOpen: false,
  documentType: 'index',
  documentTitle: '',
  snackbar: ['', ''],
};

export const slice = createSlice({
  name: 'general',
  initialState,
  reducers: {
    toggleIsEditing: (state) => {
      state.isEditing = !state.isEditing;
    },
    toggleMenu: (state) => {
      state.isMenuOpen = !state.isMenuOpen;
    },
    setSnackbar: (state, action: PayloadAction<Array<string>>) => {
      state.snackbar = action.payload;
    },
    setDocumentTypeIndex: (state) => {
      state.documentType = 'index';
      state.documentTitle = '';
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadDocuments.fulfilled, (state, action) => {
        Object.assign(state.documents, action.payload);
      })
      .addCase(loadList.pending, (state) => {
        state.documentType = 'loading';
      })
      .addCase(loadArticle.pending, (state) => { state.documentType = 'loading' })
      .addCase(
        loadArticle.fulfilled,
        (state, action: PayloadAction<{ document: Article | null }>) => {
          const { document } = action.payload;
          state.documentType = 'article';
          state.documentTitle = document?.title || '';
          state.isMenuOpen = false;
          !document?.hasOwnProperty('title')
            ? (state.isEditing = true)
            : (state.isEditing = false);
        }
      )
      .addCase(
        loadList.fulfilled,
        (state, action: PayloadAction<{ document: List | null }>) => {
          const { document } = action.payload;
          state.documentType = 'list';
          state.documentTitle = document?.title || '';
          state.isMenuOpen = true;
          !document?.hasOwnProperty('title')
            ? (state.isEditing = true)
            : (state.isEditing = false);
        }
      )
  },
});

export const { toggleIsEditing, setSnackbar, toggleMenu, setDocumentTypeIndex } = slice.actions;

export const getDocuments = (state) => state.general.documents;
export const getIsEditing = (state) => state.general.isEditing;
export const getDocumentType = (state) => state.general.documentType;
export const getDocumentTitle = (state) => state.general.documentTitle;
export const getSnackbar = (state) => state.general.snackbar;
export const getIsMenuOpen = (state) => state.general.isMenuOpen;

export default slice.reducer;
