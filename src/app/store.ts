
import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; 
import { combineReducers } from 'redux';

import authReducer from '../features/auth/authSlice';
import quizReducer from '../features/quiz/quizSlice';
import { authApi } from '../api/authApi';
import { quizApi } from '../api/quizApi';
import { userApi } from '../api/userApi';
import { quizSessionApi } from '../api/quizSessionApi';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth'], 
};

const rootReducer = combineReducers({
  auth: authReducer,
  quiz: quizReducer,
  [authApi.reducerPath]: authApi.reducer,
  [quizApi.reducerPath]: quizApi.reducer,
  [userApi.reducerPath]: userApi.reducer,
  [quizSessionApi.reducerPath]: quizSessionApi.reducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }).concat(
      authApi.middleware,
      quizApi.middleware,
      userApi.middleware,
      quizSessionApi.middleware
    ),
});

setupListeners(store.dispatch);

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
