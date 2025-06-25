const apiUrl = "http://localhost:3000/tasks";

const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");
const taskCount = document.getElementById("taskCount");

// Load tasks on page load
window.onload = fetchTasks;

// Fetch and display tasks
function fetchTasks() {
  fetch(apiUrl)
    .then(res => res.json())
    .then(data => {
      taskList.innerHTML = "";
      let completed = 0;

      data.forEach(task => {
        const li = document.createElement("li");
        li.className = task.completed ? "completed" : "";

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = task.completed;
        checkbox.onchange = () => toggleComplete(task.id, checkbox.checked);

        const span = document.createElement("span");
        span.className = "task-text";
        span.textContent = task.text;

        const actions = document.createElement("div");
        actions.className = "actions";

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.onclick = () => deleteTask(task.id);

        const editBtn = document.createElement("button");
        editBtn.textContent = "Edit";
        editBtn.classList.add("edit");
        editBtn.onclick = () => editTask(task.id, task.text);

        actions.appendChild(deleteBtn);
        actions.appendChild(editBtn);

        li.appendChild(checkbox);
        li.appendChild(span);
        li.appendChild(actions);

        taskList.appendChild(li);

        if (task.completed) completed++;
      });

      taskCount.textContent = `Completed: ${completed} | Uncompleted: ${taskList.childElementCount - completed}`;
    });
}

// Add new task
function addTask() {
  const text = taskInput.value.trim();
  if (text === "") return alert("Please enter a task!");

  fetch(apiUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text })
  }).then(() => {
    taskInput.value = "";
    fetchTasks();
  });
}

// Delete task
function deleteTask(id) {
  fetch(`${apiUrl}/${id}`, { method: "DELETE" }).then(fetchTasks);
}

// Toggle task completion
function toggleComplete(id, completed) {
  fetch(`${apiUrl}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ completed })
  }).then(fetchTasks);
}

// Edit task
function editTask(id, oldText) {
  const newText = prompt("Edit your task:", oldText);
  if (newText !== null && newText.trim() !== "") {
    fetch(`${apiUrl}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: newText })
    }).then(fetchTasks);
  }
}
