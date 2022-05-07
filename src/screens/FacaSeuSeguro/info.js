import { useContext } from 'react';
import { Text, View } from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome5';
import Context from '../../context';
import { COLORS } from '../../utils/constants';

import roles_security from '../../utils/roles_security';

export default function InfoSeguro({ type }) {
  const { corretora } = useContext(Context);

  const icon = roles_security.filter(e => e.tipo === type)[0].icon;
  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
      }}
    >
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          backgroundColor: COLORS(corretora ? corretora.layout.theme : themeDefault).primary,
          borderRadius: 100,
          padding: 20
        }}
      >
        <Icon solid name={icon} size={50} color='#FFFFFF' />
      </View>
      <Text>{type}</Text>
    </View>
  )
}