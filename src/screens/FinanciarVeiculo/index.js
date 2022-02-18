import React, { useContext, useEffect, useRef, useState } from 'react';
import { View, Text, ScrollView, Platform, TouchableOpacity, KeyboardAvoidingView, Alert } from 'react-native'
import { COLORS, SIZES } from '../../utils/constants';

import { Select, Input, Modal, Spinner, WarningOutlineIcon, FormControl } from 'native-base';

import Feather from 'react-native-vector-icons/Feather';

import Header from '../../components/Header';

import { maskCEP, maskCPF, maskYear, maskCurrency, maskLetters, maskPhone } from '../../utils/maskedInput';

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
    const estadoCivilRef = useRef();
    const veiculoZeroRef = useRef();
    const anoFabricacaoRef = useRef();
    const anoModeloRef = useRef();
    const marcaRef = useRef();
    const modeloRef = useRef();
    const versaoRef = useRef();
    const valorVeiculoRef = useRef();
    const valorEntradaRef = useRef();
    const condutorMaiorRef = useRef();

    const [CPF, setCPF] = useState('');
    const [CEP, setCEP] = useState('');
    const [nomeCompleto, setNomeCompleto] = useState('');
    const [celular, setCelular] = useState('');
    const [estadoCivil, setEstadoCivil] = useState('');
    const [veiculoZero, setVeiculoZero] = useState('');
    const [anoFabricacao, setAnoFabricacao] = useState('');
    const [anoModelo, setAnoModelo] = useState('');
    const [marca, setMarca] = useState('');
    const [modelo, setModelo] = useState('');
    const [versao, setVersao] = useState('');
    const [valorVeiculo, setValorVeiculo] = useState('');
    const [valorEntrada, setValorEntrada] = useState('');
    const [condutorMaior, setCondutorMaior] = useState('');

    const [errors, setErrors] = useState([]);

    const [showModalLoading, setShowModalLoading] = useState(false);

    const [returnFinanciamento, setReturnFinanciamento] = useState(null);

    useEffect(() => {
      if(returnFinanciamento === 'success') {
        setVeiculoZero('');
        setCondutorMaior('');
        setEstadoCivil('');
        setNomeCompleto('');
        setCPF('');
        setCEP('');
        setAnoFabricacao('');
        setAnoModelo('');
        setVersao('');
        setMarca('');
        setModelo('');
        setValorVeiculo('');
        setValorEntrada('');
      }
    }, [returnFinanciamento]);

    const enviarFinanciamento = async () => {
      const error = [];

      if(!validateCPF(CPF) || veiculoZero === '' || condutorMaior === '' || estadoCivil === '' || !validateCEP(CEP) || !nomeCompleto.split(' ')[2] || !validatePhone(celular) || !anoFabricacao || (Number(anoFabricacao) > Number(new Date().getFullYear())) || !anoModelo || (Number(anoModelo) > Number(new Date().getFullYear())) || !marca || !modelo || !versao || !valorEntrada || !valorVeiculo) {
        if(veiculoZero === '') {
          error.push('veiculoZero');
        }

        if(condutorMaior === '') {
          error.push('condutorMaior');
        }

        if(estadoCivil === '') {
          error.push('estadoCivil');
        }

        if(!validateCPF(CPF)) {
          error.push('CPF');
        }

        if(!validateCEP(CEP)) {
          error.push('CEP');
        }

        if(!nomeCompleto.split(' ')[2]) {
          error.push('nomeCompleto');
        }

        if(!validatePhone(celular)) {
          error.push('celular');
        }

        if(!anoFabricacao || (Number(anoFabricacao) > Number(new Date().getFullYear()))) {
          error.push('anoFabricacao');
        }

        if(!anoModelo || (Number(anoModelo) > Number(new Date().getFullYear()))) {
          error.push('anoModelo');
        }

        if(!marca) {
          error.push('marca');
        }

        if(!modelo) {
          error.push('modelo');
        }

        if(!versao) {
          error.push('versao');
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

      await firebase.firestore().collection('solicitacaoFinanciamento').add({
        corretora: corretora ? corretora.uid : null,
        corretor: corretor ? corretor.uid : null,
        veiculo: {
          zeroKm: veiculoZero,
          condutorMaior: condutorMaior,
          anoFabricacao: anoFabricacao,
          anoModelo: anoModelo,
          marca: marca,
          modelo: modelo,
          versao: versao,
          valor: valorVeiculo
        },
        endereco: {
          cep: CEP
        },
        informacoesPessoal: {
          estadoCivil: estadoCivil,
          nomeCompleto: nomeCompleto,
          cpf: CPF,
          celular: celular
        },
        valorEntrada: valorEntrada,
        id: String(new Date().getTime())
      })
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

        console.log(error);
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
            <FormControl isInvalid={errors.find(response => response === 'veiculoZero')}>
              <Text style={{ fontSize: 20, fontWeight: '600', marginBottom: 5 }}>O VEÍCULO É 0KM:</Text>
                <Select
                  ref={veiculoZeroRef}
                  style={{
                    padding: 10,
                    fontSize: 20,
                    color: 'black',
                    fontWeight: '700'
                  }}
                  selectedValue={veiculoZero}
                  minWidth='200'
                  placeholder="Selecione a opção"
                  _selectedItem={{
                    bg: COLORS(corretora ? corretora.layout.theme : themeDefault).primary,
                    endIcon: <Feather name='check' color='#FFFFFF' />,
                  }}
                  mt={1}
                  borderWidth={1}
                  borderColor="#999"
                  borderRadius={5}
                  color='black'
                  onValueChange={(itemValue) => setVeiculoZero(itemValue)}
                >
                  <Select.Item label="SIM" value={true} />
                  <Select.Item label="NÃO" value={false} />
                </Select>
                <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                  Campo inválido
                </FormControl.ErrorMessage>
            </FormControl>
            <FormControl style={{marginTop: 20}} isInvalid={errors.find(response => response === 'condutorMaior')}>
              <Text style={{ fontSize: 20, fontWeight: '600', marginBottom: 5 }}>PRINCIPAL CONDUTOR É MAIOR:</Text>
              <Select
                ref={condutorMaiorRef}
                style={{
                  padding: 10,
                  fontSize: 20,
                  color: 'black',
                  fontWeight: '700'
                }}
                selectedValue={condutorMaior}
                minWidth='200'
                placeholder="Selecione a opção"
                _selectedItem={{
                  bg: COLORS(corretora ? corretora.layout.theme : themeDefault).primary,
                  endIcon: <Feather name='check' color='#FFFFFF' />,
                }}
                mt={1}
                borderWidth={1}
                borderColor="#999"
                borderRadius={5}
                color='black'
                onValueChange={(itemValue) => setCondutorMaior(itemValue)}
              >
                <Select.Item label="SIM" value={true} />
                <Select.Item label="NÃO" value={false} />
              </Select>
              <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                Campo inválido
              </FormControl.ErrorMessage>
            </FormControl>
            <FormControl style={{marginTop: 20}} isInvalid={errors.find(response => response === 'estadoCivil')}>
              <Text style={{ fontSize: 20, fontWeight: '600', marginBottom: 5 }}>ESTADO CÍVIL:</Text>
              <Select
                ref={estadoCivilRef}
                style={{
                  padding: 10,
                  fontSize: 20,
                  color: 'black',
                  fontWeight: '700'
                }}
                selectedValue={estadoCivil}
                minWidth='200'
                placeholder="Selecione seu estado cívil"
                _selectedItem={{
                  bg: COLORS(corretora ? corretora.layout.theme : themeDefault).primary,
                  endIcon: <Feather name='check' color='#FFFFFF' />,
                }}
                mt={1}
                borderWidth={1}
                borderColor="#999"
                borderRadius={5}
                color='black'
                onValueChange={(itemValue) => setEstadoCivil(itemValue)}
              >
                <Select.Item label="SOLTEIRO" value="SOLTEIRO" />
                <Select.Item label="CASADO" value="CASADO" />
                <Select.Item label="VIÚVO" value="VIÚVO" />
                <Select.Item label="SEPARADO JUDICIALMENTE" value="SEPARADO JUDICIALMENTE" />
              </Select>
              <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                Campo inválido
              </FormControl.ErrorMessage>
            </FormControl>
            <FormControl style={{marginTop: 20}} isInvalid={errors.find(response => response === 'nomeCompleto')}>
              <Text style={{ fontSize: 20, fontWeight: '600', marginBottom: 5 }}>NOME COMPLETO:</Text>
              <Input borderColor='#999' ref={nomeCompletoRef} value={nomeCompleto} returnKeyType='done' placeholder='Seu nome completo' keyboardType='default' style={{
                borderWidth: 1,
                borderRadius: 5,
                padding: 10,
                fontSize: 20,
                color: 'black',
                fontWeight: '700',
                textTransform: 'uppercase'
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
                  fontWeight: '700'
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
                  fontWeight: '700'
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
                  fontWeight: '700'
                }}
                onSubmitEditing={() => {
                  if(String(CEP).length === 9) {
                    anoFabricacaoRef.current.focus();
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
            <FormControl style={{marginTop: 20}} isInvalid={errors.find(response => response === 'anoFabricacao')}>
              <Text style={{ fontSize: 20, fontWeight: '600', marginBottom: 5 }}>ANO DE FABRICAÇÃO:</Text>
              <Input maxLength={4} borderColor='#999' ref={anoFabricacaoRef} value={anoFabricacao} returnKeyType='done' placeholder='0000' keyboardType='number-pad' style={{
                borderWidth: 1,
                borderRadius: 5,
                padding: 10,
                fontSize: 20,
                color: 'black',
                fontWeight: '700'
              }} onChangeText={(e) => setAnoFabricacao(maskYear(e))} onSubmitEditing={() => {
                if(String(anoFabricacao).length === 4) {
                  if(Number(anoFabricacao) <= new Date().getFullYear()) {
                    anoModeloRef.current.focus()
                  }else {
                    Alert.alert(
                      "Ano inválido",
                      "",
                      [
                        { text: "OK", onPress: () => anoFabricacaoRef.current.focus() }
                      ],
                      { cancelable: false }
                    );
                  }
                }else {
                  if(String(anoFabricacao).length === 0) {
                    Alert.alert(
                      "Preencha o ano",
                      "",
                      [
                        { text: "OK", onPress: () => anoFabricacaoRef.current.focus() }
                      ],
                      { cancelable: false }
                    );
                  }else {
                    Alert.alert(
                      "Ano inválido",
                      "",
                      [
                        { text: "OK", onPress: () => anoFabricacaoRef.current.focus() }
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
            <FormControl style={{marginTop: 20}} isInvalid={errors.find(response => response === 'anoModelo')}>
              <Text style={{ fontSize: 20, fontWeight: '600', marginBottom: 5 }}>ANO DO MODELO:</Text>
              <Input maxLength={4} borderColor='#999' ref={anoModeloRef} value={anoModelo} returnKeyType='done' placeholder='0000' keyboardType='number-pad' style={{
                borderWidth: 1,
                borderRadius: 5,
                padding: 10,
                fontSize: 20,
                color: 'black',
                fontWeight: '700'
              }} onChangeText={(e) => setAnoModelo(maskYear(e))} onSubmitEditing={() => {
                if(String(anoModelo).length === 4) {
                  if(Number(anoModelo) <= new Date().getFullYear()) {
                    marcaRef.current.focus()
                  }else {
                    Alert.alert(
                      "Ano inválido",
                      "",
                      [
                        { text: "OK", onPress: () => anoModeloRef.current.focus() }
                      ],
                      { cancelable: false }
                    );
                  }
                }else {
                  if(String(anoModelo).length === 0) {
                    Alert.alert(
                      "Preencha o ano",
                      "",
                      [
                        { text: "OK", onPress: () => anoModeloRef.current.focus() }
                      ],
                      { cancelable: false }
                    );
                  }else {
                    Alert.alert(
                      "Ano inválido",
                      "",
                      [
                        { text: "OK", onPress: () => anoModeloRef.current.focus() }
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
            <FormControl style={{marginTop: 20}} isInvalid={errors.find(response => response === 'marca')}>
              <Text style={{ fontSize: 20, fontWeight: '600', marginBottom: 5 }}>MARCA:</Text>
              <Input borderColor='#999' ref={marcaRef} value={marca} returnKeyType='done' placeholder='Digite a marca' keyboardType='default' style={{
                borderWidth: 1,
                borderRadius: 5,
                padding: 10,
                fontSize: 20,
                color: 'black',
                fontWeight: '700'
              }} autoCapitalize='characters' autoCorrect={false} autoCompleteType='off' onChangeText={(e) => setMarca(maskLetters(String(e).toUpperCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "")))} onSubmitEditing={() => {
                if(marca) {
                  modeloRef.current.focus();
                }else {
                  Alert.alert(
                    "Preencha a marca do veículo",
                    "",
                    [
                      { text: "OK", onPress: () => anoModeloRef.current.focus() }
                    ],
                    { cancelable: false }
                  );
                }
              }} />
              <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                Campo inválido
              </FormControl.ErrorMessage>
            </FormControl>
            <FormControl style={{marginTop: 20}} isInvalid={errors.find(response => response === 'modelo')}>
              <Text style={{ fontSize: 20, fontWeight: '600', marginBottom: 5 }}>MODELO:</Text>
              <Input borderColor='#999' ref={modeloRef} value={modelo} returnKeyType='done' placeholder='Digite o modelo' keyboardType='default' style={{
                borderWidth: 1,
                borderRadius: 5,
                padding: 10,
                fontSize: 20,
                color: 'black',
                fontWeight: '700'
              }} autoCapitalize='characters' autoCorrect={false} autoCompleteType='off' onChangeText={(e) => setModelo(String(e).toUpperCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ""))} onSubmitEditing={() => {
                if(modelo) {
                  versaoRef.current.focus()
                }else {
                  Alert.alert(
                    "Preencha o modelo do veículo",
                    "",
                    [
                      { text: "OK", onPress: () => modeloRef.current.focus() }
                    ],
                    { cancelable: false }
                  );
                }
              }} />
              <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                Campo inválido
              </FormControl.ErrorMessage>
            </FormControl>
            <FormControl style={{marginTop: 20}} isInvalid={errors.find(response => response === 'versao')}>
              <Text style={{ fontSize: 20, fontWeight: '600', marginBottom: 5 }}>VERSÃO:</Text>
              <Input borderColor='#999' ref={versaoRef} value={versao} returnKeyType='done' placeholder='Digite a versão do veículo' keyboardType='default' style={{
                borderWidth: 1,
                borderRadius: 5,
                padding: 10,
                fontSize: 20,
                color: 'black',
                fontWeight: '700'
              }} autoCapitalize='characters' autoCorrect={false} autoCompleteType='off' onChangeText={(e) => setVersao(String(e).toUpperCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ""))} onSubmitEditing={() => {
                if(versao) {
                  valorVeiculoRef.current.focus()
                }else {
                  Alert.alert(
                    "Preencha a versão do veículo",
                    "",
                    [
                      { text: "OK", onPress: () => versaoRef.current.focus() }
                    ],
                    { cancelable: false }
                  );
                }
              }} />
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
                fontWeight: '700'
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
                fontWeight: '700'
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