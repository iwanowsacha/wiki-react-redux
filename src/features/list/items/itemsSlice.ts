import { createSlice, createEntityAdapter } from '@reduxjs/toolkit';
import loadList from '../../../store/loaders';
import { ListItemImageChanges } from '../../../types';
import { setFormVisiblity } from '../listSlice';

const itemsAdapter = createEntityAdapter({
  selectId: (item: any) => item.title,
});

const removeUnusedTags = (state, id: string): Array<string> => {
  const items = itemsAdapter.getSelectors().selectAll(state);
  const unusedTags: Array<string> = [];
  state.entities[id].tags.forEach((t: string) => {
    if (!items.some((i: any) => i.tags.includes(t) && i.title !== id)) {
      unusedTags.push(t);
      state.allTags.splice(state.allTags.indexOf(t), 1);
    }
  });
  return unusedTags;
};

const handleImageChanges = (state, payload) => {
  const item = itemsAdapter.getSelectors().selectById(state, payload.id);
  if (item.image !== payload.changes.image) {
    delete state.imagesChanges.rename[payload.id];
    if (!state.imagesChanges.new.hasOwnProperty(payload.id)) {
      state.imagesChanges.delete.push(item.image);
    }
    delete state.imagesChanges.new[payload.id];
    state.imagesChanges.new[payload.changes.title] = payload.changes.image;
  } else if (
    item.title !== payload.changes.title &&
    item.image === payload.changes.image
  ) {
    if (state.imagesChanges.new.hasOwnProperty(payload.id)) {
      delete state.imagesChanges.new[payload.id];
      state.imagesChanges.new[payload.changes.title] = payload.changes.image;
    } else {
      delete state.imagesChanges.rename[payload.id];
      state.imagesChanges.rename[payload.changes.title] = payload.changes.image;
    }
  }
  if (item.image === payload.changes.image) payload.changes.image = item.image;
};

const addNewTags = (state, tags: Array<string>) => {
  tags.forEach((t: string) => {
    if (!state.allTags.includes(t)) state.allTags.push(t);
  });
};

interface InitialState {
  allTags: Array<string>;
  searchText: string;
  imagesChanges: ListItemImageChanges;
}

const initialState: InitialState = {
  allTags: [],
  searchText: '',
  imagesChanges: { new: {}, rename: {}, delete: [] },
};

export const slice = createSlice({
  name: 'items',
  initialState: itemsAdapter.getInitialState(initialState),
  reducers: {
    addItem: (state, action) => {
      addNewTags(state, action.payload.tags);
      state.imagesChanges.new[action.payload.title] = action.payload.image;
      itemsAdapter.addOne(state, action.payload);
    },
    updateItem: (state, action) => {
      const unused = removeUnusedTags(state, action.payload.id).filter(
        (t: string) => !action.payload.changes.tags.includes(t)
      );
      addNewTags(state, action.payload.changes.tags);
      handleImageChanges(state, action.payload);
      itemsAdapter.updateOne(state, action.payload);

      action.payload = { tags: [...unused] };
    },
    removeItem: (state, action) => {
      removeUnusedTags(state, action.payload);
      itemsAdapter.removeOne(state, action.payload);
    },
    searchItem: (state, action) => {
      state.searchText = action.payload;
    },
    upsertMany: itemsAdapter.upsertMany,
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadList.fulfilled, (state, action) => {
        if (action.payload.document.hasOwnProperty('items')) {
          itemsAdapter.upsertMany(state, action.payload.document.items);
          state.allTags = [...action.payload.document.allTags];
        }
      })
      .addCase(setFormVisiblity, (state) => {
        state.searchText = '';
      });
  },
});

export const {
  searchItem,
  addItem,
  updateItem,
  removeItem,
  upsertMany,
} = slice.actions;

export default slice.reducer;

export const {
  selectAll: selectAllItems,
  selectById,
  selectIds,
} = itemsAdapter.getSelectors((state) => state.list.items);

export const getAllTags = (state) => state.list.items.allTags;
export const getImagesChanges = (state) => state.list.items.imagesChanges;
