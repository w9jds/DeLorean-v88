import * as React from 'react';
import { Link } from 'react-router-dom';
import { StyleRulesCallback } from '@material-ui/core';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';

const styleSheet: StyleRulesCallback = theme => ({ });

type HeaderProps = ReturnType<typeof styleSheet>;

class Header extends React.Component<HeaderProps> {

    constructor(props: HeaderProps) {
        super(props);

    }

    buildLoginItems = () => {
        return (
            <Button>Sign In</Button>
        )
    }

    render() {
        const { classes } = this.props;

        return (
            <AppBar position="sticky" className="header">
                <Toolbar className="inner container">
                    <div className="logo">
                        <Link to="/">
                            <img src="https://gdg-logo-generator.appspot.com/gdg_icon.svg"/>
                        </Link>
                    </div>

                    <nav className="nav">
                        <div>
                            <Link to="/schedule">Schedule</Link>
                        </div>
                        <div>
                            <Link to="/speakers">Speakers</Link>
                        </div>
                        <div>
                            <a>FAQ</a>
                        </div>
                    </nav>

                    <div className="login">
                        {this.buildLoginItems()}
                    </div>
                </Toolbar>
            </AppBar>
        );
    }

}

export default Header;