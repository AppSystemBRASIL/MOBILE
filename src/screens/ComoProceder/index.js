import React, { useContext } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native'
import { COLORS, SIZES } from '../../utils/constants';

import Feather from 'react-native-vector-icons/Feather';

import Header from '../../components/Header';

import comoProcederJson from '../../data/comoProceder';
import Context from '../../context';
import { themeDefault } from '../../config';
import { StatusBar } from 'expo-status-bar';

const ComoProceder = ({ navigation }) => {
  const { corretora } = useContext(Context);

  const Body = () => {
    const renderItem = ({item, index}) => {
      return (
        <TouchableOpacity
          key={index}
          onPress={() => {
            if(item.content) {
              navigation.navigate('comoProcederInfoContent', item.title);
            }else if(item.href) {
              navigation.navigate(item.href);
            }
          }}
          activeOpacity={1} 
          style={{
            backgroundColor: 'white',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderRadius: 15,
            flex: 1,
            margin: 1,
            height: SIZES.width / 4,
            margin: 5,
            padding: 5,
            marginBottom: item.key === comoProcederJson.length ? 100 : 0,
            paddingHorizontal: 20,
          }}
        >
          <View>
            <Text style={{
              color: '#444',
              fontSize: 20,
              fontWeight: '800',
            }}>
              {item.title}
            </Text>
          </View>
          <View style={{
            position: 'absolute',
            right: 0,
          }}>
            <Feather size={40} color={COLORS(corretora ? corretora.layout.theme : themeDefault).primary} name='chevron-right' />
          </View>
        </TouchableOpacity>
      )
    }

    return (
      <View style={{
        flex: 1,
      }}>
        <FlatList
          style={{paddingTop: 20}}
          scrollEnabled={true}
          data={comoProcederJson}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
    )
  }

  return (
    <>
      <StatusBar style='light' />
      <Header title='O QUE FAZER?' navigation={navigation} />
      <Body />
    </>
  )
}

export default ComoProceder;