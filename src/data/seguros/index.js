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
  validated: (value) => !value,
  required: true,
});

const jsonEmail = ({ page, label, name, view }) => ({
  page: page || 1,
  view: view ? (value) => value[view.name] === view.value : undefined,
  name: name || 'emailSegurado',
  label: label || 'E-mail',
  placeholder: 'E-mail',
  inputType: 'email-address',
  validated: (value) => !validateEmail(value),
  required: true,
});

const jsonTitle = ({ page, view, name, label, placeholder, formatter, validated, type, infoText }) => ({
  page: page || 1,
  view: view ? (value) => value[view.name] === view.value : undefined,
  name: name,
  label: label,
  placeholder: placeholder || '',
  inputType: type || 'default',
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
  view: view ? (value) => [value[view.name]].every(e => [...view.value.split(',')].includes(e)) : undefined,
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
  placeholder: 'Selecionar op????o',
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
      jsonSelect({ name: 'profissaoSegurado', label: 'Profiss??o', selects: ['militar', 'professor', 'servidor p??blico', 'm??dico/dentista', 'aposentado', 'empres??rio', 'aut??nomo', 'outros'] }),
      jsonSelect({ name: 'estadoCivilSegurado', label: 'estado c??vil', selects: ['solteiro', 'uni??o est??vel', 'casado', 'divorciado', 'vi??vo'] }),
      jsonCEP({ name: 'cepSegurado', label: 'cep' }),
      jsonSelect({ name: 'dataCNHSegurado', label: 'tempo de cnh', selects: ['+10 anos', '10 anos', '9 anos', '8 anos', '7 anos', '6 anos', '5 anos', '4 anos', '3 anos', '2 anos', '1 ano', 'permiss??o provis??ria'] }),
      jsonSelect({ name: 'seguradoProprietario', label: 'o segurado ?? propriet??rio?', selects: ['sim', 'n??o'] }),
      jsonSelect({ name: 'condutorResideMenor', label: 'Deseja cobertura para outros condutores com menos de 26 anos?', selects: ['sim', 'n??o'] }),
      jsonSelect({ name: 'tipoSeguro', label: 'tipo do seguro', selects: ['novo', 'renova????o'], page: 2 }),
      jsonSelect({ name: 'seguradoraSeguro', label: 'seguradora', selects: seguradoras, page: 2, view: { name: 'tipoSeguro', value: 'renova????o' } }),
      jsonData({ name: 'finalVigenciaSeguro', label: 'fim da vig??ncia', page: 2, view: { name: 'tipoSeguro', value: 'renova????o' } }),
      jsonSelect({ name: 'houveSinistroSeguro', label: 'houve sinistro?', selects: ['sim', 'n??o'], page: 2, view: { name: 'tipoSeguro', value: 'renova????o' } }),
      jsonSelect({ name: 'classeBonus', label: 'Classe de B??nus?', selects: ['n??o sei', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10'], page: 2, view: { name: 'tipoSeguro', value: 'renova????o' } }),
      jsonSelect({ name: 'possuiApolice', label: 'Possui ap??lice?', selects: ['sim', 'n??o'], page: 2, view: { name: 'tipoSeguro', value: 'renova????o' } }),
      jsonTitle({ name: 'apolice', label: 'Ap??lice', placeholder: 'Ap??lice', page: 2, view: { name: 'possuiApolice', value: 'sim' } }),
      jsonTitle({ name: 'ci', label: 'CI', placeholder: 'CI', page: 2, view: { name: 'possuiApolice', value: 'sim' } }),
      jsonTitle({ name: 'placaVeiculoSeguro', label: 'placa do ve??culo', placeholder: 'AAA0000 ou AAA0A00', formatter: maskPlaca, validated: validatePlaca, page: 3 }),
      jsonTitle({ name: 'anoFabricacaoSeguro', label: 'ano de fabrica????o', placeholder: '0000', formatter: maskYear, validated: validateYear, page: 3 }),
      jsonTitle({ name: 'anoModeloSeguro', label: 'ano do modelo', placeholder: '0000', formatter: maskYear, validated: validateYear, page: 3 }),
      jsonCEP({ name: 'cepVeiculo', label: 'cep onde ve??culo dorme', page: 3 }),
      jsonSelect({ name: 'veiculoFinanciado', label: 'financiado?', selects: ['sim', 'n??o'], page: 3 }),
      jsonSelect({ name: 'veiculoBlindado', label: 'blindado?', selects: ['sim', 'n??o'], page: 3 }),
      jsonSelect({ name: 'veiculoKitGas', label: 'tem kit g??s?', selects: ['sim', 'n??o'], page: 3 }),
      jsonSelect({ name: 'principalCondutor', label: 'principal condutor', selects: ['eu mesmo', 'outra pessoa'], infoText: { title: 'principal condutor', content: `?? a pessoa que utiliza o ve??culo segurado 2 ou mais vezes por semana. \n Caso existam mais de um condutor nesta condi????o, ser?? definido como principal o condutor o de menor idade.` }, page: 4 }),
      jsonNome({ name: 'nomePrincipalCondutor', label: 'nome', view: { name: 'principalCondutor', value: 'outra pessoa' }, page: 4 }),
      jsonRegistro({ name: 'CPFSegurado', label: 'cpf', mask: 'cpf', view: { name: 'principalCondutor', value: 'outra pessoa' }, page: 4 }),
      jsonSelect({ name: 'relacaoSegurado', label: 'rela????o com o segurado', selects: ['c??njugue', 'pai', 'm??e', 'filho', 'irm??o', 'outros'], view: { name: 'principalCondutor', value: 'outra pessoa' }, page: 4 }),
      jsonSelect({ name: 'profissaoCondutor', label: 'Profiss??o', selects: ['militar', 'professor', 'servidor p??blico', 'm??dico/dentista', 'aposentado', 'empres??rio', 'aut??nomo', 'outros'], view: { name: 'principalCondutor', value: 'outra pessoa' }, page: 4 }),
      jsonSelect({ name: 'dataCNHCondutor', label: 'tempo de cnh', selects: ['+10 anos', '10 anos', '9 anos', '8 anos', '7 anos', '6 anos', '5 anos', '4 anos', '3 anos', '2 anos', '1 ano', 'permiss??o provis??ria'], view: { name: 'principalCondutor', value: 'outra pessoa' }, page: 4 }),
      jsonSelect({ name: 'estadoCivilCondutor', label: 'estado c??vil', selects: ['solteiro', 'uni??o est??vel', 'casado', 'divorciado', 'vi??vo'], view: { name: 'principalCondutor', value: 'outra pessoa' }, page: 4 }),
      jsonSelect({ name: 'usoVeiculo', label: 'uso do ve??culo', selects: ['lazer e ida e volta ao trabalho', 's?? lazer', 'visita a clientes', 'motorista de aplicativo', 't??xi', 'para entregas'], page: 5 }),
      jsonSelect({ name: 'residenciaVeiculo', label: 'reside em', selects: ['casa', 'apartamento', 'condom??nio de casas'], page: 5 }),
      jsonSelect({ name: 'garagemResidencia', label: 'garagem na resid??ncia?', selects: ['n??o', 'sim, com port??o autom??tico', 'sim, com port??o manual', 'sim, em estacionamento pago'], page: 5 }),
      jsonSelect({ name: 'garagemTrabalho', label: 'garagem no trabalho?', selects: ['sim', 'n??o', 'n??o trabalha', 'n??o utiliza para ir ao trabalho'], page: 5 }),
      jsonSelect({ name: 'garagemEscola', label: 'garagem na escola?', selects: ['sim', 'n??o', 'n??o estuda', 'n??o utiliza para ir a escola'], page: 5 }),
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
              A defini????o do principal condutor do ve??culo segurado ?? fundamental para que o valor a ser pago pelo consumidor possa ser claramente calculado.
              {`\n`}{`\n`}
              O principal condutor ?? a pessoa que utiliza o ve??culo a maior parte do tempo.
              {`\n`}
              <Text style={{ color: 'red', fontSize: 10 }}>( M??nimo 6 dias da semana )</Text>
              {`\n`}{`\n`}
              Outras pessoas maiores de 25 anos podem, em situa????es eventuais, tamb??m utiliz??-lo.
              {`\n`}
              <Text style={{ color: 'red', fontSize: 10 }}>( No m??ximo 1 dia por semana )</Text>
              {`\n`}{`\n`}
              Para condutores menores que 25 anos, que dirigem no m??ximo 1 dia por semana, necessitam de uma cobertura especial.
              {`\n`}
              <Text style={{ color: 'red', fontSize: 10 }}>( Algumas seguradoras permitem at?? 02 dias por semana )</Text>
              {`\n`}{`\n`}
              Se v??rias pessoas utilizarem o ve??culo segurado mais de um dia na semana, o segurado dever?? contrarar como principal condutor a pessoa mais jovem.
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
              O cep de pernoite ?? o cep do local onde o ve??culo permanece durante a noite. Se o ve??culo pernoitar em v??rios locais, definir o cep onde o ve??culo passa a maior parte do tempo.
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
              Deseja contratar cobertura de seguro para condutores na faixa et??ria de 18 a 25 anos?
              {`\n`}
              Se responder - SIM
              {`\n`}{`\n`}
              Esta pergunta define apenas uma cobertura especial, espor??dica para no m??ximo 1 dia por semana ( algumas seguradoras permitem 2 dias na semana ) para condutores nesta faixa et??ria.
              {`\n`}{`\n`}
              Se v??rias pessoas utilizarem o ve??culo mais de um dia na semana, o segurado dever?? informar como principal condutor a pessoa mais jovem.
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
              ATEN????O:
            </Text>
            <Text style={{
              fontSize: 17,
              fontWeight: '400',
              color: '#333333'
            }}>
              ?? obrigat??rio o preenchimento correto das informa????es pessoais, cuja veracidade ?? de inteira responsabilidade do proponente.
              {`\n`}{`\n`}
              As informa????es inver??dicas ou desatualizadas poder??o acarretar a perda de direito do segurado/proponente ou cancelamento do seguro sem pr??via comunica????o ao segurado.
              {`\n`}{`\n`}
              Se houver diverg??ncia nas informa????es de risco o segurado dever?? informar tal situa????o imediatamente a corretora/seguradora.
              {`\n`}{`\n`}
              ?? obriga????o do segurado comunicar e solicitar a altera????o do risco, a sua corretora ou seguradora, se no decorrer da vig??ncia da ap??lice houver mudan??a do principal condutor, troca de ve??culo, utiliza????o do ve??culo ou cep de pernoite.
            </Text>
          </View>
        )
      }
    ]
  },
  /*
    {
      title: 'SEGURO SA??DE',
      icon: 'heartbeat',
      tipo: 'seguro-saude',
      inputs: [
        jsonNome({ name: 'nomeSegurado', label: 'nome' }),
        jsonRegistro({ name: 'registroSegurado', label: 'cnpj', mask: 'cnpj' }),
        jsonCelular({ name: 'celularSegurado', label: 'celular' }),
        jsonEmail({ name: 'emailSegurado', label: 'E-mail' }),
        jsonSelect({ name: 'qtdBeneficiario', label: 'quantidades de benefici??rios', selects: ['2 vidas', '3 vidas', '4 vidas', '5 vidas', '6 vidas', '7 vidas', '8 vidas', '9 vidas', '10 vidas'] }),
        jsonData({ name: 'nascimentoBeneficiario1', label: 'nascimento benefici??rio 1', view: { name: 'qtdBeneficiario', value: 1 } }),
        jsonData({ name: 'nascimentoBeneficiario2', label: 'nascimento benefici??rio 2', view: { name: 'qtdBeneficiario', value: 2 } }),
        jsonData({ name: 'nascimentoBeneficiario3', label: 'nascimento benefici??rio 3', view: { name: 'qtdBeneficiario', value: 3 } }),
        jsonData({ name: 'nascimentoBeneficiario4', label: 'nascimento benefici??rio 4', view: { name: 'qtdBeneficiario', value: 4 } }),
        jsonData({ name: 'nascimentoBeneficiario5', label: 'nascimento benefici??rio 5', view: { name: 'qtdBeneficiario', value: 5 } }),
        jsonData({ name: 'nascimentoBeneficiario6', label: 'nascimento benefici??rio 6', view: { name: 'qtdBeneficiario', value: 6 } }),
        jsonData({ name: 'nascimentoBeneficiario7', label: 'nascimento benefici??rio 7', view: { name: 'qtdBeneficiario', value: 7 } }),
        jsonData({ name: 'nascimentoBeneficiario8', label: 'nascimento benefici??rio 8', view: { name: 'qtdBeneficiario', value: 8 } }),
        jsonData({ name: 'nascimentoBeneficiario9', label: 'nascimento benefici??rio 9', view: { name: 'qtdBeneficiario', value: 9 } }),
        jsonData({ name: 'nascimentoBeneficiario10', label: 'nascimento benefici??rio 10', view: { name: 'qtdBeneficiario', value: 10 } }),
      ],
      info: []
    },
  */
  {
    title: 'PLANO DE SA??DE',
    icon: 'hand-holding-heart',
    tipo: 'plano-de-saude',
    inputs: [
      jsonNome({ name: 'nomeSegurado', label: 'nome' }),
      jsonCelular({ name: 'celularSegurado', label: 'celular' }),
      jsonEmail({ name: 'emailSegurado', label: 'E-mail' }),
      jsonEstado({ name: 'estadoSegurado', label: 'estado' }),
      jsonCidade({ name: 'cidadeSegurado', label: 'cidade' }),
      jsonSelect({ name: 'tipoPlanoSaude', label: 'plano', selects: ['individual', 'familiar', 'empresarial'] }),
      jsonRegistro({ name: 'registroSegurado', label: 'cpf', mask: 'cpf', view: { name: 'tipoPlanoSaude', value: 'individual' } }),
      jsonRegistro({ name: 'registroSegurado', label: 'cnpj', mask: 'cnpj', view: { name: 'tipoPlanoSaude', value: 'empresarial' } }),
      jsonSelect({ name: 'qtdBeneficiario', label: 'quantidades de benefici??rios', view: { name: 'tipoPlanoSaude', value: 'familiar,empresarial' }, selects: ['2 vidas', '3 vidas', '4 vidas', '5 vidas', '6 vidas', '7 vidas', '8 vidas', '9 vidas', '10 vidas'] }),
      jsonData({ name: 'nascimentoBeneficiario1', label: 'nascimento benefici??rio', view: { name: 'tipoPlanoSaude', value: 'individual' } }),
      jsonData({ name: 'nascimentoBeneficiario1', label: 'nascimento benefici??rio 1', view: { name: 'qtdBeneficiario', value: 1 } }),
      jsonData({ name: 'nascimentoBeneficiario2', label: 'nascimento benefici??rio 2', view: { name: 'qtdBeneficiario', value: 2 } }),
      jsonData({ name: 'nascimentoBeneficiario3', label: 'nascimento benefici??rio 3', view: { name: 'qtdBeneficiario', value: 3 } }),
      jsonData({ name: 'nascimentoBeneficiario4', label: 'nascimento benefici??rio 4', view: { name: 'qtdBeneficiario', value: 4 } }),
      jsonData({ name: 'nascimentoBeneficiario5', label: 'nascimento benefici??rio 5', view: { name: 'qtdBeneficiario', value: 5 } }),
      jsonData({ name: 'nascimentoBeneficiario6', label: 'nascimento benefici??rio 6', view: { name: 'qtdBeneficiario', value: 6 } }),
      jsonData({ name: 'nascimentoBeneficiario7', label: 'nascimento benefici??rio 7', view: { name: 'qtdBeneficiario', value: 7 } }),
      jsonData({ name: 'nascimentoBeneficiario8', label: 'nascimento benefici??rio 8', view: { name: 'qtdBeneficiario', value: 8 } }),
      jsonData({ name: 'nascimentoBeneficiario9', label: 'nascimento benefici??rio 9', view: { name: 'qtdBeneficiario', value: 9 } }),
      jsonData({ name: 'nascimentoBeneficiario10', label: 'nascimento benefici??rio 10', view: { name: 'qtdBeneficiario', value: 10 } }),
    ],
    info: [
      <View>
        <Text style={{
          fontSize: 17,
          fontWeight: '400',
          color: '#333333'
        }}>
          Planos m??dicos e odontol??gicos que sua f??milia ou sua empresa necessita.
          {`\n`}{`\n`}
          Sa??de ?? o nosso bem mais valioso, proteja-se.
          {`\n`}{`\n`}
          ??timas solu????es em plano de sa??de para sua prote????o com o melhor da medicina.
        </Text>
        <Text>{`\n`}</Text>
        <Text style={{
          fontWeight: 'bold',
          fontSize: 18
        }}>COBERTURAS: <Text style={{ color: 'red', fontSize: 10, fontWeight: '500' }}>( de ac??rdo com seu plano )</Text></Text>
        <Text style={{
          fontSize: 17,
          fontWeight: '400',
          color: '#333333'
        }}>
          - Interna????es
          {`\n`}
          - Cirurgias
          {`\n`}
          - Urg??ncias e Emerg??ncias
          {`\n`}
          - Consultas
          {`\n`}
          - Parto
          {`\n`}
          - Exames
          {`\n`}
          - Psicol??gia
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
  /*
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
        jsonSelect({ name: 'profissaoSegurado', label: 'Profiss??o', selects: ['militar', 'professor', 'servidor p??blico', 'm??dico/dentista', 'aposentado', 'empres??rio', 'aut??nomo', 'outros'] }),
        jsonMoney({ name: 'rendaMensal', label: 'renda mensal' }),
        jsonSelect({ name: 'praticaEsporte', label: 'pratica esporte radical?', selects: ['sim', 'n??o'] }),
        jsonTitle({ view: { name: 'praticaEsporte', value: 'sim' }, name: 'praticaEsporteText', label: 'se sim, Qual?', placeholder: 'Esporte praticado', type: 'default' }),
        jsonSelect({ view: { name: 'praticaEsporte', value: 'sim' }, name: 'praticaEsporteFrenquencia', label: 'com qual frequ??ncia?', selects: ['at?? 3x/ano', 'acima 3x/ano'] }),
      ],
      info: [
        <View>
          <Text style={{
            fontSize: 17,
            fontWeight: '400',
            color: '#333333'
          }}>
            Seguro de vida ?? a seguran??a que voc?? e sua fam??lia estar??o protegidos em caso de um imprevisto.
            {`\n`}{`\n`}
            Os ??ndices de viol??ncia s?? aumentam, acidentes acontecem, imagine deixar as pessoas que voc?? tanto ama desprotegidas.
            {`\n`}{`\n`}
            O seguro de vida, tamb??m traz benef??cios para voc??, confira abaixo as coberturas de um plano completo.
          </Text>
          <Text>{`\n`}</Text>
          <Text style={{
            fontWeight: 'bold',
            fontSize: 18
          }}>Coberturas: <Text style={{ color: 'red', fontSize: 10, fontWeight: '500'}}>( de ac??rdo com seu plano )</Text></Text>
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
            - Doen??as graves ( 14 tipos )
            {`\n`}
            <Text style={{ color: 'red', fontSize: 15 }}>
              - Diagn??stico de c??ncer
              {`\n`}
              - Acidente vascular cerebral
              {`\n`}
              - Infarto agudo do mioc??rdio
              {`\n`}
              - Transplante de org??os
              {`\n`}
              - Insufici??ncia renal cr??nica
              {`\n`}
              - Alzheimer
              {`\n`}
              - Diagn??stico de surdez
              {`\n`}
              - Cirurgia de Bypass
              {`\n`}
              - Diagn??stico de cegueira
              {`\n`}
              - Embolia pulmonar
              {`\n`}
              - Tromboembolismo
              {`\n`}
              - Esclerose m??ltipla
              {`\n`}
              - Parkinson
              {`\n`}
              - Perda total da fala
              {`\n`}
            </Text>
            - Assist??ncia funeral
            {`\n`}
            - Assist??ncia nutricional
            {`\n`}
            - Descontos em medicamentos.
          </Text>
        </View>
      ]
    },
  */
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
      jsonSelect({ name: 'tipoImovel', label: 'tipo da resid??ncia', selects: ['casa', 'casa em condom??nio', 'apartamento'] }),
      jsonMoney({ name: 'valorImovel', label: 'valor do im??vel', view: { name: 'tipoImovel', value: 'casa' } }),
      jsonMoney({ name: 'valorMoveis', label: 'valor dos m??veis e utens??lios', view: { name: 'tipoImovel', value: 'casa' } }),
      jsonMoney({ name: 'valorMoveis', label: 'valor dos m??veis e utens??lios', view: { name: 'tipoImovel', value: 'apartamento' } }),
      jsonSelect({ name: 'usoImovel', label: 'uso do im??vel', selects: ['moradia principal', 'temporada', 'moradia e com??rcio', 'desocupada'] }),
      jsonSelect({ name: 'propriedadeImovel', label: 'propriedade do im??vel', selects: ['pr??prio', 'alugado'] }),
    ],
    info: [
      <View>
        <Text style={{
          fontSize: 17,
          fontWeight: '400',
          color: '#333333'
        }}>
          A resid??ncia ?? um dos bens mais valiosos que temos.
          {`\n`}{`\n`}
          O seguro resid??ncia existe para cobrir preju??zos que poderiam facilmente detruir nossos finan??as e podem custar at?? 4x menos que o seguro do seu carro.
        </Text>
        <Text>{`\n`}</Text>
        <Text style={{
          fontWeight: 'bold',
          fontSize: 18
        }}>COBERTURAS: <Text style={{ color: 'red', fontSize: 10, fontWeight: '500' }}>( de ac??rdo com seu plano )</Text></Text>
        <Text style={{
          fontSize: 17,
          fontWeight: '400',
          color: '#333333'
        }}>
          - Inc??ndio
          {`\n`}
          - Danos el??tricos
          {`\n`}
          - Queda de raio
          {`\n`}
          - Explos??o de qualquer natureza
          {`\n`}
          - Fuma??a
          {`\n`}
          - Roubo e furto qualificado de bens
          {`\n`}
          - Impacto de ve??culos
          {`\n`}
          - Vendaval, furac??o, ciclone, granizo e tornado
          {`\n`}
          - Responsabilidade civil familiar
          {`\n`}
          - Perda e pagamento de aluguel
          {`\n`}
          - Roubo e furto qualificado de bens fora do local segurado
          {`\n`}
          - Quebra de vidros, m??rmore e granito
          {`\n`}
          - Desmoranamento
          {`\n`}
          - Danos por ??gua
          {`\n`}
          - Tumultos, greve e lock-outs
          {`\n`}
          - Despesas extraordin??rias
          {`\n`}
          - J??ias e obras de arte
        </Text>
        <Text>{`\n`}</Text>
        <Text style={{
          fontWeight: 'bold',
          fontSize: 18
        }}>ASSIST??NCIA: <Text style={{ color: 'red', fontSize: 10, fontWeight: '500' }}>( de acordo com seu plano )</Text></Text>
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
            - Verifica????o de extintores
            {`\n`}
          </Text>
          - Cobertura provis??ria de telhado
          {`\n`}
          - Conserto de aquecedor de g??s
          {`\n`}
          - Conserto de ar condicionado
          {`\n`}
          - Conserto de eletrodom??sticos
          {`\n`}
          <Text style={{ color: 'red', fontSize: 15 }}>
            - Linha branca
            {`\n`}
            - Linha marrom
            {`\n`}
          </Text>
          - Dedetiza????o
          {`\n`}
          - Hidr??ulica
          {`\n`}
          <Text style={{ color: 'red', fontSize: 15 }}>
            - Ca??a vazamentos
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
          - Recupera????o de ve??culo
          {`\n`}
          - Reparos el??tricos
          {`\n`}
          - Retorno antcipado a domic??lio
          {`\n`}
          - Substitui????o de telhas
          {`\n`}
          - Transporte e guarda m??veis
          {`\n`}
          - Vidraceiro
          {`\n`}
          - Vigil??ncia e seguran??a
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
      jsonSelect({ name: 'tipoSeguro', label: 'tipo do seguro', selects: ['novo', 'renova????o'] }),
      jsonSelect({ name: 'seguradoraSeguro', label: 'seguradora', selects: seguradoras, view: { name: 'tipoSeguro', value: 'renova????o' } }),
      jsonData({ name: 'finalVigenciaSeguro', label: 'fim da vig??ncia', view: { name: 'tipoSeguro', value: 'renova????o' } }),
    ],
    info: [
      <View>
        <Text style={{
          fontSize: 17,
          fontWeight: '400',
          color: '#333333'
        }}>
          O seguro empresarial foi feito para voc?? empres??rio , que possui uma pequena, m??dia ou grande empresa, seja com??rcio, servi??o ou ind??stria.
          {`\n`}{`\n`}
          Sua empresa n??o precisa correr riscos que podem levar ao encerramento de suas atividades e das suas receitas.
        </Text>
        <Text>{`\n`}</Text>
        <Text style={{
          fontSize: 15,
          fontWeight: '400',
          color: '#333333'
        }}>
          Abaixo coberturas e Assist??ncias que podem ser acionadas em caso de sinistro:
        </Text>
        <Text>{`\n`}</Text>
        <Text style={{
          fontWeight: 'bold',
          fontSize: 18
        }}>COBERTURAS: <Text style={{ color: 'red', fontSize: 10, fontWeight: '500' }}>( de ac??rdo com seu plano )</Text></Text>
        <Text style={{
          fontSize: 17,
          fontWeight: '400',
          color: '#333333'
        }}>
          - Inc??ndio
          {`\n`}
          - Danos el??tricos
          {`\n`}
          - Perda de lucro bruto
          {`\n`}
          - Despesas fixas
          {`\n`}
          - Quebra de m??quinas e equipamentos
          {`\n`}
          - Alagamento
          {`\n`}
          - Vendaval, furac??o, ciclone, granizo e tornado
          {`\n`}
          - Roubo
          {`\n`}
          - Quebra de vidros, an??ncios luminosos e m??rmores
        </Text>
        <Text>{`\n`}</Text>
        <Text style={{
          fontWeight: 'bold',
          fontSize: 18
        }}>ASSIST??NCIA: <Text style={{ color: 'red', fontSize: 10, fontWeight: '500' }}>( de acordo com seu plano )</Text></Text>
        <Text style={{
          fontSize: 17,
          fontWeight: '400',
          color: '#333333'
        }}>
          - Substitui????o de telhas
          {`\n`}
          - Cobertura provis??ria de telhado
          {`\n`}
          - Manuten????o de portas e port??es
          {`\n`}
          - Reparos el??tricos
          {`\n`}
          - Reparoa hidra??licas
          {`\n`}
          - Reparo de central telef??nica, interfone e porteiro eletr??nico <Text style={{ fontSize: 10, color: 'red' }}>( sem imagem/v??deo )</Text>
          {`\n`}
          - Troca de vidros
          {`\n`}
          - Limpeza
          {`\n`}
          - Limpeza de caixa d`??gua
          {`\n`}
          - Servi??o de desintetiza????o e desratiza????o
          {`\n`}
          - Abertura de porta
          {`\n`}
          - Conserto de ar condicionado
          {`\n`}
          - Conserto de eletrodom??sticos <Text style={{ color: 'red', fontSize: 10 }}>( linha branca )</Text>
          {`\n`}
          - Instala????o de fechadura tetra
          {`\n`}
          - Troca de fechadura simples
          {`\n`}
          - Loca????o de microcomputadores e impressoras
          {`\n`}
          - Porteiro substituto
          {`\n`}
          - Escrit??rio provis??rio
          {`\n`}
          - Transporte e guarda m??veis
          {`\n`}
          - Vigil??ncia/seguran??a
          {`\n`}
          - Checkup empresarial
          {`\n`}
          <Text style={{ color: 'red', fontSize: 15 }}>
            - Instala????o de luzes de merg??ncia
            {`\n`}
            - Instala????o de antiderrapantes
            {`\n`}
            - Limpeza de ar condicionado
            {`\n`}
            - Verifica????o de extintores
          </Text>
        </Text>
      </View>
    ]
  },
  {
    title: 'SEGURO CONDOM??NIO',
    icon: 'city',
    tipo: 'seguro-condominio',
    inputs: [
      jsonNome({ name: 'nomeSegurado', label: 'nome' }),
      jsonRegistro({ name: 'registroSegurado', label: 'cnpj', mask: 'cnpj' }),
      jsonCelular({ name: 'celularSegurado', label: 'celular' }),
      jsonEmail({ name: 'emailSegurado', label: 'E-mail' }),
      jsonCEP({ name: 'cepImovel', label: 'cep' }),
      jsonSelect({ name: 'tipoSeguro', label: 'tipo do seguro', selects: ['novo', 'renova????o'] }),
      jsonSelect({ name: 'seguradoraSeguro', label: 'seguradora', selects: seguradoras, view: { name: 'tipoSeguro', value: 'renova????o' } }),
      jsonData({ name: 'finalVigenciaSeguro', label: 'fim da vig??ncia', view: { name: 'tipoSeguro', value: 'renova????o' } }),
    ],
    info: [
      <View>
        <Text style={{
          fontWeight: 'bold',
          fontSize: 18
        }}>SEGURO OBRIGAT??RIO:</Text>
        <Text style={{
          fontSize: 17,
          fontWeight: '400',
          color: '#333333'
        }}>
          - Lei 4.591/1964
          {`\n`}
          - Decreto Lei 73/1966
          {`\n`}
          - C??digo Civil Lei 10.406/2002
        </Text>
        <Text>{`\n`}</Text>
        <Text style={{
          fontSize: 17,
          fontWeight: '400',
          color: '#333333'
        }}>
          Vale salientar que o seguro condom??nio protege as ??reas comuns do condom??nio e n??o as resid??ncias.
          {`\n`}{`\n`}
          O seguro Residencial protege sua resid??ncia e o que h?? nela, n??o ?? obrigat??rio e deve ser contratado pelo propriet??rio ou inquilino do im??vel.
        </Text>
        <Text>{`\n`}</Text>
        <Text style={{
          fontWeight: 'bold',
          fontSize: 18
        }}>COBERTURAS OBRIGAT??RIAS:</Text>
        <Text style={{
          fontSize: 17,
          fontWeight: '400',
          color: '#333333'
        }}>
          - Inc??ndio
          {`\n`}
          - Explos??o de qualquer natureza
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
          - Danos el??tricos
          {`\n`}
          - Desmoranamento
          {`\n`}
          - Roubo de bens do condom??nio
          {`\n`}
          - Impacto de ve??culos
          {`\n`}
          - Vendaval
          {`\n`}
          - Vazamento de tanques
          {`\n`}
          - Responsabilidade civil do s??ndico
          {`\n`}
          - Responsabilidade civil do condom??nio
        </Text>
        <Text>
          {`\n`}
          <Text style={{ fontWeight: 'bold' }}>OBS:</Text> Na renova????o do seu seguro atualize as coberturas e valores
        </Text>
      </View>
    ]
  },
  /*
    {
      title: 'PREVID??NCIA SOCIAL',
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
      jsonTitle({ name: 'origemViagem', label: 'origem', placeholder: 'Origem da viagem', type: 'default' }),
      jsonTitle({ name: 'destinoViagem', label: 'destino', placeholder: 'Destino da viagem', type: 'default' }),
      jsonData({ name: 'dataIdaViagem', label: 'data da ida' }),
      jsonData({ name: 'dataRetornoViagem', label: 'data da volta' }),
      jsonSelect({ name: 'praticaEsporte', label: 'praticar?? esporte radical?', selects: ['sim', 'n??o'] }),
      jsonSelect({ name: 'utilizaraMotocicleta', label: 'utilizar?? motocicleta durante a viagem?', selects: ['sim', 'n??o'] }),
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
    info: [
      <View>
        <Text style={{
          fontSize: 17,
          fontWeight: '400',
          color: '#333333'
        }}>
          Acidente em viagem, nacional ou internacional a trabalho ou f??rias, o importante ?? ter risco totalmente coberto com uma prote????o que <Text style={{ fontWeight: 'bold' }}>CUSTA POUCO</Text> e garante imprevistos que podem ter um custo muito elevado como:
        </Text>
        <Text>{`\n`}</Text>
        <Text style={{ color: 'red', fontWeight: 'bold' }}>De acordo com seu plano:</Text>
        <Text style={{
          fontSize: 17,
          fontWeight: '400',
          color: '#333333'
        }}>
          - Despesas m??dicas e hospitalares (DMH)
          {`\n`}
          - Translado m??dico
          {`\n`}
          - Translado de corpo
          {`\n`}
          - Regresso sanit??rio
          {`\n`}
          - Morte acidental
          {`\n`}
          - Extr??vio de bagagem
          {`\n`}
          - Invalidez permanente total ou parcial por acidente
          {`\n`}
          - Assist??ncia funeral
          {`\n`}
          - Entre outras
        </Text>
      </View>
    ]
  },
];

export default array;