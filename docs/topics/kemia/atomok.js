/* Kémia 7. – 3. fejezet: Az atomok felépítése (tankönyv 43–58. oldal) */
(function(){
var SV = window.SV, fmt = function(n){ return String(n).replace(/\B(?=(\d{3})+(?!\d))/g,' '); };
var pick = function(a){ return a[Math.floor(Math.random()*a.length)]; };
var row = SV.row, mini = SV.mini, grid = SV.grid;
var rnd = function(x){ return Math.round(x*10)/10; };

/* az első 20 elem: [rendszám, jel, név, relatív atomtömeg, héjak, főcsoport, csoportnév] */
var EL = [
 [1,'H','hidrogén',1.0,[1],1,'hidrogén'],[2,'He','hélium',4.0,[2],18,'nemesgáz'],
 [3,'Li','lítium',6.9,[2,1],1,'alkálifém'],[4,'Be','berillium',9.0,[2,2],2,'alkáliföldfém'],[5,'B','bór',10.8,[2,3],13,'földfém'],[6,'C','szén',12.0,[2,4],14,'széncsoport'],[7,'N','nitrogén',14.0,[2,5],15,'nitrogéncsoport'],[8,'O','oxigén',16.0,[2,6],16,'oxigéncsoport'],[9,'F','fluor',19.0,[2,7],17,'halogén'],[10,'Ne','neon',20.2,[2,8],18,'nemesgáz'],
 [11,'Na','nátrium',23.0,[2,8,1],1,'alkálifém'],[12,'Mg','magnézium',24.3,[2,8,2],2,'alkáliföldfém'],[13,'Al','alumínium',27.0,[2,8,3],13,'földfém'],[14,'Si','szilícium',28.1,[2,8,4],14,'széncsoport'],[15,'P','foszfor',31.0,[2,8,5],15,'nitrogéncsoport'],[16,'S','kén',32.1,[2,8,6],16,'oxigéncsoport'],[17,'Cl','klór',35.5,[2,8,7],17,'halogén'],[18,'Ar','argon',39.9,[2,8,8],18,'nemesgáz'],
 [19,'K','kálium',39.1,[2,8,8,1],1,'alkálifém'],[20,'Ca','kalcium',40.1,[2,8,8,2],2,'alkáliföldfém']
];
var GC = {'hidrogén':'#ffffff','alkálifém':'#ffb3ad','alkáliföldfém':'#ffd9a8','földfém':'#fdeeb0','széncsoport':'#d5f0cb','nitrogéncsoport':'#cdeeed','oxigéncsoport':'#d4e6fb','halogén':'#e6d9fb','nemesgáz':'#f3d4f0'};
var sup = function(n){ return String(n).replace(/\d/g,function(d){return '⁰¹²³⁴⁵⁶⁷⁸⁹'[d];}); };

var FIG = {
  models: SV.boxes('Az atommodellek fejlődése',[['Dalton','#fdeeb0'],['Thomson','#d5f0cb'],['Rutherford','#d4e6fb'],['Bohr','#e6d9fb']],'oszthatatlan → elektron → atommag → héjak'),
  atom: SV.atom('Az atom: atommag és elektronburok','C',[2,4],'6 proton + 6 neutron',6),
  na: SV.atom('Nátrium atom: 2, 8, 1','Na',[2,8,1],'1 vegyértékelektron',11),
  cl: SV.atom('Klór atom: 2, 8, 7','Cl',[2,8,7],'7 vegyértékelektron',17),
  parts: SV.boxes('Az atom részecskéi',[['proton: +','#ffb3ad'],['neutron: 0','#e8e8e8'],['elektron: −','#cfe9ff']],'proton és neutron az atommagban · elektron az elektronburokban'),
  iso: SV.svg('Izotópok: a hidrogén három változata',
    SV.r(15,40,88,60,'#ffffff')+SV.t(59,66,'H-1',14,'middle','#1b2618')+SV.t(59,86,'1 proton',11,'middle','#1b2618')+
    SV.r(116,40,88,60,'#ffffff')+SV.t(160,66,'H-2',14,'middle','#1b2618')+SV.t(160,86,'1 p + 1 n',11,'middle','#1b2618')+
    SV.r(217,40,88,60,'#ffffff')+SV.t(261,66,'H-3',14,'middle','#1b2618')+SV.t(261,86,'1 p + 2 n',11,'middle','#1b2618')+
    SV.t(160,125,'azonos protonszám, különböző neutronszám',11)),
  cell: SV.svg('A periódusos rendszer egy cellája',
    SV.r(100,15,120,110,'#e6d9fb')+SV.t(112,34,'11',13,'start','#1b2618')+SV.t(160,70,'Na',34,'middle','#1b2618')+SV.t(160,92,'nátrium',12,'middle','#1b2618')+SV.t(160,112,'23,0',12,'middle','#1b2618')+SV.t(60,34,'rendszám →',11,'middle')+SV.t(60,112,'rel. atomtömeg →',10,'middle')+SV.t(270,70,'← vegyjel',11,'middle')),
  mol: SV.tri('Anyagmennyiség: n egyenlő m osztva M-mel','m','n','M','n = m : M   m = n · M   N = n · 6·10²³'),
  mendel: SV.boxes('Periódus és csoport',[['periódus: vízszintes sor','#d4e6fb'],['csoport: függőleges oszlop','#d5f0cb']],'a periódusszám = az elektronhéjak száma')
};

window.LESSON = {
  id:'kemia-atomok',
  screens:[
  /* ================= VÁZLAT ================= */
  { type:'sheet', section:'Vázlat', title:'Az atom felépítése', sub:'Kémia 7. · 3. fejezet · 1. oldal', cards:[
    { n:1, c:1, title:'Az atom felfedezése – atommodellek',
      html:row(FIG.models,'<p>Az atom felépítését leíró elképzelések az <b>atommodellek</b>.</p>')+grid(
        mini('🏺 Démokritosz és Dalton','Az atomokat <b>oszthatatlannak</b> gondolták.'),
        mini('🔋 Thomson','Felfedezte az <b>elektront</b>: az atom osztható.'),
        mini('🎯 Rutherford','Kísérlettel igazolta az <b>atommag</b> létezését.'),
        mini('🪐 Bohr','Továbbfejlesztette: az elektronok <b>héjakon</b> mozognak.')),
      note:'A legkorszerűbb atommodell matematikai összefüggésekkel írja le az elektronfelhő felépítését.' },
    { n:2, c:2, title:'Az atom felépítése',
      html:row(FIG.atom,'<p>Az atom <b>atommagból</b> (proton + neutron) és <b>elektronburokból</b> (elektronok) áll.</p>')+row(FIG.parts,'')+grid(
        mini('🔢 Rendszám','Az atommagban lévő <b>protonok száma</b>. Egyértelműen megadja az atom kémiai minőségét. Semleges atomban = elektronok száma.'),
        mini('⚖️ Tömegszám','<b>Protonok + neutronok</b> száma. Neutronszám = tömegszám − rendszám.'),
        mini('🔀 Izotópok','Azonos protonszámú, de <b>különböző neutronszámú</b> atomok. Pl. H-1, H-2 (deutérium), H-3 (trícium), C-12, C-14.'),
        mini('📏 Relatív atomtömeg','Viszonyszám: hányszor nagyobb az atom tömege a <b>C-12 tömegének 1/12 részénél</b>.')),
      note:'Izotópok használata: C-14 régészeti kormeghatározás, U-235 atomerőmű, I-131 pajzsmirigy-kezelés. Hevesy György Nobel-díjas magyar tudós izotópokkal is dolgozott.' },
    { n:3, c:3, title:'Az atomok elektronszerkezete',
      html:row(FIG.na,'<p>Az elektronok az atommagtól különböző távolságban, <b>elektronhéjakon</b> vannak. Az elektronburok réteges.</p><p>Legfeljebb: <b>1. héj: 2</b>, <b>2. héj: 8</b>, <b>3. héj: 18</b> elektron.</p>')+grid(
        mini('🏷️ Vegyértékhéj','Az atom <b>legkülső</b> elektronhéja. Az itt lévő elektronok a <b>vegyértékelektronok</b>.'),
        mini('🔥 Lángfestés','A fémsók a lángot jellegzetesen megfestik (pl. a nátrium sárgára).')),
      note:'A kémiai reakciókban a vegyértékelektronok helyzete változik meg. Elektronszerkezet jelölése: 2) 8) 1) a nátriumnál.' }
  ]},

  { type:'sheet', section:'Vázlat', title:'Periódusos rendszer és anyagmennyiség', sub:'Kémia 7. · 3. fejezet · 2. oldal', cards:[
    { n:4, c:4, title:'Feltárul az elemek rendszere',
      html:row(FIG.mendel,'<p>Az elemeket többen is próbálták rendszerezni. <b>Döbereiner</b> hasonló tulajdonságú elemhármasokat alkotott. A nagy áttörést <b>Mengyelejev</b> hozta: az elemeket <b>növekvő atomtömeg</b> és <b>hasonló tulajdonságok</b> szerint rendezte.</p>'),
      note:'Pl. a nátrium és a kálium, a magnézium és a kalcium, a klór és a jód hasonló tulajdonságú, ezért egy-egy csoportba kerültek.' },
    { n:5, c:3, title:'Hogyan használjuk a periódusos rendszert?',
      html:row(FIG.cell,'<p>Egy cellában: <b>vegyjel</b>, <b>rendszám</b>, <b>relatív atomtömeg</b>, <b>elemnév</b>, gyakran az elektronszerkezet, az olvadáspont, a forráspont és az <b>elektronvonzó képesség</b> (0,7 – 4,0).</p>')+grid(
        mini('↔️ Periódus','A <b>vízszintes sor</b>. A periódus száma = az elektronhéjak száma.'),
        mini('↕️ Csoport','A <b>függőleges oszlop</b>. Az egy főcsoportban lévő atomok vegyértékelektronjainak száma egyenlő.'))+'<table class="sh-tbl" style="margin-top:10px"><tr><th>Főcsoport</th><th>Neve</th><th>Vegyértékelektron</th></tr><tr><td>1.</td><td>alkálifémek (Li, Na, K)</td><td>1</td></tr><tr><td>2.</td><td>alkáliföldfémek (Mg, Ca)</td><td>2</td></tr><tr><td>13.</td><td>földfémek (B, Al)</td><td>3</td></tr><tr><td>14.</td><td>széncsoport (C, Si)</td><td>4</td></tr><tr><td>15.</td><td>nitrogéncsoport (N, P)</td><td>5</td></tr><tr><td>16.</td><td>oxigéncsoport (O, S)</td><td>6</td></tr><tr><td>17.</td><td>halogének (F, Cl)</td><td>7</td></tr><tr><td>18.</td><td>nemesgázok (He, Ne, Ar)</td><td>8 (He: 2)</td></tr></table>',
      note:'Nemesgázszerkezet: a külső héjon 8 elektron (héliumnál 2) van, ez kis reakciókészséget jelent.' },
    { n:6, c:1, title:'Az anyagmennyiség',
      html:row(FIG.mol,'<p>Az anyagi halmaz részecskéinek számát az <b>anyagmennyiséggel</b> adjuk meg. Jele: <b>n</b>, mértékegysége a <b>mól</b>.</p><p><b>1 mól</b> anyag <b>6·10²³</b> részecskét tartalmaz (Avogadro-szám).</p>')+grid(
        mini('⚖️ Moláris tömeg (M)','1 mól anyag tömege, g/mol. Egy mól atom tömege grammban = a <b>relatív atomtömeg</b> számértéke. Pl. M(C) = 12 g/mol.'),
        mini('🧮 Képletek','<b>n = m : M</b><br><b>N = n · 6·10²³</b>')),
      note:'Példa: 6 g szén → n = 6 : 12 = 0,5 mol. 3 mol oxigéngáz → 3 · 6·10²³ = 18·10²³ molekula. 2,5 mol kén → m = 2,5 · 32 = 80 g.' }
  ]},

  /* ================= TANULÁS ================= */
  { type:'sim', section:'Tanulás', title:'⚛️ Fedezd fel a periódusos rendszert!',
    intro:'<b>Koppints egy elemre</b>, és megmutatja az atommodelljét, a rendszámát és az elektronszerkezetét. A színek a főcsoportokat jelölik.',
    src:'52–55. oldal',
    render:function(box, unlock){
      var cols=[1,2,13,14,15,16,17,18], rows=[[1,2],[3,10],[11,18],[19,20]];
      var wrap=FizEngine.el('div'), tbl=FizEngine.el('div','ptable'), info=FizEngine.el('div','pinfo');
      var byZ={}; EL.forEach(function(e){ byZ[e[0]]=e; });
      var heads=['1','2','13','14','15','16','17','18'];
      heads.forEach(function(h){ tbl.appendChild(FizEngine.el('div','phead',h)); });
      var grid=[]; for(var r=0;r<4;r++){ grid.push([null,null,null,null,null,null,null,null]); }
      EL.forEach(function(e){
        var per = e[4].length, ci = cols.indexOf(e[5]); if(e[0]===1) per=1; if(e[0]===2) per=1;
        if(e[0]===1) ci=0; if(e[0]===2) ci=7;
        grid[per-1][ci]=e;
      });
      var sel=null;
      function show(e, b){
        if(sel) sel.classList.remove('sel'); sel=b; b.classList.add('sel');
        info.innerHTML=SV.atom('Az '+e[2]+' atom modellje',e[1],e[4],e[6]+' · '+e[5]+'. főcsoport',e[0])+
          '<div class="pdata"><b>'+e[2]+' ('+e[1]+')</b><br>rendszám: <b>'+e[0]+'</b> (= '+e[0]+' proton és '+e[0]+' elektron)<br>relatív atomtömeg: <b>'+String(e[3]).replace('.',',')+'</b><br>elektronszerkezet: <b>'+e[4].join(') ')+')</b><br>vegyértékelektron: <b>'+(e[4][e[4].length-1])+'</b></div>';
        unlock();
      }
      grid.forEach(function(rw){ rw.forEach(function(e){
        if(!e){ tbl.appendChild(FizEngine.el('div','pempty','')); return; }
        var b=FizEngine.el('button','pel','<span class="pz">'+e[0]+'</span><b>'+e[1]+'</b>'); b.type='button'; b.style.background=GC[e[6]]; b.dataset.z=e[0];
        b.setAttribute('aria-label',e[2]);
        b.onclick=function(){ show(e,b); };
        tbl.appendChild(b);
      }); });
      var leg=FizEngine.el('p','hint','H: hidrogén · piros: alkálifémek · narancs: alkáliföldfémek · sárga: földfémek · zöld: széncsoport · türkiz: nitrogéncsoport · kék: oxigéncsoport · lila: halogének · rózsaszín: nemesgázok');
      info.innerHTML='<p class="hint">👆 Koppints egy elemre!</p>';
      [tbl,leg,info].forEach(function(n){ wrap.appendChild(n); }); box.appendChild(wrap);
    }},

  { type:'info', section:'Tanulás', icon:'🧱', title:'Az atom három részecskéje', fig:FIG.parts,
    body:'<ul><li><mark class="e1">Proton (+)</mark>: az <b>atommagban</b> van. A számuk a <b>rendszám</b>.</li><li><mark class="k">Neutron (0)</mark>: az <b>atommagban</b> van, nincs töltése.</li><li><mark class="e5">Elektron (−)</mark>: az <b>elektronburokban</b> mozog, héjakon.</li></ul><p>A <b>semleges atomban</b> ugyanannyi proton van, mint elektron. Ezért nincs kifelé töltése.</p><p><b>Példa:</b> a klór rendszáma 17 → 17 proton, 17 elektron. A relatív atomtömege kb. 35 → a neutronok száma kb. 35 − 17 = 18.</p>',
    mc:'<p>Gondolj úgy az atomra, mint egy Minecraft-faluba: a falu közepén egy tömör épület (atommag), körülötte kis lakók (elektronok) járnak különböző körökön.</p>',
    tip:'<p>A rendszám dönti el, <b>melyik elem</b> az atom. 6 proton: mindig szén. 8 proton: mindig oxigén.</p>',
    src:'46–47. oldal' },

  { type:'info', section:'Tanulás', icon:'🔀', title:'Izotópok', fig:FIG.iso,
    body:'<p>Az <mark class="k">izotópok</mark> olyan atomok, amelyek <b>protonszáma azonos</b>, de a <b>neutronszámuk különböző</b>.</p><p><b>A hidrogén izotópjai:</b></p><ul><li>H-1 (prócium): 1 proton, 0 neutron</li><li>H-2 (deutérium): 1 proton, 1 neutron</li><li>H-3 (trícium): 1 proton, 2 neutron</li></ul><p>Az izotóp szó jelentése „azonos hely”: a periódusos rendszer ugyanazon cellájába tartoznak.</p>',
    tip:'<p>C-14: régészeti leletek korának meghatározása. U-235: atomerőmű. I-131: pajzsmirigybetegségek kezelése. Co-60: sugárterápia.</p>',
    src:'46–47. oldal' },

  { type:'info', section:'Tanulás', icon:'🧮', title:'Anyagmennyiség lépésről lépésre', fig:FIG.mol,
    body:'<p><b>Feladat:</b> hány mól 6 g szén? (M = 12 g/mol)</p><ol><li>Írd fel a képletet: <b>n = m : M</b></li><li>Helyettesíts: n = 6 g : 12 g/mol</li><li>Eredmény: <b>n = 0,5 mol</b></li></ol><p><b>Hány molekula 3 mol oxigén?</b></p><ol><li>N = n · 6·10²³</li><li>N = 3 · 6·10²³ = <b>18·10²³</b> molekula</li></ol><p><b>Hány gramm 2,5 mol kén?</b> m = n · M = 2,5 · 32 = <b>80 g</b>.</p>',
    tip:'<p>Segít a háromszög: takard le, amit keresel. Fent m, lent n és M. Az 1 mól anyag tömege mindig az M értéke grammban.</p>',
    src:'54–55. oldal' },

  /* ================= JÁTÉKOK ================= */
  { type:'memory', section:'Játék 1', title:'🧠 Tudósok memória',
    pairs:[['Démokritosz','oszthatatlan atom'],['Thomson','felfedezte az elektront'],['Rutherford','igazolta az atommagot'],['Bohr','héjas atommodell'],['Mengyelejev','periódusos rendszer'],['Döbereiner','elemhármasok']] },

  { type:'drag', section:'Játék 2', title:'📦 Proton, neutron vagy elektron?',
    bins:[{id:'p',name:'Proton',icon:'➕'},{id:'n',name:'Neutron',icon:'⚪'},{id:'e',name:'Elektron',icon:'➖'}],
    items:[{t:'pozitív töltésű',c:'p'},{t:'a számuk a rendszám',c:'p'},{t:'töltés nélküli',c:'n'},{t:'az atommagban van, nincs töltése',c:'n'},
      {t:'negatív töltésű',c:'e'},{t:'a héjakon mozog',c:'e'},{t:'vegyértékelektronnak is hívjuk',c:'e'}] },

  { type:'drag', section:'Játék 3', title:'📦 Melyik főcsoport?',
    bins:[{id:'alk',name:'Alkálifém',icon:'🧂'},{id:'hal',name:'Halogén',icon:'🟣'},{id:'nem',name:'Nemesgáz',icon:'💤'},{id:'oxi',name:'Oxigéncsoport',icon:'🫁'}],
    items:[{t:'Na',c:'alk'},{t:'K',c:'alk'},{t:'Li',c:'alk'},{t:'Cl',c:'hal'},{t:'F',c:'hal'},{t:'He',c:'nem'},{t:'Ne',c:'nem'},{t:'Ar',c:'nem'},{t:'O',c:'oxi'},{t:'S',c:'oxi'}] },

  { type:'match', section:'Játék 4', title:'🔗 Párosítás: hány vegyértékelektron?',
    pairs:[['Na (alkálifém)','1'],['Mg (alkáliföldfém)','2'],['Al (földfém)','3'],['C (széncsoport)','4'],['N (nitrogéncsoport)','5'],['Cl (halogén)','7']] },

  { type:'match', section:'Játék 5', title:'🔗 Párosítás: fogalmak',
    pairs:[['rendszám','a protonok száma'],['tömegszám','protonok + neutronok'],['izotópok','azonos protonszám, más neutronszám'],['periódus','a vízszintes sor'],['csoport','a függőleges oszlop'],['mól','6·10²³ részecske']] },

  { type:'cloze', section:'Játék 6', title:'✏️ Egészítsd ki a mondatot!',
    text:'Az atommagban ___ és neutronok vannak. A rendszám a ___ száma. Az első elektronhéjon legfeljebb ___ elektron lehet. 1 mól anyagban ___ részecske van.',
    answers:['protonok','protonok','2','6·10²³'], extra:['elektronok','8','18'],
    explain:'A rendszám a protonok száma. 1 mól anyag 6·10²³ részecskét tartalmaz.' },

  /* ================= DOLGOZAT GYAKORLÓ ================= */
  { type:'cloze', section:'Dolgozat', title:'📝 1. Egészítsd ki a mondatokat!',
    text:'A ___ az atommagban található protonok száma. A tömegszám a protonok és ___ számának összege. Az ___ azonos protonszámú, de különböző neutronszámú atomok. Az atom legkülső elektronhéja a ___. A periódusos rendszer vízszintes sora a ___.',
    answers:['rendszám','neutronok','izotópok','vegyértékhéj','periódus'], extra:['csoport','elektronok','tömegszám'],
    explain:'A 3. fejezet fontos fogalmai.' },

  { type:'match', section:'Dolgozat', title:'📝 2. Kösd össze a főcsoportot a nevével!',
    pairs:[['1. főcsoport','alkálifémek'],['2. főcsoport','alkáliföldfémek'],['16. főcsoport','oxigéncsoport'],['17. főcsoport','halogének'],['18. főcsoport','nemesgázok']] },

  { type:'tf', section:'Dolgozat', title:'📝 3. Igaz vagy hamis?',
    items:[
      {t:'A semleges atomban a protonok és az elektronok száma egyenlő.', a:true, why:'Ezért nincs kifelé töltése.'},
      {t:'Az izotópoknak különböző a protonszámuk.', a:false, why:'Azonos a protonszámuk, a neutronszámuk különbözik.'},
      {t:'A második elektronhéjon legfeljebb 8 elektron lehet.', a:true, why:'1. héj: 2, 2. héj: 8, 3. héj: 18.'},
      {t:'A periódusszám az elektronhéjak számát mutatja.', a:true, why:'A 3. periódus elemei 3 elektronhéjjal rendelkeznek.'},
      {t:'A nemesgázok nagyon reakcióképesek.', a:false, why:'A nemesgázszerkezet miatt kis reakciókészségűek.'},
      {t:'Az anyagmennyiség mértékegysége a mól.', a:true, why:'1 mól = 6·10²³ részecske.'}
    ]},

  { type:'quiz', section:'Dolgozat', q:'4. Legfeljebb hány elektron fér a harmadik elektronhéjra?',
    options:['18','8','2','32'], correct:0, explain:'1. héj: 2, 2. héj: 8, 3. héj: 18 elektron.', hint:'2 – 8 – 18.' },
  { type:'quiz', section:'Dolgozat', q:'5. Mit mutat meg a rendszám?',
    options:['a protonok számát','a neutronok számát','a tömegszámot','a héjak számát'], correct:0, explain:'A rendszám az atommagban lévő protonok száma, ez határozza meg az elemet.', hint:'Az atommag pozitív töltésű részecskéi.' },
  { type:'quiz', section:'Dolgozat', q:'6. Hány vegyértékelektronja van a klóratomnak (rendszám 17, 2) 8) 7))?',
    options:['7','17','8','2'], correct:0, explain:'A legkülső héján 7 elektron van.', hint:'Nézd a legutolsó számot.' },
  { type:'quiz', section:'Dolgozat', q:'7. Melyik tudós igazolta az atommag létezését?',
    options:['Rutherford','Thomson','Démokritosz','Mengyelejev'], correct:0, explain:'Rutherford kísérlete igazolta az atommag létezését.', hint:'A vékony aranyfóliás kísérlet.' },

  { type:'calc', section:'Dolgozat', count:7, gens:[
    function(){ var p=pick([[6,12],[6,14],[8,16],[11,23],[17,35],[20,40],[15,31],[13,27]]);
      return {q:'Egy atom rendszáma <b>'+p[0]+'</b>, tömegszáma <b>'+p[1]+'</b>. <b>Hány neutron van az atommagjában?</b>', a:p[1]-p[0], u:'db', hint:'Neutronszám = tömegszám − rendszám.', explain:p[1]+' − '+p[0]+' = '+(p[1]-p[0])+' neutron.'}; },
    function(){ var e=pick(EL.filter(function(x){return x[0]>2;}));
      return {q:'A(z) <b>'+e[2]+'</b> ('+e[1]+') rendszáma <b>'+e[0]+'</b>. <b>Hány elektron van a semleges atomban?</b>', a:e[0], u:'db', hint:'Semleges atomban az elektronok száma = a protonok száma = a rendszám.', explain:'Ugyanannyi, mint a rendszám: '+e[0]+' elektron.'}; },
    function(){ var e=pick(EL.filter(function(x){return x[0]>2;}));
      return {q:'A(z) <b>'+e[2]+'</b> ('+e[1]+') elektronszerkezete: <b>'+e[4].join(') ')+')</b>. <b>Hány vegyértékelektronja van?</b>', a:e[4][e[4].length-1], u:'db', hint:'A legkülső (utolsó) héjon lévő elektronok száma.', explain:'A legkülső héjon '+e[4][e[4].length-1]+' elektron van.'}; },
    function(){ var a=pick([['C',12],['O',16],['S',32],['Na',23],['Mg',24],['Fe',56]]), k=pick([0.5,1,2,3,5]);
      return {q:'<b>'+String(a[1]*k).replace('.',',')+' g</b> '+a[0]+'. <b>Hány mól ez?</b> (M('+a[0]+') = '+a[1]+' g/mol) (mol)', a:k, u:'mol', tol:0.01, hint:'n = m : M.', explain:String(a[1]*k).replace('.',',')+' : '+a[1]+' = '+String(k).replace('.',',')+' mol.'}; },
    function(){ var a=pick([['C',12],['O',16],['S',32],['Na',23],['Mg',24],['Fe',56]]), k=pick([2,3,4,5]);
      return {q:'<b>'+k+' mol</b> '+a[0]+'. <b>Hány gramm ez?</b> (M('+a[0]+') = '+a[1]+' g/mol) (g)', a:a[1]*k, u:'g', hint:'m = n · M.', explain:k+' · '+a[1]+' = '+(a[1]*k)+' g.'}; },
    function(){ var n=pick([1,2,3,5]);
      return {q:'<b>'+n+' mol</b> anyagban hány db részecske van? Add meg a szorzót: <b>? · 10²³</b> (1 mol = 6·10²³ részecske)', a:6*n, u:'(·10²³ db)', hint:'N = n · 6·10²³.', explain:n+' · 6·10²³ = '+(6*n)+'·10²³ részecske.'}; },
    function(){ var m=pick([['H₂O',18],['CO₂',44],['CH₄',16],['O₂',32],['H₂',2],['SO₂',64],['NH₃',17]]);
      return {q:'<b>Mekkora a(z) '+m[0]+' moláris tömege?</b> (H = 1, C = 12, N = 14, O = 16, S = 32 g/mol) (g/mol)', a:m[1], u:'g/mol', hint:'Add össze az atomok moláris tömegét a képlet alsó indexei szerint.', explain:'A(z) '+m[0]+' moláris tömege '+m[1]+' g/mol.'}; }
  ]},

  { type:'cards', section:'Ismétlés', title:'🃏 Kártyák – ismételd át!',
    cards:[
      ['Mi van az atommagban?','Protonok (+) és neutronok (0).'],
      ['Rendszám','A protonok száma, ez adja meg az atom kémiai minőségét.'],
      ['Tömegszám','Protonok + neutronok száma.'],
      ['Izotópok','Azonos protonszám, különböző neutronszám.'],
      ['Elektronhéjak kapacitása','1. héj: 2, 2. héj: 8, 3. héj: 18 elektron.'],
      ['Vegyértékelektron','Az atom külső héján lévő elektron.'],
      ['Nemesgázszerkezet','A külső héjon 8 (hélium: 2) elektron: kis reakciókészség.'],
      ['Periódus és csoport','Periódus: vízszintes sor. Csoport: függőleges oszlop.'],
      ['Főcsoportok','Alkálifémek, alkáliföldfémek, földfémek, széncsoport, nitrogéncsoport, oxigéncsoport, halogének, nemesgázok.'],
      ['Mól','Az anyagmennyiség egysége. 1 mól = 6·10²³ részecske.'],
      ['Moláris tömeg','1 mól tömege, g/mol. M számértéke = a relatív atomtömeg.'],
      ['Anyagmennyiség képletei','n = m : M és N = n · 6·10²³']
    ]},

  { type:'end', section:'Kész!' }
  ]
};
})();
