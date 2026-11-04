/* Kémia játék: Ionlabor */
(function(){
var SV = window.SV, S = 'kemia-szerkezet';
var pk = function(re,type,sec){ return SV.scr(S,re,type).map(function(s){ return SV.as(s,sec); }); };
SV.lesson('jatek-ionlabor', [
  SV.intro('⚡','Ionlabor','<p>Az atomok <b>ionná</b> alakulnak, ha elektront adnak le (kation, +) vagy vesznek fel (anion, −).</p><ul><li>Próbáld ki az <b>ionképzőt</b> és az <b>ionvegyület-készítőt</b>.</li><li>Utána játékok jönnek: atom → ion, ionvegyületek, kötések.</li></ul>')
].concat(pk(/Készíts iont/,'sim','Ionképző'))
 .concat(pk(/Ionvegyület-készítő/,'sim','Ionvegyület-készítő'))
 .concat(pk(/atom → ion/,'match','Játék 1'))
 .concat(pk(/Ionvegyület-memória/,'memory','Játék 2'))
 .concat(pk(/Milyen kötés/,'drag','Játék 3'))
 .concat(pk(/Milyen rácsot/,'drag','Játék 4')));
})();
