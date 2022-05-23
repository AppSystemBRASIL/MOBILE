import { StatusBar } from 'expo-status-bar';
import React, { useState, useRef, useEffect } from 'react';
import { ScrollView, Platform, KeyboardAvoidingView, View, BackHandler } from 'react-native';

import InfoDescription from './description';

import Header from '../../components/Header';

const FazerSeguro = ({ navigation, route }) => {
  const { tipo, title } = route.params;

  const scrollRef = useRef();
  
  return (
    <>
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
            <InfoDescription type={tipo} />
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </>
  )
}

export default FazerSeguro;