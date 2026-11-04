/* Közös lecke-motor: a tartalom a LESSON objektumból jön (lásd a topics/*.js fájlokat) */
(function () {
  'use strict';
  var L = window.LESSON;
  var $ = function (s) { return document.querySelector(s); };
  var stage = $('#stage'), nextBtn = $('#next'), backBtn = $('#back');
  var store = {
    get: function (k, d) { try { var v = localStorage.getItem(k); return v === null ? d : JSON.parse(v); } catch (e) { return d; } },
    set: function (k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  };

  /* --- beállítások: betűméret, téma --- */
  var fs = store.get('fiz-fs', 1);
  function applyFs() { document.body.classList.remove('fs-1', 'fs-2', 'fs-3'); document.body.classList.add('fs-' + fs); }
  applyFs();
  var theme = store.get('fiz-theme', '');
  if (theme) document.documentElement.setAttribute('data-theme', theme);
  $('#fsBtn').onclick = function () { fs = fs % 3 + 1; store.set('fiz-fs', fs); applyFs(); };
  $('#themeBtn').onclick = function () {
    var dark = document.documentElement.getAttribute('data-theme') === 'dark' ||
      (!document.documentElement.getAttribute('data-theme') && matchMedia('(prefers-color-scheme:dark)').matches);
    theme = dark ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', theme); store.set('fiz-theme', theme);
  };

  /* --- felolvasás --- */
  var ttsBtn = $('#ttsBtn');
  var synth = window.speechSynthesis;
  if (!synth) ttsBtn.hidden = true;
  ttsBtn.onclick = function () {
    if (synth.speaking) { synth.cancel(); return; }
    var t = (stage.innerText || stage.textContent || '').replace(/\s*\n+\s*/g, '. ');
    var u = new SpeechSynthesisUtterance(t); u.lang = 'hu-HU'; u.rate = .9; synth.speak(u);
  };

  /* --- képernyők előállítása (a "cat" típus elemenként külön képernyő) --- */
  var screens = [];
  L.screens.forEach(function (s) {
    if (s.type === 'cat') {
      s.items.forEach(function (it, i) { screens.push({ type: 'catItem', cats: s.cats, item: it, section: s.section, n: i + 1, of: s.items.length, title: s.title }); });
    } else if (s.type === 'calc') {
      for (var i = 0; i < (s.count || 3); i++) screens.push({ type: 'calcItem', gens: s.gens, section: s.section, idx: i });
    } else screens.push(s);
  });
  function weight(s) { return s.type === 'tf' ? s.items.length : s.type === 'balance' ? s.eqs.length : s.type === 'kit' ? s.mols.length : ['quiz', 'catItem', 'calcItem', 'match', 'drag', 'cloze'].indexOf(s.type) >= 0 ? 1 : 0; }
  var graded = screens.reduce(function (n, s) { return n + weight(s); }, 0);
  var pos = 0, done = {}, pts = {};
  function score() { var n = 0; Object.keys(pts).forEach(function (k) { n += Math.min(pts[k], weight(screens[k])); }); return n; }

  function el(tag, cls, html) { var e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; }
  function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function fmt(n) { return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' '); }
  function parseNum(s) { s = String(s).toLowerCase().replace(/[^0-9.,\-\s ]+$/, '').replace(/[\s ]/g, '').replace(',', '.'); return s === '' ? NaN : Number(s); }

  /* a rajzok kilógó feliratait a rajz szélességéhez igazítja */
  function clampOnce(root) {
    root.querySelectorAll('svg').forEach(function (svg) {
      var W = svg.viewBox.baseVal.width;
      svg.querySelectorAll('text').forEach(function (tx) {
        try {
          var b = tx.getBBox();
          if (b.x < 4 || b.x + b.width > W - 4) {
            var a = tx.getAttribute('text-anchor') || 'start', x = +tx.getAttribute('x');
            var avail = a === 'middle' ? 2 * Math.min(x, W - x) - 10 : a === 'end' ? x - 5 : W - x - 5;
            var fs = +tx.getAttribute('font-size') || 12;
            if (avail > 0 && b.width > avail) tx.setAttribute('font-size', Math.max(6.5, fs * avail / b.width * 0.97).toFixed(1));
          }
        } catch (err) {}
      });
    });
  }
  function clampSvg(root) {
    clampOnce(root); clampOnce(root);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { clampOnce(root); clampOnce(root); });
    setTimeout(function () { clampOnce(root); }, 600);
  }
  function unlock() { done[pos] = true; nextBtn.disabled = false; }
  function mark(correctFirst) { if (correctFirst && !done[pos]) pts[pos] = (pts[pos] || 0) + 1; }

  function go(n) {
    if (synth) synth.cancel();
    pos = Math.max(0, Math.min(screens.length - 1, n));
    var s = screens[pos];
    stage.innerHTML = '';
    $('#chip').textContent = s.section || '';
    $('#barfill').style.width = Math.round(pos / (screens.length - 1) * 100) + '%';
    backBtn.disabled = pos === 0;
    var interactive = ['quiz', 'catItem', 'calcItem', 'sim', 'match', 'memory', 'tf', 'drag', 'cloze', 'balance', 'kit'].indexOf(s.type) >= 0;
    nextBtn.disabled = interactive && !done[pos];
    nextBtn.textContent = pos === screens.length - 1 ? 'Kész' : 'Tovább ▶';
    nextBtn.hidden = s.type === 'end';
    R[s.type](s);
    window.scrollTo(0, 0);
    stage.focus({ preventScroll: true });
  }
  nextBtn.onclick = function () { go(pos + 1); };
  backBtn.onclick = function () { go(pos - 1); };

  var R = {};

  R.info = function (s) {
    var c = el('section', 'card');
    if (s.icon) c.appendChild(el('div', 'big-icon', s.icon));
    c.appendChild(el('h1', '', s.title));
    if (s.fig) c.appendChild(el('div', 'fig', s.fig));
    c.appendChild(el('div', 'say', s.body));
    if (s.tip) c.appendChild(el('div', 'tip', '<b>💡 TUDTAD?</b>' + s.tip));
    if (s.mc) c.appendChild(el('div', 'mc', '<b>⛏ MINECRAFTBAN</b>' + s.mc));
    if (s.src) c.appendChild(el('p', 'src', '📖 Tankönyv: ' + s.src));
    stage.appendChild(c);
    clampSvg(c);
  };

  R.sheet = function (s) {
    var w = el('section', 'sheet');
    var h = el('div', 'sh-head'); h.appendChild(el('h1', '', s.title)); h.appendChild(el('span', '', s.sub || ''));
    w.appendChild(h);
    s.cards.forEach(function (k) {
      var c = el('div', 'sh-card c' + k.c);
      c.appendChild(el('h2', 'sh-t', '<span class="sh-n">' + k.n + '</span><span>' + k.title + '</span>'));
      var b = el('div', 'sh-body', (k.fig ? '<div class="sh-fig">' + k.fig + '</div>' : '') + k.html);
      c.appendChild(b);
      if (k.note) c.appendChild(el('div', 'sh-note', k.note));
      w.appendChild(c);
    });
    stage.appendChild(w);
    clampSvg(w);
  };

  R.sim = function (s) {
    var c = el('section', 'card');
    c.appendChild(el('h2', '', s.title));
    c.appendChild(el('p', 'say', s.intro));
    var box = el('div'); c.appendChild(box);
    stage.appendChild(c);
    s.render(box, unlock);
    if (s.src) c.appendChild(el('p', 'src', '📖 Tankönyv: ' + s.src));
  };

  function feedback(c) { var f = el('div', 'fb'); f.setAttribute('role', 'status'); f.setAttribute('aria-live', 'polite'); c.appendChild(f); return f; }

  R.quiz = function (s) {
    var c = el('section', 'card');
    c.appendChild(el('h2', '', s.q));
    if (s.fig) c.appendChild(el('div', 'fig', s.fig));
    var opts = el('div', 'opts');
    var order = shuffle(s.options.map(function (o, i) { return { t: o, i: i }; }));
    var fb = feedback(c); var tries = 0, solved = false;
    order.forEach(function (o) {
      var b = el('button', 'btn opt alt', o.t); b.type = 'button';
      b.onclick = function () {
        if (solved) return;
        if (o.i === s.correct) {
          solved = true; b.className = 'btn opt good'; if (tries === 0) mark(true);
          fb.className = 'fb ok'; fb.innerHTML = '✅ <b>Jó!</b> ' + s.explain; unlock();
        } else {
          tries++; b.className = 'btn opt wrong'; b.disabled = true;
          fb.className = 'fb no'; fb.innerHTML = '🤔 Nem egészen. Próbáld újra! ' + (s.hint ? '<br><span class="hint">Tipp: ' + s.hint + '</span>' : '');
          if (tries >= 3) { solved = true; fb.innerHTML = '👉 A jó válasz: <b>' + s.options[s.correct] + '</b>. ' + s.explain; unlock(); }
        }
      };
      opts.appendChild(b);
    });
    c.insertBefore(opts, fb);
    stage.appendChild(c);
    clampSvg(c);
  };

  R.catItem = function (s) {
    var c = el('section', 'card');
    c.appendChild(el('p', 'hint', s.title + ' – ' + s.n + '/' + s.of));
    c.appendChild(el('div', 'item', s.item.t));
    var cats = el('div', 'cats'); var fb = feedback(c); var tries = 0, solved = false;
    s.cats.forEach(function (k) {
      var b = el('button', 'btn cat center', k.icon + ' ' + k.name); b.type = 'button'; b.dataset.c = k.id;
      b.onclick = function () {
        if (solved) return;
        if (k.id === s.item.c) {
          solved = true; b.classList.add('good'); if (tries === 0) mark(true);
          fb.className = 'fb ok'; fb.innerHTML = '✅ <b>Igen: ' + k.name + '.</b> ' + s.item.why; unlock();
        } else {
          tries++; b.classList.add('wrong'); b.disabled = true;
          fb.className = 'fb no'; fb.innerHTML = '🤔 Gondold át még egyszer! <span class="hint">Mi történik ezzel a testtel?</span>';
          if (tries >= 3) {
            solved = true; var right = s.cats.filter(function (x) { return x.id === s.item.c; })[0];
            fb.innerHTML = '👉 Ez: <b>' + right.name + '</b>. ' + s.item.why; unlock();
          }
        }
      };
      cats.appendChild(b);
    });
    c.insertBefore(cats, fb); stage.appendChild(c);
  };

  R.calcItem = function (s) {
    var g = s.gens[s.idx % s.gens.length](); var c = el('section', 'card');
    c.appendChild(el('h2', '', '🧮 Számoljunk!'));
    c.appendChild(el('p', 'say', g.q));
    var inp = el('input', 'input'); inp.type = 'text'; inp.inputMode = 'decimal'; inp.autocomplete = 'off'; inp.placeholder = 'Ide írd a számot (' + (g.u || 'J') + ')';
    inp.setAttribute('aria-label', 'Válasz');
    var fb = feedback(c); var tries = 0, solved = false;
    var ok = el('button', 'btn center', 'Ellenőrzöm'); ok.type = 'button';
    var hintB = el('button', 'btn alt center', '💡 Segítség'); hintB.type = 'button';
    hintB.onclick = function () { fb.className = 'fb'; fb.innerHTML = '💡 ' + g.hint; };
    function check() {
      if (solved) return;
      var v = parseNum(inp.value);
      if (isNaN(v)) { fb.className = 'fb no'; fb.innerHTML = 'Írj be egy számot, pl. <b>2500</b>.'; return; }
      if (Math.abs(v - g.a) <= (g.tol || 0.5)) {
        solved = true; if (tries === 0) mark(true); fb.className = 'fb ok'; fb.innerHTML = '✅ <b>Pontosan!</b> ' + g.explain; unlock();
      } else {
        tries++; fb.className = 'fb no'; fb.innerHTML = '🤔 Ez nem az. Próbáld újra, vagy kérj segítséget!';
        if (tries >= 3) { solved = true; fb.innerHTML = '👉 A megoldás: <b>' + fmt(g.a) + ' ' + (g.u || 'J') + '</b>. ' + g.explain; unlock(); }
      }
    }
    ok.onclick = check; inp.onkeydown = function (e) { if (e.key === 'Enter') check(); };
    c.appendChild(inp);
    var row = el('div', 'row'); row.appendChild(ok); row.appendChild(hintB); c.appendChild(row);
    c.appendChild(fb); stage.appendChild(c);
  };

  /* ---------- Wordwall-szerű játékok ---------- */
  function finishMsg(fb, html) { fb.className = 'fb ok'; fb.innerHTML = html; unlock(); }

  R.match = function (s) {
    var c = el('section', 'card'); c.appendChild(el('h2', '', s.title));
    c.appendChild(el('p', 'hint', 'Koppints egy elemre bal oldalon, aztán a hozzá tartozóra jobb oldalon.'));
    var cols = el('div', 'pairs'), A = el('div', 'col'), B = el('div', 'col'), fb = feedback(c);
    var sel = null, left = s.pairs.length, mistakes = 0;
    function mk(t, i, side) { var b = el('button', 'btn alt pb', t); b.type = 'button'; b.dataset.i = i; b.dataset.side = side; return b; }
    shuffle(s.pairs.map(function (p, i) { return i; })).forEach(function (i) { A.appendChild(mk(s.pairs[i][0], i, 'l')); });
    shuffle(s.pairs.map(function (p, i) { return i; })).forEach(function (i) { B.appendChild(mk(s.pairs[i][1], i, 'r')); });
    cols.appendChild(A); cols.appendChild(B); c.appendChild(cols); c.appendChild(fb);
    A.onclick = function (e) { var b = e.target.closest('.pb'); if (!b || b.disabled) return; if (sel) sel.classList.remove('sel'); sel = b; b.classList.add('sel'); };
    B.onclick = function (e) {
      var b = e.target.closest('.pb'); if (!b || b.disabled) return;
      if (!sel) { fb.className = 'fb'; fb.textContent = 'Előbb a bal oldalon válassz egyet!'; return; }
      if (sel.dataset.i === b.dataset.i) {
        sel.classList.remove('sel'); sel.classList.add('good'); b.classList.add('good'); sel.disabled = b.disabled = true; sel = null; left--;
        fb.className = 'fb ok'; fb.textContent = '✅ Jó pár!';
        if (!left) { if (!mistakes) mark(true); finishMsg(fb, '🎉 Mind megvan! Hibák: <b>' + mistakes + '</b>.'); }
      } else { mistakes++; b.classList.add('wrong'); setTimeout(function () { b.classList.remove('wrong'); }, 450); fb.className = 'fb no'; fb.textContent = '🤔 Nem ez tartozik hozzá. Próbáld újra!'; }
    };
    stage.appendChild(c);
  };

  R.memory = function (s) {
    var c = el('section', 'card'); c.appendChild(el('h2', '', s.title));
    c.appendChild(el('p', 'hint', 'Fordíts fel két kártyát. Ha összetartoznak, bent maradnak.'));
    var grid = el('div', 'memgrid'), fb = feedback(c), cards = [];
    s.pairs.forEach(function (p, i) { cards.push({ p: i, t: p[0] }); cards.push({ p: i, t: p[1] }); });
    var open = [], busy = false, found = 0, moves = 0;
    shuffle(cards).forEach(function (cd) {
      var b = el('button', 'mem', '<span>❓</span>'); b.type = 'button'; b.dataset.p = cd.p;
      b.onclick = function () {
        if (busy || b.classList.contains('up') || b.classList.contains('done')) return;
        b.classList.add('up'); b.innerHTML = '<span>' + cd.t + '</span>'; open.push({ b: b, cd: cd });
        if (open.length === 2) {
          moves++; var x = open[0], y = open[1]; open = [];
          if (x.cd.p === y.cd.p) {
            x.b.classList.add('done'); y.b.classList.add('done'); found++;
            if (found === s.pairs.length) finishMsg(fb, '🎉 Kész! Lépések: <b>' + moves + '</b>.');
          } else {
            busy = true; setTimeout(function () { [x, y].forEach(function (z) { z.b.classList.remove('up'); z.b.innerHTML = '<span>❓</span>'; }); busy = false; }, 900);
          }
        }
      };
      grid.appendChild(b);
    });
    c.appendChild(grid); c.appendChild(fb); stage.appendChild(c);
  };

  R.tf = function (s) {
    var c = el('section', 'card'), i = 0; c.appendChild(el('h2', '', s.title));
    var cnt = el('p', 'hint'), st = el('div', 'item'), row = el('div', 'row'), fb = feedback(c), nx = el('button', 'btn center', 'Következő állítás ▶');
    var yes = el('button', 'btn center', '✅ IGAZ'), no = el('button', 'btn alt center', '❌ HAMIS');
    [yes, no, nx].forEach(function (b) { b.type = 'button'; });
    nx.hidden = true; yes.dataset.v = '1'; no.dataset.v = '0';
    function draw() { var it = s.items[i]; cnt.textContent = (i + 1) + ' / ' + s.items.length; st.textContent = it.t; fb.className = 'fb'; fb.textContent = ''; yes.disabled = no.disabled = false; nx.hidden = true; }
    function ans(v) {
      var it = s.items[i]; yes.disabled = no.disabled = true;
      if (!!v === it.a) { mark(true); fb.className = 'fb ok'; fb.innerHTML = '✅ <b>Jó!</b> ' + it.why; }
      else { fb.className = 'fb no'; fb.innerHTML = '👉 Ez <b>' + (it.a ? 'igaz' : 'hamis') + '</b>. ' + it.why; }
      if (i < s.items.length - 1) nx.hidden = false; else unlock();
    }
    yes.onclick = function () { ans(1); }; no.onclick = function () { ans(0); };
    nx.onclick = function () { i++; draw(); };
    row.appendChild(yes); row.appendChild(no);
    [cnt, st, row, fb, nx].forEach(function (n) { c.appendChild(n); }); stage.appendChild(c); draw();
  };

  R.drag = function (s) {
    var c = el('section', 'card'); c.appendChild(el('h2', '', s.title));
    c.appendChild(el('p', 'hint', 'Húzd a szavakat a megfelelő dobozba. (Vagy: koppints a szóra, aztán a dobozra.)'));
    var pool = el('div', 'pool'), bins = el('div', 'bins'), fb = feedback(c), sel = null, left = s.items.length, mistakes = 0;
    var binEls = {};
    s.bins.forEach(function (b) { var d = el('div', 'bin', '<div class="bt">' + b.icon + ' ' + b.name + '</div><div class="bl"></div>'); d.dataset.b = b.id; bins.appendChild(d); binEls[b.id] = d; });
    function drop(chip, bin) {
      var it = chip._it;
      if (bin.dataset.b === it.c) { chip.classList.remove('sel'); chip.classList.add('placed'); chip.style.touchAction = ''; chip._done = true; bin.querySelector('.bl').appendChild(chip); left--; sel = null;
        fb.className = 'fb ok'; fb.textContent = '✅ ' + it.t + ' ✔';
        if (!left) { if (!mistakes) mark(true); finishMsg(fb, '🎉 Mind a helyén van! Hibák: <b>' + mistakes + '</b>.'); }
      } else { mistakes++; chip.classList.add('wrong'); setTimeout(function () { chip.classList.remove('wrong'); }, 450); fb.className = 'fb no'; fb.textContent = '🤔 Nem oda tartozik. Gondold át!'; }
    }
    shuffle(s.items).forEach(function (it) {
      var chip = el('button', 'dchip', it.t); chip.type = 'button'; chip._it = it;
      var sx, sy, moved = false, ghost = null, down = false;
      function binAt(e) { var t = document.elementFromPoint(e.clientX, e.clientY); return t && t.closest ? t.closest('.bin') : null; }
      chip.addEventListener('pointerdown', function (e) { if (chip._done) return; down = true; moved = false; sx = e.clientX; sy = e.clientY; try { chip.setPointerCapture(e.pointerId); } catch (x) {} });
      chip.addEventListener('pointermove', function (e) {
        if (!down) return;
        if (!moved && Math.hypot(e.clientX - sx, e.clientY - sy) > 8) { moved = true; ghost = chip.cloneNode(true); ghost.className = 'dchip ghost'; document.body.appendChild(ghost); chip.style.opacity = .35; }
        if (moved) { ghost.style.left = e.clientX + 'px'; ghost.style.top = e.clientY + 'px'; ghost.style.pointerEvents = 'none';
          Object.keys(binEls).forEach(function (k) { binEls[k].classList.remove('hot'); }); var b = binAt(e); if (b) b.classList.add('hot'); }
      });
      chip.addEventListener('pointerup', function (e) {
        if (!down) return; down = false;
        if (moved) { var b = binAt(e); if (ghost) ghost.remove(); ghost = null; chip.style.opacity = ''; Object.keys(binEls).forEach(function (k) { binEls[k].classList.remove('hot'); }); if (b) drop(chip, b); }
        else { if (sel) sel.classList.remove('sel'); sel = chip; chip.classList.add('sel'); }
      });
      chip.addEventListener('pointercancel', function () { down = false; if (ghost) ghost.remove(); ghost = null; chip.style.opacity = ''; });
      pool.appendChild(chip);
    });
    bins.addEventListener('click', function (e) { var b = e.target.closest('.bin'); if (b && sel && !sel._done && !e.target.closest('.dchip')) drop(sel, b); });
    c.appendChild(pool); c.appendChild(bins); c.appendChild(fb); stage.appendChild(c);
  };

  R.cloze = function (s) {
    var c = el('section', 'card'); c.appendChild(el('h2', '', s.title));
    c.appendChild(el('p', 'hint', 'Koppints egy szóra, és az az első üres helyre kerül. A kitöltött szóra koppintva visszaveheted.'));
    var parts = s.text.split('___'), slots = [], para = el('p', 'cloze'), bank = el('div', 'pool'), fb = feedback(c), tries = 0, solved = false;
    parts.forEach(function (t, i) {
      para.appendChild(document.createTextNode(t));
      if (i < parts.length - 1) { var sl = el('button', 'slot', '&nbsp;'); sl.type = 'button'; sl._w = null; sl._b = null; slots.push(sl); para.appendChild(sl);
        sl.onclick = function () { if (solved || !sl._b) return; sl._b.disabled = false; sl._b = null; sl._w = null; sl.innerHTML = '&nbsp;'; sl.className = 'slot'; }; }
    });
    shuffle(s.answers.concat(s.extra || [])).forEach(function (w) {
      var b = el('button', 'dchip', w); b.type = 'button';
      b.onclick = function () { if (solved) return; var e = slots.filter(function (x) { return !x._b; })[0]; if (!e) return; e._b = b; e._w = w; e.textContent = w; b.disabled = true; };
      bank.appendChild(b);
    });
    var ok = el('button', 'btn center', 'Ellenőrzöm'); ok.type = 'button';
    ok.onclick = function () {
      if (solved) return;
      if (slots.some(function (x) { return !x._b; })) { fb.className = 'fb no'; fb.textContent = 'Még van üres hely!'; return; }
      var bad = 0;
      slots.forEach(function (x, i) { if (x._w === s.answers[i]) x.className = 'slot good'; else { bad++; x.className = 'slot wrong'; } });
      if (!bad) { solved = true; if (!tries) mark(true); finishMsg(fb, '✅ <b>Pontos!</b> ' + (s.explain || '')); }
      else { tries++; fb.className = 'fb no'; fb.textContent = '🤔 A piros helyeken csere kell. Koppints rájuk, és próbáld újra!';
        slots.forEach(function (x, i) { if (x._w !== s.answers[i]) setTimeout(function () { if (!solved && x._b) { x._b.disabled = false; x._b = null; x._w = null; x.innerHTML = '&nbsp;'; x.className = 'slot'; } else if (!solved) { x.className = 'slot'; } }, 900); }); }
    };
    c.appendChild(para); c.appendChild(bank); c.appendChild(ok); c.appendChild(fb); stage.appendChild(c);
  };

  /* ---------- Egyenletrendező: koppintással állítható együtthatók, élő atomszámlálás ---------- */
  R.balance = function (s) {
    var c = el('section', 'card'), i = 0;
    c.appendChild(el('h2', '', s.title));
    c.appendChild(el('p', 'hint', 'Koppints a színes számokra (1 → 2 → 3 …), amíg mindkét oldalon ugyanannyi atom van!'));
    var eqBox = el('div', 'eq'), tbl = el('div', 'atoms'), cnt = el('p', 'hint'), fb = feedback(c);
    var nx = el('button', 'btn center', 'Következő egyenlet ▶'); nx.type = 'button'; nx.hidden = true;
    var co = [], q, species, btns, solved;
    function gcd(a, b) { return b ? gcd(b, a % b) : a; }
    function side(list, off) {
      var tot = {};
      list.forEach(function (sp, k) { Object.keys(sp[1]).forEach(function (el_) { tot[el_] = (tot[el_] || 0) + sp[1][el_] * co[off + k]; }); });
      return tot;
    }
    function upd() {
      var l = side(q.L, 0), r = side(q.R, q.L.length), keys = Object.keys(l);
      Object.keys(r).forEach(function (k) { if (keys.indexOf(k) < 0) keys.push(k); });
      var all = true, html = '';
      keys.forEach(function (k) { var a = l[k] || 0, b = r[k] || 0, ok = a === b; if (!ok) all = false; html += '<span class="at ' + (ok ? 'ok' : 'no') + '">' + k + ': ' + a + ' ' + (ok ? '=' : '≠') + ' ' + b + '</span>'; });
      tbl.innerHTML = html;
      if (!all) { fb.className = 'fb'; fb.textContent = 'A pirosan jelölt atomokból még nem egyforma a két oldalon.'; return; }
      var g = co.reduce(gcd);
      if (g > 1) { fb.className = 'fb'; fb.textContent = '👍 Egyenlők, de a számok még oszthatók! Keresd a legkisebb egész számokat.'; return; }
      solved = true; btns.forEach(function (b) { b.disabled = true; }); mark(true);
      fb.className = 'fb ok'; fb.innerHTML = '✅ <b>Kiegyenlítetted!</b> ' + (q.note || '');
      if (i < s.eqs.length - 1) nx.hidden = false; else unlock();
    }
    function draw() {
      q = s.eqs[i]; species = q.L.concat(q.R); co = species.map(function () { return 1; }); solved = false; nx.hidden = true; btns = [];
      cnt.textContent = (i + 1) + ' / ' + s.eqs.length;
      eqBox.innerHTML = '';
      species.forEach(function (sp, k) {
        if (k === q.L.length) eqBox.appendChild(el('span', 'arrow', '→')); else if (k > 0) eqBox.appendChild(el('span', 'plus', '+'));
        var b = el('button', 'coef', '1'); b.type = 'button'; b.dataset.i = k; b.setAttribute('aria-label', 'Együttható: ' + sp[0]);
        b.onclick = function () { if (solved) return; co[k] = co[k] % 9 + 1; b.textContent = co[k]; upd(); };
        btns.push(b);
        var grp = el('span', 'sp'); grp.appendChild(b); grp.appendChild(el('span', 'fm', sp[0])); eqBox.appendChild(grp);
      });
      fb.className = 'fb'; fb.textContent = ''; upd();
    }
    nx.onclick = function () { i++; draw(); };
    [cnt, eqBox, tbl, fb, nx].forEach(function (n) { c.appendChild(n); });
    stage.appendChild(c); draw();
  };

  /* ---------- Molekulaépítő: atomgolyók számolása a kívánt molekulához ---------- */
  var ACOL = { H: '#ffffff', C: '#555a63', N: '#4f86e0', O: '#e0524f', S: '#f2c230', Cl: '#6bc26b', Na: '#b07fe0', Mg: '#7fc7a0', Ca: '#e0a0c0', Fe: '#b08060' };
  R.kit = function (s) {
    var c = el('section', 'card'), i = 0, atoms = s.atoms || ['H', 'C', 'N', 'O', 'Cl'];
    c.appendChild(el('h2', '', s.title));
    c.appendChild(el('p', 'hint', 'Koppints a + és − gombokra, és rakd össze a kért molekula atomjait!'));
    var cnt = el('p', 'hint'), goal = el('div', 'item'), tray = el('div', 'kit'), pile = el('div', 'pile'), fb = feedback(c);
    var nx = el('button', 'btn center', 'Következő molekula ▶'); nx.type = 'button'; nx.hidden = true;
    var m, n, btns, solved;
    function check() {
      var diffs = [], ok = true;
      atoms.forEach(function (a) { var need = m.need[a] || 0, d = need - (n[a] || 0); if (d !== 0) { ok = false; diffs.push(d > 0 ? 'még kell ' + d + ' db ' + a : 'túl sok: ' + (-d) + ' db ' + a); } });
      pile.innerHTML = '';
      atoms.forEach(function (a) { for (var k = 0; k < (n[a] || 0); k++) pile.appendChild(el('span', 'atb', a)).style.background = ACOL[a] || '#ccc'; });
      if (!pile.childNodes.length) pile.appendChild(el('span', 'hint', 'Még üres. Koppints a + gombokra!'));
      if (!ok) { fb.className = 'fb'; fb.textContent = diffs.join(' · '); return; }
      solved = true; btns.forEach(function (b) { b.disabled = true; }); mark(true);
      fb.className = 'fb ok'; fb.innerHTML = '✅ <b>Megvan: ' + m.f + '!</b> ' + (m.note || '');
      if (i < s.mols.length - 1) nx.hidden = false; else unlock();
    }
    function draw() {
      m = s.mols[i]; n = {}; solved = false; nx.hidden = true; btns = [];
      cnt.textContent = (i + 1) + ' / ' + s.mols.length;
      goal.innerHTML = 'Építsd meg: <b>' + m.name + '</b>' + (m.hide ? '' : ' (' + m.f + ')');
      tray.innerHTML = '';
      atoms.forEach(function (a) {
        var rw = el('div', 'krow'), ball = el('span', 'atb big', a); ball.style.background = ACOL[a] || '#ccc';
        var minus = el('button', 'kbtn', '−'), plus = el('button', 'kbtn', '+'), num = el('b', 'knum', '0');
        minus.type = plus.type = 'button'; minus.setAttribute('aria-label', a + ' kevesebb'); plus.setAttribute('aria-label', a + ' több'); minus.dataset.a = a; plus.dataset.a = a; plus.dataset.k = '+'; minus.dataset.k = '-';
        minus.onclick = function () { if (solved) return; n[a] = Math.max(0, (n[a] || 0) - 1); num.textContent = n[a]; check(); };
        plus.onclick = function () { if (solved) return; n[a] = Math.min(9, (n[a] || 0) + 1); num.textContent = n[a]; check(); };
        btns.push(minus, plus); [ball, minus, num, plus].forEach(function (x) { rw.appendChild(x); }); tray.appendChild(rw);
      });
      fb.className = 'fb'; fb.textContent = ''; check();
    }
    nx.onclick = function () { i++; draw(); };
    [cnt, goal, tray, pile, fb, nx].forEach(function (x) { c.appendChild(x); });
    stage.appendChild(c); draw();
  };

  R.cards = function (s) {
    var c = el('section', 'card'); var i = 0, flipped = false, known = 0, order = shuffle(s.cards);
    c.appendChild(el('h2', '', s.title));
    var cnt = el('p', 'hint'); var f = el('button', 'flash'); f.type = 'button';
    f.setAttribute('aria-label', 'Kártya, koppints a megfordításhoz');
    var row = el('div', 'row'); var yes = el('button', 'btn center', '👍 Tudtam'); var no = el('button', 'btn alt center', '🔁 Még gyakorlom');
    [yes, no].forEach(function (b) { b.type = 'button'; b.hidden = true; });
    function draw() {
      if (i >= order.length) { c.innerHTML = ''; c.appendChild(el('h2', '', '🎉 Végigértél a kártyákon!')); c.appendChild(el('p', '', 'Tudtad: <b>' + known + '</b> / ' + order.length + '. Ha van "még gyakorlom", érdemes holnap újra átnézni.')); unlock(); return; }
      flipped = false; cnt.textContent = (i + 1) + ' / ' + order.length + ' – koppints a kártyára!';
      f.innerHTML = order[i][0]; yes.hidden = no.hidden = true;
    }
    f.onclick = function () { if (i >= order.length) return; flipped = !flipped; f.innerHTML = flipped ? order[i][1] : order[i][0]; yes.hidden = no.hidden = !flipped; };
    yes.onclick = function () { known++; i++; draw(); };
    no.onclick = function () { order.push(order[i]); i++; draw(); };
    row.appendChild(yes); row.appendChild(no);
    c.appendChild(cnt); c.appendChild(f); c.appendChild(row); stage.appendChild(c); draw();
  };

  R.end = function (s) {
    var firstTry = score(); var pct = graded ? firstTry / graded : 1; var stars = pct >= .85 ? 3 : pct >= .6 ? 2 : 1;
    var key = 'fiz-best-' + L.id; var best = Math.max(store.get(key, 0), stars); store.set(key, best);
    var c = el('section', 'card');
    c.appendChild(el('div', 'stars', '★'.repeat(stars) + '<span style="opacity:.25">' + '★'.repeat(3 - stars) + '</span>'));
    c.appendChild(el('h1', '', stars === 3 ? 'Mester vagy! 🏆' : stars === 2 ? 'Nagyon ügyes! 💎' : 'Jó kezdet! ⛏'));
    c.appendChild(el('div', 'bigscore', 'Elsőre jó: ' + firstTry + ' / ' + graded));
    c.appendChild(el('p', '', stars === 3 ? 'Ezt a leckét tudod. Holnap futtasd át a kártyákat, és kész vagy a dolgozatra.' :
      'A hibákból tanulunk. Ha újra végigmész, már ismerős lesz – a számok is mások lesznek a számolós feladatokban.'));
    var row = el('div', 'row'); var again = el('button', 'btn center', '🔁 Újra'); again.onclick = function () { location.reload(); };
    var home = el('a', 'btn alt center', '🏠 Főoldal'); home.href = 'index.html'; home.style.textDecoration = 'none'; home.style.display = 'inline-block';
    row.appendChild(again); row.appendChild(home); c.appendChild(row); stage.appendChild(c);
  };

  window.FizEngine = { el: el, fmt: fmt };
  go(0);
})();
