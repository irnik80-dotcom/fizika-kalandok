/* Kémia 7. – 4. fejezet: Az anyagok szerkezete és tulajdonságai (tankönyv 59–88. oldal) */
(function(){
var SV = window.SV, fmt = function(n){ return String(n).replace(/\B(?=(\d{3})+(?!\d))/g,' '); };
var pick = function(a){ return a[Math.floor(Math.random()*a.length)]; };
var row = SV.row, mini = SV.mini, grid = SV.grid;
var sub = function(n){ return String(n).replace(/\d/g,function(d){return '₀₁₂₃₄₅₆₇₈₉'[d];}); };
var supc = function(c){ return c===1?'⁺':c===-1?'⁻':(Math.abs(c)+(c>0?'⁺':'⁻')).replace(/\d/,function(d){return '⁰¹²³⁴⁵⁶⁷⁸⁹'[d];}); };
var gcd = function(a,b){ return b?gcd(b,a%b):a; };

var FIG = {
  h2: SV.mol('Hidrogénmolekula: egy kötő elektronpár',[['H',130,80],['H',190,80]],[[0,1,1]],'H–H'),
  o2: SV.mol('Oxigénmolekula: kettős kötés',[['O',130,80],['O',190,80]],[[0,1,2]],'O=O'),
  n2: SV.mol('Nitrogénmolekula: hármas kötés',[['N',130,80],['N',190,80]],[[0,1,3]],'N≡N'),
  water: SV.mol('Vízmolekula: V alakú, poláris',[['O',160,55],['H',120,105],['H',200,105]],[[0,1,1],[0,2,1]],'H–O–H · poláris'),
  co2: SV.mol('Szén-dioxid: egyenes, apoláris',[['O',100,80],['C',160,80],['O',220,80]],[[0,1,2],[1,2,2]],'O=C=O · apoláris'),
  nh3: SV.mol('Ammóniamolekula',[['N',160,50],['H',115,105],['H',160,115],['H',205,105]],[[0,1,1],[0,2,1],[0,3,1]],'NH₃ · poláris'),
  ch4: SV.mol('Metánmolekula',[['C',160,80],['H',160,35],['H',112,88],['H',208,88],['H',160,128]],[[0,1,1],[0,2,1],[0,3,1],[0,4,1]],'CH₄ · apoláris'),
  bonds: SV.boxes('Másodrendű kölcsönhatások',[['diszperziós','#d4e6fb'],['dipólus–dipólus','#fdeeb0'],['hidrogénkötés','#ffd9d6']],'gyengétől az erősebb felé'),
  polar: SV.boxes('Polaritás',[['apoláris: egyenletes','#d5f0cb'],['poláris: + és − pólus','#ffd9d6']],'H₂, O₂, N₂, CO₂, CH₄ · H₂O, HCl, NH₃'),
  diamond: SV.mol('Gyémánt: szénatomok kovalens hálózata',[['C',110,50],['C',160,50],['C',210,50],['C',135,100],['C',185,100]],[[0,1,1],[1,2,1],[0,3,1],[1,3,1],[1,4,1],[2,4,1],[3,4,1]],'atomrács: kemény, nagyon magas olvadáspontú'),
  metal: SV.svg('Fémes kötés: pozitív fématomtörzsek és szabad elektronfelhő',
    [0,1,2,3].map(function(i){ return [0,1,2].map(function(j){ return '<circle cx="'+(60+i*65)+'" cy="'+(35+j*38)+'" r="14" fill="#b9c2cc" stroke="#1b2618" stroke-width="2"/>'+SV.t(60+i*65,40+j*38,'+',14,'middle','#1b2618'); }).join(''); }).join('')+
    [[92,55],[155,95],[220,52],[270,92],[100,115],[185,70],[245,122],[130,40]].map(function(p){ return '<circle cx="'+p[0]+'" cy="'+p[1]+'" r="4.5" fill="#2f7fd1"/>'; }).join('')+SV.t(160,150,'a kék pontok a szabadon mozgó elektronok',11)),
  reactivity: SV.flow('A fémek reakciókészsége',[['Au','#f2c230'],['Cu','#d68a4a'],['Fe','#b08060'],['Al','#b9c2cc']],['nő','nő','nő'],'arany → réz → vas → alumínium'),
  ion: SV.boxes('Kation és anion',[['kation: +','#ffb3ad'],['anion: −','#cfe9ff']],'a fém elektront ad le · a nemfém elektront vesz fel'),
  na: SV.atom('Nátriumatom → Na⁺ ion','Na',[2,8,1],'leadja a külső elektront → Na⁺',11),
  naion: SV.atom('Nátriumion: Na⁺','Na',[2,8],'Na⁺: nemesgázszerkezet (neon)',11),
  lattice: SV.lattice('NaCl ionrács: Na⁺ és Cl⁻ váltakozva','#b07fe0','#6bc26b','konyhasó (NaCl)')
};

/* ionképző adatai: [jel, név, rendszám, héjak, töltés, ion héjai] */
var IONS = [
 ['Na','nátrium',11,[2,8,1],1,[2,8]],['Mg','magnézium',12,[2,8,2],2,[2,8]],['Al','alumínium',13,[2,8,3],3,[2,8]],['K','kálium',19,[2,8,8,1],1,[2,8,8]],['Ca','kalcium',20,[2,8,8,2],2,[2,8,8]],
 ['O','oxigén',8,[2,6],-2,[2,8]],['S','kén',16,[2,8,6],-2,[2,8,8]],['Cl','klór',17,[2,8,7],-1,[2,8,8]],['F','fluor',9,[2,7],-1,[2,8]]
];
var CAT=[['Na','nátrium',1],['Mg','magnézium',2],['Al','alumínium',3],['Ca','kalcium',2],['K','kálium',1]];
var ANI=[['Cl','klorid',-1],['O','oxid',-2],['S','szulfid',-2],['Br','bromid',-1]];
function formula(c,a){ var g=gcd(Math.abs(c[2]),Math.abs(a[2])), nc=Math.abs(a[2])/g, na=Math.abs(c[2])/g; return c[0]+(nc>1?sub(nc):'')+a[0]+(na>1?sub(na):''); }

window.LESSON = {
  id:'kemia-szerkezet',
  screens:[
  /* ================= VÁZLAT ================= */
  { type:'sheet', section:'Vázlat', title:'Molekulák és kötések', sub:'Kémia 7. · 4. fejezet · 1. oldal', cards:[
    { n:1, c:1, title:'A molekulák képződése: kovalens kötés',
      html:row(FIG.h2,'<p>A <b>molekula</b> két vagy több atom összekapcsolódásával kialakuló töltés nélküli részecske. Az atomokat <b>kovalens kötés</b> kapcsolja össze.</p><p>A kovalens kötés <b>kötő elektronpár</b> által kialakított <b>elsőrendű</b> kémiai kötés, amely jellemzően az atomok <b>párosítatlan elektronjaiból</b> jön létre.</p>')+grid(
        mini('🔢 Összegképlet','Megmutatja, hogy melyik atomból hányat tartalmaz a molekula. Pl. H₂O.'),
        mini('✏️ Szerkezeti képlet','Az atomok kapcsolódási sorrendjét is mutatja a kötő és <b>nemkötő elektronpárokkal</b>. Pl. H–O–H.')),
      note:'A molekulák kialakulása energiafelszabadulással jár: kedvező folyamat.' },
    { n:2, c:2, title:'Alkossunk molekulákat! Egyszeres és többszörös kötés',
      html:row(FIG.n2,'<p>Az atomok a kapcsolódással a kedvező <b>nemesgázszerkezetet</b> érik el. Kialakulhat <b>egyszeres</b>, <b>kettős</b> és <b>hármas</b> kötés.</p>')+grid(
        mini('H–H, Cl–Cl, H–O–H','<b>Egyszeres</b> kötések.'),
        mini('O=O, O=C=O','<b>Kettős</b> kötések (2 kötő elektronpár).'),
        mini('N≡N','<b>Hármas</b> kötés (3 kötő elektronpár).')),
      note:'A kettős és a hármas kötés erősebb összetartást ad, ezért a felszakításához is több energia kell. A metán (CH₄) szénatomja 4 kötést, az ammóniáé (NH₃) nitrogénatomja 3 kötést alakít ki.' },
    { n:3, c:5, title:'A molekulák polaritása',
      html:row(FIG.water,'<p>A molekulák <b>térbeli</b> képződmények. Alakjukat a <b>kötő és nemkötő elektronpárok taszítása</b> határozza meg. A víz V alakú, a szén-dioxid egyenes.</p>')+row(FIG.polar,'')+grid(
        mini('🟢 Apoláris','Az elektroneloszlás <b>egyenletes</b>: H₂, O₂, N₂, CO₂, CH₄.'),
        mini('🔴 Poláris','Elektronban <b>gazdagabb és szegényebb</b> sarkok (pólusok) vannak: H₂O, HCl, NH₃.')),
      note:'Az elektronvonzó képesség (a periódusos rendszerből) és a molekulaalak együtt dönti el a polaritást. A polaritás befolyásolja a halmazállapotot és az oldhatóságot.' },
    { n:4, c:4, title:'Kölcsönhatások a molekulák között',
      html:row(FIG.bonds,'<p>A molekulák között <b>másodrendű kémiai kölcsönhatások</b> vannak, ezek gyengébbek az elsőrendű (kovalens) kötéseknél.</p>')+grid(
        mini('⚪ Diszperziós','Apoláris molekulák között, gyenge.'),
        mini('➕➖ Dipólus–dipólus','<b>Poláris</b> molekulák között, erősebb.'),
        mini('💧 Hidrogénkötés','A legerősebb. Akkor alakul ki, ha a <b>H</b> atom <b>N, O vagy F</b> atomhoz kapcsolódik (pl. vízmolekulák között).')),
      note:'„Hasonló a hasonlót oldja”: a poláris anyag a vízben (poláris) oldódik, az apoláris a benzinben. Ezért nem oldódik a hidrogén (apoláris) vízben.' }
  ]},

  { type:'sheet', section:'Vázlat', title:'Az anyagok szerkezete', sub:'Kémia 7. · 4. fejezet · 2. oldal', cards:[
    { n:5, c:3, title:'Molekulákból felépülő elemek és vegyületek',
      html:grid(
        mini('🧪 Elemek','Pl. H₂, N₂, O₂, a halogének, a kén. Az olvadás- és forráspontjuk a <b>moláris tömeg</b> növekedésével nő, mert a molekulák közti gyenge kötés ezt követi. Szilárdan <b>molekularácsot</b> alkotnak.'),
        mini('💧 Poláris vegyületek','H₂O, HCl, NH₃: erősebb másodrendű kötések, <b>vízben jól oldódnak</b> (szökőkút-kísérlet).'),
        mini('🫧 Apoláris vegyületek','CO₂, CH₄: gyengébb kölcsönhatás, vízben <b>rosszul oldódnak</b>. A szárazjég (szilárd CO₂) <b>szublimál</b>.'))+row(FIG.co2,'<p><b>Molekularács:</b> szilárd állapotban a molekulák szabályos rendben állnak (jég, jód, szárazjég, kén).</p>'),
      note:'A kén melegítésekor: 119 °C-on megolvad (narancssárga, folyékony), tovább hevítve sötétbarna, sűrű lesz (a láncok összegabalyodnak), majd a forráspont közelében újra hígabb.' },
    { n:6, c:1, title:'Anyagismereti kártya',
      html:'<p>Egy anyag jellemzéséhez <b>egységes szempontok</b> szerint gyűjtjük az adatokat:</p>'+grid(
        mini('📛 Név és képlet','pl. víz, H₂O, szerkezeti képlet'),
        mini('🔬 Fizikai tulajdonságok','szín, szag, halmazállapot, olvadáspont, forráspont, oldhatóság, polaritás, moláris tömeg'),
        mini('🔥 Kémiai tulajdonságok','mivel reagál, mi keletkezik'),
        mini('🌍 Előfordulás és felhasználás','hol található, hogyan állítják elő, mire használják')),
      note:'Példa: víz – H₂O, op. 0 °C, fp. 100 °C, színtelen, szagtalan, folyékony, poláris, M = 18 g/mol.' },
    { n:7, c:2, title:'Kőkemény anyagok: atomrácsos kristályok',
      html:row(FIG.diamond,'<p>Az <b>atomrácsos kristályban</b> az atomokat <b>kovalens kötések hálózata</b> tartja össze, az egész kristály egyetlen „óriásmolekula”.</p>')+grid(
        mini('💎 Gyémánt (C)','Nagyon kemény, magas olvadáspontú, oldhatatlan.'),
        mini('🪨 Kvarc (SiO₂)','A homok és sok féldrágakő (rózsakvarc, jáspis) alapja.'),
        mini('✏️ Grafit (C) – a kakukktojás','Szintén szén, de <b>réteges szerkezetű</b>: puha, sötétszürke, vezeti az áramot.')),
      note:'Jele: a gyémánt és a grafit a szén két módosulata (C gyémánt, C grafit). A grafit magas olvadáspontja (3727 °C) és oldhatatlansága az atomrácsos szerkezetet igazolja.' },
    { n:8, c:6, title:'Régi segítőink, a fémek',
      html:row(FIG.metal,'<p>Az elemek kb. <b>80%-a fém</b>. A fématomokat a <b>fémes kötés</b> tartja össze: a fématomok külső elektronjaiból <b>szabadon mozgó elektronfelhő</b> alakul ki.</p>')+grid(
        mini('✨ Tulajdonságok','Szürke, fémes csillogású, szilárd (kivétel: higany), <b>megmunkálható, ötvözhető</b>, jó <b>elektromos- és hővezető</b>.'),
        mini('⚖️ Könnyű- és nehézfém','<b>Könnyűfém</b>: sűrűsége 5 g/cm³-nél kisebb. <b>Nehézfém</b>: ennél nagyobb.'),
        mini('🔗 Ötvözet','Fémek más fémekkel (vagy nemfémekkel) alkotott keverékei. Tulajdonságaik eltérnek a tiszta fémekétől.')) },
    { n:9, c:4, title:'Az aranytól az alumíniumig',
      html:row(FIG.reactivity,'<p>A fémek felhasználása a <b>fizikai és kémiai tulajdonságaiktól</b> függ. A reakciókészség <b>arany → réz → vas → alumínium</b> sorrendben nő.</p>')+grid(
        mini('🥇 Arany','<b>Nemesfém</b>: oxigénnel még magas hőmérsékleten sem reagál.'),
        mini('🧰 Réz, vas, alumínium','Oxigénnel reagálnak. A vas és az alumínium <b>sósavval, ecetsavval</b> is reagál.')),
      note:'Az ötvözéssel megváltoztathatók a fém színe, keménysége, megmunkálhatósága és vezetése.' }
  ]},

  { type:'sheet', section:'Vázlat', title:'Ionok és ionvegyületek', sub:'Kémia 7. · 4. fejezet · 3. oldal', cards:[
    { n:10, c:1, title:'Az atom ionná alakul',
      html:row(FIG.ion,'<p>Az <b>ion</b> töltéssel rendelkező kémiai részecske. Az atomok annyi elektront adnak le vagy vesznek fel, amennyi a <b>nemesgázszerkezethez</b> kell.</p>')+grid(
        mini('➕ Kation','<b>Pozitív</b> ion. A <b>fématomok</b> elektronleadással képezik. Pl. Na → Na⁺, Mg → Mg²⁺.'),
        mini('➖ Anion','<b>Negatív</b> ion. A <b>nemfématomok</b> elektronfelvétellel képezik. Pl. Cl → Cl⁻, O → O²⁻.')),
      note:'Az ellentétes töltésű ionok közötti vonzás az ionkötés. Az ionkötés elsőrendű kémiai kötés, az ionok szabályos ionrácsot alkotnak.' },
    { n:11, c:2, title:'Amikor az ellentétek vonzzák egymást: az ionvegyületek képlete',
      html:row(FIG.lattice,'<p>A kationok és az anionok olyan arányban alkotnak vegyületet, hogy az <b>ionok töltésszámának összege nulla</b>. A képlet az <b>ionok számarányát</b> mutatja.</p>')+grid(
        mini('🧂 NaCl','Na⁺ + Cl⁻ → 1 : 1'),
        mini('🧱 MgO','Mg²⁺ + O²⁻ → 1 : 1'),
        mini('🧪 CaCl₂','Ca²⁺ + 2 Cl⁻ → 1 : 2'),
        mini('⚪ Al₂O₃','2 Al³⁺ + 3 O²⁻ → 2 : 3')),
      note:'Összetett ionok: több atomból álló ionok, amelyekben az atomokat kovalens kötés kapcsolja össze (pl. OH⁻ hidroxid, NO₃⁻ nitrát, SO₄²⁻ szulfát, CO₃²⁻ karbonát, NH₄⁺ ammónium). Az ionvegyület moláris tömege az atomok moláris tömegének összege: M(NaCl) = 23 + 35,5 = 58,5 g/mol.' },
    { n:12, c:3, title:'Az ionvegyületek tulajdonságai',
      html:grid(
        mini('⚪ Megjelenés','Fehér (színtelen) vagy színes <b>szilárd</b> anyagok. Pl. konyhasó, gipsz, mészkő, rézgálic, hipermangán.'),
        mini('🔥 Olvadáspont','Általában <b>magas</b>: az ionkötés felszakításához sok energia kell.'),
        mini('🔨 Rideg','Erőhatásra a rétegek elmozdulnak, az <b>azonos töltésű ionok</b> egymás mellé kerülnek és taszítják egymást: <b>törik</b>.'),
        mini('⚡ Vezetés','<b>Szilárdan nem</b> vezeti az áramot, de <b>vizes oldata és olvadéka igen</b>. Ezért nem szabad vizes kézzel a villanykapcsolóhoz nyúlni!'),
        mini('💧 Kristályvíz','Egyes ionvegyületek kristályrácsába <b>vízmolekulák</b> épülnek be (pl. rézgálic).')),
      note:'Az ionvegyületek oldhatósága különböző: egyesek vízben jól, mások rosszul oldódnak. Oldatuk színe jellemző az adott vegyületre.' }
  ]},

  /* ================= TANULÁS (interaktív) ================= */
  { type:'sim', section:'Tanulás', title:'⚡ Készíts iont!',
    intro:'Válassz egy atomot, majd nyomd meg az <b>Alakítsd ionná!</b> gombot. Nézd meg, hogyan változik az elektronszerkezet!',
    src:'80–82. oldal',
    render:function(box, unlock){
      var cur=IONS[0], isIon=false;
      var wrap=FizEngine.el('div','ionsim'), pick_=FizEngine.el('div','pool'), view=FizEngine.el('div','pinfo'), go=FizEngine.el('button','btn center','⚡ Alakítsd ionná!');
      go.type='button'; go.style.marginTop='10px';
      function draw(){
        var e=cur, name=e[0], sh=isIon?e[5]:e[3], ch=isIon?e[4]:0;
        var lbl=isIon?(supc(e[4])):'';
        var cap=isIon?(e[4]>0?(e[4]+' elektront ad le → '+e[0]+supc(e[4])+' (kation)'):(Math.abs(e[4])+' elektront vesz fel → '+e[0]+supc(e[4])+' (anion)')):'semleges atom';
        view.innerHTML=SV.atom('A(z) '+e[1]+(isIon?' ion':' atom')+' modellje',e[0],sh,cap,e[2])+
          '<div class="pdata"><b>'+e[1]+(isIon?'-ion ('+e[0]+supc(e[4])+')':'atom ('+e[0]+')')+'</b><br>elektronszerkezet: <b>'+sh.join(') ')+')</b>'+(isIon?'<br>nemesgázszerkezetet ért el ✔':'')+'</div>';
        go.textContent=isIon?'↩ Vissza atomnak':'⚡ Alakítsd ionná!';
      }
      IONS.forEach(function(e){ var b=FizEngine.el('button','dchip',e[0]+' ('+e[1]+')'); b.type='button'; b.onclick=function(){ cur=e; isIon=false; draw(); }; pick_.appendChild(b); });
      go.onclick=function(){ isIon=!isIon; draw(); if(isIon) unlock(); };
      [pick_,view,go].forEach(function(n){ wrap.appendChild(n); }); box.appendChild(wrap); draw();
    }},

  { type:'sim', section:'Tanulás', title:'🧂 Ionvegyület-készítő',
    intro:'Válassz egy <b>kationt</b> és egy <b>aniont</b>! Megmutatom, milyen arányban kapcsolódnak, és mi a vegyület képlete.',
    src:'82–83. oldal',
    render:function(box, unlock){
      var c=CAT[0], a=ANI[0];
      var wrap=FizEngine.el('div','ionsim'), r1=FizEngine.el('div','pool'), r2=FizEngine.el('div','pool'), out=FizEngine.el('div','tot');
      function upd(){
        var g=gcd(Math.abs(c[2]),Math.abs(a[2])), nc=Math.abs(a[2])/g, na=Math.abs(c[2])/g, f=formula(c,a);
        out.innerHTML='<span style="font-size:1.4em">'+f+'</span><br>'+c[1]+'-'+a[1]+'<br><small>'+nc+' db '+c[0]+supc(c[2])+' + '+na+' db '+a[0]+supc(a[2])+' → a töltések összege: '+(nc*c[2]+na*a[2])+'</small>';
        unlock();
      }
      function mk(list,set,row_){ list.forEach(function(x){ var b=FizEngine.el('button','dchip',x[0]+supc(x[2])); b.type='button'; b.onclick=function(){ set(x); upd(); }; row_.appendChild(b); }); }
      wrap.appendChild(FizEngine.el('p','hint','Kationok (fémek):')); mk(CAT,function(x){c=x;},r1); wrap.appendChild(r1);
      wrap.appendChild(FizEngine.el('p','hint','Anionok (nemfémek):')); mk(ANI,function(x){a=x;},r2); wrap.appendChild(r2);
      wrap.appendChild(out); box.appendChild(wrap); out.innerHTML='<span class="hint">Koppints egy kationra és egy anionra!</span>';
    }},

  { type:'info', section:'Tanulás', icon:'💎', title:'Négyféle rács – négyféle anyag', fig:FIG.lattice,
    body:'<ul><li><mark class="e1">Molekularács</mark>: molekulák, gyenge másodrendű kötés. <b>Alacsony</b> olvadáspont. Pl. jég, jód, szárazjég.</li><li><mark class="e2">Atomrács</mark>: atomok, kovalens kötések hálózata. <b>Nagyon kemény</b>, magas olvadáspont. Pl. gyémánt, kvarc.</li><li><mark class="e4">Fémrács</mark>: fématomok + szabad elektronok. <b>Vezet</b>, megmunkálható. Pl. vas, réz.</li><li><mark class="e5">Ionrács</mark>: ionok, ionkötés. <b>Rideg</b>, magas olvadáspont. Pl. konyhasó.</li></ul>',
    mc:'<p>Gondolj a Minecraftra: a gyémánt blokk a legkeményebb, az arany blokk jól megmunkálható. A valóságban is a szerkezet dönt a tulajdonságról.</p>',
    tip:'<p>Ha a szilárd anyag <b>vezeti</b> az áramot, az fém (vagy grafit). Ha csak az <b>oldata</b> vezet, az ionvegyület.</p>',
    src:'72–86. oldal' },

  /* ================= JÁTÉKOK ================= */
  { type:'drag', section:'Játék 1', title:'📦 Poláris vagy apoláris molekula?',
    bins:[{id:'pol',name:'Poláris',icon:'🔴'},{id:'apol',name:'Apoláris',icon:'🟢'}],
    items:[{t:'H₂O',c:'pol'},{t:'HCl',c:'pol'},{t:'NH₃',c:'pol'},{t:'H₂',c:'apol'},{t:'O₂',c:'apol'},{t:'N₂',c:'apol'},{t:'CO₂',c:'apol'},{t:'CH₄',c:'apol'}] },

  { type:'drag', section:'Játék 2', title:'📦 Milyen rácsot alkot?',
    bins:[{id:'mol',name:'Molekularács',icon:'💧'},{id:'atom',name:'Atomrács',icon:'💎'},{id:'fem',name:'Fémrács',icon:'🔩'},{id:'ion',name:'Ionrács',icon:'🧂'}],
    items:[{t:'jég',c:'mol'},{t:'szárazjég',c:'mol'},{t:'gyémánt',c:'atom'},{t:'kvarc (SiO₂)',c:'atom'},{t:'vas',c:'fem'},{t:'réz',c:'fem'},{t:'konyhasó (NaCl)',c:'ion'},{t:'magnézium-oxid',c:'ion'}] },

  { type:'drag', section:'Játék 3', title:'📦 Milyen kötés tartja össze?',
    bins:[{id:'kov',name:'Kovalens kötés',icon:'🤝'},{id:'fem',name:'Fémes kötés',icon:'🔩'},{id:'ion',name:'Ionkötés',icon:'➕➖'}],
    items:[{t:'vízmolekula atomjai',c:'kov'},{t:'oxigénmolekula atomjai',c:'kov'},{t:'a gyémánt atomjai',c:'kov'},{t:'a vasrács atomjai',c:'fem'},{t:'az alumínium atomjai',c:'fem'},{t:'Na⁺ és Cl⁻ ionok',c:'ion'},{t:'Mg²⁺ és O²⁻ ionok',c:'ion'}] },

  { type:'match', section:'Játék 4', title:'🔗 Párosítás: atom → ion',
    pairs:[['Na','Na⁺'],['Mg','Mg²⁺'],['Al','Al³⁺'],['Cl','Cl⁻'],['O','O²⁻'],['Ca','Ca²⁺']] },

  { type:'memory', section:'Játék 5', title:'🧠 Ionvegyület-memória',
    pairs:[['nátrium-klorid','NaCl'],['magnézium-oxid','MgO'],['kalcium-klorid','CaCl₂'],['alumínium-oxid','Al₂O₃'],['nátrium-hidroxid','NaOH'],['kalcium-karbonát','CaCO₃']] },

  { type:'cloze', section:'Játék 6', title:'✏️ Egészítsd ki a mondatot!',
    text:'A kovalens kötést ___ elektronpár hozza létre. A hidrogénkötés a ___ másodrendű kölcsönhatás. A fémekben a szabadon mozgó ___ vezetnek. A fématomok elektronleadással ___ alakulnak.',
    answers:['kötő','legerősebb','elektronok','kationná'], extra:['nemkötő','leggyengébb','anionná'],
    explain:'Kötő elektronpár, legerősebb másodrendű kötés, szabad elektronok, a fémek kationok.' },

  /* ================= DOLGOZAT GYAKORLÓ ================= */
  { type:'cloze', section:'Dolgozat', title:'📝 1. Egészítsd ki a mondatokat!',
    text:'A ___ az atomok és az ionok között kialakuló erős vonzás elsőrendű kötésfajta. Az apoláris molekulák elektroneloszlása ___. A pozitív ion a ___. Az ellentétes töltésű ionok között ___ alakul ki. A fémek keverékei az ___.',
    answers:['elsőrendű kötés','egyenletes','kation','ionkötés','ötvözetek'], extra:['anion','másodrendű kötés','nem egyenletes'],
    explain:'A 4. fejezet fontos fogalmai.' },

  { type:'match', section:'Dolgozat', title:'📝 2. Kösd össze!',
    pairs:[['kovalens kötés','közös elektronpár'],['fémes kötés','szabadon mozgó elektronfelhő'],['ionkötés','ellentétes töltésű ionok vonzása'],['kation','pozitív ion'],['anion','negatív ion'],['kristályvíz','a rácsba épült vízmolekula']] },

  { type:'tf', section:'Dolgozat', title:'📝 3. Igaz vagy hamis?',
    items:[
      {t:'A nitrogénmolekulában hármas kovalens kötés van.', a:true, why:'N≡N: három kötő elektronpár.'},
      {t:'A szén-dioxid poláris molekula.', a:false, why:'A CO₂ egyenes alakú, apoláris molekula.'},
      {t:'A grafit atomrácsos, de vezeti az áramot.', a:true, why:'A rétegekben közös elektronfelhő van, ez a „kakukktojás”.'},
      {t:'Az ionvegyületek szilárd állapotban vezetik az áramot.', a:false, why:'Csak vizes oldatuk vagy olvadékuk vezet.'},
      {t:'A hidrogénkötés a legerősebb másodrendű kölcsönhatás.', a:true, why:'H és N, O vagy F között alakul ki.'},
      {t:'Az arany a vasnál reakcióképesebb.', a:false, why:'Az arany nemesfém, a reakciókészség arany → réz → vas → alumínium sorrendben nő.'}
    ]},

  { type:'quiz', section:'Dolgozat', q:'4. Melyik anyag oldódik jól vízben?',
    options:['ammónia (NH₃)','hidrogén (H₂)','metán (CH₄)','nitrogén (N₂)'], correct:0, explain:'A poláris ammónia jól oldódik a (poláris) vízben. A többi apoláris.', hint:'Hasonló a hasonlót oldja.' },
  { type:'quiz', section:'Dolgozat', q:'5. Mi a nátrium-klorid képlete és milyen részecskékből áll?',
    options:['NaCl, Na⁺ és Cl⁻ ionokból','NaCl, molekulákból','Na₂Cl, atomokból','NaCl₂, ionokból'], correct:0, explain:'A konyhasó ionrácsot alkot: Na⁺ és Cl⁻ ionok 1 : 1 arányban.', hint:'A töltések összege nulla.' },
  { type:'quiz', section:'Dolgozat', q:'6. Melyik reakcióképesebb?',
    options:['alumínium','arany','réz','mind egyforma'], correct:0, explain:'Reakciókészség: arany → réz → vas → alumínium.', hint:'A sorrend végén álló.' },
  { type:'quiz', section:'Dolgozat', q:'7. Miért törékenyek az ionkristályok?',
    options:['Eltolódáskor azonos töltésű ionok kerülnek egymás mellé és taszítják egymást.','Mert molekulákból állnak.','Mert a kötés gyenge másodrendű kötés.','Mert fémes kötés van bennük.'], correct:0, explain:'A rétegek elmozdulása taszítást okoz, ezért az ionkristály törik.', hint:'Ellentétek vonzzák, azonos töltések taszítják egymást.' },

  { type:'calc', section:'Dolgozat', count:7, gens:[
    function(){ var m=pick([['H₂O',2],['CO₂',4],['N₂',3],['O₂',2],['CH₄',4],['NH₃',3],['H₂',1],['HCl',1]]);
      return {q:'Hány <b>kötő elektronpár</b> van a(z) <b>'+m[0]+'</b> molekulában? (a többszörös kötés több elektronpárt jelent)', a:m[1], u:'db', hint:'Számold meg a szerkezeti képletben a kötéseket: egyszeres = 1, kettős = 2, hármas = 3.', explain:'A(z) '+m[0]+' molekulában '+m[1]+' kötő elektronpár van.'}; },
    function(){ var e=pick(IONS.filter(function(x){return x[4]>0;}));
      return {q:'<b>Hány elektront ad le</b> a(z) <b>'+e[1]+'atom</b> ('+e[0]+'), hogy nemesgázszerkezetű kation legyen?', a:e[4], u:'db', hint:'Annyit, ahány vegyértékelektronja van (a legkülső héj elektronjai).', explain:'A(z) '+e[1]+'atom külső héján '+e[4]+' elektron van, ezt leadja: '+e[0]+supc(e[4])+'.'}; },
    function(){ var e=pick(IONS.filter(function(x){return x[4]<0;}));
      return {q:'<b>Hány elektront vesz fel</b> a(z) <b>'+e[1]+'atom</b> ('+e[0]+'), hogy nemesgázszerkezetű anion legyen?', a:Math.abs(e[4]), u:'db', hint:'A teljes külső héjhoz (8 elektron) hiányzó elektronok száma.', explain:'A külső héjon '+(8-Math.abs(e[4]))+' elektron van, ezért '+Math.abs(e[4])+'-et vesz fel: '+e[0]+supc(e[4])+'.'}; },
    function(){ var m=pick([['NaCl (Na = 23, Cl = 35,5)',58.5],['MgO (Mg = 24, O = 16)',40],['CaO (Ca = 40, O = 16)',56],['NaOH (Na = 23, O = 16, H = 1)',40],['CaCO₃ (Ca = 40, C = 12, O = 16)',100],['Al₂O₃ (Al = 27, O = 16)',102]]);
      return {q:'<b>Mekkora a moláris tömege?</b> '+m[0]+' (g/mol)', a:m[1], u:'g/mol', tol:0.1, hint:'Add össze az atomok moláris tömegét az alsó indexek szerint.', explain:'M = '+String(m[1]).replace('.',',')+' g/mol.'}; },
    function(){ var c=pick(CAT), a=pick(ANI), g=gcd(Math.abs(c[2]),Math.abs(a[2])), nc=Math.abs(a[2])/g;
      return {q:'A(z) <b>'+c[1]+'</b> ('+c[0]+supc(c[2])+') és a(z) <b>'+a[1]+'</b> ('+a[0]+supc(a[2])+') vegyületében <b>hány db '+c[0]+supc(c[2])+' ion</b> jut az egyszerű képletben a legkisebb egész számokkal?', a:nc, u:'db', hint:'A töltések összegének nullának kell lennie. Keresd a legkisebb közös többszöröst.', explain:'A képlet: '+formula(c,a)+', ebben '+nc+' db '+c[0]+supc(c[2])+' van.'}; },
    function(){ var n=pick([2,3,4,5]);
      return {q:'<b>'+n+' mol</b> NaCl tömege? (M = 58,5 g/mol) (g)', a:58.5*n, u:'g', tol:0.1, hint:'m = n · M.', explain:n+' · 58,5 = '+String(58.5*n).replace('.',',')+' g.'}; },
    function(){ var e=pick(['Na','Mg','Al','K','Ca']).toString(); var d={Na:1,Mg:2,Al:3,K:1,Ca:2};
      return {q:'Hány <b>vegyértékelektronja</b> van a(z) <b>'+e+'</b> atomnak? (a periódusos rendszer főcsoportja alapján)', a:d[e], u:'db', hint:'1. főcsoport: 1, 2. főcsoport: 2, 13. főcsoport: 3.', explain:'A(z) '+e+' vegyértékelektronjainak száma: '+d[e]+'.'}; }
  ]},

  { type:'cards', section:'Ismétlés', title:'🃏 Kártyák – ismételd át!',
    cards:[
      ['Kovalens kötés','Atomok között közös (kötő) elektronpárral kialakított elsőrendű kötés.'],
      ['Egyszeres, kettős, hármas kötés','1, 2, illetve 3 kötő elektronpár. Pl. H–H, O=O, N≡N.'],
      ['Apoláris molekula','Egyenletes elektroneloszlású: H₂, O₂, N₂, CO₂, CH₄.'],
      ['Poláris molekula','Pozitív és negatív pólusú: H₂O, HCl, NH₃.'],
      ['Másodrendű kölcsönhatások','Diszperziós, dipólus–dipólus, hidrogénkötés (a legerősebb).'],
      ['Atomrács','Kovalens kötések hálózata: gyémánt, kvarc. A grafit a kakukktojás.'],
      ['Fémes kötés','Szabadon mozgó elektronfelhő a fémrácsban.'],
      ['Ötvözet','Fémek más fémekkel vagy nemfémekkel alkotott keveréke.'],
      ['Reakciókészség','Arany → réz → vas → alumínium sorrendben nő.'],
      ['Kation és anion','Kation: pozitív ion (fémekből). Anion: negatív ion (nemfémekből).'],
      ['Ionvegyület képlete','A töltésszámok összege nulla. Pl. NaCl, MgO, CaCl₂, Al₂O₃.'],
      ['Ionvegyületek tulajdonságai','Szilárd, rideg, magas olvadáspont; oldatuk és olvadékuk vezeti az áramot.']
    ]},

  { type:'end', section:'Kész!' }
  ]
};
})();
