-- Usuwanie tabel (idempotentnie)
DROP TABLE IF EXISTS ratings;
DROP TABLE IF EXISTS movies;

-- Tabela movies
CREATE TABLE movies (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    year INTEGER NOT NULL,
    CONSTRAINT chk_year CHECK (year >= 1888)
);

-- Tabela ratings
CREATE TABLE ratings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    movie_id INTEGER NOT NULL,
    score INTEGER NOT NULL,
    CONSTRAINT chk_score CHECK (score BETWEEN 1 AND 5),
    CONSTRAINT fk_movie
        FOREIGN KEY (movie_id)
        REFERENCES movies(id)
        ON DELETE CASCADE
);

-- Indeksy
CREATE INDEX idx_movies_year ON movies(year);
CREATE INDEX idx_ratings_movie_id ON ratings(movie_id);
