//validacion rut

async function checkRut(rut) {
  let cuerpo = rut.substring(0, rut.length - 1);
  let dv = rut.substring(rut.length - 1).toUpperCase();
  let numeros = cuerpo.replace(/\D/g, '');
  let numeroArr = validarRut(numeros);

  if (dv == "k" || dv == "K") {
    dv = 10;
  }
  if (dv == "0") {
    dv = 11;
  }
  if (dv == numeroArr) {
    return true;
  } else {
    return false;
  }
}

function validarRut(numeros) {
  let numerosArray = numeros.split('').reverse()
  let multiplicador = 2;
  let acumulador = 0;

  for (let numero of numerosArray) {
    acumulador += parseInt(numero) * multiplicador;
    multiplicador++;
    if (multiplicador == 8) {
      multiplicador = 2;
    }
  }
  let dv = 11 - (acumulador % 11);
  return dv
}


//exportar modulos
module.exports = {
  checkRut
}
