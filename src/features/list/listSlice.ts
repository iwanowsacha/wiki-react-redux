import { createSlice } from '@reduxjs/toolkit';
import loadList from '../../store/loaders';

export const slice = createSlice({
  name: 'list',
  initialState: {
    title: '',
    isFormVisible: false,
    selectedBrowseImage: '',
  },
  reducers: {
    setFormVisiblity: (state, action) => {
      state.isFormVisible = action.payload;
      state.selectedBrowseImage = '';
    },
    setBrowseImage: (state, action) => {
      state.selectedBrowseImage = action.payload;
    },
    setListTitle: (state, action) => {
      state.title = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loadList.fulfilled, (state, action) => {
      state.title = action.payload.document?.title || '';
    });
  },
});

export const { setFormVisiblity, setBrowseImage, setListTitle } = slice.actions;

export default slice.reducer;

export const getListTitle = (state) => state.list.list.title;
export const getFormVisibility = (state) => state.list.list.isFormVisible;
export const getBrowseImage = (state) => state.list.list.selectedBrowseImage;
