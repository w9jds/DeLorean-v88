import * as React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import createSagaMiddleware from 'redux-saga';
import { BrowserRouter } from 'react-router-dom';
import { applyMiddleware, createStore, combineReducers } from 'redux';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

import { SiteTheme } from './config/delorean.config';
import { CurrentState, ConfigState, DialogsState, AdminState, SpeakerState } from './models/states';
import current from './ducks/current';
import config from './ducks/config';
import dialogs from './ducks/dialogs';
import speakers from './ducks/speakers';
import admin from './ducks/admin';
import sagas from './sagas/sagas';
import MainLayout from './components/controls/MainLayout';

const sagaMiddleware = createSagaMiddleware();

export interface ApplicationState {
    readonly current: CurrentState;
    readonly config: ConfigState;
    readonly dialogs: DialogsState;
    readonly admin: AdminState;
    readonly speakers: SpeakerState;
}

const store = createStore(
    combineReducers<ApplicationState>({
        current,
        config,
        dialogs,
        admin,
        speakers
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

render(
    <MuiThemeProvider theme={theme}>
        <Provider store={store}>
            <BrowserRouter>
                <MainLayout />
            </BrowserRouter>
        </Provider>
    </MuiThemeProvider>,
    document.getElementById('root')
);
