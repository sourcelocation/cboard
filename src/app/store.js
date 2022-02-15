import { configureStore } from '@reduxjs/toolkit';
import scheduleInfoSlice from '../features/editor/schedule/scheduleInfoSlice';
import { apiSlice } from '../features/api/apiSlice'

const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    scheduleInfo: scheduleInfoSlice,
  },
  middleware: (getDefaultMiddleware) => [
    ...getDefaultMiddleware(),
    apiSlice.middleware
  ]
});

export { store };