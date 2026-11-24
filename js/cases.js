// Cas 02 — Es tracta de la preparació, la prevenció i el seguiment.
// Reutilitza el motor: les persones conserven claus internes estables per a les gràfiques.
window.SECOND_CASE = {
  id:'02',title:'Prepara’t abans de la calor',intro:'Una alerta anuncia temperatures extremes. Organitza l’activitat, protegeix un infant i fes seguiment d’una veïna gran.',
  rooms:[
    {id:'treball',name:'Zona de treball',temp:38,hum:36,uv:9,desc:'L’Aina treballa a l’aire lliure mentre en Pau és exposat al sol.'},
    {id:'refugi',name:'Refugi climàtic',temp:25,hum:47,uv:0,desc:'Un lloc fresc per reduir el risc i descansar.'},
    {id:'pis',name:'Pis de la Rosa',temp:34,hum:45,uv:2,desc:'Una veïna gran viu sola i necessita seguiment.'}
  ],
  people:[
    {id:'jordi',name:'Pau',age:10,emoji:'🧒',room:'treball',x:17,y:70,desc:'Vull continuar jugant aquí, però el sol pica molt.',hyd:59,temp:37.4,health:82,vuln:1.22,orientation:true,ideal:[['shade','Sortir del sol: ombra o banc sota el tendal'],['drink','Beure aigua si està alerta i pot empassar'],['monitor','Reavaluar en Pau amb 👁️ Vigilar (alerta, mareig i evolució)']]},
    {id:'laia',name:'Aina',age:34,emoji:'👩',room:'treball',x:38,y:70,desc:'Treballo a l’aire lliure; em queden hores de feina.',hyd:51,temp:37.8,health:77,vuln:1.13,orientation:true,ideal:[['forecast','Consultar l’avís de calor abans de planificar'],['plan','Adaptar l’horari, les pauses i l’aclimatació'],['rest','Descansar al banc sota el tendal (és a l’ombra)'],['drink','Beure aigua si està alerta i pot empassar'],['move','Anar caminant al refugi climàtic'],['monitor','Reavaluar l’Aina amb 👁️ Vigilar al refugi']]},
    {id:'maria',name:'Rosa',age:81,emoji:'👵',room:'pis',x:64,y:69,desc:'Visc sola. A la tarda la casa s’escalfa molt.',hyd:55,temp:37.5,health:75,vuln:1.31,orientation:true,ideal:[['blinds','Abaixar les persianes durant les hores de sol'],['contact','Acordar trucades o visites de seguiment'],['drink','Oferir aigua si està alerta i pot empassar'],['monitor','Reavaluar la Rosa amb 👁️ Vigilar i comprovar l’habitatge']]}
  ],
  spots:{
    refugi:[{id:'fan',x:18,y:59},{id:'ac',x:81,y:29},{id:'waterB',tool:'water',x:67,y:68},{id:'monitor',x:51,y:29},{id:'poster',x:48,y:22},{id:'bulletin',x:70,y:45}],
    treball:[{id:'shade',x:58,y:48},{id:'rest',x:58,y:68},{id:'sun',x:83,y:31},{id:'schedule',x:41,y:43},{id:'hat',x:17,y:49},{id:'forecast',x:25,y:34},{id:'waterD',tool:'water',x:73,y:74},{id:'waterE',tool:'water',x:28,y:82},{id:'thermoT',tool:'thermo',x:33,y:72},{id:'monitor',x:76,y:52},{id:'walk',x:85,y:64}],
    pis:[{id:'blinds',x:21,y:33},{id:'window',x:39,y:40},{id:'sensor',x:36,y:68},{id:'waterC',tool:'water',x:67,y:69},{id:'contact',x:59,y:38},{id:'monitor',x:78,y:42},{id:'leaflet',x:52,y:75},{id:'cloth',x:49,y:57}]
  },
  notes:[
    {id:'forecast',title:'Alerta i preparació',body:'Quan hi ha avisos de calor, consulta la previsió i prepara aigua, llocs frescos i una xarxa de suport. Organitza les activitats abans de les hores de més calor. Consultar l’avís abans de planificar permet adaptar les decisions a la previsió.',source:'Generalitat de Catalunya · Canal Salut',url:'https://canalsalut.gencat.cat/ca/actualitat/campanyes/calor/'},
    {id:'dizzy',title:'Activitat física i feina a l’exterior',body:'Evita o redueix l’esforç a les hores centrals, fes pauses freqüents en zones fresques, beu aigua i facilita una aclimatació progressiva a les tasques amb calor. Si apareixen mareig, debilitat o confusió, atura l’activitat i valora la gravetat.',source:'CDC · Canal Salut',url:'https://www.cdc.gov/niosh/heat-stress/about/illnesses.html'},
    {id:'traps',title:'Errors de prevenció',body:'La calor també pot ser perillosa abans d’una emergència visible. El sol directe, fer esforços sense descans i obrir finestres amb aire exterior més calent poden incrementar el risc.',source:'Canal Salut · Generalitat de Catalunya',url:'https://canalsalut.gencat.cat/ca/actualitat/campanyes/calor/'},
    {id:'home',title:'Gent gran: seguiment i habitatge',body:'Abans i durant l’episodi de calor, acorda trucades o visites amb persones que viuen soles, comprova com es troben i si poden beure, abaixa persianes durant el dia i comprova si l’habitatge es manté fresc. Si no es pot mantenir una temperatura segura, valora un refugi climàtic. El drap humit només és necessari si cal refredar una persona; no és un requisit preventiu habitual.',source:'Canal Salut · Generalitat de Catalunya',url:'https://canalsalut.gencat.cat/ca/actualitat/campanyes/calor/'}
  ]
};
