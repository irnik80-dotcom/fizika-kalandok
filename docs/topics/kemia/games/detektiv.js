/* Kémia játék: Anyag-detektív */
(function(){
var SV = window.SV, Mo='kemia-modell', A='kemia-atomok', Sz='kemia-szerkezet';
var pk = function(id,re,type,sec){ return SV.scr(id,re,type).map(function(s){ return SV.as(s,sec); }); };
SV.lesson('jatek-detektiv', [
  SV.intro('🕵️','Anyag-detektív','<p>Ismerd fel az anyagokat! Elem, vegyület vagy keverék? Fém vagy nemfém? Milyen rácsot alkot, és milyen kötés tartja össze?</p>')
].concat(pk(Mo,/Elem, vegyület vagy keverék/,'drag','Nyomozás 1'))
 .concat(pk(Mo,/Fém vagy nemfém/,'drag','Nyomozás 2'))
 .concat(pk(Sz,/Milyen rácsot/,'drag','Nyomozás 3'))
 .concat(pk(Sz,/Milyen kötés/,'drag','Nyomozás 4'))
 .concat(pk(Sz,/Poláris vagy apoláris/,'drag','Nyomozás 5'))
 .concat(pk(A,/Proton, neutron/,'drag','Nyomozás 6'))
 .concat(pk(Mo,/mi micsoda/,'match','Nyomozás 7')));
})();
