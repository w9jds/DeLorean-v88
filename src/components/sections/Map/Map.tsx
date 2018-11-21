import * as React from 'react';
import { connect } from 'react-redux';
import { ApplicationState } from '../../..';
import { Dispatch, bindActionCreators } from 'redux';
import { closeConfigDialog } from '../../../ducks/config';

import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import { Directions } from '@material-ui/icons';
import Typography from '@material-ui/core/Typography';
import { WithStyles } from '@material-ui/core';
import { StyleRulesCallback, withStyles } from '@material-ui/core/styles';
import { getCurrentConfig } from '../../../ducks/current';

type MapProps = WithStyles<typeof stylesheet> & ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>;
const stylesheet: StyleRulesCallback = theme => ({
    actions: {
        padding: 0
    },
    directions: {
        borderRadius: 0,
        margin: 0
    },
    media: {
        height: 200,
        width: 400
    },
    leftIcon: {
        marginRight: theme.spacing.unit,
    },
});

class Map extends React.Component<MapProps> {

    private map: google.maps.Map;
    private marker: google.maps.Marker;

    componentDidMount() {
        this.buildGoogleMap();
        this.populateFromProps(this.props);
    }

    shouldComponentUpdate(nextProps: MapProps) {
        return this.populateFromProps(nextProps);
    }

    populateFromProps = (nextProps: MapProps) => {
        if (this.marker) {
            this.marker.setMap(null);
        }

        if (!nextProps.config.venue) {
            return true;
        }
        if (nextProps.config.venue && !this.marker) {
            this.buildVenueMarker();
            return true;
        }
        if (!this.props.config && nextProps.config && nextProps.config.venue) {
            this.buildVenueMarker();
            return true;
        }
        if (this.props.config && this.props.config.venue.coordinates !== nextProps.config.venue.coordinates) {
            this.buildVenueMarker();
            return true;
        }
        if (this.props.config && this.props.config.venue.address !== nextProps.config.venue.address) {
            this.buildVenueMarker();
            return true;
        }

        return false;
    }

    buildVenueMarker = () => {
        let position = {
            lat: this.props.config.venue.coordinates.lat,
            lng: this.props.config.venue.coordinates.lng
        };

        this.map.setCenter(position);
        this.marker = new google.maps.Marker({
            map: this.map,
            clickable: false,
            draggable: false,
            visible: true,
            position
        });
    }

    buildGoogleMap = () => {
        this.map = new google.maps.Map(document.getElementById('map'), {
            zoom: 16,
            zoomControl: false,
            mapTypeControl: false,
            scaleControl: false,
            streetViewControl: false,
            rotateControl: false,
            fullscreenControl: false,
            draggable: false,
            draggableCursor: 'default',
            draggingCursor: 'default',
            scrollwheel: false,
            disableDoubleClickZoom: true,
            keyboardShortcuts: false,
            panControl: false,
            signInControl: false,
            clickableIcons: false
        });
    }

    openDirections = () => {
        if (this.props.config && this.props.config.venue && this.props.config.venue.url) {
            window.open(this.props.config.venue.url);
        }
    }

    render() {
        let { classes, config } = this.props;

        return (
            <React.Fragment>
                <Card className="card">
                    <CardActionArea>
                        {
                            config.venue && config.venue.pictureUrl ?
                                <CardMedia
                                    className={classes.media}
                                    image={config.venue.pictureUrl}
                                    title={config.venue.name}/> : null
                        }
                        <CardContent>
                            <Typography gutterBottom variant="h6" component="h6">
                                {config.venue.name}
                            </Typography>
                            <Typography component="p">
                                {config.venue.address}
                            </Typography>
                        </CardContent>
                    </CardActionArea>
                    <CardActions className={classes.actions}>
                        <Button className={classes.directions} onClick={this.openDirections}>
                            <Directions className={classes.leftIcon} />
                            Directions
                        </Button>
                    </CardActions>
                </Card>

                <div id="map" className="map-container" />
            </React.Fragment>
        );
    }

}

const mapStateToProps = (state: ApplicationState) => ({
    config: getCurrentConfig(state)
});

const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators({
    closeConfigDialog
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(stylesheet)(Map));