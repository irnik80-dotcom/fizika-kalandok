/* Kémia játék: Egyenletrendező */
(function(){
var SV = window.SV;
var M = {'Fe':{Fe:1},'HCl':{H:1,Cl:1},'FeCl₂':{Fe:1,Cl:2},'H₂':{H:2},'Mg':{Mg:1},'MgCl₂':{Mg:1,Cl:2},'Al':{Al:1},'AlCl₃':{Al:1,Cl:3},
  'CaCO₃':{Ca:1,C:1,O:3},'CaCl₂':{Ca:1,Cl:2},'CO₂':{C:1,O:2},'H₂O':{H:2,O:1},'O₂':{O:2},'Fe₂O₃':{Fe:2,O:3},'C₃H₈':{C:3,H:8}};
var sp = function(n){ return [n, M[n]]; };
var EQ = function(L,R,sol,note){ return {L:L.map(sp), R:R.map(sp), sol:sol, note:note}; };
var l3 = {type:'balance', section:'3. szint', title:'⚖️ Rendezd az egyenleteket! (3. szint)', eqs:[
  EQ(['Fe','HCl'],['FeCl₂','H₂'],[1,2,1,1],'Fe + 2 HCl → FeCl₂ + H₂. A vas sósavval hidrogént fejleszt.'),
  EQ(['Mg','HCl'],['MgCl₂','H₂'],[1,2,1,1],'Mg + 2 HCl → MgCl₂ + H₂.'),
  EQ(['Al','HCl'],['AlCl₃','H₂'],[2,6,2,3],'2 Al + 6 HCl → 2 AlCl₃ + 3 H₂. Az alumínium is reagál a sósavval.'),
  EQ(['CaCO₃','HCl'],['CaCl₂','CO₂','H₂O'],[1,2,1,1,1],'CaCO₃ + 2 HCl → CaCl₂ + CO₂ + H₂O. A mészkő sósavval szén-dioxidot fejleszt.'),
  EQ(['Fe','O₂'],['Fe₂O₃'],[4,3,2],'4 Fe + 3 O₂ → 2 Fe₂O₃. A vas oxidációja (rozsdásodás).'),
  EQ(['C₃H₈','O₂'],['CO₂','H₂O'],[1,5,3,4],'C₃H₈ + 5 O₂ → 3 CO₂ + 4 H₂O. A propángáz tökéletes égése.')] };
var b = SV.scr('kemia-atalakulasok', /Rendezd/, 'balance');
SV.lesson('jatek-egyenlet', [
  SV.intro('⚖️','Egyenletrendező','<p>A reakcióegyenlet mindkét oldalán <b>ugyanannyi atomnak</b> kell lennie.</p><ul><li>Koppints a <b>színes számokra</b> (1 → 2 → 3 …).</li><li>A <b>zöld</b> atomszám egyezik, a <b>piros</b> még nem.</li><li>Keresd a <b>legkisebb egész számokat</b>.</li></ul><p>3 szint, összesen <b>17 egyenlet</b>.</p>')
].concat(b.map(function(s,i){ return SV.as(s, (i+1)+'. szint'); })).concat([l3]));
})();
