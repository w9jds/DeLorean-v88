import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import createSagaMiddleware from 'redux-saga';
import { BrowserRouter } from 'react-router-dom';
import { applyMiddleware, createStore, combineReducers } from 'redux';

import { SiteTheme } from './config/delorean.config';
import { ApplicationState } from './models/states';

import { ThemeProvider, createTheme } from '@mui/material/styles';

import sagas from 'store/sagas';
import current from 'store/current/reducer';
import config from 'store/config/reducer';
import dialogs from 'store/dialogs/reducer';
import admin from 'store/admin/reducer';
import sessions from 'store/sessions/reducer';
import speakers from 'store/speakers/reducer';

import MainLayout from 'components/MainLayout';

const middleware = [
  createSagaMiddleware()
];

const store = createStore(
  combineReducers<ApplicationState>({
    current,
    config,
    dialogs,
    admin,
    sessions,
    speakers,
  }),
  applyMiddleware(...middleware)
);

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

middleware[0].run(sagas);

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
