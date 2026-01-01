README zawiera instrukcjê uruchomienia oraz skrócony opis
zrealizowanych funkcjonalnoœci zgodnie ze specyfikacj¹ laboratorium

# Lab02 — Sklep: koszyk i zamówienia

## Opis
Prosta aplikacja sklepu internetowego umo¿liwiaj¹ca zarz¹dzanie produktami,
obs³ugê koszyka oraz finalizacjê zamówieñ z zapisem do bazy danych.

## Technologie
- Node.js
- Express
- SQLite (better-sqlite3)
- HTML + JavaScript (fetch API)

## Uruchomienie projektu
npm install
npm start

Aplikacja uruchamia siê pod adresem:
http://localhost:3000

## Testy API
Do rêcznego testowania endpointów API wykorzystano PowerShell
z u¿yciem polecenia `Invoke-WebRequest`.

## Test dzia³ania serwera
Poprawnoœæ uruchomienia serwera zosta³a zweryfikowana poprzez
wywo³anie endpointu testowego:
GET http://localhost:3000/

Uzyskana odpowiedŸ:
Lab02 Shop dzia³a

## Model danych
W aplikacji wykorzystano bazê danych SQLite w postaci pliku database.sqlite.
Baza danych jest inicjalizowana automatycznie przy uruchomieniu serwera
i obejmuje nastêpuj¹ce tabele:
- products — katalog produktów
- orders — zamówienia
- order_items — pozycje zamówieñ (snapshot ceny)

Poprawnoœæ utworzenia bazy danych i tabel zosta³a zweryfikowana
podczas uruchamiania aplikacji.

## Produkty (Products)
Zaimplementowano operacje CRUD w zakresie wymaganym przez specyfikacjê.

Endpointy:
- `POST /api/products` — dodanie nowego produktu (name, price),
- `GET /api/products` — pobranie listy produktów.

Zaimplementowana zosta³a walidacja danych:
- cena produktu musi byæ liczb¹ nieujemn¹,
- brak wymaganych danych skutkuje b³êdem 422 Unprocessable Entity.

Dostêpne pod adresem:
http://localhost:3000/api/products

## Testy - Produkty (Products)
Poprawnoœæ dzia³ania zosta³a zweryfikowana poprzez:
- dodanie nowego produktu (201 Created),
- pobranie listy produktów (200 OK).

Przyk³adowe testy wykonano w PowerShell z u¿yciem Invoke-WebRequest:

Zrzut ekranu: screens/01_products_add_and_list.png

## Koszyk - Cart
Zaimplementowano koszyk zakupowy przechowywany w pamiêci aplikacji (in-memory).

Endpointy:
- `POST /api/cart/add` — dodanie produktu do koszyka,
- `GET /api/cart` — pobranie zawartoœci koszyka,
- `PATCH /api/cart/item` — zmiana iloœci produktu w koszyku,
- `DELETE /api/cart/item/{product_id}` — usuniêcie produktu z koszyka.

Zaimplementowana zosta³a walidacja danych:
- iloœæ produktu (qty) musi byæ wiêksza od 0,
- próba modyfikacji lub usuniêcia nieistniej¹cej pozycji skutkuje b³êdem 404.

Dostêpne pod adresem:
http://localhost:3000/api/cart

## Testy - Koszyk (Cart)
Poprawnoœæ dzia³ania koszyka zosta³a zweryfikowana poprzez:
- dodanie produktu do koszyka,
- pobranie zawartoœci koszyka,
- zmianê iloœci produktu,
- usuniêcie produktu z koszyka.

Przyk³adowe testy wykonano w PowerShell z u¿yciem Invoke-WebRequest
oraz Invoke-RestMethod.

Zrzuty ekranu:
- screens/02_cart_add_and_list.png — dodanie produktu i podgl¹d koszyka,
- screens/03_cart_update_and_remove.png — zmiana iloœci i usuniêcie produktu.

## Zamówienie - Checkout
Zaimplementowano finalizacjê zamówienia z zapisem do bazy danych.

Endpoint
- `POST /api/checkout` — utworzenie zamówienia na podstawie koszyka.

Podczas checkoutu:
- tworzony jest rekord w tabeli `orders`,
- tworzony jest zestaw rekordów w tabeli `order_items`,
- zapisywana jest cena produktu jako snapshot (niezale¿nie od póŸniejszych zmian),
- obliczana jest ³¹czna kwota zamówienia,
- koszyk jest automatycznie czyszczony po poprawnym z³o¿eniu zamówienia.

Zwracana odpowiedŸ:
{ "order_id": <id>, "total": <kwota> }

Do zweryfikowania `orders`, `order_items` s³u¿y komenda: node check-db.js

## Testy – Zamówienie (Checkout)
Poprawnoœæ dzia³ania zosta³a zweryfikowana poprzez:
- dodanie produktu do koszyka,
- wykonanie checkoutu,
- potwierdzenie zapisu zamówienia,
- sprawdzenie, ¿e koszyk po checkout jest pusty.

Zrzut ekranu: screens/04_checkout_ok.png

## Weryfikacja zapisu danych w bazie
Poprawnoœæ zapisu zamówieñ zosta³a dodatkowo zweryfikowana
poprzez bezpoœredni odczyt danych z bazy SQLite (tabele `orders`
oraz `order_items`) z poziomu œrodowiska Node.js.

Zrzut ekranu: screens/05_db_orders_and_items_dodatek.png

## Walidacja i statusy HTTP
W aplikacji zaimplementowano walidacjê danych po stronie backendu
oraz poprawne kody statusów HTTP, m.in.:

- `200 OK` — poprawne pobranie lub modyfikacja danych,
- `201 Created` — poprawne utworzenie zasobu,
- `204 No Content` — poprawne usuniêcie zasobu,
- `422 Unprocessable Entity` — b³êdne dane wejœciowe,
- `404 Not Found` — brak wskazanego zasobu.

## Bezpieczeñstwo i wymagania niefunkcjonalne
Zaimplementowano:
- nag³ówki bezpieczeñstwa (X-Content-Type-Options, Referrer-Policy, CSP),
- poprawne nag³ówki Content-Type dla odpowiedzi JSON,
- proste logowanie ¿¹dañ HTTP (metoda, URL, status).

## Frontend (UI)
Zaimplementowano prosty interfejs u¿ytkownika w HTML, CSS i JavaScript,
umo¿liwiaj¹cy obs³ugê sklepu z poziomu przegl¹darki.

Funkcjonalnoœci frontendu:
- wyœwietlenie listy produktów,
- dodawanie produktów do koszyka,
- podgl¹d zawartoœci koszyka,
- finalizacjê zamówienia (checkout) z komunikatem potwierdzaj¹cym,
- automatyczne odœwie¿enie koszyka po z³o¿eniu zamówienia.

Frontend komunikuje siê z backendem wy³¹cznie poprzez API (`fetch`).

Dostêpny pod adresem:
http://localhost:3000

Zrzut ekranu:
- screens/06_frontend_checkout_ok.png — poprawne z³o¿enie zamówienia z poziomu interfejsu u¿ytkownika.

## Testy endpointów (tests.rest)
W projekcie znajduje siê plik `tests.rest` zawieraj¹cy kompletne
przyk³ady wywo³añ API zgodnie ze specyfikacj¹ laboratorium
(produkty, koszyk, checkout, walidacja i przypadki b³êdne).

Plik mo¿e zostaæ uruchomiony w Visual Studio Code
z u¿yciem rozszerzenia REST Client.