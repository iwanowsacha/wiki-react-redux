import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { loadArticle, loadList } from '../../../utils/loaders';
import { setDocumentTypeIndex } from '../../general/generalSlice';
import { setFormVisiblity } from '../listSlice';

interface TagsState {
  selectedTags: Array<string>;
  customHas: Array<string>;
  customNot: Array<string>;
  filterType: string;
}

const initialState: TagsState = {
  selectedTags: [],
  customHas: [],
  customNot: [],
  filterType: 'any',
};

const resetTags = (state) => {
  state.selectedTags = [];
  state.customHas = [];
  state.customNot = [];
};

export const slice = createSlice({
  name: 'tags',
  initialState,
  reducers: {
    addSelectedTag: (state, action: PayloadAction<string>) => {
      state.selectedTags.push(action.payload);
    },
    addManySelectedTags: (state, action: PayloadAction<Array<string>>) => {
      state.selectedTags = [...action.payload];
    },
    removeSelectedTag: (state, action: PayloadAction<string>) => {
      const tag = action.payload;
      state.selectedTags.splice(state.selectedTags.indexOf(tag), 1);
      if (state.filterType === 'custom') {
        let index = state.customHas.indexOf(tag);
        if (index > -1) {
          state.customHas.splice(index, 1);
          return;
        }
        index = state.customNot.indexOf(tag);
        if (index > -1) state.customNot.splice(index, 1);
      }
    },
    resetSelectedTags: resetTags,
    addTagCustomFilter: (
      state,
      action: PayloadAction<{ type: string; tag: string }>
    ) => {
      const { type, tag } = action.payload;
      const otherCustom = type === 'customHas' ? 'customNot' : 'customHas';
      state[type].push(tag);
      const index = state[otherCustom].indexOf(tag);
      if (index > -1) state[otherCustom].splice(index, 1);
      if (!state.selectedTags.includes(tag)) state.selectedTags.push(tag);
    },
    removeTagCustomFilter: (
      state,
      action: PayloadAction<{ type: string; tag: string }>
    ) => {
      const { type, tag } = action.payload;
      const index = state[type].indexOf(tag);
      if (index > -1) state[type].splice(index, 1);
    },
    setFilterType: (state, action: PayloadAction<string>) => {
      state.filterType = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadList.fulfilled, (state) => { resetTags(state); state.filterType = 'any'})
      .addCase(setFormVisiblity, resetTags)
      .addCase(loadArticle.fulfilled, (state) => { resetTags(state); state.filterType = 'any'})
      .addCase(setDocumentTypeIndex, (state) => { resetTags(state); state.filterType = 'any'});
  },
});

export const {
  addSelectedTag,
  addManySelectedTags,
  removeSelectedTag,
  resetSelectedTags,
  setFilterType,
  addTagCustomFilter,
  removeTagCustomFilter,
} = slice.actions;

export default slice.reducer;

export const getSelectedTags = (state) => state.list.tags.selectedTags;
// export const getAllTags = state => state.list.tags.allTags;
export const getFilterType = (state) => state.list.tags.filterType;
export const getCustomTags = (state) => ({
  customNot: state.list.tags.customNot,
  customHas: state.list.tags.customHas,
});
