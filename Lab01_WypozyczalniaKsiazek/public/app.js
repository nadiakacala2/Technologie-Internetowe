async function loadBooks() {
    const res = await fetch('/api/books');
    const books = await res.json();
    const ul = document.getElementById('books');
    ul.innerHTML = '';
    books.forEach(b => {
        ul.innerHTML += `<li>${b.title} — dostępne: ${b.available}</li>`;
    });
}

async function loadLoans() {
    const res = await fetch('/api/loans');
    const loans = await res.json();
    const ul = document.getElementById('loans');
    ul.innerHTML = '';
    loans.forEach(l => {
        ul.innerHTML += `<li>${l.member} → ${l.book} (${l.loan_date})</li>`;
    });
}

async function borrow() {
    const member_id = document.getElementById('memberId').value;
    const book_id = document.getElementById('bookId').value;

    const res = await fetch('/api/loans/borrow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ member_id, book_id })
    });

    if (!res.ok) {
        const err = await res.json();
        alert(err.error);
    }

    loadBooks();
    loadLoans();
}

loadBooks();
loadLoans();
