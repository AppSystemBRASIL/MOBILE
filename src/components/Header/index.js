import React, { useContext } from 'react';
import { View, Text, Image, TouchableOpacity, SafeAreaView, useWindowDimensions } from 'react-native';
import { COLORS } from '../../utils/constants';

import AsyncStorage from '@react-native-async-storage/async-storage';

import AppIntroSlider from 'react-native-app-intro-slider';
import { themeDefault } from '../../config';

import Context from '../../context';

import Feather from 'react-native-vector-icons/Feather';

import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';

const Header = ({ title, showBackPage }) => {
  const { corretora, notificationUser, setNotificationUser, viewNotificationUser, setViewNotificationUser } = useContext(Context);

  const { width } = useWindowDimensions();
  
  const navigation = useNavigation();

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
            alignItems: 'center',
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

  return (
    <>
      <StatusBar style='light' />
      <SafeAreaView style={{ backgroundColor: COLORS(corretora ? corretora.layout.theme : themeDefault).primary, paddingBottom: 20 }} />
      <View style={{
        backgroundColor: COLORS(corretora ? corretora.layout.theme : themeDefault).primary,
        width: '100%',
        height: '10%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        borderBottomWidth: 3,
        borderBottomColor: '#777',
      }}>
        {(showBackPage === undefined || showBackPage === true) ? (
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Feather name='chevron-left' size={40} color='white' />
          </TouchableOpacity>
        ) : (
          <View />
        )}
        <Image style={{ resizeMode: 'stretch', width: 240, height: 56 }} width={width > 768 ? 300 : 240} height={width > 768 ? 100 : 56} source={{ uri: corretora.logo }} />
        <View>
          <TouchableOpacity onPress={() => setViewNotificationUser(value => notificationUser.length > 0 ? !value : false)} style={{ position: 'relative', backgroundColor: viewNotificationUser ? 'transparent' : 'transparent', padding: viewNotificationUser ? 5 : 0, borderRadius: 10 }} />
        </View>
      </View>
      <View style={{
        backgroundColor: 'white',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#999',
      }}>
        <View>
          <Text style={{color: COLORS(corretora ? corretora.layout.theme : themeDefault).primary, fontSize: 25, fontWeight: '800', textAlign: 'center'}}>
            {title}
          </Text>
        </View>
      </View>
    </>
  )
}

export default Header;