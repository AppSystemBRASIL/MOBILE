import React, { useContext } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native'
import { COLORS, SIZES } from '../../utils/constants';

import Header from '../../components/Header';

import Feather from 'react-native-vector-icons/Feather';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import Context from '../../context';
import { themeDefault } from '../../config';
import { StatusBar } from 'expo-status-bar';

import roles_security from '../../data/seguros';

const FazerSeuSeguro = ({ navigation }) => {
  const { corretora } = useContext(Context);

  const Body = () => {
    const renderItem = ({item, index}) => {
      if(!corretora.roles_security.includes(item.tipo)) {
        //return <></>
      }

      return (
        <TouchableOpacity
          key={index}
          onPress={() => {
            navigation.navigate('formSeguro', {
              title: item.title,
              tipo: item.tipo
            });
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
            marginBottom: (index + 1) === roles_security.length ? 100 : 0,
            paddingHorizontal: 20,
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center'
            }}
          >
            <View
              style={{
                backgroundColor: '#f1f1f9',
                padding: 10, 
                borderRadius: 100,
                marginRight: 20,
              }}
            >
              <FontAwesome5 solid size={40} color='#444' name={item.icon} />
            </View>
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
          style={{paddingTop: 20, flex: 1}}
          showsVerticalScrollIndicator={false}
          scrollEnabled={true}
          data={roles_security}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
    )
  }

  return (
    <View style={{ flex: 1 }}> 
      <StatusBar style='light' />
      <Header title='FAÇA SUA COTAÇÃO' navigation={navigation} />
      <Body />
    </View>
  )
}

export default FazerSeuSeguro;