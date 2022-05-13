import React from 'react';
import { View, Text, FlatList, TouchableOpacity, Linking } from 'react-native'

import Feather from 'react-native-vector-icons/Feather';

import Header from '../../components/Header';

import { StatusBar } from 'expo-status-bar';

const dataList = [
  {
    key: 1,
    text: 'SAMU',
    phone: '192'
  },
  {
    key: 1,
    text: 'BOMBEIRO',
    phone: '193'
  },
  {
    key: 1,
    text: 'POLÍCIA RODOVÍARIA ESTADUAL',
    phone: '198'
  },
  {
    key: 1,
    text: 'POLÍCIA RODOVÍARIA FEDEREAL',
    phone: '191'
  },
  {
    key: 1,
    text: 'POLÍCIA MILITAR',
    phone: '190'
  },
  {
    key: 1,
    text: 'POLÍCIA CÍVIL',
    phone: '197'
  },
  {
    key: 1,
    text: 'POLÍCIA FEDERAL',
    phone: '194'
  },
]

const ContatosUteis = ({ navigation }) => {
  const Body = () => {
    const renderItem = ({ item, index }) => {
      return (
        <View key={index} style={{ paddingBottom: (Number(index)) === dataList.length - 1 ? 100 : 0 }}>
          <TouchableOpacity
            onPress={() => {
              Linking.openURL(`tel:${String(item.phone).split('(').join('').split(')').join('').split('-').join('').split(' ').join('')}`)
            }}
            activeOpacity={1} 
            style={{
              backgroundColor: 'white',
              flexDirection: 'row',
              alignItems: 'center',
              borderRadius: 15,
              flex: 1,
              margin: 1,
              height: 100,
              margin: 5,
              padding: 5,
              marginBottom: (item.key === dataList.length) ? 100 : 0,
              paddingHorizontal: 20,
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
              <Feather size={40} color='#444' name='phone' />
            </View>
            <View>
              <Text style={{
                color: '#444',
                fontSize: String(item.text).length > 25 ? 17 : 20,
                fontWeight: '800',
              }}>
                {item.text}
              </Text>
              <Text style={{
                color: '#888',
                fontSize: 17,
                fontWeight: '800',
                marginTop: 5
              }}>
                {item.phone}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      )
    }

    return (
      <View style={{
        flex: 1,
      }}>
        <FlatList
          style={{
            paddingTop: 20,
            paddingBottom: 20,
          }}
          showsVerticalScrollIndicator={false}
          data={dataList}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
    )
  }
  return (
    <>
      <StatusBar style='light' />
      <Header title='CONTATOS ÚTEIS' navigation={navigation} />
      <Body />
    </>
  )
}

export default ContatosUteis;