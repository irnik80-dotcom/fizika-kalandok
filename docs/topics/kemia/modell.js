/* Kémia 7. – 1. fejezet: A kísérleti megfigyeléstől a modellalkotásig (tankönyv 5–20. oldal) */
(function(){
var SV = window.SV, fmt = function(n){ return String(n).replace(/\B(?=(\d{3})+(?!\d))/g,' '); };
var pick = function(a){ return a[Math.floor(Math.random()*a.length)]; };
var row = SV.row, mini = SV.mini, grid = SV.grid;
var FIG = {
  lab: SV.boxes('Laboratóriumi eszközök',[['kémcső','#d4f1ff'],['főzőpohár','#cfe9ff'],['mérőhenger','#d5f0cb'],['gázégő','#ffd9d6']],'a kísérletet mindig a leírás szerint végezzük'),
  density: SV.tri('Sűrűség: ró egyenlő m osztva V-vel','m','ρ','V','ρ = m : V   (g/cm³)'),
  cylinder: SV.svg('Mérőhengerrel mérjük a térfogatot',
    SV.r(120,15,50,115,'#e9f6ff')+SV.r(122,70,46,58,'#9fd0ff')+SV.r(138,78,14,22,'#b08060')+SV.t(60,60,'50 ml',12,'middle')+SV.t(60,80,'víz',12,'middle')+
    SV.t(230,70,'+ kulcs',13,'start')+SV.t(230,90,'kiszorított víz',12,'start')+SV.t(230,108,'= a kulcs térfogata',12,'start')),
  water: SV.mol('Vízmolekula: egy oxigén- és két hidrogénatom',[['O',160,60],['H',125,105],['H',195,105]],[[0,1,1],[0,2,1]],'H₂O'),
  co2: SV.mol('Szén-dioxid-molekula',[['O',100,80],['C',160,80],['O',220,80]],[[0,1,2],[1,2,2]],'CO₂'),
  o2: SV.mol('Oxigénmolekula: két oxigénatom',[['O',130,80],['O',190,80]],[[0,1,2]],'O₂'),
  ch4: SV.mol('Metánmolekula',[['C',160,80],['H',160,35],['H',112,88],['H',208,88],['H',160,128]],[[0,1,1],[0,2,1],[0,3,1],[0,4,1]],'CH₄'),
  states: SV.states('A részecskék szilárd, folyékony és légnemű anyagban'),
  groups: SV.svg('Az anyagok csoportosítása',
    SV.r(110,8,100,26,'#ffd23f')+SV.t(160,26,'ANYAG',13,'middle','#1b2618')+
    SV.r(20,60,130,28,'#9fe07f')+SV.t(85,79,'kémiailag tiszta',11,'middle','#1b2618')+SV.r(170,60,130,28,'#ffd9d6')+SV.t(235,79,'keverék',12,'middle','#1b2618')+
    SV.r(15,112,64,26,'#cdeeed')+SV.t(47,129,'elem',12,'middle','#1b2618')+SV.r(90,112,64,26,'#d4e6fb')+SV.t(122,129,'vegyület',11,'middle','#1b2618')+
    SV.t(235,112,'szilárd keverék,',10,'middle')+SV.t(235,125,'oldat, gázelegy',10,'middle')+
    '<line x1="160" y1="34" x2="85" y2="60" stroke="currentColor" stroke-width="2"/><line x1="160" y1="34" x2="235" y2="60" stroke="currentColor" stroke-width="2"/><line x1="85" y1="88" x2="47" y2="112" stroke="currentColor" stroke-width="2"/><line x1="85" y1="88" x2="122" y2="112" stroke="currentColor" stroke-width="2"/>'),
  symbols: SV.boxes('Vegyjelek: nagybetű + kisbetű',[['H','#ffffff'],['C','#cfcfcf'],['O','#ffb3ad'],['Na','#e0c8ff'],['Cl','#bfe8bf']],'hidrogén · szén · oxigén · nátrium · klór')
};

window.LESSON = {
  id:'kemia-modell',
  screens:[
  /* ================= VÁZLAT ================= */
  { type:'sheet', section:'Vázlat', title:'Kémia, laboratórium, sűrűség', sub:'Kémia 7. · 1. fejezet · 1. oldal', cards:[
    { n:1, c:1, title:'Mivel foglalkozik a kémia?',
      html:'<p>A <b>kémia</b> az anyagok <b>összetételével, szerkezetével, tulajdonságaival és változásaival</b> foglalkozó természettudomány.</p><p>Legfontosabb módszere a <b>megfigyelés</b> és a <b>kísérletezés</b>.</p>'+grid(
        mini('⚗️ Alkímia','A kémia elődje: a régi alkimisták (pl. aranycsinálással) kísérleteztek.'),
        mini('🏭 Vegyipar','Azon iparágak gyűjtőneve, ahol a termék előállításakor az anyag átalakul. Fontos feladata a <b>környezetbarát eljárások</b> kidolgozása.')),
      note:'Pl. a PVC égetésekor mérgező gázok keletkeznek, ezért nem égethetjük el. A legjobb módszer az újrafeldolgozás.' },
    { n:2, c:5, title:'Kísérleti eszközök és rendszabályok',
      html:row(FIG.lab,'<p>A kísérletezés a természettudományok alapvető módszere. A laboratórium anyagai a <b>vegyszerek</b>.</p>')+grid(
        mini('✅ Így dolgozz','A kísérleteket mindig a <b>leírás alapján</b>, <b>tanári vagy szülői felügyelet</b> mellett végezd. Tartsd be a rendszabályokat!'),
        mini('🚫 Ezt soha','A vegyszereket <b>megkóstolni nem szabad</b>. Körültekintően dolgozz velük!')) },
    { n:3, c:2, title:'Tömeg, térfogat, sűrűség',
      html:row(FIG.density,'<p><b>Tömeget</b> táramérleggel mérünk (g), <b>térfogatot</b> mérőhengerrel (cm³ = ml).</p><p>A <b>sűrűség</b> a tömeg és a térfogat hányadosa:</p><p class="sh-formula">ρ = m : V</p>')+grid(
        mini('💧 A víz','100 cm³ víz tömege 100 g.<br>ρ = 100 g : 100 cm³ = <b>1 g/cm³</b>'),
        mini('🔑 Szilárd test térfogata','Mérőhengerbe vizet töltünk, beleejtjük a tárgyat. A <b>kiszorított víz térfogata</b> = a test térfogata.'),
        mini('🕯️ Gyertya','A paraffingyertya <b>úszik</b> a vízen: a sűrűsége kisebb 1 g/cm³-nél.')),
      note:'Tárázás: a főzőpoharat a mérlegre téve nullázzuk a kijelzőt, így csak a beletöltött anyag tömegét kapjuk. 1 ml = 1 cm³.' }
  ]},

  { type:'sheet', section:'Vázlat', title:'Részecskék, csoportok, jelölések', sub:'Kémia 7. · 1. fejezet · 2. oldal', cards:[
    { n:4, c:3, title:'Belépés a részecskék birodalmába',
      html:row(FIG.water,'<p>Az anyag <b>részecskékből</b> épül fel. A részecskéket kémiai kötőerők tartják össze.</p>')+grid(
        mini('🔵 Atom','Az anyagokat felépítő <b>legkisebb kémiai részecske</b>. Méretben és tömegben különböznek.'),
        mini('🔗 Molekula','Két vagy több atom összekapcsolódásával kialakuló <b>semleges</b> részecske. Az atomok minősége és száma meghatározott.'),
        mini('🧊 Kristályrács','Szilárd anyagban a sok részecske <b>szabályos rendben</b> kapcsolódik. Ilyen: gyémánt, jég, vas, konyhasó.'))+'<p style="margin-top:10px">A szerkezetet <b>modellekkel</b> szemléltetjük (színkódolt golyók): pl. a H₂O egy oxigén- és két hidrogénatomból áll.</p>' },
    { n:5, c:4, title:'Az anyagok csoportosítása',
      html:row(FIG.groups,'<p><b>Kémiailag tiszta anyag</b>: csak egyféle elemet vagy vegyületet tartalmaz.</p>')+grid(
        mini('🧪 Elem','Egyféle atomból épül fel, egyszerűbb anyagra nem bontható.<br><small>Fémek: vas, réz, alumínium, higany.<br>Nemfémek: oxigén, kén, szén, bróm.</small>'),
        mini('💧 Vegyület','Többféle atomból épül fel, elemeire bontható.<br><small>víz, szén-dioxid, metán, nátrium-klorid</small>'),
        mini('🥣 Keverék','Többféle elemet vagy vegyületet tartalmaz.<br><small>Szilárd keverékek, oldatok és elegyek, gázelegyek: jódozott só, málnaszörp, kőolaj, levegő.</small>')) },
    { n:6, c:1, title:'A kémiai jelölések: vegyjel és képlet',
      html:row(FIG.symbols,'<p>Az alkimisták rejtélyes jeleket használtak. Ma a jelölések <b>nemzetköziek</b> és egyszerűek. Az alapjait <b>Berzelius</b> svéd tudós rakta le.</p>')+grid(
        mini('🔤 Vegyjel','Az atomok és elemek jelölésére szolgáló <b>egy- vagy kétbetűs</b> jel az elem latin vagy görög nevéből. Első betű nagy, a második kicsi: <b>B, Be, Br</b>.'),
        mini('🔢 Képlet','Vegyületek és molekulákból álló elemek jelölése. Az <b>alsó index</b> a számarányt mutatja: <b>H₂O, CO₂, O₂, C₆H₁₂O₆</b>.')),
      note:'Latin nevekből: arany – Au (aurum), ezüst – Ag (argentum), kén – S (sulfur), szén – C (carboneum). A képlet megmutatja az anyag összetételét és az arányokat is.' }
  ]},

  /* ================= TANULÁS (lépésről lépésre) ================= */
  { type:'info', section:'Tanulás', icon:'🔬', title:'Atom, molekula, kristály: mi a különbség?', fig:FIG.states,
    body:'<p>Minden anyag apró <b>részecskékből</b> áll. Háromféle szerkezet fontos most:</p><ul><li><mark class="e1">Atom</mark>: a legkisebb kémiai részecske. Pl. a hélium, az argon önállóan atomokból áll.</li><li><mark class="e2">Molekula</mark>: 2 vagy több <b>atom összekapcsolódva</b>. Pl. a víz (H₂O), a szén-dioxid (CO₂).</li><li><mark class="e3">Kristályrács</mark>: szilárd anyagban <b>sok-sok részecske</b> szabályos rendben. Pl. jég, konyhasó, vas.</li></ul><p>A <b>szilárd</b> anyagban a részecskék szorosan, rendben vannak. A <b>folyadékban</b> mozognak egymás mellett. A <b>gázban</b> messze vannak egymástól.</p>',
    mc:'<p>Gondolj egy Minecraft-blokkra: a blokk sok-sok apró pixelből áll, és a pixelek szabályos rácsban vannak. A kristályrács is ilyen.</p>',
    tip:'<p>A molekula mindig <b>semleges</b>, és a benne lévő atomok minősége és száma <b>meghatározott</b>. A víz mindig 2 H + 1 O.</p>',
    src:'12–14. oldal' },

  { type:'info', section:'Tanulás', icon:'🧱', title:'Molekulamodellek: így néznek ki', fig:FIG.co2,
    body:'<p>A molekulákat <b>színes golyókkal</b> modellezzük. A golyók az <b>atomok</b>, a pálcák a <b>kötések</b>.</p><ul><li><b>H₂O</b>: 1 oxigén + 2 hidrogén</li><li><b>CO₂</b>: 1 szén + 2 oxigén</li><li><b>O₂</b>: 2 oxigén (az oxigén kétatomos molekula)</li><li><b>CH₄</b> (metán): 1 szén + 4 hidrogén</li></ul><p>A <b>képlet</b> alsó indexe megmutatja, hány atom van: a <b>CO₂</b>-ban 1 C és <b>2</b> O.</p>',
    tip:'<p>Ha az alsó index hiányzik, az 1-et jelent: a H₂O-ban az O után nincs szám, tehát 1 oxigén.</p>',
    src:'14–15. oldal' },

  { type:'info', section:'Tanulás', icon:'🧮', title:'Sűrűség: lépésről lépésre', fig:FIG.density,
    body:'<p><b>Mit jelent a sűrűség?</b> Azt mutatja, mekkora tömeg van <b>1 cm³</b>-nyi anyagban.</p><p><b>Képlet:</b> ρ = m : V</p><ol><li>Mérd meg a tömeget (<b>g</b>).</li><li>Mérd meg a térfogatot (<b>cm³</b>).</li><li>Oszd el a tömeget a térfogattal.</li></ol><p><b>Példa:</b> egy vaskulcs tömege 78 g, térfogata 10 cm³. ρ = 78 : 10 = <b>7,8 g/cm³</b>. Nehezebb a víznél, ezért elmerül.</p>',
    mc:'<p>Egy vasblokk és egy fablokk ugyanakkora, mégsem ugyanannyit nyom. A vasnak nagyobb a sűrűsége.</p>',
    tip:'<p>A víz sűrűsége <b>1 g/cm³</b>. Ami ennél kisebb, <b>úszik</b> a vízen, ami nagyobb, <b>elmerül</b>.</p>',
    src:'10–11. oldal' },

  /* ================= JÁTÉKOK ================= */
  { type:'memory', section:'Játék 1', title:'🧠 Vegyjel-memória',
    pairs:[['H','hidrogén'],['O','oxigén'],['C','szén'],['N','nitrogén'],['S','kén'],['Fe','vas']] },

  { type:'match', section:'Játék 2', title:'🔗 Párosítás: mi micsoda?',
    pairs:[['atom','a legkisebb kémiai részecske'],['molekula','semleges, 2 vagy több atomból áll'],['elem','egyféle atomból épül fel'],['vegyület','többféle atomból épül fel'],['keverék','többféle elemet vagy vegyületet tartalmaz'],['vegyjel','egy- vagy kétbetűs jel']] },

  { type:'drag', section:'Játék 3', title:'📦 Elem, vegyület vagy keverék?',
    bins:[{id:'elem',name:'Elem',icon:'🧪'},{id:'vegyulet',name:'Vegyület',icon:'💧'},{id:'keverek',name:'Keverék',icon:'🥣'}],
    items:[{t:'oxigén',c:'elem'},{t:'vas',c:'elem'},{t:'arany',c:'elem'},{t:'víz',c:'vegyulet'},{t:'szén-dioxid',c:'vegyulet'},{t:'metán',c:'vegyulet'},
      {t:'levegő',c:'keverek'},{t:'kőolaj',c:'keverek'},{t:'málnaszörp',c:'keverek'},{t:'jódozott só',c:'keverek'}] },

  { type:'drag', section:'Játék 4', title:'📦 Fém vagy nemfém?',
    bins:[{id:'fem',name:'Fém',icon:'🔩'},{id:'nemfem',name:'Nemfém',icon:'🫧'}],
    items:[{t:'vas',c:'fem'},{t:'réz',c:'fem'},{t:'alumínium',c:'fem'},{t:'higany',c:'fem'},{t:'oxigén',c:'nemfem'},{t:'kén',c:'nemfem'},{t:'szén',c:'nemfem'},{t:'bróm',c:'nemfem'}] },

  { type:'drag', section:'Játék 5', title:'📦 Laboratóriumi rendszabályok: szabad vagy tilos?',
    bins:[{id:'szabad',name:'Szabad ✅',icon:''},{id:'tilos',name:'Tilos 🚫',icon:''}],
    items:[{t:'a leírás alapján kísérletezni',c:'szabad'},{t:'tanári felügyelettel dolgozni',c:'szabad'},{t:'kérdezni, ha nem értem',c:'szabad'},
      {t:'vegyszert megkóstolni',c:'tilos'},{t:'felügyelet nélkül kísérletezni',c:'tilos'},{t:'a leírást figyelmen kívül hagyni',c:'tilos'}] },

  { type:'cloze', section:'Játék 6', title:'✏️ Egészítsd ki a mondatot!',
    text:'A víz képlete ___. A sűrűség: tömeg osztva ___. A vegyjel első betűje mindig ___. A molekula ___ részecske.',
    answers:['H₂O','térfogattal','nagybetű','semleges'], extra:['CO₂','idővel','kisbetű'],
    explain:'ρ = m : V, a vegyjel első betűje nagy, a molekula semleges.' },

  /* ================= DOLGOZAT GYAKORLÓ ================= */
  { type:'cloze', section:'Dolgozat', title:'📝 1. Egészítsd ki a mondatokat!',
    text:'A kémia az anyagok ___ foglalkozó természettudomány. Az ___ a legkisebb kémiai részecske. A ___ két vagy több atomból álló semleges részecske. Az ___ egyféle atomból épül fel. A ___ többféle atomból épül fel.',
    answers:['tulajdonságaival','atom','molekula','elem','vegyület'], extra:['keverék','kristály','ion'],
    explain:'Ezek az 1. fejezet fontos fogalmai.' },

  { type:'match', section:'Dolgozat', title:'📝 2. Kösd össze a vegyjelet a névvel!',
    pairs:[['Au','arany'],['Ag','ezüst'],['Na','nátrium'],['Cl','klór'],['Cu','réz'],['K','kálium']] },

  { type:'tf', section:'Dolgozat', title:'📝 3. Igaz vagy hamis?',
    items:[
      {t:'A vegyjel második betűje kisbetű.', a:true, why:'Pl. Cl, Na, Mg: az első nagy, a második kicsi.'},
      {t:'A vegyületek elemeikre bonthatók.', a:true, why:'A vegyület többféle atomból áll, elemekre bontható.'},
      {t:'A levegő kémiailag tiszta anyag.', a:false, why:'A levegő gázkeverék (többféle anyag keveréke).'},
      {t:'A víz sűrűsége 1 g/cm³.', a:true, why:'100 cm³ víz tömege 100 g.'},
      {t:'Vegyszert ízlelés alapján is megvizsgálhatunk.', a:false, why:'Vegyszert megkóstolni tilos!'},
      {t:'A molekula elektromosan töltött részecske.', a:false, why:'A molekula semleges.'}
    ]},

  { type:'quiz', section:'Dolgozat', q:'4. Melyik a vízmolekula képlete?',
    options:['H₂O','CO₂','O₂','CH₄'], correct:0, explain:'A vízmolekula 2 hidrogén- és 1 oxigénatomból áll.', hint:'2 hidrogén + 1 oxigén.' },
  { type:'quiz', section:'Dolgozat', q:'5. Melyik NEM kémiailag tiszta anyag?',
    options:['kőolaj','víz','oxigén','vas'], correct:0, explain:'A kőolaj keverék. A víz vegyület, az oxigén és a vas elem.', hint:'Melyik áll többféle anyagból?' },
  { type:'quiz', section:'Dolgozat', q:'6. Mit mutat meg a CO₂ képlet alsó indexe?',
    options:['hány oxigénatom van a molekulában','hány szénatom van','a molekula tömegét','a sűrűségét'], correct:0, explain:'A CO₂-ban 1 szén- és 2 oxigénatom van.', hint:'A kis szám a vegyjel mellett az atomok számát adja meg.' },
  { type:'quiz', section:'Dolgozat', q:'7. Egy test elmerül a vízben. Mit tudunk a sűrűségéről?',
    options:['Nagyobb, mint 1 g/cm³.','Kisebb, mint 1 g/cm³.','Pontosan 1 g/cm³.','Nem lehet megmondani.'], correct:0, explain:'Ami a víznél sűrűbb (> 1 g/cm³), az elmerül.', hint:'A víz sűrűsége 1 g/cm³.' },

  { type:'calc', section:'Dolgozat', count:6, gens:[
    function(){ var r=pick([2,3,5,8]), V=pick([5,10,20,25]);
      return {q:'Egy test tömege <b>'+(r*V)+' g</b>, térfogata <b>'+V+' cm³</b>. <b>Mekkora a sűrűsége?</b> (g/cm³)', a:r, u:'g/cm³', hint:'ρ = m : V.', explain:(r*V)+' : '+V+' = '+r+' g/cm³.'}; },
    function(){ var r=pick([2,3,5,8]), V=pick([4,10,20]);
      return {q:'Egy anyag sűrűsége <b>'+r+' g/cm³</b>. <b>Mekkora a tömege '+V+' cm³-nyi darabnak?</b> (g)', a:r*V, u:'g', hint:'m = ρ · V.', explain:r+' · '+V+' = '+(r*V)+' g.'}; },
    function(){ var r=pick([2,4,5,10]), V=pick([3,5,6,10]);
      return {q:'Egy anyag sűrűsége <b>'+r+' g/cm³</b>, a darab tömege <b>'+(r*V)+' g</b>. <b>Mekkora a térfogata?</b> (cm³)', a:V, u:'cm³', hint:'V = m : ρ.', explain:(r*V)+' : '+r+' = '+V+' cm³.'}; },
    function(){ var o=pick([6,8,10,12]), h=pick([8,10,14,18,20]), ans=Math.min(o,Math.floor(h/2));
      return {q:'Van <b>'+h+' hidrogénatom</b> és <b>'+o+' oxigénatom</b> modellje. <b>Legfeljebb hány vízmolekula (H₂O) modellt rakhatsz össze?</b>', a:ans, u:'db', hint:'Egy vízmolekulához 2 H és 1 O kell. Melyikből fogy el előbb?', explain:'Hidrogénből '+Math.floor(h/2)+', oxigénből '+o+' lenne elég, a kevesebb számít: '+ans+' db.'}; },
    function(){ var c=pick([3,4,5,6]), h=pick([12,16,20,24,10]);
      return {q:'Van <b>'+c+' szénatom</b> és <b>'+h+' hidrogénatom</b> modellje. <b>Legfeljebb hány metánmolekula (CH₄) modellt rakhatsz össze?</b>', a:Math.min(c,Math.floor(h/4)), u:'db', hint:'Egy CH₄-hez 1 C és 4 H kell.', explain:'Szénből '+c+', hidrogénből '+Math.floor(h/4)+' lenne elég, a kevesebb számít: '+Math.min(c,Math.floor(h/4))+' db.'}; },
    function(){ var n=pick([10,15,20,25,40]);
      return {q:'<b>'+n+' CO₂-molekulában</b> hány oxigénatom van összesen?', a:2*n, u:'db', hint:'Egy CO₂-ban 2 oxigénatom van.', explain:n+' · 2 = '+(2*n)+' oxigénatom.'}; }
  ]},

  { type:'cards', section:'Ismétlés', title:'🃏 Kártyák – ismételd át!',
    cards:[
      ['Mivel foglalkozik a kémia?','Az anyagok összetételével, szerkezetével, tulajdonságaival és változásaival.'],
      ['Mi a vegyipar?','Azon iparágak gyűjtőneve, ahol a termék előállításakor az anyag átalakul.'],
      ['Mit nem szabad a laboratóriumban?','Vegyszert megkóstolni, vagy felügyelet nélkül kísérletezni.'],
      ['Sűrűség','ρ = m : V. A víz sűrűsége 1 g/cm³.'],
      ['Atom','Az anyagokat felépítő legkisebb kémiai részecske.'],
      ['Molekula','Két vagy több atom összekapcsolódásával kialakuló semleges kémiai részecske.'],
      ['Kristályrács','Szilárd anyagban a részecskék szabályos elrendeződése (jég, konyhasó, vas).'],
      ['Elem','Egyféle atomból felépülő kémiailag tiszta anyag.'],
      ['Vegyület','Többféle atomból felépülő kémiailag tiszta anyag.'],
      ['Keverék','Többféle elemet vagy vegyületet tartalmazó anyag (levegő, kőolaj).'],
      ['Vegyjel','Egy- vagy kétbetűs jel. Az első betű nagy, a második kicsi.'],
      ['Képlet','Vegyjelekből és számokból áll (H₂O). Az alsó index a számarányt mutatja.']
    ]},

  { type:'end', section:'Kész!' }
  ]
};
(window.ALL = window.ALL || {})[window.LESSON.id] = window.LESSON;
})();
