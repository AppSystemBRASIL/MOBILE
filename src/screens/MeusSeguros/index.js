import React, { useState, useContext, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert, Image, KeyboardAvoidingView, Platform } from 'react-native';

import Feather from 'react-native-vector-icons/Feather';

import { COLORS } from '../../utils/constants';

import { Input, Skeleton, FormControl, Toast } from 'native-base';
import { maskCPF } from '../../utils/maskedInput';

import firebase from '../../../firebase';

import AsyncStorage from '@react-native-async-storage/async-storage';

import Context from '../../context';

import IMG_CAR from '../../assets/undraw_city_driver_re_0x5e.png';

import { themeDefault } from '../../config';
import { validateCPF } from '../../utils/validateInput';

import { StatusBar } from 'expo-status-bar';

import Header from '../../components/Header';
import { format } from 'date-fns';

const MeusSeguros = ({ navigation, route }) => {  
  const { dataSeguros, setDataSeguros, cpf, setCPF, corretora } = useContext(Context);

  const [loading, setLoading] = useState(true);

  const [errors, setErrors] = useState([]);

  const CPFRef = useRef(null);

  const desvincularSeguros = () => {
    setDataSeguros(null);
    setCPF(null);
    AsyncStorage.removeItem('meusSeguros');
    AsyncStorage.removeItem('cpf');
  }

  useEffect(() => {
    Toast.closeAll();
    buscarSeguros('init');
  }, []);

  const buscarSeguros = async (init) => {
    const array = [];

    if(!cpf) {
      desvincularSeguros();

      return;
    }

    if(!validateCPF(cpf)) {
      if(!validateCPF(cpf)) {
        array.push('CPF');

        if(!init) {
          Alert.alert(
            "CPF Inválido!",
            "Preencha um CPF válido para a consulta.",
            [
              { text: "FECHAR" }
            ],
            { cancelable: false }
          );
        }
      }

      setErrors(array);

      return;
    }

    setLoading(false);
    
    let queryFilter = firebase.firestore().collection('seguros').where('segurado.cpf', '==', cpf);

    if(corretora) {
      queryFilter = queryFilter.where('corretora.uid', '==', corretora.uid);
    }

    queryFilter = queryFilter.where('ativo', '==', true);
    queryFilter = queryFilter.where('seguro.vigenciaFinal', '>=', new Date());
    queryFilter = queryFilter.orderBy('seguro.vigenciaFinal', 'asc');

    queryFilter.onSnapshot((response) => {
      setErrors([]);

      if(!response.empty) {
        const array = [];

        response.forEach((item) => {
          const dataSegurosItem = item.data();
          if(dataSegurosItem.status !== 'cancelado') {
            array.push(dataSegurosItem);
          }
        });

        setDataSeguros(array || null);
        AsyncStorage.setItem('meusSeguros', JSON.stringify(array));
        AsyncStorage.setItem('cpf', cpf);
      }else {
        if(!init) {
          Alert.alert(
            "Nenhum seguro encontrado em nosso sistema.",
            "Entre em contato com sua corretora",
            [
              { text: "FECHAR" }
            ],
            { cancelable: false }
          );
        }

        desvincularSeguros();
      }
    });
                    
    setLoading(true);
  }

  const Body = () => {

    return (
      <KeyboardAvoidingView
        style={{
          flex: 1
        }}
        behavior={Platform.select({
          ios: 'padding',
          android: null,
        })}
      >
        <ScrollView style={{
          paddingTop: 20
        }}>
          {dataSeguros.length > 0 && (
            <TouchableOpacity
              activeOpacity={1}
              onPress={desvincularSeguros}
              style={{
                zIndex: 10,
                borderRadius: 100,
                top: -5,
                left: -5,
                padding: 10,
                width:  '100%',
                textDecorationLine: 'underline'
              }}
            >
              <Text style={{ textAlign: 'center' }}>
                <Text style={{ marginRight: 20 }}>NOVA BUSCA</Text> <Feather color='#333' style={{ marginLeft: 30 }} size={20} name='refresh-ccw' />
              </Text>
            </TouchableOpacity>
          )}
          <View
              activeOpacity={1} 
              style={{
                backgroundColor: 'white',
                borderRadius: 15,
                margin: 5,
                marginBottom: 100,
                paddingHorizontal: 10,
                paddingVertical: 20
              }}
            >
              {!loading ? (
                <>
                  <Skeleton startColor='#d1d1d1' style={{width: '100%', height: 100, marginBottom: 15}} />
                  <Skeleton startColor='#d1d1d1' style={{width: '100%', height: 100, marginBottom: 15}} />
                  <Skeleton startColor='#d1d1d1' style={{width: '100%', height: 100, marginBottom: 15}} />
                  <Skeleton startColor='#d1d1d1' style={{width: '100%', height: 100, marginBottom: 15}} />
                  <Skeleton startColor='#d1d1d1' style={{width: '100%', height: 100, marginBottom: 15}} />
                  <Skeleton startColor='#d1d1d1' style={{width: '100%', height: 100, marginBottom: 15}} />
                  <Skeleton startColor='#d1d1d1' style={{width: '100%', height: 100, marginBottom: 15}} />
                </>
              ) : (
                <>
                  
                  {dataSeguros.length > 0 && (
                    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <View>
                          <Feather name='user' size={30} />
                        </View>
                        <View style={{ marginLeft: 10 }}>
                          <Text style={{ fontSize: 20 }}>
                            <Text style={{ fontWeight: 'bold' }}>SEGURADO:</Text>{`\n`}<Text style={{ fontSize: 15 }}>{dataSeguros[0].segurado.nome}</Text>
                          </Text>
                        </View>
                      </View>
                    </View>
                  )}
                  {dataSeguros?.map((item, index) => (
                    <TouchableOpacity
                      onPress={() => {
                        navigation.navigate('infoSeguro', item);
                      }}
                      key={index}
                      activeOpacity={.5}
                      style={{
                        marginTop: 20,
                        backgroundColor: '#f1f1f9',
                        padding: 15,
                        borderRadius: 10,
                        paddingVertical: 20,
                        marginBottom: 20
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 17,
                          color: '#333',
                          fontWeight: '500'
                        }}
                      >
                        <Text style={{fontWeight: 'bold'}}>VEÍCULO{item?.veiculo?.modelo ? ` / MODELO` : ''}:</Text>{'\n'}{String(item.veiculo.veiculo)} {item?.veiculo?.modelo ? `/ ${String(item.veiculo.modelo)}` : ''}{'\n'}
                      </Text>
                      <Text
                        style={{
                          fontSize: 17,
                          color: '#333',
                          fontWeight: '500'
                        }}
                      >
                        <Text>
                          <Text style={{fontWeight: 'bold'}}>VIGÊNCIA:</Text>{'\n'}{format(item.seguro.vigencia.seconds * 1000, 'dd/MM/yyyy')} até {format(item.seguro.vigenciaFinal.seconds * 1000, 'dd/MM/yyyy')} {`\n`}
                        </Text> 
                      </Text>
                      {item?.veiculo?.condutor && (
                        <Text
                          style={{
                            fontSize: 17,
                            color: '#333',
                            fontWeight: '500'
                          }}
                        >
                          <Text style={{fontWeight: 'bold'}}>PRINCIPAL CONDUTOR:</Text> {`\n`+String((item.veiculo.condutor === 'O MESMO' || item.veiculo.condutor === '' || !item.veiculo.condutor) ? item.segurado.nome : item.veiculo.condutor).toUpperCase()} {`\n`}
                        </Text>
                      )}
                      <Text
                        style={{
                          fontSize: 17,
                          color: '#333',
                          fontWeight: '500'
                        }}
                      >
                        <Text style={{fontWeight: 'bold'}}>CEP DE PERNOITE:</Text> {`\n`+String(item.endereco.cep)}
                      </Text>
                      <Text
                        style={{
                          fontSize: 12,
                          fontWeight: 'bold',
                          color: COLORS(corretora ? corretora.layout.theme : themeDefault).primary,
                          marginTop: 10
                        }}
                      >SEGURADORA: {String(item.seguradora.razao_social).toUpperCase()}</Text>
                      {!corretora && (
                        <Text
                          style={{
                            fontSize: 12,
                            fontWeight: 'bold',
                            color: COLORS(corretora ? corretora.layout.theme : themeDefault).primary,
                            marginTop: 3
                          }}
                        >CORRETORA: {String(item.corretora.razao_social).toUpperCase()}</Text>
                      )}
                      <Text
                        style={{
                          fontSize: 12,
                          fontWeight: 'bold',
                          color: COLORS(corretora ? corretora.layout.theme : themeDefault).primary,
                        }}
                      >USO DO VEÍCULO: {String(item?.riscos?.usoVeiculo || 'OUTROS').toUpperCase()}</Text>
                      {!corretora && (
                        <Text
                          style={{
                            fontSize: 12,
                            fontWeight: 'bold',
                            color: COLORS(corretora ? corretora.layout.theme : themeDefault).primary,
                            marginTop: 3
                          }}
                        >CORRETORA: {String(item.corretora.razao_social).toUpperCase()}</Text>
                      )}
                      <View
                        style={{
                          position: 'absolute',
                          top: 10,
                          right: 10,
                          flexDirection: 'row',
                          alignItems: 'center'
                        }}
                      >
                        <Feather name='log-in' size={20} color={COLORS(corretora ? corretora.layout.theme : themeDefault).primary} />
                      </View>
                    </TouchableOpacity>
                  ))}
                </>
              )}
            </View>
        </ScrollView>
      </KeyboardAvoidingView>
    )
  }

  return (
    <View
      style={{
        flex: 1
      }}
    >
      <StatusBar style='light' />
      <Header title='MEUS SEGUROS' navigation={navigation} backHome />
      {dataSeguros ? <Body /> : (
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <ScrollView style={{
            paddingTop: 20
          }}>
            <View
              activeOpacity={1} 
              style={{
                backgroundColor: 'white',
                borderRadius: 15,
                margin: 5,
                marginBottom: 100,
                paddingHorizontal: 10,
                paddingVertical: 20
              }}
            >
              <View style={{
                position: 'relative',
              }}>
                <Image 
                  source={IMG_CAR}
                  style={{
                    width: '100%',
                    height: 250,
                  }}
                />
                <Text
                  style={{
                    color: '#444',
                    fontSize: 15,
                    fontWeight: '600',
                    textAlign: 'center'
                  }}
                >Para que tenha acesso e fique com as informações dos seus seguros registradas na plataforma informe seu CPF.</Text>
              </View>
              <View 
                style={{
                  marginVertical: 20,
                  borderTopWidth: 1,
                  borderColor: '#c1c1c1'
                }}
              />
              <FormControl isInvalid={errors.find(response => response === 'CPF')} style={{
                marginBottom: 30
              }}>
                <Text style={{
                  fontSize: 20,
                  fontWeight: 'bold',
                  marginBottom: 10
                }}>CPF:</Text>
                <Input ref={CPFRef} onSubmitEditing={() => buscarSeguros()} returnKeyType='done' keyboardType='number-pad' value={cpf || ''} onChangeText={(e) => setCPF(maskCPF(e))} style={{ fontSize: 20, padding: 20, fontWeight: '500', borderColor: '#999' }} />
              </FormControl>
              <View>
                <TouchableOpacity
                  onPress={() => buscarSeguros()}
                  style={{
                    backgroundColor: COLORS(corretora ? corretora.layout.theme : themeDefault).primary,
                    padding: 10,
                    paddingVertical: 12,
                    alignItems: 'center',
                    borderRadius: 5,
                  }}
                >
                  <Text
                    style={{
                      fontWeight: '800',
                      color: 'white',
                      fontSize: 20,
                    }}
                  >BUSCAR</Text>
                  <Feather style={{
                    position: 'absolute',
                    right: 20,
                    top: '50%'
                  }} name='search' color='white' size={25} />
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      )}
    </View>
  )
}

export default MeusSeguros;