import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import createSagaMiddleware from 'redux-saga';
import { BrowserRouter } from 'react-router-dom';

import { SiteTheme } from './config/delorean.config';

import { ThemeProvider, createTheme } from '@mui/material/styles';

import sagas from 'store/sagas';
import current from 'store/current/reducer';
import config from 'store/config/reducer';
import dialogs from 'store/dialogs/reducer';
import admin from 'store/admin/reducer';
import sessions from 'store/sessions/reducer';
import speakers from 'store/speakers/reducer';

import MainLayout from 'components/MainLayout';
import { listenerMiddleware } from 'store/middleware';
import { configureStore } from '@reduxjs/toolkit';

const sagaMiddleware = createSagaMiddleware();
const middleware = [
  listenerMiddleware.middleware,
  sagaMiddleware,
];

const store = configureStore({
  reducer: {
    admin: admin.reducer,
    config: config.reducer,
    dialogs: dialogs.reducer,
    current: current.reducer,
    sessions: sessions.reducer,
    speakers: speakers.reducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false
    }).concat(middleware),
})

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: SiteTheme.Primary,
    },
    secondary: {
      main: SiteTheme.Secondary,
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        colorPrimary: {
          backgroundColor: SiteTheme.AppBar.Primary,
          color: SiteTheme.AppBar.Color,
        },
        root: {
          boxShadow: 'none',
        }
      },
    }
  },
  typography: {
    htmlFontSize: 16,
  },
})

sagaMiddleware.run(sagas);

createRoot(document.getElementById('root'))
  .render(
    <ThemeProvider theme={theme}>
      <Provider store={store}>
        <BrowserRouter>
          <MainLayout />
        </BrowserRouter>
      </Provider>
    </ThemeProvider>
  );
