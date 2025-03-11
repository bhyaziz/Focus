// Project Manager functionality
let currentProject = null
const timers = {} // Object to store all timers
const projectTasks = {} // Object to store tasks for each project

function addProject() {
  const projectName = prompt("Enter project name:", "New Project")
  if (!projectName) return

  const projectList = document.getElementById("project-list")
  const projectItem = document.createElement("li")
  projectItem.innerHTML = `
        <span class="project-name">${projectName}</span>
        <span class="progress">(0%)</span>
        <span class="project-buttons">
            <button onclick="selectProject(this)" title="Open">📂</button>
            <button onclick="renameProject(this)" title="Rename">✏️</button>
            <button onclick="removeProject(this)" title="Delete">🗑️</button>
        </span>
    `
  projectList.appendChild(projectItem)
  projectTasks[projectName] = [] // Initialize empty task list for new project
}

function selectProject(button) {
  currentProject = button.closest("li")
  const projectName = currentProject.querySelector(".project-name").textContent
  document.getElementById("projects").innerHTML = `
        <h3 id="current-project-name">${projectName}</h3>
        <div class="tasks"></div>
        <button class="add-button" onclick="addTask()">+ Add Task</button>
    `
  loadTasks(projectName)
  updateProgress()
}

function loadTasks(projectName) {
  const tasksContainer = document.querySelector(".tasks")
  tasksContainer.innerHTML = "" // Clear existing tasks

  if (projectTasks[projectName]) {
    projectTasks[projectName].forEach((task) => {
      const taskDiv = createTaskElement(task)
      tasksContainer.appendChild(taskDiv)

      // Recreate timer for this task
      timers[task.id] = {
        minutes: task.minutes,
        seconds: task.seconds,
        isActive: false,
        interval: null,
        timerFinished: false,
      }
      updateTimerDisplay(task.id)
    })
  }
}

function createTaskElement(task) {
  const taskDiv = document.createElement("div")
  taskDiv.classList.add("task")
  taskDiv.dataset.completed = task.completed
  taskDiv.dataset.id = task.id
  taskDiv.innerHTML = `
        <div class="task-header">
            <span class="task-name">${task.name}</span>
            <button onclick="toggleTaskOptions(this)">⋮</button>
        </div>
        <div class="task-options" style="display: none;">
            <button onclick="renameTask(this)">Rename</button>
            <button onclick="removeTask(this)">Delete</button>
            <button onclick="toggleCompleteTask(this)">${task.completed ? "Uncomplete" : "Complete"}</button>
        </div>
        <div class="timer-container">
            <div class="timer-circle">
                <svg width="100" height="100">
                    <circle class="timer-circle-bg" cx="50" cy="50" r="45"></circle>
                    <circle class="timer-circle-progress" cx="50" cy="50" r="45"></circle>
                </svg>
                <div class="timer-circle-text" id="timer-${task.id}">25:00</div>
            </div>
            <div class="timer-controls">
                <button onclick="startPauseTimer('${task.id}')" id="start-${task.id}">Start</button>
                <button onclick="resetTimer('${task.id}')">Reset</button>
            </div>
            <div class="message-display" id="message-${task.id}">Start the work</div>
            <div class="question-container" id="question-${task.id}" style="display: none;">
                <p>Finished your work?</p>
                <button onclick="finishedTask('${task.id}')">Yes</button>
                <button onclick="notFinishedTask('${task.id}')">No</button>
            </div>
            <div class="time-buttons-container" id="time-buttons-${task.id}" style="display: none;">
                <button onclick="addTime('${task.id}', 10)">+10 minutes</button>
                <button onclick="addTime('${task.id}', 5)">+5 minutes</button>
                <button onclick="addTime('${task.id}', 3)">+3 minutes</button>
                <button onclick="addTime('${task.id}', 1)">+1 minute</button>
            </div>
        </div>
    `
  return taskDiv
}

