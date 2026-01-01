const boardEl = document.getElementById("board");
const addBtn = document.getElementById("addTaskBtn");
const titleInput = document.getElementById("taskTitle");
const columnSelect = document.getElementById("taskColumn");

// Mapowanie „w prawo”
const NEXT_COL = colId => {
    const id = Number(colId);
    if (id === 1) return 2;
    if (id === 2) return 3;
    return null;
};

// Pobranie boarda
async function loadBoard() {
    const res = await fetch("/api/board");
    const data = await res.json();

    boardEl.innerHTML = "";

    data.cols.forEach(col => {
        const colEl = document.createElement("div");
        colEl.className = "column";
        colEl.innerHTML = `<h2>${col.name}</h2>`;

        // DROP ZONE (kolumna)
        colEl.addEventListener("dragover", e => {
            e.preventDefault();
        });

        colEl.addEventListener("drop", async e => {
            e.preventDefault();

            const taskId = e.dataTransfer.getData("text/plain");
            const colId = col.id;

            const res = await fetch("/api/board");
            const data = await res.json();

            const tasksInCol = data.tasks.filter(t => t.col_id === colId).length;

            await fetch(`/api/tasks/${taskId}/move`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    col_id: colId,
                    ord: tasksInCol + 1
                })
            });

            loadBoard();
        });

        const tasks = data.tasks
            .filter(t => t.col_id === col.id)
            .sort((a, b) => a.ord - b.ord);

        tasks.forEach(task => {
            const taskEl = document.createElement("div");
            taskEl.className = "task";
            taskEl.draggable = true;
            taskEl.dataset.id = task.id;

            taskEl.innerHTML = `
                <span>${task.title}</span>
                <div class="task-actions">
                    ${NEXT_COL(col.id)
                        ? `<button class="move-btn" type="button">→</button>`
                        : ""
             }
                </div>
             `;

            // DRAG START – tylko na TASK, ale NIE NA PRZYCISK
            taskEl.addEventListener("dragstart", e => {
                if (e.target.closest(".move-btn")) {
                    e.preventDefault();
                    return;
                }
                e.dataTransfer.setData("text/plain", task.id);
            });

            // OBSŁUGA STRZAŁKI
            const moveBtn = taskEl.querySelector(".move-btn");
            if (moveBtn) {
                moveBtn.draggable = false;

                moveBtn.addEventListener("mousedown", e => {
                    e.stopPropagation(); // blokuje drag
                });

                moveBtn.addEventListener("click", e => {
                    e.stopPropagation();
                    moveTask(task.id, NEXT_COL(col.id));
                });
            }




            colEl.appendChild(taskEl);
        });

        boardEl.appendChild(colEl);
    });
}

// Dodawanie zadania
addBtn.addEventListener("click", async () => {
    const title = titleInput.value.trim();
    const col_id = parseInt(columnSelect.value, 10);

    if (!title) return alert("Podaj tytuł zadania");

    await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, col_id })
    });

    titleInput.value = "";
    loadBoard();
});


// Przenoszenie strzałką
async function moveTask(id, newColId) {
    if (!newColId) return;

    const res = await fetch("/api/board");
    const data = await res.json();

    const tasksInTargetCol = data.tasks.filter(
        t => t.col_id === newColId
    ).length;

    const newOrd = tasksInTargetCol + 1;

    await fetch(`/api/tasks/${id}/move`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            col_id: newColId,
            ord: newOrd
        })
    });

    loadBoard();
}

// Start
loadBoard();