import React, { FC, Fragment, useEffect, useState, useRef } from 'react';
import { connect } from 'react-redux';
import { Dispatch, bindActionCreators } from 'redux';

import { ApplicationState } from 'models/states';
import { closeConfigDialog } from 'store/config/actions';
import { getCurrentConfig } from 'store/current/selectors';

import { Directions } from '@mui/icons-material';

import { Card, CardActionArea, CardActions, CardContent, CardMedia, Button, Typography } from '@mui/material';

import './Map.scss';

type MapProps = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>;

const Map: FC<MapProps> = ({
  config
}) => {
  const mapRef = useRef<HTMLDivElement>();
  const [map, setMap] = useState<google.maps.Map>();
  const [marker, setMarker] = useState<google.maps.Marker>();

  useEffect(() => {
    if (mapRef.current) {
      setMap(new google.maps.Map(mapRef.current, {
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
        clickableIcons: false
      }));
    }
  }, [mapRef.current]);

  useEffect(() => {
    if (map && config?.venue?.coordinates) {
      const position = {
        lat: config.venue.coordinates.lat,
        lng: config.venue.coordinates.lng
      };

      map.setCenter(position);

      setMarker(new google.maps.Marker({
        map: map,
        clickable: false,
        draggable: false,
        visible: true,
        position
      }));
    }
  }, [map, config]);

  const openDirections = () => {
    if (config?.venue?.url) {
      window.open(config.venue.url);
    }
  }

  return (
    <Fragment>
      <Card className="card">
        <CardActionArea>
          {
            config?.venue?.pictureUrl ?
              <CardMedia
                className="media"
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
        <CardActions className="actions">
          <Button className="directions" onClick={openDirections}>
            <Directions className="icon" />
            Directions
          </Button>
        </CardActions>
      </Card>

      <div ref={mapRef} className="map-container" />
    </Fragment>
  );

}

const mapStateToProps = (state: ApplicationState) => ({
  config: getCurrentConfig(state)
});

const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators({
  closeConfigDialog
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Map);