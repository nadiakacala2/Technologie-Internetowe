const postsList = document.getElementById("postsList");
const postDetails = document.getElementById("postDetails");
const postTitle = document.getElementById("postTitle");
const postBody = document.getElementById("postBody");
const commentsList = document.getElementById("commentsList");
const commentForm = document.getElementById("commentForm");
const commentInfo = document.getElementById("commentInfo");

let currentPostId = null;

// Pobranie listy postów
fetch("/api/posts")
    .then(res => res.json())
    .then(posts => {
        posts.forEach(post => {
            const li = document.createElement("li");
            const btn = document.createElement("button");
            btn.textContent = "Komentarze";
            btn.onclick = () => loadPost(post.id);

            li.textContent = post.title + " ";
            li.appendChild(btn);
            postsList.appendChild(li);
        });
    });

function loadPost(id) {
    currentPostId = id;

    fetch(`/api/posts/${id}`)
        .then(res => res.json())
        .then(post => {
            postDetails.classList.remove("hidden");
            postTitle.textContent = post.title;
            postBody.textContent = post.body;
        });

    loadComments(id);
}
function loadComments(id) {
    commentsList.innerHTML = "";

    fetch(`/api/posts/${id}/comments`)
        .then(res => res.json())
        .then(data => {
            const comments = data.data;

            if (!comments || comments.length === 0) {
                commentsList.innerHTML = "<li>Brak zatwierdzonych komentarzy</li>";
            } else {
                comments.forEach(c => {
                    const li = document.createElement("li");
                    li.textContent = `${c.author}: ${c.body}`;
                    commentsList.appendChild(li);
                });
            }
        })
        .catch(() => {
            commentsList.innerHTML = "<li>Błąd ładowania komentarzy</li>";
        });
}


// Dodanie komentarza
commentForm.addEventListener("submit", e => {
    e.preventDefault();

    const author = document.getElementById("author").value;
    const body = document.getElementById("commentBody").value;

    fetch(`/api/posts/${currentPostId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ author, body })
    })
        .then(res => {
            if (!res.ok) throw new Error();
            return res.json();
        })
        .then(() => {
            commentInfo.textContent = "Komentarz dodany i oczekuje na moderację.";
            commentForm.reset();
        })
        .catch(() => {
            commentInfo.textContent = "Błąd dodawania komentarza.";
        });
});
