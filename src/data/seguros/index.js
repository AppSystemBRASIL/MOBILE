import { View, Text } from 'react-native';

import { maskCEP, maskCNPJ, maskCPF, maskCurrency, maskDate, maskLetters, maskPhone, maskPlaca, maskYear } from '../../utils/maskedInput';
import { validateCEP, validatePlaca, validateYear, validateEmail } from '../../utils/validateInput';
import cidades from '../cidades';
import seguradoras from '../seguradoras';

const jsonNome = ({ page, label, name, view }) => ({
  page: page || 1,
  view: view ? (value) => value[view.name] === view.value : undefined,
  name: name,
  label: label,
  placeholder: 'Nome',
  inputType: 'default',
  formatter: maskLetters,
  validated: (value) => !String(value).split(' ')[1],
  required: true,
});

const jsonEmail = ({ page, label, name, view }) => ({
  page: page || 1,
  view: view ? (value) => value[view.name] === view.value : undefined,
  name: name || 'emailSegurado',
  label: label || 'E-mail',
  placeholder: 'E-mail',
  inputType: 'email',
  validated: (value) => !validateEmail(value),
  required: true,
});

const jsonTitle = ({ page, view, name, label, placeholder, formatter, validated, type, infoText }) => ({
  page: page || 1,
  view: view ? (value) => value[view.name] === view.value : undefined,
  name: name,
  label: label,
  placeholder: placeholder || '',
  inputType: type || 'text',
  formatter: (value) => formatter ? formatter(value) : value,
  validated: (value) => validated ? !validated(value) : String(value || '').length <= 0,
  required: true,
  infoText: infoText
});

const jsonCelular = ({ page, name, label }) => ({
  page: page || 1,
  name: name,
  label: label,
  maxLength: 15,
  placeholder: '(00) 00000-0000',
  inputType: 'number-pad',
  formatter: maskPhone,
  validated: (value) => String(value).length < 15,
  required: true,
});

const jsonRegistro = ({ page, name, label, mask, view }) => ({
  page: page || 1,
  view: view ? (value) => value[view.name] === view.value : undefined,
  name: name,
  label: label,
  maxLength: mask === 'cpf' ? 14 : 18,
  placeholder: mask === 'cpf' ? '000.000.000-00' : '00.000.000/0000-00',
  inputType: 'number-pad',
  formatter: (value) => mask === 'cpf' ? maskCPF(value) : maskCNPJ(value),
  validated: (value) => String(value).length < (mask === 'cpf' ? 14 : 18),
  required: true,
});

const jsonCEP = ({ page, name, label }) => ({
  page: page || 1,
  name: name,
  label: label,
  maxLength: 9,
  placeholder: '00000-000',
  inputType: 'number-pad',
  formatter: maskCEP,
  validated: (value) => !validateCEP(value),
  required: true,
});

const jsonMoney = ({ page, view, label, name }) => ({
  page: page || 1,
  view: view ? (value) => value[view.name] === view.value : undefined,
  name: name,
  label: label,
  placeholder: 'R$ 0.000,00',
  inputType: 'number-pad',
  formatter: maskCurrency,
  validated: (value) => Number(String(value || '').split('R$ ').join('').split('.').join('').split(',').join('.')) <= 0 ? true : false || false,
  required: true,
});

const jsonData = ({ page, view, name, label, required }) => ({
  page: page || 1,
  view: !view ? undefined : (value) => {
    if(view) {
      if(typeof view.value === 'number') {
        const numero = Number(String(value[view.name])?.split(' ')[0]) || 0;
        
        if(view.value <= numero) {
          return true;
        }
      }

      if(typeof view.value === 'string') {
        if(value[view.name] === view.value) {
          return true;
        }
      }

      return undefined;
    }else {
      return undefined;
    }
  },
  name: name,
  label: label,
  placeholder: '00/00/0000',
  inputType: 'number-pad',
  maxLength: 10,
  formatter: maskDate,
  validated: (value) => !validateYear(value),
  required: required,
})

const jsonSelect = ({ page, view, name, label, selects: selectsArray, infoText }) => ({
  page: page || 1,
  view: view ? (value) => [value[view.name]].every(e => [...view.value.split(',')].includes(e)) : undefined,
  name: name,
  label: label,
  placeholder: 'Selecionar opção',
  selects: () => selectsArray || [],
  validated: (value) => value === null || value === undefined,
  infoText: infoText
});

const jsonEstado = ({ page, name, label }) => ({
  page: page || 1,
  name: name,
  label: label,
  placeholder: 'Selecionar a estado',
  selects: () => [...cidades].map(item => `${item.nome} - ${item.sigla}`),
  validated: (value) => value === null || value === undefined,
});

const jsonCidade = ({ page, name, label }) => ({
  page: page || 1,
  view: (value) => value['estado'] !== null,
  name: name,
  label: label,
  placeholder: 'Selecionar a cidade',
  selects: (value) => {
    if(value) {
      const estado = value.estadoSegurado;

      if(estado) {
        const uf = estado?.split('-')[1].split(' ').join('');
        const cidadesArray = cidades?.filter(e => e.sigla === uf)[0]?.cidades;

        return cidadesArray;
      }else {
        return [];
      }
    }else {
      return [];
    }
  },
  validated: (value) => value === null || value === undefined,
});

