// variables
const todoInput = document.querySelector(".todoInput");
const todoSubmitButton = document.querySelector(".todoSubmitButton");

const todoFilters = document.querySelector(".todosFilter");

const todoLists = document.querySelector(".todoLists");

// eventListener
document.addEventListener("DOMContentLoaded", pullTodoListFromLocal);
todoSubmitButton.addEventListener("click", addTodoList);
todoFilters.addEventListener("click", todoListFilter);
todoLists.addEventListener("click", completeOrDelete);

// add todoList to todoLists
function addTodoList(event) {
    event.preventDefault();

    let idNumbers = (Math.random() * 1000000).toString();

    const todoList = `
    <div class="todoList addTodoList" id="${idNumbers}">
        <div class="todo">
            <li>${todoInput.value}</li>
        </div>
        <button class="completeButton">
            <i class="fas fa-check"></i>
        </button>
        <button class="deleteButton">
            <i class="fas fa-trash"></i>
        </button>
    </div>
    `;

    saveTodoListToLocal(todoInput.value, idNumbers);
    todoLists.insertAdjacentHTML("afterbegin", todoList);
    todoInput.value = "";

    const todo = todoLists.children[0];

    todo.addEventListener("animationend", () => {
        todo.classList.remove("addTodoList");
    });

    todoListFilter();
}

// filter todoList & check which option is selected
function todoListFilter() {
    const radio = todoFilters.children;

    Array.from(todoLists.children).forEach((todo) => {
        if (radio[0].children[0].checked) {
            todo.style.display = "flex";
        }
        if (radio[1].children[0].checked) {
            if (todo.classList.contains("completeTodoList")) {
                todo.style.display = "flex";
            } else {
                todo.style.display = "none";
            }
        }
        if (radio[2].children[0].checked) {
            if (!todo.classList.contains("completeTodoList")) {
                todo.style.display = "flex";
            } else {
                todo.style.display = "none";
            }
        }
    });
}

// when completeButton or deleteButton is clicked
function completeOrDelete(event) {
    const buttons = event.target;

    if (buttons.classList[0] === "completeButton") {
        const todoList = buttons.parentElement;
        const todo = todoList.children[0].children[0];

        todoList.classList.toggle("completeTodoList");
        todo.classList.toggle("completeTodo");
        completedState(todoList);
    }

    if (buttons.classList[0] === "deleteButton") {
        const todoList = buttons.parentElement;

        todoList.classList.add("deleteTodoList");

        todoList.addEventListener("animationend", () => {
            removeTodoListFromLocal(todoList);
            todoList.remove();
        });
    }

    todoListFilter();
}

// change completed to true or false in localStorage
function completedState(todoList) {
    let todoLists;

    if (localStorage.getItem("todoLists") === null) {
        todoLists = [];
    } else {
        todoLists = JSON.parse(localStorage.getItem("todoLists"));
    }

    const todoListId = todoList.getAttribute("id");
    const todoListIndex = todoLists.findIndex((x) => x.id === todoListId);

    if (!todoLists[todoListIndex].completed) {
        todoLists[todoListIndex].completed = true;
    } else {
        todoLists[todoListIndex].completed = false;
    }

    localStorage.setItem("todoLists", JSON.stringify(todoLists));
}

// save todoList to localStorage
function saveTodoListToLocal(todoListText, id) {
    let todoLists;
    let completed = false;

    if (localStorage.getItem("todoLists") === null) {
        todoLists = [];
    } else {
        todoLists = JSON.parse(localStorage.getItem("todoLists"));
    }

    todoLists.push({ todoListText, completed, id });
    localStorage.setItem("todoLists", JSON.stringify(todoLists));
}

// pull todoList from localStorage
function pullTodoListFromLocal() {
    let todoLists;

    if (localStorage.getItem("todoLists") === null) {
        todoLists = [];
    } else {
        todoLists = JSON.parse(localStorage.getItem("todoLists"));
    }

    todoLists.forEach((todo) => {
        const todoLists = document.querySelector(".todoLists");
        const todoListId = todo.id;

        if (todo.completed === true) {
            const todoList = `
            <div class="todoList completeTodoList" id="${todoListId}">
                <div class="todo">
                    <li class="completeTodo">${todo.todoListText}</li>
                </div>
                <button class="completeButton">
                    <i class="fas fa-check"></i>
                </button>
                <button class="deleteButton">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
            `;

            todoLists.insertAdjacentHTML("afterbegin", todoList);
        } else {
            const todoList = `
            <div class="todoList" id="${todoListId}">
                <div class="todo">
                    <li>${todo.todoListText}</li>
                </div>
                <button class="completeButton">
                    <i class="fas fa-check"></i>
                </button>
                <button class="deleteButton">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
            `;

            todoLists.insertAdjacentHTML("afterbegin", todoList);
        }
    });
}

// remove todoList from localStorage
function removeTodoListFromLocal(todoList) {
    let todoLists;

    if (localStorage.getItem("todoLists") === null) {
        todoLists = [];
    } else {
        todoLists = JSON.parse(localStorage.getItem("todoLists"));
    }

    const todoListId = todoList.getAttribute("id");
    const todoListIndex = todoLists.findIndex((x) => x.id === todoListId);

    todoLists.splice(todoListIndex, 1);

    localStorage.setItem("todoLists", JSON.stringify(todoLists));
}
