import React, { useContext, useEffect, useState } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, Share, SafeAreaView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Feather from 'react-native-vector-icons/Feather';

import { COLORS, SIZES } from '../../utils/constants';

import Onboarding from '../../screens/Onboarding';
import SplashScreen from '../SplashScreen';

import * as WebBrowser from 'expo-web-browser';

import Context from '../../context';

import AppIntroSlider from 'react-native-app-intro-slider';
import { themeDefault } from '../../config';
import { StatusBar } from 'expo-status-bar';

import { useToast, Box } from "native-base";


const HomeScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [viewedOnboarding, setViewedOnboarding] = useState(true);

  const [viewNotificationUser, setViewNotificationUser] = useState(false);

  const { corretora, corretor, connected, notificationUser, setNotificationUser } = useContext(Context);

  const toast = useToast();

  const dataList = [
    {
      key: '1',
      text: 'LEITURA OBRIGÁTORIA',
      icon: 'book-open',
      href: 'leituraObrigatoria'
    },
    {
      key: '2',
      text: 'O QUE FAZER?',
      icon: 'clipboard',
      href: 'comoProceder'
    },
    {
      key: '3',
      text: 'INDIQUE AOS AMIGOS',
      icon: 'share-2',
      function: () => {
        Share.share({
          message: 
            `*${corretora ? corretora.razao_social : 'SINISTROS E SEGUROS'}*\nCORRETORA DE SEGUROS\n\nFuja da dor de cabeça\n\n*- ESTE APLICATIVO CONTÉM:*\n\n*INFORMAÇÕES SOBRE SEGURO PARA NÃO TER NEGADA SUA INDENIZAÇÃO.*\n\n*COMO AGIR EM UM ACIDENTE:*\n- Com vítimas;\n- Sem vítimas;\n- Roubo ou furto.\n\n*PONTOS E MULTAS*\n\n*ASSISTÊNCIAS 24H DAS SEGURADORAS*\n\n*COTAÇÃO DE SEGURO*\n\n*BAIXE AGORA*\n*Android:* https://google.com\n*IOS:* https://apple.com\n\n
          `,
        });
      }
    },
    {
      key: '4',
      text: 'FAÇA SUA COTAÇÂO',
      icon: 'file-text',
      href: 'facaSeuSeguro'
    },
    {
      key: '5 ',
      text: 'MEUS SEGUROS',
      icon: 'shield',
      href: 'meusSeguros'
    },
    {
      key: '6',
      text: 'FINANCIAR VEICULO',
      icon: 'dollar-sign',
      href: 'financiarVeiculo'
    },
    {
      key: '7',
      text: 'PONTOS E MULTAS',
      icon: 'book-open',
      function: async () => {
        await WebBrowser.openBrowserAsync('https://portalservicos.senatran.serpro.gov.br/#/');
      }
    },
    {
      key: '8',
      text: 'CONTATOS ÚTEIS',
      icon: 'phone-call',
      href: 'contatosUteis'
    },
    {
      key: '9',
      text: 'CONTATO DO CORRETOR',
      icon: 'user',
      href: 'contatoCorretor'
    },
  ];

  useEffect(() => {
    if(!connected) {
      toast.show({
        placement: 'bottom',
        render: () => {
          return (
            <Box bg="red.500" px="2" py="1" rounded='sm' mb={5}>
              <Text style={{fontSize: 20, color: 'white', padding: 5}}>
                SEM CONEXÃO COM INTERNET
              </Text>
            </Box>
          )
        },
      })
    }
  }, [connected]);

  useEffect(() => {
    checkOnboarding();
  }, []);

  const checkOnboarding = async () => {
    const value = JSON.parse(await AsyncStorage.getItem('@viewedOnboarding'));

    if(value !== null) {
      setViewedOnboarding(true);
    }
  }

  const fecharNotificacao = async (uid) => {
    let value = JSON.parse(await AsyncStorage.getItem('notificationView'));

    if(value === null) {
      value = [];
    }

    value = [...value];

    const filterUserData = notificationUser.filter(item => item.uid !== uid);

    setNotificationUser(filterUserData);

    if(!value.includes(uid)) {
      const filterNotification = [...value, uid];

      await AsyncStorage.setItem('notificationView', JSON.stringify(filterNotification));
    }

    if(filterUserData.length === 0) {
      setViewNotificationUser(false);
    }
  }

  const Notification = () => {
    const renderSliderNotification = ({ item }) => {
      return (
        <View
          style={{
            paddingVertical: 20,
            paddingHorizontal: 15,
            alignItems: 'center'
          }}
        >
          <Feather style={{
            position: 'absolute',
            top: 5,
            right: 5
          }} name='x-circle' size={20} color='white'
            onPress={() => fecharNotificacao(item.uid)}
          />
          <Text style={{fontSize: 20, color: 'white', fontWeight: '900', textTransform: 'uppercase'}}>
            {item.titulo}
          </Text>
          <Text style={{
            marginTop: 10,
            fontSize: 15,
            color: 'white',
            fontWeight: '500'
          }}>
            {item.descricao}
          </Text>
          {item.link && (
            <TouchableOpacity
              style={{
                marginTop: 15,
                backgroundColor: '#fff9',
                padding: 10,
                borderRadius: 5,
              }}
              onPress={async () => {
                await WebBrowser.openBrowserAsync(item.link);
              }}
            >
              <Text style={{color: '#FFF', fontWeight: '900'}}>
                CLIQUE AQUI
              </Text>
            </TouchableOpacity>
          )}
        </View>
      );
    }

    if(notificationUser.length === 0) {
      return <></>;
    }

    if(!viewNotificationUser) {
      return <></>;
    }

    return (
      <View
        style={{
          height: 200,
          width: '100%',
          position: 'fixed',
          bottom: 30,
          paddingHorizontal: 5
        }}
      >
        <View
          style={{
            backgroundColor: COLORS(corretora ? corretora.layout.theme : themeDefault).primary,
            flex: 1,
            borderRadius: 10,
          }}
        >
          <AppIntroSlider 
            renderItem={renderSliderNotification}
            data={notificationUser}
            activeDotStyle={{
              backgroundColor: 'white',
              width: 30
            }}
            keyExtractor={(item, index) => index.toString()}
            showNextButton={false}
            showDoneButton={false}
          />
        </View>
      </View>
    );
  }

  const Header = () => {
    return (
      <View style={{
        backgroundColor: COLORS(corretora ? corretora.layout.theme : themeDefault).primary,
        width: '100%',
        marginBottom: 20
      }}>
        <View style={{ paddingHorizontal: 20, alignItems: 'center', paddingVertical: 15 }}>
          <Image style={{ resizeMode: 'stretch', width: 240, height: 56 }} width={240} height={56} source={{uri: corretora ? corretora.logo  : 'https://www.statusseguros.com/wp-content/uploads/2018/05/Untitled-35.png'}} />
        </View>
        <View style={{
          backgroundColor: 'white',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingHorizontal: 20,
          paddingVertical: 10,
          borderTopWidth: 3,
          borderTopColor: '#777',
          borderBottomWidth: 1,
          borderBottomColor: '#999',
        }}>
          <View>
            <Text style={{color: COLORS(corretora ? corretora.layout.theme : themeDefault).primary, fontSize: 25, fontWeight: '800'}}>BEM-VINDO, VISITANTE</Text>
          </View>
          <TouchableOpacity onPress={() => setViewNotificationUser(value => notificationUser.length > 0 ? !value : false)} style={{ position: 'relative', backgroundColor: viewNotificationUser ? '#f1f1f1' : 'transparent', padding: viewNotificationUser ? 5 : 0, borderRadius: 10 }}>
            {notificationUser.length > 0 && <View style={{ backgroundColor: 'red', width: 10, height: 10, position: 'absolute', right: 2, borderRadius: 100, zIndex: 10 }} />}
            <Feather name='bell' size={viewNotificationUser ? 20 : 30} color={COLORS(corretora ? corretora.layout.theme : themeDefault).primary} />
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  const Body = () => {
    const numColumns = 3;

    const formatData = (data, numColumns) => {
      const totalRows = Math.floor(data.length / numColumns);

      let totalLastRow = data.length - (totalRows * numColumns);

      while(totalRows !== 0 && totalLastRow !== numColumns) {
        dataList.push({
          key: 'black',
          empty: true
        });

        totalLastRow++;
      }

      return dataList;
    }

    const renderItem = ({item, index}) => {
      if((item.empty)) {
        return <View style={{
          backgroundColor: 'transparent',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 15,
          height: 100,
          flex: 1,
          margin: 1,
          height: SIZES.width / (numColumns / 1.2)
        }} />
      }

      return (
        <TouchableOpacity
          onPress={() => {
            if(item.href) {
              if(item.href === 'contatoCorretor' && corretora) {
                if(corretor) {
                  navigation.navigate('contatosInformativos');
                }else {
                  navigation.navigate('contatoCorretora');
                }
              }else {
                navigation.navigate(item.href);
              }
            }else if(item.function) {
              item.function();
            }
          }}
          activeOpacity={1} 
          style={{
            backgroundColor: 'white',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 15,
            flex: 1,
            margin: 1,
            height: SIZES.width / (numColumns / 1.2),
            margin: 5,
            padding: 5
          }}
        >
          <View
            style={{
              backgroundColor: '#f1f1f9',
              padding: 20, 
              borderRadius: 100,
            }}
          >
            <Feather size={50} color='#444' name={item.href === 'contatoCorretor' && corretora ? 'briefcase' : item.icon} />
          </View>
          <Text style={{
            color: '#444',
            fontSize: 15,
            textAlign: 'center',
            fontWeight: '700',
            marginTop: 10
          }}>
            {item.href === 'contatoCorretor' && corretora ? corretor ? 'CONTATOS INFORMATIVO' : 'CONTATO CORRETORA' : item.text}
          </Text>
        </TouchableOpacity>
      )
    }

    return (
      <View style={{
        flex: 1,
      }}>
        <FlatList
          scrollEnabled={false}
          data={formatData(dataList, numColumns)}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          numColumns={numColumns}
        />
      </View>
    )
  }

  return !loading ? <SplashScreen setLoading={setLoading} /> : viewedOnboarding ? (
    <View style={{flex: 1}}>
      <StatusBar style='light' />
      <SafeAreaView style={{ backgroundColor: COLORS(corretora ? corretora.layout.theme : themeDefault).primary, paddingBottom: 20 }} />
      <Header />
      <Body />
      <Notification />
    </View>
  ) : <Onboarding setViewedOnboarding={setViewedOnboarding} />;
}

export default HomeScreen;