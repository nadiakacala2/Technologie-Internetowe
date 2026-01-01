# Lab06 – Notatki, tagi i wyszukiwanie (Notes)
Aplikacja webowa typu notatnik umożliwiająca tworzenie notatek,
przypisywanie do nich tagów oraz wyszukiwanie treści
po tytule i zawartości notatek.

System obsługuje relację wiele-do-wielu pomiędzy notatkami i tagami
oraz zapewnia integralność danych po stronie backendu.

## Wykorzystane technologie
- Node.js
- Express
- SQLite
- HTML / CSS / JavaScript
- cors
- (opcjonalnie: morgan, helmet)

## Uruchomienie projektu (developer)
### Inicjalizacja projektu
- Utworzenie projektu Node.js:
npm init -y

- Instalacja zależności:
npm install express sqlite3 cors

npm install express sqlite3 cors

## Uruchomienie serwera
node app.js

Aplikacja dostępna pod adresem:
http://localhost:3000

## Baza danych (SQLite)

Struktura bazy danych aplikacji Notes została zaprojektowana
z uwzględnieniem relacji wiele-do-wielu pomiędzy notatkami i tagami
oraz wymagań dotyczących integralności danych.

Tabela `note_tags` wykorzystuje złożony klucz główny
`(note_id, tag_id)`, co uniemożliwia przypisanie tego samego
tagu więcej niż jeden raz do tej samej notatki.

Baza danych zapisywana jest w pliku:
`db/database.db`

## Unikalność relacji notatka–tag
Relacja pomiędzy notatkami i tagami została
zrealizowana jako relacja wiele-do-wielu
z wykorzystaniem tabeli pośredniej `note_tags`.

## Inicjalizacja bazy danych
Struktura bazy danych tworzona jest automatycznie
na podstawie pliku SQL `db/init.sql`.

Inicjalizacja realizowana jest przy użyciu skryptu Node.js:
node db/init-db.js

## Weryfikacja struktury bazy danych (check DB)
Poprawność utworzenia tabel oraz ich struktury została zweryfikowana
z poziomu Node.js, bez użycia zewnętrznych narzędzi GUI.

W tym celu przygotowano pomocniczy skrypt:
`db/check-db.js`.

Uruchomienie:
node db/check-db.js

Zrzut ekranu: screens/01_db_structure_check.png

## API – notatki
### POST /api/notes
Endpoint umożliwia dodanie nowej notatki do systemu.

Dane wejściowe:
- `title` – tytuł notatki (wymagany),
- `body` – treść notatki (wymagana).

### GET /api/notes
Endpoint umożliwia pobranie listy wszystkich notatek
zapisanych w systemie.

Zwracane dane:
- `id` – identyfikator notatki,
- `title` – tytuł notatki,
- `body` – treść notatki,
- `created_at` – data i czas utworzenia notatki.

Notatki zwracane są w kolejności malejącej
według znacznika `created_at` (od najnowszej do najstarszej).

Link: http://localhost:3000/api/notes

## Wyszukiwanie notatek
Aplikacja Notes umożliwia wyszukiwanie notatek
na podstawie fragmentu tekstu występującego
w tytule lub treści notatki.

Wyszukiwanie realizowane jest poprzez parametr
zapytania `q` w endpointzie GET `/api/notes`.

### GET /api/notes?q=...
Jeżeli parametr `q` nie zostanie przekazany,
endpoint zwraca listę wszystkich notatek,
posortowanych malejąco według pola `created_at`.

Jeżeli parametr `q` zostanie przekazany,
zwracane są wyłącznie notatki, których:
- `title`
- `body`

zawiera podany fragment tekstu.

### Przykładowe żądania
Zrzuty ekranu:

GET /api/notes
screens/02_api_get_notes.png

GET /api/notes?q=zakupy
screens/03_api_get_notes_search.png 

## API – lista tagów
### GET /api/tags
Endpoint umożliwia pobranie listy wszystkich tagów
zdefiniowanych w systemie.

Zwracane dane:
- `id` – identyfikator tagu,
- `name` – nazwa tagu.

Tagi zwracane są w kolejności alfabetycznej
według pola `name`.

### Przykładowe żądanie
GET /api/tags

Zrzut ekranu: http://localhost:3000/api/tags

## API – przypisywanie tagów do notatki
### POST /api/notes/id}/tags
Endpoint umożliwia przypisanie tagów do wskazanej notatki.
Obsługiwana jest relacja wiele-do-wielu pomiędzy notatkami i tagami.

Jeżeli podany tag nie istnieje w systemie,
zostaje on automatycznie utworzony.
Jeżeli relacja pomiędzy notatką i tagiem już istnieje,
nie jest tworzona ponownie.

### Dane wejściowe
- `id` – identyfikator notatki (parametr ścieżki),
- `tags` – tablica nazw tagów.

Link:http://localhost:3000/api/tags

## Zachowanie endpointu
- sprawdza istnienie notatki,
- tworzy brakujące tagi w tabeli tags,
- przypisuje tagi do notatki w tabeli note_tags,
- zapobiega duplikacji relacji dzięki kluczowi głównemu
(note_id, tag_id).

W przypadku próby przypisania tagów do nieistniejącej notatki
API zwraca kod HTTP 404 (Not Found).

## Filtrowanie notatek po tagu (bonus)
Aplikacja Notes umożliwia filtrowanie notatek
na podstawie przypisanego tagu.

Filtrowanie realizowane jest poprzez parametr
zapytania `tag` w endpointzie GET `/api/notes`.

Zrzut ekranu: screens/04_bonus_filter_notes_by_tag.png

http://localhost:3000/api/notes

http://localhost:3000/api/notes?tag=shopping

## Walidacja danych (backend)

Wszystkie dane wejściowe są walidowane po stronie backendu.

### POST /api/notes
- `title` – wymagane, min. 3 znaki
- `body` – wymagane, min. 3 znaki

Błędy:
- `422 Unprocessable Entity` – brak wymaganych pól lub zbyt krótkie dane
- `500 Internal Server Error` – błąd bazy danych

### POST /api/notes/{id}/tags
- `id` – poprawny identyfikator notatki
- `tags` – niepusta tablica stringów

Błędy:
- `400 Bad Request` – niepoprawny identyfikator
- `422 Unprocessable Entity` – brak lub błędne tagi
- `404 Not Found` – notatka nie istnieje

Zrzut ekranu: screens/05_backend_validation.png

## Testy backendu (tests.rest)
W projekcie przygotowano plik `tests/tests.rest` zawierający przykładowe testy REST API.

Zakres testów:
- poprawne scenariusze (happy path),
- walidacja danych wejściowych (422),
- wyszukiwanie notatek (`q`),
- filtrowanie po tagach (`tag`),
- przypisywanie tagów do notatek (relacja wiele-do-wielu).

Plik `tests.rest` może być uruchamiany w Visual Studio Code
z użyciem rozszerzenia REST Client lub traktowany jako dokumentacja ręcznych testów API.

## Frontend — lista notatek i wyszukiwanie
Zaimplementowano minimalny interfejs użytkownika umożliwiający:
- wyświetlenie listy notatek pobieranej z backendu (`GET /api/notes`),
- wyszukiwanie notatek po tytule i treści (parametr `q`),
- automatyczną synchronizację UI z backendem (reload strony zachowuje stan danych).

Frontend jest serwowany statycznie przez Express
z katalogu `public/` i komunikuje się z backendem przy użyciu Fetch API.

Uruchomienie:
`node app.js`

Adres aplikacji:
http://localhost:3000

Zrzut ekranu:
screens/06_frontend_notes_list_search.png
