const VERSION = '1.9.6';
const DOMAINS = 'com.xcarcorretora.app';
const BUILD = 60;

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
    icon: './src/assets/icon.png',
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