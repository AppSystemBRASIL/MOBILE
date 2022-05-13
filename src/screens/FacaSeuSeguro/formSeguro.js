import React, { useRef } from 'react';
import { ScrollView, Platform, KeyboardAvoidingView, View } from 'react-native';

import InfoSeguro from './info';

import Header from '../../components/Header';

import { StatusBar } from 'expo-status-bar';

const FazerSeguro = ({ navigation, route }) => {
  const { tipo, title } = route.params;
  
  const scrollRef = useRef();

  const topPage = () => {
    scrollRef.current?.scrollTo({
      x: 0,
      y: 0,
      animated: true,
    });
  }

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
            <InfoSeguro type={tipo} navigation={navigation} topPage={topPage} />
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </>
  )
}

export default FazerSeguro;