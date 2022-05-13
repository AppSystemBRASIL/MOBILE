import { Share } from 'react-native';

export default function compartilharAPP({ corretora }) {
  Share.share({
    message: `*ENCONTRE NESTE APLICATIVO:*\n\n*SEGURO VEÍCULO:*\n*Conceitos:*\n   - Principal condutor\n   - CEP de pernoite\n   - Cobertura para menores de 25 anos\n*Como agir em um acidente:*\n   - Sem vítima\n   - Com vítima\n   - Roubo ou furto\n\n*OUTROS SEGUROS:*\n   - Saúde\n   - Vida\n   - Empresarial\n   - Viagem\n   - Previdência\n   - Residencial\n   - Condomínio\n\n*PONTOS E MULTAS*\n\n*Confiança e benefícios que só uma seguradora pode oferecer*\n\n*BAIXE AGORA*\nhttps://${corretora.site ? String(corretora.site).split('https://').join('').split('http://').join('').split('www.').join('') : 'seguro.appsystembrasil.com.br'}/app\n\n Fuja da dor de cabeça`,
    url: corretora.site,
    title: corretora.razao_social
  });
};