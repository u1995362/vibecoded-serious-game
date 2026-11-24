// Configuració dels recursos gràfics.
// ACTIU: només els fons dels escenaris es carreguen com a imatges PNG.
// FUTUR: carpetes i rutes preparades, però no es fan servir encara.
const GAME_ASSETS = {
  backgrounds: {
    plaza: 'assets/backgrounds/placa.png',
    refugi: 'assets/backgrounds/refugi.png',
    treball: 'assets/backgrounds/zona_treball.png',
    pis: 'assets/backgrounds/pis_maria.png'
  },
  // Per a futures versions: no s'activen fins que s'adapti el renderitzat.
  characters: {
    jordi: 'assets/characters/jordi.png',
    laia: 'assets/characters/laia.png',
    maria: 'assets/characters/maria.png'
  },
  items: {
    thermo: 'assets/items/thermo.png',
    sensor: 'assets/items/sensor.png',
    water: 'assets/items/water.png',
    cloth: 'assets/items/cloth.png'
  }
};
