import firebase from 'firebase/app';
import 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAlGCcQx9S7SmvxAArZ3tvnH1ee8FwvmUY",
  authDomain: "appsystembrasil-seguro.firebaseapp.com",
  projectId: "appsystembrasil-seguro",
  storageBucket: "appsystembrasil-seguro.appspot.com",
  messagingSenderId: "402899438373",
  appId: "1:402899438373:web:1e9b8c64f444392b8228cc"
};

let app;

if(firebase.apps.length === 0) {
  app = firebase.initializeApp(firebaseConfig);
}else {
  app = firebase.app();
}

export default firebase;