function addTask() {
  const taskName = prompt("Enter task name:", "New Task")
  if (!taskName) return

  const taskId = "task_" + Date.now()

  const newTask = {
    id: taskId,
    name: taskName,
    completed: false,
    minutes: 25,
    seconds: 0,
  }

  const taskDiv = createTaskElement(newTask)
  document.querySelector(".tasks").appendChild(taskDiv)

  // Initialize timer for this task
  timers[taskId] = {
    minutes: 25,
    seconds: 0,
    isActive: false,
    interval: null,
    timerFinished: false,
  }

  // Add task to current project's task list
  const projectName = currentProject.querySelector(".project-name").textContent
  projectTasks[projectName].push(newTask)

  updateProgress()
}

function renameProject(button) {
  const projectItem = button.closest("li")
  const nameSpan = projectItem.querySelector(".project-name")
  const newName = prompt("Enter new project name:", nameSpan.textContent)
  if (newName && newName.trim() !== "") {
    nameSpan.textContent = newName

    // Update the name in the main view if this is the current project
    if (currentProject === projectItem) {
      const mainProjectName = document.querySelector("#projects h3")
      if (mainProjectName) {
        mainProjectName.textContent = newName
      }
    }
  }
}

function removeProject(button) {
  const projectItem = button.closest("li")
  const projectName = projectItem.querySelector(".project-name").textContent
  const projectList = document.getElementById("project-list")

  projectItem.remove()

  const undoMessage = document.createElement("div")
  undoMessage.className = "undo-message"
  undoMessage.innerHTML = `
        Your project "${projectName}" is deleted. Do you want to undo the change?
        <button onclick="undoProjectDeletion(this, '${projectName}')">Undo</button>
    `
  projectList.appendChild(undoMessage)

  setTimeout(() => {
    if (undoMessage.parentNode === projectList) {
      projectList.removeChild(undoMessage)
    }
  }, 10000) // Remove undo message after 10 seconds
}

function undoProjectDeletion(button, projectName) {
  const projectList = document.getElementById("project-list")
  const newProjectItem = document.createElement("li")
  newProjectItem.innerHTML = `
        <span class="project-name">${projectName}</span>
        <span class="progress">(0%)</span>
        <span class="project-buttons">
            <button onclick="selectProject(this)" title="Open">📂</button>
            <button onclick="renameProject(this)" title="Rename">✏️</button>
            <button onclick="removeProject(this)" title="Delete">🗑️</button>
        </span>
    `
  projectList.appendChild(newProjectItem)
  button.closest(".undo-message").remove()
}

function renameTask(button) {
  const task = button.closest(".task")
  const taskNameElement = task.querySelector(".task-name")
  const newName = prompt("Enter new task name:", taskNameElement.textContent)
  if (newName && newName.trim() !== "") {
    taskNameElement.textContent = newName
  }
  toggleTaskOptions(button)
}

function removeTask(button) {
  const task = button.closest(".task")
  const taskId = task.dataset.id

  // Clear any running timer
  if (timers[taskId] && timers[taskId].interval) {
    clearInterval(timers[taskId].interval)
  }

  // Remove the timer from our tracking object
  delete timers[taskId]

  // Remove task from project's task list
  const projectName = currentProject.querySelector(".project-name").textContent
  projectTasks[projectName] = projectTasks[projectName].filter((t) => t.id !== taskId)

  // Remove the task element
  task.remove()
  updateProgress()
}

function toggleCompleteTask(button) {
  const task = button.closest(".task")
  const taskName = task.querySelector(".task-name")
  const taskId = task.dataset.id
  const projectName = currentProject.querySelector(".project-name").textContent
  const taskObj = projectTasks[projectName].find((t) => t.id === taskId)

  if (task.dataset.completed === "true") {
    task.dataset.completed = "false"
    taskName.style.textDecoration = "none"
    button.textContent = "Complete"
    if (taskObj) taskObj.completed = false
  } else {
    task.dataset.completed = "true"
    taskName.style.textDecoration = "line-through"
    button.textContent = "Uncomplete"
    if (taskObj) taskObj.completed = true
  }
  updateProgress()
}

