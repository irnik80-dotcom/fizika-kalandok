#!/usr/bin/env python3
"""Az oldalak előállítása a docs/ mappába (GitHub Pages).

  docs/index.html                  főoldal (tárgyak)
  docs/<tárgy>/index.html          egy tárgy fejezetei
  docs/<tárgy>/<téma>.html         egy fejezet oldala
  docs/<téma>.html                 átirányítás a régi címekről (fizika)

A tartalom a docs/topics/<tárgy>/<téma>.js fájlokban van.
Használat: python3 tools/build.py
"""
import os, hashlib

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'docs')
SITE = 'Suli Kalandok'

SUBJECTS = [
    {'id': 'fizika', 'name': 'Fizika', 'icon': '⚡', 'desc': '7. osztály · mérés, mozgás, energia, fény, hang, elektromosság, világűr',
     'topics': [
        ('bevezetes',     '📏', 'Bevezetés a fizikába',        'Mérés, sűrűség, idő, hőmérséklet', 'I. fejezet'),
        ('energia',       '⚡', 'Energia',                      'Energiafajták, energiaforrások, teljesítmény', 'II. fejezet'),
        ('mozgas',        '🏃', 'Mozgás és erő',                'Sebesség, gyorsulás, Newton törvényei', 'III. fejezet'),
        ('lendulet',      '🏀', 'Lendület és egyszerű gépek',   'Ütközés, forgás, inga, munka, emelők', 'IV. fejezet'),
        ('vizlevego',     '💧', 'Víz és levegő',                'Halmazállapotok, nyomás, Arkhimédész', 'V. fejezet'),
        ('elektromossag', '🔌', 'Elektromosság',                'Áram, feszültség, Ohm, mágnesek', 'VI. fejezet'),
        ('feny',          '💡', 'Világítás, fény',              'Tükrök, fénytörés, lencsék, szem', 'VII. fejezet'),
        ('hullamok',      '🔊', 'Hullámok',                     'Hang, hangszerek, fényhullámok', 'VIII. fejezet'),
        ('kornyezet',     '🌍', 'Környezetünk globális problémái', 'Légkör, energiatakarékosság, klíma', 'IX. fejezet'),
        ('egijelensegek', '🪐', 'Égi jelenségek',               'Nap, Hold, bolygók, űrkutatás', 'X. fejezet'),
     ]},
    {'id': 'kemia', 'name': 'Kémia', 'icon': '🧪', 'desc': '7. osztály · anyagok, atomok, molekulák, reakciók',
     'topics': [
        ('modell',        '🔬', 'Megfigyeléstől a modellig',    'Laboratórium, sűrűség, atom és molekula, vegyjelek', '1. fejezet'),
        ('alapismeretek', '🧫', 'Kémiai alapismeretek',         'Tulajdonságok, halmazállapotok, oldatok, keverékek', '2. fejezet'),
        ('atomok',        '⚛️', 'Az atomok felépítése',         'Proton, elektron, periódusos rendszer, mól', '3. fejezet'),
        ('szerkezet',     '💎', 'Szerkezet és tulajdonságok',   'Kötések, molekulák, fémek, ionvegyületek', '4. fejezet'),
        ('atalakulasok',  '🔥', 'A kémiai átalakulások',        'Reakciók, égés, redoxi, sav-bázis, számítások', '5. fejezet'),
     ],
     'games': [
        ('egyenlet',   '⚖️', 'Egyenletrendező',          'Rendezd ki a reakciókat: 17 egyenlet, három szint',                 ['atalakulasok']),
        ('molekula',   '🧱', 'Molekulaépítő',            'Rakd össze az atomokból a vizet, a metánt, az ammóniát és társaikat', ['modell','szerkezet']),
        ('periodusos', '⚛️', 'Periódusos rendszer-játék', 'Fedezd fel az elemeket, tanuld meg a vegyjeleket és a főcsoportokat', ['modell','atomok']),
        ('ionlabor',   '⚡', 'Ionlabor',                  'Alakíts atomot ionná, készíts ionvegyületeket, találd ki a kötést', ['szerkezet']),
        ('phlabor',    '🎨', 'pH-labor',                  'Indikátorok, savak, bázisok, közömbösítés',                        ['atalakulasok']),
        ('tuzolto',    '🧯', 'Tűz és redoxi',             'Égéstípusok, tűzoltás, oxidáció és redukció',                      ['atalakulasok']),
        ('keverek',    '🥣', 'Keverék-szétválasztó',      'Halmazállapotok, oldatok, szétválasztási módszerek',               ['modell','alapismeretek']),
        ('szamolo',    '🧮', 'Számoló-labor',             'Sűrűség, tömegszázalék, mól, reakciószámítás: végtelen feladat',   ['modell','alapismeretek','atomok','atalakulasok']),
        ('detektiv',   '🕵️', 'Anyag-detektív',            'Elem, vegyület, keverék, fém, rács: ismerd fel az anyagokat',     ['modell','atomok','szerkezet']),
        ('vetelkedo',  '🏆', 'Kémia-vetélkedő',           '20 kérdés az egész évfolyam anyagából, véletlen sorrendben',      ['modell','alapismeretek','atomok','szerkezet','atalakulasok']),
     ]},
    # később: matematika, történelem
]
SOON = [('➗', 'Matematika'), ('🏰', 'Történelem')]


