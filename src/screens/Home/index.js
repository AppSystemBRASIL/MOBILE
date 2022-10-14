import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useContext, useEffect, useState } from 'react';
import { Alert, Image, SafeAreaView, ScrollView, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native';

import Feather from 'react-native-vector-icons/Feather';

import { COLORS, SIZES } from '../../utils/constants';

import Onboarding from '../../screens/Onboarding';
import SplashScreen from '../SplashScreen';

import * as WebBrowser from 'expo-web-browser';

import Context from '../../context';

import { StatusBar } from 'expo-status-bar';
import AppIntroSlider from 'react-native-app-intro-slider';
import { themeDefault } from '../../config';

import { Box, useToast } from "native-base";

import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import Icon from 'react-native-vector-icons/Feather';
import compartilharAPP from '../../utils/compartilharAPP';

const HomeScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [viewedOnboarding, setViewedOnboarding] = useState(true);

  const { width } = useWindowDimensions();

  const { corretora, corretor, connected, notificationUser, setNotificationUser, viewNotificationUser, setViewNotificationUser, cpf, setCPF } = useContext(Context);

  const toast = useToast();

  const [firstView, setFirstView] = useState(null);

  useEffect(() => {
    AsyncStorage.getItem('cpf').then(e => {
      setCPF(e);
    }).catch(() => null);
  }, []);

  useEffect(() => {
    AsyncStorage.getItem('firstView').then(e => {
      setFirstView(e);
    }).catch(() => null);
  }, []);

  useEffect(() => {
    AsyncStorage.setItem('firstView', 'true');
  }, [firstView]);

  const dataList = [
    {
      key: '1',
      text: 'MEUS SEGUROS',
      icon: <FontAwesome5 color={`${COLORS(corretora ? corretora.layout.theme : themeDefault).black}99`} name='shield-alt' size={50} />,
      href: 'meusSeguros'
    },
    {
      key: '2',
      text: 'FAÇA SUA COTAÇÂO',
      icon: <FontAwesome5 color={`${COLORS(corretora ? corretora.layout.theme : themeDefault).black}99`} name='book' size={50} />,
      href: 'facaSeuSeguro'
    },
    {
      key: '4',
      text: 'INDIQUE AOS AMIGOS',
      icon: <FontAwesome5 color={`${COLORS(corretora ? corretora.layout.theme : themeDefault).black}99`} name='share-alt' size={50} />,
      function: () => compartilharAPP({ corretora: corretora || null })
    },   
    {
      key: '4',
      text: 'LEITURA OBRIGÁTORIA',
      icon: <FontAwesome5 color={`${COLORS(corretora ? corretora.layout.theme : themeDefault).black}99`} name='book-open' size={50} />,
      href: 'leituraObrigatoria'
    },
    {
      key: '5',
      text: 'O QUE FAZER?',
      icon: <FontAwesome5 color={`${COLORS(corretora ? corretora.layout.theme : themeDefault).black}99`} name='car-crash' size={50} />,
      href: 'comoProceder'
    },
    {
      key: '6',
      text: 'FINANCIAR VEICULO',
      icon: <FontAwesome5 color={`${COLORS(corretora ? corretora.layout.theme : themeDefault).black}99`} name='dollar-sign' size={50} />,
      href: 'financiarVeiculo'
    },
    {
      key: '7',
      text: 'PONTOS E MULTAS',
      icon: <FontAwesome5 color={`${COLORS(corretora ? corretora.layout.theme : themeDefault).black}99`} name='university' size={50} />,
      href: 'pontosMultas'
    },
    {
      key: '8',
      text: 'CONTATOS ÚTEIS',
      icon: <FontAwesome5 color={`${COLORS(corretora ? corretora.layout.theme : themeDefault).black}99`} name='phone' size={50} />,
      href: 'contatosItens'
    },
    {
      key: '9',
      text: 'CONTATO DO CORRETOR',
      icon: <FontAwesome5 color={`${COLORS(corretora ? corretora.layout.theme : themeDefault).black}99`} name='user-tie' size={50} />,
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
    Alert.alert('APAGAR MENSAGEM', 'Deseja realmente apagar a mensagem?', [
      {
        text: 'NÃO',
        style: 'cancel',
      },
      { text: 'SIM', onPress: () => closeMsg() },
    ]);

    async function closeMsg() {
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
            {!firstView ? 'OLÁ, SEJA BEM-VINDO!' : item.titulo}
          </Text>
          <Text style={{
            marginTop: 10,
            fontSize: 15,
            color: 'white',
            fontWeight: '500',
            textAlign: 'center',
          }}>
            {!firstView ? 'Esperamos que nossa parceria lhe seja útil e perdure por muitos anos. \n\n --------- INDIQUE AOS AMIGOS --------- \n Leve a eles estas informações, mesmo que não tenham seguro. \n\n Fique a vontade para expressar suas opiniões e comentários.' : String(item.descricao).split('\n').join(`\n`)}
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
          marginTop: 50,
          height: !firstView ? 250 : 200,
          width: '100%',
          bottom: 30,
          paddingHorizontal: 5,
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
      }}>
        <View style={{ paddingHorizontal: 20, alignItems: 'center', paddingVertical: width > 768 ? 30 : 15 }}>
          <Image style={{ resizeMode: 'stretch', width: 240, height: 56 }} width={width > 768 ? 300 : 240} height={width > 768 ? 100 : 56} source={{ uri: corretora.logo }} />
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

  const Body = ({ data, numColumns }) => {
    const renderItem = (item, index) => {
      return (
        <TouchableOpacity
          key={index}
          onPress={() => {
            if(item.href) {
              if(item.href === 'contatoCorretor' && corretora) {
                if(corretor) {
                  navigation.navigate('contatosInformativos');
                }else {
                  navigation.navigate('contatoCorretora');
                }
              }else {
                navigation.navigate(item.href, { cpf: cpf });
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
            {typeof item.icon === 'string' ? (
              <Feather size={50} color='#444' name={item.href === 'contatoCorretor' && corretora ? 'briefcase' : item.icon} />
            ) : item.icon}
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

    return [...data].slice(0, numColumns)?.map((item, index) => renderItem(item, index));
  }
 
  const NotificationFirst = () => {
    return (
      <>
        <TouchableOpacity
          onPress={() => compartilharAPP({
            corretora: corretora || null,
            segurado: cpf || null
          })}
          style={{
            marginTop: 50,
            width: '100%',
            bottom: 30,
            paddingHorizontal: 5,
          }}
        >
          <View
            style={{
              backgroundColor: COLORS(corretora ? corretora.layout.theme : themeDefault).primary,
              flex: 1,
              borderRadius: 10,
            }}
          >
            <Icon
              name='share-2'
              color='white'
              size={20}
              style={{
                position: 'absolute',
                top: 10,
                right: 10
              }}
            />
            <View
              style={{
                paddingVertical: 20,
                paddingHorizontal: 15,
                alignItems: 'center'
              }}
            >
              <Text style={{fontSize: 20, color: 'white', fontWeight: '900', textTransform: 'uppercase'}}>
                COMPARTILHAR
              </Text>
              <Text style={{
                marginTop: 10,
                fontSize: 15,
                color: 'white',
                fontWeight: '500',
                textAlign: 'center',
              }}>
                CLIQUE,  indique aos amigos, eles terão totalmente grátis este aplicativo para inserir seus veículos e ainda receberão nossa cotação com os melhores preços para a renovação do seguro.
              </Text>
            </View>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate('seguroExterno')}
          style={{
            marginTop: 10,
            marginBottom: 50,
            width: '100%',
            bottom: 30,
            paddingHorizontal: 5,
          }}
        >
          <View
            style={{
              backgroundColor: COLORS(corretora ? corretora.layout.theme : themeDefault).primary,
              flex: 1,
              borderRadius: 10,
            }}
          >
            <Icon
              name='link-2'
              color='white'
              size={20}
              style={{
                position: 'absolute',
                top: 10,
                right: 10
              }}
            />
            <View
              style={{
                paddingVertical: 20,
                paddingHorizontal: 15,
                alignItems: 'center'
              }}
            >
              <Text style={{fontSize: 20, color: 'white', fontWeight: '900', textTransform: 'uppercase'}}>
                SEGURADO EXTERNO
              </Text>
              <Text style={{
                marginTop: 10,
                fontSize: 15,
                color: 'white',
                fontWeight: '500',
                textAlign: 'center',
              }}>
                CLIQUE! Preencha os dados e tenha as informações do seu seguro na palma da mão.
                {'\n'}
                Na renovação, receba nossas cotações com os melhores preços - Tudo Grátis
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </>
    )
  }

  return !loading ? <SplashScreen corretora={corretora} setLoading={setLoading} /> : viewedOnboarding ? (
    <View style={{ flex: 1 }}>
      <StatusBar style='light' />
      <SafeAreaView style={{ backgroundColor: COLORS(corretora ? corretora.layout.theme : themeDefault).primary, paddingBottom: 20 }} />
      <Header />
      <ScrollView showsVerticalScrollIndicator={false} style={{ paddingTop: 15 }}>
        <View style={{
          flex: 1,
          flexDirection: 'row',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'stretch',
          alignSelf: 'stretch'
        }}>
          <Body data={dataList.slice(0, 3)} numColumns={3} />
        </View>
        <View style={{
          flex: 1,
          flexDirection: 'row',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'stretch',
          alignSelf: 'stretch'
        }}>
          <Body data={dataList.slice(3, dataList.length - 3)} numColumns={3} />
        </View>
        <View style={{
          flex: 1,
          flexDirection: 'row',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'stretch',
          alignSelf: 'stretch'
        }}>
          <Body data={dataList.slice(6, dataList.length)} numColumns={3} />
        </View>
        <NotificationFirst />
      </ScrollView>
    </View>
  ) : <Onboarding setViewedOnboarding={setViewedOnboarding} />;
}

export default HomeScreen;