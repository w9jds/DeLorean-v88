import React, { FC, useEffect, useMemo, useState, useRef, useLayoutEffect, createRef } from 'react';
import { connect } from 'react-redux';
import { Dispatch, bindActionCreators } from 'redux';

import { Loader } from '@googlemaps/js-api-loader';

import { ApplicationState } from 'models/states';
import { getCurrentConfig } from 'store/current/selectors'
import { MapsConfig } from 'config/delorean.config';;

import { Directions } from '@mui/icons-material';

import { Card, CardActionArea, CardActions, CardContent, CardMedia, Button, Typography } from '@mui/material';

type MapProps = ReturnType<typeof mapStateToProps>;

const Map: FC<MapProps> = ({ config }) => {
  const mapRef = createRef<HTMLDivElement>();
  const [map, setMap] = useState<google.maps.Map>();

  const loaderConfig = useMemo(() => ({
    apiKey: MapsConfig.apiKey,
    version: "weekly",
  }), [MapsConfig]);

  useEffect(() => {
    if (mapRef?.current) {
      new Loader(loaderConfig)
        .importLibrary('maps')
        .then(lib => {
          setMap(new lib.Map(mapRef.current, {
            zoom: 17,
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
        });
    }
  }, [config, mapRef.current]);

  useEffect(() => {
    if (map && config?.venue?.coordinates) {
      new Loader(loaderConfig)
        .importLibrary('marker')
        .then(lib => {
          const position = {
            lat: config.venue.coordinates.lat,
            lng: config.venue.coordinates.lng
          };

          map.setCenter(position);

          new lib.Marker({
            map: map,
            clickable: false,
            draggable: false,
            visible: true,
            position
          })
        });
    }
  }, [map, config]);

  const openDirections = () => {
    if (config?.venue?.url) {
      window.open(config.venue.url);
    }
  }

  return config?.venue && (
    <section className="venue">
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
    </section>
  );

}

const mapStateToProps = (state: ApplicationState) => ({
  config: getCurrentConfig(state)
});

export default connect(mapStateToProps)(Map);