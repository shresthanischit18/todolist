const form = document.getElementById('todoform');
const todoInput = document.getElementById('newtodo');
const todolist = document.getElementById('todos-list');
const notificationEl = document.querySelector('.notification');

// VARS
let todos = JSON.parse(localStorage.getItem('todos')) || [];
let EditTodoId = -1;

// 1st render
renderTodos();

// FORM SUBMIT
form.addEventListener('submit', function (event) {
  event.preventDefault();
  //console.log("hello");

  saveTodo();
  renderTodos();
  localStorage.setItem('todos', JSON.stringify(todos));
});

// SAVE TODO
function saveTodo() {
  const todoValue = todoInput.value;

  // check if the todo is empty
  const isEmpty = todoValue === '';

  // check for duplicate todos
  const isDuplicate = todos.some((todo) => todo.value.toUpperCase() === todoValue.toUpperCase());

  if (isEmpty) {
    showNotification("Please fill up the to-do task.");
  } else if (isDuplicate) {
    showNotification('The to-do task already exists.');
  } else {
    if (EditTodoId >= 0) {
      todos = todos.map((todo, index) => ({
        ...todo,
        value: index === EditTodoId ? todoValue : todo.value,
      }));
      EditTodoId = -1;
    } else {
      todos.push({
        value: todoValue,
        checked: false,
        color: '#' + Math.floor(Math.random() * 16777215).toString(16),
      });
    }

    todoInput.value = '';
  }
}

// RENDER TODOS
function renderTodos() {
  if (todos.length === 0) {
    todolist.innerHTML = '<center>No To-dos today!!!!</center>';
    return;
  }

  // CLEAR ELEMENT BEFORE A RE-RENDER
  todolist.innerHTML = '';

  // RENDER TODOS
  todos.forEach((todo, index) => {
    todolist.innerHTML += `
    <div class="todo" id=${index}>
      <i 
        class="bi ${todo.checked ? 'bi-check-circle-fill' : 'bi-circle'}"
        style="color : ${todo.color}"
        data-action="check"
      ></i>
      <p class="${todo.checked ? 'checked' : ''}" data-action="check">${todo.value}</p>
      <span id="boot-icon" class="bi bi-pen" style="font-size: 20px; color: black;" data-action="edit"></span>
      <span id="boot-icon" class="bi bi-trash" style="font-size: 20px; color: red;" data-action="delete"></span>
    </div>
    `;
  });
}

// CLICK EVENT LISTENER FOR ALL THE TODOS
todolist.addEventListener('click', (event) => {
  const target = event.target;
  const parentElement = target.parentNode;

  if (parentElement.className !== 'todo') return;

  // t o d o id
  const todo = parentElement;
  const todoId = Number(todo.id);

  // target action
  const action = target.dataset.action;

  action === 'check' && checkTodo(todoId);
  action === 'edit' && editTodo(todoId);
  action === 'delete' && deleteTodo(todoId);
});

// CHECK A TODO
function checkTodo(todoId) {
  todos = todos.map((todo, index) => ({
    ...todo,
    checked: index === todoId ? !todo.checked : todo.checked,
  }));

  renderTodos();
  localStorage.setItem('todos', JSON.stringify(todos));
}

// EDIT A TODO
function editTodo(todoId) {
  todoInput.value = todos[todoId].value;
  EditTodoId = todoId;
}

// DELETE TODO
function deleteTodo(todoId) {
  todos = todos.filter((todo, index) => index !== todoId);
  EditTodoId = -1;

  // re-render
  renderTodos();
  localStorage.setItem('todos', JSON.stringify(todos));
}

// SHOW A NOTIFICATION
function showNotification(msg) {
  // change the message
  notificationEl.innerHTML = msg;

  // notification enter
  notificationEl.classList.add('notif-enter');

  // notification leave
  setTimeout(() => {
    notificationEl.classList.remove('notif-enter');
  }, 2000);
}