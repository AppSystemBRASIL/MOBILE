import React from 'react';
import { View, ScrollView } from 'react-native'

import Header from '../../components/Header';

import { StatusBar } from 'expo-status-bar';

const ComoProcederInfoContent = ({ route, navigation }) => {
  const item = route.params;

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