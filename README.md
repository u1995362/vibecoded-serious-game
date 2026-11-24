# Sobreviu l’estiu demo

Projecte educatiu amb **dos casos de deu minuts cadascun**, un menú d'elecció i tres escenaris per cas.

Aquest repo conté el codi del joc vibecodejat

Url pages
(https://u1995362.github.io/vibecoded-serious-game/)[https://u1995362.github.io/vibecoded-serious-game/]


## Instruccions

Obre `index.html` al navegador. Si el navegador impedeix carregar els PNG locals, obre una terminal en aquesta carpeta, executa `python -m http.server 8000` i visita `http://localhost:8000`.

## Casos

- **Cas 01:** Plaça del Sol, Refugi climàtic, Pis de la Maria. Manté el procediment i les mecàniques originals.
- **Cas 02:** Zona de treball, Refugi climàtic, Pis de la Rosa. En Pau, l'Aina i la Rosa practiquen prevenció, planificació i seguiment.

## Cas 02: recorreguts correctes

1. **Pau**: portar-lo a l'ombra **o al banc sota el tendal** → oferir-li aigua si està alerta i pot empassar → 👁️ Vigilar. La gorra és opcional si ja és a l'ombra; serveix per a exposicions posteriors al sol.
2. **Aina**: consultar l'**Avís de calor** → aplicar el Pla d'horaris (hores de feina, pauses, aclimatació) → descansar al banc sota el tendal → aigua → seleccionar **🚶 Anar al refugi** a la zona de treball i tocar l'Aina → al refugi, 👁️ Vigilar. **No requereix cadira de trasllat** si pot caminar amb seguretat.
3. **Rosa**: abaixar persianes → aplicar Pla de seguiment → oferir aigua si pot empassar → 👁️ Vigilar per valorar l'estat i l'ambient de la casa. El drap humit és opcional, només quan cal refredament. Si l'habitatge no es pot mantenir fresc, cal valorar un refugi climàtic.

El termòmetre i el mesurador tenen **usos il·limitats**; l'índex d'hidratació és una **dada simulada**, no una mesura clínica real.

## Estructura

- `index.html`: menú i interfície.
- `css/style.css`: estils.
- `js/game.js`: motor compartit, puntuació, inventari, moviment, salut i debug.
- `js/cases.js`: dades del Cas 02.
- `js/assets.js`: rutes de fons.
- `assets/backgrounds`: PNG renderitzats a partir dels SVG **dibuixats amb formes vectorials**; es poden substituir els PNG sense tocar el codi.
- `assets/characters` i `assets/items`: carpetes reservades per a futurs gràfics.

**Nota pedagògica:** les xifres de salut, hidratació i temperatura són indicadors de simulació, no protocols clínics. Davant de confusió, pèrdua de consciència o signes de cop de calor a la vida real, cal avisar emergències (112) i iniciar refredament mentre arriba ajuda.
