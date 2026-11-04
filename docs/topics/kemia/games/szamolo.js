/* Kémia játék: Számoló-labor (generált számolós feladatok az egész évfolyamból) */
(function(){
var SV = window.SV;
var calc = function(id, section, count){ var c = SV.scr(id, null, 'calc')[0]; return c ? SV.as(c, section, {count:count}) : null; };
var formulas = {type:'info', section:'Képletek', icon:'📋', title:'Képletek egy helyen',
  body:'<ul><li><b>Sűrűség:</b> ρ = m : V (g/cm³)</li><li><b>Tömegszázalék:</b> m(oldott) = m(oldat) · tömeg% : 100</li><li><b>Anyagmennyiség:</b> n = m : M (mol), m = n · M</li><li><b>Részecskeszám:</b> N = n · 6·10²³</li><li><b>Reakciószámítás:</b> az együtthatók az anyagmennyiségek arányát adják.</li></ul><p><b>Atomtömegek:</b> H 1 · C 12 · N 14 · O 16 · Na 23 · Mg 24 · S 32 · Cl 35,5 · Ca 40 · Fe 56</p>'};
SV.lesson('jatek-szamolo', [
  SV.intro('🧮','Számoló-labor','<p>Végtelen sok számolós feladat: <b>minden alkalommal új számokkal</b>.</p><p>4 téma: sűrűség, oldatok, anyagmennyiség, reakciószámítás. Három hibás próbálkozás után megmutatom a megoldást.</p>'),
  formulas,
  calc('kemia-modell','Sűrűség',5), calc('kemia-alapismeretek','Oldatok',6), calc('kemia-atomok','Mól',6), calc('kemia-atalakulasok','Reakciók',6)
].filter(Boolean));
})();
