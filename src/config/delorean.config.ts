export const SiteTheme = {
    Secondary: '#fff582',
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
};

export const FirebaseConfig = {
    apiKey: process.env.KOTLIN_EVERYWHERE_API_KEY,
    authDomain: "kotlin-everywhere.firebaseapp.com",
    databaseURL: "https://kotlin-everywhere.firebaseio.com",
    projectId: "kotlin-everywhere",
    storageBucket: "kotlin-everywhere.appspot.com",
    appId: "1:843997422116:web:c8081f47c1a11f59"
};

export const EventbriteConfig = {
    eventId: process.env.EB_EVENT_ID
};

export const MapsConfig = {
    apiKey: process.env.DELOREAN_MAP_API
};