function toggleTaskOptions(button) {
  const options = button.closest(".task").querySelector(".task-options")
  options.style.display = options.style.display === "none" ? "block" : "none"
}

function updateProgress() {
  document.querySelectorAll(".project-list li").forEach((project) => {
    const projectName = project.querySelector(".project-name").textContent
    if (currentProject && projectName === currentProject.querySelector(".project-name").textContent) {
      const tasks = document.querySelectorAll(".tasks .task")
      const completedTasks = document.querySelectorAll(".tasks .task[data-completed='true']")
      const progress = tasks.length > 0 ? (completedTasks.length / tasks.length) * 100 : 0
      project.querySelector(".progress").textContent = `(${Math.round(progress)}%)`
    }
  })
}

function selectTask(taskElement) {
  // Deselect all tasks
  document.querySelectorAll(".task").forEach((task) => task.classList.remove("selected"))
  // Select the clicked task
  taskElement.classList.add("selected")
}

// Timer functionality for individual tasks
function updateTimerDisplay(taskId) {
  const timer = timers[taskId]
  const display = document.getElementById(`timer-${taskId}`)
  if (display) {
    display.textContent = `${String(timer.minutes).padStart(2, "0")}:${String(timer.seconds).padStart(2, "0")}`
  }
}

function updateTimerMessage(taskId, message) {
  const messageDisplay = document.getElementById(`message-${taskId}`)
  if (messageDisplay) {
    messageDisplay.textContent = message
  }
}

function startPauseTimer(taskId) {
  const timer = timers[taskId]
  const startButton = document.getElementById(`start-${taskId}`)
  const circleProgress = document.querySelector(`.task[data-id="${taskId}"] .timer-circle-progress`)
  const totalSeconds = timer.minutes * 60 + timer.seconds
  const circumference = 2 * Math.PI * 45 // 45 is the radius of our circle

  if (!timer.isActive) {
    timer.isActive = true
    updateTimerMessage(taskId, "Start the work")
    document.getElementById(`message-${taskId}`).style.display = "none"

    timer.interval = setInterval(() => {
      if (timer.seconds > 0) {
        timer.seconds--
      } else if (timer.minutes > 0) {
        timer.minutes--
        timer.seconds = 59
      } else {
        clearInterval(timer.interval)
        timer.isActive = false
        timer.timerFinished = true
        handleTimerFinish(taskId)
      }

      const currentSeconds = timer.minutes * 60 + timer.seconds
      const progress = currentSeconds / totalSeconds
      const dashoffset = circumference * (1 - progress)
      circleProgress.style.strokeDasharray = circumference
      circleProgress.style.strokeDashoffset = dashoffset

      // Show "Time's Ticking .." when it's 10 seconds left
      if (timer.minutes === 0 && timer.seconds <= 10) {
        document.getElementById(`message-${taskId}`).style.display = "block"
        updateTimerMessage(taskId, "Time's Ticking ..")
      }

      // Show "Time's Up !!" when timer finishes
      if (timer.minutes === 0 && timer.seconds === 0) {
        document.getElementById(`message-${taskId}`).style.display = "block"
        updateTimerMessage(taskId, "Time's Up !!")
        playSound()
      }

      updateTimerDisplay(taskId)
    }, 1000)

    startButton.textContent = "Pause"
  } else {
    clearInterval(timer.interval)
    timer.isActive = false
    updateTimerMessage(taskId, "Start the work")
    document.getElementById(`message-${taskId}`).style.display = "block"
    startButton.textContent = "Start"
  }
}

