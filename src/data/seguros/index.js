import { maskCEP, maskCNPJ, maskCPF, maskCurrency, maskDate, maskLetters, maskPhone, maskPlaca, maskYear } from '../../utils/maskedInput';
import { validateCEP, validatePlaca, validateYear } from '../../utils/validateInput';
import cidades from '../cidades';
import seguradoras from '../seguradoras';

const jsonNome = ({ page, label, name, view }) => ({
  page: page || 1,
  view: view ? (value) => value[view.name] === view.value : undefined,
  name: name,
  label: label,
  placeholder: 'Nome completo',
  inputType: 'text',
  formatter: maskLetters,
  validated: (value) => !String(value).split(' ')[1],
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
  inputType: 'number',
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
  inputType: 'number',
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
  inputType: 'number',
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
  inputType: 'number',
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
  inputType: 'number',
  maxLength: 10,
  formatter: maskDate,
  validated: (value) => !validateYear(value),
  required: required,
})

const jsonSelect = ({ page, view, name, label, selects: selectsArray, infoText }) => ({
  page: page || 1,
  view: view ? (value) => value[view.name] === view.value : undefined,
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
      const estado = value.estado;

      if(estado) {
        const uf = value?.estado?.split('-')[1].split(' ').join('');
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
      jsonSelect({ name: 'profissaoSegurado', label: 'Profissão', selects: ['militar', 'professor', 'servidor público', 'médico/dentista', 'aposentado', 'empresário', 'autônomo', 'outros'] }),
      jsonSelect({ name: 'estadoCivilSegurado', label: 'estado cívil', selects: ['solteiro', 'união estável', 'casado', 'divorciado', 'viúvo'] }),
      jsonCEP({ name: 'cepSegurado', label: 'cep' }),
      jsonSelect({ name: 'dataCNHSegurado', label: 'tempo de cnh', selects: ['+10 anos', '10 anos', '9 anos', '8 anos', '7 anos', '6 anos', '5 anos', '4 anos', '3 anos', '2 anos', '1 ano', 'permissão provisória'] }),
      jsonSelect({ name: 'seguradoProprietario', label: 'o segurado é proprietário?', selects: ['sim', 'não'] }),
      jsonSelect({ name: 'principalCondutorResideMenor', label: 'o principal condutor reside com pessoas menores de 26 anos', selects: ['sim', 'não'] }),
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
      jsonNome({ name: 'nomePrincipalCondutor', label: 'nome completo', view: { name: 'principalCondutor', value: 'outra pessoa' }, page: 4 }),
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
    ]
  },
  {
    title: 'SEGURO SAÚDE',
    icon: 'heartbeat',
    tipo: 'seguro-saude',
    inputs: [
      jsonNome({ name: 'nomeSegurado', label: 'nome completo' }),
      jsonRegistro({ name: 'registroSegurado', label: 'cnpj', mask: 'cnpj' }),
      jsonCelular({ name: 'celularSegurado', label: 'celular' }),
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
    ]
  },
  {
    title: 'PLANO DE SAÚDE',
    icon: 'hand-holding-heart',
    tipo: 'plano-de-saude',
    inputs: [
      jsonNome({ name: 'nomeSegurado', label: 'nome completo' }),
      jsonCelular({ name: 'celularSegurado', label: 'celular' }),
      jsonEstado({ name: 'estadoSegurado', label: 'estado' }),
      jsonCidade({ name: 'cidadeSegurado', label: 'cidade' }),
      jsonSelect({ name: 'tipoPlanoSaude', label: 'plano', selects: ['individual', 'familiar', 'empresarial'] }),
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
  },
  {
    title: 'SEGURO DE VIDA',
    icon: 'procedures',
    tipo: 'seguro-de-vida',
    inputs: [
      jsonNome({ name: 'nomeSegurado', label: 'nome completo' }),
      jsonRegistro({ name: 'registroSegurado', label: 'cpf', mask: 'cpf' }),
      jsonCelular({ name: 'celularSegurado', label: 'celular' }),
      jsonData({ name: 'nascimentoSegurado', label: 'nascimento' }),
      jsonSelect({ name: 'profissaoSegurado', label: 'Profissão', selects: ['militar', 'professor', 'servidor público', 'médico/dentista', 'aposentado', 'empresário', 'autônomo', 'outros'] }),
      jsonMoney({ name: 'rendaMensal', label: 'renda mensal' }),
      jsonSelect({ name: 'praticaraEsporte', label: 'praticará esporte radical?', selects: ['sim', 'não'] }),
      jsonTitle({ view: { name: 'praticaraEsporte', value: 'sim' }, name: 'praticaraEsporteText', label: 'se sim, Qual?', placeholder: 'Esporte praticado', type: 'text' }),
      jsonSelect({ view: { name: 'praticaraEsporte', value: 'sim' }, name: 'praticaraEsporteFrenquencia', label: 'com qual frequência?', selects: ['até 3x/ano', 'cima 3x/ano'] }),
    ],
  },
  {
    title: 'SEGURO RESIDENCIAL',
    icon: 'home',
    tipo: 'seguro-residencial',
    inputs: [
      jsonNome({ name: 'nomeSegurado', label: 'nome completo' }),
      jsonRegistro({ name: 'registroSegurado', label: 'cpf', mask: 'cpf' }),
      jsonCelular({ name: 'celularSegurado', label: 'celular' }),
      jsonCEP({ name: 'cepImovel', label: 'cep' }),
      jsonSelect({ name: 'tipoImovel', label: 'tipo da residência', selects: ['casa', 'casa em condomínio', 'apartamento'] }),
      jsonMoney({ name: 'valorImovel', label: 'valor do imóvel', view: { name: 'tipoImovel', value: 'casa' } }),
      jsonMoney({ name: 'valorMoveis', label: 'valor dos móveis e utensílios', view: { name: 'tipoImovel', value: 'casa' } }),
      jsonMoney({ name: 'valorMoveis', label: 'valor dos móveis e utensílios', view: { name: 'tipoImovel', value: 'apartamento' } }),
      jsonSelect({ name: 'usoImovel', label: 'uso do imóvel', selects: ['moradia principal', 'temporada', 'moradia e comércio'] }),
      jsonSelect({ name: 'propriedadeImovel', label: 'propriedade do imóvel', selects: ['próprio', 'alugado'] }),
    ],
  },
  {
    title: 'SEGURO EMPRESARIAL',
    icon: 'building',
    tipo: 'seguro-empresarial',
    inputs: [
      jsonNome({ name: 'nomeSegurado', label: 'nome completo' }),
      jsonRegistro({ name: 'registroSegurado', label: 'cnpj', mask: 'cnpj' }),
      jsonCelular({ name: 'celularSegurado', label: 'celular' }),
      jsonCEP({ name: 'cepImovel', label: 'cep' }),
      jsonSelect({ name: 'tipoSeguro', label: 'tipo do seguro', selects: ['novo', 'renovação'] }),
      jsonData({ name: 'finalVigenciaSeguro', label: 'fim da vigência', view: { name: 'tipoSeguro', value: 'renovação' } }),
    ],
  },
  {
    title: 'SEGURO CONDOMÍNIO',
    icon: 'city',
    tipo: 'seguro-condominio',
    inputs: [
      jsonNome({ name: 'nomeSegurado', label: 'nome completo' }),
      jsonRegistro({ name: 'registroSegurado', label: 'cnpj', mask: 'cnpj' }),
      jsonCelular({ name: 'celularSegurado', label: 'celular' }),
      jsonCEP({ name: 'cepImovel', label: 'cep' }),
      jsonSelect({ name: 'tipoSeguro', label: 'tipo do seguro', selects: ['novo', 'renovação'] }),
      jsonData({ name: 'finalVigenciaSeguro', label: 'fim da vigência', view: { name: 'tipoSeguro', value: 'renovação' } }),
    ],
  },
  {
    title: 'PREVIDÊNCIA SOCIAL',
    icon: 'file-invoice-dollar',
    tipo: 'previdencia-social',
    inputs: [
      jsonNome({ name: 'nomeSegurado', label: 'nome completo' }),
      jsonRegistro({ name: 'registroSegurado', label: 'cpf', mask: 'cpf' }),
      jsonCelular({ name: 'celularSegurado', label: 'celular' }),
    ]
  },
  {
    title: 'SEGURO VIAGEM',
    icon: 'plane-departure',
    tipo: 'seguro-viagem',
    inputs: [
      jsonNome({ name: 'nomeSegurado', label: 'nome completo' }),
      jsonRegistro({ name: 'registroSegurado', label: 'cpf', mask: 'cpf' }),
      jsonCelular({ name: 'celularSegurado', label: 'celular' }),
      jsonSelect({ name: 'tipoViagem', label: 'tipo da viagem', selects: ['internacional', 'nacional'] }),
      jsonSelect({ name: 'meioTransporte', label: 'meio de transporte', selects: ['aereo', 'maritimo', 'aereo + maritimo'] }),
      jsonSelect({ name: 'motivoViagem', label: 'motivo da viagem', selects: ['lazer', 'estudo', 'negocios'] }),
      jsonTitle({ name: 'origemViagem', label: 'origem', placeholder: 'Origem da viagem', type: 'text' }),
      jsonTitle({ name: 'destinoViagem', label: 'destino', placeholder: 'Destino da viagem', type: 'text' }),
      jsonData({ name: 'dataIdaViagem', label: 'data da ida' }),
      jsonData({ name: 'dataRetornoViagem', label: 'data da volta' }),
      jsonSelect({ name: 'praticaraEsporte', label: 'praticará esporte radical?', selects: ['sim', 'não'] }),
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
  },
];

export default array;