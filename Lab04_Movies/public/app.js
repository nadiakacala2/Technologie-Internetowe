const API_MOVIES = "/api/movies";
const API_RATINGS = "/api/ratings";

/* LISTA FILMÓW */
async function loadMovies() {
    const res = await fetch(API_MOVIES);
    const movies = await res.json();

    const tbody = document.querySelector("#moviesTable tbody");
    tbody.innerHTML = "";

    movies.forEach(m => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${m.id}</td>
            <td>${m.title}</td>
            <td>${m.year}</td>
            <td>${m.avg_score ?? "-"}</td>
            <td>${m.votes}</td>
        `;
        tbody.appendChild(tr);
    });
}

/* DODAWANIE FILMU */
document.getElementById("addMovieForm").addEventListener("submit", async e => {
    e.preventDefault();

    const title = document.getElementById("movieTitle").value.trim();
    const year = Number(document.getElementById("movieYear").value);

    const res = await fetch(API_MOVIES, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, year })
    });

    if (!res.ok) {
        const err = await res.json();
        alert(err.error || "Błąd dodawania filmu");
        return;
    }

    e.target.reset();
    loadMovies();
});

/* DODAWANIE OCENY */
document.getElementById("addRatingForm").addEventListener("submit", async e => {
    e.preventDefault();

    const movie_id = Number(document.getElementById("ratingMovieId").value);
    const score = Number(document.getElementById("ratingScore").value);

    const res = await fetch(API_RATINGS, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ movie_id, score })
    });

    if (!res.ok) {
        const err = await res.json();
        alert(err.error || "Błąd dodawania oceny");
        return;
    }

    e.target.reset();
    loadMovies(); // dynamiczna aktualizacja rankingu
});

/* INIT*/
loadMovies();
