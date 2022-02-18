import React, { useState, useContext, useRef } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert, Image, KeyboardAvoidingView } from 'react-native';

import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import { COLORS, SIZES } from '../../utils/constants';

import { Input, Skeleton, FormControl, WarningOutlineIcon } from 'native-base';
import { maskCPF, maskDate } from '../../utils/maskedInput';

import firebase from '../../../firebase';

import AsyncStorage from '@react-native-async-storage/async-storage';

import Context from '../../context';

import IMG_CAR from '../../assets/undraw_city_driver_re_0x5e.png';

import { themeDefault } from '../../config';
import { validateCPF, validateDate } from '../../utils/validateInput';
import { StatusBar } from 'expo-status-bar';

import Header from '../../components/Header';

const MeusSeguros = ({ navigation }) => {  
  const { corretora } = useContext(Context);
  

  const Body = () => {
    const CPFRef = useRef(null);
    const nascimentoRef = useRef(null);

    const [CPF, setCPF] = useState('');
    const [nascimento, setNascimento] = useState('');

    const [loading, setLoading] = useState(true);

    const { dataSeguros, setDataSeguros } = useContext(Context);

    const [errors, setErrors] = useState([]);

    const desvincularSeguros = () => {
      setDataSeguros(null);
      AsyncStorage.removeItem('meusSeguros');
    }

    const buscarSeguros = async () => {
      const array = [];

      if(!validateCPF(CPF)) {
        if(!validateCPF(CPF)) {
          array.push('CPF');
        }

        setErrors(array);
        return;
      }

      setLoading(false);

      let queryFilter = firebase.firestore().collection('seguros').where('usuario.cpf', '==', CPF);

      if(corretora) {
        queryFilter = queryFilter.where('corretora.uid', '==', corretora.uid);
      }

      await queryFilter.get()
      .then((response) => {
        if(!response.empty) {
          const array = [];

          response.forEach((item) => {
            array.push(item.data());
          });

          setDataSeguros(array);
          AsyncStorage.setItem('meusSeguros', JSON.stringify(array));
        }else {
          Alert.alert(
            "Nenhum seguro encontrado em nosso sistema.",
            "",
            [
              { text: "FECHAR" }
            ],
            { cancelable: false }
          );
        }
      })
      .catch((error) => {
        Alert.alert(
          "Ocorreu algum erro na busca.",
          "",
          [
            { text: "FECHAR" }
          ],
          { cancelable: false }
        );

        setDataSeguros(null);
        setLoading(false);

        console.log(error);
      });
                      
      setLoading(true);
    }
    
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
        <ScrollView showsVerticalScrollIndicator={false} style={{
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
            ) : dataSeguros ? (
              <>
                <TouchableOpacity
                  activeOpacity={1}
                  onPress={desvincularSeguros}
                  style={{
                    zIndex: 10,
                    borderRadius: 100,
                    backgroundColor: '#333',
                    position: 'absolute', 
                    top: -5,
                    left: -5,
                    padding: 10
                  }}
                >
                  <Feather color='white' size={20} name='refresh-ccw' />
                </TouchableOpacity>
                {[...dataSeguros].map((item, index) => (
                  <TouchableOpacity
                    onPress={() => {
                      navigation.navigate('infoSeguro', item);
                    }}
                    key={index}
                    activeOpacity={.5}
                    style={{
                      backgroundColor: '#f1f1f9',
                      padding: 15,
                      borderRadius: 10,
                      paddingVertical: 20,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 20,
                        fontWeight: 'bold'
                      }}
                    >{String(item.usuario.nome).toUpperCase()}</Text>
                    <Text
                      style={{
                        fontSize: 17,
                        color: '#333',
                        fontWeight: '500'
                      }}
                    ><Text style={{fontWeight: 'bold'}}>PLACA:</Text> {String(item.veiculo.placa)}</Text>
                    {!corretora && (
                      <Text
                        style={{
                          fontSize: 12,
                          fontWeight: 'bold',
                          color: COLORS(corretora ? corretora.layout.theme : themeDefault).primary,
                          marginTop: 10
                        }}
                      >CORRETORA: {String(item.corretora.razao_social).toUpperCase()}</Text>
                    )}
                    <FontAwesome name={item.veiculo.tipo === 'automóvel' ? 'car' : item.veiculo.tipo === 'motocicleta' ? 'motorcycle' : 'truck'} size={35} color='#555'
                      style={{
                        position: 'absolute',
                        zIndex: 0,
                        right: 10,
                        bottom: !corretora ? 10 : 5
                      }}
                    />
                    <View
                      style={{
                        position: 'absolute',
                        top: 5,
                        right: 10,
                        flexDirection: 'row',
                        alignItems: 'center'
                      }}
                    >
                      <Feather name='link-2' size={20} color={COLORS(corretora ? corretora.layout.theme : themeDefault).primary} />
                    </View>
                  </TouchableOpacity>
                ))}
              </>
            ) : (
              <>
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
                  <Input ref={CPFRef} onSubmitEditing={buscarSeguros} returnKeyType='done' keyboardType='number-pad' value={CPF} onChangeText={(e) => setCPF(maskCPF(e))} style={{ fontSize: 20, padding: 20, fontWeight: '500', borderColor: '#999' }} />
                  <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                    Campo inválido
                  </FormControl.ErrorMessage>
                </FormControl>
                <View>
                  <TouchableOpacity
                    onPress={buscarSeguros}
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
      <Header title='MEUS SEGUROS' navigation={navigation} />
      <Body />
    </View>
  )
}

export default MeusSeguros;