const array = [
  {
    title: 'SEGURO VEICULAR',
    icon: 'car',
    tipo: 'seguro-veicular',
    inputs: [
      jsonNome({ name: 'nomeSegurado', label: 'nome do segurado' }),
      jsonRegistro({ name: 'registroSegurado', label: 'cpf', mask: 'cpf' }),
      jsonCelular({ name: 'celularSegurado', label: 'celular' }),
      jsonEmail({ name: 'emailSegurado', label: 'E-mail' }),
      jsonSelect({ name: 'profissaoSegurado', label: 'Profissão', selects: ['militar', 'professor', 'servidor público', 'médico/dentista', 'aposentado', 'empresário', 'autônomo', 'outros'] }),
      jsonSelect({ name: 'estadoCivilSegurado', label: 'estado cívil', selects: ['solteiro', 'união estável', 'casado', 'divorciado', 'viúvo'] }),
      jsonCEP({ name: 'cepSegurado', label: 'cep' }),
      jsonSelect({ name: 'dataCNHSegurado', label: 'tempo de cnh', selects: ['+10 anos', '10 anos', '9 anos', '8 anos', '7 anos', '6 anos', '5 anos', '4 anos', '3 anos', '2 anos', '1 ano', 'permissão provisória'] }),
      jsonSelect({ name: 'seguradoProprietario', label: 'o segurado é proprietário?', selects: ['sim', 'não'] }),
      jsonSelect({ name: 'condutorResideMenor', label: 'haverá condução de pessoas menores de 26 anos?', selects: ['sim', 'não'] }),
      jsonSelect({ name: 'tipoSeguro', label: 'tipo do seguro', selects: ['novo', 'renovação'], page: 2 }),
      jsonSelect({ name: 'seguradoraSeguro', label: 'seguradora', selects: seguradoras, page: 2, view: { name: 'tipoSeguro', value: 'renovação' } }),
      jsonData({ name: 'finalVigenciaSeguro', label: 'fim da vigência', page: 2, view: { name: 'tipoSeguro', value: 'renovação' } }),
      jsonSelect({ name: 'houveSinistroSeguro', label: 'houve sinistro?', selects: ['sim', 'não'], page: 2, view: { name: 'tipoSeguro', value: 'renovação' } }),
      jsonTitle({ name: 'veiculoSeguro', label: 'veículo', placeholder: 'Veículo', page: 3 }),
      jsonTitle({ name: 'placaVeiculoSeguro', label: 'placa do veículo', placeholder: 'AAA0000 ou AAA0A00', formatter: maskPlaca, validated: validatePlaca, page: 3 }),
      jsonTitle({ name: 'anoFabricacaoSeguro', label: 'ano de fabricação', placeholder: '0000', formatter: maskYear, validated: validateYear, page: 3 }),
      jsonTitle({ name: 'anoModeloSeguro', label: 'modelo do modelo', placeholder: '0000', formatter: maskYear, validated: validateYear, page: 3 }),
      jsonCEP({ name: 'cepVeiculo', label: 'cep onde veículo dorme', page: 3 }),
      jsonSelect({ name: 'veiculoFinanciado', label: 'financiado?', selects: ['sim', 'não'], page: 3 }),
      jsonSelect({ name: 'veiculoBlindado', label: 'blindado?', selects: ['sim', 'não'], page: 3 }),
      jsonSelect({ name: 'veiculoKitGas', label: 'tem kit gás?', selects: ['sim', 'não'], page: 3 }),
      jsonSelect({ name: 'principalCondutor', label: 'principal condutor', selects: ['eu mesmo', 'outra pessoa'], infoText: { title: 'principal condutor', content: 'fsdfsdfsdf fsdfsdfsdff fsdfdsf fsd fds f dsf sd fsdf' }, page: 4 }),
      jsonNome({ name: 'nomePrincipalCondutor', label: 'nome', view: { name: 'principalCondutor', value: 'outra pessoa' }, page: 4 }),
      jsonRegistro({ name: 'CPFSegurado', label: 'cpf', mask: 'cpf', view: { name: 'principalCondutor', value: 'outra pessoa' }, page: 4 }),
      jsonSelect({ name: 'relacaoSegurado', label: 'relação com o segurado', selects: ['cônjugue', 'pai', 'mãe', 'filho', 'irmão', 'outros'], view: { name: 'principalCondutor', value: 'outra pessoa' }, page: 4 }),
      jsonSelect({ name: 'profissaoCondutor', label: 'Profissão', selects: ['militar', 'professor', 'servidor público', 'médico/dentista', 'aposentado', 'empresário', 'autônomo', 'outros'], view: { name: 'principalCondutor', value: 'outra pessoa' }, page: 4 }),
      jsonSelect({ name: 'dataCNHCondutor', label: 'tempo de cnh', selects: ['+10 anos', '10 anos', '9 anos', '8 anos', '7 anos', '6 anos', '5 anos', '4 anos', '3 anos', '2 anos', '1 ano', 'permissão provisória'], view: { name: 'principalCondutor', value: 'outra pessoa' }, page: 4 }),
      jsonSelect({ name: 'estadoCivilCondutor', label: 'estado cívil', selects: ['solteiro', 'união estável', 'casado', 'divorciado', 'viúvo'], view: { name: 'principalCondutor', value: 'outra pessoa' }, page: 4 }),
      jsonSelect({ name: 'usoVeiculo', label: 'uso do veículo', selects: ['lazer e ida e volta ao trabalho', 'só lazer', 'visita a clientes', 'motorista de aplicativo', 'táxi', 'para entregas'], page: 5 }),
      jsonSelect({ name: 'residenciaVeiculo', label: 'reside em', selects: ['casa', 'apartamento', 'condomínio'], page: 5 }),
      jsonSelect({ name: 'garagemResidencia', label: 'garagem na residência?', selects: ['não', 'sim, com portão automático', 'sim, com portão manual', 'sim, em estacionamento pago'], page: 5 }),
      jsonSelect({ name: 'garagemTrabalho', label: 'garagem no trabalho?', selects: ['sim', 'não', 'não trabalha', 'não utiliza para ir ao trabalho'], page: 5 }),
      jsonSelect({ name: 'garagemEscola', label: 'garagem na escola?', selects: ['sim', 'não', 'não estuda', 'não utiliza para ir a escola'], page: 5 }),
    ],
    info: true,
    infos: [
      {
        title: 'PRINCIPAL CONDUTOR',
        content: (
          <View>
            <Text style={{
              fontSize: 17,
              fontWeight: '400',
              color: '#333333'
            }}>
              <Text style={{ fontWeight: 'bold', marginBottom: 5 }}>PRINCIPAL CONDUTOR:</Text>
              {`\n`}
              A definição do principal condutor do veículo segurado é fundamental para que o valor a ser pago pelo consumidor possa ser claramente calculado.
              {`\n`}{`\n`}
              O principal condutor é a pessoa que utiliza o veículo a maior parte do tempo.
              {`\n`}
              <Text style={{ color: 'red', fontSize: 10 }}>( Mínimo 6 dias da semana )</Text>
              {`\n`}{`\n`}
              Outras pessoas maiores de 25 anos podem, em situações eventuais, também utilizá-lo.
              {`\n`}
              <Text style={{ color: 'red', fontSize: 10 }}>( No máximo 1 dia por semana )</Text>
              {`\n`}{`\n`}
              Para condutores menores que 25 anos, que dirigem no máximo 1 dia por semana, necessitam de uma cobertura especial.
              {`\n`}
              <Text style={{ color: 'red', fontSize: 10 }}>( Algumas seguradoras permitem até 02 dias por semana )</Text>
              {`\n`}{`\n`}
              Se várias pessoas utilizarem o veículo segurado mais de um dia na semana, o segurado deverá contrarar como principal condutor a pessoa mais jovem.
            </Text>
          </View>
        )
      },
      {
        title: 'CEP DE PERNOITE',
        content: (
          <View>
            <Text style={{
              fontSize: 17,
              fontWeight: '400',
              color: '#333333'
            }}>
              <Text style={{ fontWeight: 'bold', marginBottom: 5 }}>CEP DE PERNOITE:</Text>
              {`\n`}
              O cep de pernoite é o cep do local onde o veículo permanece durante a noite. Se o veículo pernoitar em vários locais, definir o cep onde o veículo passa a maior parte do tempo.
            </Text>
          </View>
        )
      },
      {
        title: 'COBERTURA PARA CONDUTORES ENTRE 18 E 25 ANOS',
        content: (
          <View>
            <Text style={{
              fontSize: 17,
              fontWeight: '400',
              color: '#333333'
            }}>
              Deseja contratar cobertura de seguro para condutores na faixa etária de 18 a 25 anos?
              {`\n`}
              Se responder - SIM
              {`\n`}{`\n`}
              Esta pergunta define apenas uma cobertura especial, esporádica para no máximo 1 dia por semana ( algumas seguradoras permitem 2 dias na semana ) para condutores nesta faixa etária.
              {`\n`}{`\n`}
              Se várias pessoas utilizarem o veículo mais de um dia na semana, o segurado deverá informar como principal condutor a pessoa mais jovem.
            </Text>
          </View>
        )
      },
      {
        title: 'OUTROS',
        content: (
          <View>
            <Text style={{
              fontWeight: 'bold',
              fontSize: 20
            }}>
              ATENÇÃO:
            </Text>
            <Text style={{
              fontSize: 17,
              fontWeight: '400',
              color: '#333333'
            }}>
              É obrigatório o preenchimento correto das informações pessoais, cuja veracidade é de inteira responsabilidade do proponente.
              {`\n`}{`\n`}
              As informações inverídicas ou desatualizadas poderão acarretar a perda de direito do segurado/proponente ou cancelamento do seguro sem prévia comunicação ao segurado.
              {`\n`}{`\n`}
              Se houver divergência nas informações de risco o segurado deverá informar tal situação imediatamente a corretora/seguradora.
              {`\n`}{`\n`}
              É obrigação do segurado comunicar e solicitar a alteração do risco, a sua corretora ou seguradora, se no decorrer da vigência da apólice houver mudança do principal condutor, troca de veículo, utilização do veículo ou cep de pernoite.
            </Text>
          </View>
        )
      }
    ]
  },
  {
    title: 'SEGURO SAÚDE',
    icon: 'heartbeat',
    tipo: 'seguro-saude',
    inputs: [
      jsonNome({ name: 'nomeSegurado', label: 'nome' }),
      jsonRegistro({ name: 'registroSegurado', label: 'cnpj', mask: 'cnpj' }),
      jsonCelular({ name: 'celularSegurado', label: 'celular' }),
      jsonEmail({ name: 'emailSegurado', label: 'E-mail' }),
      jsonSelect({ name: 'qtdBeneficiario', label: 'quantidades de beneficiários', selects: ['2 vidas', '3 vidas', '4 vidas', '5 vidas', '6 vidas', '7 vidas', '8 vidas', '9 vidas', '10 vidas'] }),
      jsonData({ name: 'nascimentoBeneficiario1', label: 'nascimento beneficiário 1', view: { name: 'qtdBeneficiario', value: 1 } }),
      jsonData({ name: 'nascimentoBeneficiario2', label: 'nascimento beneficiário 2', view: { name: 'qtdBeneficiario', value: 2 } }),
      jsonData({ name: 'nascimentoBeneficiario3', label: 'nascimento beneficiário 3', view: { name: 'qtdBeneficiario', value: 3 } }),
      jsonData({ name: 'nascimentoBeneficiario4', label: 'nascimento beneficiário 4', view: { name: 'qtdBeneficiario', value: 4 } }),
      jsonData({ name: 'nascimentoBeneficiario5', label: 'nascimento beneficiário 5', view: { name: 'qtdBeneficiario', value: 5 } }),
      jsonData({ name: 'nascimentoBeneficiario6', label: 'nascimento beneficiário 6', view: { name: 'qtdBeneficiario', value: 6 } }),
      jsonData({ name: 'nascimentoBeneficiario7', label: 'nascimento beneficiário 7', view: { name: 'qtdBeneficiario', value: 7 } }),
      jsonData({ name: 'nascimentoBeneficiario8', label: 'nascimento beneficiário 8', view: { name: 'qtdBeneficiario', value: 8 } }),
      jsonData({ name: 'nascimentoBeneficiario9', label: 'nascimento beneficiário 9', view: { name: 'qtdBeneficiario', value: 9 } }),
      jsonData({ name: 'nascimentoBeneficiario10', label: 'nascimento beneficiário 10', view: { name: 'qtdBeneficiario', value: 10 } }),
    ],
    info: []
  },
  {
    title: 'PLANO DE SAÚDE',
    icon: 'hand-holding-heart',
    tipo: 'plano-de-saude',
    inputs: [
      jsonNome({ name: 'nomeSegurado', label: 'nome' }),
      jsonCelular({ name: 'celularSegurado', label: 'celular' }),
      jsonEmail({ name: 'emailSegurado', label: 'E-mail' }),
      jsonEstado({ name: 'estadoSegurado', label: 'estado' }),
      jsonCidade({ name: 'cidadeSegurado', label: 'cidade' }),
      jsonSelect({ name: 'tipoPlanoSaude', label: 'plano', selects: ['individual', 'familiar', 'empresarial'] }),
      jsonSelect({ name: 'qtdBeneficiario', label: 'quantidades de beneficiários', view: { name: 'tipoPlanoSaude', value: 'familiar,empresarial' }, selects: ['2 vidas', '3 vidas', '4 vidas', '5 vidas', '6 vidas', '7 vidas', '8 vidas', '9 vidas', '10 vidas'] }),
      jsonData({ name: 'nascimentoBeneficiario1', label: 'nascimento beneficiário 1', view: { name: 'tipoPlanoSaude', value: 'individual' } }),
      jsonData({ name: 'nascimentoBeneficiario1', label: 'nascimento beneficiário 1', view: { name: 'qtdBeneficiario', value: 1 } }),
      jsonData({ name: 'nascimentoBeneficiario2', label: 'nascimento beneficiário 2', view: { name: 'qtdBeneficiario', value: 2 } }),
      jsonData({ name: 'nascimentoBeneficiario3', label: 'nascimento beneficiário 3', view: { name: 'qtdBeneficiario', value: 3 } }),
      jsonData({ name: 'nascimentoBeneficiario4', label: 'nascimento beneficiário 4', view: { name: 'qtdBeneficiario', value: 4 } }),
      jsonData({ name: 'nascimentoBeneficiario5', label: 'nascimento beneficiário 5', view: { name: 'qtdBeneficiario', value: 5 } }),
      jsonData({ name: 'nascimentoBeneficiario6', label: 'nascimento beneficiário 6', view: { name: 'qtdBeneficiario', value: 6 } }),
      jsonData({ name: 'nascimentoBeneficiario7', label: 'nascimento beneficiário 7', view: { name: 'qtdBeneficiario', value: 7 } }),
      jsonData({ name: 'nascimentoBeneficiario8', label: 'nascimento beneficiário 8', view: { name: 'qtdBeneficiario', value: 8 } }),
      jsonData({ name: 'nascimentoBeneficiario9', label: 'nascimento beneficiário 9', view: { name: 'qtdBeneficiario', value: 9 } }),
      jsonData({ name: 'nascimentoBeneficiario10', label: 'nascimento beneficiário 10', view: { name: 'qtdBeneficiario', value: 10 } }),
    ],
    info: [
      <View>
        <Text style={{
          fontSize: 17,
          fontWeight: '400',
          color: '#333333'
        }}>
          Planos médicos e odontológicos que sua fámilia ou sua empresa necessita.
          {`\n`}{`\n`}
          Saúde é o nosso bem mais valioso, proteja-se.
          {`\n`}{`\n`}
          Ótimas soluções em plano de saúde para sua proteção com o melhor da medicina.
        </Text>
        <Text>{`\n`}</Text>
        <Text style={{
          fontWeight: 'bold',
          fontSize: 18
        }}>COBERTURAS: <Text style={{ color: 'red', fontSize: 10, fontWeight: '500' }}>( de acôrdo com seu plano )</Text></Text>
        <Text style={{
          fontSize: 17,
          fontWeight: '400',
          color: '#333333'
        }}>
          - Internações
          {`\n`}
          - Cirurgias
          {`\n`}
          - Urgências e Emergências
          {`\n`}
          - Consultas
          {`\n`}
          - Parto
          {`\n`}
          - Exames
          {`\n`}
          - Psicológia
          {`\n`}
          - Telemedicina
          {`\n`}
          - Coberturas regionais e nacionais
          {`\n`}
          - Reembolso
        </Text>
      </View>
    ]
  },
  {
    title: 'SEGURO DE VIDA',
    icon: 'procedures',
    tipo: 'seguro-de-vida',
    inputs: [
      jsonNome({ name: 'nomeSegurado', label: 'nome' }),
      jsonRegistro({ name: 'registroSegurado', label: 'cpf', mask: 'cpf' }),
      jsonCelular({ name: 'celularSegurado', label: 'celular' }),
      jsonEmail({ name: 'emailSegurado', label: 'E-mail' }),
      jsonData({ name: 'nascimentoSegurado', label: 'nascimento' }),
      jsonSelect({ name: 'profissaoSegurado', label: 'Profissão', selects: ['militar', 'professor', 'servidor público', 'médico/dentista', 'aposentado', 'empresário', 'autônomo', 'outros'] }),
      jsonMoney({ name: 'rendaMensal', label: 'renda mensal' }),
      jsonSelect({ name: 'praticaEsporte', label: 'pratica esporte radical?', selects: ['sim', 'não'] }),
      jsonTitle({ view: { name: 'praticaEsporte', value: 'sim' }, name: 'praticaEsporteText', label: 'se sim, Qual?', placeholder: 'Esporte praticado', type: 'text' }),
      jsonSelect({ view: { name: 'praticaEsporte', value: 'sim' }, name: 'praticaEsporteFrenquencia', label: 'com qual frequência?', selects: ['até 3x/ano', 'acima 3x/ano'] }),
    ],
    info: [
      <View>
        <Text style={{
          fontSize: 17,
          fontWeight: '400',
          color: '#333333'
        }}>
          Seguro de vida é a segurança que você e sua família estarão protegidos em caso de um imprevisto.
          {`\n`}{`\n`}
          Os índices de violência só aumentam, acidentes acontecem, imagine deixar as pessoas que você tanto ama desprotegidas.
          {`\n`}{`\n`}
          O seguro de vida, também traz benefícios para você, confira abaixo as coberturas de um plano completo.
        </Text>
        <Text>{`\n`}</Text>
        <Text style={{
          fontWeight: 'bold',
          fontSize: 18
        }}>Coberturas: <Text style={{ color: 'red', fontSize: 10, fontWeight: '500'}}>( de acôrdo com seu plano )</Text></Text>
        <Text style={{
          fontSize: 17,
          fontWeight: '400',
          color: '#333333'
        }}>
          - Morte
          {`\n`}
          - Morte acidental
          {`\n`}
          - Invalidez por acidente, total ou parcial
          {`\n`}
          - Invalidez funcional permanente total
          {`\n`}
          - Doenças graves ( 14 tipos )
          {`\n`}
          <Text style={{ color: 'red', fontSize: 15 }}>
            - Diagnóstico de câncer
            {`\n`}
            - Acidente vascular cerebral
            {`\n`}
            - Infarto agudo do miocárdio
            {`\n`}
            - Transplante de orgãos
            {`\n`}
            - Insuficiência renal crônica
            {`\n`}
            - Alzheimer
            {`\n`}
            - Diagnóstico de surdez
            {`\n`}
            - Cirurgia de Bypass
            {`\n`}
            - Diagnóstico de cegueira
            {`\n`}
            - Embolia pulmonar
            {`\n`}
            - Tromboembolismo
            {`\n`}
            - Esclerose múltipla
            {`\n`}
            - Parkinson
            {`\n`}
            - Perda total da fala
            {`\n`}
          </Text>
          - Assistência funeral
          {`\n`}
          - Assistência nutricional
          {`\n`}
          - Descontos em medicamentos.
        </Text>
      </View>
    ]
  },
  {
    title: 'SEGURO RESIDENCIAL',
    icon: 'home',
    tipo: 'seguro-residencial',
    inputs: [
      jsonNome({ name: 'nomeSegurado', label: 'nome' }),
      jsonRegistro({ name: 'registroSegurado', label: 'cpf', mask: 'cpf' }),
      jsonCelular({ name: 'celularSegurado', label: 'celular' }),
      jsonEmail({ name: 'emailSegurado', label: 'E-mail' }),
      jsonCEP({ name: 'cepImovel', label: 'cep' }),
      jsonSelect({ name: 'tipoImovel', label: 'tipo da residência', selects: ['casa', 'casa em condomínio', 'apartamento'] }),
      jsonMoney({ name: 'valorImovel', label: 'valor do imóvel', view: { name: 'tipoImovel', value: 'casa' } }),
      jsonMoney({ name: 'valorMoveis', label: 'valor dos móveis e utensílios', view: { name: 'tipoImovel', value: 'casa' } }),
      jsonMoney({ name: 'valorMoveis', label: 'valor dos móveis e utensílios', view: { name: 'tipoImovel', value: 'apartamento' } }),
      jsonSelect({ name: 'usoImovel', label: 'uso do imóvel', selects: ['moradia principal', 'temporada', 'moradia e comércio', 'desocupada'] }),
      jsonSelect({ name: 'propriedadeImovel', label: 'propriedade do imóvel', selects: ['próprio', 'alugado'] }),
    ],
    info: [
      <View>
        <Text style={{
          fontSize: 17,
          fontWeight: '400',
          color: '#333333'
        }}>
          A residência é um dos bens mais valiosos que temos.
          {`\n`}{`\n`}
          O seguro residência existe para cobrir prejuízos que poderiam facilmente detruir nossos finanças e podem custar até 4x menos que o seguro do seu carro.
        </Text>
        <Text>{`\n`}</Text>
        <Text style={{
          fontWeight: 'bold',
          fontSize: 18
        }}>COBERTURAS: <Text style={{ color: 'red', fontSize: 10, fontWeight: '500' }}>( de acôrdo com seu plano )</Text></Text>
        <Text style={{
          fontSize: 17,
          fontWeight: '400',
          color: '#333333'
        }}>
          - Incêndio
          {`\n`}
          - Danos elétricos
          {`\n`}
          - Queda de raio
          {`\n`}
          - Explosão de qualquer natureza
          {`\n`}
          - Fumaça
          {`\n`}
          - Roubo e furto qualificado de bens
          {`\n`}
          - Impacto de veículos
          {`\n`}
          - Vendaval, furacão, ciclone, granizo e tornado
          {`\n`}
          - Responsabilidade civil familiar
          {`\n`}
          - Perda e pagamento de aluguel
          {`\n`}
          - Roubo e furto qualificado de bens fora do local segurado
          {`\n`}
          - Quebra de vidros, mármore e granito
          {`\n`}
          - Desmoranamento
          {`\n`}
          - Danos por água
          {`\n`}
          - Tumultos, greve e lock-outs
          {`\n`}
          - Despesas extraordinárias
          {`\n`}
          - Jóias e obras de arte
        </Text>
        <Text>{`\n`}</Text>
        <Text style={{
          fontWeight: 'bold',
          fontSize: 18
        }}>ASSISTÊNCIA: <Text style={{ color: 'red', fontSize: 10, fontWeight: '500' }}>( de acordo com seu plano )</Text></Text>
        <Text style={{
          fontSize: 17,
          fontWeight: '400',
          color: '#333333'
        }}>
          - Chaveiro
          {`\n`}
          <Text style={{ color: 'red', fontSize: 15 }}>
            - Abertura de porta
            {`\n`}
            - Troca de fechadura simples
            {`\n`}
            - Troca do segredo da fechadura
            {`\n`}
            - Verificação de extintores
            {`\n`}
          </Text>
          - Cobertura provisória de telhado
          {`\n`}
          - Conserto de aquecedor de gás
          {`\n`}
          - Conserto de ar condicionado
          {`\n`}
          - Conserto de eletrodomésticos
          {`\n`}
          <Text style={{ color: 'red', fontSize: 15 }}>
            - Linha branca
            {`\n`}
            - Linha marrom
            {`\n`}
          </Text>
          - Dedetização
          {`\n`}
          - Hidráulica
          {`\n`}
          <Text style={{ color: 'red', fontSize: 15 }}>
            - Caça vazamentos
            {`\n`}
            - Desemtupimento
            {`\n`}
            - Encanador
            {`\n`}
          </Text>
          - Hospedagem
          {`\n`}
          - Limpeza
          {`\n`}
          - Recuperação de veículo
          {`\n`}
          - Reparos elétricos
          {`\n`}
          - Retorno antcipado a domicílio
          {`\n`}
          - Substituição de telhas
          {`\n`}
          - Transporte e guarda móveis
          {`\n`}
          - Vidraceiro
          {`\n`}
          - Vigilância e segurança
        </Text>
      </View>
    ]
  },
  {
    title: 'SEGURO EMPRESARIAL',
    icon: 'building',
    tipo: 'seguro-empresarial',
    inputs: [
      jsonNome({ name: 'nomeSegurado', label: 'nome' }),
      jsonRegistro({ name: 'registroSegurado', label: 'cnpj', mask: 'cnpj' }),
      jsonCelular({ name: 'celularSegurado', label: 'celular' }),
      jsonEmail({ name: 'emailSegurado', label: 'E-mail' }),
      jsonCEP({ name: 'cepImovel', label: 'cep' }),
      jsonSelect({ name: 'tipoSeguro', label: 'tipo do seguro', selects: ['novo', 'renovação'] }),
      jsonSelect({ name: 'seguradoraSeguro', label: 'seguradora', selects: seguradoras, view: { name: 'tipoSeguro', value: 'renovação' } }),
      jsonData({ name: 'finalVigenciaSeguro', label: 'fim da vigência', view: { name: 'tipoSeguro', value: 'renovação' } }),
    ],
    info: [
      <View>
        <Text style={{
          fontSize: 17,
          fontWeight: '400',
          color: '#333333'
        }}>
          O seguro empresarial foi feito para você empresário , que possui uma pequena, média ou grande empresa, seja comércio, serviço ou indústria.
          {`\n`}{`\n`}
          Sua empresa não precisa correr riscos que podem levar ao encerramento de suas atividades e das suas receitas.
        </Text>
        <Text>{`\n`}</Text>
        <Text style={{
          fontSize: 15,
          fontWeight: '400',
          color: '#333333'
        }}>
          Abaixo coberturas e Assistências que podem ser acionadas em caso de sinistro:
        </Text>
        <Text>{`\n`}</Text>
        <Text style={{
          fontWeight: 'bold',
          fontSize: 18
        }}>COBERTURAS: <Text style={{ color: 'red', fontSize: 10, fontWeight: '500' }}>( de acôrdo com seu plano )</Text></Text>
        <Text style={{
          fontSize: 17,
          fontWeight: '400',
          color: '#333333'
        }}>
          - Incêndio
          {`\n`}
          - Danos elétricos
          {`\n`}
          - Perda de lucro bruto
          {`\n`}
          - Despesas fixas
          {`\n`}
          - Quebra de máquinas e equipamentos
          {`\n`}
          - Alagamento
          {`\n`}
          - Vendaval, furacão, ciclone, granizo e tornado
          {`\n`}
          - Roubo
          {`\n`}
          - Quebra de vidros, anúncios luminosos e mármores
        </Text>
        <Text>{`\n`}</Text>
        <Text style={{
          fontWeight: 'bold',
          fontSize: 18
        }}>ASSISTÊNCIA: <Text style={{ color: 'red', fontSize: 10, fontWeight: '500' }}>( de acordo com seu plano )</Text></Text>
        <Text style={{
          fontSize: 17,
          fontWeight: '400',
          color: '#333333'
        }}>
          - Substituição de telhas
          {`\n`}
          - Cobertura provisória de telhado
          {`\n`}
          - Manutenção de portas e portões
          {`\n`}
          - Reparos elétricos
          {`\n`}
          - Reparoa hidraúlicas
          {`\n`}
          - Reparo de central telefônica, interfone e porteiro eletrônico <Text style={{ fontSize: 10, color: 'red' }}>( sem imagem/vídeo )</Text>
          {`\n`}
          - Troca de vidros
          {`\n`}
          - Limpeza
          {`\n`}
          - Limpeza de caixa d`àgua
          {`\n`}
          - Serviço de desintetização e desratização
          {`\n`}
          - Abertura de porta
          {`\n`}
          - Conserto de ar condicionado 
          {`\n`}
          - Conserto de eletrodomésticos <Text style={{ color: 'red', fontSize: 10 }}>( linha branca )</Text>
          {`\n`}
          - Instalação de fechadura tetra
          {`\n`}
          - Troca de fechadura simples
          {`\n`}
          - Locação de microcomputadores e impressoras
          {`\n`}
          - Porteiro substituto
          {`\n`}
          - Escritório provisório
          {`\n`}
          - Transporte e guarda móveis
          {`\n`}
          - Vigilância/segurança
          {`\n`}
          - Checkup empresarial
          {`\n`}
          <Text style={{ color: 'red', fontSize: 15 }}>
            - Instalação de luzes de mergência
            {`\n`}
            - Instalação de antiderrapantes
            {`\n`}
            - Limpeza de ar condicionado
            {`\n`}
            - Verificação de extintores
          </Text>
        </Text>
      </View>
    ]
  },
  {
    title: 'SEGURO CONDOMÍNIO',
    icon: 'city',
    tipo: 'seguro-condominio',
    inputs: [
      jsonNome({ name: 'nomeSegurado', label: 'nome' }),
      jsonRegistro({ name: 'registroSegurado', label: 'cnpj', mask: 'cnpj' }),
      jsonCelular({ name: 'celularSegurado', label: 'celular' }),
      jsonEmail({ name: 'emailSegurado', label: 'E-mail' }),
      jsonCEP({ name: 'cepImovel', label: 'cep' }),
      jsonSelect({ name: 'tipoSeguro', label: 'tipo do seguro', selects: ['novo', 'renovação'] }),
      jsonSelect({ name: 'seguradoraSeguro', label: 'seguradora', selects: seguradoras, view: { name: 'tipoSeguro', value: 'renovação' } }),
      jsonData({ name: 'finalVigenciaSeguro', label: 'fim da vigência', view: { name: 'tipoSeguro', value: 'renovação' } }),
    ],
    info: [
      <View>
        <Text style={{
          fontWeight: 'bold',
          fontSize: 18
        }}>SEGURO OBRIGATÓRIO:</Text>
        <Text style={{
          fontSize: 17,
          fontWeight: '400',
          color: '#333333'
        }}>
          - Lei 4.591/1964
          {`\n`}
          - Decreto Lei 73/1966
          {`\n`}
          - Código Civil Lei 10.406/2002
        </Text>
        <Text>{`\n`}</Text>
        <Text style={{
          fontSize: 17,
          fontWeight: '400',
          color: '#333333'
        }}>
          Vale salientar que o seguro condomínio protege as áreas comuns do condomínio e não as residências.
          {`\n`}{`\n`}
          O seguro Residencial protege sua residência e o que há nela, não é obrigatório e deve ser contratado pelo proprietário ou inquilino do imóvel.
        </Text>
        <Text>{`\n`}</Text>
        <Text style={{
          fontWeight: 'bold',
          fontSize: 18
        }}>COBERTURAS OBRIGATÓRIAS:</Text>
        <Text style={{
          fontSize: 17,
          fontWeight: '400',
          color: '#333333'
        }}>
          - Incêndio
          {`\n`}
          - Explosão de qualquer natureza
          {`\n`}
          - Queda de raio e de aeronaves
        </Text>
        <Text>{`\n`}</Text>
        <Text style={{
          fontWeight: 'bold',
          fontSize: 18
        }}>COBERTURAS: <Text style={{ color: 'red', fontSize: 10, fontWeight: '500' }}>( adicionais )</Text></Text>
        <Text style={{
          fontSize: 17,
          fontWeight: '400',
          color: '#333333'
        }}>
          - Danos elétricos
          {`\n`}
          - Desmoranamento
          {`\n`}
          - Roubo de bens do condomínio
          {`\n`}
          - Impacto de veículos
          {`\n`}
          - Vendaval
          {`\n`}
          - Vazamento de tanques
          {`\n`}
          - Responsabilidade civil do síndico
          {`\n`}
          - Responsabilidade civil do condomínio
        </Text>
        <Text>
          {`\n`}
          <Text style={{ fontWeight: 'bold' }}>OBS:</Text> Na renovação do seu seguro atualize as coberturas e valores
        </Text>
      </View>
    ]
  },
  /*
    {
      title: 'PREVIDÊNCIA SOCIAL',
      icon: 'file-invoice-dollar',
      tipo: 'previdencia-social',
      inputs: [
        jsonNome({ name: 'nomeSegurado', label: 'nome' }),
        jsonRegistro({ name: 'registroSegurado', label: 'cpf', mask: 'cpf' }),
        jsonCelular({ name: 'celularSegurado', label: 'celular' }),
        jsonEmail({ name: 'emailSegurado', label: 'E-mail' }),
      ],
      info: []
    },
  */
  {
    title: 'SEGURO VIAGEM',
    icon: 'plane-departure',
    tipo: 'seguro-viagem',
    inputs: [
      jsonNome({ name: 'nomeSegurado', label: 'nome' }),
      jsonRegistro({ name: 'registroSegurado', label: 'cpf', mask: 'cpf' }),
      jsonCelular({ name: 'celularSegurado', label: 'celular' }),
      jsonEmail({ name: 'emailSegurado', label: 'E-mail' }),
      jsonSelect({ name: 'tipoViagem', label: 'tipo da viagem', selects: ['internacional', 'nacional'] }),
      jsonSelect({ name: 'meioTransporte', label: 'meio de transporte', selects: ['aereo', 'maritimo', 'aereo + maritimo'] }),
      jsonSelect({ name: 'motivoViagem', label: 'motivo da viagem', selects: ['lazer', 'estudo', 'negocios'] }),
      jsonTitle({ name: 'origemViagem', label: 'origem', placeholder: 'Origem da viagem', type: 'text' }),
      jsonTitle({ name: 'destinoViagem', label: 'destino', placeholder: 'Destino da viagem', type: 'text' }),
      jsonData({ name: 'dataIdaViagem', label: 'data da ida' }),
      jsonData({ name: 'dataRetornoViagem', label: 'data da volta' }),
      jsonSelect({ name: 'praticaEsporte', label: 'praticará esporte radical?', selects: ['sim', 'não'] }),
      jsonSelect({ name: 'utilizaraMotocicleta', label: 'utilizará motocicleta durante a viagem?', selects: ['sim', 'não'] }),
      jsonSelect({ name: 'qtdBeneficiario', label: 'quantidades de passageiros', selects: ['1 passageiro', '2 passageiros', '3 passageiros', '4 passageiros', '5 passageiros', '6 passageiros', '7 passageiros', '8 passageiros', '9 passageiros', '10 passageiros'] }),
      jsonData({ name: 'nascimentoBeneficiario1', label: 'nascimento passageiros 1', view: { name: 'qtdBeneficiario', value: 1 } }),
      jsonData({ name: 'nascimentoBeneficiario2', label: 'nascimento passageiros 2', view: { name: 'qtdBeneficiario', value: 2 } }),
      jsonData({ name: 'nascimentoBeneficiario3', label: 'nascimento passageiros 3', view: { name: 'qtdBeneficiario', value: 3 } }),
      jsonData({ name: 'nascimentoBeneficiario4', label: 'nascimento passageiros 4', view: { name: 'qtdBeneficiario', value: 4 } }),
      jsonData({ name: 'nascimentoBeneficiario5', label: 'nascimento passageiros 5', view: { name: 'qtdBeneficiario', value: 5 } }),
      jsonData({ name: 'nascimentoBeneficiario6', label: 'nascimento passageiros 6', view: { name: 'qtdBeneficiario', value: 6 } }),
      jsonData({ name: 'nascimentoBeneficiario7', label: 'nascimento passageiros 7', view: { name: 'qtdBeneficiario', value: 7 } }),
      jsonData({ name: 'nascimentoBeneficiario8', label: 'nascimento passageiros 8', view: { name: 'qtdBeneficiario', value: 8 } }),
      jsonData({ name: 'nascimentoBeneficiario9', label: 'nascimento passageiros 9', view: { name: 'qtdBeneficiario', value: 9 } }),
      jsonData({ name: 'nascimentoBeneficiario10', label: 'nascimento passageiros 10', view: { name: 'qtdBeneficiario', value: 10 } }),
    ],
    info: []
  },
];

export default array;