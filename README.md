# Fizika kalandok

Minecraft-hangulatú, 7. osztályos fizika gyakorló weboldal. Tíz fejezet, mindegyik külön oldalon: tanulás ábrákkal, játékok, dolgozat gyakorló és ismétlőkártyák.

Az oldal a `docs` mappából települ (GitHub Pages). A haladás a böngészőben tárolódik, szerver nincs.

## Szerkezet
- `docs/index.html` – főoldal
- `docs/<téma>.html` – a fejezetek oldalai (a `tools/build.py` állítja elő)
- `docs/topics/*.js` – a fejezetek tartalma
- `docs/assets/` – közös stílus, ábrasegéd és a lecke-motor

## Oldalak újragyártása
```
python3 tools/build.py
```
