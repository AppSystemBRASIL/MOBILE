import React, { useEffect } from 'react';
import { Text, View, StatusBar, Image } from 'react-native';
import { COLORS, SIZES } from '../../utils/constants';

import { themeDefault } from '../../config';

const SplashScreen = ({ setLoading, corretora }) => {
  const { width } = SIZES;

  useEffect(() => {
    setTimeout(() => {
      setLoading(true);
    }, 5000);
  });

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <StatusBar hidden />
      <Image style={{ resizeMode: 'stretch', width: 150, height: 150 }} width={150} height={150} source={{ uri: corretora ? corretora.icon : 'https://www.statusseguros.com/wp-content/uploads/2018/05/Untitled-35.png', cache: 'only-if-cached' }} />
      <View>
        <Text
          style={{
            marginTop: 10,
            fontSize: width < 380 ? 25 : 40,
            color: COLORS(corretora ? corretora.layout.theme : themeDefault).secundary,
            fontWeight: '900',
            textAlign: 'center'
          }}
        >
          {!corretora ? 'APPSYSTEM' : corretora.razao_social}
        </Text>
      </View>
    </View>
  )
}

export default SplashScreen;