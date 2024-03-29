import { StatusBar } from 'expo-status-bar';
import { CheckIcon, Divider, FormControl, Input, Select, Toast, WarningOutlineIcon } from 'native-base';
import { useEffect, useState } from 'react';
import { Alert, Keyboard, KeyboardAvoidingView, Platform, ScrollView, Text, TouchableOpacity, View } from 'react-native';

import styled from 'styled-components';

import Header from '../../components/Header';
import { COLORS } from '../../utils/constants';
import { maskCEP, maskCPF, maskDate, maskPhone, maskPlaca, maskYear } from '../../utils/maskedInput';

import Feather from 'react-native-vector-icons/Feather';

import useAuth from '../../hooks/useAuth';
import { validateCEP, validateCPF, validatePlaca, validateYear } from '../../utils/validateInput';

import { addYears, endOfDay, setHours, setMinutes } from 'date-fns';

import firebase from '../../../firebase';
import generateToken from '../../hooks/generateToken';

export default function SeguroExterno({ navigation, route }) {
  const { corretora, setCPF: setCPFContext } = useAuth();

  const params = route.params;

  const [placa, setPlaca] = useState(params?.placa || '');
  const [seguradora, setSeguradora] = useState(params?.seguradora || '');
  const [vigenciaInicio, setVigenciaInicio] = useState(params?.vigenciaInicio || '');
  const [veiculo, setVeiculo] = useState(params?.veiculo || '');
  const [anoModelo, setAnoModelo] = useState(params?.anoModelo || '');
  const [usoVeiculo, setUsoVeiculo] = useState(params?.usoVeiculo || '');
  const [segurado, setSegurado] = useState(params?.segurado || '');
  const [cpf, setCPF] = useState(params?.cpf || '');
  const [cepPernoite, setCEPPernoite] = useState(params?.cep || '');
  const [telefone, setTelefone] = useState(params?.telefone || '');

  const [seguradoras, setSeguradoras] = useState([]);

  const [errors, setErrors] = useState([]);

  const [loading, setLoading] = useState(false);

  const [accept, setAccept] = useState(params?.type === 'edit' ? true : false);

  useEffect(() => {
    firebase.firestore().collection('seguradoras').get()
    .then((response) => {
      const array = [];
      response.forEach(item => {
        array.push(item.data());
      });
      
      setSeguradoras(array);
    })
  }, []);

  async function adicionarSeguroExterno() {
    if(!accept) {
      Alert.alert('Aceite os termos de condições');
      return;
    }
    
    if((!placa || placa?.length < 7) || !seguradora || !vigenciaInicio || !veiculo || !anoModelo || !usoVeiculo || !segurado || !cpf || !cepPernoite || !telefone) {
      Alert.alert('Preencha todos os campos!');
      return;
    }

    if(errors?.length > 0) {
      Alert.alert('Algum campo está inválido');
      return;
    }

    const placaValidated = firebase.firestore().collection('seguros')
    .where('ativo', '==', true)
    .where('veiculo.placa', '==', placa).get()
    .then((response) => {
      if(response.size) {
        return true;
      }else {
        return false;
      }
    })
    .catch(() => {
      return false;
    });

    if(!placaValidated) {
      Alert.alert('Placa existente', 'Essa placa já consta nos registro da corretora');
      return;
    }

    const data = {
      uid: route?.params?.type === 'edit' ? route.params.uid : generateToken(),
      seguradora: {
        uid: seguradoras.filter(x => x.uid === seguradora)[0].uid,
        razao_social: seguradoras.filter(x => x.uid === seguradora)[0].razao_social,
      },
      veiculo: {
        condutor: null,
        veiculo: veiculo,
        placa: placa,
        placaQuery: placa ? `${placa[3]}${placa[5]}${placa[6]}` : null,
        modelo: null,
        cepPernoite: cepPernoite,
        anoModelo: anoModelo || null
      },
      endereco: {
        cep: cepPernoite,
        bairro: null,
        cidade: null,
        estado: null,
      },
      seguro: {
        vigencia: setMinutes(setHours(new Date(vigenciaInicio.split('/')[2], (vigenciaInicio.split('/')[1] - 1), vigenciaInicio.split('/')[0]), 0), 0),
        vigenciaFinal: endOfDay(setMinutes(setHours(addYears(new Date(vigenciaInicio.split('/')[2], (vigenciaInicio.split('/')[1] - 1), vigenciaInicio.split('/')[0]), 1), 0), 0))
      },
      segurado: {
        anoAdesao: null,
        nome: segurado,
        cpf: cpf,
        telefone: telefone,
      },
      corretor: null,
      corretora: {
        uid: corretora.uid,
        razao_social: corretora.razao_social,
      },
      riscos: {
        usoVeiculo: usoVeiculo || null,
      },
      ativo: true,
      tipo: 'veicular',
      externo: true,
      created: new Date()
    };

    Toast.show({
      title: 'ENVIANDO...'
    });

    setLoading(true);
    await firebase.firestore().collection('seguros').doc(data.uid).set(data, {
      merge: true
    })
    .then(() => {
      Keyboard.dismiss();
      Toast.closeAll();

      Toast.show({
        title: `${params?.type === 'edit' ? 'ALTERADO' : 'ENVIADO'} COM SUCESSO!`,
        description: 'redirecionando para página de seguros...',
        placement: 'bottom'
      });

      setCPFContext(cpf);
      setTimeout(() => {
        navigation.navigate('home', {
          cpf: cpf
        });
      }, 1500);
    })
    .catch((error) => {
      setLoading(false);
    });
  }

  return (
    <>
      <StatusBar style='light' />
      <Header title={`${route?.params?.type === 'edit' ? 'ALTERAR' : 'ADICIONAR'} MEU SEGURO`} navigation={navigation} />
      <KeyboardAvoidingView
        style={{
          flex: 1,
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
              justifyContent: 'center',
              borderRadius: 15,
              margin: 5,
              marginBottom: 100,
              paddingHorizontal: 20,
              paddingTop: route?.params?.type === 'edit' ? 30 : 10,
              paddingBottom: 50,
              paddingTop: 30,
            }}
          >
            <FormControl isInvalid={errors.includes('segurado')}>
              <Text style={{ fontSize: 20, fontWeight: '600', marginBottom: 5 }}>NOME DO SEGURADO: <Text style={{ color: 'red' }}>*</Text></Text>
              <InputStyle borderColor='#999' value={segurado} returnKeyType='done' placeholder='NOME DO SEGURADO' keyboardType='default' autoCapitalize='characters' autoCorrect={false} autoCompleteType='off'
                onChangeText={(value) => {
                  if(!value) {
                    setSegurado('');
                    return;
                  }
                  
                  setSegurado(value);
                }}
                onBlur={() => {
                  if(segurado) {
                    setErrors(e => e.filter(x => x !== 'segurado'));
                  }else {
                    setErrors(e => [...e, 'segurado'])
                  }
                }}
              />
              <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size='xs' />}>
                Campo inválido
              </FormControl.ErrorMessage>
            </FormControl>
            <FormControl isInvalid={errors.includes('telefone')} style={{ marginTop: 20 }}>
              <Text style={{ fontSize: 20, fontWeight: '600', marginBottom: 5 }}>TELEFONE: <Text style={{ color: 'red' }}>*</Text></Text>
              <InputStyle borderColor='#999' value={telefone} returnKeyType='done' placeholder='(00) 00000-0000' keyboardType='number-pad' autoCapitalize='characters' autoCorrect={false} autoCompleteType='off'
                onChangeText={(value) => {
                  if(!value) {
                    setTelefone('');
                    return;
                  }
                  
                  setTelefone(maskPhone(value));
                }}
                onBlur={() => {
                  if(String(telefone).length === 15) {
                    setErrors(e => e.filter(x => x !== 'telefone'));
                  }else {
                    setErrors(e => [...e, 'telefone'])
                  }
                }}
              />
              <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size='xs' />}>
                Campo inválido
              </FormControl.ErrorMessage>
            </FormControl>
            <FormControl isInvalid={errors.includes('cpf')} style={{ marginTop: 20 }}>
              <Text style={{ fontSize: 20, fontWeight: '600', marginBottom: 5 }}>CPF: <Text style={{ color: 'red' }}>*</Text></Text>
              <InputStyle borderColor='#999' value={cpf} returnKeyType='done' placeholder='000.000.000-00' keyboardType='number-pad' autoCapitalize='characters' autoCorrect={false} autoCompleteType='off'
                onChangeText={(value) => {
                  if(!value) {
                    setCPF('');
                    return;
                  }
                  
                  setCPF(maskCPF(value));
                }}
                onBlur={() => {
                  if(validateCPF(cpf)) {
                    setErrors(e => e.filter(x => x !== 'cpf'));
                  }else {
                    setErrors(e => [...e, 'cpf'])
                  }
                }}
              />
              <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size='xs' />}>
                CPF inválido
              </FormControl.ErrorMessage>
            </FormControl>
            <FormControl isInvalid={errors.includes('seguradora')} style={{ marginTop: 20 }}>
              <Text style={{ fontSize: 20, fontWeight: '600', marginBottom: 5 }}>SEGURADORA: <Text style={{ color: 'red' }}>*</Text></Text>
              <SelectStyle borderColor='#999' selectedValue={seguradora} placeholder='SEGURADORA' onValueChange={(value) => {
                if(value) {
                  setSeguradora(value);
                  setErrors(e => e.filter(x => x !== value))
                }
              }} _selectedItem={{
                bg: COLORS(corretora ? corretora.layout.theme : themeDefault).primary,
                endIcon: <CheckIcon size='5' />,
              }} collapsable
                onBlur={() => {
                  if(seguradora) {
                    setErrors(e => e.filter(x => x !== 'seguradora'));
                  }else {
                    setErrors(e => [...e, 'seguradora'])
                  }
                }}
              >
                {seguradoras.sort((a, b) => String(a.razao_social).localeCompare(b.razao_social)).map((item, index) => (
                  <Select.Item value={item.uid} label={String(item.razao_social).toUpperCase()} key={index}>{item.razao_social}</Select.Item>
                ))}
              </SelectStyle>
              <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size='xs' />}>
                Campo inválido
              </FormControl.ErrorMessage>
            </FormControl>
            <FormControl isInvalid={errors.includes('vigenciaInicio')} style={{ marginTop: 20 }}>
              <Text style={{ fontSize: 20, fontWeight: '600', marginBottom: 5 }}>INÍCIO DE VIGÊNCIA: <Text style={{ color: 'red' }}>*</Text></Text>
              <InputStyle borderColor='#999' value={vigenciaInicio} returnKeyType='done' placeholder='00/00/0000' keyboardType='number-pad' autoCapitalize='characters' autoCorrect={false} autoCompleteType='off'
                onChangeText={(value) => {
                  if(!value) {
                    setVigenciaInicio('');
                    return;
                  }
                  
                  setVigenciaInicio(maskDate(value));
                }}
                onBlur={() => {
                  if(vigenciaInicio.length === 10) {
                    setErrors(e => e.filter(x => x !== 'vigenciaInicio'));
                  }else {
                    setErrors(e => [...e, 'vigenciaInicio'])
                  }
                }}
              />
              <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size='xs' />}>
                Campo inválido
              </FormControl.ErrorMessage>
            </FormControl>
            <FormControl isInvalid={errors.includes('veiculo')} style={{ marginTop: 20 }}>
              <Text style={{ fontSize: 20, fontWeight: '600', marginBottom: 5 }}>VEÍCULO: <Text style={{ color: 'red' }}>*</Text></Text>
              <InputStyle borderColor='#999' value={veiculo} returnKeyType='done' placeholder='MODELO DO VEÍCULO' keyboardType='default' autoCapitalize='characters' autoCorrect={false} autoCompleteType='off'
                onChangeText={(value) => {
                  if(!value) {
                    setVeiculo('');
                    return;
                  }
                  
                  setVeiculo(value);
                }}
                onBlur={() => {
                  if(veiculo) {
                    setErrors(e => e.filter(x => x !== 'veiculo'));
                  }else {
                    setErrors(e => [...e, 'veiculo'])
                  }
                }}
              />
              <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size='xs' />}>
                Campo inválido
              </FormControl.ErrorMessage>
            </FormControl>
            <FormControl isInvalid={errors.includes('anoModelo')} style={{ marginTop: 20 }}>
              <Text style={{ fontSize: 20, fontWeight: '600', marginBottom: 5 }}>ANO DO MODELO: <Text style={{ color: 'red' }}>*</Text></Text>
              <InputStyle borderColor='#999' value={anoModelo} returnKeyType='done' placeholder='MODELO DO VEÍCULO' keyboardType='default' autoCapitalize='characters' autoCorrect={false} autoCompleteType='off'
                onChangeText={(value) => {
                  if(!value) {
                    setAnoModelo('');
                    return;
                  }
                  
                  setAnoModelo(maskYear(value));
                }}
                onBlur={() => {
                  if(validateYear(anoModelo)) {
                    setErrors(e => e.filter(x => x !== 'anoModelo'));
                  }else {
                    setErrors(e => [...e, 'anoModelo'])
                  }
                }}
              />
              <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size='xs' />}>
                Campo inválido
              </FormControl.ErrorMessage>
            </FormControl>
            <FormControl isInvalid={errors.includes('usoVeiculo')} style={{ marginTop: 20 }}>
              <Text style={{ fontSize: 20, fontWeight: '600', marginBottom: 5 }}>USO DO VEÍCULO: <Text style={{ color: 'red' }}>*</Text></Text>
              <SelectStyle borderColor='#999' selectedValue={usoVeiculo} placeholder='USO DO VEÍCULO' onValueChange={(value) => {
                if(value) {
                  setUsoVeiculo(value);
                  setErrors(e => e.filter(x => x !== value))
                }
              }} _selectedItem={{
                bg: COLORS(corretora ? corretora.layout.theme : themeDefault).primary,
                endIcon: <CheckIcon size='5' />,
              }} collapsable
                onBlur={() => {
                  if(usoVeiculo) {
                    setErrors(e => e.filter(x => x !== 'usoVeiculo'));
                  }else {
                    setErrors(e => [...e, 'usoVeiculo'])
                  }
                }}
              >
                {['lazer e ida e volta ao trabalho', 'só lazer', 'visita a clientes', 'motorista de aplicativo', 'táxi', 'transporte de mercadorias'].map((item, index) => (
                  <Select.Item value={item} label={String(item).toUpperCase()} key={index}>{item}</Select.Item>
                ))}
              </SelectStyle>
              <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size='xs' />}>
                Campo inválido
              </FormControl.ErrorMessage>
            </FormControl>
            <FormControl isInvalid={errors.includes('placa')} style={{ marginTop: 20 }}>
              <Text style={{ fontSize: 20, fontWeight: '600', marginBottom: 5 }}>PLACA: <Text style={{ color: 'red' }}>*</Text></Text>
              <InputStyle borderColor='#999' value={placa} returnKeyType='done' placeholder='AAA0000 ou AAA0A00' keyboardType='default' autoCapitalize='characters' autoCorrect={false} autoCompleteType='off'
                onChangeText={(value) => {
                  if(!value) {
                    setPlaca('');
                    return;
                  }

                  const placaMasked = maskPlaca(value);
                  setPlaca(placaMasked);

                  if(placaMasked.length === 7) {
                    firebase.firestore().collection('seguros').where('ativo', '==', true).where('veiculo.placa', '==', placaMasked).get()
                    .then((response) => {
                      
                      if(response.size) {
                        Alert.alert('Placa existente', 'Essa placa já consta nos registro da corretora');
                        setErrors(e => [...e, 'placa']);
                      }else {
                        setErrors(e => e.filter(x => x !== 'placa'));
                      }
                    });
                  }
                }}
                onBlur={() => {
                  if(validatePlaca(placa)) {
                    setErrors(e => e.filter(x => x !== 'placa'));
                  }else {
                    setErrors(e => [...e, 'placa']);
                  }
                }}
              />
              <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size='xs' />}>
                Campo inválido
              </FormControl.ErrorMessage>
            </FormControl>
            <FormControl isInvalid={errors.includes('cepPernoite')} style={{ marginTop: 20 }}>
              <Text style={{ fontSize: 20, fontWeight: '600', marginBottom: 5 }}>CEP: <Text style={{ color: 'red' }}>*</Text></Text>
              <InputStyle borderColor='#999' value={cepPernoite} returnKeyType='done' placeholder='00000-000' keyboardType='number-pad' autoCapitalize='characters' autoCorrect={false} autoCompleteType='off'
                onChangeText={(value) => {
                  if(!value) {
                    setCEPPernoite('');
                    return;
                  }
                  
                  setCEPPernoite(maskCEP(value));
                }}
                onBlur={() => {
                  if(validateCEP(cepPernoite)) {
                    setErrors(e => e.filter(x => x !== 'cepPernoite'));
                  }else {
                    setErrors(e => [...e, 'cepPernoite'])
                  }
                }}
              />
              <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size='xs' />}>
                Campo inválido
              </FormControl.ErrorMessage>
            </FormControl>
            {route?.params?.type !== 'edit' && (
              <>
                <Divider style={{ marginVertical: 20 }} />
                <Text
                  style={{
                    fontSize: 20,
                    flex: 1,
                    textAlign: 'left',
                    fontWeight: 'bold'
                  }}
                >
                  Ao inserir o veículo em nosso aplicativo você concorda:
                </Text>
                <Text
                  style={{
                    marginTop: 10,
                    fontSize: 15,
                    flex: 1,
                    textAlign: 'left'
                  }}
                >
                1 - fornecer as informações para o cálculo do seguro do seu veículo e receber,
                {'\n'}
                gratuitamente e sem compromisso, nossa cotação.
                </Text>
                <TouchableOpacity
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                    marginTop: 20
                  }}
                  onPress={() => setAccept(e => !e)}
                >
                  <View
                    style={{
                      borderWidth: !accept ? 1 : 0,
                      borderRadius: 5,
                      width: 20,
                      height: 20,
                      marginRight: 10,
                      backgroundColor: !accept ? 'white' : COLORS(corretora ? corretora.layout.theme : themeDefault).primary,
                      justifyContent: 'center',
                      alignItems: 'center'
                    }}
                  >
                    {accept && <CheckIcon size={5} style={{ color: 'white' }} />}
                  </View>
                  <Text
                    style={{
                      fontSize: 15,
                      flex: 1,
                      textAlign: 'justify'
                    }}
                  >
                    CONCORDAR
                  </Text>
                </TouchableOpacity>
              </>
            )}
            <TouchableOpacity
              disabled={!accept || loading}
              onPress={adicionarSeguroExterno}
              style={{
                backgroundColor: !accept || loading ? '#D1D1D1' : COLORS(corretora ? corretora.layout.theme : themeDefault).primary,
                padding: 10,
                paddingVertical: 12,
                alignItems: 'center',
                borderRadius: 5,
                width: '100%',
                marginRight: 5,
                marginTop: 20
              }}
            >
              <Text
                style={{
                  fontWeight: '800',
                  color: !accept || loading ? 'black' : 'white',
                  fontSize: 20,
                }}
              >ENVIAR</Text>
              <Feather style={{
                position: 'absolute',
                right: 10,
                top: '50%'
              }} name='send' color='white' size={25} />
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  )
}

export const SelectStyle = styled(Select)`
  border-width: 1px;
  border-radius: 5px;
  padding: 10px;
  font-size: 20px;
  color: #000;
  font-weight: 700;
  text-transform: uppercase;
  border-color: transparent;
`;

export const InputStyle = styled(Input)`
  border-width: 1px;
  border-radius: 5px;
  padding: 10px;
  font-size: 20px;
  color: #000;
  font-weight: 700;
  text-transform: uppercase;
  border-color: transparent;
`;