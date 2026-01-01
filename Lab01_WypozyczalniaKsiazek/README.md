README zawiera instrukcjê uruchomienia oraz skrócony opis
zrealizowanych funkcjonalnoœci zgodnie ze specyfikacj¹ laboratorium.

# Lab01 – Wypo¿yczalnia ksi¹¿ek

## Opis
System wypo¿yczalni ksi¹¿ek z kontrol¹ dostêpnoœci egzemplarzy.

## Wymagania
- Node.js (LTS)
- npm

## Instalacja
npm install

## Uruchomienie
node server/index.js

Po uruchomieniu serwer dostêpny jest pod adresem: http://localhost:3000

## Test dzia³ania serwera
Poprawnoœæ uruchomienia serwera zosta³a zweryfikowana poprzez wywo³anie
endpointu testowego:
GET http://localhost:3000/api/health

Uzyskana odpowiedŸ:
{"status":"ok","service":"library-api"}

## Baza danych
W aplikacji wykorzystano bazê danych SQLite w postaci pliku library.db.
Baza danych jest inicjalizowana automatycznie przy uruchomieniu serwera, obejmuje ona tabele: members, books, loans. 
Poprawnoœæ utworzenia tabel zosta³a zweryfikowana podczas uruchamiania aplikacji.

## Czytelnicy (Members)
Zaimplementowano podstawowe operacje CRUD w zakresie wymaganym przez specyfikacjê:
Endpointy:
- `POST /api/members` — dodanie nowego czytelnika (email unikalny),
- `GET /api/members` — pobranie listy czytelników.

Zaimplementowana zosta³a walidacja unikalnoœci adresu email.  Próba dodania czytelnika 
z istniej¹cym adresem email skutkuje zwróceniem statusu 409 Conflict. 

Dostêpne pod adresem: http://localhost:3000/api/MEMBERS

### Testy – Czytelnicy (Members)

Poni¿ej przedstawiono przyk³adowe testy endpointów:
- dodanie nowego czytelnika (201 Created),
- próba dodania czytelnika z istniej¹cym adresem email (409 Conflict),
- pobranie listy czytelników.

Zrzut ekranu: screens/01_members_add_ok.png

## Ksi¹¿ki (Books)
Zaimplementowano obs³ugê ksi¹¿ek wraz z liczb¹ egzemplarzy (`copies`)
oraz dynamicznie wyliczan¹ liczb¹ dostêpnych egzemplarzy (`available`).

Endpointy:
- `POST /api/books` — dodanie nowej ksi¹¿ki (parametry: title, author, copies),
- `GET /api/books` — pobranie listy ksi¹¿ek wraz z liczb¹ dostêpnych egzemplarzy.

Pole available wyliczane jest na podstawie liczby wszystkich egzemplarzy oraz liczby aktywnych wypo¿yczeñ.

Dostêpne pod adresem: http://localhost:3000/api/books

### Testy – Ksi¹¿ki (Books)
Poprawnoœæ dzia³ania zosta³a zweryfikowana poprzez:
- dodanie nowej ksi¹¿ki,
- pobranie listy ksi¹¿ek wraz z informacj¹ `copies` oraz `available`.

Zrzut ekranu: screens/02_books_add_and_list.png

## Wypo¿yczenia (Loans)
Zaimplementowano kluczow¹ logikê biznesow¹ systemu wypo¿yczeñ.

Endpointy:
- `POST /api/loans/borrow` — wypo¿yczenie ksi¹¿ki
- `POST /api/loans/return` — zwrot ksi¹¿ki
- `GET /api/loans` — lista wypo¿yczeñ (z danymi czytelnika i ksi¹¿ki)

Logika biznesowa:
- ksi¹¿ka mo¿e zostaæ wypo¿yczona tylko, jeœli liczba aktywnych wypo¿yczeñ 
jest mniejsza ni¿ liczba egzemplarzy (copies),
- w przypadku braku dostêpnych egzemplarzy zwracany jest:
409 Conflict,
- domyœlny termin zwrotu to 14 dni,
- ponowny zwrot tej samej wypo¿yczonej ksi¹¿ki jest blokowany.

Zrzut ekranu: screens/04_return_same_book.png

Dostêpne pod adresem: http://localhost:3000/api/loans

## Testy - Wypo¿yczenia (Loans)

Przeprowadzono testy:
- poprawnego wypo¿yczenia ksi¹¿ki,
- próby wypo¿yczenia przy braku dostêpnych egzemplarzy (409 Conflict).

Zrzut ekranu: screens/03_loans_borrow_no_copies_ok.png

## Walidacja i statusy HTTP

W aplikacji zaimplementowano walidacjê danych po stronie backendu
oraz poprawne kody statusów HTTP, m.in.:

- 400 Bad Request — brak wymaganych danych,
- 404 Not Found — brak zasobu,
- 409 Conflict — konflikt danych (duplikat email, brak egzemplarzy),
- 500 Internal Server Error — b³¹d bazy danych.

## Bezpieczeñstwo i wymagania niefunkcjonalne

Zaimplementowano:
- nag³ówki bezpieczeñstwa (X-Content-Type-Options, Referrer-Policy, CSP),
- poprawny Content-Type dla odpowiedzi JSON,
- proste logowanie ¿¹dañ HTTP.

## Testy API

Do rêcznego testowania API wykorzystano:
- PowerShell (Invoke-RestMethod),
- przegl¹darkê internetow¹,
- plik tests.rest (VS Code REST Client).

## Frontend (minimalny)

Zaimplementowano prosty interfejs u¿ytkownika w HTML, CSS i JavaScript,
umo¿liwiaj¹cy:
- wyœwietlenie listy ksi¹¿ek z liczb¹ dostêpnych egzemplarzy,
- wypo¿yczenie ksi¹¿ki,
- podgl¹d aktywnych wypo¿yczeñ.

Frontend dostêpny jest pod adresem:
http://localhost:3000

## Uwaga koñcowa 
W folderze screens/ znajduj¹ siê zrzuty ekranu dokumentuj¹ce poprawne
dzia³anie aplikacji (happy path), zgodnie z wymaganiami laboratorium.