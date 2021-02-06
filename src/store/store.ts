import { configureStore } from "@reduxjs/toolkit";
import rootReducer, {RootState} from './rootReducer';

const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
        immutableCheck: false
    }),
});

export default store;