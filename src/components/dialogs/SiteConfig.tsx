import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';

import { ApplicationState } from '../..';
import { isConfigDialogOpen } from '../../selectors/config';
import { closeConfigDialog } from '../../ducks/config';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import { StyleRules, withStyles, WithStyles } from '@material-ui/core/styles';

const Transition = (props) => <Slide direction="up" {...props} />;
const stylesheet: StyleRules = {
    appBar: {
        position: 'relative'
    },
    flex: {
        flex: 1,
        textAlign: 'center'
    }
};

type SiteConfigProps = WithStyles<typeof stylesheet> & ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>;
type SiteConfigState = {
    email: string;
}

class SiteConfig extends React.Component<SiteConfigProps, SiteConfigState> {

    constructor(props: SiteConfigProps) {
        super(props);

        this.state = {
            email: 'contact@devfest.io'
        }

    }

    handleClose = this.props.closeConfigDialog;
    
    render() {
        const { classes } = this.props;

        return (
            <Dialog fullScreen open={this.props.open}
                onClose={this.handleClose}
                TransitionComponent={Transition}>
                <AppBar className={classes.appBar}>
                    <Toolbar>
                        <IconButton color="inherit" onClick={this.handleClose} aria-label="Close">
                            <CloseIcon />
                        </IconButton>
                        <Typography variant="title" color="inherit" className={classes.flex}>
                            Site Configuration
                        </Typography>
                        <Button color="inherit" onClick={this.handleClose}>save</Button>
                    </Toolbar>
                </AppBar>

                <div>
                    <FormControl className={classes.formControl}>
                        <InputLabel htmlFor="name-simple">Email</InputLabel>
                        <Input id="name-simple" value={this.state.email} />
                    </FormControl>
                </div>

            </Dialog>
        )
    }

}

const mapStateToProps = (state: ApplicationState) => ({
    open: isConfigDialogOpen(state)
});

const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators({ closeConfigDialog }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(stylesheet)(SiteConfig));