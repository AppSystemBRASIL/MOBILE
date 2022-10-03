import { Share } from 'react-native';

export default function compartilharAPP({ corretora, segurado }) {
  const URL = `https://${corretora?.site ? String(corretora.site).split('https://').join('').split('http://').join('').split('www.').join('') : 'seguro.appsystembrasil.com.br'}/app\n\n`;
  Share.share({
    message: `*COM ESTE APLICATIVO:*\n\n*- VOCÊ PODERÁ:*\n• Incluir seu veículo\n• Ter as informações do seu seguro\n• Telefones da sua assistência 24h\n• Tudo grátis na palma da sua mão\n\n*- VOCÊ SABERÁ:*\n*Como agir em um acidente:*\n• Sem vítimas\n• Com vítimas\n• Roubo e furto\n• Pontos e multas do seu veículo\n\n- *VOCÊ APRENDERÁ:*\n*Conceitos sobre Seguro Auto*\n• Principal condutor\n• CEP de pernoite\n• Cobertura para menores de 25 anos\n\n*- VOCÊ RECEBERÁ*\n*Atendimento diferenciado*\n• Cotações com os melhores preços\n• Sem compromisso\n• Gratuitamente\n\n*BAIXE AGORA EM SUA LOJA DE APLICATIVOS!*\n*${String(corretora.razao_social).toUpperCase()}*\n*OU CLICK NO LINK ABAIXO*\n${URL}\n\n*FUJA DA DOR DE CABEÇA*\n*Seguros seguro, só uma*\n*Seguradora pode oferecer!*`,
    url: corretora.site,
    title: corretora.razao_social
  });
};