/* Kémia játék: Kémia-vetélkedő (az összes dolgozatkvíz véletlen sorrendben) */
(function(){
var SV = window.SV, ids = ['kemia-modell','kemia-alapismeretek','kemia-atomok','kemia-szerkezet','kemia-atalakulasok'];
var qs = [];
ids.forEach(function(id){ SV.scr(id, null, 'quiz').forEach(function(q){ qs.push(SV.as(q, 'Kvíz', {q: String(q.q).replace(/^\d+\.\s*/, '')})); }); });
for (var i = qs.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = qs[i]; qs[i] = qs[j]; qs[j] = t; }
SV.lesson('jatek-vetelkedo', [
  SV.intro('🏆','Kémia-vetélkedő','<p><b>'+qs.length+' kérdés</b> az egész 7. osztályos kémiaanyagból, <b>véletlen sorrendben</b>.</p><p>Minden kérdésnél 4 válasz közül választhatsz. Ha elsőre eltalálod, pontot kapsz!</p>')
].concat(qs));
})();
