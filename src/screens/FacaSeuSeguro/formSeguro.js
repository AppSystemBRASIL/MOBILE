import { StatusBar } from 'expo-status-bar';
import React, { useState, useRef, useEffect } from 'react';
import { ScrollView, Platform, KeyboardAvoidingView, View, BackHandler } from 'react-native';

import InfoSeguro from './info';
import InfoDescription from './description';

import Header from '../../components/Header';

import seguros from '../../data/seguros';

const FazerSeguro = ({ navigation, route }) => {
  const { tipo, title } = route.params;
  
  const info = seguros.filter(e => e.tipo === tipo)[0]?.info || null;
  const [viewPage, setViewPage] = useState(info ? false : true);

  const [show, setShow] = useState(false);
  
  const scrollRef = useRef();

  const [page, setPage] = useState(info ? 0 : 1);

  const topPage = () => {
    scrollRef.current?.scrollTo({
      x: 0,
      y: 0,
      animated: true,
    });
  }

  useEffect(() => {
    if(page === 0) {
      setViewPage(info ? false : true);
    }
  }, [page])

  useEffect(() => {
    const backAction = () => {
      setPage(e => e - 1);

      if(show) {
        setShow(false);
        setViewPage(info ? false : true);
      }

      return true;
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

    return () => backHandler.remove();
  }, []);

  return (
    <>
      <StatusBar style='light' />
      <View style={{ flex: 1 }}>
        <Header title={title} navigation={navigation} />
        <KeyboardAvoidingView
          style={{
            flex: 1,
          }}
          behavior={Platform.select({
            ios: 'padding',
            android: null,
          })}
        >
          <ScrollView ref={scrollRef} showsVerticalScrollIndicator={false} style={{paddingTop: 20, flex: 1}}>
            {!viewPage ? info ? (
              <InfoDescription show={show} setShow={setShow} type={tipo} setPage={setPage} setView={setViewPage} />
            ) : <InfoSeguro setView={setViewPage} type={tipo} navigation={navigation} topPage={topPage} /> : (
              <InfoSeguro view={viewPage} page={page} setPage={setPage} setView={setViewPage} type={tipo} navigation={navigation} topPage={topPage} />
            )}
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </>
  )
}

export default FazerSeguro;