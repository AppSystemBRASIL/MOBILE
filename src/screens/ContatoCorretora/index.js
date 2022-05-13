import React, { useState, useContext } from 'react';
import { View, Text, Image, Linking, ScrollView, Share, KeyboardAvoidingView, TouchableOpacity, TextInput, Alert } from 'react-native'

import Feather from 'react-native-vector-icons/Feather';

import firebase from '../../../firebase';

import Header from '../../components/Header';

import IMG_USER from '../../assets/company-placeholder.jpeg';

import { Actionsheet, Button, TextArea } from 'native-base';
import * as WebBrowser from 'expo-web-browser';
import Context from '../../context';
import { uidCorretoraDefault } from '../../config';
import { StatusBar } from 'expo-status-bar';
import { COLORS } from '../../utils/constants';
import compartilharAPP from '../../utils/compartilharAPP';

const ContatoCorretora = ({ route, navigation }) => {
  const item = route.params;

  const { corretor, corretora } = useContext(Context);

  const [dadosCorretora, setDadosCorretora] = useState(item || corretora);

  

  const Body = () => {
    const [viewCallCorretora, setViewCallCorretora] = useState(false);

    const [mensagem, setMensagem] = useState('');
    async function enviarMensagem() {
      if(!mensagem) {
        Alert.alert('INFORME UMA MENSAGEM!');

        return;
      }

      const data = {
        corretora: !corretora ? null : corretora.uid,
        corretor: !corretor ? null : corretor.uid,
        created: new Date(),
        mensagem: mensagem,
        lida: false
      };

      await firebase.firestore().collection('feedback').add(data)
      .then(() => {
        Alert.alert('ENVIADO COM SUCESSO!');
        setMensagem('');
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
        <Actionsheet isOpen={viewCallCorretora} onClose={() => setViewCallCorretora(false)}>
          <Actionsheet.Content height={250}>
            <Actionsheet.Item onPress={() => Linking.openURL(`tel:${String(dadosCorretora.telefone).split('+55').join('').split('(').join('').split(')').join('').split(' ').join('').split('-').join('')}`)} startIcon={<Feather color='#222' name='phone' size={30} />}>
              <Text style={{fontSize: 20, marginLeft: 10, fontWeight: '600', color: '#222'}}>LIGAÇÃO</Text>
            </Actionsheet.Item>
            <Actionsheet.Item onPress={() => Linking.openURL(`https://api.whatsapp.com/send/?phone=${String(dadosCorretora.telefone).split('+').join('').split('(').join('').split(')').join('').split(' ').join('').split('-').join('')}`)} startIcon={<Feather color='#222' name='message-circle' size={30} />}>
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
              {!item && (
                <Feather 
                  style={{
                    position: 'absolute',
                    top: 10,
                    right: 10
                  }}
                  onPress={() => compartilharAPP({ corretora: corretora || null })} name='share' size={30} color='black' 
                />
              )}
              {!corretor && (
                <TouchableOpacity
                  activeOpacity={1}
                  onPress={() => {
                    navigation.navigate('contatoCorretor')
                  }}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    top: 10,
                    left: 10,
                    position: 'absolute'
                  }}
                >
                  <Feather name='user' size={30} color='black' />
                  <Text
                    style={{
                      color: '#333',
                      fontSize: 10,
                      fontWeight: '900'
                    }}
                  >VINCULAR CORRETOR</Text>
                </TouchableOpacity>
              )}
              <Image style={{width: 150, height: 150, marginBottom: 30, alignSelf: 'center', marginTop: 50}} source={dadosCorretora.icon ? { uri: dadosCorretora.icon, cache: 'only-if-cached' } : IMG_USER} />
              <Text style={{lineHeight: 0, fontSize: 22, textAlign: 'center', fontWeight: 'bold'}}>
                {String(dadosCorretora.razao_social).toUpperCase()}
              </Text>
              <Text style={{lineHeight: 0, marginBottom: 40, textAlign: 'center', fontWeight: 'bold', color: 'red'}}>
                CORRETORA  
              </Text>
              <View style={{
                backgroundColor: '#F1F1F1',
                padding: 10,
                borderRadius: 10,
              }}>
                <Text style={{fontWeight: 'bold', marginBottom: 10, textAlign: 'center', fontSize: 20, width: '100%'}}>CONTATO</Text>
                <View style={{width: '100%', borderWidth: .5, borderColor: '#c1c1c1', marginBottom: 20}} />
                <Text style={{fontSize: 15, fontWeight: 'bold'}}>RAZÃO SOCIAL:</Text>
                <Text style={{fontSize: 17, marginBottom: 10, fontWeight: '900'}}>{String(dadosCorretora.razao_social).toUpperCase()}</Text>
                <Text style={{fontSize: 15, fontWeight: 'bold'}}>EMAIL:</Text>
                <Text onPress={() => Linking.openURL(`mailto:${dadosCorretora.email}`)} style={{fontSize: 17, marginBottom: 10, fontWeight: '900'}}>{String(dadosCorretora.email).toUpperCase()}</Text>
                <Text style={{fontSize: 15, fontWeight: 'bold'}}>TELEFONE:</Text>
                <Text onPress={() => setViewCallCorretora(true)} style={{fontSize: 17, marginBottom: 10, fontWeight: '900'}}>{dadosCorretora.telefone} - (HORÁRIO COMERCIAL)</Text>
                {dadosCorretora.site && (
                  <>
                    <Text style={{fontWeight: 'bold'}}>SITE:</Text>
                    <Text onPress={async () => await WebBrowser.openBrowserAsync(`${dadosCorretora.site}`)} style={{fontSize: 17, marginBottom: 20, fontWeight: '900', textTransform: 'uppercase'}}>{String(dadosCorretora.site).split('https://')}</Text>
                  </>
                )}
                <View style={{ marginTop: 25 }}>
                  <Text style={{ fontWeight: 'bold' }}>MENSAGEM:</Text>
                  <TextArea h={100} value={mensagem} onChangeText={(e) => setMensagem(!e ? '' : String(e).toUpperCase())} style={{
                    borderWidth: 1,
                    borderColor: '#999',
                    padding: 0,
                    minHeight: 100,
                    fontSize: 20,
                    textTransform: 'uppercase'
                  }} />
                    <Button style={{
                      marginTop: 10,
                      backgroundColor: COLORS(corretora ? corretora.layout.theme : themeDefault).primary,
                    }} onPress={enviarMensagem}>
                      ENVIAR
                    </Button>
                </View>
              </View>
            </>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    )
  }

  return (
    <>
      <StatusBar style='light' />
      <Header title={item ? item.uid === uidCorretoraDefault ? 'MINHA CORRETORA' : 'CORRETORA' : 'MINHA CORRETORA'} navigation={navigation} />
      <Body />
    </>
  )
}

export default ContatoCorretora;