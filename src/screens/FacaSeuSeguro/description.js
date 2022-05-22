import { useEffect, useState } from 'react';

import { Button } from 'native-base';
import { View, Text } from 'react-native';

import useAuth from '../../hooks/useAuth';

import { COLORS } from '../../utils/constants';

import seguros from '../../data/seguros';

export default function Description({ type, setView, setPage, show, setShow }) {
  const { corretora } = useAuth();
  const colorPrimary = COLORS(corretora ? corretora.layout.theme : themeDefault).primary;

  const data = seguros.filter(e => e.tipo === type)[0]?.info || null;
  const dataIndex = seguros.filter(e => e.tipo === type)[0]?.infos || null;

  const [indexView, setIndexView] = useState(null);

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
        padding: 15,
      }}>
        {!show && (
          <Button background={colorPrimary} style={{
            alignContent: 'center',
            alignItems: 'center',
            justifyContent: 'center',
          }} onPress={() => {
            setPage(1);
            setView(true)
          }}>
            <Text
              style={{
                color: '#FFFFFF',
                fontWeight: 'bold',
                fontSize: 20,
                textAlign: 'center'
              }}
            >FAZER COTAÇÃO</Text>
          </Button>
        )}
        {!show ? typeof data === 'boolean' ? (
          <>
            <Text style={{
              fontWeight: 'bold',
              marginTop: 20,
              fontSize: 20,
            }}>
              INFORMAÇÕES:
            </Text>
            {dataIndex?.map((item, index) => (
              <Button key={index} background={colorPrimary} style={{
                marginTop: 30,
                alignContent: 'center',
                alignItems: 'center',
                justifyContent: 'center',
              }} onPress={() => !show ? [setIndexView(index), setShow(true)] : setView(true)}>
                <Text
                  style={{
                    color: '#FFFFFF',
                    fontWeight: 'bold',
                    fontSize: 20,
                    textAlign: 'center'
                  }}
                >{item?.title?.toUpperCase()}</Text>
              </Button>
            ))}
          </>
        ) : (
          <Button background={colorPrimary} style={{
            marginTop: 30,
            alignContent: 'center',
            alignItems: 'center',
            justifyContent: 'center',
          }} onPress={() => !show ? setShow(true) : setView(true)}>
            <Text
              style={{
                color: '#FFFFFF',
                fontWeight: 'bold',
                fontSize: 20,
                textAlign: 'center'
              }}
            >INFORMAÇÕES</Text>
          </Button>
        ) : (
          <View>
            {typeof data === 'boolean' ? dataIndex[indexView].content : data}
            <Button background={colorPrimary} style={{
              alignContent: 'center',
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: 20
            }} onPress={() => {
              setPage(1);
              setView(true);
            }}>
              <Text
                style={{
                  color: '#FFFFFF',
                  fontWeight: 'bold',
                  fontSize: 20,
                  textAlign: 'center'
                }}
              >FAZER COTAÇÃO</Text>
            </Button>
          </View>
        )}
      </View>
    </View>
  )
}