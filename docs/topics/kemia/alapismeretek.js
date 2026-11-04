/* Kémia 7. – 2. fejezet: Kémiai alapismeretek (tankönyv 21–42. oldal) */
(function(){
var SV = window.SV, fmt = function(n){ return String(n).replace(/\B(?=(\d{3})+(?!\d))/g,' '); };
var pick = function(a){ return a[Math.floor(Math.random()*a.length)]; };
var row = SV.row, mini = SV.mini, grid = SV.grid;
var FIG = {
  changes: SV.boxes('Fizikai és kémiai változás',[['fizikai: nincs új anyag','#cfe9ff'],['kémiai: új anyag','#ffd9d6']],'a jég olvadása fizikai, a cukor égése kémiai változás'),
  react: SV.flow('Egyesülés és bomlás',[['A + B','#d5f0cb'],['AB','#ffd23f'],['AB','#ffd23f'],['A + B','#d5f0cb']],['egyesül','','bomlik'],'egyesülés: több anyagból egy · bomlás: egy anyagból több'),
  energy: SV.svg('Exoterm és endoterm változás',
    SV.r(20,50,110,60,'#ffd9d6')+SV.t(75,76,'EXOTERM',13,'middle','#1b2618')+SV.t(75,96,'hőt ad le',12,'middle','#1b2618')+SV.arrow(135,80,175,'#d6403f')+SV.t(155,66,'hő',12)+
    SV.r(190,50,110,60,'#d4e6fb')+SV.t(245,76,'ENDOTERM',13,'middle','#1b2618')+SV.t(245,96,'hőt vesz fel',12,'middle','#1b2618')+SV.t(160,140,'pl. magnézium égése · hipermangán bomlása',11)),
  states: SV.states('Szilárd, folyékony, légnemű anyag'),
  phases: SV.flow('Halmazállapot-változások',[['szilárd','#d4f1ff'],['folyadék','#9fd0ff'],['gáz','#e8e8e8']],['olvadás ⇄ fagyás','párolgás/forrás ⇄ lecsapódás'],'szublimáció: szilárd → gáz (a folyadékot kihagyja)'),
  solution: SV.svg('Oldat = oldószer + oldott anyag',
    SV.r(40,50,80,70,'#e8f4ff')+SV.t(80,40,'oldószer',12)+SV.t(80,92,'víz',13,'middle')+SV.t(140,92,'+',28)+
    SV.r(160,70,40,50,'#fff')+SV.t(180,60,'oldott anyag',11)+SV.t(180,100,'só',13,'middle')+SV.t(220,92,'=',28)+SV.r(240,50,60,70,'#d5f0cb')+SV.t(270,40,'oldat',12)+SV.t(270,92,'sós víz',11,'middle')),
  percent: SV.tri('Tömegszázalék','%','m old.','m oldat','tömeg% = oldott anyag tömege : oldat tömege · 100'),
  solub: SV.svg('Gázok oldhatósága: hidegben és nagy nyomáson nagyobb',
    SV.r(40,40,100,80,'#d4f1ff')+SV.t(90,85,'hideg',13,'middle')+SV.t(90,105,'sok gáz oldódik',10,'middle')+
    SV.r(180,40,100,80,'#ffd9d6')+SV.t(230,85,'meleg',13,'middle')+SV.t(230,105,'kevesebb gáz',10,'middle')+SV.t(160,140,'ezért buborékol a meleg szódavíz',11)),
  sep: SV.boxes('Szétválasztási módszerek',[['szitálás','#d5f0cb'],['ülepítés','#d4f1ff'],['kioldás','#fdeeb0'],['mágnes','#ffd9d6']],'méret · sűrűség · oldhatóság · mágnesesség alapján'),
  distill: SV.svg('Lepárlás (desztillálás)',
    SV.r(40,70,60,50,'#e8f4ff')+'<path d="M100 85 L200 60 L240 60" fill="none" stroke="currentColor" stroke-width="4"/>'+SV.fire(60,125)+SV.r(240,60,40,40,'#cfe9ff')+
    SV.t(70,60,'lombik',11,'middle')+SV.t(260,115,'párlat',11,'middle')+SV.t(160,45,'hűtőcső',11,'middle')+SV.t(160,150,'az illékonyabb anyag előbb távozik',11)),
  air: SV.svg('A száraz levegő összetétele',
    SV.r(20,40,78*2.4,36,'#6ab0ff')+SV.t(24,64,'nitrogén (N₂) 78%',12,'start','#1b2618')+SV.r(20,84,21*2.4,36,'#e0524f')+SV.t(24,108,'O₂ 21%',12,'start','#fff')+SV.t(20,140,'nemesgázok ~1% · szén-dioxid 0,04%',11,'start'))
};

window.LESSON = {
  id:'kemia-alapismeretek',
  screens:[
  /* ================= VÁZLAT ================= */
  { type:'sheet', section:'Vázlat', title:'Tulajdonságok és változások', sub:'Kémia 7. · 2. fejezet · 1. oldal', cards:[
    { n:1, c:1, title:'Az anyagok tulajdonságai',
      html:row(FIG.changes,'<p>Egy anyag megfigyelhető és mérhető tulajdonságai <b>fizikai tulajdonságok</b>: szín, szag, halmazállapot, keménység, oldhatóság, olvadáspont, forráspont, sűrűség.</p><p>A <b>kémiai tulajdonság</b> azt mutatja meg, milyen körülmények között <b>alakul át más anyaggá</b>.</p>')+grid(
        mini('🔄 Fizikai változás','A szerkezet megváltozik, de <b>nem keletkezik új anyag</b>. Pl. olvadás, oldódás.'),
        mini('🔥 Kémiai változás','A részecskék szerkezete is változik, <b>új anyag keletkezik</b>. Pl. égés, bomlás.')),
      note:'Példa: a répacukor 186 °C-on olvad (fizikai). Tovább hevítve karamell lesz, égetve szén-dioxid és vízgőz keletkezik (kémiai). A tulajdonságok nagyon sok részecskéből álló anyagra igazak, egyetlen molekulára nem.' },
    { n:2, c:5, title:'A magnézium és a hipermangán',
      html:row(FIG.react,'<p><b>Egyesülés:</b> két vagy több anyagból <b>egy</b> új anyag keletkezik.<br><b>Bomlás:</b> egy anyagból <b>két vagy több</b> új anyag keletkezik.</p>')+grid(
        mini('✨ Magnézium (Mg)','Ezüstszürke, szagtalan, szilárd fém, vízben nem oldódik. Égése: vakító fény, fehér <b>magnézium-oxid</b> keletkezik (egyesülés). Belenézni nem szabad!'),
        mini('🟣 Hipermangán (KMnO₄)','Lilásszürke szilárd anyag, vízben lila oldat. Hevítve <b>oxigén</b> + zöld kálium-manganát + fekete mangán-dioxid keletkezik (bomlás).')),
      note:'A hipermangán tudományos neve kálium-permanganát. Az egyesülés és a bomlás a kémiai reakciók két legegyszerűbb típusa.' },
    { n:3, c:2, title:'Energiaváltozások',
      html:row(FIG.energy,'<p>A fizikai és a kémiai változásokat mindig <b>energiaváltozás</b> kíséri (általában hő).</p>')+grid(
        mini('🔥 Exoterm','A folyamat közben <b>hő szabadul fel</b>. Pl. a magnézium égése.'),
        mini('❄️ Endoterm','A folyamat közben <b>hő nyelődik el</b>. Pl. a hipermangán bomlása.')) },
    { n:4, c:3, title:'Halmazállapotok és változásaik',
      html:row(FIG.phases,'<p><b>Olvadás:</b> szilárd → folyadék. <b>Fagyás:</b> folyadék → szilárd.<br><b>Párolgás:</b> a folyadék részecskéi a felszínről a gáztérbe lépnek. <b>Forrás:</b> a folyadék belsejében is gőz keletkezik. <b>Lecsapódás:</b> gáz → folyadék.</p>'),
      note:'Szublimáció: a szilárd anyag a folyékony halmazállapot kihagyásával közvetlenül gázzá válik (mentol, kámfor, jód, naftalin, szárazjég). Fordítva: kristályosodás.' }
  ]},

  { type:'sheet', section:'Vázlat', title:'Oldatok', sub:'Kémia 7. · 2. fejezet · 2. oldal', cards:[
    { n:5, c:1, title:'Az oldódás és az oldatok',
      html:row(FIG.solution,'<p>Az <b>oldat</b> <b>oldószerből</b> és <b>oldott anyagból</b> álló keverék.</p><p>Az oldódás <b>fizikai változás</b>: az oldószer és az oldott anyag részecskéi elkeverednek.</p>')+grid(
        mini('💧 Oldószerek','A leghétköznapibb a <b>víz</b>. Zsíroldó szer a <b>benzin</b>. Az anyagok különböző oldószerben különbözőképpen oldódnak.'),
        mini('🌡️ Energia','Nátrium-hidroxid oldódásakor az oldat <b>felmelegszik</b> (exoterm), ammónium-nitrátnál <b>lehűl</b> (endoterm).')) },
    { n:6, c:2, title:'Az oldatok töménysége',
      html:row(FIG.percent,'<p>A „híg” és „tömény” viszonylagos szavak. Számmal a <b>tömegszázalékkal</b> adjuk meg:</p><p class="sh-formula">tömeg% = m(oldott) : m(oldat) · 100</p>')+grid(
        mini('🧮 Példa','200 g 1,5 tömegszázalékos hipermangán-oldathoz kell: <b>3 g</b> hipermangán és <b>197 g</b> víz.'),
        mini('🧴 Térfogatszázalék','Megmutatja, hogy az oldott anyag térfogata hány százaléka az oldat térfogatának.')),
      note:'Figyelem: két folyadék elegyítésekor a térfogatok nem adódnak össze pontosan, a részecskék között kölcsönhatás alakul ki. Az oldat tömege viszont mindig az alkotórészek tömegének összege!' },
    { n:7, c:3, title:'Az oldhatóság',
      html:row(FIG.solub,'<p><b>Oldhatóság:</b> megmutatja, hogy <b>100 g oldószer</b> adott hőmérsékleten hány gramm anyagot képes feloldani.</p><p><b>Telített oldat:</b> adott körülmények között több anyagot már nem tud feloldani.</p>')+grid(
        mini('🥤 Szénsavas ásványvíz','Nagyobb nyomáson több gáz oldódik. Kinyitva a palackot a nyomás csökken, a CO₂ egy része buborékként távozik.'),
        mini('🌡️ Hőmérséklet','Melegítéskor a <b>gázok oldhatósága csökken</b>. Ezért fogy az oxigén a természetes vizekből nagy melegben.')) }
  ]},

  { type:'sheet', section:'Vázlat', title:'Keverékek szétválasztása', sub:'Kémia 7. · 2. fejezet · 3. oldal', cards:[
    { n:8, c:4, title:'Szilárd keverékek szétválasztása',
      html:row(FIG.sep,'<p>A keverék alkotórészeit eltérő <b>tulajdonságaik</b> alapján választjuk szét.</p>')+grid(
        mini('🔍 Szitálás','<b>Méretkülönbség</b> alapján.'),
        mini('⏬ Ülepítés','Eltérő <b>sűrűség</b> alapján.'),
        mini('💧 Kioldás','Eltérő <b>oldhatóság</b> alapján (az egyiket oldószerrel kioldjuk).'),
        mini('🧲 Mágneses elválasztás','A <b>vas</b> mágnessel kiemelhető.'),
        mini('💨 Illékonyság','Pl. a <b>jód</b> illékony, szublimál.')) },
    { n:9, c:5, title:'Vizes oldatok szétválasztása',
      html:row(FIG.distill,'<p>Ezek a módszerek az oldatok alkotórészeit választják szét.</p>')+grid(
        mini('♨️ Bepárlás','Az oldószert elpárologtatjuk, a <b>szilárd oldott anyag</b> visszamarad. Pl. tengervízből sót kapunk.'),
        mini('⚗️ Lepárlás (desztilláció)','Az <b>illékonyabb</b> (alacsonyabb forráspontú) anyagot elforraljuk, elvezetjük, lecsapatjuk: ez a <b>párlat</b>.')),
      note:'A desztillált víz elméletileg csak vízmolekulát tartalmaz. Vörösborból lepárlással alkoholban gazdag párlatot kapunk (az alkohol forráspontja 78,5 °C).' },
    { n:10, c:3, title:'A gázkeverékek: levegő és földgáz',
      html:row(FIG.air,'<p>A <b>levegő</b> színtelen, szagtalan gázkeverék. A száraz levegő <b>78% nitrogént</b>, <b>21% oxigént</b>, kb. <b>1% nemesgázt</b> és <b>0,04% szén-dioxidot</b> tartalmaz.</p>')+grid(
        mini('🫁 Oxigén (O₂)','A <b>légzéshez</b> és az <b>égéshez</b> kell.'),
        mini('😴 Nitrogén (N₂)','A levegő <b>közömbös</b> alkotórésze, kémiailag alig változik.'),
        mini('🔥 Földgáz','Főleg szénhidrogének keveréke, fő összetevője a <b>metán</b>. Elégetve sok energiát ad.')),
      note:'Szétválasztás: a levegőt lehűtve cseppfolyóssá tehetjük, és lepárlással nyerjük az összetevőket (a nitrogén −196 °C-on forr el előbb). A szén-dioxid az égést nem táplálja.' }
  ]},

  /* ================= TANULÁS ================= */
  { type:'info', section:'Tanulás', icon:'🔄', title:'Fizikai vagy kémiai változás?', fig:FIG.changes,
    body:'<p>Egyetlen kérdést kell feltenni: <b>keletkezett új anyag?</b></p><ul><li><mark class="e2">Nem</mark> → <b>fizikai változás</b>. (olvadás, forrás, oldódás, aprítás)</li><li><mark class="e1">Igen</mark> → <b>kémiai változás</b>. (égés, bomlás, rozsdásodás)</li></ul><p>A kémiai változásnál az anyag <b>tulajdonságai megváltoznak</b>: más szín, szag, hő- vagy fényjelenség, gáz képződik, csapadék keletkezik.</p>',
    mc:'<p>Ha a fát elvágod, csak fizikai változás. Ha elégeted, hamu és füst lesz belőle: kémiai változás.</p>',
    tip:'<p>A jég olvadása fizikai változás, mert a víz továbbra is víz marad. Az égő magnéziumból viszont új anyag, magnézium-oxid lesz.</p>',
    src:'22–26. oldal' },

  { type:'sim', section:'Tanulás', title:'🧪 Készíts oldatot!',
    intro:'100 g vízbe oldunk sót. <b>Húzd a csúszkát</b>, és nézd, hogyan változik az oldat tömegszázaléka!',
    src:'30–31. oldal',
    render:function(box, unlock){
      var W=100, x=0;
      var wrap=FizEngine.el('div');
      wrap.innerHTML='<div class="tot" id="res"></div><div class="liq" id="bk" style="height:26px;margin:8px 0"></div>'+
        '<label for="sl"><b>Feloldott só:</b> <span id="xv"></span></label><input type="range" id="sl" min="0" max="60" step="5" value="0">'+
        '<p class="hint" id="sh">Húzd el a csúszkát, és a „Tovább” gomb kinyílik.</p>';
      box.appendChild(wrap);
      var q=function(id){return wrap.querySelector('#'+id)};
      function upd(){
        var tot=W+x, p=x/tot*100;
        q('res').innerHTML='Víz: <b>'+W+' g</b> · Só: <b>'+x+' g</b> · Oldat: <b>'+tot+' g</b><br><span style="font-size:1.3em">Tömegszázalék: '+(Math.round(p*10)/10).toString().replace('.',',')+' %</span>';
        q('xv').textContent=x+' g';
        var t=Math.min(1,x/60); q('bk').style.background='rgb('+Math.round(190-90*t)+','+Math.round(225-40*t)+',255)';
        if(x>0){ unlock(); q('sh').textContent='👏 Minél több a só, annál töményebb az oldat. A tömegszázalék: oldott anyag : oldat · 100.'; }
      }
      q('sl').oninput=function(){x=+this.value;upd()};
      upd();
    }},

  { type:'info', section:'Tanulás', icon:'🧮', title:'Tömegszázalék lépésről lépésre', fig:FIG.percent,
    body:'<p><b>Feladat:</b> 200 g oldat 5 tömegszázalékos sót tartalmaz. Hány gramm só és hány gramm víz van benne?</p><ol><li>A <b>5%</b> azt jelenti: 100 g oldatban 5 g só van.</li><li>200 g oldat: 200 · 0,05 = <b>10 g só</b>.</li><li>A víz: 200 − 10 = <b>190 g</b>.</li></ol><p><b>Képlet:</b> m(oldott) = m(oldat) · tömeg% : 100.</p><p>Ellenőrzés: 10 : 200 · 100 = 5% ✔</p>',
    tip:'<p>Az oldat tömege = oldószer + oldott anyag tömege. Ha 10 g sót 90 g vízben oldasz, az oldat 100 g, és 10 tömegszázalékos.</p>',
    src:'30–31. oldal' },

  /* ================= JÁTÉKOK ================= */
  { type:'memory', section:'Játék 1', title:'🧠 Halmazállapot-változások memória',
    pairs:[['olvadás','szilárd → folyadék'],['fagyás','folyadék → szilárd'],['párolgás','folyadék → gáz a felszínen'],['lecsapódás','gáz → folyadék'],['szublimáció','szilárd → gáz közvetlenül'],['forrás','gőz a folyadék belsejében is']] },

  { type:'drag', section:'Játék 2', title:'📦 Fizikai vagy kémiai változás?',
    bins:[{id:'fiz',name:'Fizikai',icon:'🔄'},{id:'kem',name:'Kémiai',icon:'🔥'}],
    items:[{t:'a jég olvad',c:'fiz'},{t:'a víz elpárolog',c:'fiz'},{t:'a konyhasó oldódik vízben',c:'fiz'},{t:'a szárazjég szublimál',c:'fiz'},
      {t:'a magnézium ég',c:'kem'},{t:'a cukor karamellizálódik',c:'kem'},{t:'a hipermangán hevítve oxigént ad',c:'kem'},{t:'a papír ég',c:'kem'}] },

  { type:'drag', section:'Játék 3', title:'📦 Milyen módszerrel választjuk szét?',
    bins:[{id:'szit',name:'Szitálás',icon:'🔍'},{id:'ule',name:'Ülepítés',icon:'⏬'},{id:'kiold',name:'Kioldás',icon:'💧'},{id:'mag',name:'Mágnes',icon:'🧲'},{id:'bep',name:'Bepárlás / lepárlás',icon:'♨️'}],
    items:[{t:'homokos kavics: a kavics kiszedése',c:'szit'},{t:'iszapos víz: az iszap lesüllyed',c:'ule'},{t:'só és homok: a só kioldása vízzel',c:'kiold'},
      {t:'vasreszelék és kén: a vas kiemelése',c:'mag'},{t:'tengervízből só nyerése',c:'bep'},{t:'borból alkohol nyerése',c:'bep'}] },

  { type:'drag', section:'Játék 4', title:'📦 Exoterm vagy endoterm?',
    bins:[{id:'exo',name:'Exoterm (hő szabadul fel)',icon:'🔥'},{id:'endo',name:'Endoterm (hő elnyelődik)',icon:'❄️'}],
    items:[{t:'a magnézium égése',c:'exo'},{t:'a nátrium-hidroxid oldódása',c:'exo'},{t:'a hipermangán bomlása',c:'endo'},{t:'az ammónium-nitrát oldódása',c:'endo'}] },

  { type:'match', section:'Játék 5', title:'🔗 Párosítás: a levegő összetevői',
    pairs:[['nitrogén','78%'],['oxigén','21%'],['szén-dioxid','0,04%'],['nemesgázok','kb. 1%'],['légzéshez és égéshez kell','oxigén'],['közömbös alkotórész','nitrogén']] },

  { type:'cloze', section:'Játék 6', title:'✏️ Egészítsd ki a mondatot!',
    text:'Az oldat ___ és oldott anyagból áll. A legjobb oldószerünk a ___. A tömegszázalék az oldott anyag tömegének és az ___ tömegének hányadosa százszorosa. A lepárlás során a ___ forráspontú anyag távozik előbb.',
    answers:['oldószerből','víz','oldat','alacsonyabb'], extra:['magasabb','olaj','oldószer'],
    explain:'Oldat = oldószer + oldott anyag. Lepárláskor az alacsonyabb forráspontú anyag távozik előbb.' },

  /* ================= DOLGOZAT GYAKORLÓ ================= */
  { type:'cloze', section:'Dolgozat', title:'📝 1. Egészítsd ki a mondatokat!',
    text:'A ___ változás során új anyag keletkezik. Az ___ során két vagy több anyagból egy keletkezik. A ___ során egy anyagból több keletkezik. A hőt felszabadító folyamat az ___ változás. A szilárd anyag közvetlenül gázzá alakulása a ___.',
    answers:['kémiai','egyesülés','bomlás','exoterm','szublimáció'], extra:['fizikai','endoterm','olvadás'],
    explain:'A 2. fejezet fontos fogalmai.' },

  { type:'match', section:'Dolgozat', title:'📝 2. Kösd össze!',
    pairs:[['oldhatóság','100 g oldószerben feloldható anyag'],['telített oldat','több anyagot már nem old fel'],['bepárlás','az oldószert elpárologtatjuk'],['lepárlás','az illékony anyagot elforraljuk és lecsapatjuk'],['párlat','a lepárlás terméke']] },

  { type:'tf', section:'Dolgozat', title:'📝 3. Igaz vagy hamis?',
    items:[
      {t:'Az oldódás fizikai változás.', a:true, why:'Nem keletkezik új anyag, a részecskék elkeverednek.'},
      {t:'A magnézium égése bomlás.', a:false, why:'Egyesülés: a magnézium és az oxigén egy anyaggá, magnézium-oxiddá egyesül.'},
      {t:'A gázok oldhatósága melegítéskor nő.', a:false, why:'Melegítéskor a gázok oldhatósága csökken.'},
      {t:'A levegő legnagyobb része nitrogén.', a:true, why:'78% nitrogén, 21% oxigén.'},
      {t:'A vasat mágnessel ki lehet emelni egy keverékből.', a:true, why:'Mágneses elválasztás.'},
      {t:'A hipermangán bomlása exoterm folyamat.', a:false, why:'Endoterm: hőt vesz fel a környezetéből.'}
    ]},

  { type:'quiz', section:'Dolgozat', q:'4. Melyik fizikai tulajdonság?',
    options:['az olvadáspont','az, hogy az anyag ég','az, hogy bomlik hevítésre','az, hogy rozsdásodik'], correct:0, explain:'Az olvadáspont mérhető fizikai tulajdonság. A többi kémiai tulajdonság (átalakulás).', hint:'Melyik nem jár új anyag keletkezésével?' },
  { type:'quiz', section:'Dolgozat', q:'5. Mi a lepárlás alapja?',
    options:['az eltérő forráspont (illékonyság)','az eltérő szín','az eltérő mágnesesség','az eltérő méret'], correct:0, explain:'Az illékonyabb, alacsonyabb forráspontú anyag távozik előbb.', hint:'Forralunk, és lecsapatunk.' },
  { type:'quiz', section:'Dolgozat', q:'6. Melyik gáz táplálja az égést?',
    options:['oxigén','nitrogén','szén-dioxid','argon'], correct:0, explain:'Az égés elengedhetetlen feltétele az oxigén.', hint:'Ezt lélegezzük be.' },
  { type:'quiz', section:'Dolgozat', q:'7. Mi történik, ha kinyitunk egy szénsavas ásványvizes palackot?',
    options:['A nyomás csökken, a CO₂ egy része buborékként távozik.','A nyomás nő.','A víz megfagy.','Az oldódás megáll és a víz forr.'], correct:0, explain:'Kisebb nyomáson a gázok oldhatósága kisebb.', hint:'Nagyobb nyomáson több gáz oldódik.' },

  { type:'calc', section:'Dolgozat', count:6, gens:[
    function(){ var o=pick([100,200,400,500]), p=pick([2,5,10,20,25]);
      return {q:'<b>'+o+' g</b> oldat <b>'+p+' tömegszázalékos</b> sóoldat. <b>Hány gramm só van benne?</b> (g)', a:o*p/100, u:'g', hint:'m(oldott) = m(oldat) · tömeg% : 100.', explain:o+' · '+p+' : 100 = '+(o*p/100)+' g só.'}; },
    function(){ var o=pick([100,200,400,500]), p=pick([2,5,10,20,25]);
      return {q:'<b>'+o+' g</b> <b>'+p+' tömegszázalékos</b> oldatot készítünk sóból. <b>Hány gramm víz kell hozzá?</b> (g)', a:o-o*p/100, u:'g', hint:'Először számold ki a só tömegét, aztán vond ki az oldat tömegéből.', explain:'Só: '+(o*p/100)+' g, víz: '+o+' − '+(o*p/100)+' = '+(o-o*p/100)+' g.'}; },
    function(){ var o=pick([100,200,400]), p=pick([5,10,20,25]);
      return {q:'<b>'+(o*p/100)+' g</b> sót oldunk <b>'+(o-o*p/100)+' g</b> vízben. <b>Hány tömegszázalékos az oldat?</b> (%)', a:p, u:'%', hint:'Az oldat tömege = só + víz. Utána: só : oldat · 100.', explain:'Oldat: '+o+' g. '+(o*p/100)+' : '+o+' · 100 = '+p+' %.'}; },
    function(){ var n=pick([100,200,500]);
      return {q:'<b>'+n+' dm³</b> száraz levegőben körülbelül hány dm³ oxigén van? (21%) (dm³)', a:n*21/100, u:'dm³', hint:'A levegő 21 térfogatszázaléka oxigén.', explain:n+' · 0,21 = '+(n*21/100)+' dm³.'}; },
    function(){ var n=pick([100,200,500]);
      return {q:'<b>'+n+' dm³</b> száraz levegőben körülbelül hány dm³ nitrogén van? (78%) (dm³)', a:n*78/100, u:'dm³', hint:'A levegő 78 térfogatszázaléka nitrogén.', explain:n+' · 0,78 = '+(n*78/100)+' dm³.'}; },
    function(){ var m=pick([10,20,25,50]), w=pick([90,80,75,50]);
      return {q:'<b>'+m+' g</b> cukrot oldunk <b>'+w+' g</b> vízben. <b>Mekkora az oldat tömege?</b> (g)', a:m+w, u:'g', hint:'Az oldat tömege az alkotórészek tömegének összege.', explain:m+' + '+w+' = '+(m+w)+' g.'}; }
  ]},

  { type:'cards', section:'Ismétlés', title:'🃏 Kártyák – ismételd át!',
    cards:[
      ['Fizikai változás','A szerkezet változik, de nem keletkezik új anyag.'],
      ['Kémiai változás','A részecskék szerkezete is változik, új anyag keletkezik.'],
      ['Egyesülés','Két vagy több anyagból egy új anyag keletkezik.'],
      ['Bomlás','Egy anyagból két vagy több új anyag keletkezik.'],
      ['Exoterm és endoterm','Exoterm: hőt ad le. Endoterm: hőt vesz fel.'],
      ['Szublimáció','Szilárd → gáz, a folyadék kihagyásával (jód, szárazjég).'],
      ['Oldat','Oldószerből és oldott anyagból álló keverék.'],
      ['Tömegszázalék','Az oldott anyag tömege : az oldat tömege · 100.'],
      ['Oldhatóság','100 g oldószer hány gramm anyagot old fel adott hőmérsékleten.'],
      ['Telített oldat','Több anyagot már nem tud feloldani.'],
      ['Bepárlás és lepárlás','Bepárlás: oldószer elpárolog, szilárd anyag marad. Lepárlás: az illékony anyag lecsapatva párlatot ad.'],
      ['A levegő összetétele','78% N₂, 21% O₂, kb. 1% nemesgáz, 0,04% CO₂.']
    ]},

  { type:'end', section:'Kész!' }
  ]
};
(window.ALL = window.ALL || {})[window.LESSON.id] = window.LESSON;
})();
