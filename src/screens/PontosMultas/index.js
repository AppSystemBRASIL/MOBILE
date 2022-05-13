import React, { useContext, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';

import { openBrowserAsync } from 'expo-web-browser';

import Feather from 'react-native-vector-icons/Feather';

import Header from '../../components/Header';

import { StatusBar } from 'expo-status-bar';

const dataList = [
  {
    text: 'ACRE (AC)',
    href: 'https://www.detran.ac.gov.br'
  },
  {
    text: 'ALAGOAS (AL)',
    href: 'http://consulta.der.al.gov.br'
  },
  {
    text: 'AMAPÁ (AP)',
    href: 'https://www.detran.ap.gov.br/detranap/veiculo/consulta-de-veiculos/'
  },
  {
    text: 'AMAZONAS (AM)',
    href: 'https://digital.detran.am.gov.br/?openModalVeiculo=%2Fveiculo%2Fmultas'
  },
  {
    text: 'BAHIA (BA)',
    href: 'https://servicos.detran.ba.gov.br/Pontuacao'
  },
  {
    text: 'CEARÁ (CE)',
    href: 'https://www.detran.ce.gov.br/'
  },
  {
    text: 'DISTRITO FEDERAL (DF)',
    href: 'https://portal.detran.df.gov.br/area-publica/veiculo/debitos'
  },
  {
    text: 'ESPÍRITO SANTO (ES)',
    href: 'https://detran.es.gov.br/infracoes'
  },
  {
    text: 'GOIÁS (GO)',
    href: 'https://www.detran.go.gov.br/psw/#/pages/pagina-inicial'
  },
  {
    text: 'MARANHÃO (MA)',
    href: 'https://portal.detrannet.detran.ma.gov.br/Veiculo/Veiculos.cshtml'
  },
  {
    text: 'MATO GROSSO (MT)',
    href: 'https://www.detran.mt.gov.br/'
  },
  {
    text: 'MATO GROSSO DO SUL (MS)',
    href: 'https://www3.detran.ms.gov.br/detranwebapp/index.php'
  },
  {
    text: 'MINAS GERAIS (MG)',
    href: 'https://www.detran.mg.gov.br/veiculos/situacao-do-veiculo/consultar-situacao-do-veiculo'
  },
  {
    text: 'PARÁ (PA)',
    href: 'https://www.detran.pa.gov.br/sistransito/detran-web/servicos/veiculos/indexRenavam.jsf'
  },
  {
    text: 'PARAÍBA (PB)',
    href: 'https://detran.pb.gov.br/formularios/consultar-veiculos'
  },
  {
    text: 'PARANÁ (PR)',
    href: 'https://www.detran.pr.gov.br/servicos/consultar-a-pontuacao-da-cnh'
  },
  {
    text: 'PERNAMBUCO (PE)',
    href: 'https://www.detran.pe.gov.br'
  },
  {
    text: 'PIAUÍ (PI)',
    href: 'http://taxas.detran.pi.gov.br/multa/index.jsf'
  },
  {
    text: 'RIO DE JANEIRO (RJ)',
    href: 'http://multas.detran.rj.gov.br/gaideweb2/consultaPontuacao'
  },
  {
    text: 'RIO GRANDE DO NORTE (RN)',
    href: 'https://www2.detran.rn.gov.br/externo/consultarpessoa.asp'
  },
  {
    text: 'RIO GRANDE DO SUL (RS)',
    href: 'https://www.portaldetransito.rs.gov.br/dtw2/app/servico/hab/consulta-pontuacao-form.xhtml   '
  },
  {
    text: 'RONDÔNIA (RO)',
    href: 'https://consulta.detran.ro.gov.br/CentralDeConsultasInternet/Software/ViewConsultaVeiculos.aspx'
  },
  {
    text: 'RORAIMA (RR)',
    href: 'https://www.detran.rr.gov.br/'
  },
  {
    text: 'SANTA CATARINA (SC)',
    href: 'https://www.detran.sc.gov.br/informacoes/veiculos'
  },
  {
    text: 'SÃO PAULO (SP)',
    href: 'https://www.detran.sp.gov.br/wps/portal/portaldetran/cidadao/home/!ut/p/z1/jc3LCsIwFATQb_ELMnkgyTLWNn0YQlu0bTaSlQS0uhC_XynFncHZDZx7h3gyEj-HV7yEZ7zP4frpk9-e6xZZWUp2cJ1RaKV1hvUMsJwMC8CPaBD_z30C-PT7gfiFcIFe7aiGzE8FtOx4QXPH0GAF3wlD9xm0EsJWdcOh-AoSI4_bcUSsNm86XtZa/dz/d5/L2dBISEvZ0FBIS9nQSEh/#'
  },
  {
    text: 'SERGIPE (SE)',
    href: 'https://www.detran.se.gov.br/portal/?pg=cons_multa'
  },
  {
    text: 'TOCANTINS (TO)',
    href: 'https://www.to.gov.br/detran/veiculos'
  },
];

const PontosMultas = ({ navigation }) => {
  const Body = () => {
    const renderItem = ({ item, index }) => {
      return (
        <View style={{ paddingBottom: Number(index) === (dataList.length - 1) ? 100 : 0 }}>
          <TouchableOpacity
            onPress={async () => await openBrowserAsync(item.href)}
            activeOpacity={1} 
            style={{
              backgroundColor: 'white',
              flexDirection: 'row',
              alignItems: 'center',
              borderRadius: 15,
              flex: 1,
              margin: 1,
              height: 70,
              margin: 5,
              padding: 5,
              marginBottom: (item.key === dataList.length) ? 100 : 0,
              paddingHorizontal: 20,
            }}
          >
            <View
              style={{
                backgroundColor: '#f1f1f9',
                padding: 5, 
                borderRadius: 100,
                marginRight: 20,
              }}
            >
              <Feather size={40} color='#444' name='globe' />
            </View>
            <View>
              <Text style={{
                color: '#444',
                fontSize: String(item.text).length > 25 ? 17 : 20,
                fontWeight: '800',
              }}>
                {item.text}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      )
    }

    return (
      <View style={{
        flex: 1,
      }}>
        <FlatList
          style={{
            paddingTop: 20,
          }}
          showsVerticalScrollIndicator={false}
          data={dataList}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
    )
  }

  return (
    <>
      <StatusBar style='light' />
      <Header title='PONTOS E MULTAS' navigation={navigation} />
      <Body />
    </>
  )
}

export default PontosMultas;