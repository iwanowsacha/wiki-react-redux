import {
  createSlice,
  createEntityAdapter,
  PayloadAction,
  Update,
} from '@reduxjs/toolkit';
import { group } from 'console';
import { List, ListItem, TagGroup } from '../../../types';
import loadList from '../../../utils/loaders';
import { updateItem } from '../items/itemsSlice';

const groupAdapter = createEntityAdapter({
  selectId: (group: TagGroup) => group.title,
});

export const slice = createSlice({
  name: 'groups',
  initialState: groupAdapter.getInitialState(),
  reducers: {
    updateGroup: groupAdapter.updateOne,
    updateManyGroups: groupAdapter.updateMany,
    addGroup: groupAdapter.addOne,
    removeGroup: groupAdapter.removeOne,
  },
  extraReducers: (builder) => {
    builder
      .addCase(
        loadList.fulfilled,
        (state, action: PayloadAction<{ document: List | null }>) => {
          if (action.payload.document?.hasOwnProperty('tagGroups')) {
            groupAdapter.setAll(state, action.payload.document.tagGroups);
          }
        }
      )
      .addCase(
        updateItem,
        (
          state,
          action: PayloadAction<{
            id: string;
            changes: ListItem;
            tags?: Array<string>;
          }>
        ) => {
          const groups = groupAdapter.getSelectors().selectAll(state);
          const removableTags = action.payload.tags;
          const updatableGroups: Array<Update<TagGroup>> = [];
          removableTags?.forEach((t: string) => {
            const gr = groups.find((g: TagGroup) => g.tags.includes(t));
            if (gr) {
              updatableGroups.push({
                id: gr.title,
                changes: {
                  tags: [...gr.tags.filter((tg: string) => tg !== t)],
                },
              });
            }
          });
          groupAdapter.updateMany(state, updatableGroups);
        }
      );
  },
});

export const {
  updateGroup,
  updateManyGroups,
  addGroup,
  removeGroup,
} = slice.actions;

export default slice.reducer;

export const {
  selectAll: selectAllGroups,
  selectTotal: selectTotalGroups,
} = groupAdapter.getSelectors((state) => state.list.groups);
