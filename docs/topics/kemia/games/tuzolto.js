/* Kémia játék: Tűz és redoxi */
(function(){
var SV = window.SV, T = 'kemia-atalakulasok';
var pk = function(re,type,sec){ return SV.scr(T,re,type).map(function(s){ return SV.as(s,sec); }); };
var gyors = {type:'drag', section:'Játék 3', title:'📦 Gyors vagy lassú égés?',
  bins:[{id:'gyors',name:'Gyors égés',icon:'🔥'},{id:'lassu',name:'Lassú égés',icon:'🐢'}],
  items:[{t:'a fáklya lángja',c:'gyors'},{t:'a gyertya égése',c:'gyors'},{t:'a gázláng',c:'gyors'},{t:'a vas rozsdásodása',c:'lassu'},{t:'az almaszelet megbarnulása',c:'lassu'},{t:'a cukor lebomlása a szervezetben',c:'lassu'}]};
var tok = {type:'drag', section:'Játék 4', title:'📦 Tökéletes vagy tökéletlen égés?',
  bins:[{id:'tok',name:'Tökéletes',icon:'✅'},{id:'tlen',name:'Tökéletlen',icon:'⚠️'}],
  items:[{t:'bőséges oxigén, kék láng',c:'tok'},{t:'a termék CO₂ és H₂O',c:'tok'},{t:'nem éghető termék keletkezik',c:'tok'},{t:'kevés oxigén, kormozó láng',c:'tlen'},{t:'szén-monoxid keletkezik',c:'tlen'},{t:'éghető termék is képződik',c:'tlen'}]};
SV.lesson('jatek-tuzolto', [
  SV.intro('🧯','Tűz és redoxi','<p>A gyors égéshez <b>három dolog</b> kell: <b>éghető anyag</b>, <b>gyulladási hőmérséklet</b>, <b>oxigén</b>.</p><p>Ha egyet megszüntetsz, a tűz kialszik. Az égés <b>oxidáció</b> (oxigénfelvétel, elektronleadás).</p>')
].concat(SV.scr(T,/Égés és tűzoltás/,'info').map(function(s){ return SV.as(s,'Tudnivaló'); }))
 .concat(pk(/Hogyan oltjuk/,'drag','Játék 1'))
 .concat(pk(/Oxidáció vagy redukció/,'drag','Játék 2'))
 .concat([gyors, tok]));
})();
