import {
  createSlice,
  createEntityAdapter,
  PayloadAction,
  EntityId,
} from '@reduxjs/toolkit';
import { loadList } from '../../../utils/loaders';
import { List, ListItem, ListItemImageChanges } from '../../../types';
import { setFormVisiblity } from '../listSlice';

let originalIdsOrder: Array<EntityId> = [];

const itemsAdapter = createEntityAdapter({
  selectId: (item: ListItem) => item.title,
});

const removeUnusedTags = (state, id: string): Array<string> => {
  const items = itemsAdapter.getSelectors().selectAll(state);
  const unusedTags: Array<string> = [];
  state.entities[id].tags.forEach((t: string) => {
    if (!items.some((i: ListItem) => i.tags.includes(t) && i.title !== id)) {
      unusedTags.push(t);
      state.allTags.splice(state.allTags.indexOf(t), 1);
    }
  });
  return unusedTags;
};

const handleImageChanges = (
  state,
  payload: { id: string; changes: ListItem }
) => {
  const item = itemsAdapter.getSelectors().selectById(state, payload.id);
  if (!item) return;
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

interface ItemsState {
  allTags: Array<string>;
  searchText: string;
  imagesChanges: ListItemImageChanges;
}

const initialState: ItemsState = {
  allTags: [],
  searchText: '',
  imagesChanges: { new: {}, rename: {}, delete: [] },
};

export const slice = createSlice({
  name: 'items',
  initialState: itemsAdapter.getInitialState(initialState),
  reducers: {
    addItem: (state, action: PayloadAction<ListItem>) => {
      addNewTags(state, action.payload.tags);
      state.imagesChanges.new[action.payload.title] = action.payload.image;
      originalIdsOrder.push(action.payload.title);
      itemsAdapter.addOne(state, action.payload);
    },
    updateItem: (
      state,
      action: PayloadAction<{
        id: string;
        changes: ListItem;
        tags?: Array<string>;
      }>
    ) => {
      const { id, changes } = action.payload;
      const unused = removeUnusedTags(state, id).filter(
        (t: string) => !changes.tags.includes(t)
      );
      addNewTags(state, changes.tags);
      handleImageChanges(state, action.payload);
      if (id !== changes.title) originalIdsOrder[originalIdsOrder.indexOf(id)] = changes.title;
      itemsAdapter.updateOne(state, action.payload);
      action.payload.tags = [...unused];
    },
    removeItem: (state, action: PayloadAction<string>) => {
      removeUnusedTags(state, action.payload);
      originalIdsOrder = originalIdsOrder.filter((id) => id !== action.payload);
      itemsAdapter.removeOne(state, action.payload);
    },
    searchItem: (state, action: PayloadAction<string>) => {
      state.searchText = action.payload;
    },
    orderItemsAsc: (state) => {
      state.ids.sort((a, b) => a > b ? 1 : -1);
    },
    orderItemsDesc: (state) => {
      state.ids.sort((a, b) => a < b ? 1 : -1);
    },
    orderItemsRevert: (state) => {
      state.ids = Array.from(originalIdsOrder);
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(
        loadList.fulfilled,
        (state, action: PayloadAction<{ document: List | null }>) => {
          state.allTags = [];
          state.imagesChanges = { new: {}, rename: {}, delete: []};
          state.searchText = '';
          if (action.payload.document?.hasOwnProperty('items')) {
            itemsAdapter.setAll(state, action.payload.document.items);
            state.allTags = [...action.payload.document.allTags];
            originalIdsOrder = Array.from(state.ids);
          } else {
            originalIdsOrder = [];
            itemsAdapter.removeAll(state);
          }
        }
      )
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
  orderItemsAsc,
  orderItemsDesc,
  orderItemsRevert
} = slice.actions;

export default slice.reducer;

export const {
  selectAll: selectAllItems,
  selectById,
  selectIds,
} = itemsAdapter.getSelectors((state) => state.list.items);

export const getAllTags = (state) => state.list.items.allTags;
export const getImagesChanges = (state) => state.list.items.imagesChanges;
