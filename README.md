README zawiera instrukcję uruchomienia oraz skrócony opis
zrealizowanych funkcjonalności zgodnie ze specyfikacją laboratorium.

# Lab03 Blog: komentarze z moderacją (Blog)

## Opis
Prosta aplikacja typu blog umożliwiająca dodawanie postów oraz komentarzy,
w której komentarze podlegają ręcznej moderacji przed publikacje.

## Technologie
- Node.js
- Express
- SQLite
- HTML + JavaScript (fetch API)

## Uruchomienie projektu
npm install
npm run dev

Aplikacja uruchamia się pod adresem:
http://localhost:3000/

## Test działania serwera

Poprawność uruchomienia serwera została zweryfikowana poprzez
wywołanie endpointu testowego:
GET http://localhost:3000/

Uzyskana odpowiedź: Lab03 Blog API działa

### Testowanie obsługi błędów
Poprawność konfiguracji middleware została zweryfikowana poprzez
ręczne testy w przeglądarce oraz z poziomu PowerShella.

Dla nieistniejącego endpointu:
http://localhost:3000/nieistnieje

Aplikacja zwraca odpowiedź JSON: { "error": "Not Found" }
oraz poprawny kod statusu HTTP 404 (widoczny w narzędziach deweloperskich przeglądarki).

Zrzut ekranu: screens/01_404_network.png

Dodatkowo wykonano test z użyciem polecenia PowerShell:
Invoke-WebRequest http://localhost:3000/nieistnieje

Polecenie zgłasza wyjątek WebException, co jest standardowym
zachowaniem PowerShella dla odpowiedzi HTTP 4xx i potwierdza
poprawne działanie mechanizmu obsługi błędów po stronie serwera.

### Baza danych SQLite oraz tabele posts i comments
Zrealizowane elementy:
- automatyczna inicjalizacja bazy danych przy starcie serwera,
- utworzenie tabel `posts` oraz `comments`,
- relacja klucza obcego (`comments.post_id → posts.id`) z usuwaniem kaskadowym,
- domyślna moderacja komentarzy (`approved = 0`),
- indeks wspierający pobieranie komentarzy posta oraz moderację.

Baza danych zapisywana jest w pliku:
`db/database.sqlite`

### Weryfikacja struktury bazy danych
Poprawność utworzenia tabel może zostać zweryfikowana z poziomu środowiska Node.js
bez użycia zewnętrznych narzędzi graficznych.

W projekcie znajduje się plik pomocniczy:
`check-db.js`

Po uruchomieniu serwera aplikacji możliwe jest wykonanie polecenia:
node check-db.js

## API postów
Zaimplementowano podstawowe endpointy do obsługi postów.

Endpointy:
- GET /api/posts — lista postów,
- GET /api/posts/{id} — szczegóły posta,
- POST /api/posts — dodanie nowego posta.

Zaimplementowana została walidacja danych wejściowych:
- wymagane pola: `title`, `body`,
- brak danych skutkuje odpowiedzią 422 Unprocessable Entity.

### Testy poprawnego działania
Poprawność działania API została zweryfikowana poprzez:
- dodanie nowego posta metodą POST,
- pobranie listy postów metodą GET.

Zrzut ekranu: screens/02_post_add.png

Link: http://localhost:3000/api/posts
Link szczególy posta: http://localhost:3000/api/posts/1 

### Testy przypadków brzegowych

Dla nieistniejącego identyfikatora posta: http://localhost:3000/api/posts/9999 

Aplikacja zwraca odpowiedź:
{ "error": "Post not found" }

## Komentarze — dodawanie (moderacja)
Zaimplementowano dodawanie komentarzy do postów.
Nowe komentarze zapisywane są w bazie danych jako niezatwierdzone.

Endpoint:
- POST /api/posts/{id}/comments — dodanie komentarza do posta.

Zaimplementowana walidacja:
- wymagane pola: `author`, `body`,
- brak danych skutkuje odpowiedzią `422 Unprocessable Entity`.

Nowo dodany komentarz:
- posiada pole `approved = 0`,
- nie jest widoczny w widoku publicznym do momentu zatwierdzenia.

Zrzut ekranu:
- screens/03_comment_add_pending.png — poprawne dodanie komentarza oczekującego na moderację.

### Link testowy
- http://localhost:3000/api/posts/1/comments

## Komentarze — widok publiczny i anty-spam

Zaimplementowano publiczne pobieranie komentarzy przypisanych do posta.

Endpoint:
- GET /api/posts/{id}/comments — zwraca wyłącznie zatwierdzone komentarze.

Komentarze:
- z polem `approved = 0` nie są widoczne w widoku publicznym,
- zwracane są dopiero po zatwierdzeniu przez moderatora.

Dodatkowo zaimplementowano prosty mechanizm anty-spamowy:
- limit liczby komentarzy z jednego adresu IP,
- przekroczenie limitu skutkuje odpowiedzią `429 Too Many Requests`.

