const MATERIALES_MURO = {
  20: { cemento: 10.9, arena: 0.09, ladrillos: 90 },
  30: { cemento: 15.2, arena: 0.115, ladrillos: 120 },
};
const RENDIMIENTO_PINTURA = 6;
const EXTRA_RECORTES_PISO = 0.10;

function calcularSuperficie(ancho, largo) {
  return ancho * largo;
}

function calcularVolumen(ancho, largo, espesor) {
  return calcularSuperficie(ancho, largo) * espesor;
}

function leerNumero(datos, campo, nombre) {
  const valor = Number(String(datos[campo]).replace(',', '.'));
  if (!Number.isFinite(valor) || valor <= 0) {
    throw new Error(`"${nombre}" debe ser un número mayor que cero.`);
  }
  return valor;
}

function formato(valor, unidad, decimales = 2) {
  return Number(valor.toFixed(decimales)) + ' ' + unidad;
}

function calcularMuro(datos) {
  const materiales = MATERIALES_MURO[datos.espesor];
  if (!materiales) throw new Error('El espesor del muro debe ser 20 o 30 cm.');
  const superficie = calcularSuperficie(leerNumero(datos, 'largo', 'Largo'), leerNumero(datos, 'alto', 'Alto'));
  return [
    ['Superficie', formato(superficie, 'm²')],
    ['Cemento', formato(superficie * materiales.cemento, 'kg')],
    ['Arena', formato(superficie * materiales.arena, 'm³', 3)],
    ['Ladrillos', formato(superficie * materiales.ladrillos, 'un.', 0)],
  ];
}

function calcularViga(datos) {
  const largo = leerNumero(datos, 'largo', 'Largo de la viga');
  return [
    ['Cemento', formato(largo * 9, 'kg')],
    ['Arena', formato(largo * 0.02, 'm³', 3)],
    ['Piedra', formato(largo * 0.02, 'm³', 3)],
    ['Hierro Ø8', formato(largo * 4, 'm')],
    ['Hierro Ø4', formato(largo * 3, 'm')],
  ];
}

function calcularColumnas(datos) {
  const largo = leerNumero(datos, 'largo', 'Largo de la columna');
  return [
    ['Cemento', formato(largo * 7.5, 'kg')],
    ['Arena', formato(largo * 0.016, 'm³', 3)],
    ['Piedra', formato(largo * 0.016, 'm³', 3)],
    ['Hierro Ø10', formato(largo * 6, 'm')],
    ['Hierro Ø4', formato(largo * 3, 'm')],
  ];
}

function calcularContrapiso(datos) {
  const volumen = calcularVolumen(
    leerNumero(datos, 'ancho', 'Ancho'),
    leerNumero(datos, 'largo', 'Largo'),
    leerNumero(datos, 'espesor', 'Espesor'));
  return [
    ['Volumen', formato(volumen, 'm³', 3)],
    ['Cemento', formato(volumen * 105, 'kg')],
    ['Arena', formato(volumen * 0.45, 'm³', 3)],
    ['Piedra', formato(volumen * 0.9, 'm³', 3)],
  ];
}

function calcularTecho(datos) {
  const espesor = leerNumero(datos, 'espesor', 'Espesor');
  const superficie = calcularSuperficie(leerNumero(datos, 'ancho', 'Ancho'), leerNumero(datos, 'largo', 'Largo'));
  return [
    ['Espesor', formato(espesor, 'm')],
    ['Superficie', formato(superficie, 'm²')],
    ['Cemento', formato(superficie * 33, 'kg')],
    ['Arena', formato(superficie * 0.072, 'm³', 3)],
    ['Piedra', formato(superficie * 0.072, 'm³', 3)],
    ['Hierro Ø8', formato(superficie * 7, 'm')],
    ['Hierro Ø6', formato(superficie * 4, 'm')],
  ];
}

function calcularPisos(datos) {
  const superficie = calcularSuperficie(leerNumero(datos, 'ancho', 'Ancho'), leerNumero(datos, 'largo', 'Largo'));
  const extra = superficie * EXTRA_RECORTES_PISO;
  return [
    ['Superficie', formato(superficie, 'm²')],
    ['Extra recortes (10%)', formato(extra, 'm²')],
    ['Total a comprar', formato(superficie + extra, 'm²')],
  ];
}

function calcularPintura(datos) {
  const superficie = leerNumero(datos, 'superficie', 'Superficie del muro');
  return [
    ['Superficie a pintar', formato(superficie, 'm²')],
    ['Rendimiento', RENDIMIENTO_PINTURA + ' m² por litro'],
    ['Pintura', formato(superficie / RENDIMIENTO_PINTURA, 'L')],
  ];
}

const CALCULADORAS = {
  muro: calcularMuro,
  viga: calcularViga,
  columnas: calcularColumnas,
  contrapiso: calcularContrapiso,
  techo: calcularTecho,
  pisos: calcularPisos,
  pintura: calcularPintura,
};

function calcular(evento, nombre) {
  evento.preventDefault();
  const datos = Object.fromEntries(new FormData(evento.target));
  const lista = document.getElementById('resultados');

  try {
    const resultados = CALCULADORAS[nombre](datos);
    mostrarMensaje('');
    lista.innerHTML = resultados.map(([material, cantidad]) =>
      `<li class="result-item"><span class="result-item__label">${material}</span>` +
      `<span class="result-item__value">${cantidad}</span></li>`).join('');
  } catch (error) {
    mostrarMensaje(error.message);
  }
}
