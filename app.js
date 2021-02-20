// variables
const todoInput = document.querySelector(".todoInput");
const todoSubmitButton = document.querySelector(".todoSubmitButton");

const todoLists = document.querySelector(".todoLists");

// eventListener
document.addEventListener("DOMContentLoaded", pullTodoListFromLocal);
todoSubmitButton.addEventListener("click", addTodoList);
todoLists.addEventListener("click", completeOrDelete);

// add todoList to todoLists
function addTodoList(event) {
    event.preventDefault();

    let idNumbers = (Math.random() * 1000000).toString();

    const todoList = `
    <div class="todoList" id="${idNumbers}">
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

    if (todoLists[todoListIndex].completed === false) {
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
