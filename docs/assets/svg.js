/* Közös, blokkos ábrasegéd */
window.SV = {
  fs:function(txt,base,maxw){ var f=Math.floor(maxw/(String(txt).length*0.62)); return Math.max(7,Math.min(base,f)); },
  svg:function(label, inner){ return '<svg viewBox="0 0 320 160" role="img" aria-label="'+label+'" font-family="Lexend,system-ui,sans-serif" font-weight="700">'+inner+'</svg>'; },
  r:function(x,y,w,h,f){ return '<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" fill="'+f+'" stroke="#1b2618" stroke-width="3"/>'; },
  t:function(x,y,s,sz,a,f){ return '<text x="'+x+'" y="'+y+'" font-size="'+(sz||13)+'" text-anchor="'+(a||'middle')+'" fill="'+(f||'currentColor')+'">'+s+'</text>'; },
  arrow:function(x1,y,x2,col){ var d=x2>x1?-10:10; return '<line x1="'+x1+'" y1="'+y+'" x2="'+x2+'" y2="'+y+'" stroke="'+(col||'#d6403f')+'" stroke-width="6"/><polygon points="'+x2+','+y+' '+(x2+d)+','+(y-10)+' '+(x2+d)+','+(y+10)+'" fill="'+(col||'#d6403f')+'"/>'; },
  sun:function(x,y){ var o=''; [[-34,0],[34,0],[0,-34],[0,34],[-24,-24],[24,-24],[-24,24],[24,24]].forEach(function(d){ o+='<rect x="'+(x+d[0]-5)+'" y="'+(y+d[1]-5)+'" width="10" height="10" fill="#f2b705"/>'; }); return o+SV.r(x-20,y-20,40,40,'#ffd23f'); },
  fire:function(x,y){ return SV.r(x,y,10,10,'#ff9f1c')+SV.r(x+10,y-10,10,20,'#ff6b1c')+SV.r(x+20,y,10,10,'#ffd23f'); }
};
SV.graphST = function(lines){ /* lines: [{k:sebesség m/s,c:szín,n:név}] ; tengely: t 0-4 s, s 0-80 m */
  var o='', X=function(t){return 40+t*65}, Y=function(s){return 170-s*1.875}, i;
  for(i=0;i<=4;i++){ o+='<line x1="'+X(i)+'" y1="20" x2="'+X(i)+'" y2="170" stroke="#8b8f87" stroke-width="1"/>'+SV.t(X(i),188,i,12); }
  for(i=0;i<=80;i+=20){ o+='<line x1="40" y1="'+Y(i)+'" x2="300" y2="'+Y(i)+'" stroke="#8b8f87" stroke-width="1"/>'+SV.t(32,Y(i)+4,i,12,'end'); }
  o+='<line x1="40" y1="170" x2="300" y2="170" stroke="currentColor" stroke-width="3"/><line x1="40" y1="170" x2="40" y2="15" stroke="currentColor" stroke-width="3"/>'+SV.t(300,200,'t (s)',12,'end')+SV.t(44,12,'s (m)',12,'start');
  lines.forEach(function(l){ var t2=Math.min(4,80/l.k); o+='<line x1="'+X(0)+'" y1="'+Y(0)+'" x2="'+X(t2)+'" y2="'+Y(l.k*t2)+'" stroke="'+l.c+'" stroke-width="5"/>'+SV.t(X(t2)+6,Y(l.k*t2)+4,l.n,14,'start',l.c); });
  return '<svg viewBox="0 0 320 205" role="img" aria-label="Út–idő grafikon" font-family="Lexend,system-ui,sans-serif" font-weight="700">'+o+'</svg>'; };

/* képletháromszög: top = felül, l = bal alul, r = jobb alul */
SV.tri = function(label, top, l, r, cap){
  return SV.svg(label, SV.r(110,10,100,50,'#ffd23f')+SV.t(160,46,top,30,'middle','#1b2618')+
    SV.r(40,78,100,50,'#9fe07f')+SV.t(90,114,l,30,'middle','#1b2618')+SV.r(180,78,100,50,'#8fc2f5')+SV.t(230,114,r,30,'middle','#1b2618')+
    SV.t(160,150,cap||'',12)); };
