/* Kémia játék: Periódusos rendszer-játék */
(function(){
var SV = window.SV, A = 'kemia-atomok', Mo = 'kemia-modell';
var pk = function(id,re,type,sec){ return SV.scr(id,re,type).map(function(s){ return SV.as(s,sec); }); };
SV.lesson('jatek-periodusos', [
  SV.intro('⚛️','Periódusos rendszer-játék','<p>Fedezd fel az elemeket, és tanuld meg a vegyjeleket!</p><ul><li>Először <b>koppints az elemekre</b>, és nézd meg az atommodelljüket.</li><li>Utána jönnek a játékok: memória, párosítás, csoportosítás.</li></ul>')
].concat(pk(A,/Fedezd fel/,'sim','Felfedezés'))
 .concat(pk(Mo,/Vegyjel-memória/,'memory','Játék 1'))
 .concat(pk(Mo,/Kösd össze a vegyjelet/,'match','Játék 2'))
 .concat(pk(A,/Melyik főcsoport/,'drag','Játék 3'))
 .concat(pk(A,/hány vegyértékelektron/,'match','Játék 4'))
 .concat(pk(A,/Proton, neutron/,'drag','Játék 5'))
 .concat(pk(A,/Kösd össze a főcsoportot/,'match','Játék 6')));
})();
