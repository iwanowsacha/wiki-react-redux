import { combineReducers } from "@reduxjs/toolkit";
import generalReducer from "../features/general/generalSlice";
import listReducer from "../features/list/listSlice";
import listItemReducer from "../features/list/items/itemsSlice";
import tagGroupReducer from "../features/list/groups/groupsSlice";
import tagReducer from "../features/list/tags/tagsSlice";
import { enableMapSet } from 'immer'

enableMapSet();

const listsReducer = combineReducers({
    list: listReducer,
    items: listItemReducer,
    groups: tagGroupReducer,
    tags: tagReducer
})

const rootReducer = combineReducers({
    general: generalReducer,
    list: listsReducer,
});

export type RootState = ReturnType<typeof rootReducer>

export default rootReducer;