/* folyamatábra: items = [[szöveg, szín], ...], labels = nyilak feliratai */
SV.flow = function(label, items, labels, cap){
  var n=items.length, w=Math.min(84, (300-(n-1)*34)/n), gap=(300-n*w)/(n-1||1), o='';
  items.forEach(function(it,i){ var x=10+i*(w+gap);
    o+=SV.r(x,50,w,44,it[1])+SV.t(x+w/2,77,it[0],SV.fs(it[0],w>70?13:11,w-6),'middle','#1b2618');
    if(i<n-1){ var ax=x+w+3, bx=x+w+gap-3; o+='<line x1="'+ax+'" y1="72" x2="'+(bx-8)+'" y2="72" stroke="#d6403f" stroke-width="4"/><polygon points="'+bx+',72 '+(bx-9)+',65 '+(bx-9)+',79" fill="#d6403f"/>';
      if(labels&&labels[i]) o+=SV.t((ax+bx)/2,44,labels[i],10,'middle'); } });
  return SV.svg(label, o+(cap?SV.t(160,135,cap,12):'')); };
/* hullám */
SV.wave = function(label, amp, periods, cap){
  var pts=[], N=120, i; for(i=0;i<=N;i++){ var x=20+i*(280/N); pts.push(x+','+(80-amp*Math.sin(i/N*periods*2*Math.PI))); }
  return SV.svg(label,'<line x1="20" y1="80" x2="300" y2="80" stroke="#8b8f87" stroke-width="2" stroke-dasharray="5 4"/><polyline points="'+pts.join(' ')+'" fill="none" stroke="#2f7fd1" stroke-width="5"/>'+(cap?SV.t(160,150,cap,12):'')); };
/* címkézett dobozok sorban */
SV.boxes = function(label, items, cap){
  var n=items.length, w=(300-(n-1)*8)/n, o='';
  items.forEach(function(it,i){ var x=10+i*(w+8); o+=SV.r(x,40,w,60,it[1])+SV.t(x+w/2,76,it[0],SV.fs(it[0],w>110?13:11,w-8),'middle','#1b2618'); });
  return SV.svg(label,o+(cap?SV.t(160,130,cap,12):'')); };

/* vázlat-kártyák építőelemei */
SV.row  = function(fig, html){ return '<div class="sh-row"><div class="sh-fig">'+fig+'</div><div class="sh-txt">'+html+'</div></div>'; };
SV.mini = function(title, html){ return '<div class="mini"><b class="mt">'+title+'</b>'+html+'</div>'; };
SV.grid = function(){ return '<div class="sh-grid">'+Array.prototype.join.call(arguments,'')+'</div>'; };

/* ===== Kémiai ábrák ===== */
SV.COL = {H:'#ffffff', C:'#555a63', N:'#4f86e0', O:'#e0524f', S:'#f2c230', Cl:'#6bc26b', Na:'#b07fe0', Mg:'#7fc7a0', Fe:'#b08060', Cu:'#d68a4a', Al:'#b9c2cc', Ca:'#e0a0c0', K:'#c48be0', Si:'#c9b08a', P:'#f0a060', F:'#a8e0a0', Br:'#a0452d', I:'#7a3bbd', He:'#e9e2ff', Ne:'#ffd0b0', Ar:'#d8b8ff'};
/* Bohr-modell: shells = elektronok héjanként, pl. [2,8,1] */
SV.atom = function(label, sym, shells, cap, protons){
  var cx=100, cy=80, o='', R=[24,40,56,72];
  shells.forEach(function(n,i){
    o+='<circle cx="'+cx+'" cy="'+cy+'" r="'+R[i]+'" fill="none" stroke="#8b8f87" stroke-width="2"/>';
    for(var k=0;k<n;k++){ var a=(k/n)*2*Math.PI-Math.PI/2+i*0.5; o+='<circle cx="'+(cx+R[i]*Math.cos(a)).toFixed(1)+'" cy="'+(cy+R[i]*Math.sin(a)).toFixed(1)+'" r="4.5" fill="#2f7fd1" stroke="#1b2618" stroke-width="1.5"/>'; }
  });
  o+='<circle cx="'+cx+'" cy="'+cy+'" r="15" fill="'+(SV.COL[sym]||'#ffd23f')+'" stroke="#1b2618" stroke-width="3"/>'+SV.t(cx,cy+5,sym,13,'middle','#1b2618');
  var T=function(y,txt,base){ return SV.t(196,y,txt,SV.fs(txt,base,118),'start'); };
  o+=T(48,sym+(protons?' ('+protons+' proton)':''),13)+T(70,shells.join(' · ')+' elektron',12)+T(92,'külső héj: '+shells[shells.length-1]+' e⁻',12)+(cap?T(122,cap,11):'');
  return SV.svg(label,o); };
