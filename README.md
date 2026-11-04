# Suli Kalandok

Minecraft-hangulatú, játékos gyakorló weboldal 7. osztályosoknak (olvasási, figyelmi és számolási nehézséggel küzdő gyerekeknek is). Egy fejezetnek három része van:

- **Vázlat** – színes, számozott kártyák rajzokkal, képletekkel és példákkal (egy oldalas összefoglaló)
- **Tanulás** – rövid lépésekre bontott magyarázat és kis szimulációk (periódusos rendszer, ionképzés, pH-skála, egyenletrendező)
- **Játékok és dolgozat gyakorló** – párosítás, memória, húzogatás, igaz/hamis, kitöltős mondatok, számolós feladatok, ismétlőkártyák

A haladás a böngészőben tárolódik, szerver nincs. Az oldal a `docs` mappából települ (GitHub Pages).

## Tantárgyak

| Tantárgy | Fejezet | Forrás |
|---|---|---|
| Fizika | 10 | Fizika 7–8. tankönyv (OH-FIZ78TA) |
| Kémia | 5 fejezet + 10 önálló játék | Kémia 7–8. tankönyv I. kötet (OH-KEM78TB/I) |
| Matematika, Történelem | – | később |

## Szerkezet

```
docs/index.html                 főoldal (tantárgyak)
docs/<tárgy>/index.html         egy tantárgy fejezetei
docs/<tárgy>/<fejezet>.html     egy fejezet oldala (a build készíti)
docs/topics/<tárgy>/*.js        a fejezetek tartalma (ezt kell szerkeszteni)
docs/topics/<tárgy>/games/*.js  önálló játékcsempék (a fejezetek feladatait használják újra)
docs/assets/                    közös stílus (style.css), rajzok (svg.js), lecke-motor (engine.js)
tools/build.py                  az oldalak előállítása
```

A régi, tantárgy nélküli fizika-címek (`/energia.html` stb.) átirányítanak az új helyre.

## Új fejezet hozzáadása

1. Írd meg a tartalmát: `docs/topics/<tárgy>/<fejezet>.js` (mintának bármelyik meglévő fájl jó).
2. Vedd fel a `tools/build.py` `SUBJECTS` listájába.
3. Futtasd: `python3 tools/build.py`

A feladattípusok: `sheet` (vázlat), `info`, `sim`, `quiz`, `match`, `memory`, `tf`, `drag`, `cloze`, `calc` (generált számolás), `balance` (egyenletrendező), `kit` (molekulaépítő), `cards`, `end`.
