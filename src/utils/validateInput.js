function validateCPF(value) {
  if (typeof value !== "string") {
    return false;
  }

  value = value.replace(/[\s.-]*/igm, '');

  if (
      !value ||
      value.length != 11 ||
      value == "00000000000" ||
      value == "11111111111" ||
      value == "22222222222" ||
      value == "33333333333" ||
      value == "44444444444" ||
      value == "55555555555" ||
      value == "66666666666" ||
      value == "77777777777" ||
      value == "88888888888" ||
      value == "99999999999" 
  ) {
    return false;
  }

  var soma = 0;
  var resto;

  for (var i = 1; i <= 9; i++) 
      soma = soma + parseInt(value.substring(i-1, i)) * (11 - i)
  resto = (soma * 10) % 11

  if((resto == 10) || (resto == 11))  {
    resto = 0;
  }

  if(resto != parseInt(value.substring(9, 10))) {
    return false;
  }

  soma = 0;

  for (var i = 1; i <= 10; i++) {
    soma = soma + parseInt(value.substring(i-1, i)) * (12 - i);
    resto = (soma * 10) % 11;
  }

  if ((resto == 10) || (resto == 11))  {
    resto = 0;
  }

  if(resto != parseInt(value.substring(10, 11))) {
    return false;
  }

  return true;
}

function validateCEP(value) {
  return /^\d{5}\-\d{3}$/.test(value);
}

function validatePhone(value) {
  return /(\(\d{2}\)\s)(\d{4,5}\-\d{4})/g.test(value);
}

function validateDate(value) {
  return /^(?:(?:31(\/|-|\.)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\/|-|\.)(?:0?[13-9]|1[0-2])\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/|-|\.)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/|-|\.)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/.test(value);
}

function validateEmail(value) {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(value).toLowerCase());
}

function validatePlaca(value) {
  const regex = /[A-Z]{3}[0-9][0-9A-Z][0-9]{2}/;
  return regex.test(String(value).toUpperCase());
}

export {
  validateCPF,
  validateCEP,
  validatePhone,
  validateDate,
  validateEmail,
  validatePlaca
}