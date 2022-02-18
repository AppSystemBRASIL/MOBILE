function maskLetters(value) {
  return value.replace(/[0-9!@#¨!"@#$%ˆ&*()_+|}"{":?><`';/.˜\,{}$%^:/`'?><\|,[&*)(+=._-]+/g, "");
}

function maskCPF(value) {
  return value
  .replace(/\D/g, "")
  .replace(/(\d{3})(\d)/, "$1.$2")
  .replace(/(\d{3})(\d)/, "$1.$2")
  .replace(/(\d{3})(\d{1,2})/, "$1-$2")
  .replace(/(-\d{2})\d+?$/, "$1");
}

function maskCEP(value) {
  return value.replace(/\D/g, "").replace(/^(\d{5})(\d{3})+?$/, "$1-$2");
}

function maskYear(value) {
  value = String(value).replace(/\D/g, '');
  
  return String(value).slice(0, 4);
}

function maskPhone(value) {
  value=value.replace(/\D/g,"");
  value=value.replace(/^(\d{2})(\d)/g,"($1) $2");

  if(value.length === 11) {
    value=value.replace(/(\d)(\d{1})$/,"$1-$2");
  }

  if(value.length === 12) {
    value=value.replace(/(\d)(\d{2})$/,"$1-$2");
  }

  if(value.length === 13) {
    value=value.replace(/(\d)(\d{3})$/,"$1-$2");
  }

  if(value.length === 14) {
    value=value.replace(/(\d)(\d{4})$/,"$1-$2");
  }

  return String(value).slice(0, 15);
}

function maskCurrency(value) {
  value = String(value).replace(/\D/g, '');
  value = String(value).replace(/(\d)(\d{2})$/, '$1,$2');
  value = String(value).replace(/(?=(\d{3})+(\D))\B/g, '.');
  
  return String(value).length === 0 ? '' : 'R$ ' + value;
}

function maskDate(value) {
  return value
  .replace(/\D/g, "")
  .replace(/(\d{2})(\d)/, "$1/$2")
  .replace(/(\d{2})(\d)/, "$1/$2")
  .replace(/(\d{4})(\d)/, "$1");
}

function maskNumber(value) {
  return value.replace(/\D/g, "");
}

function maskPlaca(value) {
  return value;
}

export {
  maskCPF,
  maskCEP,
  maskPhone,
  maskYear,
  maskCurrency,
  maskDate,
  maskLetters,
  maskNumber,
  maskPlaca
}