import '../stylesheets/main.scss';

import * as React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { applyMiddleware, createStore, combineReducers } from 'redux';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

import { SiteTheme } from '../config/delorean.config';

import Home from './components/pages/Home';
import Tickets from './components/pages/Tickets';
import Footer from './components/controls/Footer';
import Header from './components/controls/Header';
import Speakers from './components/pages/Speakers';
import Schedule from './components/pages/Schedule';
import SiteConfig from './components/dialogs/SiteConfig';

import { CurrentState, ConfigState } from './models/states';
import createSagaMiddleware from 'redux-saga';
import current from './ducks/current';
import config from './ducks/config';
import sagas from './sagas/sagas';

const sagaMiddleware = createSagaMiddleware();

export interface ApplicationState {
    readonly current: CurrentState;
    readonly config: ConfigState;
}

const store = createStore(
    combineReducers<ApplicationState>({
        current,
        config
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
    <Provider store={store}>
        <MuiThemeProvider theme={theme}>  
            <BrowserRouter>
                <div className="app-frame">
                    <Header />
                    <SiteConfig />

                    <Switch>
                        <Route exact path="/" component={Home} />
                        <Route exact path="/speakers" component={Speakers} />
                        <Route exact path="/schedule" component={Schedule} />
                        <Route exact path="/buy-tickets" component={Tickets} />
                    </Switch>

                </div>
            </BrowserRouter>
        </MuiThemeProvider>
    </Provider>,
    document.getElementById('root')
);
