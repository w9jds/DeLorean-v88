import '../stylesheets/main.scss';

import * as React from 'react';
import {render} from 'react-dom';
import {Provider} from 'react-redux';
import {applyMiddleware, createStore, combineReducers} from 'redux';
import {BrowserRouter, Route} from 'react-router-dom';
import {MuiThemeProvider, createMuiTheme} from '@material-ui/core/styles';
import * as colors from '@material-ui/core/colors';

import Home from './components/pages/Home';
import Header from './components/controls/Header';
import Speakers from './components/pages/Speakers';
import Schedule from './components/pages/Schedule';
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

const theme = createMuiTheme({
    palette: {
        type: 'dark',
        primary: {
            main: '#13191e',
        },
        secondary: colors.lightBlue,
    },
    typography: {
        htmlFontSize: 10,
    },
    overrides: {
        MuiAppBar: {
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
                    <Route exact path="/" component={Home} />
                    <Route path="/speakers" component={Speakers} />
                    <Route path="/schedule" component={Schedule} />
                </div>
            </BrowserRouter>
        </MuiThemeProvider>
    </Provider>,
    document.getElementById('root')
);
