export const SiteTheme = {
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
};

export const FirebaseConfig = {
  apiKey: process.env.DELOREAN_API_KEY,
  authDomain: "devfest-kc-2023.firebaseapp.com",
  projectId: "devfest-kc-2023",
  storageBucket: "devfest-kc-2023.appspot.com",
  messagingSenderId: "374670673309",
  appId: "1:374670673309:web:1f51d56313f9650f019b74",
  measurementId: "G-9TEP7Z401Y",
};

export const EventbriteConfig = {
  eventId: process.env.WINDY_CITY_EVENT_ID
};

export const MapsConfig = {
  apiKey: process.env.DELOREAN_MAP_API
};