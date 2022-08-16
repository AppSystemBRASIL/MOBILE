const VERSION = '1.0.1';
const DOMAINS = 'com.xcarcorretora.app';
const BUILD = 34;

const API_KEY_FIREBASE = 'AIzaSyAlGCcQx9S7SmvxAArZ3tvnH1ee8FwvmUY';
const PROJECT_ID = 'appsystembrasil-seguro';
const MESSAGING_SENDER_ID = '402899438373';
const APP_ID = '1:402899438373:web:1e9b8c64f444392b8228cc';

export default function appConfig({ config }) {
  return {
    ...config,
    name: 'Xcar Corretora',
    scheme: 'xcar-corretora',
    slug: 'xcar-corretora',
    icon: 'https://firebasestorage.googleapis.com/v0/b/appsystembrasil-seguro.appspot.com/o/corretora%2FX0hXIOdA5pOkyLquPIxj%2Ficon%2Ficon.png?alt=media&token=47ea79cf-001a-4b7e-9a70-a0b5dcf6e728',
    version: VERSION,
    web: {
      firebase: {
        apiKey: API_KEY_FIREBASE,
        authDomain: `${PROJECT_ID}.firebaseapp.com`,
        projectId: PROJECT_ID,
        storageBucket: `${PROJECT_ID}.appspot.com`,
        messagingSenderId: MESSAGING_SENDER_ID,
        appId: APP_ID
      }
    },
    ios: {
      ...config.ios,
      buildNumber: String(BUILD),
      bundleIdentifier: DOMAINS
    },
    android: {
      ...config.android,
      package: DOMAINS,
      versionCode: BUILD
    }
  }
};