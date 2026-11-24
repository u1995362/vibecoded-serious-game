
(()=>{'use strict';
const $=id=>document.getElementById(id),clamp=(n,a,b)=>Math.min(b,Math.max(a,n)),round=n=>Math.round(n),esc=x=>String(x).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const DUR=600; // Segons reals: 10 minuts de temps de partida
let ROOMS=[{id:'plaza',name:'Plaça del Sol',temp:39,hum:33,uv:9,desc:'Sol intens i gent que necessita ajuda.'},{id:'refugi',name:'Refugi climàtic',temp:26,hum:48,uv:0,desc:'Interior preparat per rebre persones.'},{id:'pis',name:'Pis de la Maria',temp:35,hum:42,uv:3,desc:'Una casa amb les persianes obertes.'}];
let BASE=[
{id:'jordi',name:'Jordi',age:78,emoji:'👴',room:'plaza',x:44,y:68,desc:'Em trobo estrany… on soc?',hyd:44,temp:40.6,health:50,vuln:1.45,orientation:false,ideal:[['call','Avisar els serveis d’emergència'],['cool','Refredar-lo externament'],['shade','Apartar-lo del sol'],['monitor','Vigilar-lo fins que arribi ajuda']]},
{id:'laia',name:'Laia',age:32,emoji:'👩',room:'plaza',x:69,y:70,desc:'Em marejo, suo molt. Puc parlar.',hyd:46,temp:38.2,health:70,vuln:1,orientation:true,ideal:[['rest','Aturar l’activitat i descansar'],['move','Arribar a un lloc més fresc'],['drink','Hidratar-se si pot empassar'],['monitor','Controlar l’evolució']]},
{id:'maria',name:'Maria',age:83,emoji:'👵',room:'pis',x:64,y:68,desc:'Tinc molta set. Aquí dins fa calor.',hyd:52,temp:37.7,health:67,vuln:1.28,orientation:true,ideal:[['blinds','Bloquejar el sol amb les persianes'],['drink','Oferir aigua si pot empassar'],['coolhome','Refrescar la casa o la persona'],['monitor','Fer seguiment de la persona vulnerable']]}
];
const ITEMS={walk:{icon:'🚶',name:'Anar al refugi',kind:'actuador',fixed:true,uses:Infinity,help:'Cas 02: selecciona Anar al refugi i després l’Aina. No cal cadira si pot caminar amb seguretat.'},hat:{icon:'🧢',name:'Gorra de protecció',kind:'actuador',fixed:false,uses:1,help:'Opcional: protegeix el cap quan s’ha de sortir al sol. Si en Pau ja és a l’ombra, no cal per superar el cas.'},schedule:{icon:'📅',name:'Pla d’horaris',kind:'actuador',fixed:false,uses:1,help:'Planifica les activitats exigents fora de les hores més caloroses.'},contact:{icon:'📞',name:'Pla de seguiment',kind:'actuador',fixed:false,uses:1,help:'Acorda trucades i visites amb una persona gran que viu sola.'},forecast:{icon:'📰',name:'Avís de calor',kind:'informacio',note:'forecast',fixed:false,uses:Infinity,help:'Consulta la previsió i prepara les mesures.'},thermo:{icon:'🌡️',name:'Termòmetre',kind:'evidencia',fixed:false,uses:Infinity,help:'∞ Usos il·limitats. Mostra una temperatura corporal SIMULADA.'},sensor:{icon:'🩺',name:'Mesurador',kind:'evidencia',fixed:false,uses:Infinity,help:'∞ Usos il·limitats. Mostra un índex d’hidratació SIMULAT, no una mesura clínica.'},chair:{icon:'♿',name:'Cadira de trasllat',kind:'actuador',fixed:false,uses:2,help:'Només hi ha dos trasllats disponibles.'},phone:{icon:'📱',name:'Telèfon d’emergència',kind:'actuador',fixed:false,uses:Infinity,help:'Contacta el 112 davant una possible emergència.'},water:{icon:'💧',name:'Aigua fresca',kind:'actuador',fixed:false,uses:1,help:'Només si la persona està alerta i pot empassar.'},cloth:{icon:'🧊',name:'Drap humit',kind:'actuador',fixed:false,uses:1,help:'Refreda la pell amb aigua fresca.'},coffee:{icon:'☕',name:'Cafè',kind:'trampa',fixed:false,uses:1,help:'Beguda disponible. Prova de decidir quan convé utilitzar-la.'},pill:{icon:'💊',name:'Pastilles',kind:'trampa',fixed:false,uses:1,help:'Producte disponible. Valora si és adequat per al cas.'},manual:{icon:'📕',name:'Protocol de cop de calor',kind:'informacio',note:'alarm',fixed:false,uses:Infinity,help:'Es llegeix en recollir-lo: s’arxiva al quadern.'},poster:{icon:'📋',name:'Pòster del mareig',kind:'informacio',note:'dizzy',fixed:false,uses:Infinity,help:'Fitxa informativa permanent sobre mareig i esgotament.'},bulletin:{icon:'🗞️',name:'Butlletí de prevenció',kind:'informacio',note:'traps',fixed:false,uses:Infinity,help:'Errors freqüents i com evitar-los.'},leaflet:{icon:'📗',name:'Full de cura de gent gran',kind:'informacio',note:'home',fixed:false,uses:Infinity,help:'Consells permanents per protegir gent gran.'},fan:{icon:'🌀',name:'Ventilador de paret',kind:'actuador',fixed:true,uses:Infinity,help:'Refreda l’ambient i totes les persones de l’habitació.'},ac:{icon:'❄️',name:'Aire condicionat',kind:'actuador',fixed:true,uses:Infinity,help:'Redueix la temperatura ambient del refugi.'},blinds:{icon:'🪟',name:'Persianes',kind:'actuador',fixed:true,uses:Infinity,help:'Eviten l’entrada de radiació solar a casa.'},window:{icon:'🌬️',name:'Finestra',kind:'actuador',fixed:true,uses:Infinity,help:'Pots obrir o tancar la finestra.'},shade:{icon:'🌳',name:'Ombra del parc',kind:'actuador',fixed:true,uses:Infinity,help:'Lloc fresc del mateix escenari; afecta les persones properes.'},sun:{icon:'☀️',name:'Zona de sol',kind:'trampa',fixed:true,uses:Infinity,help:'Una zona del parc on pots situar persones.'},rest:{icon:'🪑',name:'Banc',kind:'actuador',fixed:true,uses:Infinity,help:'Permet descansar a l’ombra.'},monitor:{icon:'👁️',name:'Vigilar',kind:'actuador',fixed:true,uses:Infinity,help:'Reavaluar: comprovar consciència, mareig, hidratació, exposició i evolució després de prendre mesures.'}};
let SPOTS={
plaza:[{id:'shade',x:16,y:40},{id:'rest',x:25,y:69},{id:'sun',x:84,y:33},{id:'phone',x:30,y:55},{id:'cloth',x:38,y:68},{id:'waterA',tool:'water',x:64,y:67},{id:'coffee',x:71,y:48},{id:'thermo',x:53,y:72},{id:'manual',x:58,y:36}],
refugi:[{id:'fan',x:18,y:59},{id:'ac',x:81,y:29},{id:'waterB',tool:'water',x:66,y:68},{id:'monitor',x:51,y:30},{id:'pill',x:39,y:68},{id:'poster',x:48,y:22},{id:'bulletin',x:68,y:45}],
pis:[{id:'blinds',x:21,y:33},{id:'window',x:39,y:40},{id:'sensor',x:36,y:68},{id:'waterC',tool:'water',x:67,y:68},{id:'monitor',x:78,y:42},{id:'leaflet',x:51,y:71}]
};
let NOTES=[
{id:'alarm',title:'Cop de calor: emergència',body:'La confusió, una conducta estranya, la pèrdua de consciència o una temperatura corporal molt alta poden indicar un cop de calor. Demana ajuda mèdica urgent (112), aparta la persona de la calor i comença a refredar-la amb aigua fresca i ventilació. Si està confusa, no li donis líquids per boca.',source:'Canal Salut · Hospital de Bellvitge · CDC',url:'https://canalsalut.gencat.cat/ca/vida-saludable/consells-estacionals/estiu/calor/efectes-exces/index.html'},
{id:'dizzy',title:'Mareig o esgotament per calor',body:'Atura l’activitat. Ajuda la persona a descansar en un lloc fresc, afluixa la roba, refresca la pell i observa-la. Si està plenament conscient i pot empassar, pot beure aigua en petits glops. Si empitjora, es desorienta, perd el coneixement o no millora, demana assistència mèdica.',source:'Canal Salut · Mayo Clinic · CDC',url:'https://www.cdc.gov/niosh/heat-stress/about/illnesses.html'},
{id:'home',title:'Protecció de persones vulnerables',body:'Les persones grans i les que tenen malalties cròniques són especialment vulnerables. Comprova sovint com estan; facilita aigua si poden beure; mantén la casa fresca tancant persianes durant el dia i ventilant en hores més fresques. Identifica refugis climàtics.',source:'Generalitat de Catalunya · Canal Salut',url:'https://canalsalut.gencat.cat/ca/actualitat/campanyes/calor/'},
{id:'traps',title:'Errors freqüents',body:'No forcis a beure algú confús o inconscient. No substitueixis el refredament i l’ajuda mèdica per pastilles. Evita incrementar l’exposició al sol i obrir finestres si l’aire exterior és molt més calent. Davant signes greus, prioritat a emergències.',source:'Canal Salut · CDC',url:'https://www.cdc.gov/niosh/heat-stress/about/illnesses.html'}
];
const CASE_ONE={rooms:JSON.parse(JSON.stringify(ROOMS)),people:JSON.parse(JSON.stringify(BASE)),spots:JSON.parse(JSON.stringify(SPOTS)),notes:JSON.parse(JSON.stringify(NOTES))};
let currentCase='01';
function configureCase(id){
 currentCase=id;
 const data=id==='02'?window.SECOND_CASE:CASE_ONE;
 ROOMS=JSON.parse(JSON.stringify(data.rooms));BASE=JSON.parse(JSON.stringify(data.people));SPOTS=JSON.parse(JSON.stringify(data.spots));NOTES=JSON.parse(JSON.stringify(data.notes));
 $('caseSubtitle').textContent=id==='02'?'CAS 02 · Prepara’t abans de la calor':'CAS 01 · La ciutat sota una onada de calor';
 $('missionText').textContent=id==='02'?'Consulta l’avís, adapta la feina, protegeix en Pau i comprova la situació de la Rosa. Reavalua les tres persones en 10 minuts.':'Identifica els símptomes, localitza els estris i estabilitza les tres persones en deu minuts reals.';
 $('howtoCase').textContent='CAS '+id+' · TUTORIAL';
 $('howtoLead').innerHTML=id==='02'?'Tens <strong>10 minuts</strong> per prevenir els riscos: ajuda una criatura, una treballadora i una veïna gran.':'Tens <strong>10 minuts</strong> per protegir tres persones d’una onada de calor. Explora, investiga i decideix.';
 $('notebookHint').textContent=id==='02'?'L’avís de calor és necessari per planificar les tasques de l’Aina. Els indicadors de salut i hidratació són simulats.':'Els documents trobats es poden consultar tota la partida.';
 $('howtoTransportText').textContent=id==='02'?'A la zona de treball, toca 🚶 Anar al refugi i després l’Aina: pot caminar si està orientada i es mou amb seguretat. La cadira es reserva per a qui la necessita.':'Aplica la cadira de la motxilla a una persona i canvia de sala. Només tens dos trasllats.';
 $('chartLegend').textContent=BASE.map((p,i)=>'● '+p.name+' · '+['verd','groc','blau'][i]).join('   ')+' · valors simulats visibles només al debug';
 lastRenderedRoom=null;
}
let s,tick,drag=null,suppress=false,metric='health';
function state(){return {room:0,minutes:DUR,elapsed:0,lastTick:0,score:0,ended:false,paused:false,selected:null,targeting:null,carrying:null,focused:null,positionTarget:null,attempts:0,errors:0,hints:0,streak:0,difficulty:2,grade:'Normal',wonBefore:false,stock:{chair:currentCase==='01'?2:0},collected:{},roomFlags:{plaza:{shade:false},refugi:{fan:false,ac:false},treball:{shade:false},pis:{blinds:false,window:false}},roomTemps:Object.fromEntries(ROOMS.map(r=>[r.id,r.temp])),notes:{},activeNote:null,logs:[],history:[],people:BASE.map(p=>({...p,seen:{temp:false,hyd:false},inspected:false,done:{},cooled:false,protected:false,rested:false,placement:null,called:false,complete:false,health0:p.health,temperature0:p.temp,hyd0:p.hyd}))}};
function formatClock(seconds){const sec=Math.max(0,Math.ceil(seconds));return String(Math.floor(sec/60)).padStart(2,'0')+':'+String(sec%60).padStart(2,'0')}
function person(id){return s.people.find(p=>p.id===id)}function room(){return ROOMS[s.room]}function peopleHere(){return s.people.filter(p=>p.room===room().id)}function count(){return s.people.filter(p=>p.complete).length}function shownSeconds(){return s.elapsed}
function notify(text,type='neutral'){let el=$('message');el.textContent=text;el.className='message '+(type==='bad'?'bad':type==='good'?'good':'')}
function log(text,good=true){s.logs.unshift({minute:Math.round(shownSeconds()),good,text});s.logs=s.logs.slice(0,160)}
function snapshot(tag='temps'){s.history.push({t:shownSeconds(),tag,people:s.people.map(p=>({id:p.id,health:+p.health.toFixed(2),hyd:+p.hyd.toFixed(2),temp:+p.temp.toFixed(2),room:p.room}))})}
function adjustDifficulty(){const old=s.difficulty;const performance=s.errors*1.6+s.hints*.85+s.elapsed/85-count()*1.6;const goal=clamp(2.3-performance/5,1,3.8);s.difficulty=+(s.difficulty*.78+goal*.22).toFixed(2);s.grade=s.difficulty<1.6?'Més ajuda':s.difficulty>2.7?'Repte alt':'Normal'; if(Math.abs(old-s.difficulty)>.35)log('Dificultat adaptativa: '+s.grade);}
function mark(p,key){if(!p.done[key]){p.done[key]=true;s.score+=100;log('Acció ideal per a '+p.name+': '+(p.ideal.find(x=>x[0]===key)?.[1]||key));return true}return false}
function outcome(text,good=true,minutes=1,penalty=0){s.attempts++;if(good){s.streak++;s.score+=20}else{s.errors++;s.streak=0;s.score=Math.max(0,s.score-25);if(penalty){for(const p of peopleHere()){if(!p.complete)p.health=clamp(p.health-penalty,0,100)}}}log((good?'✓ ':'✗ ')+text,good);notify(text,good?'good':'bad');snapshot('accio');adjustDifficulty();check();render();}
function advance(dt=1){if(s.ended||s.paused)return;s.elapsed=Math.min(DUR,s.elapsed+dt);s.minutes=Math.max(0,DUR-s.elapsed);const min=dt/9;const severity=0.9+(s.difficulty-2)*.17;
for(const p of s.people){if(p.complete)continue;const t=s.roomTemps[p.room],hot=t>=35?1:t>=30?.55:t>=27?.25:-.23;const shield=p.protected?.52:1;const load=Math.max(0,hot)*p.vuln*shield*severity;
p.hyd=clamp(p.hyd-load*.42*min,0,100);p.temp=clamp(p.temp+(hot*.033*p.vuln*shield-(p.cooled?.09:0))*min,35.7,43);let drain=p.temp>=40?.9*p.vuln:p.temp>=38.4?.35*p.vuln:.10*p.vuln;const cooling=(t<28?.23:0)+(p.cooled?.34:0)+(p.rested?.07:0);p.health=clamp(p.health+min*(cooling-drain*severity),0,100)}
adjustDifficulty();snapshot();check();if(!s.ended)renderLive();}
function check(){for(const p of s.people){if(p.complete)continue;const all=p.ideal.every(([k])=>p.done[k]);const ok=currentCase==='02'?(p.hyd>=58&&p.temp<=38.3&&p.health>=45):(p.id==='jordi'?p.called&&p.cooled&&p.temp<=40.45&&p.health>=18:p.id==='laia'?p.hyd>=60&&p.temp<=38.4&&p.health>=48:p.hyd>=60&&p.temp<=38.35&&p.health>=45);
if(all&&ok){p.complete=true;p.health=clamp(p.health+5,0,100);s.score+=250;log('★ '+p.name+' estabilitzat/da');notify(p.name+' ha quedat estabilitzat/da. Continua amb les altres persones.','good')}}
if(count()===3)return finish(true,'Has estabilitzat les tres persones aplicant els procediments adequats.');if(s.people.some(p=>p.health<=0))return finish(false,'Una persona ha arribat a un llindar crític de salut simulada.');if(s.minutes<=0)finish(false,'El temps del cas s’ha esgotat.');}
function finish(won,text){if(s.ended)return;s.ended=true;clearInterval(tick);const difficultyChange=won?(s.errors<=2&&s.minutes>=95?+.45:s.errors>=5?-.30:+.05):-.65;s.difficulty=clamp(s.difficulty+difficultyChange,1,4);s.grade=won?'Cas superat':'Cas no superat';$('endTitle').textContent=won?'🏆 Cas superat':'⏳ Cas finalitzat';$('endText').textContent=(currentCase==='02'?'Cas 02 · ':'Cas 01 · ')+text;$('endStats').textContent=`${count()}/3 persones · ${s.score} punts · ${formatClock(shownSeconds())} transcorreguts · ${s.errors} errors · ${s.hints} pistes.`;$('endDifficulty').textContent=won?'Has superat el cas. Dificultat suggerida per al següent nivell: '+(s.difficulty>=2.6?'més elevada':s.difficulty<1.7?'amb més suport':'similar')+'.':'El sistema adaptaria el següent intent amb més ajuda i menys penalitzacions.';render();$('ending').showModal();}
function reset(){clearInterval(tick);ROOMS.forEach(r=>{r.temp=(currentCase==='02'?window.SECOND_CASE:CASE_ONE).rooms.find(x=>x.id===r.id).temp});s=state();$('ending').close?.();snapshot('inici');notify('');render();s.lastTick=performance.now();tick=setInterval(()=>{const now=performance.now(),dt=Math.max(0,(now-s.lastTick)/1000);s.lastTick=now;if(!s.paused&&!s.ended)advance(dt)},250)}
function unlock(id,verbose=true){if(!s.notes[id]){s.notes[id]=true;s.score+=45;log('★ +45 punts · Document informatiu descobert: '+NOTES.find(n=>n.id===id).title);if(verbose)notify('📘 Nou procediment permanent: '+NOTES.find(n=>n.id===id).title+'. Consulta el quadern.','good')}s.activeNote=id;renderNotes()}
function collect(id){if(s.ended||s.paused)return;const o=SPOTS[room().id].find(x=>x.id===id);if(!o||s.collected[id])return;const tool=o.tool||o.id;if(ITEMS[tool].fixed)return interactFixed(tool);s.collected[id]=true;if(ITEMS[tool].kind!=='informacio')s.stock[tool]=(s.stock[tool]||0)+(tool==='water'?1:tool==='cloth'?2:1);if(ITEMS[tool].kind==='informacio'){unlock(ITEMS[tool].note);if(currentCase==='02'&&tool==='forecast'){mark(person('laia'),'forecast');log('Avís consultat: es poden adaptar els horaris de l’Aina a la previsió.')} log('Font consultada: '+ITEMS[tool].name);notify((currentCase==='02'&&tool==='forecast'?'📖 +145 punts! Avís consultat i planificació desbloquejada: ':'📖 +45 punts! Informació permanent al quadern: ')+ITEMS[tool].name+'.','good');render();return}log('Trobat al mapa: '+ITEMS[tool].name);notify('Objecte recollit: '+ITEMS[tool].name+'. Arrossega’l sobre una persona o toca’l a la motxilla.','good');render()}
function use(item,id){if(s.ended||s.paused)return;const p=person(id),i=ITEMS[item];if(!p||p.room!==room().id)return; if(!i)return; s.selected=null;if(!i.fixed&&!(s.stock[item]>0))return outcome('L’objecte està esgotat.',false,1);if(i.fixed)return ['rest','monitor'].includes(item)?applyFixedToPerson(item,id):interactFixed(item);if(p.complete)return outcome(p.name+' ja està estabilitzat/da: no cal gastar recursos.',false,1);
if(item==='thermo'){const first=!p.seen.temp;p.seen.temp=true;if(first){s.score+=35;log('★ +35 punts · Primera mesura de temperatura de '+p.name)}notify((first?'🌡️ +35 punts! ':'')+p.name+': '+p.temp.toFixed(1)+' °C (valor simulat). La temperatura ja apareix sobre el cap.','good');log('Termòmetre aplicat a '+p.name);snapshot('diagnostic');render();return}
if(item==='sensor'){const first=!p.seen.hyd;p.seen.hyd=true;if(first){s.score+=35;log('★ +35 punts · Primera anàlisi d’hidratació de '+p.name)}notify((first?'🩺 +35 punts! ':'')+p.name+': índex d’hidratació simulat '+round(p.hyd)+' %. No és una prova clínica.','good');log('Mesurador aplicat a '+p.name);snapshot('diagnostic');render();return}

if(currentCase==='02'&&item==='hat'){
 if(p.id!=='jordi')return notify('En aquest cas, la gorra està pensada per a en Pau. També pots protegir-lo directament a l’ombra.');
 if(p.hatUsed)return notify('En Pau ja porta una gorra.');
 s.stock.hat--;p.hatUsed=true;p.health=clamp(p.health+1,0,100);s.score+=15;
 return outcome('Gorra posada a en Pau: és una protecció addicional per quan torni a sortir al sol. Si ja és sota el tendal, no calia per completar l’objectiu.',true,1)
}
if(currentCase==='02'&&item==='schedule'){
 if(p.id!=='laia')return notify('El pla d’horaris està destinat a la feina d’exterior de l’Aina.');
 if(!p.done.forecast)return notify('Abans de reorganitzar les tasques, consulta l’AVÍS DE CALOR de la zona de treball. Així podràs adaptar l’horari al risc previst.');
 s.stock.schedule--;
 if(p.done.plan)return outcome('Ja has reorganitzat les hores de més calor.',false,1);
 p.protected=true;p.health=clamp(p.health+3,0,100);mark(p,'plan');return outcome('Aina: feina intensa fora de les hores de més calor, pauses en ombra, aigua disponible i aclimatació progressiva prevista.',true,1)
}
if(currentCase==='02'&&item==='contact'){
 if(p.id!=='maria')return notify('El pla de contacte és per a la veïna que viu sola.');s.stock.contact--;
 if(p.done.contact)return outcome('Ja hi ha un pla de seguiment acordat.',false,1);
 mark(p,'contact');return outcome('Has acordat trucades i visites per comprovar l’estat de la Rosa durant l’alerta.',true,1)
}
if(item==='chair'){if(currentCase==='02')return notify('L’Aina pot caminar si es troba orientada i es mou amb seguretat. Fes servir 🚶 Anar al refugi, a la zona de treball.');if(s.stock.chair<=0)return outcome('La cadira no té moviments disponibles.',false,1);s.carrying=p.id;notify('♿ '+p.name+' és preparat/da per al trasllat. Fes servir una fletxa per canviar d’habitació.','good');render();return}
if(item==='phone'){if(p.id==='jordi'&&currentCase==='01'){if(p.done.call)return outcome('Ja has avisat el 112: repetir-ho fa perdre temps.',false,1);p.called=true;mark(p,'call');return outcome('112 avisat per possible cop de calor. Refreda en Jordi mentre arriba ajuda.',true,1)}return outcome('Trucada innecessària en aquest context simulat: primer valora els símptomes. Si apareixen signes de gravetat, truca a emergències.',false,2)}
if(item==='water'){s.stock.water--;if(!p.orientation){p.health=clamp(p.health-7,0,100);return outcome('Has donat aigua a una persona confusa! Risc d’ennuegament: acció incorrecta.',false,2)}if(p.done.drink)return outcome('Has gastat aigua extra sense necessitat. Millor repartir els recursos.',false,1);p.hyd=clamp(p.hyd+27,0,100);p.health=clamp(p.health+5,0,100);mark(p,'drink');return outcome('Has ofert aigua a '+p.name+', que està orientat/da i pot empassar.',true,1)}
if(item==='cloth'){s.stock.cloth--;p.cooled=true;p.temp=clamp(p.temp-.75,35.7,43);p.health=clamp(p.health+4,0,100);if(p.id==='jordi'&&currentCase==='01')mark(p,'cool');if(p.id==='maria'&&currentCase==='01')mark(p,'coolhome');return outcome('Drap fresc aplicat a '+p.name+'. Has iniciat el refredament extern.',true,1)}
if(item==='coffee'){s.stock.coffee--;p.hyd=clamp(p.hyd-5,0,100);p.health=clamp(p.health-5,0,100);return outcome('el cafè no substitueix l’aigua ni el refredament en aquesta situació.',false,2)}
if(item==='pill'){s.stock.pill--;p.health=clamp(p.health-4,0,100);return outcome('les pastilles no són el tractament del cop de calor. Cal refredament i atenció mèdica.',false,2)}
}
function interactFixed(item){if(s.ended||s.paused)return;const r=room().id; if(!SPOTS[r].some(o=>o.id===item))return outcome('Aquest equipament és fix i només es pot utilitzar a la seva habitació.',false,1);const flags=s.roomFlags[r];
if(item==='shade'||item==='rest'||item==='sun')return selectZone(item);
if(item==='walk'){if(currentCase!=='02'||r!=='treball')return notify('Aquesta ruta caminant només s’utilitza al Cas 02, a la zona de treball.');s.selected=null;s.targeting=s.targeting===item?null:item;notify(s.targeting?'🚶 Ruta al refugi seleccionada. Toca l’Aina per acompanyar-la caminant si es troba orientada i es pot moure amb seguretat.':'Ruta al refugi deseleccionada.');render();return}
if(item==='monitor'){s.selected=null;s.targeting=s.targeting===item?null:item;notify(s.targeting?'Selecciona a qui vols aplicar «'+ITEMS[item].name+'». Pots tocar diferents persones una rere l’altra, o arrossegar l’objecte sobre elles. Torna a tocar l’objecte per sortir.':'Selecció de persones cancel·lada.');render();return}
// La zona de sol és una destinació individual, no una penalització global.
if(item==='fan'){if(flags.fan)return outcome('El ventilador ja està en marxa.',false,1);flags.fan=true;for(const p of peopleHere()){p.cooled=true;p.temp=clamp(p.temp-.35,35.7,43);p.health=clamp(p.health+2,0,100);if(p.id==='maria')mark(p,'coolhome');if(p.id==='jordi')mark(p,'cool')}return outcome('Ventilador encès: efecte per a TOTES les persones del refugi. Amb molta calor no substitueix la refrigeració activa.',true,1)}
if(item==='ac'){if(flags.ac)return outcome('L’aire condicionat ja funciona.',false,1);flags.ac=true;s.roomTemps.refugi=23;for(const p of peopleHere()){p.protected=true;p.temp=clamp(p.temp-.4,35.7,43);p.health=clamp(p.health+2,0,100);if(p.id==='maria')mark(p,'coolhome')}return outcome('Aire condicionat en marxa. Refredes l’espai i totes les persones presents.',true,1)}
if(item==='blinds'){if(flags.blinds)return outcome('Les persianes ja estan abaixades.',false,1);flags.blinds=true;s.roomTemps.pis=30;for(const p of peopleHere()){p.protected=true;p.temp=clamp(p.temp-.25,35.7,43);if(p.id==='maria')mark(p,'blinds')}return outcome('Persianes abaixades: menys sol i menys calor per a TOTES les persones del pis.',true,1)}
if(item==='window'){flags.window=!flags.window;if(flags.window){s.roomTemps.pis+=4;for(const p of peopleHere()){p.health=clamp(p.health-3,0,100);p.temp=clamp(p.temp+.22,35.7,43)}return outcome('has obert la finestra amb 39 °C a fora. L’habitatge s’escalfa.',false,2)}s.roomTemps.pis-=4;return outcome('Has tancat la finestra i evitat que entri aire més calent.',true,1)}

}
function applyFixedToPerson(item,id){
 if(s.ended||s.paused)return;
 const p=person(id);
 if(!p||p.room!==room().id)return notify('Aquesta persona no és en aquesta habitació.');
 if(!SPOTS[room().id].some(o=>(o.tool||o.id)===item))return notify('Aquest objecte és fix en una altra habitació.');
 s.focused=id;
 if(item==='rest'||item==='shade'||item==='sun')return takeToZone(id,item);
 if(item==='walk'){
   if(currentCase!=='02'||room().id!=='treball'||p.id!=='laia')return notify('Aquesta ruta a peu està prevista per a l’Aina des de la zona de treball.');
   if(!p.orientation)return outcome('No traslladis caminant una persona desorientada: cal valorar l’estat i demanar ajuda.',false,1);
   if(!p.done.plan||!p.done.rest)return notify('Abans del trasllat, consulta l’avís, adapta l’horari i deixa descansar l’Aina sota el tendal.');
   if(p.done.move)return notify('L’Aina ja ha arribat al refugi.');
   p.room='refugi';p.protected=true;p.temp=clamp(p.temp-.25,35.7,43);shiftPerson(p,'refugi');
   s.room=ROOMS.findIndex(r=>r.id==='refugi');s.selected=null;s.targeting=null;s.positionTarget=null;s.focused=p.id;
   mark(p,'move');return outcome('L’Aina ha arribat caminant al refugi, acompanyada i en condicions de seguretat. No has gastat cap cadira.',true,1);
 }
 if(item==='monitor'){
  if(p.done.monitor)return outcome('Ja has registrat el seguiment de '+p.name+'.',false,1);
  const ready=currentCase==='02'?(p.id==='jordi'?p.done.shade&&p.done.drink:p.id==='laia'?p.done.forecast&&p.done.plan&&p.done.rest&&p.done.move&&p.done.drink:p.done.blinds&&p.done.contact&&p.done.drink):(p.id==='jordi'?p.done.call&&p.done.cool:p.id==='laia'?p.done.rest&&p.done.drink:p.done.blinds);
  if(!ready)return outcome('Encara no pots completar el seguiment de '+p.name+': consulta les accions ideals pendents al debug. Després toca 👁️ Vigilar i selecciona la persona.',false,1);
  if(currentCase==='02'&&p.id==='maria'&&s.roomTemps.pis>30)return notify('La casa continua massa calenta. Abaixa les persianes i comprova si cal anar a un refugi climàtic.');
  mark(p,'monitor');return outcome('Reavaluació de '+p.name+': conscient, sense nous signes d’alarma en aquesta simulació. Has comprovat l’evolució després de les mesures. Si apareixen confusió, desmai o empitjorament, cal ajuda urgent (112).',true,1);
 }
}
function clickPerson(id){if(s.carrying)return notify('Ja tens una persona preparada per traslladar. Utilitza una fletxa o cancel·la.');if(s.selected){const i=s.selected;return use(i,id)}if(s.targeting)return ['shade','rest'].includes(s.targeting)?takeToZone(id,s.targeting):applyFixedToPerson(s.targeting,id);if(s.positionTarget===id){s.positionTarget=null;render();return notify('Moviment cancel·lat.')}if(s.positionTarget){s.positionTarget=id;render();return notify('Persona seleccionada: '+person(id).name+'. Ara toca el banc, l’ombra o la zona de sol.');}const p=person(id);s.focused=id;s.positionTarget=id;const firstInspection=!p.inspected;if(firstInspection){p.inspected=true;s.score+=20;log('★ +20 punts · Primera observació de '+p.name)}if(currentCase==='01'&&p.id==='jordi'&&p.done.call&&p.done.cool&&!p.done.monitor){mark(p,'monitor');outcome('Has comprovat la resposta d’en Jordi mentre esperes els serveis d’emergència.',true,1);return}notify((firstInspection?'👁️ +20 punts! ':'')+p.name+', '+p.age+' anys: «'+p.desc+'». Salut visible: '+round(p.health)+' %. '+(['plaza','treball'].includes(p.room)?'Pots col·locar-la en una zona d’ombra o descans. ':'')+(p.seen.temp?'Temperatura: '+p.temp.toFixed(1)+' °C. ':'Cal termòmetre. ')+(p.seen.hyd?'Hidratació: '+round(p.hyd)+' %.':'Cal mesurador.'));render()}
// Posicions persistents de cada personatge. Les reserves impedeixen solapaments.
const PLACE_SLOTS={
 plaza:{rest:[[39,73],[47,81]],shade:[[15,72],[32,57],[22,85]],sun:[[75,69],[87,78],[68,82]],general:[[45,68],[69,70],[56,77],[77,57]]},
 refugi:{general:[[36,67],[60,68],[79,70],[46,82],[68,83]]},
 treball:{rest:[[54,74],[67,74]],shade:[[53,70],[63,63]],sun:[[80,71],[86,80]],general:[[37,70],[61,77],[75,70]]},
 pis:{general:[[60,67],[76,68],[44,79],[61,83]]}
};
function positionOccupied(roomId,x,y,except){return s.people.some(p=>p.id!==except&&p.room===roomId&&Math.abs(p.x-x)<15&&Math.abs(p.y-y)<15)}
function freePosition(roomId,zone,personId){const slots=PLACE_SLOTS[roomId]?.[zone]||PLACE_SLOTS[roomId]?.general||[[45,68],[65,68]];return slots.find(([x,y])=>!positionOccupied(roomId,x,y,personId))||slots.reduce((a,b)=>{const near=v=>s.people.filter(p=>p.id!==personId&&p.room===roomId).reduce((m,p)=>Math.min(m,Math.hypot((p.x-v[0])*0.72,p.y-v[1])),Infinity);return near(b)>near(a)?b:a},slots[0]);}
function shiftPerson(p,roomId,zone='general'){const [x,y]=freePosition(roomId,zone,p.id);p.x=x;p.y=y;p.placement=zone==='general'?null:zone;}
function takeToZone(personId,zone){
 if(s.ended||s.paused)return;
 const p=person(personId),id=room().id;
 if(!p||p.room!==id)return;
 if(!['plaza','treball'].includes(id)||!['shade','rest','sun'].includes(zone))return notify('Aquesta zona no és accessible en aquesta habitació.');
 s.selected=null;s.targeting=null;s.positionTarget=null;s.focused=p.id;
 if(zone==='rest'){
  if(p.placement==='rest'&&p.rested)return notify(p.name+' ja està descansant al banc.');
  p.rested=true;p.protected=true;p.temp=clamp(p.temp-.18,35.7,43);p.health=clamp(p.health+2,0,100);
  if(p.id==='laia')mark(p,'rest');if(currentCase==='02'&&p.id==='jordi')mark(p,'shade');
  shiftPerson(p,id,'rest');return outcome(p.name+(id==='treball'?' descansa sota el tendal.':' descansa al banc, sota l’arbre.')+' Ara pots veure on s’ha assegut.',true,1);
 }
  if(zone==='sun'){
   if(p.placement==='sun')return notify(p.name+' ja és a la zona de sol.');
   p.protected=false;p.rested=false;p.cooled=false;
   p.temp=clamp(p.temp+.28,35.7,43);
   p.health=clamp(p.health-5*p.vuln,0,100);
   p.hyd=clamp(p.hyd-3,0,100);
   shiftPerson(p,id,'sun');
   return outcome('Has situat '+p.name+' sota el sol. La temperatura puja i la salut empitjora.',false,2);
  }
 if(p.protected&&(p.placement==='shade'||p.placement==='rest')){if(currentCase==='02'&&p.id==='jordi'&&!p.done.shade){mark(p,'shade');return outcome('En Pau ja és a l’ombra sota el tendal.',true,0)}return notify(p.name+' ja està protegit/da per l’ombra.');}
 p.protected=true;p.temp=clamp(p.temp-.2,35.7,43);
 if(p.id==='jordi')mark(p,'shade');
 shiftPerson(p,id,'shade');return outcome(p.name+' s’ha col·locat a l’ombra. La protecció és individual i es veu a l’escena.',true,1);
}
function selectZone(zone){
 if(s.ended||s.paused)return;
 if(s.positionTarget){const p=s.positionTarget;s.positionTarget=null;return takeToZone(p,zone);}
 s.selected=null;s.targeting=null;s.positionTarget=null;
 s.targeting=zone;
 notify('Zona «'+ITEMS[zone].name+'» seleccionada. Toca la persona que hi vols col·locar, o arrossega-la directament fins aquí.');render();
}
function centerPan(){}
function changeRoom(dir){if(s.ended)return;const nxt=(s.room+dir+ROOMS.length)%ROOMS.length,dest=ROOMS[nxt];if(s.carrying){const p=person(s.carrying);if(!(s.stock.chair>0))return outcome('Has esgotat els moviments de la cadira.',false,1);if(p.id==='jordi'&&currentCase==='01'&&!p.done.call)return outcome('Trasllat precipitat: primer avisa emergències. Evita mobilitzacions innecessàries si no és segur.',false,1);if(dest.id==='plaza'){p.health=clamp(p.health-6,0,100);s.stock.chair--;p.room=dest.id;shiftPerson(p,dest.id);s.room=nxt;s.carrying=null;return outcome('has traslladat '+p.name+' al sol. Has gastat un trasllat i la seva salut ha empitjorat.',false,3)}p.room=dest.id;shiftPerson(p,dest.id);p.protected=dest.id==='refugi';s.stock.chair--;s.carrying=null;s.room=nxt;s.selected=null;s.focused=p.id;if(p.id==='laia'&&dest.id==='refugi'&&currentCase==='01')mark(p,'move');if(p.id==='jordi'&&dest.id==='refugi'&&currentCase==='01')mark(p,'shade');return outcome('Has traslladat '+p.name+' a '+dest.name+'. Cadira: '+s.stock.chair+' trasllats restants.',true,2)}s.room=nxt;s.selected=null;s.targeting=null;s.positionTarget=null;s.focused=null;render();centerPan();}
function hint(){if(s.ended)return;const candidates=s.people.filter(p=>!p.complete);const p=candidates.find(p=>p.room===room().id)||candidates[0];if(!p)return;const action=p.ideal.find(([k])=>!p.done[k]);if(!action)return notify('Els objectius de '+p.name+' estan fets. Vigila la seva estabilització.');s.hints++;s.score-=60;const hints={forecast:'Consulta l’avís de calor de la zona de treball: primer identifica el risc abans de reprogramar la feina.',hat:'La gorra és opcional quan en Pau ja és sota el tendal; serveix quan ha de tornar al sol.',plan:'Després de llegir l’avís de calor, aplica el pla d’horaris sobre l’Aina: canvia les hores d’esforç, les pauses i l’aclimatació.',contact:'Troba el pla de seguiment al pis i aplica’l sobre la Rosa.',call:'Recull el telèfon de la plaça i aplica’l sobre en Jordi.',cool:'Troba el drap humit del parc i aplica’l sobre en Jordi.',shade:'Porta en Pau a la zona d’ombra o al banc sota el tendal. Si seu al banc, ja compta com a protegit del sol.',rest:'Porta l’Aina al banc de la zona de treball, sota el tendal: això també la protegeix del sol.',move:'A la zona de treball, toca 🚶 Anar al refugi i després l’Aina. Si pot caminar amb seguretat, no necessita cadira.',drink:'Recull una ampolla i aplica-la sobre una persona orientada.',monitor:'Fes servir 👁️ Vigilar sobre la persona després de les mesures: comprova consciència, mareig i evolució. A l’Aina, fes-ho ja al refugi.',blinds:'Toca les persianes del pis.',coolhome:'La Rosa pot necessitar un espai més fresc; el drap no és obligatori si està bé i la casa és segura.'};
const caseOneHints={rest:'Porta la Laia al banc de la plaça.',move:'Selecciona la cadira ♿, toca la Laia i canvia al refugi.',shade:'Porta en Jordi sota l’arbre, a la plaça.',monitor:'Toca 👁️ Vigilar i després la persona. En Jordi també es pot comprovar directament.',coolhome:'Aplica el drap humit a la Maria o refresca-la al refugi.'};const detail=s.hints>=1||s.difficulty<1.7?' Pista detallada: '+((currentCase==='01'?caseOneHints[action[0]]:null)||hints[action[0]]||'Troba els estris adequats.') :'';notify('📻 Ràdio · '+p.name+': '+action[1]+'.'+detail+' (−60 punts)', 'neutral');log('Pista de ràdio per a '+p.name+' (−60 punts)');adjustDifficulty();render()}
function sceneArt(){const r=room().id;if(r==='plaza')return `<defs>
<linearGradient id="skyP" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8fd7f2"/><stop offset="0.62" stop-color="#dff4ff"/><stop offset="1" stop-color="#f6e6bd"/></linearGradient>
<linearGradient id="groundP" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#d5c094"/><stop offset="1" stop-color="#b49e78"/></linearGradient>
</defs>
<rect width="1000" height="620" fill="url(#skyP)"/>
<circle cx="865" cy="92" r="56" fill="#ffb149" opacity=".95"/>
<g stroke="#ffc969" stroke-width="7" stroke-linecap="round" opacity=".65"><path d="M865 10v28"/><path d="M865 146v28"/><path d="M783 92h-28"/><path d="M975 92h-28"/><path d="M807 34l-19 19"/><path d="M923 150l-19 19"/><path d="M923 34l19 19"/><path d="M807 150l-19 19"/></g>
<rect y="355" width="1000" height="265" fill="url(#groundP)"/>
<path d="M0 392c129-31 258-47 390-30 104 13 211 44 319 39 96-5 194-39 291-37v256H0Z" fill="#c8b58e"/>
<path d="M0 470c119-11 205 27 327 25 100-2 164-35 258-31 136 5 220 39 415 20v126H0Z" fill="#b8b08a"/>
<g opacity=".88"><rect x="30" y="258" width="112" height="116" rx="4" fill="#d8af87"/><path d="M20 258h132l-66-42z" fill="#af7856"/><rect x="52" y="296" width="28" height="30" fill="#f7edd7"/><rect x="90" y="296" width="28" height="30" fill="#f7edd7"/></g>
<g opacity=".82"><rect x="768" y="224" width="182" height="139" rx="5" fill="#dfaf83"/><path d="M754 224h210l-104-54z" fill="#b27a58"/><rect x="792" y="270" width="44" height="54" fill="#f7ebd7"/><rect x="848" y="270" width="74" height="14" fill="#f7ebd7"/></g>
<g><rect x="130" y="194" width="30" height="209" rx="9" fill="#7d5f46"/><g fill="#5d936f"><circle cx="145" cy="171" r="102"/><circle cx="82" cy="217" r="56"/><circle cx="212" cy="214" r="66"/></g><ellipse cx="204" cy="431" rx="185" ry="58" fill="#2d584b33"/></g>
<g><rect x="214" y="382" width="146" height="17" rx="7" fill="#a86d50"/><path d="M233 399v45m108-45v45" stroke="#84563f" stroke-width="13" stroke-linecap="round"/><path d="M200 382h176" stroke="#c48763" stroke-width="6" opacity=".45"/></g>
<path d="M0 500h1000" stroke="#f3e0b8" stroke-width="10" opacity=".65"/>
<g fill="#fef7d6" opacity=".52"><circle cx="318" cy="111" r="3"/><circle cx="404" cy="89" r="3"/><circle cx="621" cy="156" r="2.5"/><circle cx="704" cy="133" r="2.5"/></g>`;
if(r==='refugi')return `<defs>
<linearGradient id="bgR" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e6f7f8"/><stop offset="1" stop-color="#bedfe0"/></linearGradient>
</defs>
<rect width="1000" height="620" fill="url(#bgR)"/>
<rect y="405" width="1000" height="215" fill="#8db8b7"/>
<rect x="0" y="0" width="1000" height="405" fill="#dfeee9"/>
<rect x="102" y="70" width="278" height="236" rx="12" fill="#a7deea" stroke="#ffffff" stroke-width="20"/><path d="M241 70v236M102 188h278" stroke="#ffffff" stroke-width="12"/>
<rect x="760" y="56" width="136" height="80" rx="16" fill="#f2fbfa" stroke="#80ada7" stroke-width="8"/><path d="M782 96h93" stroke="#7dc0b0" stroke-width="8" stroke-linecap="round"/>
<g><rect x="414" y="245" width="330" height="152" rx="20" fill="#6f9692"/><rect x="438" y="208" width="282" height="82" rx="35" fill="#91bbb5"/><path d="M446 397v91m266-91v91" stroke="#507a76" stroke-width="18" stroke-linecap="round"/></g>
<g opacity=".9"><rect x="25" y="60" width="78" height="306" rx="8" fill="#85c6b8"/><rect x="18" y="44" width="92" height="28" rx="6" fill="#4a9f8c"/><path d="M155 121l-30 42 30-7z" fill="#fff"/></g>
<g opacity=".75"><rect x="808" y="432" width="135" height="98" rx="14" fill="#e7f4f0"/><rect x="828" y="452" width="96" height="17" rx="8" fill="#8eb6b0"/><rect x="828" y="480" width="78" height="12" rx="6" fill="#abcac4"/></g>
<path d="M0 430h1000" stroke="#6a9d9b" stroke-width="7" opacity=".45"/><path d="M305 405v215m350-215v215m232-215v215" stroke="#84adab" stroke-width="4" opacity=".4"/>`;
return `<defs>
<linearGradient id="bgH" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f3e2c9"/><stop offset="1" stop-color="#ead2b6"/></linearGradient>
</defs>
<rect width="1000" height="620" fill="url(#bgH)"/>
<rect y="405" width="1000" height="215" fill="#be9f82"/>
<path d="M0 404h1000" stroke="#a5866d" stroke-width="9"/>
<rect x="98" y="54" width="315" height="247" rx="6" fill="#9ec9d3" stroke="#fdf3e4" stroke-width="22"/>
<path d="M256 54v247" stroke="#fdf3e4" stroke-width="15"/>
<rect x="109" y="68" width="293" height="225" fill="#b9dce5" opacity=".3"/>
<g><rect x="478" y="251" width="325" height="137" rx="24" fill="#748f88"/><rect x="500" y="213" width="281" height="80" rx="34" fill="#95aaa0"/><path d="M505 388v90m271-90v90" stroke="#687d6e" stroke-width="16" stroke-linecap="round"/></g>
<g opacity=".92"><rect x="809" y="132" width="90" height="227" rx="8" fill="#b28c6f"/><rect x="859" y="65" width="53" height="85" rx="4" fill="#dab18a"/><path d="M860 65l26-28 26 28" fill="#ab7957"/></g>
<g opacity=".78"><rect x="428" y="118" width="56" height="160" rx="6" fill="#ccab82"/><rect x="425" y="108" width="94" height="13" rx="5" fill="#9b755f"/></g>
<g opacity=".5"><rect x="56" y="441" width="206" height="88" rx="16" fill="#d3b393"/><rect x="73" y="459" width="170" height="17" rx="8" fill="#c89f79"/></g>
<path d="M0 500h1000" stroke="#927565" stroke-width="9" opacity=".42"/>`;}
function avatarMarkup(p){return `<span class="character char-${p.id}"><span class="hair"></span><span class="head"></span><span class="arm left"></span><span class="arm right"></span><span class="torso"></span><span class="detail"></span><span class="leg left"></span><span class="leg right"></span><span class="shoe left"></span><span class="shoe right"></span></span>`}
function bars(p){const health=`<div class="mini"><b>❤️ Salut ${round(p.health)}%</b><i><em class="${p.health<45?'danger':''}" style="width:${p.health}%"></em></i></div>`;const t=p.seen.temp?`<div class="mini">🌡️ ${p.temp.toFixed(1)}°C <i><em class="hot" style="width:${clamp((p.temp-35)/8*100,0,100)}%"></em></i></div>`:'<div class="unseen">🌡️ ? · troba el termòmetre</div>';const h=p.seen.hyd?`<div class="mini">💧 ${round(p.hyd)}% <i><em style="width:${p.hyd}%"></em></i></div>`:'<div class="unseen">💧 ? · troba el mesurador</div>';return `<div class="overhead">${health}${t}${h}</div>`}
function renderLive(){
 $('clock').textContent=formatClock(s.minutes);
 $('score').textContent=s.score;
 $('rescued').textContent=count()+'/3';
 $('progress').style.width=(count()/3*100)+'%';
 $('difficultyBar').style.width=(s.difficulty/4*100)+'%';
 $('difficultyText').textContent=s.grade+' · '+s.difficulty.toFixed(1)+'/4';
 $('errorsCount').textContent=s.errors+' errors';
 for(const p of peopleHere()){
  const node=$('nodes').querySelector('[data-person="'+p.id+'"]');
  if(!node)continue;
  const overhead=node.querySelector('.overhead');
  if(overhead)overhead.innerHTML=bars(p).slice('<div class="overhead">'.length,-6);
  node.classList.toggle('done',p.complete);
  const speech=node.querySelector('.speech');
  if(speech)speech.textContent=p.complete?'Em trobo millor!':p.desc;
 }
 $('quests').innerHTML=s.people.map(p=>`<div class="quest"><b>${p.complete?'✓':'○'}</b><div><strong>${p.name}</strong> · ❤️ ${round(p.health)}% · ${p.complete?'Estable':'En curs'}<small>${p.ideal.filter(([k])=>p.done[k]).length}/${p.ideal.length} accions ideals · ${esc(ROOMS.find(r=>r.id===p.room).name)}</small></div></div>`).join('');
 renderDebug();
}
 // Recol·loca els objectes petits, sense tocar els punts fixos del decorat ni les persones.
 // Es calcula sobre mides reals del navegador: evita col·lisions també a mòbil.
 function arrangeScene(){
  const world=$('world'),nodes=$('nodes');if(!world||!nodes)return;
  const wr=world.getBoundingClientRect();if(!wr.width||!wr.height)return;
  const placed=[];
  const rect=el=>{const b=el.getBoundingClientRect();return {x:b.left-wr.left,y:b.top-wr.top,w:b.width,h:b.height}};
  const overlaps=(a,b,pad=6)=>a.x<b.x+b.w+pad&&a.x+a.w+pad>b.x&&a.y<b.y+b.h+pad&&a.y+a.h+pad>b.y;
  const obstruction=[...nodes.querySelectorAll('.person')].flatMap(el=>[rect(el),...([...el.querySelectorAll('.overhead')].map(rect))]);
  for(const el of nodes.querySelectorAll('.world-node.fixed'))placed.push(rect(el));
  const blocked=[...placed,...obstruction];
  /* El cartell és fix a la finestra i no restringeix el mapa panoràmic. */
  const fixedMargin=10;
  for(const el of nodes.querySelectorAll('.world-node:not(.fixed):not(.person)')){
   const spot=SPOTS[room().id].find(o=>o.id===el.dataset.spot);if(!spot)continue;
   const size=rect(el),baseX=spot.x/100*wr.width,baseY=spot.y/100*wr.height;
   let best=null;
   const tryPoint=(cx,cy)=>{
    const box={x:cx-size.w/2,y:cy-size.h/2,w:size.w,h:size.h};
    if(box.x<fixedMargin||box.y<fixedMargin||box.x+box.w>wr.width-fixedMargin||box.y+box.h>wr.height-fixedMargin)return;
    const collision=blocked.reduce((sum,b)=>sum+(overlaps(box,b,5)?1:0),0);
    const distance=Math.hypot((cx-baseX)/wr.width,(cy-baseY)/wr.height);
    const score=collision*100+distance*14;
    if(!best||score<best.score)best={cx,cy,box,score};
   };
   tryPoint(baseX,baseY);
   // Cerca una ubicació pròxima a l'original abans d'allunyar l'objecte.
   for(const radius of [45,85,130,190,260,340])for(let i=0;i<16;i++){
    const a=i/16*Math.PI*2;tryPoint(baseX+Math.cos(a)*radius,baseY+Math.sin(a)*radius);
   }
   if(best){el.style.left=best.cx/wr.width*100+'%';el.style.top=best.cy/wr.height*100+'%';blocked.push(best.box)}
  }
 }
let lastRenderedRoom=null;
function render(){const r=room();const roomChanged=lastRenderedRoom!==r.id;lastRenderedRoom=r.id;$('clock').textContent=formatClock(s.minutes);$('rescued').textContent=count()+'/3';$('score').textContent=s.score;$('roomName').textContent=r.name;$('roomIndex').textContent=' · '+(s.room+1)+' / '+ROOMS.length;$('env').innerHTML=`<span>🌡️ <b>${s.roomTemps[r.id]} °C</b></span><span>💦 <b>${r.hum}%</b></span><span>☀ UV <b>${r.uv}</b></span>`;$('scenery').innerHTML=`<image href="${GAME_ASSETS.backgrounds[r.id]}" width="1000" height="620" preserveAspectRatio="none"/>`;$('sceneTitle').innerHTML=`<div class="sceneTitleHead"><div><b>${esc(r.name)}</b><small>${esc(r.desc)}</small></div><small class="sceneIdx">${s.room+1} / ${ROOMS.length}</small></div><div class="sceneStats"><span class="sceneStat">🌡️ <b>${s.roomTemps[r.id]} °C</b></span><span class="sceneStat">💦 <b>${r.hum}%</b></span><span class="sceneStat">☀ UV <b>${r.uv}</b></span></div>`;
$('nodes').innerHTML=SPOTS[r.id].filter(o=>ITEMS[o.tool||o.id].fixed||!s.collected[o.id]).map(o=>{const item=o.tool||o.id,i=ITEMS[item],active=i.fixed&&s.roomFlags[r.id][item];return `<button class="world-node ${i.fixed?'fixed':''} ${active?'running':''} ${s.targeting===item?'target-active':''} ${s.positionTarget&&['rest','shade','sun'].includes(item)?'zone-ready':''}" style="left:${o.x}%;top:${o.y}%" data-spot="${o.id}" title="${['rest','monitor','walk'].includes(item)?'Selecciona una persona per aplicar':i.fixed?'Equipament fix':i.kind==='informacio'?'Llegir i guardar coneixement':'Recollir'}: ${esc(i.name)}"><span class="objectIcon">${i.icon}</span><span class="objectName">${esc(i.name)} ${i.fixed?'⌁':i.kind==='informacio'?'ℹ':''}</span></button>`}).join('')+peopleHere().map(p=>`<button class="world-node person ${p.complete?'done':''} ${s.focused===p.id||s.positionTarget===p.id?'selected':''} ${s.targeting?'targetable':''}" style="left:${p.x}%;top:${p.y}%" data-person="${p.id}" data-placement="${p.placement||'general'}" aria-label="${esc(p.name)}"><span class="speech">${esc(p.complete?'Em trobo millor!':p.desc)}</span><span class="personAvatar">${avatarMarkup(p)}</span><span class="person-name">${p.name} · ${p.age}</span>${bars(p)}${p.placement?`<span class="bubble placeBubble">${p.placement==='rest'?'🪑 DESCANSANT':p.placement==='sun'?'☀️ AL SOL':'🌳 A L’OMBRA'}</span>`:''}${s.carrying===p.id?'<span class="bubble">♿ EN TRASLLAT</span>':''}</button>`).join('');arrangeScene();
$('inventory').innerHTML=Object.entries(ITEMS).filter(([id,i])=>!i.fixed&&(s.stock[id]>0||(id==='chair'&&currentCase==='01'))).map(([id,i])=>`<button class="inv ${s.selected===id?'active':''}" data-tool="${id}" title="${esc(i.help)}"><span class="glyph">${i.icon}</span><b>${esc(i.name)}</b><small>${id==='chair'?s.stock[id]+' moviments':s.stock[id]===Infinity?'∞ Il·limitat':s.stock[id]+' ús'+(s.stock[id]===1?'':'os')}</small></button>`).join('');$('bagCount').textContent='('+Object.keys(s.stock).filter(k=>s.stock[k]>0).length+' eines)';$('transportInfo').innerHTML=s.carrying?`<div class="transport-banner">♿ Transportant ${esc(person(s.carrying).name)}. Tria una habitació amb ❮ o ❯. Queden ${s.stock.chair} trasllats. Prem ✕ per cancel·lar.</div>`:'';$('progress').style.width=(count()/3*100)+'%';$('quests').innerHTML=s.people.map(p=>`<div class="quest"><b>${p.complete?'✓':'○'}</b><div><strong>${p.name}</strong> · ❤️ ${round(p.health)}% · ${p.complete?'Estable':'En curs'}<small>${p.ideal.filter(([k])=>p.done[k]).length}/${p.ideal.length} accions ideals · ${esc(ROOMS.find(r=>r.id===p.room).name)}</small></div></div>`).join('');$('difficultyBar').style.width=(s.difficulty/4*100)+'%';$('difficultyText').textContent=s.grade+' · '+s.difficulty.toFixed(1)+'/4';$('errorsCount').textContent=s.errors+' errors';renderNotes();renderDebug();if(roomChanged)centerPan()}
function renderNotes(){if(!$('notes'))return;const known=NOTES.filter(n=>s.notes[n.id]);$('noteCount').textContent=known.length+'/'+NOTES.length;$('notes').innerHTML=known.map(n=>`<button class="noteTab ${s.activeNote===n.id?'active':''}" data-note="${n.id}">${esc(n.title)}</button>`).join('')||'<span class="small">Troba la guia al mapa.</span>';const n=NOTES.find(n=>n.id===s.activeNote&&s.notes[n.id])||known[0];$('noteBody').innerHTML=n?`<strong>${esc(n.title)}</strong><p>${esc(n.body)}</p><small>Fonts: ${esc(n.source)} · <a href="${n.url}" target="_blank" rel="noopener noreferrer">Consulta el protocol</a></small>`:'Troba documents informatius als tres escenaris del cas. Quan els reculls, es guarden al quadern; no es poden arrossegar.'}
function chart(){const c=$('chart'),ctx=c.getContext('2d');if(!ctx)return;const w=c.width,h=c.height,l=49,rr=14,t=19,b=36;ctx.clearRect(0,0,w,h);ctx.fillStyle='#abc7c9';ctx.font='12px system-ui';for(let i=0;i<=4;i++){const y=t+i*(h-t-b)/4;ctx.strokeStyle='#345362';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(l,y);ctx.lineTo(w-rr,y);ctx.stroke();const val=metric==='temp'?(43-i*2):(100-i*25);ctx.fillText(String(val),10,y+4)}ctx.fillText('Temps transcorregut (mm:ss) · '+formatClock(s.elapsed),l,h-10);const low=metric==='temp'?35:0,high=metric==='temp'?43:100;for(const [id,col] of [['jordi','#57e8ba'],['laia','#ffc66e'],['maria','#83afff']]){ctx.strokeStyle=col;ctx.lineWidth=3;ctx.beginPath();let first=true;for(const snap of s.history){const p=snap.people.find(p=>p.id===id),x=l+snap.t/DUR*(w-l-rr),y=t+(high-p[metric])/(high-low)*(h-t-b);if(first){ctx.moveTo(x,y);first=false}else ctx.lineTo(x,y)}ctx.stroke();const p=person(id);ctx.fillStyle=col;ctx.fillText(p.name+': '+(metric==='temp'?p.temp.toFixed(1)+'°C':round(p[metric])+'%'),l+['jordi','laia','maria'].indexOf(id)*154,t+10)}}
function renderDebug(){if(!$('debug').classList.contains('open'))return;$('ideals').innerHTML=s.people.map(p=>`<strong>${p.emoji} ${p.name} · ❤️ ${round(p.health)}% · 💧 ${round(p.hyd)}% · 🌡️ ${p.temp.toFixed(1)} °C</strong>`+p.ideal.map(([k,label])=>`<div>${p.done[k]?'✅':'○'} ${esc(label)}</div>`).join('')).join('<hr style="border:0;border-top:1px solid #405d66">');$('log').innerHTML=s.logs.map(e=>`<div style="color:${e.good?'#d4efdf':'#ffb4aa'}">${formatClock(e.minute)} · ${esc(e.text)}</div>`).join('');$('debugSummary').textContent=`Salut total: ${round(s.people.reduce((a,p)=>a+p.health,0)/3)}% · Errors: ${s.errors} · Pistes de ràdio: ${s.hints} (−${s.hints*60} punts) · Accions: ${s.attempts} · Dificultat: ${s.difficulty.toFixed(2)}`;chart()}
 function zoneAtPointer(x,y){
  if(!['plaza','treball'].includes(room().id))return null;
  const worldRect=$('world').getBoundingClientRect();
  if(x<worldRect.left||x>worldRect.right||y<worldRect.top||y>worldRect.bottom)return null;
  const options=['shade','rest','sun'].map(id=>{
    const el=$('nodes').querySelector('[data-spot="'+id+'"]');
    if(!el)return null;
    const b=el.getBoundingClientRect();
    const dx=Math.max(b.left-x,0,x-b.right),dy=Math.max(b.top-y,0,y-b.bottom);
    const dist=Math.hypot(dx,dy);
    return {id,dist};
  }).filter(Boolean).sort((a,b)=>a.dist-b.dist);
  return options[0]&&options[0].dist<=Math.max(25,Math.min(48,worldRect.width*.055))?options[0].id:null;
 }
function pointerStart(e,source,item,spot){if(e.button!==undefined&&e.button!==0||s.ended||s.paused)return;drag={source,item,spot,x:e.clientX,y:e.clientY,active:false,ghost:null}}
function pointerMove(e){if(!drag)return;const d=drag;if(!d.active&&Math.hypot(e.clientX-d.x,e.clientY-d.y)<10)return;if(!d.active){d.active=true;d.ghost=document.createElement('div');d.ghost.className='dragGhost';d.ghost.textContent=d.source==='person'?person(d.item).emoji:ITEMS[d.item].icon;document.body.append(d.ghost)}d.ghost.style.left=e.clientX+'px';d.ghost.style.top=e.clientY+'px';document.querySelectorAll('.person.drop-over').forEach(el=>el.classList.remove('drop-over'));const target=document.elementFromPoint(e.clientX,e.clientY)?.closest('[data-person]');const zone=document.elementFromPoint(e.clientX,e.clientY)?.closest('[data-spot]');target?.classList.add('drop-over');document.querySelectorAll('.zone-hover').forEach(n=>n.classList.remove('zone-hover'));if(d.source==='person'){const targetZone=zoneAtPointer(e.clientX,e.clientY);if(targetZone)$('nodes').querySelector('[data-spot="'+targetZone+'"]')?.classList.add('zone-hover');}$('world').classList.toggle('drop-ready',!!target&&d.source!=='person')}
function pointerEnd(e){if(!drag)return;const d=drag;drag=null;d.ghost?.remove();$('world').classList.remove('drop-ready');document.querySelectorAll('.person.drop-over,.zone-hover').forEach(el=>el.classList.remove('drop-over','zone-hover'));if(!d.active)return;suppress=true;setTimeout(()=>suppress=false,240);
 const dropped=document.elementFromPoint(e.clientX,e.clientY);
 const target=dropped?.closest('[data-person]');const zone=dropped?.closest('[data-spot]');
 if(d.source==='person'){const targetZone=zoneAtPointer(e.clientX,e.clientY);if(targetZone)return takeToZone(d.item,targetZone);return notify('Per moure una persona dins la plaça, deixa-la anar sobre el banc, l’ombra o el sol.');}
 if(d.source==='spot'&&!ITEMS[d.item].fixed)collect(d.spot);
 if(target){if(d.source==='spot'&&ITEMS[d.item].fixed)return applyFixedToPerson(d.item,target.dataset.person);if(d.source==='spot'&&!(s.stock[d.item]>0))return;use(d.item,target.dataset.person)}
 else if(d.source==='inventory')notify('Deixa anar l’objecte sobre una persona per utilitzar-lo.');
}
$('nodes').addEventListener('pointerdown',e=>{const node=e.target.closest('[data-spot]');if(!node)return;const o=SPOTS[room().id].find(x=>x.id===node.dataset.spot),item=o.tool||o.id;if((!ITEMS[item].fixed&&ITEMS[item].kind!=='informacio')||['rest','shade','sun','monitor','walk'].includes(item))pointerStart(e,'spot',item,o.id)});
$('nodes').addEventListener('pointerdown',e=>{const node=e.target.closest('[data-person]');if(node&&!s.selected&&!s.carrying)pointerStart(e,'person',node.dataset.person)});
$('inventory').addEventListener('pointerdown',e=>{const node=e.target.closest('[data-tool]');if(node)pointerStart(e,'inventory',node.dataset.tool)});
document.addEventListener('pointermove',pointerMove);document.addEventListener('pointerup',pointerEnd);document.addEventListener('pointercancel',()=>{drag?.ghost?.remove();drag=null;$('world').classList.remove('drop-ready')});
$('nodes').addEventListener('click',e=>{if(suppress){suppress=false;return}const p=e.target.closest('[data-person]');if(p)return clickPerson(p.dataset.person);const n=e.target.closest('[data-spot]');if(!n)return;const o=SPOTS[room().id].find(x=>x.id===n.dataset.spot),item=o.tool||o.id;s.positionTarget&&['rest','shade','sun'].includes(item)?takeToZone(s.positionTarget,item):ITEMS[item].fixed?interactFixed(item):collect(o.id)});
$('inventory').addEventListener('click',e=>{if(suppress){suppress=false;return}const inv=e.target.closest('[data-tool]');if(!inv)return;const item=inv.dataset.tool;if(s.carrying)return notify('Primer acaba el trasllat o cancel·la.');s.targeting=null;s.positionTarget=null;s.selected=s.selected===item?null:item;notify(s.selected?'Eina seleccionada: '+ITEMS[item].name+'. Toca una persona per aplicar-la.':'Eina deseleccionada.');render()});
$('notes').addEventListener('click',e=>{const tab=e.target.closest('[data-note]');if(tab){s.activeNote=tab.dataset.note;renderNotes()}});
$('prev').onclick=()=>changeRoom(-1);$('next').onclick=()=>changeRoom(1);$('prevMobile').onclick=()=>changeRoom(-1);$('nextMobile').onclick=()=>changeRoom(1);document.addEventListener('keydown',e=>{if(!s||!$('levelMenu').hidden)return;if(['ArrowLeft','ArrowRight'].includes(e.key)&&!['INPUT','TEXTAREA'].includes(document.activeElement.tagName)){e.preventDefault();changeRoom(e.key==='ArrowRight'?1:-1)}if(e.key==='Escape'){s.carrying=null;s.selected=null;s.targeting=null;s.positionTarget=null;render()}});
function showMenu(){
 clearInterval(tick);drag?.ghost?.remove();drag=null;
 if($('ending').open)$('ending').close();if($('howto').open)$('howto').close();
 $('gameMain').hidden=true;$('levelMenu').hidden=false;document.body.classList.add('menuMode');
}
function startCase(id){
 configureCase(id);$('levelMenu').hidden=true;$('gameMain').hidden=false;document.body.classList.remove('menuMode');
 reset();openHowto();
}
$('levelMenu').addEventListener('click',e=>{const btn=e.target.closest('[data-start-case]');if(btn)startCase(btn.dataset.startCase)});
$('toMenu').onclick=showMenu;$('endToMenu').onclick=showMenu;
$('cancel').onclick=()=>{s.carrying=null;s.selected=null;s.targeting=null;s.positionTarget=null;notify('Acció cancel·lada.');render()};$('hint').onclick=hint;$('reset').onclick=reset;$('again').onclick=reset;$('pause').onclick=()=>{if(s.ended)return;s.paused=!s.paused;s.lastTick=performance.now();$('pause').textContent=s.paused?'▶':'⏸';notify(s.paused?'Partida en pausa.':'Partida represa.')};$('toggleDebug').onclick=()=>{$('debug').classList.toggle('open');$('toggleDebug').textContent=$('debug').classList.contains('open')?'Amagar debug ▴':'Mostrar debug ▾';renderDebug()};$('metrics').onclick=e=>{const b=e.target.closest('[data-metric]');if(b){metric=b.dataset.metric;$('metrics').querySelectorAll('button').forEach(el=>el.classList.toggle('active',el.dataset.metric===metric));chart()}};
$('export').onclick=()=>{if(!s)return;const payload={cas:currentCase,tema:'onada de calor',difficulty:s.difficulty,errors:s.errors,remainingSeconds:s.minutes,elapsedSeconds:s.elapsed,score:s.score,people:s.people,inventory:s.stock,notes:s.notes,history:s.history,actions:s.logs};const blob=new Blob([JSON.stringify(payload,null,2)],{type:'application/json'}),u=URL.createObjectURL(blob),a=document.createElement('a');a.href=u;a.download='sobreviu-estiu-cas'+currentCase+'-debug.json';a.click();setTimeout(()=>URL.revokeObjectURL(u),1000)};
let howtoWasPaused=false;
function openHowto(){if(!s||s.ended)return;howtoWasPaused=s.paused;s.paused=true;s.lastTick=performance.now();$('howto').showModal();}
function closeHowto(){if($('howto').open)$('howto').close();s.paused=howtoWasPaused;s.lastTick=performance.now();$('pause').textContent=s.paused?'▶':'⏸';}
$('helpOpen').onclick=openHowto;$('startGame').onclick=closeHowto;
$('howto').addEventListener('cancel',e=>{e.preventDefault();closeHowto()});
showMenu();
// Recol·locació responsive sense tocar l'estat de la partida.
if(typeof ResizeObserver!=='undefined'){
 const sceneResize=new ResizeObserver(()=>{if(!drag)requestAnimationFrame(arrangeScene)});
 sceneResize.observe($('world'));
}
})();