def rd(p):
    return open(os.path.join(ROOT, p), encoding='utf-8').read()


def wr(p, s):
    full = os.path.join(ROOT, p)
    os.makedirs(os.path.dirname(full), exist_ok=True)
    open(full, 'w', encoding='utf-8').write(s)


def ver(*files):
    """Rövid ujjlenyomat a fájlok tartalmából: változáskor a böngésző új verziót tölt le."""
    h = hashlib.md5()
    for f in files:
        h.update(rd(f).encode('utf-8'))
    return h.hexdigest()[:8]


FONTS = ('<link rel="preconnect" href="https://fonts.googleapis.com">\n'
         '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Lexend:wght@400;600;800&family=Press+Start+2P&display=swap">')

BRAND = '⛏ SULI<br>KALANDOK'


def head(title, depth):
    up = '../' * depth
    return ('<meta charset="utf-8">\n<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">\n'
            '<title>%s</title>\n%s\n<link rel="stylesheet" href="%sassets/style.css?v=%s">\n') % (title, FONTS, up, ver('assets/style.css'))


def topic_page(subj, slug, title, scripts=None, v=None):
    v = v or ver('assets/style.css', 'assets/svg.js', 'assets/engine.js', 'topics/%s/%s.js' % (subj, slug))
    scripts = scripts or ('<script src="../assets/svg.js?v=%s"></script>\n<script src="../topics/%s/%s.js?v=%s"></script>\n<script src="../assets/engine.js?v=%s"></script>' % (v, subj, slug, v, v))
    return '''<!doctype html>
<html lang="hu">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>%(title)s – %(site)s</title>
%(fonts)s
<link rel="stylesheet" href="../assets/style.css?v=%(v)s">
</head>
<body class="fs-1 subj-%(subj)s">
<header class="top">
  <a class="brand" href="../index.html">%(brand)s</a>
  <div class="tools">
    <button class="tool" id="ttsBtn" type="button" aria-label="Felolvasás">🔊</button>
    <button class="tool" id="fsBtn" type="button" aria-label="Betűméret váltása">Aa</button>
    <button class="tool" id="themeBtn" type="button" aria-label="Világos / sötét mód">🌓</button>
  </div>
  <div class="row2"><span class="chip" id="chip"></span><div class="bar" aria-hidden="true"><i id="barfill" style="width:0"></i></div></div>
</header>
<main id="stage" tabindex="-1"></main>
<div class="nav">
  <button class="btn alt" id="back" type="button">◀ Vissza</button>
  <button class="btn" id="next" type="button">Tovább ▶</button>
</div>
%(scripts)s
</body>
</html>
''' % {'title': title, 'site': SITE, 'fonts': FONTS, 'v': v, 'subj': subj, 'slug': slug, 'brand': BRAND, 'scripts': scripts}


def game_page(subj, slug, title, tops):
    files = ['assets/style.css', 'assets/svg.js', 'assets/engine.js', 'topics/%s/games/%s.js' % (subj, slug)] + ['topics/%s/%s.js' % (subj, t) for t in tops]
    v = ver(*files)
    scripts = '<script src="../assets/svg.js?v=%s"></script>\n' % v
    for t in tops:
        scripts += '<script src="../topics/%s/%s.js?v=%s"></script>\n' % (subj, t, v)
    scripts += '<script src="../topics/%s/games/%s.js?v=%s"></script>\n<script src="../assets/engine.js?v=%s"></script>' % (subj, slug, v, v)
    return topic_page(subj, 'jatek-' + slug, title, scripts, v)


def cards(items, base=''):
    out = ''
    for slug, icon, name, desc, chap in items:
        out += ('<a class="lesson-link" href="%s%s.html"><div class="card"><div class="big-icon">%s</div><h2>%s</h2><p>%s</p>'
                '<p class="hint">%s · vázlat, tanulás, játék, dolgozat gyakorló</p></div></a>\n    ') % (base, slug, icon, name, desc, chap)
    return out


