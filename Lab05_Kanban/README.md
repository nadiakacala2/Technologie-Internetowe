# Lab05 - Kanban (kolumny i zadania)
Aplikacja webowa typu Kanban umożliwiająca zarządzanie zadaniami
w trzech predefiniowanych kolumnach: Todo, Doing, Done.
Zadania mogą być dodawane oraz przenoszone pomiędzy kolumnami
z zachowaniem stabilnej kolejności (ord).

## Wykorzystane technologie
- Node.js
- Express
- SQLite
- HTML / CSS / JavaScript
- morgan
- helmet

## Uruchomienie projektu (developer)
- Inicjalizacja projektu Node.js przez `npm init -y`
  (powstaje package.json, ale plik jest w .zip)

- Instalacja zależności:
npm install express sqlite3
npm install morgan helmet


## Uruchomienie serwera
node src/server.js

Aplikacja będzie dostępna pod adresem:  
http://localhost:3000

Endpoint techniczny:  
http://localhost:3000/health  
zwraca: {"status":"ok"}

## Baza danych (SQLite)
Struktura bazy danych aplikacji Kanban tworzona jest automatycznie
przy starcie serwera z poziomu kodu Node.js.

Zaimplementowane tabele:
- columns – kolumny tablicy Kanban (Todo, Doing, Done)
- tasks – zadania przypisane do kolumn

Baza danych zapisywana jest w pliku:
`src/db/kanban.db`.

Integralność danych zapewniona jest poprzez klucze obce oraz
indeksy wspierające stabilną kolejność elementów (ord).

## Dane startowe (seed)
Przy starcie aplikacji automatycznie
dodawane są dane początkowe tablicy Kanban.

Zaimplementowany seed obejmuje:
- trzy predefiniowane kolumny: Todo, Doing, Done,
- ustaloną kolejność kolumn (ord = 1, 2, 3).

Mechanizm seedowania jest idempotentny,
co oznacza, że wielokrotne uruchomienie serwera
nie powoduje duplikacji danych.

## Weryfikacja danych startowych (Node.js)

Poprawność utworzenia struktury bazy danych oraz
wykonania seeda została zweryfikowana z poziomu kodu Node.js,
bez użycia zewnętrznych narzędzi GUI lub CLI.

W tym celu przygotowano pomocniczy skrypt:
`src/db/check-db.js`.

Skrypt wykonuje zapytanie do tabeli columns
i wypisuje w konsoli listę kolumn Kanban
wraz z ich kolejnością (ord).

Uruchomienie:
node src/db/check-db.js

Zrzut ekranu: screens/01_db_seed_columns_check.png

## API - tablica Kanban
GET /api/board
Endpoint zwraca aktualny stan tablicy Kanban.
Zwracane dane:
- lista kolumn (cols) posortowana według pola ord,
- lista zadań (tasks) posortowana według kolumny i kolejności.

Przykład:
http://localhost:3000/api/board

## Walidacja danych
Walidacja danych wejściowych realizowana jest
po stronie backendu przy użyciu middleware Express.

Sprawdzane są m.in.:
- poprawność tytułu zadania (title),
- poprawność identyfikatora kolumny (col_id),
- poprawność pozycji zadania w kolumnie (ord).

W przypadku niepoprawnych danych
API zwraca kod HTTP 422 (Unprocessable Entity)
oraz komunikat w formacie JSON.

## API - zadania
## POST /api/tasks
Endpoint umożliwia dodanie nowego zadania
do wskazanej kolumny tablicy Kanban.

Pozycja zadania (ord) ustalana jest automatycznie
jako ostatnia w danej kolumnie.

## POST /api/tasks/{id}/move
Endpoint umożliwia przeniesienie zadania
do innej kolumny oraz zmianę jego pozycji (ord).

Dane wejściowe podlegają walidacji, a API zwraca odpowiednie
kody HTTP (201, 404, 422).

Poprawność działania endpointów została zweryfikowana
ręcznie przy użyciu PowerShell (Invoke-RestMethod)
bez wykorzystania zewnętrznych narzędzi.

Zrzut ekranu: screens/02_api_tasks_powershell_happy_path.png

## Stabilna kolejność zadań (ord)
Podczas przenoszenia zadań pomiędzy kolumnami
zachowywana jest stabilna kolejność elementów (ord).

Mechanizm:
- zamyka luki w kolumnie źródłowej,
- przesuwa zadania w kolumnie docelowej,
- wykonuje operacje w transakcji SQLite.

Dzięki temu po odświeżeniu przeglądarki
widok tablicy Kanban odtwarza ten sam stan.

Zrzut ekranu: screens/03_api_tasks_stable_order_powershell.png

## Testy backendu (tests.rest)
W projekcie przygotowano plik tests/tests.rest
zawierający komplet przykładowych testów REST API,
obejmujących:
- poprawne scenariusze (happy path),
- przypadki walidacyjne (422),
- obsługę błędów (404).

Plik może być używany z rozszerzeniem REST Client
w Visual Studio Code lub traktowany jako dokumentacja
manualnych testów API.

Testy nie wymagają uruchamiania automatycznego
na etapie oddania projektu.

## Frontend – Drag & Drop
Mechanizm:
- zadania są elementami draggable,
- kolumny działają jako strefy drop,
- po upuszczeniu zadania wykonywane jest wywołanie API
POST /api/tasks/{id}/move,
- pozycja zadania (ord) ustalana jest automatycznie
na podstawie liczby elementów w kolumnie docelowej.

Bonus polegający na masowej zmianie kolejności zadań
jednym żądaniem API nie został zaimplementowany,
ponieważ nie jest wymagany do spełnienia kryteriów zaliczenia
oraz nie wpływa na podstawową funkcjonalność tablicy Kanban.

Zrzut ekranu: screens/04_frontend_kanban_board.png
