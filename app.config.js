export default function appConfig({ config }) {
  return {
    ...config,
    name: 'Xcar Corretora',
    scheme: 'xcar-corretora',
    slug: 'xcar-corretora',
    icon: 'https://firebasestorage.googleapis.com/v0/b/appsystembrasil-seguro.appspot.com/o/corretora%2FX0hXIOdA5pOkyLquPIxj%2Ficon%2Ficon.png?alt=media&token=47ea79cf-001a-4b7e-9a70-a0b5dcf6e728',
    version: '1.0.0',
    web: {
      firebase: {
        apiKey: "AIzaSyAlGCcQx9S7SmvxAArZ3tvnH1ee8FwvmUY",
        authDomain: "appsystembrasil-seguro.firebaseapp.com",
        projectId: "appsystembrasil-seguro",
        storageBucket: "appsystembrasil-seguro.appspot.com",
        messagingSenderId: "402899438373",
        appId: "1:402899438373:web:1e9b8c64f444392b8228cc"
      },
    }
  }
};