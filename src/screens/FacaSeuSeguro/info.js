import { useRef, useState } from 'react';

import { View, Text } from 'react-native';

import { AlertDialog, Button, Heading, Icon, Spinner } from 'native-base';

import Formulario from './Formulario';

import { FontAwesome5 } from '@expo/vector-icons';

export default function InfoSeguro({ type, navigation, topPage }) {
  const [isOpen, setIsOpen] = useState(false);
  const [typeFunction, setTypeFunction] = useState('loading');

  const cancelRef = useRef(null);

  function loading() {
    setTypeFunction('loading');
    setIsOpen(true);
  }

  function success() {
    setTypeFunction('success');

    setTimeout(() => {
      navigation.navigate('home');
    }, 5000);
  }
  
  function error() {
    setTypeFunction('error');

    setTimeout(() => {
      setIsOpen(false);
    }, 5000);
  }
  
  return (
    <View
      style={{
        flex: 1
      }}
    >
      <AlertDialog leastDestructiveRef={cancelRef} isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <AlertDialog.Content>
          {typeFunction !== 'loading' && (
            <AlertDialog.Header>
              <Text style={{ color: typeFunction === 'success' ? 'green' : typeFunction === 'loading' ? '' : 'red', fontWeight: 'bold', fontSize: 20, textAlign: 'center' }}>{typeFunction === 'success' ? 'ENVIADA COM SUCESSO!' : 'ERROR AO ENVIAR COTAÇÃO'}</Text>
            </AlertDialog.Header>
          )}
          <AlertDialog.Body>
            {typeFunction !== 'error' && (
              <>
                {typeFunction === 'loading' ? (
                  <>
                    <Spinner color='black' size='lg' />
                    <Heading textAlign='center' alignSelf='center' color="black" fontSize="lg" marginTop={5}>
                      AGUARDE...
                    </Heading>
                  </>
                ) : (
                  <Icon alignSelf='center' as={FontAwesome5} marginBottom={30} name='check-circle' size={20} style={{ color: 'green' }} />
                )}
              </>
            )}
            {typeFunction !== 'loading' && (
              <Text style={{ fontSize: 18, fontWeight: '500', textAlign: 'center', marginBottom: 15 }}>
                {typeFunction === 'success' ? (
                  'Sua cotação foi enviada com sucesso.'
                ) : (
                  'Ocorreu algum error ao enviar sua cotação, tente novamente!'
                )}
              </Text>
            )}
          </AlertDialog.Body>
          {typeFunction === 'error' && (
            <AlertDialog.Footer>
              <Button.Group space={2}>
                <Button colorScheme='red' onPress={() => setIsOpen(false)}>
                  FECHAR
                </Button>
              </Button.Group>
            </AlertDialog.Footer>
          )}
        </AlertDialog.Content>
      </AlertDialog>
      <Formulario type={type} success={success} error={error} loading={loading} topPage={topPage} />
    </View>
  )
}