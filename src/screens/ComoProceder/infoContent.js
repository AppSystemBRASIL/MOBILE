import React from 'react';
import { View, ScrollView } from 'react-native'

import Header from '../../components/Header';

import ComoProceder from '../../data/comoProceder';

const ComoProcederInfoContent = ({ route, navigation }) => {
  const title = route.params;

  return (
    <View style={{ flex: 1 }}>
      <Header navigation={navigation} title={title} />
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
            {ComoProceder.filter(e => e.title === title)[0].content()}
          </View>
        </View>
      </ScrollView>
    </View>
  )
}

export default ComoProcederInfoContent;