import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native'

import Header from '../../components/Header';

import { StatusBar } from 'expo-status-bar';

import * as WebBrowser from 'expo-web-browser';

const MeusBeneficios = ({ navigation }) => {
  const Body = () => {
    return (
      <ScrollView showsVerticalScrollIndicator={false} style={{
        flex: 1,
      }}>
        <View
          style={{
            borderRadius: 15,
            margin: 5,
            marginBottom: 100,
            paddingHorizontal: 0,
            paddingTop: 20,
            paddingBottom: 50,
          }}
        >
          <View
            style={{
              backgroundColor: 'white',
              paddingTop: 20,
              paddingBottom: 20,
              paddingHorizontal: 10,
              borderRadius: 10,
            }}
          >
            <Text style={{
              color: '#444',
              fontSize: 18,
              fontWeight: '600',
              textAlign: 'center',
              marginBottom: 10,
              textDecorationLine: 'underline'
            }}>
              OS DIREITOS E DEVERES DAS PARTES DO CONTRATO DE SEGURO ESTÃO PREVISTOS NAS CONDIÇÕES GERAIS DO SEGURO DE CADA SEGURADORA
            </Text>
            <Text style={{
              color: '#444',
              fontSize: 18,
              fontWeight: '400',
              textAlign: 'justify',
              marginBottom: 10,
              marginTop: 20,
            }}>
              As informações fornecidas no questionário de avaliação do risco em conjunto com as informações da proposta são essenciais para a fixação do prêmio do seguro.
              {`\n\n`}
              Se em eventual sinistro for verificada alguma divergência entre o risco aceito e o constatado, o segurado perderá o direito à garantia, além de ficar obrigado ao prêmio vencido, conforme artigos 765 e 766 do Código Civil Brasileiro.
            </Text>
            <Text style={{
              color: '#444',
              fontSize: 18,
              fontWeight: '600',
              textAlign: 'center',
              marginBottom: 10,
              marginTop: 20,
              textDecorationLine: 'underline'
            }}>
              EM CASO DE DÚVIDA ENTRE EM CONTATO SEU CORRETOR
            </Text>
            <Text style={{
              color: '#444',
              fontSize: 18,
              fontWeight: '400',
              textAlign: 'justify',
              marginBottom: 10,
              marginTop: 20,
            }}>
              A definição do PRINCIPAL CONDUTOR DO VEÍCULO SEGURADO é fundamental para que o valor a ser pago pelo consumidor possa ser claramente calculado.
              {`\n\n`}
              O Principal condutor é a pessoa que utiliza o veículo a maior parte do tempo (mínimo 6 dias da semana).
              {`\n\n`}
              Outras pessoas maiores de 25 anos podem, em situações eventuais, também utilizá-lo por no máximo 1 dia por semana.
              {`\n\n`}Para condutores menores que 25 anos, que dirigem no máximo 1 dia por semana, necessitam de uma cobertura especial.
              {`\n`}{`\n`}
              OBS: ALGUMAS SEGURADORAS PERMITEM 02 DIAS POR semana
              {`\n`}{`\n`}
              Se várias pessoas utilizarem o veículo mais de um dia por semana, o segurado deverá contratrar como principal condutor, a pessoa mais jovem.
              {`\n`}{`\n`}
              O CEP de pernoite é o CEP do local onde o veículo permanece durante a noite. Se o veículo pernoitar em vários locais, definir o CEP onde o veículo passa a maior parte do tempo.
              {`\n`}{`\n`}
              ATENÇÃO: É obrigatório o preenchimento correto das informações pessoais cuja veracidade é de inteira responsabilidade do segurado.
              {`\n\n`}
              As informações inverídicas ou desatualizadas poderão acarretar a perda de direito do segurado ou cancelamento do seguro sem prévia comunicação ao segurado.
              {`\n`}{`\n`}
              Leia a proposta do seguro, havendo divergência nas informações do risco o segurado deverá informar tal situação imediatamente ao seu corretor/seguradora.
              {`\n`}{`\n`}
              Quando no decorrer da vigência da apólice ocorrer qualquer alteração das informações de risco (alteração do condutor, utilização do veículo, mudança de CEP, entre outros), é obrigatório ao segurado comunicar e solicitar a alteração ao corretor/seguradora, sob a pena de perda de seus direitos.
              {`\n`}{`\n`}
              A aceitação da proposta de seguro está sujeita a análise do risco.
              {`\n`}{`\n`}
              A proposta poderá ser recusada pela seguradora em até 15 dias contados a partir da data do seu recebimento.
              {`\n\n`}
              A eventual recusa e os motivos desta, serão informados ao segurado/corretor por meio de e-mail, enviado ao endereço eletrônico constante na proposta.
              {`\n`}{`\n`}
              Se tiver ocorrido pagamento de prêmio, os valores serão devolvidos integralmente no prazo máximo de 10(dez) dias corridos.
              {`\n`}{`\n`}
              Decorrido o prazo de 15(quinze) dias da recepção da proposta sem que haja manifestação da seguradora, fica caracterizada a aceitação do risco.
              {`\n`}{`\n`}
              Os seguros terão início e término de vigência as 24(vinte e quatro) horas das datas indicadas no campo 'VIGÊNCIA' de cada proposta.
              {`\n`}{`\n`}
              O segurado poderá consultar a situação cadastral do corretor de seguros e da sociedade seguradora no site: <TouchableOpacity onPress={async () => await WebBrowser.openBrowserAsync('https://susep.gov.br')}><Text style={{ textTransform: 'uppercase', textDecorationLine: 'underline' }}>www.susep.gov.br</Text></TouchableOpacity>
            </Text>
          </View>
        </View>
      </ScrollView>
    )
  }

  return (
    <>
      <StatusBar style='light' />
      <Header navigation={navigation} title={'LEITURA OBRIGATÓRIA'} />
      <Body />
    </>
  )
}

export default MeusBeneficios;