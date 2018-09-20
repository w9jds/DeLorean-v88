import * as React from 'react';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import { StyleRulesCallback } from '@material-ui/core';

const styleSheet: StyleRulesCallback = theme => ({
    root: {
      width: '100%',
    },
    grow: {
      flexGrow: 1,
    },
    menuButton: {
      marginLeft: -12,
      marginRight: 20,
    }
});

type HeaderProps = ReturnType<typeof styleSheet>;

class Header extends React.Component<HeaderProps> {

    constructor(props: HeaderProps) {
        super(props);

    }

    render() {
        const { classes } = this.props;

        return (
            <AppBar position="sticky">
                <Toolbar>

                </Toolbar>
            </AppBar>
        );
    }

}

export default Header;