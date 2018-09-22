import makeAsyncScriptLoader from 'react-async-script';
import Map from '../components/controls/Map';
import { MapsConfig } from '../../config/delorean.config';

const URL = `https://maps.googleapis.com/maps/api/js?key=${MapsConfig.apiKey}`;

export default makeAsyncScriptLoader(URL, { globalName: 'google' })(Map);