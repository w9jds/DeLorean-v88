import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';

import { ApplicationState } from '../..';
import { isConfigDialogOpen } from '../../selectors/config';
import { closeConfigDialog } from '../../ducks/config';

import makeAsyncScriptLoader from 'react-async-script';
import { MapsConfig } from '../../../config/delorean.config';

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
import FormHelperText from '@material-ui/core/FormHelperText';
import { withStyles, WithStyles, StyleRulesCallback } from '@material-ui/core/styles';

import { getFirestore, getCurrentConfig } from '../../selectors/current';
import Configuration from '../../models/config';

const Transition = (props) => <Slide direction="up" {...props} />;
const stylesheet: StyleRulesCallback = theme => ({
    appBar: {
        position: 'relative'
    },
    dialogForm: {
        display: 'flex',
        flexFlow: 'column',
        padding: '20px'
    },
    formControl: {
        margin: theme.spacing.unit,
        minWidth: '120px',
        width: '30%'
    },
    autoComplete: {
        width: '25rem',
        marginLeft: '0.8rem'
    },
    flex: {
        flex: 1,
        textAlign: 'center'
    }
});

type SiteConfigProps = WithStyles<typeof stylesheet> & ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>;
type SiteConfigState = {
    email: string;
    address: string;
    venueName: string;
    startDate: string;
    endDate: string;
    picture: string;
    multiDay: boolean;
};

class SiteConfig extends React.Component<SiteConfigProps, SiteConfigState> {

    private autocomplete: google.maps.places.Autocomplete;

    constructor(props: SiteConfigProps) {
        super(props);

        this.state = this.buildStateFromProps(props);
    }

    componentDidUpdate(prevProps: SiteConfigProps) {
        let element = document.getElementById('venue-address');

        if (!prevProps.config && this.props.config) {
            this.setState(this.buildStateFromProps(this.props));
        }

        if (google && element && this.props.open && !this.autocomplete) {
            this.autocomplete = new google.maps.places.Autocomplete(element as HTMLInputElement, {
                fields: ['photos', 'geometry', 'formatted_address', 'place_id', 'url']
            });
        }
    }

    buildStateFromProps = (props: SiteConfigProps) => ({
        email: props.config ? props.config.email : '',
        venueName: props.config && props.config.venue ? props.config.venue.name : '',
        address: props.config && props.config.venue ? props.config.venue.address : '',
        startDate: props.config && props.config.date ? props.config.date.startDate : new Date().toISOString(),
        endDate: props.config && props.config.date ? props.config.date.endDate : new Date().toISOString(),
        multiDay: props.config && props.config.date ? props.config.date.multiDay : false,
        picture: props.config && props.config.venue ? props.config.venue.pictureUrl : ''
    })

    save = async () => {
        let update: Configuration;
        let place = this.autocomplete.getPlace();

        if (this.state.address && place) {
            update = {
                email: this.state.email,
                venue: {
                    url: place.url,
                    name: this.state.venueName,
                    pictureUrl: this.state.picture,
                    address: place.formatted_address,
                    placeId: place.place_id,
                    coordinates: {
                        lng: place.geometry.location.lng(),
                        lat: place.geometry.location.lat()
                    }
                }
            };
        }
        else {
            update = {
                email: this.state.email,
                venue: {
                    name: this.state.venueName,
                    pictureUrl: this.state.picture
                }
            };
        }

        this.props.firestore.doc('/config/devfest').set(update, { merge: true });
        this.handleClose();
    }

    handleClose = () => {
        this.props.closeConfigDialog();
        this.autocomplete = null;
    }

    onStartDateChange = date => this.setState({ startDate: date });
    onEndDateChange = date => this.setState({ endDate: date });
    onAddressChange = event => this.setState({ address: event.target.value });
    onNameChange = event => this.setState({ venueName: event.target.value });
    onPictureChange = event => this.setState({ picture: event.target.value });
    
    buildDateSection = () => {
        const { classes } = this.props;

        // if (this.state.multiDay) {
        //     return (
        //         <div>
        //             <FormControl className={classes.formControl}>
        //                 <DatePicker label="Start Date"
        //                     value={this.state.startDate}
        //                     onChange={this.onStartDateChange}
        //                     animateYearScrolling />
        //             </FormControl>
        //             <FormControl className={classes.formControl}>
        //                 <DatePicker label="End Date"
        //                     value={this.state.endDate}
        //                     onChange={this.onEndDateChange}
        //                     animateYearScrolling />
        //             </FormControl>
        //         </div>
        //     )
        // }

        // return (
        //     <FormControl className={classes.formControl}>
        //         <DatePicker label={this.state.multiDay ? 'Start Date' : 'Date'}
        //             value={this.state.startDate}
        //             onChange={this.onStartDateChange}
        //             animateYearScrolling />
        //     </FormControl>
        // );
    }

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
                        <Button color="inherit" onClick={this.save}>save</Button>
                    </Toolbar>
                </AppBar>

                <div className={classes.dialogForm}>
                    {this.buildDateSection()}
                    <FormControl className={classes.formControl}>
                        <InputLabel htmlFor="contact-email">Email</InputLabel>
                        <Input id="contact-email" value={this.state.email} />
                        <FormHelperText>Displayed in footer</FormHelperText>
                    </FormControl>
                    <FormControl className={classes.formControl}>
                        <InputLabel htmlFor="venue-name">Venue Name</InputLabel>
                        <Input id="venue-name" value={this.state.venueName} onChange={this.onNameChange} />
                        <FormHelperText>Displayed in intro (top of home page)</FormHelperText>
                    </FormControl>
                    <FormControl className={classes.formControl}>
                        <InputLabel htmlFor="venue-picture">Venue Picture</InputLabel>
                        <Input id="venue-picture" value={this.state.picture} onChange={this.onPictureChange} />
                        <FormHelperText>Displays in card on venue map</FormHelperText>
                    </FormControl>
                    <FormControl className={classes.formControl}>
                        <InputLabel htmlFor="venue-address">Venue Address</InputLabel>
                        <Input id="venue-address" value={this.state.address} onChange={this.onAddressChange} />
                        <FormHelperText>Used to build static Google Map</FormHelperText>
                    </FormControl>
                </div>
            </Dialog>
        );
    }

}

const mapStateToProps = (state: ApplicationState) => ({
    open: isConfigDialogOpen(state),
    firestore: getFirestore(state),
    config: getCurrentConfig(state)
});

const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators({ closeConfigDialog }, dispatch);

const ConfigDialog = connect(mapStateToProps, mapDispatchToProps)(withStyles(stylesheet)(SiteConfig));

export default makeAsyncScriptLoader(`https://maps.googleapis.com/maps/api/js?key=${MapsConfig.apiKey}&libraries=places`, { 
    globalName: 'google' 
})(ConfigDialog);