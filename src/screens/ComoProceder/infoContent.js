import React, { useContext, useRef, useEffect } from 'react';
import { View, Text, ScrollView } from 'react-native'
import { COLORS, SIZES } from '../../utils/constants';

import Feather from 'react-native-vector-icons/Feather';

import Header from '../../components/Header';

import Context from '../../context';
import { themeDefault } from '../../config';
import { StatusBar } from 'expo-status-bar';

const ComoProcederInfoContent = ({ route, navigation }) => {
  const item = route.params;

  const { corretora } = useContext(Context);

  const Body = () => {
    return (
      <ScrollView showsVerticalScrollIndicator={false} style={{
        flex: 1,
        paddingTop: 20
      }}>
        <View
          style={{
            backgroundColor: 'white',
            borderRadius: 15,
            margin: 5,
            marginBottom: 100,
            paddingHorizontal: 20,
            paddingTop: 20,
            paddingBottom: 50,
          }}
        >
          <View>
            <Text style={{
              color: '#444',
              fontSize: 20,
              fontWeight: '800',
              textAlign: 'center',
              marginBottom: 10
            }}>
              {item.title}
            </Text>
          </View>
          <View
            style={{
              borderBottomColor: '#999',
              borderBottomWidth: 1,
            }}
          />
          <View style={{
            marginTop: 20
          }}>
            {item.content}
          </View>
        </View>
      </ScrollView>
    )
  }

  return (
    <>
      <StatusBar style='light' />
      <Header navigation={navigation} title={item.title} />
      <Body />
    </>
  )
}

export default ComoProcederInfoContent;