const form = document.getElementById("todoform")
const todoInput = document.getElementById("newtodo")
const todolist = document.getElementById("todos-list")
const notify = document.querySelector(".notification")

let todos = JSON.parse(localStorage.getItem("todos")) || []
let EditTodoId = -1

// render
renderTodos()

// submitfomr
form.addEventListener("submit", function (event) {
  event.preventDefault()
  //console.log("hello");

  saveTodo()
  renderTodos()
  localStorage.setItem("todos", JSON.stringify(todos))
})

// to save todo
function saveTodo() {
  const todoValue = todoInput.value

  // check if the todo is empty
  const isEmpty = todoValue === ""

  // check for duplicate todos
  const isDuplicate = todos.some(
    (todo) => todo.value.toUpperCase() === todoValue.toUpperCase()
  )

  if (isEmpty) {
    showNotification("Please fill up the to-do task.")
  } else if (isDuplicate) {
    showNotification("The to-do task already exists.")
  } else {
    if (EditTodoId >= 0) {
      todos = todos.map((todo, index) => ({
        ...todo,
        value: index === EditTodoId ? todoValue : todo.value,
      }))
      EditTodoId = -1
    } else {
      todos.push({
        value: todoValue,
        checked: false,
        color: "#" + Math.floor(Math.random() * 16777215).toString(16),
      })
    }

    todoInput.value = ""
  }
}

// to render todos
function renderTodos() {
  if (todos.length === 0) {
    todolist.innerHTML = "<center>Please add some To-dos...</center>"
    todolist.style.color = "gray"
    todolist.style.fontSize = "17px"
    return
  }

  // clr the element before rerender
  todolist.innerHTML = ""

  // render todos
  todos.forEach((todo, index) => {
    todolist.innerHTML += `
    <div class="todo" id=${index}>
      <i 
        class="bi ${todo.checked ? "bi-check-circle-fill" : "bi-circle"}"
        style="color : ${todo.color}"
        data-action="check"
      ></i>
      <p class="${todo.checked ? "checked" : ""}" data-action="check">${
      todo.value
    }</p>
      <span id="boot-icon" class="bi bi-pen" style="font-size: 20px; color: black;" data-action="edit"></span>
      <span id="boot-icon" class="bi bi-trash" style="font-size: 20px; color: red;" data-action="delete"></span>
    </div>
    `
  })
}

todolist.addEventListener("click", (event) => {
  const target = event.target
  const parentElement = target.parentNode

  if (parentElement.className !== "todo") return

  const todo = parentElement
  const todoId = Number(todo.id)

  // target action
  const action = target.dataset.action

  action === "check" && checkTodo(todoId)
  action === "edit" && editTodo(todoId)
  action === "delete" && deleteTodo(todoId)
})

// to check a todo
function checkTodo(todoId) {
  todos = todos.map((todo, index) => ({
    ...todo,
    checked: index === todoId ? !todo.checked : todo.checked,
  }))

  renderTodos()
  localStorage.setItem("todos", JSON.stringify(todos))
}

// to edit todo
function editTodo(todoId) {
  todoInput.value = todos[todoId].value
  EditTodoId = todoId
}

// To delete todo
function deleteTodo(todoId) {
  todos = todos.filter((todo, index) => index !== todoId)
  EditTodoId = -1

  // re-render
  renderTodos()
  localStorage.setItem("todos", JSON.stringify(todos))
}

// Notify
function showNotification(msg) {
  // change the message
  notify.innerHTML = msg
  notify.style.display = "block"
  // notification enter
  notify.style.right = "-100%" // Start from the right side
  setTimeout(() => {
    notify.style.right = "10px" // Slide to the left
  }, 100)

  // notification leave after 3 seconds
  setTimeout(() => {
    notify.style.right = "-100%" // Slide back to the right
    setTimeout(() => {}, 100)
  }, 3000)
}
