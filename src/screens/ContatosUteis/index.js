import React, { useContext, useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Linking } from 'react-native'
import { COLORS, SIZES } from '../../utils/constants';

import Feather from 'react-native-vector-icons/Feather';
import Context from '../../context';

import firebase from '../../../firebase';

import Header from '../../components/Header';

import { Divider } from 'native-base';
import { themeDefault } from '../../config';
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
  {
    key: 1,
    text: 'POLÍCIA RODOVÍARIA FEDEREAL',
    phone: '198'
  }
]

const ContatosUteis = ({ navigation }) => {
  const { corretora } = useContext(Context);

  const [corretoras, setCorretoras] = useState([]);

  const [loadingCorretoras, setLoadingCorretoras] = useState(false);

  useEffect(() => {
    if(!corretora) {
      firebase.firestore().collection('corretoras').get()
      .then((snapshot) => {
        if(!snapshot.empty) {
          const array = [];

          snapshot.forEach((item) => {
            array.push(item.data());
          });

          setCorretoras(array);
          setLoadingCorretoras(true);
        }
      });
    }
  }, []);

  const Body = () => {
    const renderItem = ({ item, index }) => {
      return (
        <>
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
          {(((Number(index) + 1) === dataList.length) && !corretora) && (
            <>
              {corretoras.map((item1, index1) => (
                <View key={index1}>
                  {corretoras.length > 0 && (
                    <View>
                      <Divider my="2" />
                      <Text style={{paddingHorizontal: 10, color: '#555', fontSize: 20, fontWeight: '800'}}>CORRETORAS</Text>
                      <Divider my="2" />
                      <TouchableOpacity
                        key={String(index1)}
                        onPress={() => {
                          Linking.openURL(`tel:${String(item1.telefone).split('(').join('').split(')').join('').split('-').join('').split(' ').join('')}`)
                        }}
                        activeOpacity={1} 
                        style={{
                          backgroundColor: 'white',
                          flexDirection: 'row',
                          alignItems: 'center',
                          borderRadius: 15,
                          flex: 1,
                          height: 100,
                          margin: 5,
                          padding: 5,
                          marginBottom: (index1 + 1) === corretoras.length && 100,
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
                            fontSize: String(item1.text).length > 25 ? 17 : 20,
                            fontWeight: '800',
                          }}>
                            {item1.razao_social}
                          </Text>
                          <Text style={{
                            color: '#888',
                            fontSize: 17,
                            fontWeight: '800',
                            marginTop: 5
                          }}>
                            {item1.telefone}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              ))}
            </>
          )}
        </>
      )
    }

    return (
      <View style={{
        flex: 1,
        paddingTop: 20
      }}>
        <FlatList
          showsVerticalScrollIndicator={false}
          scrollEnabled={loadingCorretoras}
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