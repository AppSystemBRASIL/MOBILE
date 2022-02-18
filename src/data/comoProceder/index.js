import React from 'react';
import { Text } from 'react-native';

const data = [
  {
    key: 1,
    title: 'COLISÃO SEM VÍTIMA E O VEÍCULO FUNCIONA',
    content: [
      <Text style={{fontSize: 18}}>
        <Text style={{textTransform: 'uppercase', textDecorationLine: 'underline', fontWeight: 'bold'}}>RETIRE OS VEÍCULOS DA VIA</Text>. Bloquear a passagem é uma contravenção média passível de multa (Artigo 178).
        {'\n\n'}
        Não há necessidade de chamar a fiscalização de trânsito, <Text style={{textDecorationLine: 'underline', fontWeight: 'bold'}}>podendo ser resolvido entre as partes envolvidas</Text>.
        {'\n\n'}
        Coletar o endereço do local da colisão, hora, os dados dos carros (PLACAS E MODELOS) e dos motoristas envolvidos no acidente (NOME, TELEFONE E RG). Além do registro por meio de fotos.
        {'\n\n'}
        Em seguida, comunique o <Text style={{fontWeight: 'bold', textDecorationLine: 'underline', textTransform: 'uppercase'}}>SINISTRO</Text> da sua seguradora em <Text style={{fontWeight: 'bold', textDecorationLine: 'underline'}}>(Horário comercial)</Text>.
        {'\n\n'}
        O registro do <Text style={{textDecorationLine: 'underline', textTransform: 'uppercase', fontWeight: 'bold'}}>BOLETIM DE OCORRÊNCIA</Text> pode ser feito pela internet, delegacia online do seu estado.
        {'\n\n'}
        O documento será a versão oficial do acidente e das ações tomadas pelos envolvidos, podendo proteger o condutor de eventuais problemas futuros.
      </Text>
    ]
  },
  {
    key: 2,
    title: 'COLISÃO SEM VÍTIMA E O VEÍCULO NÃO FUNCIONA',
    content: [
      <Text style={{fontSize: 18}}>
        Não havendo a possibilidade de retirar os veículos, sinalize a área, com o <Text style={{textTransform: 'uppercase', fontWeight: 'bold', textDecorationLine: 'underline'}}>TRIÂNGULO LUMINOSO</Text> para que a situação não piore ainda mais e outros veículos se envolvam no acidente.
        {'\n\n'}
        Não há necessidade de chamar a fiscalização de trânsito, <Text style={{fontWeight: 'bold', textDecorationLine: 'underline'}}>podendo ser resolvido entre as partes envolvidas</Text>.
        {'\n\n'}
        Coletar o endereço do local da colisão, hora, os dados dos veículos (PLACAS E MODELOS) e dos motoristas envolvidos (NOME, TELEFONE E RG). Além do registro por meio de fotos.
        {'\n\n'}
        Solicite um <Text style={{textDecorationLine: 'underline', fontWeight: 'bold', textTransform: 'uppercase'}}>REBOQUE</Text> na assistência 24 horas de sua seguradora.
        {'\n\n'}
        Se necessário, solicite um transporte para retorno.
        {'\n\n'}
        Benefícios como carro reserva, cobertura de vidros, informações sobre o reparo ou indicação de oficinas são tratados somente junto a sua seguradora.
        {'\n\n'}
        O registro do <Text style={{textDecorationLine: 'underline', textTransform: 'uppercase', fontWeight: 'bold'}}>BOLETIM DE OCORRÊNCIA</Text> pode ser feito pela internet, delegacia online do seu estado.
        {'\n\n'}
        O documento será a versão oficial do acidente e das ações tomadas pelos envolvidos, podendo proteger o condutor de eventuais problemas futuros.
      </Text>
    ]
  },
  {
    key: 3,
    title: 'COLISÃO COM VÍTIMA',
    content: [
      <Text style={{fontSize: 18}}>
        Mantenha a calma, <Text style={{fontWeight: 'bold', textTransform: 'uppercase', textDecorationLine: 'underline'}}>SINALISE COM O PISCA ALERTA</Text> e verifique as vítimas!
        {'\n'}
        É importante sinalizar a área, com o <Text style={{textTransform: 'uppercase', textDecorationLine: 'underline', fontWeight: 'bold'}}>TRIÂNGULO LUMINOSO</Text> para que a situação não piore ainda mais e outros veículos se envolvam no acidente.
        {'\n\n'}
        Não retire os veículos nem as vítimas do local.
        {'\n\n'}
        Em acidente de trânsito, independentemente da gravidade, peça ajuda e acione imediatamente o serviço de emergência <Text style={{textTransform: 'uppercase', textDecorationLine: 'underline', fontWeight: 'bold'}}>SAMU 192 E A POLÍCIA 190</Text>.
        {'\n\n'}
        O registro do BOLETIM DE OCORRÊNCIA (B.O) para acidentes de trânsito com vítimas é realizado pelo agente de I.C. (Instituto Criminalista) no local.
        {'\n\n'}
        O documento será a versão oficial do acidente e das ações tomadas pelos envolvidos, podendo proteger o condutor de eventuais problemas futuros e para dar entrada no seguro DPVAT.
        {'\n\n'}
        Vale lembrar que fugit do local sem prestar socorro às vítimas é crime e infração de trânsito grávissima. As consequências são várias: inquérito e processo penal, cassação da CNH e multa.
      </Text>
    ]
  },
  {
    key: 4,
    title: 'ROUBO E FURTO',
    content: [
      <Text style={{fontSize: 18}}>
        <Text style={{textAlign: 'center', textDecorationLine: 'underline'}}>SOLICITE TAMBÉM UM TÁXI PARA SUA RETIRADA DO LOCAL</Text>
        {'\n\n'}
        Entre em contato com o <Text style={{textDecorationLine: 'underline', fontWeight: 'bold'}}>190</Text> e <Text style={{fontWeight: 'bold', textDecorationLine: 'underline'}}>siga para uma delegacia física</Text>, para, assim, registrar o BOLETIM DE OCORRÊNCIA (B.O) e emitir um alerta de roubo ou furto.
        {'\n\n'}
        Esta ação deve ser feita em, no máximo, 24 horas.
      </Text>
    ]
  },
  {
    key: 5,
    title: 'CONTATOS ÚTEIS',
    href: 'contatosUteis'
  },
]

export default data;