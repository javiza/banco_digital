


async function checkRut(rut) {
  let cuerpo = rut.substring(0, rut.length -1);
  let dv = rut.substring(rut.length - 1).toUpperCase();
  let numeros = cuerpo.replace(/\D/g, '');
  let numeroArr = validarRut(numeros);
  console.log(numeroArr[0])
  console.log("Rut:",rut,", cuerpo: ", cuerpo, ", digito verificador: ", dv, ", numeros limpios: ", numeros, "numeros en array: ",numeroArr)

  if(dv == "k" || dv == "K" ){
   dv = 10;
  }
  if(dv == 0 ){
    dv = 11;
  }
  if(dv == numeroArr){
    console.log("rut valido");
  }else{
    console.log("Rut invalido reingresa el rut");
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
