import React from 'react';
import { View, Text, ScrollView, Image } from 'react-native'

import Header from '../../components/Header';

import Feather from 'react-native-vector-icons/Feather';

import { StatusBar } from 'expo-status-bar';

const facilidades = [
  'SEM BUROCRACIA',
  'SEM ANÁLISE DE PERFIL',
  'SEM DISTINÇÃO DE CONDUTOR'
];

const beneficios = [
  'REBOQUE 24H',
  'PROTEÇÃO A TERCEIROS',
  'PROTEÇÃO PARA VIDROS',
  'ROUBO/FURTO',
  'ACIDENTE PESSOAL',
  'CARRO RESERVA',
  'AUXÍLIO FUNERAL',
  'TROCA DE PNEU',
  'HOSPEDAGEM EMERGENCIAL',
  'CARGA DE BATERIA',
  'CHAVEIRO'
];

const MeusBeneficios = ({ navigation }) => {
  const Body = () => {
    return (
      <ScrollView showsVerticalScrollIndicator={false} style={{
        flex: 1,
      }}>
        <View
          style={{
            borderRadius: 15,
            margin: 5,
            marginBottom: 100,
            paddingHorizontal: 0,
            paddingTop: 20,
            paddingBottom: 50,
          }}
        >
          <View
            style={{
              backgroundColor: 'white',
              paddingTop: 20,
              paddingBottom: 20,
              paddingHorizontal: 10,
              borderRadius: 10
            }}
          >
            <View>
              <Text style={{
                color: '#444',
                fontSize: 25,
                fontWeight: '800',
                textAlign: 'center',
                marginBottom: 10
              }}>
                FACILIDADES
              </Text>
            </View>
            <View
              style={{
                borderBottomColor: '#999',
                borderBottomWidth: 1,
              }}
            />
            <View>
              {facilidades.map((item, index) => (
                <Text key={index} style={{
                  color: '#444',
                  fontSize: 20,
                  fontWeight: '800',
                  marginTop: 10
                }}>
                  <Feather name='check' size={25}  /> {item}
                </Text>
              ))}
            </View>
          </View>
          <View
            style={{
              backgroundColor: 'white',
              marginTop: 70,
              paddingTop: 20,
              paddingBottom: 20,
              paddingHorizontal: 10,
              borderRadius: 10
            }}
          >
            <View>
              <Text style={{
                color: '#444',
                fontSize: 25,
                fontWeight: '800',
                textAlign: 'center',
                marginBottom: 10,
              }}>
                BENEFÍCIOS
              </Text>
            </View>
            <View
              style={{
                borderBottomColor: '#999',
                borderBottomWidth: 1,
                marginBottom: 10
              }}
            />
            <View>
              {beneficios.map((item, index) => (
                <Text key={index} style={{
                  color: '#444',
                  fontSize: 20,
                  fontWeight: '800',
                  marginTop: 10
                }}>
                  <Feather name='check' size={25}  /> {item}
                </Text>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
    )
  }

  return (
    <>
      <StatusBar style='light' />
      <Header navigation={navigation} title={'LEITURA OBRIGATÓRIA'} />
      <Body />
    </>
  )
}

export default MeusBeneficios;