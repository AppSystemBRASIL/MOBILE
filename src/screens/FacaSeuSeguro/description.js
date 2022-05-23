import { useEffect, useState } from 'react';

import { Button } from 'native-base';
import { View, Text } from 'react-native';

import useAuth from '../../hooks/useAuth';

import { COLORS } from '../../utils/constants';

import seguros from '../../data/seguros';
import { useNavigation, useRoute } from '@react-navigation/native';
import Header from '../../components/Header';

export default function Description({ type }) {
  const { navigate } = useNavigation();

  const { index: indexView, tipo, show: showInd } = useRoute().params;

  const { corretora } = useAuth();
  const colorPrimary = COLORS(corretora ? corretora.layout.theme : themeDefault).primary;

  const infoSeguro = seguros.filter(e => e.tipo === (type || tipo))[0];
  
  const data = infoSeguro?.info || null;
  const dataIndex = infoSeguro?.infos || null;

  const [show, setShow] = useState((indexView >= 0 || showInd) ? true : false);

  return (
    <>
      {(indexView >= 0 || showInd) && <Header title={infoSeguro.title} />}
      <View
        style={{ flex: 1, padding: 10, paddingBottom: 100 }}
      >
        <View style={{
          backgroundColor: '#FFFFFF',
          borderRadius: 5,
          padding: 15,
        }}>
          {!show && (
            <Button background={colorPrimary} style={{
              alignContent: 'center',
              alignItems: 'center',
              justifyContent: 'center',
            }} onPress={() => navigate('formularioSeguro', {
              tipo: type || tipo
            })}>
              <Text
                style={{
                  color: '#FFFFFF',
                  fontWeight: 'bold',
                  fontSize: 20,
                  textAlign: 'center'
                }}
              >FAZER COTAÇÃO</Text>
            </Button>
          )}
          {!show ? typeof data === 'boolean' ? (
            <>
              <Text style={{
                fontWeight: 'bold',
                marginTop: 20,
                fontSize: 20,
              }}>
                INFORMAÇÕES:
              </Text>
              {dataIndex?.map((item, index) => (
                <Button key={index} background={colorPrimary} style={{
                  marginTop: 30,
                  alignContent: 'center',
                  alignItems: 'center',
                  justifyContent: 'center',
                }} onPress={() => !show && navigate('informacaoSeguro', {
                  index: index,
                  tipo: type || tipo
                })}>
                  <Text
                    style={{
                      color: '#FFFFFF',
                      fontWeight: 'bold',
                      fontSize: 20,
                      textAlign: 'center'
                    }}
                  >{item?.title?.toUpperCase()}</Text>
                </Button>
              ))}
            </>
          ) : (
            <Button background={colorPrimary} style={{
              marginTop: 30,
              alignContent: 'center',
              alignItems: 'center',
              justifyContent: 'center',
            }} onPress={() => navigate('informacaoSeguro', {
                tipo: type || tipo,
                show: true
              })}>
              <Text
                style={{
                  color: '#FFFFFF',
                  fontWeight: 'bold',
                  fontSize: 20,
                  textAlign: 'center'
                }}
              >INFORMAÇÕES</Text>
            </Button>
          ) : (
            <View>
              {typeof data === 'boolean' ? dataIndex[indexView]?.content : data}
              <Button background={colorPrimary} style={{
                alignContent: 'center',
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: 20
              }} onPress={() => navigate('formularioSeguro', {
                  tipo: type || tipo
                })}>
                <Text
                  style={{
                    color: '#FFFFFF',
                    fontWeight: 'bold',
                    fontSize: 20,
                    textAlign: 'center'
                  }}
                >FAZER COTAÇÃO</Text>
              </Button>
            </View>
          )}
        </View>
      </View>
    </>
  )
}