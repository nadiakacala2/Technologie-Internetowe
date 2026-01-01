# Lab04 – Filmy i oceny (Movies)
Aplikacja webowa umo¿liwiaj¹ca dodawanie filmów, ocen u¿ytkowników oraz 
generowanie rankingu filmów na podstawie œredniej oceny i liczby g³osów. 

## Wykorzystane technologie
- Node.js
- Express
- SQLite
- HTML / CSS / JavaScript
- morgan – logowanie ¿¹dañ HTTP
- helmet – podstawowe nag³ówki bezpieczeñstwa

## Wymagane biblioteki
Projekt wykorzystuje nastêpuj¹ce zale¿noœci:

- `express`
- `sqlite3`
- `morgan`
- `helmet`

## Uruchomienie projektu
- Inicjalizacja projektu Node.js:
npm init -y

- Instalacja zale¿noœci:
npm install express sqlite3
npm install morgan helmet

- ## Uruchomienie serwera
node src/server.js

Aplikacja bêdzie dostêpna pod adresem:
http://localhost:3000

## Baza danych (SQLite)
Struktura bazy danych aplikacji tworzona jest automatycznie przy starcie serwera
z poziomu kodu Node.js (bez u¿ycia zewnêtrznych narzêdzi CLI).

Baza danych zapisywana jest w pliku:
`db/movies.db`.

## Weryfikacja utworzenia tabel
W celu potwierdzenia poprawnego utworzenia struktury bazy danych
zosta³ przygotowany pomocniczy skrypt: `check-db.js`.

Skrypt wykonuje zapytanie do systemowej tabeli SQLite (`sqlite_master`)
i wypisuje listê wszystkich tabel znajduj¹cych siê w bazie danych.

Uruchomienie: `node check-db.js`

Zrzut ekranu: screens/01_db_tables_created.png

## Dane testowe (seed)
Na potrzeby testowania dzia³ania API oraz mechanizmu rankingu
zosta³y dodane minimalne dane testowe do bazy SQLite.

Seed danych realizowany jest z poziomu Node.js
bez u¿ycia zewnêtrznych narzêdzi.

Plik:
`db/seed.js`

Uruchomienie: `node db/seed.js`

## API – filmy i ranking

Po uruchomieniu serwera aplikacja udostêpnia REST API
umo¿liwiaj¹ce pobieranie listy filmów wraz z ich rankingiem.

### GET /api/movies
Endpoint zwraca listê wszystkich filmów zapisanych w bazie danych.
Dla ka¿dego filmu obliczana jest:
- œrednia ocena (`avg_score`) zaokr¹glona do 2 miejsc,
- liczba oddanych g³osów (`votes`).

Wyniki sortowane s¹ malej¹co wed³ug œredniej oceny.

Link testowy: http://localhost:3000/api/movies

### Filtrowanie po roku (bonus)
Endpoint obs³uguje opcjonalny parametr zapytania `year`,
umo¿liwiaj¹cy pobranie filmów z konkretnego roku.

Przyk³ad:
http://localhost:3000/api/movies?year=2010

### Ranking Top-N (bonus)
API udostêpnia dodatkowy endpoint umo¿liwiaj¹cy pobranie
najlepiej ocenianych filmów.

Endpoint:
http://localhost:3000/api/movies/top

Parametr opcjonalny:
- `limit` — liczba filmów w rankingu (domyœlnie 5)

Przyk³ad:
http://localhost:3000/api/movies/top?limit=3

## Obs³uga b³êdów
Aplikacja zwraca spójne odpowiedzi b³êdów w formacie JSON
oraz odpowiednie kody HTTP (404, 422, 500).

Walidacja danych wejœciowych realizowana jest po stronie backendu.

Zrzut ekranu:
screens/02_api_404_error.png

## Testy API (tests.rest)
W projekcie znajduje siê plik `tests.rest` zawieraj¹cy przyk³adowe
wywo³ania endpointów API (happy path oraz przypadki b³êdów).

Plik mo¿e byæ u¿ywany opcjonalnie z rozszerzeniem „REST Client”
w edytorze Visual Studio Code lub traktowany jako dokumentacja
przyk³adowych zapytañ HTTP.

## Frontend (UI)
Aplikacja posiada prosty interfejs u¿ytkownika dostêpny w przegl¹darce,
umo¿liwiaj¹cy interakcjê z backendem bez u¿ycia zewnêtrznych narzêdzi
(Postman, REST Client itp.).

Widok g³ówny aplikacji dostêpny jest pod adresem:
http://localhost:3000

Zaimplementowane funkcjonalnoœci interfejsu:
- wyœwietlenie rankingu filmów wraz z:
  - identyfikatorem filmu (ID),
  - tytu³em,
  - rokiem produkcji,
  - œredni¹ ocen¹,
  - liczb¹ oddanych g³osów,
- formularz dodawania nowego filmu (title, year),
- formularz dodawania oceny do filmu na podstawie jego ID,
- dynamiczna aktualizacja listy filmów po dodaniu filmu lub oceny
  (bez restartu serwera i bez odœwie¿ania strony).

Komunikacja frontend;backend realizowana jest przy u¿yciu Fetch API
oraz odpowiedzi JSON.

Zrzut ekranu przedstawiaj¹cy dzia³aj¹cy interfejs:
screens/03_frontend_movies_ranking.png

## Testy manualne interfejsu u¿ytkownika (UI)
Poprawnoœæ dzia³ania interfejsu u¿ytkownika zosta³a zweryfikowana
poprzez rêczne testy w przegl¹darce internetowej.

Zakres testów obejmowa³:
- poprawne wyœwietlanie listy filmów wraz z danymi (ID, tytu³, rok, œrednia, liczba g³osów),
- dodawanie nowego filmu z poziomu formularza UI,
- dodawanie oceny do filmu na podstawie jego identyfikatora,
- dynamiczn¹ aktualizacjê rankingu po dodaniu filmu lub oceny,
- brak b³êdów JavaScript w konsoli przegl¹darki.

Testy potwierdzi³y poprawn¹ integracjê oraz spe³nienie wymagañ funkcjonalnych aplikacji.