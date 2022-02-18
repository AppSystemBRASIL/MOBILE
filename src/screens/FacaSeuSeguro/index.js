import React, { useContext } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native'
import { COLORS, SIZES } from '../../utils/constants';

import Header from '../../components/Header';

import Feather from 'react-native-vector-icons/Feather';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import Context from '../../context';
import { themeDefault } from '../../config';
import { StatusBar } from 'expo-status-bar';

const tipoSeguro = [
  {
    title: 'VEICULO',
    icon: 'car',
    tipo: 'veicular'
  },
  {
    title: 'RESIDÊNCIA',
    icon: 'home',
    tipo: 'residencial',
  },
  {
    title: 'CONDOMÍNIO',
    icon: 'city',
    tipo: 'condominio'
  },
  {
    title: 'VIDA',
    icon: 'procedures',
    tipo: 'vida'
  },
  {
    title: 'SAÚDE',
    icon: 'heartbeat',
    tipo: 'saude'
  },
  {
    title: 'PREVIDÊNCIA',
    icon: 'file-invoice-dollar',
    tipo: 'previdencia'
  },
  {
    title: 'CONSÓRCIO',
    icon: 'file-contract',
    tipo: 'consorcio'
  },
  {
    title: 'VIAGEM',
    icon: 'plane-departure',
    tipo: 'viagem'
  },
  {
    title: 'OUTROS',
    icon: 'info-circle',
    tipo: 'outros'
  },
]

const FazerSeuSeguro = ({ navigation }) => {
  const { corretora } = useContext(Context);

  const Body = () => {
    const renderItem = ({item, index}) => {
      return (
        <TouchableOpacity
          key={index}
          onPress={() => {
            navigation.navigate('formSeguro', item);
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
            marginBottom: (index + 1) === tipoSeguro.length ? 100 : 0,
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
              <FontAwesome5 size={40} color='#444' name={item.icon} />
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
          style={{paddingTop: 20}}
          showsVerticalScrollIndicator={false}
          scrollEnabled={true}
          data={tipoSeguro}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
    )
  }

  return (
    <> 
      <StatusBar style='light' />
      <Header title='FAÇA SUA COTAÇÃO' navigation={navigation} />
      <Body />
    </>
  )
}

export default FazerSeuSeguro;