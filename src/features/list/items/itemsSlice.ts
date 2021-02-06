import {
    createSlice,
    createEntityAdapter
} from "@reduxjs/toolkit";
import { loadList } from "../../../store/loaders";
import { setFormVisiblity } from "../listSlice";


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
}

const addNewTags = (state, tags: Array<string>) => {
    tags.forEach((t: string) => {
        if (!state.allTags.includes(t)) state.allTags.push(t);
    });
}


const itemsAdapter = createEntityAdapter({
    selectId: (item: any) => item.title,
});

export const slice = createSlice({
    name: "items",
    initialState: itemsAdapter.getInitialState({allTags: [], searchText: ''}),
    reducers: {
        addItem: (state, action) => {
            addNewTags(state, action.payload.tags);
            itemsAdapter.addOne(state, action.payload);
        },
        updateItem: (state, action) => {
            const unused = removeUnusedTags(state, action.payload.id).filter((t: string) => {
                !action.payload.changes.tags.includes(t);
            });
            addNewTags(state, action.payload.changes.tags);
            itemsAdapter.updateOne(state, action.payload);
            action.payload = { tags: [...unused]};
        },
        removeItem: (state, action) => {
            removeUnusedTags(state, action.payload);
            itemsAdapter.removeOne(state, action.payload);
        },
        searchItem: (state, action) => {
            state.searchText = action.payload;
        },
        upsertMany: itemsAdapter.upsertMany
    },
    extraReducers: (builder) => {
        builder.addCase(loadList.fulfilled, (state, action) => {
            if (action.payload.document.hasOwnProperty('items')) {
                itemsAdapter.upsertMany(state, action.payload.document.items);
                state.allTags = [...action.payload.document.allTags];
            }
        }),
        builder.addCase(setFormVisiblity, (state) => {
            state.searchText = '';
        })
    }
})

export const { searchItem, addItem, updateItem, removeItem, upsertMany } = slice.actions;

export default slice.reducer;

export const {
    selectAll: selectAllItems,
    selectById: selectById,
    selectIds: selectIds
} = itemsAdapter.getSelectors(state => state.list.items);

export const getAllTags = state => state.list.items.allTags;