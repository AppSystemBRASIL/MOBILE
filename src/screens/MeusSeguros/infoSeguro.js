import React, { useEffect, useRef, useState } from 'react';
import { Linking, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import firebase from '../../../firebase';

import { AlertDialog, Button, Skeleton, Toast } from 'native-base';

import { StatusBar } from 'expo-status-bar';

import { format } from 'date-fns';
import Header from '../../components/Header';

import Feather from 'react-native-vector-icons/Feather';
import useAuth from '../../hooks/useAuth';
import { COLORS } from '../../utils/constants';

const ComoProcederInfoContent = ({ navigation, route }) => {
  const item = route.params;

  const { corretora, cpf, setCPF: setCPFContext } = useAuth();

  const Body = () => {
    const [loading, setLoading] = useState(false);

    const [dataSeguro, setDataSeguro] = useState(item);

    useEffect(() => {
      firebase.firestore().collection('seguradoras').doc(dataSeguro.seguradora.uid).get()
      .then((snap) => {
        if(snap.exists) {
          setDataSeguro(response => ({
            ...response,
            seguradora: {
              ...response.seguradora,
              contatos: snap.data().contatos
            }
          }))
        }
      })
      .finally(() => {
        setLoading(true)
      });
    }, []);

    const cancelRef = useRef(null);
    const [isOpen, setIsOpen] = useState(false);
    const onClose = () => setIsOpen(false);

    function excluirSeguro() {
      firebase.firestore().collection('seguros').doc(item.uid).delete()
      .then(() => {
        onClose();

        Toast.show({
          title: 'SEGURO EXCLUÍDO COM SUCESSO',
          placement: 'top'
        });

        setCPFContext(cpf);
        Toast.closeAll();
        navigation.navigate('meusSeguros', {
          cpf: cpf
        });
      })
    }

    if(dataSeguro.tipo !== 'veicular') {
      return <></>;
    }

    return (
      <ScrollView 
        showsVerticalScrollIndicator={false}
        style={{
          flex: 1,
          paddingTop: 20
        }}
      >
        <AlertDialog leastDestructiveRef={cancelRef} isOpen={isOpen} onClose={onClose}>
          <AlertDialog.Content>
            <AlertDialog.CloseButton />
            <AlertDialog.Header>DESEJA REALMENTE EXLCUIR O SEGURO</AlertDialog.Header>
            <AlertDialog.Body>
              Ao excluir o seguro, o mesmo não poderá ser recuperado.
              Para que tenha registrado o seguro novamente, é necessário que insira novamente na página de adição de seguros externos
            </AlertDialog.Body>
            <AlertDialog.Footer>
              <Button.Group space={2}>
                <Button variant="unstyled" colorScheme="coolGray" onPress={onClose} ref={cancelRef}>
                  CANCELAR
                </Button>
                <Button bgColor={COLORS(corretora ? corretora.layout.theme : themeDefault).primary} onPress={() => {
                  excluirSeguro()
                }}>
                  EXCLUIR
                </Button>
              </Button.Group>
            </AlertDialog.Footer>
          </AlertDialog.Content>
        </AlertDialog>
        <View
          activeOpacity={1} 
          style={{
            backgroundColor: 'white',
            borderRadius: 15,
            margin: 5,
            marginBottom: 100,
            paddingHorizontal: 20,
            paddingTop: 30,
          }}
        >
          {dataSeguro.externo && (
            <View
              style={{
                position: 'absolute',
                top: 10,
                right: 10,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'flex-end'
              }}
            >
              <TouchableOpacity
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'flex-start'
                }}
                onPress={() => navigation.navigate('seguroExterno', {
                  type: 'edit',
                  placa: dataSeguro.veiculo.placa,
                  seguradora: dataSeguro.seguradora.uid,
                  segurado: dataSeguro.segurado.nome,
                  telefone: dataSeguro.segurado.telefone,
                  cpf: dataSeguro.segurado.cpf,
                  vigenciaInicio: format(dataSeguro.seguro.vigencia.toDate(), 'dd/MM/yyyy'),
                  vigenciaFinal: format(dataSeguro.seguro.vigenciaFinal.toDate(), 'dd/MM/yyyy'),
                  veiculo: dataSeguro.veiculo.veiculo,
                  anoModelo: dataSeguro?.veiculo?.anoModelo || '',
                  usoVeiculo: dataSeguro.riscos.usoVeiculo,
                  cep: dataSeguro.endereco.cep,
                  uid: dataSeguro.uid
                })}
              >
                <Text
                  style={{
                    fontSize: 15,
                    marginRight: 5
                  }}
                >
                  ALTERAR
                </Text>
                <Feather
                  name='edit'
                  size={15}
                  color={COLORS(corretora ? corretora.layout.theme : themeDefault).primary}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                  marginLeft: 20
                }}
                onPress={() => {
                  setIsOpen(true);
                }}
              >
                <Text
                  style={{
                    fontSize: 15,
                    marginRight: 5
                  }}
                >
                  EXCLUIR
                </Text>
                <Feather
                  name='archive'
                  size={15}
                  color={COLORS(corretora ? corretora.layout.theme : themeDefault).primary}
                />
              </TouchableOpacity>
            </View>
          )}
          <View style={{
            width: '100%',
            height: '100%',
            flexDirection: 'row'
          }}>
            <View>
              <View style={{
                marginBottom: 20
              }}>
                {loading ? (
                  <>
                    <Text style={{fontWeight: 'bold', fontSize: 20}}>PLACA:</Text>
                    <Text style={{fontWeight: '900', fontSize: 25, color: '#555'}}>{dataSeguro.veiculo.placa}</Text>
                  </>
                ) : (
                  <>
                    <Skeleton startColor='gray.100' endColor='gray.300' style={{width: 70, height: 23, marginBottom: 5}} />
                    <Skeleton startColor='gray.100' endColor='gray.300' style={{width: 140, height: 27}} />
                  </>
                )}
              </View>
              <View style={{
                marginBottom: 20
              }}>
                {loading ? (
                  <>
                    <Text style={{fontWeight: 'bold', fontSize: 20}}>VIGÊNCIA:</Text>
                    <Text style={{fontWeight: '900', fontSize: 25, color: '#555'}}>{format(dataSeguro.seguro.vigencia.toDate(), 'dd/MM/yyyy')} até {format(dataSeguro.seguro.vigenciaFinal.toDate(), 'dd/MM/yyyy')}</Text>
                  </>
                ) : (
                  <>
                    <Skeleton startColor='gray.100' endColor='gray.300' style={{width: 195, height: 23, marginBottom: 5}} />
                    <Skeleton startColor='gray.100' endColor='gray.300' style={{width: 150, height: 27}} />
                  </>
                )}
              </View>
              <View style={{
                marginBottom: 20
              }}>
                {loading ? (
                  <>
                    <Text style={{fontWeight: 'bold', fontSize: 20}}>SEGURADORA:</Text>
                    <Text style={{fontWeight: '900', fontSize: 25, color: '#555'}}>{dataSeguro.seguradora.razao_social}</Text>
                  </>
                ) : (
                  <>
                    <Skeleton startColor='gray.100' endColor='gray.300' style={{width: 195, height: 23, marginBottom: 5}} />
                    <Skeleton startColor='gray.100' endColor='gray.300' style={{width: 150, height: 27}} />
                  </>
                )}
              </View>
              <View style={{
                marginBottom: loading ? 20 : 0
              }}>
                {!corretora && (
                  <>
                    {loading ? (
                      <>
                        <Text style={{fontWeight: 'bold', fontSize: 20}}>CORRETORA:</Text>
                        <Text style={{fontWeight: '900', color: '#555', fontSize: String(dataSeguro.corretora.razao_social).length > 20 ? 22 : 25}}>{dataSeguro.corretora.razao_social}</Text>
                      </>
                    ) : (
                      <>
                        <Skeleton startColor='gray.100' endColor='gray.300' style={{width: 170, height: 23, marginBottom: 5}} />
                        <Skeleton startColor='gray.100' endColor='gray.300' style={{width: 300, height: 27}} />
                      </>
                    )}
                  </>
                )}
              </View>
              {dataSeguro?.valores && (
                <View style={{
                  marginBottom: loading ? 20 : 0
                }}>
                  {loading ? (
                    <>
                      <Text style={{fontWeight: 'bold', fontSize: 20}}>FRANQUIA:</Text>
                      <Text style={{fontWeight: '900', fontSize: 25, color: '#555'}}>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(dataSeguro.valores.franquia)}</Text>
                    </>
                  ) : (
                    <>
                      <Skeleton startColor='gray.100' endColor='gray.300' style={{width: 195, height: 23, marginBottom: 5}} />
                      <Skeleton startColor='gray.100' endColor='gray.300' style={{width: 150, height: 27}} />
                    </>
                  )}
                </View>
              )}
              <View style={{
                marginBottom: 20
              }}>
                {loading ? (
                  <>
                    <Text style={{fontWeight: 'bold', fontSize: 20, marginBottom: 10}}>ASSISTÊNCIA 24 HORAS:</Text>
                    {dataSeguro.seguradora.contatos?.map((itemContato, indexContato) => (
                      <View key={indexContato} style={{
                        marginBottom: 25
                      }}>
                        <Text style={{fontSize: 15, fontWeight: 'bold', marginBottom: 5}}>{itemContato.setor}</Text>
                        {itemContato.telefones.map((itemTelefone, indexTelefone) => (
                          <View key={indexTelefone}>
                            {itemTelefone.telefone ? (
                              <TouchableOpacity key={indexTelefone}
                                onPress={() => {
                                  const [isWhats] = String(itemContato.setor).split(' ');
                                  const tel = String(itemTelefone.telefone).split('+55').join('').split(' ').join('').split('(').join('').split(')').join('').split('-').join('');


                                  if(String(isWhats).toLowerCase() === 'whatsapp') {
                                    Linking.openURL(`https://api.whatsapp.com/send?phone=+55${tel}`);

                                    return;
                                  }
                                  Linking.openURL(`tel:${tel}`)
                                }}
                              >
                                <Text style={{fontSize: 20, fontWeight: 'bold', marginBottom: 3}}>{itemTelefone.telefone}</Text>
                                <Text style={{marginBottom: 10}}>({itemTelefone.locais})</Text>
                              </TouchableOpacity>
                            ) : null}
                          </View>
                        ))}
                      </View>
                    ))}
                  </>
                ) : (
                  <>
                    <Skeleton startColor='gray.100' endColor='gray.300' style={{width: 170, height: 23, marginBottom: 5}} />
                    <Skeleton startColor='gray.100' endColor='gray.300' style={{width: 300, height: 300}} />
                  </>
                )}
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    )
  }

  return (
    <>
      <StatusBar style='light' />
      <Header title={`${item.veiculo.veiculo}`} navigation={navigation} />
      <Body />
    </>
  )
}

export default ComoProcederInfoContent;