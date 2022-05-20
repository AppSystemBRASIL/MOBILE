import React, { useContext, useState, useEffect } from 'react';
import { View, Text, Platform, TouchableOpacity, KeyboardAvoidingView, BackHandler } from 'react-native';

import { Input, WarningOutlineIcon, FormControl, Select, CheckIcon } from 'native-base';

import Feather from 'react-native-vector-icons/Feather';

import { COLORS } from '../../../utils/constants';

import firebase from '../../../../firebase';

import { themeDefault } from '../../../config';
import Context from '../../../context';

import segurosArray from '../../../data/seguros';

import styled from 'styled-components';
import { useNavigation } from '@react-navigation/native';

const Formulario = ({ type, success, error, loading, topPage, setView, page, setPage }) => {
  const { goBack } = useNavigation();

  const { corretor, corretora } = useContext(Context);
  const [errors, setErrors] = useState([]);

  const inputsFull = segurosArray.filter(e => e.tipo === type)[0].inputs;
  const [inputs, setInputs] = useState(inputsFull?.filter(e => e.page === page) || []);
  
  const pageMax = Math.max.apply(null, inputsFull?.map(e => e.page));

  const [data, setData] = useState(inputsFull?.map(item => item.name).reduce(function(acc, cur) {
    acc[cur] = null;
    return acc;
  }, {}));

  useEffect(() => {
    topPage();
    setInputs(getInputs);
  }, [page]);

  function getInputs() {
    const inputsPages = inputsFull?.filter(e => e.page === page) || [];

    return inputsPages;
  }

  const validated = () => {
    let retorno = true;
    const inputsVerify = page === pageMax ? inputsFull : inputs;
    
    for(const i in inputsVerify) {
      if(inputsVerify[i].required === undefined || inputsVerify[i].required === true) {
        if((inputsVerify[i].view === undefined || inputsVerify[i].view(data) === true) && inputsVerify[i].validated(data[inputsVerify[i].name]) === true) {
          setErrors(e => [...e, inputsVerify[i].name]);
  
          retorno = false;
        }
      }
    }

    return retorno;
  }

  function previusPage() {
    if(page > 1) {
      setPage(e => e - 1);
    }
  }

  function nextPage() {
    if(validated()) {
      if(page < pageMax) {
        setPage(e => e + 1);
      }
    }
  }

  async function gerarCotacao() {
    setErrors([]);

   if(!validated()) {
     topPage();
     return;
   }

    setErrors([]);
    loading();

    await firebase.firestore().collection('cotacoes').add({
      tipo: type,
      corretora: corretora ? {
        uid: corretora.uid,
        razao_social: corretora.razao_social,
      } : null,
      corretor: corretor ? {
        uid: corretor.uid,
        nome: corretor.displayName,
      } : null,
      segurado: {
        nome: data.nomeSegurado || null,
        cpf: data.registroSegurado || null,
        celular: data.celularSegurado,
        profissao: data.profissaoSegurado || null,
        estadoCivil: data.estadoCivilSegurado || null,
        cnh: data.dataCNHSegurado || null,
        cep: data.cepSegurado || null,
        proprietario: data.seguradoProprietario || null,
        nascimento: data.nascimentoSegurado || null,
      },
      endereco: {
        cep: data.cepSegurado || null,
        rua: null,
        bairro: null,
        numero: null,
        complemento: null,
        estado: data.estadoSegurado || null,
        cidade: data.cidadeSegurado || null,
        pais: null,
        tipo: null,
      },
      created: new Date(),
      seguro: {
        tipo: data.tipoSeguro || null,
        seguradora: data.seguradoraSeguro || null,
        vigencia: data.finalVigenciaSeguro || null,
        sinistro: data.houveSinistroSeguro || null,
        apolice: null,
        ci: null,
      },
      veiculo: {
        placa: data.placaVeiculoSeguro || null,
        veiculo: data.veiculoSeguro || null,
        ano: data.anoFabricacaoSeguro || null,
        modelo: data.anoModeloSeguro || null,
        cep: data.cepVeiculo || null,
        financiado: data.veiculoFinanciado || null,
        blindado: data.veiculoBlindado || null,
        kitGas: data.veiculoKitGas || null,
        uso: data.usoVeiculo || null,
      },
      imovel: {
        cep: data.cepImovel || null,
        tipoImovel: data.tipoImovel || null,
        valorImovel: data.valorImovel || null,
        valorMoveis: data.valorMoveis || null,
        usoImovel: data.usoImovel || null,
        propriedadeImovel: data.propriedadeImovel || null,
      },
      condutor: {
        nome: data.principalCondutor === 'eu mesmo' ? data.nomeSegurado || null : data.nomePrincipalCondutor || null,
        relacao: data.principalCondutor === 'eu mesmo' ? 'próprio' : data.relacaoSegurado || null,
        cpf: data.principalCondutor === 'eu mesmo' ? data.registroSegurado || null : data.CPFSegurado || null,
        cnh: data.principalCondutor === 'eu mesmo' ? data.dataCNHSegurado : data.dataCNHCondutor || null,
        estadoCivil: data.principalCondutor === 'eu mesmo' ? data.estadoCivilSegurado || null : data.estadoCivilCondutor || null,
        profissao: data.principalCondutor === 'eu mesmo' ? data.profissaoSegurado || null : data.profissaoCondutor || null,
        
      },
      riscos: {
        condutorResideMenor: data.condutorResideMenor || null,
        usoVeiculo: data.usoVeiculo || null,
        residenciaVeiculo: data.residenciaVeiculo || null,
        garagemResidencia: data.garagemResidencia || null,
        garagemTrabalho: data.garagemTrabalho || null,
        garagemEscola: data.garagemEscola || null,
        praticaEsporte: data.praticaEsporte === 'sim' ? data.praticaEsporteText || praticaEsporte : null || null,
        praticaEsporteFrenquencia: data.praticaEsporteFrenquencia ? Number(data.praticaEsporteFrenquencia?.split(' ')[0]) : null || null,
        utilizaraMotocicleta: data.utilizaraMotocicleta || null,
      },
      viagem: {
        tipo: data.tipoViagem || null,
        transporte: data.meioTransporte || null,
        motivo: data.motivo || null,
        origem: data.origemViagem || null,
        destino: data.destinoViagem || null,
        ida: data.dataIdaViagem || null,
        retorno: data.dataRetornoViagem || null,
      },
      saude: {
        plano: data.tipoPlanoSaude || null,
      },
      beneficiarios: {
        quantidade: data.qtdBeneficiario ? Number(data.qtdBeneficiario?.split(' ')[0]) : null || null,
        nascimento: [
          data.nascimentoBeneficiario1 || null,
          data.nascimentoBeneficiario2 || null,
          data.nascimentoBeneficiario3 || null,
          data.nascimentoBeneficiario4 || null,
          data.nascimentoBeneficiario5 || null,
          data.nascimentoBeneficiario6 || null,
          data.nascimentoBeneficiario7 || null,
          data.nascimentoBeneficiario8 || null,
          data.nascimentoBeneficiario9 || null,
          data.nascimentoBeneficiario10 || null,
        ].filter(item => item),
      },
      status: 0,
    }).then((response) => {
      firebase.firestore().collection('cotacoes').doc(response.id).set({
        uid: response.id
      }, { merge: true });

      success();
    })
    .catch(() => {
      error();
    })
    .finally(() => {
      setErrors([]);
    })
  }

  if([...inputs || []]?.length === 0) {
    return <></>;
  }

  return (
    <KeyboardAvoidingView
      style={{
        flex: 1,
      }}
      behavior={Platform.OS === "ios" ? "padding" : null}
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
          paddingBottom: 50
        }}
      >
        {[...inputs].map((item, index) => (item.view === undefined || item.view(data)) && (
          <FormControl key={index} style={{ marginTop: index > 0 ? 20 : 0 }} isInvalid={errors.find(response => response === item.name)}>
            <Text style={{ fontSize: 20, fontWeight: '600', marginBottom: 5 }}>{String(item.label || '').toUpperCase()}: {(item.required === undefined || item.required === true) && <Text style={{ color: 'red' }}>*</Text>}</Text>
            {(!data[item.name] && item.infoText) && (
              <Text style={{ marginTop: 10 }}>
                <Text style={{ textTransform: 'uppercase', textDecorationLine: 'underline', fontWeight: '700' }}>
                  {item.infoText.title}:
                </Text>
                {`\n`}
                {item.infoText.content}
                {`\n`}
              </Text>
            )}
            {!item.selects ? (
              <InputStyle borderColor='#999' maxLength={item.maxLength} value={data[item.name] || ''} returnKeyType='done' placeholder={String(item.placeholder || '').toUpperCase()} keyboardType={item.inputType} autoCapitalize='characters' autoCorrect={false} autoCompleteType='off' onChangeText={(value) => setData(e => ({...e, [item.name]: (item.formatter) ? item.formatter(value) : value}))} onBlur={() => {
                if(item.required === undefined || item.required === true) {
                  if(!item.validated(data[item.name])) {
                    setErrors(e => e.filter(x => x !== item.name));
                  }else {
                    setErrors(e => [...e, item.name]);
                  }
                }
              }} />
            ) : (
              <SelectStyle borderColor='#999' selectedValue={data[item.name]} accessibilityLabel={String(item.placeholder || '')?.toUpperCase()} placeholder={String(item.placeholder || '')?.toUpperCase()} onValueChange={(value) => {
                if(value) {
                  setData(e => ({...e, [item.name]: value}));
                  setErrors(e => e.filter(x => x !== item.name))
                }
              }} _selectedItem={{
                bg: COLORS(corretora ? corretora.layout.theme : themeDefault).primary,
                endIcon: <CheckIcon size="5" />,
              }} collapsable>
                {item.selects(data).map((itemSelect, indexSelect) => (
                  <Select.Item value={itemSelect} label={String(itemSelect).toUpperCase()} key={indexSelect}>{itemSelect}</Select.Item>
                ))}
              </SelectStyle>
            )}
            <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
              Campo inválido
            </FormControl.ErrorMessage>
          </FormControl>
        ))}
        <View style={{marginTop: 50}}>
          <View
            style={{
              flexDirection: 'row',
            }}
          >
            {(page > 1 && pageMax > 1) && (
              <TouchableOpacity
                onPress={previusPage}
                style={{
                  backgroundColor: COLORS(corretora ? corretora.layout.theme : themeDefault).primary,
                  padding: 10,
                  paddingVertical: 12,
                  alignItems: 'center',
                  borderRadius: 5,
                  width: '15%',
                  marginRight: 5
                }}
              >
                <Feather style={{
                  position: 'absolute',
                  left: 10,
                  top: '50%'
                }} name='arrow-left' color='white' size={25} />
              </TouchableOpacity>
            )}
            {page === pageMax ? (
              <TouchableOpacity
                onPress={gerarCotacao}
                style={{
                  backgroundColor: COLORS(corretora ? corretora.layout.theme : themeDefault).primary,
                  padding: 10,
                  paddingVertical: 12,
                  alignItems: 'center',
                  borderRadius: 5,
                  width: pageMax === 1 ? '100%' : page === pageMax ? '85%' : '100%',
                  marginRight: 5
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
                  right: 10,
                  top: '50%'
                }} name='send' color='white' size={25} />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={nextPage}
                style={{
                  backgroundColor: COLORS(corretora ? corretora.layout.theme : themeDefault).primary,
                  padding: 10,
                  paddingVertical: 12,
                  alignItems: 'center',
                  borderRadius: 5,
                  width: page === 1 ? '100%' : '85%',
                  marginRight: 5
                }}
              >
                <Text
                  style={{
                    fontWeight: '800',
                    color: 'white',
                    fontSize: 20,
                  }}
                >PRÓXIMA</Text>
                <Feather style={{
                  position: 'absolute',
                  right: 10,
                  top: '50%'
                }} name='arrow-right' color='white' size={25} />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
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

export default Formulario;