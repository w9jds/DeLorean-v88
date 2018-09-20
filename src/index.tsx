import '../stylesheets/main.scss';

import * as React from 'react';
import {render} from 'react-dom';
import {Provider} from 'react-redux';
import {applyMiddleware, createStore, combineReducers} from 'redux';
import {BrowserRouter, Route} from 'react-router-dom';
import {MuiThemeProvider, createMuiTheme} from '@material-ui/core/styles';
import * as colors from '@material-ui/core/colors';

import Home from './components/pages/Home';
import AppBar from './components/controls/AppBar';
import Speakers from './components/pages/Speakers';
import Sessions from './components/pages/Sessions';
import Sponsors from './components/pages/Sponsors';

import createSagaMiddleware from 'redux-saga';
import current from './ducks/current';
import sagas from './sagas/sagas';

const sagaMiddleware = createSagaMiddleware();

const store = createStore(
    combineReducers({
        current
    }), applyMiddleware(sagaMiddleware)
);

const defaultTheme = createMuiTheme();
const theme = createMuiTheme({
    palette: {
        type: 'dark',
        primary: {
            light: colors.blue[300],
            main: colors.blue[500],
            dark: colors.blue[700],
            contrastText: defaultTheme.palette.getContrastText(colors.blue[500]),
        }
    },
    typography: {
        htmlFontSize: 10,
    }
});

sagaMiddleware.run(sagas);

render(
    <Provider store={store}>
        <MuiThemeProvider theme={theme}>
            <BrowserRouter>
                <div className="app-frame">
                    <AppBar />
                    <Route exact path="/home" component={Home} />
                    <Route path="/speakers" component={Speakers} />
                    <Route path="/sessions" component={Sessions} />
                    <Route path="/sponsors" component={Sponsors} />
                </div>
            </BrowserRouter>
        </MuiThemeProvider>
    </Provider>,
    document.getElementById('root')
);
