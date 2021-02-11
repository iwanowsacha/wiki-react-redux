import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { List } from '../../types';
import loadList, { resetState } from '../../utils/loaders';

interface ListState {
  title: string;
  isFormVisible: boolean;
  selectedBrowseImage: string;
}

const initialState: ListState = {
  title: '',
  isFormVisible: false,
  selectedBrowseImage: '',
};

export const slice = createSlice({
  name: 'list',
  initialState,
  reducers: {
    setFormVisiblity: (state, action: PayloadAction<boolean>) => {
      state.isFormVisible = action.payload;
      state.selectedBrowseImage = '';
    },
    setBrowseImage: (state, action: PayloadAction<string>) => {
      state.selectedBrowseImage = action.payload;
    },
    setListTitle: (state, action: PayloadAction<string>) => {
      state.title = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(
      loadList.fulfilled,
      (state, action: PayloadAction<{ document: List | null }>) => {
        state.isFormVisible = false;
        state.selectedBrowseImage = '';
        state.title = action.payload.document?.title || '';
      }
    );
  },
});

export const { setFormVisiblity, setBrowseImage, setListTitle } = slice.actions;

export default slice.reducer;

export const getListTitle = (state) => state.list.list.title;
export const getFormVisibility = (state) => state.list.list.isFormVisible;
export const getBrowseImage = (state) => state.list.list.selectedBrowseImage;
