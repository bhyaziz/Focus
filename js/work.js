// Project Manager functionality
let currentProject = null
const timers = {} // Object to store all timers
const projectTasks = {} // Object to store tasks for each project
const projects=[];
try {
  const PARSE_APPLICATION_ID = "CJJFInfLC3tjEyyvkMW9ueDfrfcQrI8pZFMrwWnh"
  const PARSE_JAVASCRIPT_KEY = "xgUeoU2FNVCTAqzWHAXrsc6JENKxotOoRFSrCs4R"
  const PARSE_SERVER_URL = "https://parseapi.back4app.com/"

  Parse.initialize(PARSE_APPLICATION_ID, PARSE_JAVASCRIPT_KEY)
  Parse.serverURL = PARSE_SERVER_URL

  console.log("Parse initialized successfully")
} catch (error) {
  console.log("error")
  console.error("Failed to initialize Parse:", error)
}
async function logout() {
  const authButtons = document.getElementById("auth_buttons")
  authButtons.innerHTML = `<a href="login.html" class="btn btn-secondary">Log in</a>
                <a href="signup.html" class="btn btn-primary">Sign up</a>`
  const projectList = document.getElementById("project-list")
  projectList.innerHTML = ``;
  localStorage.removeItem("loggedInEmail");
  window.location.href = "../html/login.html";

}
function change_container(username) {
  console.log("Executing change_container with username:", username)

  const authButtons = document.getElementById("auth_buttons")

  if (authButtons) {
    authButtons.innerHTML = `
      <div class="profile-container">
        <div class="profile">
            <p>${username}</p>
            <i class="fa-solid fa-user"></i>
        </div>
        <button onclick="logout()" class="logout-button">
            <i class="fa-solid fa-sign-out-alt"></i> Logout
        </button>
      </div>`
  } else {
    console.error("Element #auth-buttons not found.")
  }
}
function addProjectbydb(projectName) {
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
  projects.push(projectName);
  projectList.appendChild(projectItem)
  projectTasks[projectName] = []
}
// ✅ Check if the user is logged in when they arrive at work.html
async function getprojects() {
  const email = localStorage.getItem("loggedInEmail")
  const ProjectQuery = new Parse.Query("project")
  ProjectQuery.equalTo("email", email)
  const results = await ProjectQuery.find()
  const projectsTable = []
  results.forEach((project) => {
    console.log([project.get("project")]);
    projectsTable.push([project.get("project")]);
    addProjectbydb(project.get("project"));
    gettasks(project.get("project"));
    
  })

}