function resetTimer(taskId) {
  const timer = timers[taskId]
  const circleProgress = document.querySelector(`.task[data-id="${taskId}"] .timer-circle-progress`)

  if (timer.interval) {
    clearInterval(timer.interval)
  }

  timer.isActive = false
  timer.minutes = 0
  timer.seconds = 11
  timer.timerFinished = false

  circleProgress.style.strokeDasharray = 2 * Math.PI * 45
  circleProgress.style.strokeDashoffset = 0

  updateTimerDisplay(taskId)
  updateTimerMessage(taskId, "Start the work")
  document.getElementById(`message-${taskId}`).style.display = "block"
  document.getElementById(`start-${taskId}`).textContent = "Start"
  document.getElementById(`question-${taskId}`).style.display = "none"
  document.getElementById(`time-buttons-${taskId}`).style.display = "none"

  // Remove any dynamically added elements
  const workBreakQuestion = document.querySelector(`#work-break-${taskId}`)
  if (workBreakQuestion) {
    workBreakQuestion.remove()
  }
}

function addTime(taskId, minutesToAdd) {
  const timer = timers[taskId]
  timer.minutes += minutesToAdd
  updateTimerDisplay(taskId)
  document.getElementById(`time-buttons-${taskId}`).style.display = "none"

  // Update the start/pause button
  const startButton = document.getElementById(`start-${taskId}`)
  startButton.textContent = "Start"
  timer.isActive = false
  if (timer.interval) {
    clearInterval(timer.interval)
  }

  // Remove work-break question if it exists
  const workBreakQuestion = document.querySelector(`#work-break-${taskId}`)
  if (workBreakQuestion) {
    workBreakQuestion.remove()
  }

  // Update task object in projectTasks
  const projectName = currentProject.querySelector(".project-name").textContent
  const taskObj = projectTasks[projectName].find((t) => t.id === taskId)
  if (taskObj) {
    taskObj.minutes = timer.minutes
    taskObj.seconds = timer.seconds
  }
}

function handleTimerFinish(taskId) {
  updateTimerMessage(taskId, "How did you do?")
  document.getElementById(`question-${taskId}`).style.display = "block"
}

function finishedTask(taskId) {
  alert("Great job! Have some fun, then come back.")
  resetTimer(taskId)

  // Mark the task as completed
  const task = document.querySelector(`.task[data-id="${taskId}"]`)
  if (task) {
    task.dataset.completed = "true"
    task.querySelector(".task-name").style.textDecoration = "line-through"
    task.querySelector(".task-options button:last-child").textContent = "Uncomplete"
    updateProgress()
  }
}

function notFinishedTask(taskId) {
  document.getElementById(`question-${taskId}`).style.display = "none"

  // Create work-break question
  const timerContainer = document.querySelector(`.task[data-id="${taskId}"] .timer-container`)
  const workBreakQuestion = document.createElement("div")
  workBreakQuestion.id = `work-break-${taskId}`
  workBreakQuestion.className = "question-container"
  workBreakQuestion.innerHTML = `
        <p>Need more time or would you like to take a break?</p>
        <button id="work-button-${taskId}">Work</button>
        <button id="break-button-${taskId}">Break</button>
    `
  timerContainer.appendChild(workBreakQuestion)

  // Add event listeners for the work and break buttons
  document.getElementById(`work-button-${taskId}`).addEventListener("click", () => {
    document.getElementById(`time-buttons-${taskId}`).style.display = "flex"
    workBreakQuestion.style.display = "none"
  })

  document.getElementById(`break-button-${taskId}`).addEventListener("click", () => {
    alert("Take a break, but not too long.")
    resetTimer(taskId)
  })
}

function playSound() {
  const Sound = document.getElementById("Sound")
  Sound.play()
}

// Add event listener to show timer when a task is clicked
document.addEventListener("click", (e) => {
  if (e.target.closest(".task")) {
    selectTask(e.target.closest(".task"))
  }
})

