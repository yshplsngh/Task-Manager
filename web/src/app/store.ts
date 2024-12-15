import { configureStore } from '@reduxjs/toolkit';
import authReducer from './auth/authSlice';
import taskAdapter from './task/taskSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    task:taskAdapter
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