async function gettasks(projectName) {
  const email = localStorage.getItem("loggedInEmail")
  const TaskQuery = new Parse.Query("task")
  TaskQuery.equalTo("taskEmail", email)
  TaskQuery.equalTo("projectName", projectName)
  const results = await TaskQuery.find()

  // Initialize project tasks array if it doesn't exist
  if (!projectTasks[projectName]) {
    projectTasks[projectName] = []
  }

  for (const task of results) {
    const taskobj = {
      id: task.get("taskId"),
      name: task.get("taskName"),
      completed: task.get("taskCompleted"),
      minutes: task.get("taskMinutes"),
      seconds: task.get("taskSeconds"),
    }

    // Just store the task in projectTasks without rendering
    projectTasks[projectName].push(taskobj)

    // Initialize timer for this task
    timers[taskobj.id] = {
      minutes: taskobj.minutes || 25,
      seconds: taskobj.seconds || 0,
      isActive: false,
      interval: null,
      timerFinished: false,
    }
  }

  console.log(`Loaded ${projectTasks[projectName].length} tasks for project ${projectName}`)
  return projectTasks[projectName]
}
document.addEventListener("DOMContentLoaded", () => {
  const username = localStorage.getItem("loggedInUser")

  if (username) {
    change_container(username) // ✅ Update UI if user is logged in
    getprojects()
  } else {
    console.log("No user logged in.")
  }
})
async function addprojecttodb(projectName) {
  const email = localStorage.getItem("loggedInEmail")
  const UserObject = Parse.Object.extend("project")
  const project = new UserObject()
  console.log(email)
  project.set("email", email)
  project.set("project", projectName)
  const result = await project.save()
}
function addProject() {
  const projectName = prompt("Enter project name:", "New Project")
  test=true;
  projects.forEach(project=>{
    console.log(project)
  if (projectName===project){
      test=false;
      
      alert("project already exists");
    }
  })
  if (test){
    projects.push(projectName);
  if (!projectName ) return

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
  addprojecttodb(projectName)
  projectTasks[projectName] = [] // Initialize empty task list for new project
  }
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
                <button onclick="addTime('${task.id}', 25)">+25 minutes</button>
                <button onclick="addTime('${task.id}', 15)">+15 minutes</button>
                <button onclick="addTime('${task.id}', 10)">+10 minutes</button>
            </div>
        </div>
    `
  return taskDiv
}
async function addtasktodb(projectName, newTask) {
  const UserObject = Parse.Object.extend("task")
  const task = new UserObject()
  const email = localStorage.getItem("loggedInEmail")
  task.set("taskEmail", email)
  task.set("projectName", projectName)
  task.set("taskId", newTask.id)
  task.set("taskName", newTask.name)
  task.set("taskCompleted", newTask.completed)
  task.set("taskMinutes", newTask.minutes)
  task.set("taskSeconds", newTask.seconds)
  const result = await task.save()
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

  addtasktodb(projectName, newTask)
  updateProgress()
}

// Function to rename a project in the database
async function renameProjectInDB(oldProjectName, newProjectName) {
  try {
    const email = localStorage.getItem("loggedInEmail");
    const ProjectQuery = new Parse.Query("project");
    ProjectQuery.equalTo("email", email);
    ProjectQuery.equalTo("project", oldProjectName);
    
    const results = await ProjectQuery.find();
    
    if (results.length === 0) {
      console.error(`Project "${oldProjectName}" not found`);
      return false;
    }
    
    // Update the project name
    for (const project of results) {
      project.set("project", newProjectName);
      await project.save();
      console.log(`Project renamed from "${oldProjectName}" to "${newProjectName}" successfully`);
    }
    
    // Also update all tasks associated with this project
    await updateProjectNameForTasks(oldProjectName, newProjectName);
    
    return true;
  } catch (error) {
    console.error("Error renaming project:", error);
    return false;
  }
}

async function updateProjectNameForTasks(oldProjectName, newProjectName) {
  try {
    const email = localStorage.getItem("loggedInEmail");
    const TaskQuery = new Parse.Query("task");
    TaskQuery.equalTo("taskEmail", email);
    TaskQuery.equalTo("projectName", oldProjectName);
    
    const results = await TaskQuery.find();
    
    // Update project name for all associated tasks
    for (const task of results) {
      task.set("projectName", newProjectName);
      await task.save();
    }
    
    console.log(`Project name updated for all tasks from "${oldProjectName}" to "${newProjectName}"`);
    return true;
  } catch (error) {
    console.error("Error updating project name for tasks:", error);
    return false;
  }
}

function renameProject(button) {
  const projectItem = button.closest("li")
  const nameSpan = projectItem.querySelector(".project-name")
  const oldName = nameSpan.textContent // Store the old name before changing it
  const newName = prompt("Enter new project name:", nameSpan.textContent)
  
  if (newName && newName.trim() !== "") {
    // Store old name for database update
    const oldProjectName = nameSpan.textContent
    
    // Update UI
    nameSpan.textContent = newName

    // Update the name in the main view if this is the current project
    if (currentProject === projectItem) {
      const mainProjectName = document.querySelector("#projects h3")
      if (mainProjectName) {
        mainProjectName.textContent = newName
      }
    }
    
    // Call the database update function
    renameProjectInDB(oldProjectName, newName)
      .then(success => {
        if (!success) {
          console.error("Failed to update project name in database")
        }
      })
  }
}

// Function to delete a project from the database
async function deleteProjectFromDB(projectName) {
  try {
    const email = localStorage.getItem("loggedInEmail");
    const ProjectQuery = new Parse.Query("project");
    ProjectQuery.equalTo("email", email);
    ProjectQuery.equalTo("project", projectName);
    
    const results = await ProjectQuery.find();
    
    // Delete all matching projects
    for (const project of results) {
      await project.destroy();
      console.log(`Project "${projectName}" deleted successfully`);
    }
    
    // Also delete all tasks associated with this project
    await deleteAllTasksForProject(projectName);
    
    return true;
  } catch (error) {
    console.error("Error deleting project:", error);
    return false;
  }
}

// Helper function to delete all tasks for a project
async function deleteAllTasksForProject(projectName) {
  try {
    const email = localStorage.getItem("loggedInEmail");
    const TaskQuery = new Parse.Query("task");
    TaskQuery.equalTo("taskEmail", email);
    TaskQuery.equalTo("projectName", projectName);
    
    const results = await TaskQuery.find();
    
    // Delete all tasks for this project
    for (const task of results) {
      await task.destroy();
    }
    
    console.log(`All tasks for project "${projectName}" deleted successfully`);
    return true;
  } catch (error) {
    console.error("Error deleting tasks for project:", error);
    return false;
  }
}
function removeProject(button) {
  const projectItem = button.closest("li")
  const projectName = projectItem.querySelector(".project-name").textContent
  const projectList = document.getElementById("project-list")

  projectItem.remove()

  deleteProjectFromDB(projectName)

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

async function renameTaskInDB(taskId, projectName, newTaskName) {
  try {
    const email = localStorage.getItem("loggedInEmail");
    const TaskQuery = new Parse.Query("task");
    TaskQuery.equalTo("taskEmail", email);
    TaskQuery.equalTo("projectName", projectName);
    TaskQuery.equalTo("taskId", taskId);
    
    const results = await TaskQuery.find();
    
    if (results.length === 0) {
      console.error(`Task "${taskId}" not found`);
      return false;
    }
    
    // Update the task name
    for (const task of results) {
      task.set("taskName", newTaskName);
      await task.save();
      console.log(`Task "${taskId}" renamed to "${newTaskName}" successfully`);
    }
    
    return true;
  } catch (error) {
    console.error("Error renaming task:", error);
    return false;
  }
}

function renameTask(button) {
  const task = button.closest(".task")
  const taskNameElement = task.querySelector(".task-name")
  const oldName = taskNameElement.textContent
  const newName = prompt("Enter new task name:", oldName)
  
  if (newName && newName.trim() !== "") {
    // Update UI
    taskNameElement.textContent = newName
    
    // Get task ID from the task element
    const taskId = task.dataset.id || task.getAttribute("data-id")
    
    // Get current project name
    const projectName = document.querySelector("#projects h3").textContent || 
                        currentProject.querySelector(".project-name").textContent
    
    // Call the database update function
    renameTaskInDB(taskId, projectName, newName)
      .then(success => {
        if (!success) {
          console.error("Failed to update task name in database")
          // Optionally revert the UI change
          // taskNameElement.textContent = oldName
        }
      })
  }
  
  toggleTaskOptions(button)
}
// Function to delete a task from the database
async function deleteTaskFromDB(taskId, projectName) {
  try {
    const email = localStorage.getItem("loggedInEmail");
    const TaskQuery = new Parse.Query("task");
    TaskQuery.equalTo("taskEmail", email);
    TaskQuery.equalTo("projectName", projectName);
    TaskQuery.equalTo("taskId", taskId);
    
    const results = await TaskQuery.find();
    
    // Delete all matching tasks
    for (const task of results) {
      await task.destroy()
      console.log(`Task "${taskId}" deleted successfully`)
    }
    
    return true
  } catch (error) {
    console.error("Error deleting task:", error);
    return false;
  }
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

  deleteTaskFromDB(taskId, projectName)

  updateProgress()
}

async function updateTaskCompletionInDB(taskId, projectName, isCompleted) {
  try {
    const email = localStorage.getItem("loggedInEmail");
    const TaskQuery = new Parse.Query("task");
    TaskQuery.equalTo("taskEmail", email);
    TaskQuery.equalTo("projectName", projectName);
    TaskQuery.equalTo("taskId", taskId);
    
    const results = await TaskQuery.find();
    
    if (results.length === 0) {
      console.error(`Task "${taskId}" not found in project "${projectName}"`);
      return false;
    }
    
    // Update the task completion status
    for (const task of results) {
      task.set("taskCompleted", isCompleted);
      await task.save();
      console.log(`Task "${taskId}" completion status updated to ${isCompleted ? "completed" : "not completed"}`);
    }
    
    return true;
  } catch (error) {
    console.error("Error updating task completion status:", error);
    return false;
  }
}

function toggleCompleteTask(button) {
  const task = button.closest(".task")
  const taskName = task.querySelector(".task-name")
  const taskId = task.dataset.id
  const projectName = currentProject.querySelector(".project-name").textContent
  const taskObj = projectTasks[projectName].find((t) => t.id === taskId)

  // Determine the new completion status (opposite of current)
  const newCompletionStatus = task.dataset.completed !== "true"
  
  // Update UI and local data
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
  
  // Update in database
  updateTaskCompletionInDB(taskId, projectName, newCompletionStatus)
    .then(success => {
      if (!success) {
        console.error("Failed to update task completion status in database")
        // Optionally revert the UI change if the database update fails
      }
    })
  
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
  timer.seconds = 3
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
  workBreakQuestion.style.display = "block"
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

