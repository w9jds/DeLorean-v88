const SiteTheme = {
    Secondary: '#03dac4',
    Primary: '#1565c0',
    AppBar: {
        Primary: '#13191e',
        Color: '#fff'
    },
    CallToAction: {
        backgroundColor: '#6200EE',
        color: '#fff'
    },
    SponsorHeader: {
        backgroundColor: '#6200EE',
        color: '#fff'
    }
}

const DevfestDetails = {
    name: 'DevFest',
    location: 'Windy City',
    description: 'A community-run conference offering sessions, hack-a-thons, and codelabs across many different technologies',
    year: 2019,
    url: 'https://windycity.devfest.io'
}

const FirebaseConfig = {
    apiKey: process.env.DELOREAN_API_KEY,
    authDomain: 'devfest-v88.firebaseapp.com',
    databaseURL: 'https://devfest-v88.firebaseio.com',
    projectId: 'devfest-v88',
    storageBucket: 'devfest-v88.appspot.com'
};

const EventbriteConfig = {
    eventId: process.env.WINDY_CITY_EVENT_ID
}

const MapsConfig = {
    apiKey: process.env.DELOREAN_MAP_API
}

module.exports = {
    SiteTheme,
    MapsConfig,
    DevfestDetails,
    FirebaseConfig,
    EventbriteConfig
}