Zrzut ekranu:
- screens/04_comments_public_empty.png — brak komentarzy przed moderacją.

### Link testowy zwraca []
http://localhost:3000/api/posts/1/comments

## Komentarze — paginacja
Publiczny endpoint pobierania komentarzy obsługuje paginację
z wykorzystaniem parametrów zapytania.

Parametry:
- `page` — numer strony (domyślnie 1),
- `limit` — liczba komentarzy na stronę (domyślnie 5).

Endpoint:
- GET /api/posts/{id}/comments?page=1&limit=5

Zwracana odpowiedź zawiera:
- numer strony,
- limit,
- liczbę zwróconych rekordów,
- tablicę komentarzy.

Test domyślny: http://localhost:3000/api/posts/1/comments
Test z parametrami: http://localhost:3000/api/posts/1/comments?page=2&limit=3
Test walidacji paginacji: http://localhost:3000/api/posts/1/comments?page=0

## Moderacja komentarzy
Zaimplementowano ręczną moderację komentarzy.

Endpoint:
- POST /api/comments/{id}/approve — zatwierdzenie komentarza.

Endpoint moderacji jest zabezpieczony prostym mechanizmem autoryzacji:
- wymagany nagłówek `x-admin-token`,
- brak lub niepoprawny token skutkuje odpowiedzią `403 Forbidden`.

Po zatwierdzeniu komentarza:
- pole `approved` przyjmuje wartość `1`,
- komentarz staje się widoczny w widoku publicznym

Widok publiczny: http://localhost:3000/api/posts/1/comments

Zrzut ekranu:
screens/05_comment_approved_visible.png

## Bezpieczeństwo
Zaimplementowano podstawowe nagłówki bezpieczeństwa zgodnie z wymaganiami
niefunkcjonalnymi laboratorium.

Zastosowane nagłówki:
- `X-Content-Type-Options: nosniff`,
- `Referrer-Policy: no-referrer`,
- `Content-Security-Policy` (ograniczenie źródeł do `self`).

Nagłówki są ustawiane globalnie dla wszystkich odpowiedzi serwera.

Zrzut ekranu: `05_security_headers

## Obsługa błędów
W aplikacji zastosowano centralny mechanizm obsługi błędów
zrealizowany w postaci middleware `errorHandler.js`.

Mechanizm zapewnia:
- spójny format odpowiedzi błędów w formacie JSON,
- obsługę błędów aplikacyjnych i wyjątków serwera,
- oddzielenie logiki błędów od logiki biznesowej.

Test działania został wykonany w PowerShell
`Invoke-RestMethod http://localhost:3000/api/comments/1/approve -Method POST`

Odpowiedź: { "error": "Forbidden - invalid admin token" }

Zrzut ekranu:
screens/06_security_headers.png

## Frontend (UI)
Zaimplementowano prosty, czytelny interfejs użytkownika
umożliwiający obsługę bloga oraz moderację komentarzy
bezpośrednio z poziomu przeglądarki.

Frontend został zrealizowany w czystym HTML, CSS oraz JavaScript
i komunikuje się z backendem wyłącznie poprzez API (fetch).

Widok bloga (użytkownik)
http://localhost:3000/

Zaimplementowane funkcjonalności:
- wyświetlenie listy postów (dostępny jeden post: Pierwszy post),
- wyświetlenie wyłącznie zatwierdzonych komentarzy (approved = 1),
- formularz dodawania komentarza do posta.

Nowo dodany komentarz:
- zapisywany jest w bazie danych jako oczekujący na moderację (approved = 0),
- nie jest widoczny publicznie do momentu zatwierdzenia przez moderatora,
- po dodaniu użytkownik otrzymuje komunikat informacyjny.

## Panel Moderatora - Frontend (UI)
Dla potrzeb moderacji komentarzy zaimplementowano oddzielny widok
panelu moderatora.

Panel moderatora dostępny jest pod adresem:
http://localhost:3000/admin.html

Zaimplementowane funkcjonalności:
- wyświetlenie listy komentarzy oczekujących na zatwierdzenie,
- prezentacja autora, treści komentarza oraz identyfikatora posta,
- możliwość zatwierdzenia komentarza przyciskiem „Zatwierdź”.

Po zatwierdzeniu komentarza:
- pole approved zostaje ustawione na 1,
- komentarz znika z listy oczekujących,
- komentarz natychmiast staje się widoczny w publicznym widoku posta.

Zrzut ekranu: screens/07_admin_panel_pending_comments.png

## Posty — lista i szczegóły
Interfejs użytkownika realizuje obsługę postów w modelu
aplikacji typu Single Page Application (SPA).

Zaimplementowane funkcjonalności:
- wyświetlenie listy postów,
- dynamiczne pobieranie szczegółów posta po kliknięciu,
- prezentacja tytułu oraz treści posta bez przeładowania strony.

Szczegóły posta pobierane są z endpointu:
GET /api/posts/{id}

i wyświetlane w dedykowanej sekcji widoku użytkownika.
