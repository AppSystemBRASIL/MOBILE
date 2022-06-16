import React, { createContext, useState, useEffect } from 'react';

import AsyncStorage from '@react-native-async-storage/async-storage';

import firebase from '../../firebase';

import { uidCorretoraDefault } from '../config';

import { addDays } from 'date-fns';

import NetInfo from '@react-native-community/netinfo';

const Context = createContext({});

export const ContextProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);

  const [corretora, setCorretora] = useState(null);
  const [corretor, setCorretor] = useState(null);
  const [corretoraCorretor, setCorretoraCorretor] = useState(null);
  const [dataSeguros, setDataSeguros] = useState(null);

  const [cpf, setCPF] = useState(null);

  const [notificationUser, setNotificationUser] = useState([]);
  const [viewNotificationUser, setViewNotificationUser] = useState(false);

  const [connected, setConnected] = useState(true);

  const [seguradoras, setSeguradoras] = useState([]);

  useEffect(() => {
    NetInfo.addEventListener(state => {
      setConnected(state.isConnected);
    });
  }, []);

  useEffect(() => {
    (async () => {
      const data = await getNotification();
      let value = JSON.parse(await AsyncStorage.getItem('notificationView'));

      if(value === null) {
        value = [];
      }

      const filterUserData = [...data].filter(item => !value.includes(item.uid));
      
      setNotificationUser(filterUserData);

      if(filterUserData.length > 0) {
        setViewNotificationUser(true);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      const getNewDataCorretora = async (dataEsxternal) => {
        if(dataEsxternal) {
          await setCorretora(dataEsxternal);
          await setCorretoraCorretor(dataEsxternal);
        }
        
        await firebase.firestore().collection('corretoras').doc(uidCorretoraDefault).get()
        .then((response) => {
          if(response.exists) {
            let data = response.data();
            const dataNewUpdate = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 0, 0, 0);
            data.newUpdate = addDays(dataNewUpdate, 1);

            setCorretora(data);
            setCorretoraCorretor(data);
            AsyncStorage.setItem('corretoraData', JSON.stringify(data));
          }
        })
        .finally(() => {
          setLoading(true);
        });
      }

      await AsyncStorage.getItem('corretoraData')
      .then(async (response) => {
        if(response) {
          const data = JSON.parse(response);

          if(data.newUpdate > new Date()) {
            setCorretora(data);
            setCorretoraCorretor(data);
          }else {
            getNewDataCorretora(data);
          }
        }else if(uidCorretoraDefault) {
          getNewDataCorretora();
        }
      });

      await AsyncStorage.getItem('corretorData')
      .then(async (response) => {
        if(response) {
          setCorretor(JSON.parse(response));
        }
      });

      await AsyncStorage.getItem('corretoraCorretorData')
      .then((response) => {
        setCorretoraCorretor(JSON.parse(response))
      });

      AsyncStorage.getItem('meusSeguros')
      .then((response) => {
        if(response) {
          const dataMeusSeguros = JSON.parse(response || null);
          setDataSeguros(dataMeusSeguros || null);
        }
      });

      AsyncStorage.getItem('cpf')
      .then((response) => {
        if(response) {
          setCPF(response);
        }
      });
    })();
  }, []);

  const getNotification = async () => {
    let data = [];
    let dataContent = [];

    await firebase.firestore().collection('notificacoes').where('active', '==', true).where('geral', '==', true).get()
    .then((response) => {
      if(!response.empty) {
        response.forEach(item => {
          const dados = item.data();

          if(!data.includes(dados.uid)) {
            data.push(dados.uid);
            dataContent.push(dados);
          }
        })
      }
    });

    if(corretora) {
      await firebase.firestore().collection('notificacoes').where('active', '==', true).where('corretora', '==', corretora.uid).get()
      .then((response) => {
        if(!response.empty) {
          response.forEach(item => {
            const dados = item.data();

            if(!data.includes(dados.uid)) {
              data.push(dados.uid);
              dataContent.push(dados);
            }
          })
        }
      });
    }

    if(corretor) {
      await firebase.firestore().collection('notificacoes').where('active', '==', true).where('corretor', '==', corretor.uid).get()
      .then((response) => {
        if(!response.empty) {
          response.forEach(item => {
            const dados = item.data();

            if(!data.includes(dados.uid)) {
              data.push(dados.uid);
              dataContent.push(dados);
            }
          })
        }
      });
    }

    return dataContent;
  }

  useEffect(() => {
    getSeguradoras();
  }, []);

  const getSeguradoras = () => {
    if(seguradoras) {
      setSeguradoras(seguradoras);
    }

    firebase.firestore().collection('seguradoras').get()
    .then((response) => {
      const array = [];

      if(!response.empty) {
        response.forEach((item) => {
          array.push(item.data());      
        });
      }

      setSeguradoras(array);
    })
    .catch(() => null);
  } 

  return (
    <Context.Provider value={{
      loading,
      corretora,
      setCorretora,
      corretor,
      setCorretor,
      corretoraCorretor,
      setCorretoraCorretor,
      dataSeguros,
      setDataSeguros,
      getNotification,
      connected,
      notificationUser,
      setNotificationUser,
      cpf, setCPF,
      viewNotificationUser, setViewNotificationUser,
      seguradoras,
    }}>
      {children}
    </Context.Provider>
  );
}

export default Context;