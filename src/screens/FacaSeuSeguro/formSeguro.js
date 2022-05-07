import React, { useRef, useState, useEffect } from 'react';
import { ScrollView, Platform, KeyboardAvoidingView, BackHandler } from 'react-native';

import InfoSeguro from './info';

import Header from '../../components/Header';

import { StatusBar } from 'expo-status-bar';

const FazerSeguro = ({ navigation, route }) => {
  const { tipo, title } = route.params;

  const Body = () => {
    const [page, setPage] = useState(0);

    const scrollViewRef = useRef();

    const backAction = () => {
      if(page === 0) {
        navigation.goBack();
      }else {
        setPage(page-1);
      }
    };
  
    useEffect(() => {
      BackHandler.addEventListener('hardwareBackPress', backAction);
  
      return () => BackHandler.removeEventListener('hardwareBackPress', backAction);
    }, []);

    useEffect(() => {
      topPage();
    }, [page]);

    const topPage = () => {
      scrollViewRef.current?.scrollTo({ y: 0 });
    }

    const proximaPagina = () => {
      setPage(e => e + 1);
      topPage();
    }

    const paginaAnterior = () => {
      setPage(e => e - 1);
      topPage();
    }

    return (
      <>
        <Header showBackPage={page === 0} title={title} navigation={navigation} />
        <KeyboardAvoidingView
          style={{
            flex: 1,
          }}
          behavior={Platform.select({
            ios: 'padding',
            android: null,
          })}
        >
          <ScrollView ref={scrollViewRef} showsVerticalScrollIndicator={false} style={{paddingTop: 20}}>
            <InfoSeguro type={tipo} />
          </ScrollView>
        </KeyboardAvoidingView>
      </>
    )
  }

  return (
    <>
      <StatusBar style='light' />
      <Body />
    </>
  )
}

export default FazerSeguro;