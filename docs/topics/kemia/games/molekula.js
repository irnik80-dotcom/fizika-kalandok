/* Kémia játék: Molekulaépítő */
(function(){
var SV = window.SV;
var k1 = {type:'kit', section:'1. szint', title:'🧱 Építsd meg a molekulát! (képlettel)', atoms:['H','C','N','O','Cl'], mols:[
  {name:'vízmolekula', f:'H₂O', need:{H:2,O:1}, note:'2 hidrogén + 1 oxigén. V alakú, poláris.'},
  {name:'szén-dioxid-molekula', f:'CO₂', need:{C:1,O:2}, note:'1 szén + 2 oxigén. Egyenes, apoláris.'},
  {name:'oxigénmolekula', f:'O₂', need:{O:2}, note:'Két oxigénatom, kettős kötéssel.'},
  {name:'metánmolekula', f:'CH₄', need:{C:1,H:4}, note:'1 szén + 4 hidrogén. Ez a földgáz fő összetevője.'},
  {name:'hidrogén-klorid-molekula', f:'HCl', need:{H:1,Cl:1}, note:'Poláris, vízben jól oldódik (sósav).'},
  {name:'ammóniamolekula', f:'NH₃', need:{N:1,H:3}, note:'1 nitrogén + 3 hidrogén. Poláris.'}] };
var k2 = {type:'kit', section:'2. szint', title:'🧱 Építsd meg a molekulát! (képlet nélkül)', atoms:['H','C','N','O','Cl'], mols:[
  {name:'vízmolekula', f:'H₂O', need:{H:2,O:1}, hide:true, note:'2 hidrogén + 1 oxigén.'},
  {name:'metánmolekula', f:'CH₄', need:{C:1,H:4}, hide:true, note:'1 szén + 4 hidrogén.'},
  {name:'ammóniamolekula', f:'NH₃', need:{N:1,H:3}, hide:true, note:'1 nitrogén + 3 hidrogén.'},
  {name:'nitrogénmolekula', f:'N₂', need:{N:2}, hide:true, note:'Két nitrogénatom, hármas kötéssel.'},
  {name:'hidrogén-peroxid-molekula', f:'H₂O₂', need:{H:2,O:2}, hide:true, note:'2 hidrogén + 2 oxigén.'},
  {name:'szén-dioxid-molekula', f:'CO₂', need:{C:1,O:2}, hide:true, note:'1 szén + 2 oxigén.'}] };
SV.lesson('jatek-molekula', [
  SV.intro('🧱','Molekulaépítő','<p>A molekula <b>atomokból</b> áll. A képlet alsó indexe megmondja, hány atom kell.</p><ul><li>Koppints a <b>+</b> gombra az atom hozzáadásához.</li><li>A <b>−</b> gomb elvesz egyet.</li><li>A 2. szinten a <b>képletet nem látod</b>, neked kell tudnod!</li></ul>'),
  k1, k2
].concat(SV.scr('kemia-szerkezet', /Poláris vagy apoláris/, 'drag').map(function(s){ return SV.as(s,'Bónusz'); }))
 .concat(SV.scr('kemia-modell', /Elem, vegyület vagy keverék/, 'drag').map(function(s){ return SV.as(s,'Bónusz'); })));
})();
