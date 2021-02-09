import { createSlice, createEntityAdapter } from '@reduxjs/toolkit';
import loadList from '../../../store/loaders';
import { updateItem } from '../items/itemsSlice';

const groupAdapter = createEntityAdapter({
  selectId: (group: any) => group.title,
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
      .addCase(loadList.fulfilled, (state, action) => {
        if (action.payload.document.hasOwnProperty('tagGroups')) {
          groupAdapter.upsertMany(state, action.payload.document.tagGroups);
        }
      })
      .addCase(updateItem, (state, action) => {
        console.log(action.payload.tags);
        const groups = groupAdapter.getSelectors().selectAll(state);
        const removableTags = action.payload.tags;
        const updatableGroups: any = [];
        removableTags.forEach((t: string) => {
          const gr = groups.find((g: any) => g.tags.includes(t));
          updatableGroups.push({
            id: gr.title,
            changes: { tags: [...gr.tags.filter((tg: string) => tg !== t)] },
          });
        });
        groupAdapter.updateMany(state, updatableGroups);
      });
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