def page(title, depth, body, cls='fs-1 home'):
    return ('<!doctype html>\n<html lang="hu">\n<head>\n%s</head>\n<body class="%s">\n'
            '<header class="top"><a class="brand" href="%sindex.html">%s</a></header>\n<main>\n%s</main>\n</body>\n</html>\n'
            % (head(title, depth), cls, '../' * depth, BRAND, body))


def root_index():
    items = ''
    for s in SUBJECTS:
        n = len(s['topics'])
        items += ('<a class="lesson-link" href="%s/index.html"><div class="card"><div class="big-icon">%s</div><h2>%s</h2><p>%s</p>'
                  '<p class="hint">%d fejezet</p></div></a>\n    ') % (s['id'], s['icon'], s['name'], s['desc'], n)
    for icon, name in SOON:
        items += '<div class="card soon"><div class="big-icon">%s</div><h2>%s</h2><p>Hamarosan</p></div>\n    ' % (icon, name)
    body = ('  <h1 style="font-size:1.6em;margin:0 0 6px">Szia! Mit tanulunk ma?</h1>\n'
            '  <p class="hint" style="margin:0 0 18px">Válassz tantárgyat. Mindegyik fejezetben vázlat, játékok és dolgozat gyakorló vár.</p>\n'
            '  <div class="grid">\n    %s</div>\n') % items
    return page(SITE, 0, body)


def subject_index(s, built, games=()):
    items = cards([t for t in s['topics'] if t[0] in built])
    soon = ''.join('<div class="card soon"><div class="big-icon">🔒</div><h2>%s</h2><p>Hamarosan</p></div>\n    ' % t[2]
                   for t in s['topics'] if t[0] not in built)
    gm = ''
    if games:
        gcards = ''.join('<a class="lesson-link" href="jatek-%s.html"><div class="card game"><div class="big-icon">%s</div><h2>%s</h2><p>%s</p><p class="hint">játék · bármikor játszható</p></div></a>\n    ' % (g[0], g[1], g[2], g[3]) for g in games)
        gm = '  <h2 class="sec">🎮 Játékok</h2>\n  <p class="hint" style="margin:0 0 14px">Önálló játékok: a fejezetektől függetlenül, bármikor játszhatók.</p>\n  <div class="grid">\n    %s</div>\n' % gcards
    body = ('  <p class="hint" style="margin:0 0 6px"><a href="../index.html">← Tantárgyak</a></p>\n'
            '  <h1 style="font-size:1.6em;margin:0 0 6px">%s %s</h1>\n  <p class="hint" style="margin:0 0 18px">%s</p>\n'
            '  <h2 class="sec">📚 Fejezetek</h2>\n  <div class="grid">\n    %s%s</div>\n%s') % (s['icon'], s['name'], s['desc'], items, soon, gm)
    return page('%s – %s' % (s['name'], SITE), 1, body, 'fs-1 home subj-' + s['id'])


def redirect(target):
    return ('<!doctype html>\n<html lang="hu"><head><meta charset="utf-8"><title>%s</title>'
            '<meta http-equiv="refresh" content="0; url=%s"><link rel="canonical" href="%s">'
            '<script>location.replace("%s");</script></head><body><p><a href="%s">Tovább az oldalra</a></p></body></html>\n'
            % (SITE, target, target, target, target))


if __name__ == '__main__':
    for s in SUBJECTS:
        built = set()
        for slug, icon, name, desc, chap in s['topics']:
            if not os.path.exists(os.path.join(ROOT, 'topics', s['id'], slug + '.js')):
                continue
            wr('%s/%s.html' % (s['id'], slug), topic_page(s['id'], slug, name))
            built.add(slug)
        gbuilt = []
        for g in s.get('games', []):
            if os.path.exists(os.path.join(ROOT, 'topics', s['id'], 'games', g[0] + '.js')):
                wr('%s/jatek-%s.html' % (s['id'], g[0]), game_page(s['id'], g[0], g[2], g[4]))
                gbuilt.append(g)
        wr('%s/index.html' % s['id'], subject_index(s, built, gbuilt))
        print(s['id'], len(built), 'fejezet,', len(gbuilt), 'játék')
    wr('index.html', root_index())
    # régi címek (a fizika korábban a főoldalon volt)
    for slug, *_ in SUBJECTS[0]['topics']:
        wr('%s.html' % slug, redirect('fizika/%s.html' % slug))
    print('kész')
