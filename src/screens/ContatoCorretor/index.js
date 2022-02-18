import React, { useState, useContext } from 'react';
import { View, Text, Image, Linking, ScrollView, Share, TextInput, TouchableOpacity, KeyboardAvoidingView } from 'react-native'
import { COLORS, SIZES } from '../../utils/constants';

import Feather from 'react-native-vector-icons/Feather';

import AsyncStorage from '@react-native-async-storage/async-storage';

import firebase from '../../../firebase';

import Header from '../../components/Header';

import IMG_USER from '../../assets/user.png';

import { Skeleton, useToast, AlertDialog, Button, Actionsheet } from 'native-base';
import * as WebBrowser from 'expo-web-browser';
import Context from '../../context';
import { themeDefault } from '../../config';
import { StatusBar } from 'expo-status-bar';

const ContatoCorretor = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  
  const { corretor, setCorretor, corretoraCorretor, setCorretoraCorretor, corretora } = useContext(Context);

  const toast = useToast();

  const vincularCorretor = async (uid) => {
    if(!uid) {
      if(!toast.isActive(1)) {
        toast.show({
          id: 1,
          title: 'INSIRA O CÓDIGO DO CORRETOR',
          status: 'warning',
          placement: 'top',
          isClosable: false
        });
      }

      return;
    }

    setLoading(false);

    await firebase.firestore().collection('usuarios').doc(uid).get()
    .then(async (response) => {
      if(response.exists) {
        const data = response.data();

        if(!corretora) {
          setCorretor(data);

          await AsyncStorage.setItem('corretorData', JSON.stringify(data));

          await firebase.firestore().collection('corretoras').doc(data.corretora.uid).get()
          .then(async (response1) => {
            const data1 = response1.data();
  
            setCorretoraCorretor(data1);

            await AsyncStorage.setItem('corretoraCorretorData', JSON.stringify(data1));
          })

          toast.show({
            title: 'CORRETOR VINCULADO',
            status: 'success',
            placement: 'top',
            isClosable: false
          });
        }else {
          if(data.corretora.uid === corretora.uid) {
            setCorretor(data);
            setCorretoraCorretor(corretora);
            await AsyncStorage.setItem('corretoraCorretorData', JSON.stringify(corretora));
          }else {
            toast.show({
              title: 'CÓDIGO INVÁLIDO',
              status: 'error',
              placement: 'top',
              isClosable: false
            });
          }
        }
        
      }else {
        if(typeExect === 'vinculed') {
          toast.show({
            title: 'CÓDIGO INVÁLIDO',
            status: 'error',
            placement: 'top',
            isClosable: false
          });
        }
      }
    })
    .finally(() => {
      setLoading(true);
    });
  }


  const Body = () => {
    const[uidCorretorVinculed, setUidCorretorVinculed] = useState(null);
    const [alertDialogDesvinculedCorretor, setAlertDialogDesvinculedCorretor] = useState(false);

    const [viewCallCorretor, setViewCallCorretor] = useState(false);
    const [viewCallCorretora, setViewCallCorretora] = useState(false);

    const desvincularCorretor = async () => {
      await AsyncStorage.removeItem('corretorData');
      toast.show({
        title: 'CORRETOR VINCULADO',
        status: 'info',
        placement: 'top',
        isClosable: false
      });

      setCorretor(null);
      setCorretoraCorretor(null);
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
        <AlertDialog
          isOpen={alertDialogDesvinculedCorretor}
          onClose={() => setAlertDialogDesvinculedCorretor(false)}
        >
          <AlertDialog.Content>
            <AlertDialog.CloseButton />
            <AlertDialog.Header>Deseja realmente desvicular?</AlertDialog.Header>
            <AlertDialog.Body>
              Ao confirmar a opção você será desvinculado com o seu corretor atual.
              {'\n'}
              Para retornar ao mesmo é necessário vincular o mesmo novamente.
            </AlertDialog.Body>
            <AlertDialog.Footer>
              <Button.Group space={2}>
                <Button
                  variant='unstyled'
                  colorScheme='coolGray'
                  onPress={() => setAlertDialogDesvinculedCorretor(false)}
                >
                  CANCELAR
                </Button>
                <Button colorScheme='danger' onPress={async () => {
                  await desvincularCorretor();
                  setAlertDialogDesvinculedCorretor(false)
                }}>
                  DESVINCULAR
                </Button>
              </Button.Group>
            </AlertDialog.Footer>
          </AlertDialog.Content>
        </AlertDialog>
        <Actionsheet isOpen={viewCallCorretor} onClose={() => setViewCallCorretor(false)}>
          <Actionsheet.Content height={250}>
            <Actionsheet.Item onPress={() => Linking.openURL(`tel:${String(corretor.telefone).split('+55').join('').split('(').join('').split(')').join('').split(' ').join('').split('-').join('')}`)} startIcon={<Feather color='#222' name='phone' size={30} />}>
              <Text style={{fontSize: 20, marginLeft: 10, fontWeight: '600', color: '#222'}}>LIGAÇÃO</Text>
            </Actionsheet.Item>
            <Actionsheet.Item onPress={() => Linking.openURL(`https://api.whatsapp.com/send/?phone=${String(corretor.telefone).split('+').join('').split('(').join('').split(')').join('').split(' ').join('').split('-').join('')}`)} startIcon={<Feather color='#222' name='message-circle' size={30} />}>
              <Text style={{fontSize: 20, marginLeft: 10, fontWeight: '600', color: '#222'}}>WHATSAPP</Text>
            </Actionsheet.Item>
          </Actionsheet.Content>
        </Actionsheet>
        <Actionsheet isOpen={viewCallCorretora} onClose={() => setViewCallCorretora(false)}>
          <Actionsheet.Content height={250}>
            <Actionsheet.Item onPress={() => Linking.openURL(`tel:${String(corretoraCorretor.telefone).split('+55').join('').split('(').join('').split(')').join('').split(' ').join('').split('-').join('')}`)} startIcon={<Feather color='#222' name='phone' size={30} />}>
              <Text style={{fontSize: 20, marginLeft: 10, fontWeight: '600', color: '#222'}}>LIGAÇÃO</Text>
            </Actionsheet.Item>
            <Actionsheet.Item onPress={() => Linking.openURL(`https://api.whatsapp.com/send/?phone=${String(corretoraCorretor.telefone).split('+').join('').split('(').join('').split(')').join('').split(' ').join('').split('-').join('')}`)} startIcon={<Feather color='#222' name='message-circle' size={30} />}>
              <Text style={{fontSize: 20, marginLeft: 10, fontWeight: '600', color: '#222'}}>WHATSAPP</Text>
            </Actionsheet.Item>
          </Actionsheet.Content>
        </Actionsheet>
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
              paddingTop: 30,
              paddingBottom: 50
            }}
          >
            <>
              {!loading ? (
                <>
                  <Skeleton startColor='#d1d1d1' style={{width: 200, height: 200, marginBottom: 30, alignSelf: 'center'}} />
                  <Skeleton startColor='#d1d1d1' style={{width: '100%', height: 30, marginBottom: 20}} />
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 50 }}>
                    <Skeleton startColor='#d1d1d1' style={{width: '45%', height: 30}} />
                    <Skeleton startColor='#d1d1d1' style={{width: '45%', height: 30}} />
                  </View>
                  <Skeleton startColor='#d1d1d1' style={{width: '100%', height: 150, marginBottom: 50}} />
                  <Skeleton startColor='#d1d1d1' style={{width: '100%', height: 150}} />
                </>
              ) : !corretor ? (
                <View style={{ alignItems: 'center' }}>
                  <Image style={{ width: 200, height: 200 }} source={IMG_USER} />
                  <Text style={{
                    fontWeight: '700',
                    fontSize: 25,
                    marginTop: 15,
                    color: '#333',
                    textAlign: 'center'
                  }}>VOCÊ AINDA NÃO TEM UM CORRETOR VINCULADO</Text>
                  <View style={{marginTop: 50, width: '100%'}}>
                    <Text style={{color: '#777', textAlign: 'center', fontWeight: '700', fontSize: 17, marginBottom: 10}}>INSERIR CÓDIGO DO CORRETOR</Text>
                    <TextInput keyboardType='default' value={uidCorretorVinculed} onChangeText={(e) => setUidCorretorVinculed(e)} style={{borderWidth: .5, padding: 10, width: '100%', textAlign: 'center', borderColor: '#888', borderRadius: 5, fontWeight: '800', fontSize: 20}} />
                    <TouchableOpacity
                      onPress={() => vincularCorretor(uidCorretorVinculed)}
                      style={{
                        marginTop: 20,
                        backgroundColor: COLORS(corretora ? corretora.layout.theme : themeDefault).primary,
                        padding: 10,
                        paddingVertical: 10,
                        paddingHorizontal: 20,
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
                      >VINCULAR</Text>
                      <Feather style={{
                        position: 'absolute',
                        right: 20,
                        top: '50%'
                      }} name='link' color='white' size={20} />
                    </TouchableOpacity>
                  </View>
                </View>
              ) : (
                <>
                  <Feather 
                    style={{
                      position: 'absolute',
                      top: 10,
                      right: 10,
                    }}
                    onPress={() => {
                      Share.share({
                        message: `APPSYSTEM - GESTÃO DE SEGUROS \n\nIndicação de corretor da plataforma da APPSYSTEM para um ou mais amigos.\n\nEsse é meu CORRETOR: ${corretor.uid}`,
                        title: 'APPSYSTEM - GESTÃO DE SEGUROS',
                        url: 'https://seguro.appsystembrasil.com.br',
                      });
                    }} name='share' size={30} color='black' 
                  />
                  <Feather 
                    style={{
                      position: 'absolute',
                      top: 10,
                      left: 10,
                    }}
                    onPress={() => setAlertDialogDesvinculedCorretor(true)} name='x-octagon' size={30} color='red' 
                  />
                  <Image style={{width: 200, height: 200, marginBottom: 30, alignSelf: 'center'}} source={corretor.photoURL ? { uri: corretor.photoURL, cache: 'only-if-cached' } : IMG_USER} />
                  <Text style={{lineHeight: 0, fontSize: 22, textAlign: 'center', fontWeight: 'bold'}}>
                    {String(corretor.nome || corretor.displayName).toUpperCase()}
                  </Text>
                  <Text style={{lineHeight: 0, marginBottom: 40, textAlign: 'center', fontWeight: 'bold', color: 'red'}}>{String(corretor.typeRoles).toUpperCase()}</Text>
                  <View style={{
                    backgroundColor: '#F1F1F1',
                    padding: 10,
                    borderRadius: 10
                  }}>
                    <Text style={{fontWeight: 'bold', marginBottom: 10, textAlign: 'center', fontSize: 20}}>CONTATO</Text>
                    <View style={{width: '100%', borderWidth: .5, borderColor: '#c1c1c1', marginBottom: 20}} />
                    <Text style={{fontWeight: 'bold'}}>EMAIL:</Text>
                    <Text onPress={() => Linking.openURL(`mailto:${corretor.email}`)} style={{fontSize: 17, marginBottom: 10, fontWeight: '900'}}>JUNIORMELO271101@ICLOUD.COM</Text>
                    <Text style={{fontWeight: 'bold'}}>TELEFONE:</Text>
                    <Text onPress={() => setViewCallCorretor(true)} style={{fontSize: 17, marginBottom: 10, fontWeight: '900'}}>{corretor.telefone}</Text>
                  </View>

                  <View style={{
                    backgroundColor: '#F1F1F1',
                    padding: 10,
                    borderRadius: 10,
                    marginTop: 50
                  }}>
                    <Text style={{fontWeight: 'bold', marginBottom: 10, textAlign: 'center', fontSize: 20, width: '100%'}}>CORRETORA</Text>
                    <Feather style={{ position: 'absolute', right: 15, top: 10 }} size={25} name='external-link' onPress={() => navigation.navigate('contatoCorretora', corretoraCorretor)} />
                    <View style={{width: '100%', borderWidth: .5, borderColor: '#c1c1c1', marginBottom: 20}} />
                    <View
                      style={{
                        position: 'relative'
                      }}
                    >
                      <Text style={{fontWeight: 'bold'}}>RAZÃO SOCIAL:</Text>
                      <Text style={{fontSize: 17, marginBottom: 10, fontWeight: '900'}}>{String(corretoraCorretor.razao_social).toUpperCase()}</Text>
                      <Image source={{ uri: corretoraCorretor.icon }}
                        style={{
                          width: 50,
                          height: 50,
                          position: 'absolute',
                          right: 10,
                          top: -10
                        }}
                      />
                    </View>
                    <Text style={{fontWeight: 'bold'}}>EMAIL:</Text>
                    <Text onPress={() => Linking.openURL(`mailto:${corretoraCorretor.email}`)} style={{fontSize: 17, marginBottom: 10, fontWeight: '900'}}>{String(corretoraCorretor.email).toUpperCase()}</Text>
                    <Text style={{fontWeight: 'bold'}}>TELEFONE:</Text>
                    <Text onPress={() => setViewCallCorretora(true)} style={{fontSize: 17, marginBottom: 10, fontWeight: '900'}}>{corretor.telefone}</Text>
                    {corretoraCorretor.site && (
                      <>
                        <Text style={{fontWeight: 'bold'}}>SITE:</Text>
                        <Text onPress={async () => await WebBrowser.openBrowserAsync(`${corretoraCorretor.site}`)} style={{fontSize: 17, marginBottom: 10, fontWeight: '900', textTransform: 'uppercase'}}>{String(corretoraCorretor.site).split('https://')}</Text>
                      </>
                    )}
                  </View>
                </>
              )}
            </>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    )
  }

  return (
    <>
      <StatusBar style='light' />
      <Header title='MEU CORRETOR' navigation={navigation} />
      <Body />
    </>
  )
}

export default ContatoCorretor;