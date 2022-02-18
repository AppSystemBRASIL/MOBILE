import React, { useContext, useRef, useState, useEffect } from 'react';
import { View, Text, ScrollView, Platform, TouchableOpacity, KeyboardAvoidingView, Alert } from 'react-native';
import { COLORS } from '../../utils/constants';

import { Select, Input, Modal, Spinner, WarningOutlineIcon, FormControl } from 'native-base';

import Feather from 'react-native-vector-icons/Feather';

import { maskCEP, maskCPF, maskDate, maskLetters, maskPhone, maskPlaca } from '../../utils/maskedInput';

import firebase from '../../../firebase';
import { validateCEP, validateCPF, validateDate, validatePhone, validatePlaca } from '../../utils/validateInput';
import { themeDefault } from '../../config';
import Context from '../../context';

import Header from '../../components/Header';

import generateToken from '../../hooks/generateToken';
import { StatusBar } from 'expo-status-bar';

const FazerSeguro = ({ navigation, route }) => {
  const { corretor, corretora } = useContext(Context);

  const { tipo, title } = route.params;

  const Body = () => {
    const [page, setPage] = useState(0);

    const scrollViewRef = useRef();

    const nomeCompletoRef = useRef();
    const cpfRef = useRef();
    const celularRef = useRef();
    const estadoCivilRef = useRef();
    const data1CNHRef = useRef();
    const cepRef = useRef();
    const seguradoProprietarioRef = useRef();

    const tipoSeguroRef = useRef();
    const seguradoraRef = useRef();
    const fimVigenciaRef = useRef();
    const houveSinistroRef = useRef();

    const placaRef = useRef();
    const CEPVeiculoRef = useRef();
    const financiadoRef = useRef();
    const blindadoRef = useRef();
    const kitGasRef = useRef();

    const principalCondutorRef = useRef();
    const nomePrincipalCondutorRef = useRef();
    const relacaoSeguradoRef = useRef();
    const CPFSeguradoRef = useRef();
    const data1CNHSeguradoRef = useRef();
    const estadoCivilSeguradoRef = useRef();

    const dependenteMenorRef = useRef();
    const usoVeiculoRef = useRef();
    const residenciaVeiculoRef = useRef();
    const garagemResidenciaRef = useRef();
    const garagemTrabalhoRef = useRef();
    const garagemEscolaRef = useRef();
    const profissaoPrincipalCondutorRef = useRef();
    const profissaoSeguradoRef = useRef();

    const [nomeCompleto, setNomeCompleto] = useState('');
    const [CPF, setCPF] = useState('');
    const [celular, setCelular] = useState('');
    const [estadoCivil, setEstadoCivil] = useState('');
    const [data1CNH, setData1CNH] = useState('');
    const [cep, setCEP] = useState('');
    const [seguradoProprietario, setSeguradoProprietario] = useState('');

    const [tipoSeguro, setTipoSeguro] = useState('');
    const [seguradora, setSeguradora] = useState('');
    const [fimVigencia, setFimVigencia] = useState('');
    const [houveSinistro, setHouveSinistro] = useState('');

    const [placa, setPlaca] = useState('');
    const [CEPVeiculo, setCEPVeiculo] = useState('');
    const [financiado, setFinanciado] = useState('');
    const [blindado, setBlindado] = useState('');
    const [kitGas, setKitGas] = useState('');

    const [principalCondutor, setPrincipalCondutor] = useState('');
    const [nomePrincipalCondutor, setNomePrincipalCondutor] = useState('');
    const [relacaoSegurado, setRelacaoSegurado] = useState('');
    const [CPFSegurado, setCPFSegurado] = useState('');
    const [data1CNHSegurado, setData1CNHSegurado] = useState('');
    const [estadoCivilSegurado, setEstadoCivilSegurado] = useState('');

    const [dependenteMenor, setDependenteMenor] = useState('');
    const [usoVeiculo, setUsoVeiculo] = useState('');
    const [residenciaVeiculo, setResidenciaVeiculo] = useState('');
    const [garagemResidencia, setGaragemResidencia] = useState('');
    const [garagemTrabalho, setGaragemTrabalho] = useState('');
    const [garagemEscola, setGaragemEscola] = useState('');
    const [profissaoPrincipalCondutor, setProfissaoPrincipalCondutor] = useState('');
    const [profissaoSegurado, setProfissaoSegurado] = useState('');

    const [errors, setErrors] = useState([]);

    const [showModalLoading, setShowModalLoading] = useState(false);

    const [returnSeguro, setReturnSeguro] = useState(null);

    useEffect(() => {
      topPage();
    }, [page]);

    const addError = (value) => {
      setErrors(response => ([...response, value]));
    }

    const removeError = (value) => {
      setErrors(response => response.filter(res => res !== value))
    }

    const verificarPagina = (page) => {
      let error = true;

      if(page === 0) {
        if(String(nomeCompleto).split(' ').length < 2) {
          addError('nomeCompleto');
          error = false;
        }

        if(!validateCPF(CPF)) {
          addError('CPF');
          error = false;
        }

        if(!validatePhone(celular)) {
          addError('celular');
          error = false;
        }

        if(!profissaoSegurado) {
          addError('profissaoSegurado');
          error = false;
        }

        if(!estadoCivil) {
          addError('estadoCivil');
          error = false;
        }

        if(!validateCEP(cep)) {
          addError('cep');
          error = false;
        }

        if(!data1CNH) {
          addError('data1CNH');
          error = false;
        }

        if(!seguradoProprietario) {
          addError('seguradoProprietario');
          error = false;
        }

        if(dependenteMenor === '') {
          addError('dependenteMenor');
          error = false;
        }
      }else if(page === 1) {
        if(tipoSeguro === '') {
          addError('tipoSeguro');
          error = false;
        }else if(tipoSeguro === 'RENOVAÇÃO') {
          if(!seguradora) {
            addError('seguradora');
            error = false;
          }

          if(!validateDate(fimVigencia)) {
            addError('fimVigencia');
            error = false;
          }

          if(houveSinistro === '') {
            addError('houveSinistro');
            error = false;
          }
        }
      }else if(page === 2) {
        if(!validatePlaca(placa)) {
          addError('placa');
          error = false;
        }

        if(!validateCEP(CEPVeiculo)) {
          addError('CEPVeiculo');
          error = false;
        }

        if(financiado === '') {
          addError('financiado');
          error = false;
        }

        if(blindado === '') {
          addError('blindado');
          error = false;
        }

        if(kitGas === '') {
          addError('kitGas');
          error = false;
        }
      }else if(page === 3) {
        if(principalCondutor === '') {
          addError('principalCondutor');
          error = false;
        }else {
          if(principalCondutor !== 'VOCÊ') {
            if(!nomePrincipalCondutor.split(' ').length > 1) {
              addError('nomePrincipalCondutor');
              error = false;
            }
  
            if(relacaoSegurado === '') {
              addError('relacaoSegurado');
              error = false;
            }
  
            if(!validateCPF(CPFSegurado)) {
              addError('CPFSegurado');
              error = false;
            }

            if(profissaoPrincipalCondutor === '') {
              addError('profissaoPrincipalCondutor');
              error = false;
            }
  
            if(estadoCivilSegurado === '') {
              addError('estadoCivilSegurado');
              error = false;
            }
          }
        }
      }else if(page === 4) {
        if(usoVeiculo === '') {
          addError('usoVeiculo');
          error = false;
        }

        if(residenciaVeiculo === '') {
          addError('residenciaVeiculo');
          error = false;
        }

        if(garagemResidencia === '') {
          addError('garagemResidencia');
          error = false;
        }

        if(garagemTrabalho === '') {
          addError('garagemTrabalho');
          error = false;
        }

        if(garagemEscola === '') {
          addError('garagemEscola');
          error = false;
        }
      }

      if(!error) {
        topPage();

        if(page === 4) {
          alert('OCORREU UM ERRO COM OS DADOS!')
        }
      }

      return error;
    }

    const topPage = () => {
      scrollViewRef.current?.scrollTo({ y: 0 });
    }

    const enviarSeguro = async () => {
      setErrors([]);

      if(tipo !== 'veicular') {
        if((!String(nomeCompleto).split(' ').length > 1) || (!validatePhone(celular))) {
          if(!String(nomeCompleto).split(' ').length > 1) {
            addError('nomeCompleto');
          }
  
          if(!validatePhone(celular)) {
            addError('celular')
          }
  
          setReturnSeguro('error');  
        }
      }

      if((tipo === 'veicular') && (!verificarPagina(0) || !verificarPagina(1) || !verificarPagina(2) || !verificarPagina(3) || !verificarPagina(4))) {
        return;
      } 

      setShowModalLoading(true);

      const uuidGenerated = generateToken();

      let dataSend = {};
 
      if(tipo !== 'veicular') {
        dataSend = {
          uid: uuidGenerated,
          corretora: corretora ? {
            uid: corretora.uid,
            razao_social: corretora.razao_social,
          } : null,
          corretor: corretor ? {
            uid: corretor.uid,
            nome: corretor.displayName,
          } : null,
          segurado: {
            nome: nomeCompleto,
            celular: celular,
          },
          created: new Date(),
          seguro: {
            tipo: tipo,
          },
          status: 0
        }
      }else {
        dataSend = {
          uid: uuidGenerated,
          tipo,
          corretora: corretora ? {
            uid: corretora.uid,
            razao_social: corretora.razao_social,
          } : null,
          corretor: corretor ? {
            uid: corretor.uid,
            nome: corretor.displayName,
          } : null,
          segurado: {
            nome: nomeCompleto,
            profissao: profissaoSegurado,
            celular,
            cpf: CPF,
            estadoCivil,
            cnh: data1CNH,
            cep,
            proprietario: Boolean(seguradoProprietario),
          },
          created: new Date(),
          seguro: {
            tipo: tipoSeguro,
            seguradora,
            vigencia: fimVigencia,
            sinistro: Boolean(houveSinistro),
            apolice: null,
            ci: null,
          },
          veiculo: {
            placa,
            veiculo: null,
            ano: null,
            modelo:  null,
            cep: CEPVeiculo,
            financiado: Boolean(financiado),
            blindado: Boolean(blindado),
            kitGas: Boolean(kitGas),
            uso: usoVeiculo,
          },
          condutor: {
            nome: principalCondutor === 'VOCÊ' ? nomeCompleto : nomePrincipalCondutor,
            nascimento: null,
            relacao: principalCondutor === 'VOCÊ' ? 'PRÓPRIO' : relacaoSegurado,
            cpf: principalCondutor === 'VOCÊ' ? CPF : CPFSegurado,
            cnh: principalCondutor === 'VOCÊ' ? data1CNH : data1CNHSegurado,
            estadoCivil: principalCondutor === 'VOCÊ' ? estadoCivil : estadoCivil,
            profissao: principalCondutor === 'VOCÊ' ? profissaoSegurado : profissaoPrincipalCondutor,
          },
          riscos: {
            dependenteMenor,
            usoVeiculo,
            residencia: residenciaVeiculo,
            garagemResidencia,
            garagemTrabalho,
            garagemEscola,
          },
          status: 0
        }
      }

      await firebase.firestore().collection('cotacoes').doc(dataSend.uid).set(dataSend, { merge: true })
      .then(() => {
        setReturnSeguro('success');
        setTimeout(() => {
          navigation.navigate('home');
        }, 3000)
      }).catch(() => {
        setReturnSeguro('error');
      }).finally(() => {
        setTimeout(() => {
          setShowModalLoading(false);
        }, 3000);
      });
    }

    const proximaPagina = () => {
      if(verificarPagina(page)) {
        setPage(page+1);
        topPage();
      }
    }

    return (
      <>
        <Header showBackPage={page === 0} title={`${((tipo !== 'outros') && (tipo !== 'consorcio')) ? `COTAÇÃO DE SEGURO ${((tipo === 'vida') || (tipo === 'saude') || (tipo === 'viagem')) ? ' DE' : ''}` : ''} ${title} ${tipo === 'outros' ? 'SEGUROS' : ''}`} navigation={navigation} />
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
                  {returnSeguro === 'success' ? (
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
                        Você receberá um contato em até 24horas para sua cotação de {((tipo !== 'outros') && (tipo !== 'consorcio')) && `SEGURO ${((tipo === 'vida') || (tipo === 'saude') || (tipo === 'viagem')) ? 'de' : ''}`} {(title !== 'outros') && title}.
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
          <ScrollView ref={scrollViewRef} showsVerticalScrollIndicator={false} style={{paddingTop: 20}}>
            <View
              activeOpacity={1} 
              style={{
                backgroundColor: 'white',
                borderRadius: 15,
                margin: 5,
                marginBottom: 100,
                paddingHorizontal: 20,
                paddingTop: 10,
                paddingBottom: 50,
              }}
            >
              {tipo !== 'veicular' ? (
                <View>
                  <FormControl style={{marginTop: 20}} isInvalid={errors.find(response => response === 'nomeCompleto')}>
                  <Text style={{ fontSize: 20, fontWeight: '600', marginBottom: 5 }}>SEGURADO: <Text style={{ color: '#666', fontSize: 10 }}>NOME COMPLETO</Text></Text>
                    <Input borderColor='#999' ref={nomeCompletoRef} value={nomeCompleto} returnKeyType='done' placeholder='Seu nome completo' keyboardType='default' style={{
                      borderWidth: 1,
                      borderRadius: 5,
                      padding: 10,
                      fontSize: 20,
                      color: 'black',
                      fontWeight: '700',
                      textTransform: 'uppercase'
                    }} autoCapitalize='characters' autoCorrect={false} autoCompleteType='off' onChangeText={(e) => setNomeCompleto(maskLetters(String(e).toUpperCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "")))} onSubmitEditing={() => {
                      if(String(nomeCompleto).split(' ').length > 1) {
                        removeError('nomeCompleto');
                        celularRef.current.focus();
                      }else {
                        addError('nomeCompleto');
                        Alert.alert(
                          "Preencha seu nome completo",
                          "",
                          [
                            { text: "OK", onPress: () => nomeCompletoRef.current.focus() }
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
                          removeError('celular')
                        }else {
                          addError('celular')
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
                </View>
              ) : (
                <View>
                  {page === 0 ? (
                    <>
                      <FormControl style={{marginTop: 20}} isInvalid={errors.find(response => response === 'nomeCompleto')}>
                        <Text style={{ fontSize: 20, fontWeight: '600', marginBottom: 5 }}>SEGURADO: <Text style={{ color: '#666', fontSize: 10 }}>NOME COMPLETO</Text></Text>
                        <Input borderColor='#999' ref={nomeCompletoRef} value={nomeCompleto} returnKeyType='done' keyboardType='default' style={{
                          borderWidth: 1,
                          borderRadius: 5,
                          padding: 10,
                          fontSize: 20,
                          color: 'black',
                          fontWeight: '700',
                          textTransform: 'uppercase'
                        }} autoCapitalize='characters' autoCorrect={false} autoCompleteType='off' placeholder='Seu nome completo' onChangeText={(e) => setNomeCompleto(maskLetters(String(e).toUpperCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "")))} onSubmitEditing={() => {
                          if(String(nomeCompleto).split(' ').length > 1) {
                            removeError('nomeCompleto');
                            cpfRef.current.focus();
                          }else {
                            addError('nomeCompleto');
                            Alert.alert(
                              "Preencha seu nome completo",
                              "",
                              [
                                { text: "OK", onPress: () => nomeCompletoRef.current.focus() }
                              ],
                              { cancelable: false }
                            );
                          }
                        }} />
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
                              celularRef.current.focus();
                              removeError('CPF');
                            }else {
                              addError('CPF');
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
                              removeError('celular')
                            }else {
                              addError('celular')
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
                      <FormControl style={{marginTop: 20}} isInvalid={errors.find(response => response === 'profissaoSegurado')}>
                        <Text style={{ fontSize: 20, fontWeight: '600', marginBottom: 5 }}>PROFISSÃO:</Text>
                        <Select
                          ref={profissaoSeguradoRef}
                          style={{
                            padding: 10,
                            fontSize: 20,
                            color: 'black',
                            fontWeight: '700',
                            width: '100%'
                          }}
                          selectedValue={profissaoSegurado}
                          minWidth='200'
                          placeholder="Selecione a profissão  do segurado"
                          _selectedItem={{
                            bg: COLORS(corretora ? corretora.layout.theme : themeDefault).primary,
                            endIcon: <Feather name='check' color='#FFFFFF' />,
                          }}
                          mt={1}
                          borderWidth={1}
                          borderColor="#999"
                          borderRadius={5}
                          color='black'
                          onValueChange={(itemValue) => {
                            if(itemValue) {
                              setProfissaoSegurado(itemValue);
                              removeError('profissaoSegurado');
                            }else {
                              addError('profissaoSegurado');
                            }
                          }}
                        >
                          <Select.Item label="MILITAR" value="MILITAR" />
                          <Select.Item label="PROFESSOR(A)" value="PROFESSOR(A)" />
                          <Select.Item label="SERVIDOR PÚBLICO" value="SERVIDOR PÚBLICO" />
                          <Select.Item label="MÉDICO/DENTISTA" value="MÉDICO/DENTISTA" />
                          <Select.Item label="APOSENTADO(A)" value="APOSENTADO(A)" />
                          <Select.Item label="EMPRESÁRIO(A)" value="EMPRESÁRIO(A)" />
                          <Select.Item label="AUTÔNOMO(A)" value="AUTÔNOMO(A)" />
                          <Select.Item label="OUTROS" value="OUTROS" />
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
                          onValueChange={(itemValue) => {
                            if(itemValue) {
                              setEstadoCivil(itemValue);
                              removeError('estadoCivil');
                            }else {
                              addError('estadoCivil');
                            }
                          }}
                        >
                          <Select.Item label="SOLTEIRO" value="SOLTEIRO" />
                          <Select.Item label="CASADO" value="CASADO" />
                          <Select.Item label="COMPANHEIRO" value="COMPANHANHEIRO" />
                          <Select.Item label="VIÚVO" value="VIÚVO" />
                          <Select.Item label="DIVORCIADO" value="DIVORCIADO" />
                        </Select>
                        <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                          Campo inválido
                        </FormControl.ErrorMessage>
                      </FormControl>
                      <FormControl style={{marginTop: 20}} isInvalid={errors.find(response => response === 'cep')}>
                        <Text style={{ fontSize: 20, fontWeight: '600', marginBottom: 5 }}>CEP:</Text>
                        <Input maxLength={9} autoCapitalize='characters' autoCorrect={false} autoCompleteType='off' placeholder='00000-000' borderColor='#999' ref={cepRef} value={cep} returnKeyType='done' keyboardType='number-pad'
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
                            if(validateCEP(cep)) {
                              removeError('cep');
                            }else {
                              addError('cep');
                              if(String(cep).length === 0) {
                                Alert.alert(
                                  "Preencha o CEP",
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
                      <FormControl style={{marginTop: 20}} isInvalid={errors.find(response => response === 'data1CNH')}>
                        <Text style={{ fontSize: 20, fontWeight: '600', marginBottom: 5 }}>TEMPO DE CNH:</Text>
                        <Select
                          ref={data1CNHRef}
                          style={{
                            padding: 10,
                            fontSize: 20,
                            color: 'black',
                            fontWeight: '700'
                          }}
                          selectedValue={data1CNH}
                          minWidth='200'
                          placeholder="Selecione seu tempo de  CNH"
                          _selectedItem={{
                            bg: COLORS(corretora ? corretora.layout.theme : themeDefault).primary,
                            endIcon: <Feather name='check' color='#FFFFFF' />,
                          }}
                          mt={1}
                          borderWidth={1}
                          borderColor="#999"
                          borderRadius={5}
                          color='black'
                          onValueChange={(itemValue) => {
                            if(itemValue) {
                              setData1CNH(itemValue);
                              removeError('data1CNH');
                            }else {
                              addError('data1CNH');
                            }
                          }}
                        >
                          <Select.Item label="0 ANO" value="0 ANO" />
                          <Select.Item label="1 ANOS" value="1 ANOS" />
                          <Select.Item label="2 ANOS" value="2 ANOS" />
                          <Select.Item label="3 ANOS" value="3 ANOS" />
                          <Select.Item label="4 ANOS" value="4 ANOS" />
                          <Select.Item label="5 ANOS" value="5 ANOS" />
                          <Select.Item label="6 ANOS" value="6 ANOS" />
                          <Select.Item label="7 ANOS" value="7 ANOS" />
                          <Select.Item label="8 ANOS" value="8 ANOS" />
                          <Select.Item label="9 ANOS" value="9 ANOS" />
                          <Select.Item label="10 ANOS" value="10 ANOS" />
                          <Select.Item label="+10 ANOS" value="+10 ANOS" />
                        </Select>
                        <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                          Campo inválido
                        </FormControl.ErrorMessage>
                      </FormControl>
                      <FormControl style={{marginTop: 20}} isInvalid={errors.find(response => response === 'seguradoProprietario')}>
                        <Text style={{ fontSize: 20, fontWeight: '600', marginBottom: 5 }}>O SEGURADO É O PROPRIETÁRIO:</Text>
                        <Select
                          ref={seguradoProprietarioRef}
                          style={{
                            padding: 10,
                            fontSize: 20,
                            color: 'black',
                            fontWeight: '700'
                          }}
                          selectedValue={seguradoProprietario}
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
                          onValueChange={(itemValue) => {
                            if(itemValue) {
                              setSeguradoProprietario(itemValue);
                              removeError('seguradoProprietario');
                            }else {
                              addError('seguradoProprietario');
                            }
                          }}
                        >
                          <Select.Item label="SIM" value={'true'} />
                          <Select.Item label="NÃO" value={'false'} />
                        </Select>
                        <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                          Campo inválido
                        </FormControl.ErrorMessage>
                      </FormControl>
                      <FormControl style={{marginTop: 20}} isInvalid={errors.find(response => response === 'dependenteMenor')}>
                        <Text style={{ fontSize: 20, fontWeight: '600', marginBottom: 5 }}>
                          O principal condutor reside com pessoas menores de 26 anos?
                        </Text>
                        <Select
                          ref={dependenteMenorRef}
                          style={{
                            padding: 10,
                            fontSize: 20,
                            color: 'black',
                            fontWeight: '700'
                          }}
                          selectedValue={dependenteMenor}
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
                          onValueChange={(itemValue) => {
                            if(itemValue) {
                              setDependenteMenor(itemValue);
                              removeError('dependenteMenor');
                            }else {
                              addError('dependenteMenor');
                            }
                          }}
                        >
                          <Select.Item label="NÃO" value='NÃO' />
                          <Select.Item label="SIM, MAS NÃO DIRIGEM" value='SIM, MAS NÃO DIRIGEM' />
                          <Select.Item label="SIM, APENAS UM DIA NA SEMANA" value='SIM, APENAS UM DIA NA SEMANA' />
                          <Select.Item label="SIM, DIRIGEM SEM RESTRIÇÃO" value='SIM, DIRIGEM SEM RESTRIÇÃO' />
                        </Select>
                        <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                          Campo inválido
                        </FormControl.ErrorMessage>
                      </FormControl>
                    </>
                  ) : page === 1 ? (
                    <>
                      <FormControl style={{marginTop: 20}} isInvalid={errors.find(response => response === 'tipoSeguro')}>
                        <Text style={{ fontSize: 20, fontWeight: '600', marginBottom: 5 }}>TIPO DE SEGURO:</Text>
                        <Select
                          ref={tipoSeguroRef}
                          style={{
                            padding: 10,
                            fontSize: 20,
                            color: 'black',
                            fontWeight: '700'
                          }}
                          selectedValue={tipoSeguro}
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
                          onValueChange={(itemValue) => {
                            if(itemValue) {
                              setTipoSeguro(itemValue);
                              removeError('tipoSeguro');
                            }else {
                              addError('tipoSeguro');
                            }
                          }}
                        >
                          <Select.Item label="NOVO" value="NOVO" />
                          <Select.Item label="RENOVAÇÃO" value="RENOVAÇÃO" />
                        </Select>
                        <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                          Campo inválido
                        </FormControl.ErrorMessage>
                      </FormControl>
                      {tipoSeguro === 'RENOVAÇÃO' && (
                        <>
                          <FormControl style={{marginTop: 20}} isInvalid={errors.find(response => response === 'seguradora')}>
                            <Text style={{ fontSize: 20, fontWeight: '600', marginBottom: 5 }}>SEGURADORA:</Text>
                            <Input borderColor='#999' ref={seguradoraRef} value={seguradora} returnKeyType='done' placeholder='Preencha o nome da seguradora' keyboardType='default' style={{
                              borderWidth: 1,
                              borderRadius: 5,
                              padding: 10,
                              fontSize: 20,
                              color: 'black',
                              fontWeight: '700',
                              textTransform: 'uppercase'
                            }} autoCapitalize='characters' autoCorrect={false} autoCompleteType='off' onChangeText={(e) => setSeguradora(maskLetters(String(e).toUpperCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "")))} onSubmitEditing={() => {
                              if(seguradora) {
                                removeError('seguradora');
                                fimVigenciaRef.current.focus();
                              }else {
                                addError('seguradora');
                                Alert.alert(
                                  "Preencha a seguradora",
                                  "",
                                  [
                                    { text: "OK", onPress: () => seguradoraRef.current.focus() }
                                  ],
                                  { cancelable: false }
                                );
                              }
                            }} />
                            <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                              Campo inválido
                            </FormControl.ErrorMessage>
                          </FormControl>
                          <FormControl style={{marginTop: 20}} isInvalid={errors.find(response => response === 'fimVigencia')}>
                            <Text style={{ fontSize: 20, fontWeight: '600', marginBottom: 5 }}>FIM DA VIGÊNCIA:</Text>
                            <Input borderColor='#999' ref={fimVigenciaRef} value={fimVigencia} returnKeyType='done' placeholder='00/00/0000' keyboardType='number-pad' style={{
                              borderWidth: 1,
                              borderRadius: 5,
                              padding: 10,
                              fontSize: 20,
                              color: 'black',
                              fontWeight: '700',
                              textTransform: 'uppercase'
                            }} autoCapitalize='characters' autoCorrect={false} autoCompleteType='off' onChangeText={(e) => setFimVigencia(maskDate(e))} onSubmitEditing={() => {
                              if(validateDate(fimVigencia)) {
                                removeError('fimVigencia');
                              }else {
                                addError('fimVigencia');
                                Alert.alert(
                                  "Fim da vigência inválida",
                                  "",
                                  [
                                    { text: "OK", onPress: () => fimVigenciaRef.current.focus() }
                                  ],
                                  { cancelable: false }
                                );
                              }
                            }} />
                            <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                              Campo inválido
                            </FormControl.ErrorMessage>
                          </FormControl>
                          <FormControl style={{marginTop: 20}} isInvalid={errors.find(response => response === 'houveSinistro')}>
                            <Text style={{ fontSize: 20, fontWeight: '600', marginBottom: 5 }}>HOUVE SINISTRO NESTA VIGÊNCIA?</Text>
                            <Select
                              ref={houveSinistroRef}
                              style={{
                                padding: 10,
                                fontSize: 20,
                                color: 'black',
                                fontWeight: '700'
                              }}
                              selectedValue={houveSinistro}
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
                              onValueChange={(itemValue) => {
                                if(itemValue) {
                                  setHouveSinistro(itemValue);
                                  removeError('houveSinistro');
                                }else {
                                  addError('houveSinistro');
                                }
                              }}
                            >
                              <Select.Item label="SIM" value={'true'} />
                              <Select.Item label="NÃO" value={'false'} />
                            </Select>
                            <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                              Campo inválido
                            </FormControl.ErrorMessage>
                          </FormControl>
                        </>
                      )}
                    </>
                  ) : page === 2 ? (
                    <>
                      <FormControl style={{marginTop: 20}} isInvalid={errors.find(response => response === 'placa')}>
                        <Text style={{ fontSize: 20, fontWeight: '600', marginBottom: 5 }}>PLACA DO VEÍCULO:</Text>
                        <Input borderColor='#999' ref={placaRef} value={placa} returnKeyType='done' maxLength={7} placeholder='AAA-0000 ou AAA0A00' keyboardType='default' style={{
                          borderWidth: 1,
                          borderRadius: 5,
                          padding: 10,
                          fontSize: 20,
                          color: 'black',
                          fontWeight: '700',
                          textTransform: 'uppercase'
                        }} autoCapitalize='characters' autoCorrect={false} autoCompleteType='off' onChangeText={(e) => setPlaca(maskPlaca(e))} onSubmitEditing={() => {
                          if(validatePlaca(placa)) {
                            CEPVeiculoRef.current.focus();
                            removeError('placa');
                          }else {
                            addError('placa');
                            Alert.alert(
                              "Placa inválida",
                              "",
                              [
                                { text: "OK", onPress: () => placaRef.current.focus() }
                              ],
                              { cancelable: false }
                            );
                          }
                        }} />
                        <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                          Campo inválido
                        </FormControl.ErrorMessage>
                      </FormControl>
                      <FormControl style={{marginTop: 20}} isInvalid={errors.find(response => response === 'CEPVeiculo')}>
                        <Text style={{ fontSize: 20, fontWeight: '600', marginBottom: 5 }}>CEP ONDE VEÍCULO DORME:</Text>
                        <Input maxLength={9} borderColor='#999' ref={CEPVeiculoRef} value={CEPVeiculo} returnKeyType='done' placeholder='00000-000' keyboardType='number-pad' style={{
                          borderWidth: 1,
                          borderRadius: 5,
                          padding: 10,
                          fontSize: 20,
                          color: 'black',
                          fontWeight: '700',
                          textTransform: 'uppercase'
                        }} autoCapitalize='characters' autoCorrect={false} autoCompleteType='off' onChangeText={(e) => setCEPVeiculo(maskCEP(e))} onSubmitEditing={() => {
                          if(validateCEP(CEPVeiculo)) {
                            removeError('CEPVeiculo');
                          }else {
                            addError('CEPVeiculo');
                            Alert.alert(
                              "CEP inválido",
                              "",
                              [
                                { text: "OK", onPress: () => CEPVeiculoRef.current.focus() }
                              ],
                              { cancelable: false }
                            );
                          }
                        }} />
                        <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                          Campo inválido
                        </FormControl.ErrorMessage>
                      </FormControl>
                      <FormControl style={{marginTop: 20}} isInvalid={errors.find(response => response === 'financiado')}>
                        <Text style={{ fontSize: 20, fontWeight: '600', marginBottom: 5 }}>FINANCIADO:</Text>
                        <Select
                          ref={financiadoRef}
                          style={{
                            padding: 10,
                            fontSize: 20,
                            color: 'black',
                            fontWeight: '700'
                          }}
                          selectedValue={financiado}
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
                          onValueChange={(itemValue) => {
                            if(itemValue) {
                              setFinanciado(itemValue);
                              removeError('financiado');
                            }else {
                              addError('financiado');
                            }
                          }}
                        >
                          <Select.Item label="SIM" value={'true'} />
                          <Select.Item label="NÃO" value={'false'} />
                        </Select>
                        <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                          Campo inválido
                        </FormControl.ErrorMessage>
                      </FormControl>
                      <FormControl style={{marginTop: 20}} isInvalid={errors.find(response => response === 'blindado')}>
                        <Text style={{ fontSize: 20, fontWeight: '600', marginBottom: 5 }}>BLINDADO:</Text>
                        <Select
                          ref={blindadoRef}
                          style={{
                            padding: 10,
                            fontSize: 20,
                            color: 'black',
                            fontWeight: '700'
                          }}
                          selectedValue={blindado}
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
                          onValueChange={(itemValue) => {
                            if(itemValue) {
                              setBlindado(itemValue);
                              removeError('blindado');
                            }else {
                              addError('blindado');
                            }
                          }}
                        >
                          <Select.Item label="SIM" value={'true'} />
                          <Select.Item label="NÃO" value={'false'} />
                        </Select>
                        <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                          Campo inválido
                        </FormControl.ErrorMessage>
                      </FormControl>
                      <FormControl style={{marginTop: 20}} isInvalid={errors.find(response => response === 'kitGas')}>
                        <Text style={{ fontSize: 20, fontWeight: '600', marginBottom: 5 }}>TEM KIT GÁS:</Text>
                        <Select
                          ref={kitGasRef}
                          style={{
                            padding: 10,
                            fontSize: 20,
                            color: 'black',
                            fontWeight: '700'
                          }}
                          selectedValue={kitGas}
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
                          onValueChange={(itemValue) => {
                            if(itemValue) {
                              setKitGas(itemValue);
                              removeError('kitGas');
                            }else {
                              addError('kitGas');
                            }
                          }}
                        >
                          <Select.Item label="SIM" value={'true'} />
                          <Select.Item label="NÃO" value={'false'} />
                        </Select>
                        <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                          Campo inválido
                        </FormControl.ErrorMessage>
                      </FormControl>
                    </>
                  ) : page === 3 ? (
                    <>
                      <FormControl style={{marginTop: 20}} isInvalid={errors.find(response => response === 'principalCondutor')}>
                        <Text style={{ fontSize: 20, fontWeight: '600', marginBottom: 5 }}>PRINCIPAL CONDUTOR:</Text>
                        <Select
                          ref={principalCondutorRef}
                          style={{
                            padding: 10,
                            fontSize: 20,
                            color: 'black',
                            fontWeight: '700'
                          }}
                          selectedValue={principalCondutor}
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
                          onValueChange={(itemValue) => {
                            if(itemValue) {
                              setPrincipalCondutor(itemValue);
                              removeError('principalCondutor');
                            }else {
                              addError('principalCondutor');
                            }
                          }}
                        >
                          <Select.Item label="EU MESMO" value="VOCÊ" />
                          <Select.Item label="OUTRA PESSOA" value="OUTRA PESSOA" />
                        </Select>
                        {!principalCondutor && (
                          <Text style={{ marginTop: 10 }}>
                            <Text style={{ textTransform: 'uppercase', textDecorationLine: 'underline', fontWeight: '700' }}>Principal Condutor:</Text> É a pessoa que utiliza o veículo do segurado por 2 ou mais dias por semana.
                            Caso exista mais de um condutor nesta condição, será definido como principal condutor sempre o de menor idade.
                          </Text>
                        )}
                        <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                          Campo inválido
                        </FormControl.ErrorMessage>
                      </FormControl>
                      {principalCondutor === 'OUTRA PESSOA' && (
                        <>
                          <FormControl style={{marginTop: 20}} isInvalid={errors.find(response => response === 'nomePrincipalCondutor')}>
                            <Text style={{ fontSize: 20, fontWeight: '600', marginBottom: 5 }}>NOME:</Text>
                            <Input borderColor='#999' ref={nomePrincipalCondutorRef} value={nomePrincipalCondutor} returnKeyType='done' placeholder='Preencha o nome' keyboardType='default' style={{
                              borderWidth: 1,
                              borderRadius: 5,
                              padding: 10,
                              fontSize: 20,
                              color: 'black',
                              fontWeight: '700',
                              textTransform: 'uppercase'
                            }} autoCapitalize='characters' autoCorrect={false} autoCompleteType='off' onChangeText={(e) => setNomePrincipalCondutor(maskLetters(String(e).toUpperCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "")))} onSubmitEditing={() => {
                              if(nomePrincipalCondutor.split(' ').length > 1) {
                                removeError('nomePrincipalCondutor');
                                relacaoSeguradoRef.current.focus();
                              }else {
                                addError('nomePrincipalCondutor');
                                Alert.alert(
                                  "Preencha o nome",
                                  "",
                                  [
                                    { text: "OK", onPress: () => nomePrincipalCondutorRef.current.focus() }
                                  ],
                                  { cancelable: false }
                                );
                              }
                            }} />
                            <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                              Campo inválido
                            </FormControl.ErrorMessage>
                          </FormControl>
                          <FormControl style={{marginTop: 20}} isInvalid={errors.find(response => response === 'relacaoSegurado')}>
                            <Text style={{ fontSize: 20, fontWeight: '600', marginBottom: 5 }}>RELAÇÃO COM O SEGURADO:</Text>
                            <Select
                              ref={relacaoSeguradoRef}
                              style={{
                                padding: 10,
                                fontSize: 20,
                                color: 'black',
                                fontWeight: '700'
                              }}
                              selectedValue={relacaoSegurado}
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
                              onValueChange={(itemValue) => {
                                if(itemValue) {
                                  setRelacaoSegurado(itemValue);
                                  removeError('relacaoSegurado');
                                }else {
                                  addError('relacaoSegurado');
                                }
                              }}
                            >
                              <Select.Item label="CÔNJUGE" value="CÔNJUGE" />
                              <Select.Item label="PAI/MÃE" value="PAI/MÃE" />
                              <Select.Item label="FILHO" value="FILHO" />
                              <Select.Item label="IRMÃO" value="IRMÃO" />
                              <Select.Item label="OUTROS" value="OUTROS" />
                            </Select>
                            <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                              Campo inválido
                            </FormControl.ErrorMessage>
                          </FormControl>
                          <FormControl style={{marginTop: 20}} isInvalid={errors.find(response => response === 'profissaoPrincipalCondutor')}>
                            <Text style={{ fontSize: 20, fontWeight: '600', marginBottom: 5 }}>PROFISSÃO PRINCIPAL DO CONDUTOR:</Text>
                            <Select
                              ref={profissaoPrincipalCondutorRef}
                              style={{
                                padding: 10,
                                fontSize: 20,
                                color: 'black',
                                fontWeight: '700'
                              }}
                              selectedValue={profissaoPrincipalCondutor}
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
                              onValueChange={(itemValue) => {
                                if(itemValue) {
                                  setProfissaoPrincipalCondutor(itemValue);
                                  removeError('profissaoPrincipalCondutor');
                                }else {
                                  addError('profissaoPrincipalCondutor');
                                }
                              }}
                            >
                              <Select.Item label="MILITAR" value="MILITAR" />
                              <Select.Item label="PROFESSOR(A)" value="PROFESSOR(A)" />
                              <Select.Item label="SERVIDOR PÚBLICO" value="SERVIDOR PÚBLICO" />
                              <Select.Item label="MÉDICO/DENTISTA" value="MÉDICO/DENTISTA" />
                              <Select.Item label="APOSENTADO(A)" value="APOSENTADO(A)" />
                              <Select.Item label="EMPRESÁRIO(A)" value="EMPRESÁRIO(A)" />
                              <Select.Item label="AUTÔNOMO(A)" value="AUTÔNOMO(A)" />
                              <Select.Item label="OUTROS" value="OUTROS" />
                            </Select>
                            <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                              Campo inválido
                            </FormControl.ErrorMessage>
                          </FormControl>
                          <FormControl style={{marginTop: 20}} isInvalid={errors.find(response => response === 'CPFSegurado')}>
                            <Text style={{ fontSize: 20, fontWeight: '600', marginBottom: 5 }}>CPF:</Text>
                            <Input maxLength={14} borderColor='#999' ref={CPFSeguradoRef} value={CPFSegurado} returnKeyType='done' placeholder='000.000.000-00' keyboardType='number-pad' 
                              onChangeText={(e) => setCPFSegurado(maskCPF(e))}
                              style={{
                                borderWidth: 1,
                                borderRadius: 5,
                                padding: 10,
                                fontSize: 20,
                                color: 'black',
                                fontWeight: '700'
                              }}
                              onSubmitEditing={() => {
                                if(String(CPFSegurado).length === 14) {
                                  data1CNHSeguradoRef.current.focus();
                                  removeError('CPFSegurado');
                                }else {
                                  addError('CPFSegurado');
                                  if(String(CPFSegurado).length === 0) {
                                    Alert.alert(
                                      "Preencha o CPF",
                                      "",
                                      [
                                        { text: "OK", onPress: () => CPFSeguradoRef.current.focus() }
                                      ],
                                      { cancelable: false }
                                    );
                                  }else {
                                    Alert.alert(
                                      "CPF inválido",
                                      "",
                                      [
                                        { text: "OK", onPress: () => CPFSeguradoRef.current.focus() }
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
                          <FormControl style={{marginTop: 20}} isInvalid={errors.find(response => response === 'data1CNHSegurado')}>
                            <Text style={{ fontSize: 20, fontWeight: '600', marginBottom: 5 }}>TEMPO DE CNH DO PRINCIPAL CONDUTOR:</Text>
                            <Select
                              ref={data1CNHSeguradoRef}
                              style={{
                                padding: 10,
                                fontSize: 20,
                                color: 'black',
                                fontWeight: '700'
                              }}
                              selectedValue={data1CNHSegurado}
                              minWidth='200'
                              placeholder="Selecione o tempo de  CNH do principal condutor"
                              _selectedItem={{
                                bg: COLORS(corretora ? corretora.layout.theme : themeDefault).primary,
                                endIcon: <Feather name='check' color='#FFFFFF' />,
                              }}
                              mt={1}
                              borderWidth={1}
                              borderColor="#999"
                              borderRadius={5}
                              color='black'
                              onValueChange={(itemValue) => {
                                if(itemValue) {
                                  setData1CNHSegurado(itemValue);
                                  removeError('data1CNHSegurado');
                                }else {
                                  addError('data1CNHSegurado');
                                }
                              }}
                            >
                              <Select.Item label="0 ANO" value="0 ANO" />
                              <Select.Item label="1 ANOS" value="1 ANOS" />
                              <Select.Item label="2 ANOS" value="2 ANOS" />
                              <Select.Item label="3 ANOS" value="3 ANOS" />
                              <Select.Item label="4 ANOS" value="4 ANOS" />
                              <Select.Item label="5 ANOS" value="5 ANOS" />
                              <Select.Item label="6 ANOS" value="6 ANOS" />
                              <Select.Item label="7 ANOS" value="7 ANOS" />
                              <Select.Item label="8 ANOS" value="8 ANOS" />
                              <Select.Item label="9 ANOS" value="9 ANOS" />
                              <Select.Item label="10 ANOS" value="10 ANOS" />
                              <Select.Item label="+10 ANOS" value="+10 ANOS" />
                            </Select>
                            <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                              Campo inválido
                            </FormControl.ErrorMessage>
                          </FormControl>
                          <FormControl style={{marginTop: 20}} isInvalid={errors.find(response => response === 'estadoCivilSegurado')}>
                            <Text style={{ fontSize: 20, fontWeight: '600', marginBottom: 5 }}>ESTADO CIVIL:</Text>
                            <Select
                              ref={estadoCivilSeguradoRef}
                              style={{
                                padding: 10,
                                fontSize: 20,
                                color: 'black',
                                fontWeight: '700'
                              }}
                              selectedValue={estadoCivilSegurado}
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
                              onValueChange={(itemValue) => {
                                if(itemValue) {
                                  setEstadoCivilSegurado(itemValue);
                                  removeError('estadoCivilSegurado');
                                }else {
                                  addError('estadoCivilSegurado');
                                }
                              }}
                            >
                              <Select.Item label="CASADO/A" value="CASADO/A" />
                              <Select.Item label="SOLTEIRO/A" value="SOLTEIRO/A" />
                              <Select.Item label="COMPANHEIRO/A" value="COMPANHEIRO/A" />
                              <Select.Item label="DIVIRCIADO/A" value="DIVIRCIADO/A" />
                              <Select.Item label="VIÚVO/A" value="VIÚVO/A" />
                            </Select>
                            <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                              Campo inválido
                            </FormControl.ErrorMessage>
                          </FormControl>
                        </>
                      )}
                    </>
                  ) : page === 4 && (
                    <>
                      <FormControl style={{marginTop: 20}} isInvalid={errors.find(response => response === 'usoVeiculo')}>
                        <Text style={{ fontSize: 20, fontWeight: '600', marginBottom: 5 }}>USO DO VEÍCULO:</Text>
                        <Select
                          ref={usoVeiculoRef}
                          style={{
                            padding: 10,
                            fontSize: 20,
                            color: 'black',
                            fontWeight: '700'
                          }}
                          selectedValue={usoVeiculo}
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
                          onValueChange={(itemValue) => {
                            if(itemValue) {
                              setUsoVeiculo(itemValue);
                              removeError('usoVeiculo');
                            }else {
                              addError('usoVeiculo');
                            }
                          }}
                        >
                          <Select.Item label="LAZER E IDA E VOLTA AO TRABALHO" value="LAZER E IDA E VOLTA AO TRABALHO" />
                          <Select.Item label="SÓ LAZER" value="SÓ LAZER" />
                          <Select.Item label="VISITA A CLIENTES" value="VISITA A CLIENTES" />
                          <Select.Item label="MOTORISTA DE APLICATIVO" value="MOTORISTA DE APLICATIVO" />
                          <Select.Item label="TAXI" value="TAXI" />
                          <Select.Item label="PARA ENTREGAS" value="PARA ENTREGAS" />
                        </Select>
                        <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                          Campo inválido
                        </FormControl.ErrorMessage>
                      </FormControl>
                      <FormControl style={{marginTop: 20}} isInvalid={errors.find(response => response === 'residenciaVeiculo')}>
                        <Text style={{ fontSize: 20, fontWeight: '600', marginBottom: 5 }}>RESIDE EM:</Text>
                        <Select
                          ref={residenciaVeiculoRef}
                          style={{
                            padding: 10,
                            fontSize: 20,
                            color: 'black',
                            fontWeight: '700'
                          }}
                          selectedValue={residenciaVeiculo}
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
                          onValueChange={(itemValue) => {
                            if(itemValue) {
                              setResidenciaVeiculo(itemValue);
                              removeError('residenciaVeiculo');
                            }else {
                              addError('residenciaVeiculo');
                            }
                          }}
                        >
                          <Select.Item label="CASA" value="CASA" />
                          <Select.Item label="APARTAMENTO" value="APARTAMENTO" />
                          <Select.Item label="CONDOMÍNIO" value="CONDOMÍNIO" />
                        </Select>
                        <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                          Campo inválido
                        </FormControl.ErrorMessage>
                      </FormControl>
                      <FormControl style={{marginTop: 20}} isInvalid={errors.find(response => response === 'garagemResidencia')}>
                        <Text style={{ fontSize: 20, fontWeight: '600', marginBottom: 5 }}>GARAGEM NA RESIDÊNCIA?</Text>
                        <Select
                          ref={garagemResidenciaRef}
                          style={{
                            padding: 10,
                            fontSize: 20,
                            color: 'black',
                            fontWeight: '700'
                          }}
                          selectedValue={garagemResidencia}
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
                          onValueChange={(itemValue) => {
                            if(itemValue) {
                              setGaragemResidencia(itemValue);
                              removeError('garagemResidencia');
                            }else {
                              addError('garagemResidencia');
                            }
                          }}
                        >
                          <Select.Item label="NÃO" value="NÃO" />
                          <Select.Item label="SIM, COM PORTÃO AUTOMÁTICO" value="SIM, COM PORTÃO AUTOMÁTICO" />
                          <Select.Item label="SIM, COM PORTÃO MANUAL" value="SIM, COM PORTÃO MANUAL" />
                          <Select.Item label="SIM, EM ESTACIONAMENTO PAGO" value="SIM, EM ESTACIONAMENTO PAGO" />
                        </Select>
                        <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                          Campo inválido
                        </FormControl.ErrorMessage>
                      </FormControl>
                      <FormControl style={{marginTop: 20}} isInvalid={errors.find(response => response === 'garagemTrabalho')}>
                        <Text style={{ fontSize: 20, fontWeight: '600', marginBottom: 5 }}>GARAGEM NO TRABALHO?</Text>
                        <Select
                          ref={garagemTrabalhoRef}
                          style={{
                            padding: 10,
                            fontSize: 20,
                            color: 'black',
                            fontWeight: '700'
                          }}
                          selectedValue={garagemTrabalho}
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
                          onValueChange={(itemValue) => {
                            if(itemValue) {
                              setGaragemTrabalho(itemValue);
                              removeError('garagemTrabalho');
                            }else {
                              addError('garagemTrabalho');
                            }
                          }}
                        >
                          <Select.Item label="SIM" value="SIM" />
                          <Select.Item label="NÃO" value="NÃO" />
                          <Select.Item label="NÃO TRABALHA" value="NÃO TRABALHA" />
                          <Select.Item label="NÃO UTILIZA PARA IR AO TRABALHO" value="NÃO UTILIZA PARA IR AO TRABALHO" />
                        </Select>
                        <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                          Campo inválido
                        </FormControl.ErrorMessage>
                      </FormControl>
                      <FormControl style={{marginTop: 20}} isInvalid={errors.find(response => response === 'garagemEscola')}>
                        <Text style={{ fontSize: 20, fontWeight: '600', marginBottom: 5 }}>GARAGEM NA ESCOLA?</Text>
                        <Select
                          ref={garagemEscolaRef}
                          style={{
                            padding: 10,
                            fontSize: 20,
                            color: 'black',
                            fontWeight: '700'
                          }}
                          selectedValue={garagemEscola}
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
                          onValueChange={(itemValue) => {
                            if(itemValue) {
                              setGaragemEscola(itemValue);
                              removeError('garagemEscola');
                            }else {
                              addError('garagemEscola');
                            }
                          }}
                        >
                          <Select.Item label="SIM" value="SIM" />
                          <Select.Item label="NÃO" value="NÃO" />
                          <Select.Item label="NÃO ESTUDA" value="NÃO ESTUDA" />
                          <Select.Item label="NÃO UTILIZA PARA IR A ESCOLA" value="NÃO UTILIZA PARA IR A ESCOLA" />
                        </Select>
                        <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                          Campo inválido
                        </FormControl.ErrorMessage>
                      </FormControl>
                    </>
                  )}
                </View>
              )}
              <View style={{marginTop: 50}}>
                <View
                  style={{
                    flexDirection: 'row',
                  }}
                >
                  {page > 0 && (
                    <TouchableOpacity
                      onPress={() => {
                        setPage(page-1);
                      }}
                      style={{
                        backgroundColor: COLORS(corretora ? corretora.layout.theme : themeDefault).primary,
                        padding: 10,
                        paddingVertical: 12,
                        alignItems: 'center',
                        borderRadius: 5,
                        width: '50%',
                        marginRight: 5
                      }}
                    >
                      <Feather style={{
                        position: 'absolute',
                        left: 10,
                        top: '50%'
                      }} name='arrow-left' color='white' size={25} />
                      <Text
                        style={{
                          fontWeight: '800',
                          color: 'white',
                          fontSize: 20,
                        }}
                      >VOLTAR</Text>
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity
                    onPress={() => {
                      if(tipo !== 'veicular') {
                        enviarSeguro();
                      }else if(page <= 3) {
                        proximaPagina();
                      }else {
                        enviarSeguro();
                      }
                    }}
                    style={{
                      backgroundColor: COLORS(corretora ? corretora.layout.theme : themeDefault).primary,
                      padding: 10,
                      paddingVertical: 12,
                      alignItems: 'center',
                      borderRadius: 5,
                      width: page === 0 ? '100%' : '50%',
                      marginLeft: page > 0 ? 4 : 0
                    }}
                  >
                    <Text
                      style={{
                        fontWeight: '800',
                        color: 'white',
                        fontSize: 20,
                      }}
                    >{tipo !== 'veicular' ? 'ENVIAR' : page === 4 ? 'ENVIAR' : 'AVANÇAR'}</Text>
                    <Feather style={{
                      position: 'absolute',
                      right: 10,
                      top: '50%'
                    }} name={tipo !== 'veicular' ? 'send' : page === 4 ? 'send' : 'arrow-right'} color='white' size={25} />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </>
    )
  }

  return (
    <>
      <StatusBar style='light' />
      <Body />
    </>
  )
}

export default FazerSeguro;