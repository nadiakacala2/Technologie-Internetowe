document.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.getElementById("searchInput");
    const notesList = document.getElementById("notesList");
    const form = document.getElementById("noteForm");

    if (!searchInput || !notesList || !form) {
        console.error("Brak elementów DOM");
        return;
    }

    // BONUS: podświetlanie frazy
    function highlight(text, query) {
        if (!query) return text;
        const regex = new RegExp(`(${query})`, "gi");
        return text.replace(regex, "<mark>$1</mark>");
    }

    async function loadNotes(query = "") {
        let url = "/api/notes";
        if (query) {
            url += `?q=${encodeURIComponent(query)}`;
        }

        const res = await fetch(url);
        const notes = await res.json();

        notesList.innerHTML = "";

        if (notes.length === 0) {
            notesList.innerHTML = "<li><em>Brak notatek</em></li>";
            return;
        }

        notes.forEach(note => {
            const li = document.createElement("li");

            li.innerHTML = `
                <strong>${highlight(note.title, query)}</strong><br/>
                ${highlight(note.body, query)}<br/>
                <small>${note.created_at}</small>
            `;

            notesList.appendChild(li);
        });
    }

    // initial load
    loadNotes();

    // live search
    searchInput.addEventListener("input", e => {
        loadNotes(e.target.value.trim());
    });

    // dodawanie notatki
    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const title = document.getElementById("title").value;
        const body = document.getElementById("body").value;
        const tagsRaw = document.getElementById("tags").value;

        const res = await fetch("/api/notes", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title, body })
        });

        if (!res.ok) {
            alert("Błąd dodawania notatki");
            return;
        }

        const note = await res.json();

        if (tagsRaw.trim()) {
            const tags = tagsRaw.split(",").map(t => t.trim());

            await fetch(`/api/notes/${note.id}/tags`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ tags })
            });
        }

        form.reset();
        loadNotes();
    });
});
