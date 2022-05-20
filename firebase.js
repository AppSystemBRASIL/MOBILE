import Constant from 'expo-constants';

import firebase from 'firebase/app';
import 'firebase/firestore';

const firebaseConfig = {
  apiKey: Constant.manifest.web.firebase.apiKey,
  authDomain: Constant.manifest.web.firebase.authDomain,
  projectId: Constant.manifest.web.firebase.projectId,
  storageBucket: Constant.manifest.web.firebase.storageBucket,
  messagingSenderId: Constant.manifest.web.firebase.messagingSenderId,
  appId: Constant.manifest.web.firebase.appId
};

let app;

if(firebase.apps.length === 0) {
  app = firebase.initializeApp(firebaseConfig);
}else {
  app = firebase.app();
}

export default firebase;