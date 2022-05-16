import { useEffect } from 'react';

import { Button } from 'native-base';
import { View, Text } from 'react-native';

import useAuth from '../../hooks/useAuth';

import { COLORS } from '../../utils/constants';

import seguros from '../../data/seguros';

export default function Description({ type, setView }) {
  const { corretora } = useAuth();
  const colorPrimary = COLORS(corretora ? corretora.layout.theme : themeDefault).primary;

  const data = seguros.filter(e => e.tipo === type)[0]?.info || null;

  useEffect(() => {
    if(!data) {
      setView(true);
    }
  }, [data]);
  
  return (
    <View
      style={{ flex: 1, padding: 10, paddingBottom: 100 }}
    >
      <View style={{
        backgroundColor: '#FFFFFF',
        borderRadius: 5,
        padding: 15
      }}>
        {data}
        <Button background={colorPrimary} style={{
          marginTop: 30
        }} onPress={() => setView(true)}>
          <Text
            style={{
              color: '#FFFFFF',
              fontWeight: 'bold',
              fontSize: 20
            }}
          >SOLICITAR COTAÇÃO</Text>
        </Button>
      </View>
    </View>
  )
}