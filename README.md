# gepilatas
Gépi látás tárgyhoz tartozó repo

# Fejlesztői dokumentáció
## Kosár függvények
### setProduct(name, count, price, unit):
Termék beállítása a kosárban

name : string - A termék neve

count : integer - a termék darabszáma

price : integer - a termék ára (opcionális)

unit : string - egység (db, kg stb.) (opcionális)

Ha sikerült a végrehajtás akkor igaz különben hamis
### addProduct(name, count)
Termékszám módosítása a kosárba

name : string - A termék neve

count : integer - a hozzáadandó darabszám

Ha sikerült a végrehajtás akkor igaz különben hamis

## Videó függvények
### async listVideo()
Kilistázza a videóforrásokat

Promise objektumot ad vissza, igaz ha sikeres a kilistázás különben hamis

### async setVideo(id)
Beállítja a megadott videóforrást

id: string - videóforrás egyedi UUID-ja

Promise objektumot ad vissza, igaz ha sikeres a kilistázás különben hamis

### async startVideo()
Videó első indítása

Promise objektumot ad vissza, igaz ha sikeres a kilistázás különben hamis


### drawCanvas(name, x, y, width, height)
Kirajzol egy dobozt az objektum nevével,

name: string - Objektum neve

x:integer - X koordináta (bal felső)

y: integer - Y koordináta (bal felső)

width: integer - objektum szélessége

height: integer - objektum magassága

nincs visszatérési értéke

### clearCanvas()
Törli az összes kijelzett objektumot

nincs visszatérési értéke

## Objektum detektáló függvények
