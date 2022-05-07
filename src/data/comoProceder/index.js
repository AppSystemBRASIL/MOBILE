import React from 'react';
import { Text } from 'react-native';

const data = [
  {
    key: 1,
    title: 'COLISÃO SEM VÍTIMA E O VEÍCULO FUNCIONA',
    content: [
      <Text style={{fontSize: 18}}>
        <Text style={{textTransform: 'uppercase', textDecorationLine: 'underline', fontWeight: 'bold'}}>RETIRE OS VEÍCULOS DA VIA</Text>. Bloquear a passagem é uma contravenção média passível de multa (Artigo 178).
        {`\n\n`}
        Não há necessidade de chamar a fiscalização de trânsito, <Text style={{textDecorationLine: 'underline', fontWeight: 'bold'}}>podendo ser resolvido entre as partes envolvidas</Text>.
        {`\n\n`}
        <Text style={{textTransform: 'uppercase', textDecorationLine: 'underline', fontWeight: 'bold'}}>COLETAR:</Text>
        {`\n`}
          - Hora e endereço do local da colisão;
          {`\n`}
          - Placa e modelo dos veículos envolvidos;
          {`\n`}
          - Se possível foto da CNH dos condutores;
          {`\n`}
          - Além de registro por meio de fotos;
        {`\n\n`}
        Em seguida, comunique o <Text style={{fontWeight: 'bold', textDecorationLine: 'underline', textTransform: 'uppercase'}}>SINISTRO</Text> a sua seguradora em <Text style={{fontWeight: 'bold', textDecorationLine: 'underline'}}>horário comercial</Text>.
        {`\n\n`}
        O registro do <Text style={{textDecorationLine: 'underline', textTransform: 'uppercase', fontWeight: 'bold'}}>BOLETIM DE OCORRÊNCIA</Text> pode ser feito pela internet, delegacia online do seu estado.
        {`\n\n`}
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
        {`\n\n`}
        Não há necessidade de chamar a fiscalização de trânsito, <Text style={{fontWeight: 'bold', textDecorationLine: 'underline'}}>podendo ser resolvido entre as partes envolvidas</Text>.
        {`\n\n`}
        <Text style={{textTransform: 'uppercase', textDecorationLine: 'underline', fontWeight: 'bold'}}>COLETAR:</Text>
        {`\n`}
          - Hora e endereço do local da colisão;
          {`\n`}
          - Placa e modelo dos veículos envolvidos;
          {`\n`}
          - Se possível foto da CNH dos condutores;
          {`\n`}
          - Além de registro por meio de fotos;
        {`\n\n`}
        Solicite um <Text style={{textDecorationLine: 'underline', fontWeight: 'bold', textTransform: 'uppercase'}}>REBOQUE</Text> na assistência 24 horas de sua seguradora.
        {`\n\n`}
        Se necessário, solicite um transporte para retorno.
        {`\n\n`}
        Em seguida, comunique o <Text style={{fontWeight: 'bold', textDecorationLine: 'underline', textTransform: 'uppercase'}}>SINISTRO</Text> a sua seguradora em <Text style={{fontWeight: 'bold', textDecorationLine: 'underline'}}>horário comercial</Text>.
        {`\n\n`}
        Benefícios como carro reserva, cobertura de vidros, informações sobre o reparo ou indicação de oficinas são tratados somente junto a sua seguradora.
        {`\n\n`}
        O registro do <Text style={{textDecorationLine: 'underline', textTransform: 'uppercase', fontWeight: 'bold'}}>BOLETIM DE OCORRÊNCIA</Text> pode ser feito pela internet, delegacia online do seu estado.
        {`\n\n`}
        O documento será a versão oficial do acidente e das ações tomadas pelos envolvidos, podendo proteger o condutor de eventuais problemas futuros.
      </Text>
    ]
  },
  {
    key: 3,
    title: 'COLISÃO COM VÍTIMA',
    content: [
      <Text style={{fontSize: 18}}>
        Mantenha a calma, <Text style={{fontWeight: 'bold', textTransform: 'uppercase', textDecorationLine: 'underline'}}>SINALIZE COM O PISCA ALERTA</Text>!
        {`\n\n`}
        É importante sinalizar a área, com o <Text style={{textTransform: 'uppercase', textDecorationLine: 'underline', fontWeight: 'bold'}}>TRIÂNGULO LUMINOSO</Text> para que a situação não piore ainda mais e outros veículos se envolvam no acidente.
        {`\n\n`}
        Não retire os veículos nem as vítimas do local.
        {`\n\n`}
        Em acidente de trânsito, independentemente da gravidade, peça ajuda e acione imediatamente o serviço de emergência <Text style={{textTransform: 'uppercase', textDecorationLine: 'underline', fontWeight: 'bold'}}>SAMU 192</Text>.
        {`\n\n`}
        Para o REGISTRO DA OCORRÊNCIA no local do acidente, deve ser chamado:
        {`\n`}
        {`\n`}
          <Text style={{ fontWeight: 'bold', textTransform: 'uppercase' }}>- Em rodovias urbanas:</Text>{`\n`}Autarquia de trânsito da cidade;
          {`\n`}
          {`\n`}
          <Text style={{ fontWeight: 'bold', textTransform: 'uppercase' }}>- Em rodovias estaduais - PE:</Text> {`\n`}Polícia rodoviária estadual (198);
          {`\n`}
          {`\n`}
          <Text style={{ fontWeight: 'bold', textTransform: 'uppercase' }}>- Em rodovias federais - BR:</Text> {`\n`}Polícia rodoviária federal (191);
        {`\n\n`}
        O documento será a versão oficial do acidente e das ações tomadas pelos envolvidos, podendo proteger o condutor de eventuais problemas futuros e para dar entrada no seguro DPVAT.
        {`\n\n`}
        Vale lembrar que fugir do local sem prestar socorro às vítimas é crime e infração de trânsito grávissima. As consequências são várias: inquérito e processo penal, cassação da CNH e multa.
        {`\n\n`}
        Após os procedimentos acima concluídos, solicite um <Text style={{textDecorationLine: 'underline', fontWeight: 'bold', textTransform: 'uppercase'}}>REBOQUE</Text> na assistência 24 horas da sua seguradora.
        {`\n\n`}
        Em seguida, comunique o <Text style={{fontWeight: 'bold', textDecorationLine: 'underline', textTransform: 'uppercase'}}>SINISTRO</Text> a sua seguradora em <Text style={{fontWeight: 'bold', textDecorationLine: 'underline'}}>horário comercial</Text>.
      </Text>
    ]
  },
  {
    key: 4,
    title: 'ROUBO E FURTO',
    content: [
      <Text style={{fontSize: 18}}>
        Entre em contato com a polícia militar através do número <Text style={{textDecorationLine: 'underline', fontWeight: 'bold'}}>190</Text> e comunique o crime. 
        {`\n\n`}
        Ligue para a assistência 24horas da sua seguradora para solicitar um taxi para seu retorno.
        {`\n\n`}
        Siga para delegacia física, para o registro do BOLETIM DE OCORRÊNCIA (B.O).
        {`\n\n`}
        Nesta ocasião, lembre-se de solicitar a inclusão na BIN do alerta de roubo ou furto do veículo.
        {`\n\n`}
        Esta ação deve ser feita em, no máximo, 24 horas.
        {`\n\n`}
        Em seguida, comunique o <Text style={{fontWeight: 'bold', textDecorationLine: 'underline', textTransform: 'uppercase'}}>SINISTRO</Text> a sua seguradora em <Text style={{fontWeight: 'bold', textDecorationLine: 'underline'}}>horário comercial</Text>.
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