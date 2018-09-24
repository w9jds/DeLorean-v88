import * as React from 'react';

class Map extends React.Component {

    private map: google.maps.Map;

    constructor(props) {
      super(props);
  
  
    }
  
    componentDidUpdate() {
        if (window['google'] && !this.map) {
            this.buildGoogleMap();
        }
    }

    buildGoogleMap = () => {
        this.map = new google.maps.Map(document.getElementById('map'), {
            zoom: 15,
            center:  { lat: 0, lng: 0 },
            zoomControl: false,
            mapTypeControl: false,
            scaleControl: false,
            streetViewControl: false,
            rotateControl: false,
            fullscreenControl: false
        });
    }

    render() {
        return <div id="map" className="map-container" />;
    }

}

export default Map