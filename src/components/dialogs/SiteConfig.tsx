import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';

import firebase from '@firebase/app';
import '@firebase/firestore';

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

import MuiPickersUtilsProvider from 'material-ui-pickers/utils/MuiPickersUtilsProvider';
import DateFnsUtils from 'material-ui-pickers/utils/date-fns-utils';
import DatePicker from 'material-ui-pickers/DatePicker';

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
type SiteConfigState = Record<string, any>;

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

    buildStateFromProps = (props: SiteConfigProps) => {
        const { config } = props;

        return  {
            name: config && config.org ? config.org.name : '',
            email: config && config.org ? config.org.email : '',
            twitter: config && config.org ? config.org.twitter : '',
            facebook: config && config.org ? config.org.facebook : '',
            meetup: config && config.org ? config.org.meetup : '',
            github: config && config.org ? config.org.github : '',
            venueName: config && config.venue ? config.venue.name : '',
            address: config && config.venue ? config.venue.address : '',
            picture: config && config.venue ? config.venue.pictureUrl : '',
            papercall: config && config.event && config.event.papercall ? config.event.papercall.url : '',
            speakerClose: config && config.event && config.event.papercall ? config.event.papercall.closing.toDate() : new Date()
        };
    }

    save = async () => {
        const remove = firebase.firestore.FieldValue.delete();
        let update: Configuration = {
            org: {
                name: this.state.name || remove,
                email: this.state.email || remove,
                facebook: this.state.facebook || remove,
                twitter: this.state.twitter || remove,
                meetup: this.state.meetup || remove,
                github: this.state.github || remove
            },
            venue: {
                name: this.state.venueName || remove,
                pictureUrl: this.state.picture || remove
            },
            event: {
                papercall: {
                    url: this.state.papercall || remove,
                    closing: this.state.speakerClose || remove
                }
            }
        };

        let place = this.autocomplete ? this.autocomplete.getPlace() : null;
        if (this.state.address && place) {
            update.venue = {
                url: place.url,
                name: this.state.venueName || remove,
                pictureUrl: this.state.picture || remove,
                address: place.formatted_address,
                placeId: place.place_id,
                coordinates: {
                    lng: place.geometry.location.lng(),
                    lat: place.geometry.location.lat()
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

    onSpeakerCloseDateChange = date => this.setState({
        speakerClose: date
    })

    onSettingChange = (e, name: string) => this.setState({
        [name]: e.target.value
    })

    render() {
        const { classes } = this.props;

        return (
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <Dialog fullScreen open={this.props.open}
                    onClose={this.handleClose}
                    TransitionComponent={Transition}>
                    <AppBar className={classes.appBar}>
                        <Toolbar>
                            <IconButton color="inherit" onClick={this.handleClose} aria-label="Close">
                                <CloseIcon />
                            </IconButton>
                            <Typography variant="h6" color="inherit" className={classes.flex}>
                                Site Configuration
                            </Typography>
                            <Button color="inherit" onClick={this.save}>save</Button>
                        </Toolbar>
                    </AppBar>

                    <div className={classes.dialogForm}>

                        <div>
                            <FormControl className={classes.formControl}>
                                <InputLabel htmlFor="name">Name</InputLabel>
                                <Input id="name" value={this.state.name} onChange={e => this.onSettingChange(e, 'name')} />
                            </FormControl>
                            <FormControl className={classes.formControl}>
                                <InputLabel htmlFor="contact-email">Email</InputLabel>
                                <Input id="contact-email" value={this.state.email} onChange={e => this.onSettingChange(e, 'email')} />
                            </FormControl>
                            <FormControl className={classes.formControl}>
                                <InputLabel htmlFor="twitter">Twitter Handle</InputLabel>
                                <Input id="twitter" value={this.state.twitter} onChange={e => this.onSettingChange(e, 'twitter')} />
                            </FormControl>
                            <FormControl className={classes.formControl}>
                                <InputLabel htmlFor="meetup">Meetup Handle</InputLabel>
                                <Input id="meetup" value={this.state.meetup} onChange={e => this.onSettingChange(e, 'meetup')} />
                            </FormControl>
                            <FormControl className={classes.formControl}>
                                <InputLabel htmlFor="facebook">Facebook Handle</InputLabel>
                                <Input id="facebook" value={this.state.facebook} onChange={e => this.onSettingChange(e, 'facebook')} />
                            </FormControl>
                            <FormControl className={classes.formControl}>
                                <InputLabel htmlFor="github">Github Handle</InputLabel>
                                <Input id="github" value={this.state.github} onChange={e => this.onSettingChange(e, 'github')} />
                            </FormControl>
                        </div>

                        <div>
                            <FormControl className={classes.formControl}>
                                <InputLabel htmlFor="venue-name">Venue Name</InputLabel>
                                <Input id="venue-name" value={this.state.venueName} onChange={e => this.onSettingChange(e, 'venueName')} />
                                <FormHelperText>Displayed in intro (top of home page)</FormHelperText>
                            </FormControl>
                            <FormControl className={classes.formControl}>
                                <InputLabel htmlFor="venue-picture">Venue Picture</InputLabel>
                                <Input id="venue-picture" value={this.state.picture} onChange={e => this.onSettingChange(e, 'picture')} />
                                <FormHelperText>Displays in card on venue map</FormHelperText>
                            </FormControl>
                            <FormControl className={classes.formControl}>
                                <InputLabel htmlFor="venue-address">Venue Address</InputLabel>
                                <Input id="venue-address" value={this.state.address} onChange={e => this.onSettingChange(e, 'address')} />
                                <FormHelperText>Used to build static Google Map</FormHelperText>
                            </FormControl>
                        </div>

                        <div>
                            <FormControl className={classes.formControl}>
                                <InputLabel htmlFor="venue-name">Submit Talk Uri</InputLabel>
                                <Input id="venue-name" value={this.state.papercall} onChange={e => this.onSettingChange(e, 'papercall')} />
                            </FormControl>
                            <FormControl className={classes.formControl}>
                                <DatePicker
                                    value={this.state.speakerClose}
                                    onChange={this.onSpeakerCloseDateChange} />
                            </FormControl>
                        </div>

                    </div>
                </Dialog>
            </MuiPickersUtilsProvider>
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