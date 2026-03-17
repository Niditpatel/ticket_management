import { configureStore } from '@reduxjs/toolkit';
import ticketReducer from './ticketSlice';
import userReducer from './userSlice';

export const store = configureStore({
  reducer: {
    tickets: ticketReducer,
    users: userReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
