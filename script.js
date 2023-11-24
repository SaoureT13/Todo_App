import { add } from "./functions.js";

const btnTheme = document.querySelector(".iconTheme");
const form = document.querySelector(".form");
const list_all_todos = document.querySelector(".list_all_todos");
const list_todo = document.querySelector(".list_todo");
const list_done_todo = document.querySelector(".list_done_todo");
const Uls = document.querySelectorAll("ul");
const todoCompleted = document.querySelector(".todoCompleted");
const clearAllBtn = document.querySelector(".clearAllBtn");
let counter = 0;
let AllTasks = [];
let Todos = [];
let DoneTodos = [];

function dragNdrop() {
  let lis = document.querySelectorAll(".todo");
  lis.forEach((li) => {
    li.addEventListener("dragstart", () => {
      setTimeout(() => {
        li.classList.add("dragging");
      }, 0);
    });

    li.addEventListener("dragend", () => {
      li.classList.remove("dragging");
    });
  });

  const initSortableList = (e) => {
    e.preventDefault();
    const draggingItem = e.currentTarget.querySelector(".dragging");
    const notDragging = [
      ...e.currentTarget.querySelectorAll(".todo:not(.dragging)"),
    ];

    let nextSibling = notDragging.find((found) => {
      return e.clientY <= found.offsetTop + found.offsetHeight / 2;
    });

    e.currentTarget.insertBefore(draggingItem, nextSibling);
  };
  Uls.forEach((ul) => {
    ul.addEventListener("dragover", initSortableList);
  });
}

btnTheme.addEventListener("click", () => {
  if (btnTheme.classList.contains("dark")) {
    btnTheme.classList.add("light");
    btnTheme.classList.remove("dark");
    document.body.classList.remove("theme-dark");
    document.body.classList.add("theme-light");
  } else {
    btnTheme.classList.add("dark");
    btnTheme.classList.remove("light");
    document.body.classList.add("theme-dark");
    document.body.classList.remove("theme-light");
  }
});

const addTask = (e) => {
  e.preventDefault();

  const input = form.querySelector(".input");
  const check = form.querySelector("#todo");
  let title = new FormData(e.currentTarget).get("title").toString().trim();
  let state = new FormData(e.currentTarget).get("state");
  let id = Date.now();
  let newTask = {
    title: title,
    state: state,
    id: `todo-${id}`,
  };

  AllTasks.push(newTask);
  list_all_todos.prepend(add(newTask.title, newTask.state, newTask.id));

  if (newTask.state === null) {
    Todos.push(newTask);
    list_todo.prepend(add(newTask.title, newTask.state, newTask.id));
    counter = Todos.length;
    todoCompleted.innerText = counter;
  } else {
    DoneTodos.push(newTask);
    list_done_todo.prepend(add(newTask.title, newTask.state, newTask.id));
  }

  console.log(AllTasks);
  console.log(Todos);
  console.log(DoneTodos);

  input.value = "";
  check.checked = false;

  dragNdrop();
};

form.addEventListener("submit", addTask);

function refreshAllTasksUl() {
  list_all_todos.innerHTML = "";
  AllTasks.forEach((task) => {
    list_all_todos.prepend(add(task.title, task.state, task.id));
  });
}
function refreshList_todo() {
  list_todo.innerHTML = "";
  Todos.forEach((task) => {
    list_todo.prepend(add(task.title, task.state, task.id));
  });
}
function refreshList_done_todo() {
  list_done_todo.innerHTML = "";
  DoneTodos.forEach((todo) => {
    list_done_todo.prepend(add(todo.title, todo.state, todo.id));
  });
}

function markTask() {
  Uls.forEach((ul) => {
    ul.addEventListener("change", (e) => {
      if (e.target.matches("input[type='checkbox']")) {
        let target = e.target.getAttribute("id");
        let foundTask = AllTasks.find((element) => element.id === target);

        if (foundTask) {
          if (e.target.checked) {
            foundTask.state = "on";
            Todos = Todos.filter((task) => task.id !== foundTask.id);
            refreshList_todo();
            counter--;
            todoCompleted.innerText = counter;

            DoneTodos.push(foundTask);
            refreshList_done_todo();
          } else {
            foundTask.state = null;
            DoneTodos = DoneTodos.filter((task) => task.id !== foundTask.id);
            refreshList_done_todo();
            Todos.push(foundTask);
            counter++;
            todoCompleted.innerText = counter;
            refreshList_todo();
          }
        }
      }
    });
  });
}

function deleteTask() {
  Uls.forEach((ul) => {
    ul.addEventListener("click", (e) => {
      if (e.target.matches(".delete svg")) {
        e.preventDefault();
        let currentTask = e.target.closest(".todo");
        let idTask = currentTask.querySelector("input").getAttribute("id");
        let taskState = null;

        currentTask.remove();

        AllTasks.forEach((task) => {
          if (task.id === idTask) {
            taskState = task.state;
          }
        });

        AllTasks = AllTasks.filter((todo) => todo.id !== idTask);
        refreshAllTasksUl();

        if (taskState === "on") {
          DoneTodos = DoneTodos.filter((task) => task.id !== idTask);
          refreshList_done_todo();
        } else if (taskState === null) {
          Todos = Todos.filter((task) => task.id !== idTask);
          refreshList_todo();
          counter--;
          todoCompleted.innerText = counter;
        }
        console.log(AllTasks);
        console.log(Todos);
        console.log(DoneTodos);
      }
    });
  });
}

function filterTodo() {
  const FilterBtn = document.querySelectorAll(".filter");
  FilterBtn.forEach((button) => {
    button.addEventListener("click", (e) => {
      FilterBtn.forEach((btn) => {
        btn.classList.remove("active");
      });

      e.currentTarget.classList.add("active");
      if (e.currentTarget.dataset.filter === "completed") {
        Uls.forEach((ul) => {
          if (!ul.classList.contains("list_done_todo")) {
            ul.style.display = "none";
          } else {
            ul.style.display = "block";
          }
        });
      } else if (e.currentTarget.dataset.filter === "active") {
        Uls.forEach((ul) => {
          if (!ul.classList.contains("list_todo")) {
            ul.style.display = "none";
          } else {
            ul.style.display = "block";
          }
        });
      } else {
        Uls.forEach((ul) => {
          if (!ul.classList.contains("list_all_todos")) {
            ul.style.display = "none";
          } else {
            ul.style.display = "block";
          }
        });
      }
    });
  });
}

function clearAllCompleted() {
  clearAllBtn.addEventListener("click", (e) => {
    e.preventDefault();

    AllTasks = AllTasks.filter((task) => task.state === null);
    refreshAllTasksUl();
    DoneTodos = [];
    refreshList_done_todo();
  });
}

markTask();
deleteTask();
filterTodo();
clearAllCompleted();
