/* Kémia játék: pH-labor */
(function(){
var SV = window.SV, T = 'kemia-atalakulasok';
var pk = function(re,type,sec){ return SV.scr(T,re,type).map(function(s){ return SV.as(s,sec); }); };
SV.lesson('jatek-phlabor', [
  SV.intro('🎨','pH-labor','<p>A pH megmutatja, hogy egy oldat <b>savas</b> (0–7), <b>semleges</b> (7) vagy <b>lúgos</b> (7–14).</p><ul><li>Húzd a csúszkát, és nézd az indikátorok színét.</li><li>Utána sorold be a hétköznapi anyagokat!</li></ul>')
].concat(pk(/pH-skála/,'sim','pH-skála'))
 .concat(pk(/Savas, lúgos/,'drag','Játék 1'))
 .concat(pk(/indikátorok és színek/,'match','Játék 2'))
 .concat(pk(/Savak és bázisok memória/,'memory','Játék 3'))
 .concat(SV.scr(T,/Egészítsd ki a mondatot/,'cloze').map(function(s){ return SV.as(s,'Játék 4'); }))
 .concat(SV.scr(T,/Mit tehetünk a gyomorégés/,'quiz').map(function(s){ return SV.as(s,'Kvíz'); })));
})();
