import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Linking } from 'react-native'

import Feather from 'react-native-vector-icons/Feather';

import firebase from '../../../firebase';

import Header from '../../components/Header';

import { StatusBar } from 'expo-status-bar';

const ContatosUteis = ({ navigation }) => {

  const [corretoras, setCorretoras] = useState([]);

  useEffect(() => {
    firebase.firestore().collection('seguradoras').get()
    .then((snapshot) => {
      if(!snapshot.empty) {
        const array = [];

        snapshot.forEach((item) => {
          array.push(item.data());
        });

        setCorretoras(array);
      }
    });
  }, []);

  const Body = () => {
    const renderItem = ({ item, index }) => {
      return (
        <>
          <Text style={{paddingHorizontal: 10, color: '#555', paddingBottom: 10, fontSize: 20, fontWeight: '800'}}>SEGURADORAS</Text>
          {corretoras.map((item1, index1) => (
            <View key={index1}>
              {corretoras.length > 0 && (
                <View>
                  <TouchableOpacity
                    key={String(index1)}
                    onPress={() => {
                      Linking.openURL(`tel:${String(item1.contatos[0].telefones[1].telefone).split('(').join('').split(')').join('').split('-').join('').split(' ').join('')}`)
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
                      marginBottom: (index1 + 1) === corretoras.length ? 100 : 0,
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
                      <View style={{
                        marginTop: 5
                      }}>
                        <Text style={{
                          color: '#888',
                          fontSize: 17,
                          fontWeight: '800',
                          marginTop: 5
                        }}>
                          {item1.contatos[0].telefones[1].length > 0 ? item1.contatos[0].telefones[1].telefone : item1.contatos[0].telefones[0].telefone}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          ))}
        </>
      )
    }

    return (
      <View style={{
        flex: 1,
      }}>
        <FlatList
          style={{
            paddingTop: 20
          }}
          showsVerticalScrollIndicator={false}
          data={['']}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
    )
  }

  return (
    <>
      <StatusBar style='light' />
      <Header title='SEGURADORAS' navigation={navigation} />
      <Body />
    </>
  )
}

export default ContatosUteis;