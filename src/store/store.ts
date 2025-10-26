import { configureStore } from '@reduxjs/toolkit';
import authSlice from "./slices/authSlice.ts";
import componentsSlice from "./slices/componentsSlice.ts";
import buildsSlice from "./slices/buildsSlice.ts";

export const store = configureStore({
    reducer: {
        auth: authSlice,
        components: componentsSlice,
        builds: buildsSlice,
    },
});

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch