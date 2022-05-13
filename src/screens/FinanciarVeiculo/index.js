import React, { useContext, useEffect, useRef, useState } from 'react';
import { View, Text, ScrollView, Platform, TouchableOpacity, KeyboardAvoidingView, Alert } from 'react-native'
import { COLORS } from '../../utils/constants';

import { Input, Modal, Spinner, WarningOutlineIcon, FormControl } from 'native-base';

import Feather from 'react-native-vector-icons/Feather';

import Header from '../../components/Header';

import generateToken from '../../hooks/generateToken';

import { maskCEP, maskCPF, maskCurrency, maskLetters, maskPhone } from '../../utils/maskedInput';

import firebase from '../../../firebase';
import { validateCEP, validateCPF, validatePhone } from '../../utils/validateInput';
import axios from 'axios';
import { themeDefault } from '../../config';
import Context from '../../context';
import { StatusBar } from 'expo-status-bar';

const FinanciarVeiculo = ({ navigation }) => {
  const { corretor, corretora } = useContext(Context);

  const Body = () => {
    const cpfRef = useRef();
    const cepRef = useRef();
    const nomeCompletoRef = useRef();
    const celularRef = useRef();
    const valorVeiculoRef = useRef();
    const valorEntradaRef = useRef();

    const [nomeCompleto, setNomeCompleto] = useState('');
    const [CPF, setCPF] = useState('');
    const [CEP, setCEP] = useState('');
    const [celular, setCelular] = useState('');
    const [valorVeiculo, setValorVeiculo] = useState('');
    const [valorEntrada, setValorEntrada] = useState('');

    const [errors, setErrors] = useState([]);

    const [showModalLoading, setShowModalLoading] = useState(false);

    const [returnFinanciamento, setReturnFinanciamento] = useState(null);

    useEffect(() => {
      if(returnFinanciamento === 'success') {
        setNomeCompleto('');
        setCPF('');
        setCEP('');
        setCelular('');
        setValorVeiculo('');
        setValorEntrada('');
      }
    }, [returnFinanciamento]);

    const enviarFinanciamento = async () => {
      const error = [];

      if(!validateCPF(CPF) || !validateCEP(CEP) || !nomeCompleto || !validatePhone(celular) || !valorEntrada || !valorVeiculo) {
        if(!validateCPF(CPF)) {
          error.push('CPF');
        }

        if(!validateCEP(CEP)) {
          error.push('CEP');
        }

        if(!nomeCompleto) {
          error.push('nomeCompleto');
        }

        if(!validatePhone(celular)) {
          error.push('celular');
        }

        if(!valorEntrada) {
          error.push('valorEntrada');
        }

        if(!valorVeiculo) {
          error.push('valorVeiculo');
        }else {
          const veiculoValor = Number(valorVeiculo.split('R$ ').join('').split(/./).join('').split(',').join('.'));
          const veiculoEntrada = Number(valorVeiculo.split('R$ ').join('').split(/./).join('').split(',').join('.'));

          if(veiculoEntrada >= veiculoValor) {
            error.push('valorVeiculo');
          }
        }

        setErrors(error);
        setReturnFinanciamento('error');

        return;
      }

      const veiculoValor = Number(valorVeiculo.split('R$ ').join('').split('.').join('').split(',').join('.'));
      const veiculoEntrada = Number(valorEntrada.split('R$ ').join('').split('.').join('').split(',').join('.'));
      
      if(veiculoEntrada >= veiculoValor) {
        error.push('valorVeiculo');
      }

      const cepValid = await axios.get(`https://viacep.com.br/ws/${CEP.split('-').join('')}/json/`);

      if(cepValid.erro) {
        error.push('CEP');
      }

      setErrors(error);

      if((veiculoEntrada >= veiculoValor) || (cepValid.erro)) {
        return;
      }

      setShowModalLoading(true);

      const data = {
        corretora: corretora ? {
          uid: corretora.uid,
          razao_social: corretora.razao_social
        } : null,
        corretor: corretor ? {
          uid: corretor.uid,
          nome: corretor.nomeCompleto,
        } : null,
        endereco: {
          cep: CEP
        },
        financiado: {
          nome: nomeCompleto,
          cpf: CPF,
          celular: celular
        },
        valores: {
          entrada: valorEntrada,
          veiculo: {
            valor: valorVeiculo
          },
        },
        uid: generateToken()
      };

      await firebase.firestore().collection('solicitacaoFinanciamento').doc(data.uid).set(data, { merge: true })
      .then(() => {
        setReturnFinanciamento('success');
      })
      .catch((error) => {
        Alert.alert(
          "Ocorreu algum erro no envio.",
          "",
          [
            { text: "FECHAR" }
          ],
          { cancelable: false }
        );
      })
      .finally(() => {
        setTimeout(() => {
          setReturnFinanciamento(null);
          setShowModalLoading(false);
        }, 3000);
      })
    }

    return (
      <KeyboardAvoidingView
        style={{
          flex: 1,
        }}
        behavior={Platform.select({
          ios: 'padding',
          android: null,
        })}
      >
        <Modal size='lg' isOpen={showModalLoading}>
          <Modal.Content>
            <Modal.Body>
              <View
                style={{
                  paddingVertical: 30,
                  paddingHorizontal: 10
                }}
              >
                {returnFinanciamento === 'success' ? (
                  <>
                    <View style={{
                      backgroundColor: 'green',
                      borderRadius: 100,
                      alignItems: 'center',
                      alignSelf: 'center',
                      paddingVertical: 15,
                      paddingHorizontal: 15,
                      marginBottom: 20
                    }}>
                      <Feather size={100} color='white' name='check-circle' />
                    </View>
                    <Text style={{color: 'green', fontSize: 25, fontWeight: '700', textAlign: 'center'}}>ENVIADO COM SUCESSO!</Text>
                    <Text style={{color: '#444', fontSize: 20, fontWeight: '500', textAlign: 'center', marginTop: 10}}>
                      Você receberá um contato em até 24horas para sua cotação de financiamento.
                    </Text>
                  </>
                ) : (
                  <>
                    <Spinner marginBottom={25} color={COLORS(corretora ? corretora.layout.theme : themeDefault).primary} size='lg' />
                    <Text style={{color: '#444', fontSize: 30, fontWeight: '700', textAlign: 'center'}}>ENVIANDO...</Text>
                  </>
                )}
              </View>
            </Modal.Body>
          </Modal.Content>
        </Modal>
        <ScrollView showsVerticalScrollIndicator={false} style={{ paddingTop: 20 }}>
          <View
            activeOpacity={1} 
            style={{
              backgroundColor: 'white',
              borderRadius: 15,
              margin: 5,
              marginBottom: 100,
              paddingHorizontal: 20,
              paddingTop: 30,
              paddingBottom: 50
            }}
          >
            <FormControl style={{marginTop: 20}} isInvalid={errors.find(response => response === 'nomeCompleto')}>
              <Text style={{ fontSize: 20, fontWeight: '600', marginBottom: 5 }}>NOME COMPLETO:</Text>
              <Input borderColor='#999' ref={nomeCompletoRef} value={nomeCompleto} returnKeyType='done' placeholder='Seu nome completo' keyboardType='default' style={{
                borderWidth: 1,
                borderRadius: 5,
                padding: 10,
                fontSize: 20,
                color: 'black',
                fontWeight: '700',
                textTransform: 'uppercase',
                borderColor: 'transparent',
              }} autoCapitalize='characters' autoCorrect={false} autoCompleteType='off' onChangeText={(e) => setNomeCompleto(maskLetters(String(e).toUpperCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "")))} onSubmitEditing={() => {
                if(String(nomeCompleto).split(' ')[2]) {
                  celularRef.current.focus();
                }else {
                  Alert.alert(
                    "Preencha seu nome completo",
                    "",
                    [
                      { text: "OK", onPress: () => celularRef.current.focus() }
                    ],
                    { cancelable: false }
                  );
                }
              }} />
              <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                Campo inválido
              </FormControl.ErrorMessage>
            </FormControl>
            <FormControl style={{marginTop: 20}} isInvalid={errors.find(response => response === 'celular')}>
              <Text style={{ fontSize: 20, fontWeight: '600', marginBottom: 5 }}>CELULAR:</Text>
              <Input maxLength={15} borderColor='#999' ref={celularRef} value={celular} returnKeyType='done' placeholder='(00) 00000-0000' keyboardType='number-pad' 
                onChangeText={(e) => setCelular(maskPhone(e))}
                style={{
                  borderWidth: 1,
                  borderRadius: 5,
                  padding: 10,
                  fontSize: 20,
                  color: 'black',
                  fontWeight: '700',
                  borderColor: 'transparent',
                }}
                onSubmitEditing={() => {
                  if(String(celular).length === 15) {
                    cpfRef.current.focus();
                  }else {
                    if(String(celular).length === 0) {
                      Alert.alert(
                        "Preencha seu celular",
                        "",
                        [
                          { text: "OK", onPress: () => celularRef.current.focus() }
                        ],
                        { cancelable: false }
                      );
                    }else {
                      Alert.alert(
                        "Celular inválido",
                        "",
                        [
                          { text: "OK", onPress: () => celularRef.current.focus() }
                        ],
                        { cancelable: false }
                      );
                    }
                  }
                }}
              />
              <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                Campo inválido
              </FormControl.ErrorMessage>
            </FormControl>
            <FormControl style={{marginTop: 20}} isInvalid={errors.find(response => response === 'CPF')}>
              <Text style={{ fontSize: 20, fontWeight: '600', marginBottom: 5 }}>CPF:</Text>
              <Input maxLength={14} borderColor='#999' ref={cpfRef} value={CPF} returnKeyType='done' placeholder='000.000.000-00' keyboardType='number-pad' 
                onChangeText={(e) => setCPF(maskCPF(e))}
                style={{
                  borderWidth: 1,
                  borderRadius: 5,
                  padding: 10,
                  fontSize: 20,
                  color: 'black',
                  fontWeight: '700',
                  borderColor: 'transparent',
                }}
                onSubmitEditing={() => {
                  if(String(CPF).length === 14) {
                    cepRef.current.focus();
                  }else {
                    if(String(CPF).length === 0) {
                      Alert.alert(
                        "Preencha seu CPF",
                        "",
                        [
                          { text: "OK", onPress: () => cpfRef.current.focus() }
                        ],
                        { cancelable: false }
                      );
                    }else {
                      Alert.alert(
                        "CPF inválido",
                        "",
                        [
                          { text: "OK", onPress: () => cpfRef.current.focus() }
                        ],
                        { cancelable: false }
                      );
                    }
                  }
                }}
              />
              <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                Campo inválido
              </FormControl.ErrorMessage>
            </FormControl>
            <FormControl style={{marginTop: 20}} isInvalid={errors.find(response => response === 'CEP')}>
              <Text style={{ fontSize: 20, fontWeight: '600', marginBottom: 5 }}>CEP:</Text>
              <Input maxLength={9} borderColor='#999' ref={cepRef} value={CEP} returnKeyType='done' placeholder='00000-000' keyboardType='number-pad' 
                onChangeText={(e) => setCEP(maskCEP(e))}
                style={{
                  borderWidth: 1,
                  borderRadius: 5,
                  padding: 10,
                  fontSize: 20,
                  color: 'black',
                  fontWeight: '700',
                  borderColor: 'transparent',
                }}
                onSubmitEditing={() => {
                  if(String(CEP).length === 9) {
                    valorVeiculoRef.current.focus();
                  }else {
                    if(String(CEP).length === 0) {
                      Alert.alert(
                        "Preencha seu CEP",
                        "",
                        [
                          { text: "OK", onPress: () => cepRef.current.focus() }
                        ],
                        { cancelable: false }
                      );
                    }else {
                      Alert.alert(
                        "CEP inválido",
                        "",
                        [
                          { text: "OK", onPress: () => cepRef.current.focus() }
                        ],
                        { cancelable: false }
                      );
                    }
                  }
                }}
              />
              <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                Campo inválido
              </FormControl.ErrorMessage>
            </FormControl>
            <FormControl style={{marginTop: 20}} isInvalid={errors.find(response => response === 'valorVeiculo')}>
              <Text style={{ fontSize: 20, fontWeight: '600', marginBottom: 5 }}>VALOR DO VEÍCULO:</Text>
              <Input borderColor='#999' ref={valorVeiculoRef} value={valorVeiculo} returnKeyType='done' placeholder='R$ 0.000,00' keyboardType='number-pad' style={{
                borderWidth: 1,
                borderRadius: 5,
                padding: 10,
                fontSize: 20,
                color: 'black',
                fontWeight: '700',
                borderColor: 'transparent',
              }} onChangeText={(e) => setValorVeiculo(maskCurrency(e))} onSubmitEditing={() => {
                if(valorVeiculo) {
                  valorEntradaRef.current.focus()
                }else {
                  Alert.alert(
                    "Preencha o valor do veículo",
                    "",
                    [
                      { text: "OK", onPress: () => valorVeiculoRef.current.focus() }
                    ],
                    { cancelable: false }
                  );
                }
              }} />
            </FormControl>
            <FormControl style={{marginTop: 20}} isInvalid={errors.find(response => response === 'valorEntrada')}>
              <Text style={{ fontSize: 20, fontWeight: '600', marginBottom: 5 }}>VALOR DE ENTRADA:</Text>
              <Input borderColor='#999' ref={valorEntradaRef} value={valorEntrada} returnKeyType='done' placeholder='R$ 0.000,00' keyboardType='number-pad' style={{
                borderWidth: 1,
                borderRadius: 5,
                padding: 10,
                fontSize: 20,
                color: 'black',
                fontWeight: '700',
                borderColor: 'transparent',
              }} onChangeText={(e) => setValorEntrada(maskCurrency(e))} onSubmitEditing={() => {
                if(!valorEntrada) {
                  Alert.alert(
                    "Preencha o valor de entrada",
                    "",
                    [
                      { text: "OK", onPress: () => valorEntradaRef.current.focus() }
                    ],
                    { cancelable: false }
                  );
                }else {
                  const veiculoValor = Number(String(valorVeiculo).split('R$ ').join('').split('.').join('').split(',').join('.'));
                  const veiculoEntrada = Number(String(valorEntrada).split('R$ ').join('').split('.').join('').split(',').join('.'));

                  if(veiculoEntrada >= veiculoValor) {
                    Alert.alert(
                      "Valor de entrada maior que o valor do veículo",
                      "",
                      [
                        { text: "OK", onPress: () => valorEntradaRef.current.focus() }
                      ],
                      { cancelable: false }
                    );
                  }
                }
              }} />
              <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                Campo inválido
              </FormControl.ErrorMessage>
            </FormControl>
            <View style={{marginTop: 50}}>
              <TouchableOpacity
                onPress={enviarFinanciamento}
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
                >ENVIAR</Text>
                <Feather style={{
                  position: 'absolute',
                  right: 20,
                  top: '50%'
                }} name='send' color='white' size={25} />
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    )
  }

  return (
    <>
      <StatusBar style='light' />
      <Header title='FINANCIAR VEICULO' navigation={navigation} />
      <Body />
    </>
  )
}

export default FinanciarVeiculo;