import * as React from 'react';
import { hydrate } from 'react-dom';
import { Provider } from 'react-redux';
import createSagaMiddleware from 'redux-saga';
import { BrowserRouter } from 'react-router-dom';
import { applyMiddleware, createStore, combineReducers, DeepPartial } from 'redux';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

import { SiteTheme } from './config/delorean.config';
import { ApplicationState } from '../models/states';
import current from './ducks/current';
import config from './ducks/config';
import dialogs from './ducks/dialogs';
import speakers from './ducks/speaker';
import sessions from './ducks/session';
import admin from './ducks/admin';
import sagas from './sagas/sagas';
import MainLayout from './components/controls/MainLayout';

const sagaMiddleware = createSagaMiddleware();

declare global {
    interface Window {
        __PRELOADED_STATE__: DeepPartial<ApplicationState>;
    }
}

// Grab the state from a global variable injected into the server-generated HTML
// const preloadedState = window.__PRELOADED_STATE__;

// Allow the passed state to be garbage-collected
// delete window.__PRELOADED_STATE__;

const store = createStore(
    combineReducers<ApplicationState>({
        current,
        config,
        dialogs,
        admin,
        speakers,
        sessions
    }), applyMiddleware(sagaMiddleware)
);

const theme = createMuiTheme({
    palette: {
        type: 'dark',
        primary: {
            main: SiteTheme.Primary,
        },
        secondary: {
            main: SiteTheme.Secondary
        }
    },
    typography: {
        htmlFontSize: 16,
        useNextVariants: true
    },
    overrides: {
        MuiAppBar: {
            colorPrimary: {
                backgroundColor: SiteTheme.AppBar.Primary,
                color: SiteTheme.AppBar.Color
            },
            root: {
                boxShadow: 'none'
            }
        }
    }
});

sagaMiddleware.run(sagas);

hydrate(
    <MuiThemeProvider theme={theme}>
        <Provider store={store}>
            <BrowserRouter>
                <MainLayout />
            </BrowserRouter>
        </Provider>
    </MuiThemeProvider>,
    document.getElementById('root')
);
