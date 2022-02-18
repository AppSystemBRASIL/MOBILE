import React, { useEffect, useState, useContext } from 'react';
import { View, Text, ScrollView, Linking } from 'react-native'
import { COLORS, SIZES } from '../../utils/constants';

import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import firebase from '../../../firebase';

import { Skeleton } from 'native-base';

import Context from '../../context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar } from 'expo-status-bar';

import Header from '../../components/Header';

const ComoProcederInfoContent = ({ route, navigation }) => {
  const item = route.params;

  const { corretora } = useContext(Context);

  const Body = () => {
    const [loading, setLoading] = useState(false);

    const [dataSeguro, setDataSeguro] = useState(item);

    useEffect(() => {
      firebase.firestore().collection('corretoras').doc(item.corretora.uid).get()
      .then(async (response) => {
        if(response.exists) {
          const dataTrated = {
            razao_social: response.data().razao_social,
            contatosUteis: response.data().contatosUteis
          }

          await AsyncStorage.setItem(`corretora_${item.corretora.uid}_dados`, JSON.stringify(dataTrated))

          setDataSeguro(value => ({
            ...value,
            ...dataTrated
          }));
        }
      })
      .catch(async () => {
        const dataTrated = await AsyncStorage.getItem(`corretora_${item.corretora}_dados`)
        .then((response) => {
          if(response) {
            return JSON.parse(response);
          }
        });

        setDataSeguro(value => ({
          ...value,
          ...dataTrated
        }));
      })
      .finally(() => {
        setLoading(true);
      })
    }, []);

    if(dataSeguro.tipo !== 'veicular') {
      return <></>;
    }

    return (
      <ScrollView 
        showsVerticalScrollIndicator={false}
        style={{
          flex: 1,
          paddingTop: 20
        }}
      >
        <View
          activeOpacity={1} 
          style={{
            backgroundColor: 'white',
            borderRadius: 15,
            margin: 5,
            marginBottom: 100,
            paddingHorizontal: 20,
            paddingTop: 30,
          }}
        >
          <View
            style={{
              alignSelf: 'center'
            }}
          >
            {loading ? (
              <Text style={{
                color: '#444',
                fontSize: 20,
                fontWeight: '800',
                textAlign: 'center',
                marginBottom: 10
              }}>
                {String(dataSeguro.veiculo.tipo).toUpperCase()}
              </Text>
            ) : (
              <Skeleton startColor='gray.100' endColor='gray.300' style={{width: 140, height: 27, marginBottom: 10}} />
            )}
          </View>
          {loading ? (
            <View
              style={{
                borderBottomColor: '#999',
                borderBottomWidth: 1,
              }}
            />
          ) : (
            <Skeleton startColor='gray.100' endColor='gray.300' style={{width: '100%', height: 1.5, marginBottom: 10}} />
          )}
          <View style={{
            marginTop: 20,
            width: '100%',
            height: '100%',
            flexDirection: 'row'
          }}>
            <View
              style={{
                width: '10%',
                marginRight: 20,
                alignItems: 'center'
              }}
            >
              {loading ? (
                <>
                  <FontAwesome style={{ marginBottom: 15 }} name={dataSeguro.veiculo.tipo === 'automóvel' ? 'car' : dataSeguro.veiculo.tipo === 'motocicleta' ? 'motorcycle' : 'truck'} size={30} color='#555' />
                  <View
                    style={{
                      borderLeftWidth: 1,
                      height: '85%',
                      borderColor: '#999'
                    }}
                  />
                </>
              ) : (
                <>
                  <Skeleton startColor='gray.100' endColor='gray.300' style={{width: '100%', height: 35, marginBottom: 15}} />
                  <Skeleton startColor='gray.100' endColor='gray.300' style={{width: 2, height: '85%', marginBottom: 15}} />
                </>
              )}
              
            </View>
            <View>
              <View style={{
                marginBottom: 20
              }}>
                {loading ? (
                  <>
                    <Text style={{fontWeight: 'bold', fontSize: 20}}>PLACA:</Text>
                    <Text style={{fontWeight: '900', fontSize: 25, color: '#555'}}>{dataSeguro.veiculo.placa}</Text>
                  </>
                ) : (
                  <>
                    <Skeleton startColor='gray.100' endColor='gray.300' style={{width: 70, height: 23, marginBottom: 5}} />
                    <Skeleton startColor='gray.100' endColor='gray.300' style={{width: 140, height: 27}} />
                  </>
                )}
              </View>
              <View style={{
                marginBottom: 20
              }}>
                {loading ? (
                  <>
                    <Text style={{fontWeight: 'bold', fontSize: 20}}>FINAL DA VIGÊNCIA:</Text>
                    <Text style={{fontWeight: '900', fontSize: 25, color: '#555'}}>{dataSeguro.finalVigencia}</Text>
                  </>
                ) : (
                  <>
                    <Skeleton startColor='gray.100' endColor='gray.300' style={{width: 195, height: 23, marginBottom: 5}} />
                    <Skeleton startColor='gray.100' endColor='gray.300' style={{width: 150, height: 27}} />
                  </>
                )}
              </View>
              <View style={{
                marginBottom: 20
              }}>
                {!corretora && (
                  <>
                    {loading ? (
                      <>
                        <Text style={{fontWeight: 'bold', fontSize: 20}}>CORRETORA:</Text>
                        <Text style={{fontWeight: '900', color: '#555', fontSize: String(dataSeguro.razao_social).length > 20 ? 22 : 25}}>{dataSeguro.razao_social}</Text>
                      </>
                    ) : (
                      <>
                        <Skeleton startColor='gray.100' endColor='gray.300' style={{width: 170, height: 23, marginBottom: 5}} />
                        <Skeleton startColor='gray.100' endColor='gray.300' style={{width: 300, height: 27}} />
                      </>
                    )}
                  </>
                )}
              </View>
              <View style={{
                marginBottom: 20
              }}>
                {loading ? (
                  <>
                    <Text style={{fontWeight: 'bold', fontSize: 20, marginBottom: 10}}>ASSISTÊNCIA 24 HORAS:</Text>
                    {dataSeguro.contatosUteis.map((itemContato, indexContato) => (
                      <View key={indexContato} style={{
                        marginBottom: 25
                      }}>
                        <Text style={{fontSize: 15, fontWeight: 'bold', marginBottom: 5}}>{itemContato.titulo}</Text>
                        {itemContato.telefones.map((itemTelefone, indexTelefone) => (
                          <View key={indexTelefone}>
                            <Text onPress={() => {
                              Linking.openURL(`tel:${String(itemTelefone.telefone).split('+55').join('').split(' ').join('').split('(').join('').split(')').join('').split('-').join('')}`)
                            }} style={{fontSize: 20, fontWeight: 'bold', marginBottom: 3}}>{itemTelefone.telefone}</Text>
                            <Text style={{marginBottom: 10}}>({itemTelefone.locais})</Text>
                          </View>
                        ))}
                      </View>
                    ))}
                  </>
                ) : (
                  <>
                    <Skeleton startColor='gray.100' endColor='gray.300' style={{width: 170, height: 23, marginBottom: 5}} />
                    <Skeleton startColor='gray.100' endColor='gray.300' style={{width: 300, height: 300}} />
                  </>
                )}
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    )
  }

  return (
    <>
      <StatusBar style='light' />
      <Header title={`PLACA: ${item.veiculo.placa}`} navigation={navigation} />
      <Body />
    </>
  )
}

export default ComoProcederInfoContent;