/* molekulamodell: atoms=[[jel,x,y]], bonds=[[i,j,rend]] */
SV.mol = function(label, atoms, bonds, cap){
  var o='';
  bonds.forEach(function(b){ var A=atoms[b[0]], B=atoms[b[1]], n=b[2]||1, dx=B[2]-A[2], dy=A[1]-B[1]; var L=Math.hypot(B[1]-A[1],B[2]-A[2])||1, nx=(B[2]-A[2])/L, ny=-(B[1]-A[1])/L;
    for(var k=0;k<n;k++){ var off=(k-(n-1)/2)*7; o+='<line x1="'+(A[1]+nx*off)+'" y1="'+(A[2]+ny*off)+'" x2="'+(B[1]+nx*off)+'" y2="'+(B[2]+ny*off)+'" stroke="#1b2618" stroke-width="4"/>'; } });
  atoms.forEach(function(a){ var r=a[0]==='H'?12:17; o+='<circle cx="'+a[1]+'" cy="'+a[2]+'" r="'+r+'" fill="'+(SV.COL[a[0]]||'#ccc')+'" stroke="#1b2618" stroke-width="3"/>'+SV.t(a[1],a[2]+5,a[0],12,'middle',(a[0]==='H'||a[0]==='S'||a[0]==='Cl')?'#1b2618':'#fff'); });
  return SV.svg(label,o+(cap?SV.t(160,152,cap,12):'')); };
/* részecskék: szilárd, folyadék, gáz */
SV.states = function(label){
  var o='', pan=function(x,t){ return SV.r(x,25,92,92,'#e9f2ff')+SV.t(x+46,135,t,12); };
  o+=pan(15,'szilárd')+pan(114,'folyadék')+pan(213,'gáz');
  for(var i=0;i<4;i++)for(var j=0;j<4;j++) o+='<circle cx="'+(32+i*20)+'" cy="'+(42+j*20)+'" r="7" fill="#2f7fd1" stroke="#1b2618" stroke-width="1.5"/>';
  [[130,98],[150,100],[170,96],[190,100],[138,80],[160,82],[182,80],[146,62],[170,64],[135,46],[158,48],[184,50]].forEach(function(p){ o+='<circle cx="'+p[0]+'" cy="'+p[1]+'" r="7" fill="#2f7fd1" stroke="#1b2618" stroke-width="1.5"/>'; });
  [[232,45],[270,60],[245,95],[290,38],[262,105],[225,75],[298,90]].forEach(function(p){ o+='<circle cx="'+p[0]+'" cy="'+p[1]+'" r="7" fill="#2f7fd1" stroke="#1b2618" stroke-width="1.5"/>'; });
  return SV.svg(label,o); };
/* kristályrács: ionok váltakozva */
SV.lattice = function(label, a, b, cap){
  var o=''; for(var i=0;i<4;i++)for(var j=0;j<4;j++){ var odd=(i+j)%2; o+='<circle cx="'+(60+i*38)+'" cy="'+(30+j*30)+'" r="'+(odd?9:13)+'" fill="'+(odd?a:b)+'" stroke="#1b2618" stroke-width="2"/>'; }
  return SV.svg(label,o+(cap?SV.t(230,70,cap,12,'start'):'')); };

/* ===== Játékoldalak: feladatok kiválasztása a fejezetekből ===== */
SV.scr = function(id, re, type){ var L=(window.ALL||{})[id]; if(!L) return []; return L.screens.filter(function(s){ return (!type||s.type===type) && (!re || re.test(String(s.title||s.q||''))); }); };
SV.as = function(s, section, extra){ var c={}, k; for(k in s) c[k]=s[k]; c.section=section; if(extra) for(k in extra) c[k]=extra[k]; return c; };
SV.lesson = function(id, screens){ window.LESSON={ id:id, screens:screens.concat([{type:'end', section:'Kész!'}]) }; };
SV.intro = function(icon, title, html){ return {type:'info', section:'Játék', icon:icon, title:title, body:html}; };
