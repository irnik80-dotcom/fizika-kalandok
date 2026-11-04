/* Kémia játék: Keverék-szétválasztó */
(function(){
var SV = window.SV, A = 'kemia-alapismeretek';
var pk = function(re,type,sec){ return SV.scr(A,re,type).map(function(s){ return SV.as(s,sec); }); };
SV.lesson('jatek-keverek', [
  SV.intro('🥣','Keverék-szétválasztó','<p>A keverékek alkotórészeit az <b>eltérő tulajdonságaik</b> alapján választjuk szét: méret, sűrűség, oldhatóság, mágnesesség, forráspont.</p><ul><li>Készíts oldatot a csúszkával.</li><li>Játssz a halmazállapotokkal és a szétválasztással!</li></ul>')
].concat(pk(/Készíts oldatot/,'sim','Oldatkészítő'))
 .concat(pk(/Halmazállapot-változások memória/,'memory','Játék 1'))
 .concat(pk(/Fizikai vagy kémiai változás\?/,'drag','Játék 2'))
 .concat(pk(/Milyen módszerrel/,'drag','Játék 3'))
 .concat(pk(/Exoterm vagy endoterm/,'drag','Játék 4'))
 .concat(pk(/a levegő összetevői/,'match','Játék 5')));
})();
