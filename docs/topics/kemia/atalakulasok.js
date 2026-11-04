/* Kémia 7. – 5. fejezet: A kémiai átalakulások (tankönyv 89–114. oldal) */
(function(){
var SV = window.SV, fmt = function(n){ return String(n).replace(/\B(?=(\d{3})+(?!\d))/g,' '); };
var pick = function(a){ return a[Math.floor(Math.random()*a.length)]; };
var row = SV.row, mini = SV.mini, grid = SV.grid;

/* molekulák atomtartalma az egyenletrendezőhöz */
var M = {
 'H₂':{H:2},'O₂':{O:2},'N₂':{N:2},'Cl₂':{Cl:2},'C':{C:1},'Mg':{Mg:1},'Na':{Na:1},'Al':{Al:1},
 'H₂O':{H:2,O:1},'CO₂':{C:1,O:2},'MgO':{Mg:1,O:1},'NaCl':{Na:1,Cl:1},'NH₃':{N:1,H:3},'CH₄':{C:1,H:4},
 'Al₂O₃':{Al:2,O:3},'H₂O₂':{H:2,O:2},'HCl':{H:1,Cl:1},'NaOH':{Na:1,O:1,H:1},'KMnO₄':{K:1,Mn:1,O:4},'K₂MnO₄':{K:2,Mn:1,O:4},'MnO₂':{Mn:1,O:2},'Ca':{Ca:1},'CaO':{Ca:1,O:1},'H₂SO₄':{H:2,S:1,O:4},'Na₂SO₄':{Na:2,S:1,O:4}
};
var sp = function(n){ return [n, M[n]]; };
var EQ = function(L,R,note){ return {L:L.map(sp),R:R.map(sp),note:note}; };

var PH = [
 [0,'akkumulátorsav','#e02a2a'],[1,'tömény sósav','#e8402a'],[2,'citromlé, gyomorsav','#f06a2a'],[3,'ecet','#f59a2a'],[4,'paradicsomlé','#f5c52a'],[5,'fekete kávé','#e0d82a'],[6,'tej','#b4d62a'],
 [7,'tiszta víz','#4cc04c'],[8,'szódabikarbóna-oldat','#2ab89a'],[9,'fogkrém','#2a9ad6'],[10,'szappan','#2a6ad6'],[11,'háztartási ammónia','#4a4ad6'],[12,'mészvíz','#6a3ad0'],[13,'híg lúgkő-oldat','#7a2ac0'],[14,'tömény lúgkő','#8a1aa8']
];

var FIG = {
  react: SV.flow('A kémiai reakció: kiindulási anyagok → termékek',[['kiindulási anyagok','#d5f0cb'],['termékek','#ffd23f']],['reakció'],'az atomok átrendeződnek, új anyag keletkezik'),
  collision: SV.svg('Hatásos ütközés: megfelelő irány és elegendő energia',
    '<circle cx="80" cy="70" r="20" fill="#e0524f" stroke="#1b2618" stroke-width="3"/><circle cx="240" cy="70" r="20" fill="#4f86e0" stroke="#1b2618" stroke-width="3"/>'+SV.arrow(110,70,150,'#2f7fd1')+'<line x1="210" y1="70" x2="170" y2="70" stroke="#d6403f" stroke-width="5"/><polygon points="160,70 178,60 178,80" fill="#d6403f"/>'+SV.t(160,120,'ha elég az energia és jó az irány: reakció',11)),
  catalyst: SV.flow('Katalizátor: gyorsít, de változatlanul visszamarad',[['H₂O₂','#d5f0cb'],['H₂O + O₂','#ffd23f']],['MnO₂'],'a barnakő (MnO₂) katalizátor a hidrogén-peroxid bomlásához'),
  mass: SV.svg('A tömegmegmaradás törvénye',
    SV.r(30,50,100,50,'#d5f0cb')+SV.t(80,80,'24 g Mg + 16 g O',11,'middle','#1b2618')+SV.arrow(135,75,185,'#2f7fd1')+SV.r(190,50,100,50,'#ffd23f')+SV.t(240,80,'40 g MgO',12,'middle','#1b2618')+SV.t(160,130,'a tömegek összege nem változik',12)),
  fire: SV.boxes('A gyors égés három feltétele',[['éghető anyag','#ffd9d6'],['gyulladási hőm.','#fdeeb0'],['oxigén','#cfe9ff']],'mind a három kell: ha egyet elveszünk, kialszik'),
  oxred: SV.flow('Oxidáció és redukció',[['oxidáció','#ffd9d6'],['redukció','#cfe9ff']],['egyszerre'],'oxigénfelvétel/-leadás · elektronleadás/-felvétel'),
  redox: SV.svg('Redoxireakció: 2 Mg + O₂ → 2 MgO',
    SV.r(20,35,115,45,'#ffd9d6')+SV.t(77,57,'Mg: elektront ad le',11,'middle','#1b2618')+SV.t(77,72,'OXIDÁCIÓ',10,'middle','#1b2618')+SV.arrow(140,57,180,'#2f7fd1')+SV.t(160,45,'e⁻',13)+
    SV.r(185,35,115,45,'#cfe9ff')+SV.t(242,57,'O: elektront vesz fel',11,'middle','#1b2618')+SV.t(242,72,'REDUKCIÓ',10,'middle','#1b2618')+SV.t(160,120,'a kettő mindig egyszerre történik',12)),
  ph: SV.svg('A pH-skála: 0–7 savas, 7 semleges, 7–14 lúgos',
    PH.map(function(p,i){ return SV.r(10+i*20.5,45,20.5,40,p[2]).replace('stroke-width="3"','stroke-width="1"')+SV.t(20+i*20.5,70,p[0],9,'middle','#fff'); }).join('')+
    SV.t(60,35,'SAVAS',12,'middle')+SV.t(160,35,'SEMLEGES',11,'middle')+SV.t(260,35,'LÚGOS',12,'middle')+SV.t(160,115,'pH-érték: az oldat kémhatásának számszerű jellemzője',11)),
  acidbase: SV.svg('Sav-bázis reakció: hidrogénion (H⁺) átadása',
    SV.r(20,40,110,50,'#ffd9d6')+SV.t(75,60,'SAV',14,'middle','#1b2618')+SV.t(75,78,'leadja a H⁺-t',10,'middle','#1b2618')+SV.arrow(135,65,185,'#2f7fd1')+SV.t(160,52,'H⁺',14)+
    SV.r(190,40,110,50,'#cfe9ff')+SV.t(245,60,'BÁZIS',14,'middle','#1b2618')+SV.t(245,78,'felveszi a H⁺-t',10,'middle','#1b2618')+SV.t(160,125,'oxóniumion H₃O⁺ · hidroxidion OH⁻',12)),
  neutral: SV.flow('Közömbösítés',[['sav','#ffd9d6'],['lúg','#cfe9ff'],['só + víz','#d5f0cb']],['+','→'],'HCl + NaOH → NaCl + H₂O'),
  calc: SV.svg('Számítás a reakcióegyenlet alapján: S + O₂ → SO₂',
    '<line x1="20" y1="45" x2="300" y2="45" stroke="currentColor" stroke-width="2"/>'+SV.t(60,35,'S',14,'middle')+SV.t(120,35,'+  O₂',14,'middle')+SV.t(250,35,'→  SO₂',14,'middle')+
    SV.t(60,70,'1 mol',12,'middle')+SV.t(135,70,'1 mol',12,'middle')+SV.t(250,70,'1 mol',12,'middle')+SV.t(60,95,'32 g',12,'middle')+SV.t(135,95,'32 g',12,'middle')+SV.t(250,95,'64 g',12,'middle')+SV.t(160,135,'n = m : M  ·  az arányok az együtthatókból jönnek',11))
};

window.LESSON = {
  id:'kemia-atalakulasok',
  screens:[
  /* ================= VÁZLAT ================= */
  { type:'sheet', section:'Vázlat', title:'A kémiai reakciók', sub:'Kémia 7. · 5. fejezet · 1. oldal', cards:[
    { n:1, c:1, title:'A kémiai reakciók általános jellemzése',
      html:row(FIG.collision,'<p>A kémiai reakcióban a <b>kiindulási anyagok</b>ból <b>termékek</b> keletkeznek. A részecskéknek <b>hatásosan</b> kell ütközniük: megfelelő irányból és elegendő energiával.</p>')+grid(
        mini('⏩ Katalizátor','Megnöveli a reakció sebességét, de a végén <b>változatlan minőségben és mennyiségben</b> visszamarad. Pl. a barnakő (MnO₂) a hidrogén-peroxid bomlásánál.'),
        mini('🧬 Enzim','Az <b>élő szervezetek katalizátora</b>. Pl. az emésztőenzimek bontják a tápanyagokat.')),
      note:'Melegítéssel a reakció felgyorsítható, mert több részecske rendelkezik elég energiával a hatásos ütközéshez.' },
    { n:2, c:2, title:'A kémiai reakciók csoportosítása',
      html:'<p>Egy reakció többféle csoportba is besorolható:</p>'+grid(
        mini('🧪 Anyagok száma','<b>Egyesülés</b>: több anyagból egy. <b>Bomlás</b>: egy anyagból több.'),
        mini('🌡️ Hőváltozás','<b>Exoterm</b>: hőt ad le. <b>Endoterm</b>: hőt vesz fel.'),
        mini('⏱️ Lejátszódási idő','Gyors vagy lassú reakció.'),
        mini('🧊 Csapadékképződés','A <b>csapadék</b> vizes oldatban keletkező, vízben rosszul oldódó szilárd anyag.')) },
    { n:3, c:3, title:'Egyenlőségek a kémiában: a reakcióegyenlet',
      html:row(FIG.mass,'<p><b>Tömegmegmaradás törvénye:</b> a kiindulási anyagok tömegének összege egyenlő a termékek tömegének összegével.</p><p>A <b>reakcióegyenlet</b> az átalakulás minőségi és mennyiségi leírása. Mindig balról jobbra olvassuk.</p>')+grid(
        mini('1️⃣ Anyagok','Határozd meg a kiindulási anyagokat és a termékeket.'),
        mini('2️⃣ Felírás','Írd fel kémiai jelekkel: H₂ + O₂ → H₂O'),
        mini('3️⃣ Rendezés','Add meg a <b>számokat az anyagok elé</b>, hogy minden atomból ugyanannyi legyen mindkét oldalon: <b>2 H₂ + O₂ → 2 H₂O</b>')),
      note:'Az alsó index a molekulán belüli atomszámot mutatja, az anyag elé írt szám (együttható) a molekulák számát. Példák: C + O₂ → CO₂ · CH₄ + 2 O₂ → CO₂ + 2 H₂O · 2 KMnO₄ → K₂MnO₄ + MnO₂ + O₂.' }
  ]},

  { type:'sheet', section:'Vázlat', title:'Égés, oxidáció és redukció', sub:'Kémia 7. · 5. fejezet · 2. oldal', cards:[
    { n:4, c:5, title:'Az égés',
      html:row(FIG.fire,'<p>Az <b>égés</b> az anyagok <b>oxigénnel való reakciója</b>.</p>')+grid(
        mini('🔥 Gyors égés','Hő- és fényjelenség kíséri, a hő gyorsan átadódik a környezetnek.'),
        mini('🐢 Lassú égés','A <b>gyulladási hőmérséklet alatt</b> történik, <b>fényjelenség nincs</b>, a hőleadás nagyon lassú.'),
        mini('✅ Tökéletes égés','A termékek <b>tovább nem éghetők</b> (pl. CO₂, H₂O).'),
        mini('⚠️ Tökéletlen égés','A termékek között <b>éghető anyag</b> is van (pl. szén-monoxid, korom).')),
      note:'Tűzoltás: a gyors égés három feltételéből legalább egyet meg kell szüntetni (az éghető anyagot eltávolítani, az oxigént elzárni, vagy a gyulladási hőmérséklet alá hűteni).' },
    { n:5, c:2, title:'Az oxidáció és a redukció',
      html:row(FIG.oxred,'<p><b>Köznapi értelemben:</b></p><p><b>Oxidáció</b>: az anyag oxigént vesz fel.<br><b>Redukció</b>: az anyag oxigént ad le.</p>')+grid(
        mini('🟥 Oxidálószer','Oxigént ad át más anyagoknak.'),
        mini('🟦 Redukálószer','Oxigént vesz fel más anyagoktól.')),
      note:'Az oxidáció és a redukció mindig egyszerre megy végbe (redoxireakció). A legismertebb redoxireakciók: az égés és a fémek ipari előállítása.' },
    { n:6, c:3, title:'A redoxireakciók: elektronátadás',
      html:row(FIG.redox,'<p><b>Pontosabban:</b> az elektronátadással járó reakció a <b>redoxireakció</b>.</p><p><b>Oxidáció</b>: elektron<b>leadás</b>. <b>Redukció</b>: elektron<b>felvétel</b>.</p>')+grid(
        mini('💪 Jó oxidálószer','az oxigén és a klór'),
        mini('🧲 Jó redukálószer','a magnézium és a hidrogén')),
      note:'Ha egy reakcióban a kiindulási anyagok vagy a termékek között elem szerepel, az jellemzően redoxireakció.' }
  ]},

  { type:'sheet', section:'Vázlat', title:'Savak, bázisok és számítások', sub:'Kémia 7. · 5. fejezet · 3. oldal', cards:[
    { n:7, c:4, title:'Az oldatok kémhatása és a pH-skála',
      html:row(FIG.ph,'<p>A vizes oldatok <b>kémhatása</b>: savas, semleges vagy lúgos.</p>')+grid(
        mini('🍋 Savas','Savanyú íz, tömény oldatban maró. pH: <b>0–7</b>'),
        mini('💧 Semleges','A víz. pH: <b>7</b>'),
        mini('🧼 Lúgos','A bőrt síkossá teszi, tömény oldata maró. pH: <b>7–14</b>'),
        mini('🎨 Indikátorok','Jellemző színnel jelzik a kémhatást: <b>lakmusz</b>, <b>fenolftalein</b>, <b>univerzális indikátor</b>.')),
      note:'Lakmusz: savban piros, lúgban kék. Fenolftalein: lúgban rózsaszín (bíbor), savban és semlegesben színtelen. Az univerzális indikátor színskálát ad.' },
    { n:8, c:5, title:'A sav-bázis reakciók értelmezése',
      html:row(FIG.acidbase,'<p><b>Brønsted szerint</b> a hidrogénion (H⁺) átadásával járó reakció a sav-bázis reakció.</p><p><b>Sav</b>: leadja a H⁺-t. <b>Bázis</b>: felveszi a H⁺-t.</p>')+grid(
        mini('➕ Oxóniumion (H₃O⁺)','A <b>savoldatok</b> jellemző részecskéje.'),
        mini('➖ Hidroxidion (OH⁻)','A <b>lúgoldatok</b> jellemző részecskéje.')),
      note:'Egyes részecskék (pl. a vízmolekula) savként és bázisként is viselkedhetnek: ez a reakciópartnertől függ.' },
    { n:9, c:6, title:'Savak és bázisok a mindennapokban',
      html:grid(
        mini('🍋 Köznapi értelmezés','A <b>sav</b> vizes oldata savas, a <b>bázis</b> vizes oldata lúgos kémhatású.'),
        mini('💪 Erősség','<b>Erős sav</b>: könnyen adja át a H⁺-t a víznek. <b>Gyenge sav</b>: nehezen. Az <b>erős bázis</b> sok hidroxidiont juttat az oldatba.'),
        mini('🔢 Értékűség','Megadja, hogy a sav egy részecskéje hány H⁺ leadására képes. HCl: 1, H₂SO₄: 2, H₃PO₄: 3.'),
        mini('🧪 Példák','Savak: sósav (HCl), kénsav (H₂SO₄), salétromsav (HNO₃), szénsav (H₂CO₃). Bázisok: nátrium-hidroxid (NaOH), kálium-hidroxid (KOH), ammónia (NH₃).')),
      note:'A savmaradékion a savból H⁺ leadással keletkező anion (pl. a sósavból Cl⁻).' },
    { n:10, c:2, title:'A közömbösítés',
      html:row(FIG.neutral,'<p>A <b>közömbösítés</b>: a sav és a lúg kölcsönhatásakor <b>só és víz</b> keletkezik.</p><p>Az oxóniumionok és a hidroxidionok vizet alkotnak.</p>')+grid(
        mini('🧂 Példa','HCl + NaOH → NaCl + H₂O<br><small>sósav + nátrium-hidroxid → konyhasó + víz</small>'),
        mini('🤢 Gyomorégés','A gyomorsav (pH kb. 2) fölöslegét <b>szódabikarbónával</b> (NaHCO₃) vagy karbonátokkal (CaCO₃, MgCO₃) köthetjük meg.')),
      note:'A csalán mirigyszőrei savat tartalmaznak, ezért égetnek. Az ilyen szúrásokat enyhén lúgos anyaggal lehet enyhíteni.' },
    { n:11, c:1, title:'Kémiai számítások a reakcióegyenlet alapján',
      html:row(FIG.calc,'<p>Az egyenlet együtthatói megadják az <b>anyagmennyiségek (mol)</b> arányát. A tömeget az <b>m = n · M</b> összefüggéssel kapjuk.</p>')+grid(
        mini('1️⃣ Egyenlet','Írd fel a rendezett reakcióegyenletet.'),
        mini('2️⃣ Adatok','Válaszd ki, mely anyagok milyen adata kell (n, M, m).'),
        mini('3️⃣ Beírás','Írd az egyenlet alá a feladat adatait.'),
        mini('4️⃣ Arányok','Számold ki következtetéssel vagy képlettel.')),
      note:'Példa: S + O₂ → SO₂. 1 mol (32 g) kénből 1 mol (64 g) kén-dioxid lesz. 10 mol kénből 640 g keletkezik.' }
  ]},

  /* ================= TANULÁS (interaktív) ================= */
  { type:'balance', section:'Tanulás', title:'⚖️ Rendezd az egyenleteket! (1. szint)',
    eqs:[
      EQ(['H₂','O₂'],['H₂O'],'2 H₂ + O₂ → 2 H₂O. Minden atomból ugyanannyi van mindkét oldalon.'),
      EQ(['Mg','O₂'],['MgO'],'2 Mg + O₂ → 2 MgO. A magnézium égése.'),
      EQ(['Ca','O₂'],['CaO'],'2 Ca + O₂ → 2 CaO. A kalcium égése.'),
      EQ(['Na','Cl₂'],['NaCl'],'2 Na + Cl₂ → 2 NaCl. Nátrium és klór egyesülése, konyhasó keletkezik.'),
      EQ(['H₂','Cl₂'],['HCl'],'H₂ + Cl₂ → 2 HCl. Hidrogén-klorid keletkezik.')
    ].map(function(q,i){ q.sol=[[2,1,2],[2,1,2],[2,1,2],[2,1,2],[1,1,2]][i]; return q; }) },

  { type:'sim', section:'Tanulás', title:'🎨 pH-skála: savas vagy lúgos?',
    intro:'<b>Húzd a csúszkát</b>, és nézd, hogyan változik az univerzális indikátor színe, a lakmusz és a fenolftalein!',
    src:'102–103. oldal',
    render:function(box, unlock){
      var v=7;
      var wrap=FizEngine.el('div');
      wrap.innerHTML='<div class="phbox" id="phc" style="height:60px;border:4px solid var(--line);margin-bottom:10px"></div>'+
        '<div class="tot" id="phr"></div><div class="row"><div class="mini" id="lak" style="flex:1 1 140px"></div><div class="mini" id="fen" style="flex:1 1 140px"></div></div>'+
        '<label for="sl"><b>pH-érték:</b> <span id="phv"></span></label><input type="range" id="sl" min="0" max="14" step="1" value="7">'+
        '<p class="hint" id="sh">Húzd el a csúszkát, és a „Tovább” gomb kinyílik.</p>';
      box.appendChild(wrap);
      var q=function(id){return wrap.querySelector('#'+id)}, moved=false;
      function upd(){
        var p=PH[v], kind=v<7?'SAVAS':v>7?'LÚGOS':'SEMLEGES';
        q('phc').style.background=p[2]; q('phv').textContent=v;
        q('phr').innerHTML='<span style="font-size:1.25em">pH = '+v+' · '+kind+'</span><br>pl. '+p[1];
        q('lak').innerHTML='<b class="mt">Lakmusz</b>'+(v<7?'<span style="color:#d6403f;font-weight:800">PIROS</span>':v>7?'<span style="color:#2f7fd1;font-weight:800">KÉK</span>':'<span style="color:#7a4bd1;font-weight:800">LILA</span> (semleges)');
        q('fen').innerHTML='<b class="mt">Fenolftalein</b>'+(v>=9?'<span style="color:#d63a8a;font-weight:800">RÓZSASZÍN</span>':'<b>színtelen</b>');
        if(moved){ unlock(); q('sh').textContent='👏 pH 0–7: savas · 7: semleges · 7–14: lúgos.'; }
      }
      q('sl').oninput=function(){ v=+this.value; moved=true; upd(); };
      upd();
    }},

  { type:'info', section:'Tanulás', icon:'🔥', title:'Égés és tűzoltás', fig:FIG.fire,
    body:'<p>A gyors égéshez <b>három dolog</b> kell egyszerre:</p><ol><li><b>éghető anyag</b>,</li><li><b>gyulladási hőmérséklet</b>,</li><li><b>oxigén</b>.</li></ol><p><b>Tűzoltás:</b> elég az egyiket megszüntetni.</p><ul><li>víz: a gyulladási hőmérséklet <b>alá hűt</b></li><li>homok, takaró, hab: <b>elzárja az oxigént</b></li><li>erdőtűznél az árok: <b>eltávolítja az éghető anyagot</b></li></ul>',
    mc:'<p>Ha a Minecraft-fáklya lángja kialszik, mert elfogy az oxigén vagy elfogy a fa, nem ég tovább. A valóságban is mindhárom feltétel kell.</p>',
    tip:'<p><b>Tökéletes égés</b>: nem éghető termék (CO₂, H₂O). <b>Tökéletlen égés</b>: éghető termék (szén-monoxid, korom) is képződik. Az utóbbi veszélyes!</p>',
    src:'96–97. oldal' },

  { type:'balance', section:'Tanulás', title:'⚖️ Rendezd az egyenleteket! (2. szint)',
    eqs:[
      EQ(['N₂','H₂'],['NH₃'],'N₂ + 3 H₂ → 2 NH₃. Az ammónia előállítása.'),
      EQ(['CH₄','O₂'],['CO₂','H₂O'],'CH₄ + 2 O₂ → CO₂ + 2 H₂O. A földgáz (metán) tökéletes égése.'),
      EQ(['H₂O₂'],['H₂O','O₂'],'2 H₂O₂ → 2 H₂O + O₂. A hidrogén-peroxid bomlása (katalizátor: barnakő).'),
      EQ(['Al','O₂'],['Al₂O₃'],'4 Al + 3 O₂ → 2 Al₂O₃. Az alumínium oxidációja.'),
      EQ(['H₂SO₄','NaOH'],['Na₂SO₄','H₂O'],'H₂SO₄ + 2 NaOH → Na₂SO₄ + 2 H₂O. Közömbösítés: a kétértékű kénsav két hidrogéniont ad le.'),
      EQ(['KMnO₄'],['K₂MnO₄','MnO₂','O₂'],'2 KMnO₄ → K₂MnO₄ + MnO₂ + O₂. A hipermangán hevítése, oxigén fejlődik.')
    ].map(function(q,i){ q.sol=[[1,3,2],[1,2,1,2],[2,2,1],[4,3,2],[1,2,1,2],[2,1,1,1]][i]; return q; }) },

  { type:'info', section:'Tanulás', icon:'🔬', title:'Hogyan számolunk reakcióegyenlet alapján?', fig:FIG.calc,
    body:'<p><b>Feladat:</b> 64 g kén-dioxid keletkezik. Hány gramm kén égett el? (S + O₂ → SO₂)</p><ol><li><b>Egyenlet:</b> S + O₂ → SO₂ (már rendezett, a számok 1)</li><li><b>Adatok:</b> M(SO₂) = 64 g/mol, M(S) = 32 g/mol</li><li><b>Anyagmennyiség:</b> n(SO₂) = 64 : 64 = 1 mol</li><li><b>Arány:</b> 1 mol S → 1 mol SO₂, tehát n(S) = 1 mol</li><li><b>Tömeg:</b> m(S) = 1 · 32 = <b>32 g</b></li></ol>',
    tip:'<p>Gyors út: az egyenlet azt mondja, hogy 32 g kén + 32 g oxigén → 64 g kén-dioxid. Tömegmegmaradás: 32 + 32 = 64 ✔</p>',
    src:'110–111. oldal' },

  /* ================= JÁTÉKOK ================= */
  { type:'drag', section:'Játék 1', title:'📦 Savas, lúgos vagy semleges?',
    bins:[{id:'sav',name:'Savas',icon:'🍋'},{id:'sem',name:'Semleges',icon:'💧'},{id:'lug',name:'Lúgos',icon:'🧼'}],
    items:[{t:'citromlé',c:'sav'},{t:'ecet',c:'sav'},{t:'gyomorsav',c:'sav'},{t:'tiszta víz',c:'sem'},{t:'szappan',c:'lug'},{t:'szódabikarbóna-oldat',c:'lug'},{t:'lúgkő-oldat',c:'lug'},{t:'háztartási ammónia',c:'lug'}] },

  { type:'drag', section:'Játék 2', title:'📦 Hogyan oltjuk a tüzet?',
    bins:[{id:'hut',name:'Hűtés',icon:'💦'},{id:'oxi',name:'Oxigén elzárása',icon:'🧯'},{id:'anyag',name:'Éghető anyag eltávolítása',icon:'🪓'}],
    items:[{t:'vízzel locsolás',c:'hut'},{t:'homokkal betakarás',c:'oxi'},{t:'oltótakaró',c:'oxi'},{t:'habbal oltás',c:'oxi'},{t:'tűzvédelmi árok kivágása',c:'anyag'},{t:'gáz elzárása',c:'anyag'}] },

  { type:'drag', section:'Játék 3', title:'📦 Oxidáció vagy redukció?',
    bins:[{id:'ox',name:'Oxidáció',icon:'🟥'},{id:'red',name:'Redukció',icon:'🟦'}],
    items:[{t:'oxigént vesz fel',c:'ox'},{t:'elektront ad le',c:'ox'},{t:'a magnézium égése (Mg → Mg²⁺)',c:'ox'},{t:'oxigént ad le',c:'red'},{t:'elektront vesz fel',c:'red'},{t:'az oxigén O → O²⁻',c:'red'}] },

  { type:'match', section:'Játék 4', title:'🔗 Párosítás: indikátorok és színek',
    pairs:[['lakmusz savban','piros'],['lakmusz lúgban','kék'],['fenolftalein lúgban','rózsaszín'],['fenolftalein savban','színtelen'],['pH = 7','semleges'],['pH = 2','savas']] },

  { type:'memory', section:'Játék 5', title:'🧠 Savak és bázisok memória',
    pairs:[['HCl','sósav'],['H₂SO₄','kénsav'],['HNO₃','salétromsav'],['NaOH','nátrium-hidroxid'],['NH₃','ammónia'],['H₂CO₃','szénsav']] },

  { type:'cloze', section:'Játék 6', title:'✏️ Egészítsd ki a mondatot!',
    text:'A sav hidrogénionokat ___, a bázis hidrogénionokat ___. A savoldatok jellemző részecskéje az ___. A közömbösítés termékei só és ___. A reakció végén változatlanul visszamarad a ___.',
    answers:['ad le','vesz fel','oxóniumion','víz','katalizátor'], extra:['hidroxidion','gáz','enzim'],
    explain:'Sav: H⁺-t ad le. Bázis: H⁺-t vesz fel. Közömbösítés: sav + lúg → só + víz.' },

  /* ================= DOLGOZAT GYAKORLÓ ================= */
  { type:'cloze', section:'Dolgozat', title:'📝 1. Egészítsd ki a mondatokat!',
    text:'Az ___ az anyagok oxigénnel való reakciója. Az elektront leadó folyamat az ___. Az elektront felvevő folyamat a ___. A pH 7 alatt az oldat ___. A sav és a lúg reakciója a ___.',
    answers:['égés','oxidáció','redukció','savas','közömbösítés'], extra:['lúgos','bomlás','egyesülés'],
    explain:'Az 5. fejezet fontos fogalmai.' },

  { type:'match', section:'Dolgozat', title:'📝 2. Kösd össze!',
    pairs:[['katalizátor','gyorsítja a reakciót, változatlanul marad'],['enzim','az élő szervezet katalizátora'],['csapadék','vízben rosszul oldódó szilárd anyag'],['tökéletlen égés','éghető termék is keletkezik'],['oxóniumion','H₃O⁺'],['hidroxidion','OH⁻']] },

  { type:'tf', section:'Dolgozat', title:'📝 3. Igaz vagy hamis?',
    items:[
      {t:'A reakcióban a termékek tömegének összege egyenlő a kiindulási anyagok tömegének összegével.', a:true, why:'Tömegmegmaradás törvénye.'},
      {t:'A gyors égéshez nem kell oxigén.', a:false, why:'Három feltétel: éghető anyag, gyulladási hőmérséklet, oxigén.'},
      {t:'Az oxidáció és a redukció külön-külön is lejátszódhat.', a:false, why:'Mindig egyidejűleg mennek végbe (redoxireakció).'},
      {t:'A pH = 9 lúgos kémhatást jelent.', a:true, why:'pH 7 felett lúgos.'},
      {t:'A katalizátor a reakció végén elfogy.', a:false, why:'Változatlan mennyiségben és minőségben visszamarad.'},
      {t:'A közömbösítés termékei só és víz.', a:true, why:'Pl. HCl + NaOH → NaCl + H₂O.'}
    ]},

  { type:'quiz', section:'Dolgozat', q:'4. Melyik a rendezett egyenlet?',
    options:['2 H₂ + O₂ → 2 H₂O','H₂ + O₂ → H₂O','H₂ + 2 O₂ → 2 H₂O','2 H₂ + 2 O₂ → H₂O'], correct:0, explain:'Mindkét oldalon 4 H és 2 O atom van.', hint:'Számold meg az atomokat mindkét oldalon.' },
  { type:'quiz', section:'Dolgozat', q:'5. Melyik jelent savas kémhatást?',
    options:['pH = 3','pH = 7','pH = 10','pH = 13'], correct:0, explain:'A savas oldatok pH-ja 0 és 7 között van.', hint:'7 alatt savas.' },
  { type:'quiz', section:'Dolgozat', q:'6. Melyik lehet jó oxidálószer?',
    options:['oxigén','magnézium','hidrogén','nátrium'], correct:0, explain:'Jó oxidálószer az oxigén és a klór. A magnézium és a hidrogén jó redukálószer.', hint:'Oxigént ad át, elektront vesz fel.' },
  { type:'quiz', section:'Dolgozat', q:'7. Mit tehetünk a gyomorégés ellen?',
    options:['szódabikarbónát (lúgos) veszünk be, ez közömbösíti a savat','még több savat iszunk','forró vizet iszunk meg','semmi nem segít'], correct:0, explain:'A közömbösítésnél a lúgos anyag köti meg a felesleges savat.', hint:'Sav + lúg → só + víz.' },

  { type:'calc', section:'Dolgozat', count:7, gens:[
    function(){ var a=pick([[24,16],[12,32],[8,24],[10,6],[20,30],[14,16]]);
      return {q:'<b>'+a[0]+' g</b> anyag reagál <b>'+a[1]+' g</b> anyaggal, és egyetlen termék keletkezik. <b>Hány gramm termék keletkezik?</b> (tömegmegmaradás) (g)', a:a[0]+a[1], u:'g', hint:'A tömegek összege nem változik.', explain:a[0]+' + '+a[1]+' = '+(a[0]+a[1])+' g.'}; },
    function(){ var k=pick([1,2,3,5]);
      return {q:'S + O₂ → SO₂. <b>'+(32*k)+' g kén</b> elégetésekor hány gramm kén-dioxid keletkezik? (M(S) = 32, M(SO₂) = 64 g/mol) (g)', a:64*k, u:'g', hint:'1 mol S → 1 mol SO₂. Számold ki a mólokat.', explain:'n(S) = '+(32*k)+' : 32 = '+k+' mol → n(SO₂) = '+k+' mol → m = '+k+' · 64 = '+(64*k)+' g.'}; },
    function(){ var k=pick([1,2,3,5]);
      return {q:'C + O₂ → CO₂. <b>'+(12*k)+' g szén</b> elégetésekor hány gramm szén-dioxid keletkezik? (M(C) = 12, M(CO₂) = 44 g/mol) (g)', a:44*k, u:'g', hint:'1 mol C → 1 mol CO₂.', explain:'n(C) = '+k+' mol → n(CO₂) = '+k+' mol → m = '+k+' · 44 = '+(44*k)+' g.'}; },
    function(){ var k=pick([1,2,3]);
      return {q:'2 Mg + O₂ → 2 MgO. <b>'+(24*2*k)+' g magnézium</b> elégetésekor hány gramm magnézium-oxid keletkezik? (M(Mg) = 24, M(MgO) = 40 g/mol) (g)', a:80*k, u:'g', hint:'2 mol Mg → 2 mol MgO. Az anyagmennyiség ugyanannyi marad.', explain:'n(Mg) = '+(2*k)+' mol → n(MgO) = '+(2*k)+' mol → m = '+(2*k)+' · 40 = '+(80*k)+' g.'}; },
    function(){ var k=pick([1,2,3]);
      return {q:'CaCO₃ → CaO + CO₂. <b>'+(100*k)+' g kalcium-karbonát</b> hevítésekor hány gramm kalcium-oxid (CaO) keletkezik? (M(CaCO₃) = 100, M(CaO) = 56 g/mol) (g)', a:56*k, u:'g', hint:'1 mol CaCO₃ → 1 mol CaO.', explain:'n = '+k+' mol → m(CaO) = '+k+' · 56 = '+(56*k)+' g.'}; },
    function(){ var n=pick([2,3,4,5,6]);
      return {q:'Hány <b>hidrogénatom</b> van <b>'+n+' db CH₄</b> molekulában összesen?', a:4*n, u:'db', hint:'Egy CH₄-ben 4 H atom van.', explain:n+' · 4 = '+(4*n)+' H atom.'}; },
    function(){ var m=pick([['H₂O',18],['CO₂',44],['SO₂',64],['O₂',32]]), k=pick([2,3,4]);
      return {q:'<b>'+(m[1]*k)+' g</b> '+m[0]+' hány mol? (M = '+m[1]+' g/mol) (mol)', a:k, u:'mol', hint:'n = m : M.', explain:(m[1]*k)+' : '+m[1]+' = '+k+' mol.'}; }
  ]},

  { type:'cards', section:'Ismétlés', title:'🃏 Kártyák – ismételd át!',
    cards:[
      ['Hatásos ütközés','A részecskék megfelelő irányú és elegendő energiájú ütközése, ami átalakuláshoz vezet.'],
      ['Katalizátor','Megnöveli a reakció sebességét, de a végén változatlanul visszamarad.'],
      ['Enzim','Az élő szervezetek katalizátora.'],
      ['Csapadék','Vizes oldatban keletkező, vízben rosszul oldódó szilárd anyag.'],
      ['Tömegmegmaradás törvénye','A kiindulási anyagok és a termékek tömegének összege egyenlő.'],
      ['Reakcióegyenlet lépései','1. anyagok meghatározása 2. felírás jelekkel 3. rendezés (együtthatók).'],
      ['Égés','Az anyag oxigénnel való reakciója. Gyors égés feltételei: éghető anyag, gyulladási hőmérséklet, oxigén.'],
      ['Tökéletes és tökéletlen égés','Tökéletes: nem éghető termék. Tökéletlen: éghető termék (CO, korom) is van.'],
      ['Oxidáció és redukció','Elektronleadás, illetve elektronfelvétel (köznapian: oxigénfelvétel és -leadás). Mindig egyszerre.'],
      ['pH-skála','0–7 savas, 7 semleges, 7–14 lúgos.'],
      ['Sav és bázis (Brønsted)','Sav: H⁺-t ad le. Bázis: H⁺-t vesz fel.'],
      ['Közömbösítés','Sav + lúg → só + víz.'],
      ['Számítás az egyenlet alapján','Az együtthatók az anyagmennyiségek arányát adják. n = m : M, m = n · M.']
    ]},

  { type:'end', section:'Kész!' }
  ]
};
(window.ALL = window.ALL || {})[window.LESSON.id] = window.LESSON;
})();
