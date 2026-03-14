class Task{
  constructor(title) {
    this.id = Date.now();
    this.title = title;
    this.completed = false;
  }
}

class TaskStorage {
  constructor() {
    this.key = 'tasks';
  }

  save(tasks) {
    localStorage.setItem(this.key, JSON.stringify(tasks));
  }

  load() {
    const data = localStorage.getItem(this.key)
    return data ? JSON.parse(data) : [];
  }
}

class TaskManager {
  constructor() {
    this.storage = new TaskStorage();
    this.tasks = this.storage.load();
  }


  addTask(title) {
    const task = new Task(title);
    this.tasks.push(task);
    this.storage.save(this.tasks)
  }

  removeTask(id) {
    this.tasks = this.tasks.filter((task) => task.id != id);
    this.storage.save(this.tasks)
  }

  removeAllTasks() {
    this.tasks.length = 0
    this.storage.save(this.tasks)
  }

  searchTask(query) {
    const filterTasks = this.tasks.filter((task) => task.title.toLowerCase().includes(query.toLowerCase()) );
    return filterTasks
  }
}

class TodoUI {
  constructor() {
    this.taskManager = new TaskManager();
    this.searchQuery = '';
  }

  selectors = {
    root: '[data-js-task-list]',
    toDoItem: '[data-js-item]',
    newTask: '[data-js-new-task]',
    btnNewTask: '[data-js-btn-new-task]',
    searchTask: '[data-js-field-search]',
    deleteAllTasks: '[data-js-all-delete]',
    deleteTask: '.todo-close',
    tasksCounter: '[data-js-counter]',
  }

  render() {
    const taskList = document.querySelector(this.selectors.root);
    const writtenTasks = this.taskManager.searchTask(this.searchQuery);
    const tasksCounter = document.querySelector(this.selectors.tasksCounter);

    tasksCounter.innerHTML = `<span class="todo-counter">${this.taskManager.tasks.length}</span>`

    taskList.innerHTML = writtenTasks.map((task) => `
       <li class="todo-item" id="${task.id}" data-js-item>
        <input type="checkbox" class="todo-check" data-js-check>
        <div class="todo-item__title" data-js-task-title>${task.title}</div>
        <span class="todo-close"></span>
       </li> 
      `).join('');
  }

  bindEvent() {
    document.addEventListener('keydown', (event) => {
      const newTaskInput = document.querySelector(this.selectors.newTask)
      if (event.target === newTaskInput) {
        if(event.key === "Enter") {
          if (newTaskInput.value !== '') {
            this.taskManager.addTask(newTaskInput.value)
            newTaskInput.value = ''
            this.render()
            newTaskInput.focus()
            event.preventDefault()
          }
        }
      }
    })

    document.addEventListener('input', (event) => {
      const searchElement = document.querySelector(this.selectors.searchTask)
      if (searchElement === event.target) {
        this.searchQuery = event.target.value
        this.render();
      }
    })

    document.addEventListener('click', (event) => {
      const clearAllTasks = document.querySelector(this.selectors.deleteAllTasks)
      const clearTask = document.querySelector(this.selectors.deleteTask)
      const toDoItem = document.querySelector(this.selectors.toDoItem)
      const btnNewTaskInput = document.querySelector(this.selectors.btnNewTask)
      const newTaskInput = document.querySelector(this.selectors.newTask)

      if (event.target === clearTask) {
        this.taskManager.removeTask(toDoItem.id)
        this.render()
      }

      if (event.target === clearAllTasks) {
        this.taskManager.removeAllTasks()
        this.render()
      }

      if (event.target === btnNewTaskInput) {
        if (newTaskInput.value !== '') {
          this.taskManager.addTask(newTaskInput.value)
          newTaskInput.value = ''
          this.render()
        }
      }
    })
  }

}

const App = new TodoUI()
App.bindEvent()
App.render()