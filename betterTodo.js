const listsContainer = document.querySelector("[data-lists]")
const newListForm = document.querySelector("[data-new-list-form]")
const newListInput = document.querySelector("[data-new-list-input]")
const deleteListbutton = document.querySelector("[data-delete-list-button]")
const listDisplayContainer = document.querySelector("[data-list-display-container]")
const listTitleElement = document.querySelector("[data-list-title]")
const listCountElement = document.querySelector("[data-list-count]")
const taskContainer = document.querySelector("[data-tasks]")
const taskTemplate = document.getElementById("task-template")
const newTaskForm = document.querySelector("[data-new-task-form]")
const newTaskInput = document.querySelector("[data-new-task-input]")
const clearCompleteTasksButton = document.querySelector("[data-clear-complete-tasks-button]")



const LOCAL_STORAGE_LIST_KEY = "task.lists"
const LOCAL_STORAGE_SELECTED_LIST_ID_KEY = "task.selectedListId"
let lists = JSON.parse(localStorage.getItem(LOCAL_STORAGE_LIST_KEY)) || []
let selectedListId = localStorage.getItem(LOCAL_STORAGE_SELECTED_LIST_ID_KEY)


window.addEventListener("load", ()=>{
    listDisplayContainer.style.display = "none"

})

listsContainer.addEventListener("click", e=>{

    if(e.target.tagName.toLowerCase() === "li"){
        selectedListId = e.target.dataset.listId
        saveAndRender()
    }
})

taskContainer.addEventListener("click", e =>{
    if(e.target.tagName.toLowerCase() === "input"){
        const selectedList = lists.find(list => list.id === selectedListId)
        selectedTask = selectedList.tasks.find(task => task.id ===e.target.id)
        selectedTask.complete = e.target.checked
        save()
        renderTaskCount(selectedList)
    }
})

clearCompleteTasksButton.addEventListener("click", e => {
    const selectedList = lists.find(list => list.id === selectedListId)
    selectedList.tasks  = selectedList.tasks.filter(task => !task.complete)
    saveAndRender()

}

)

deleteListbutton.addEventListener("click", e=>{
    lists = lists.filter(list => list.id !==selectedListId) 
    selectedListId = null
    saveAndRender()
})

newListForm.addEventListener("submit", e =>{
    e.preventDefault()
    const listName = newListInput.value
    if (listName === null || listName === "") return 
    const list = createList(listName)
    newListInput.value = null
    lists.push(list)
    saveAndRender()
})


newTaskForm.addEventListener("submit", e =>{
    e.preventDefault()
    const taskName = newTaskInput.value
    if (taskName == null || taskName === "") return 
    const task = createTask(taskName)
    newTaskInput.value = null
    const selectedList = lists.find(list => list.id === selectedListId)
    selectedList.tasks.push(task)
    saveAndRender()
})

function createTask(name){
        
 return  {
    id: Date.now().toString(), 
    name:name, 
    complete: false
     
    }
}

function createList(name){
    
 return  {
        id: Date.now().toString(), 
        name:name, 
        tasks: [
        ],
        
    }


}

function saveAndRender(){
    save()
    render()
}

//save
function save () {
    localStorage.setItem(LOCAL_STORAGE_LIST_KEY, JSON.stringify(lists))
    localStorage.setItem(LOCAL_STORAGE_SELECTED_LIST_ID_KEY, selectedListId)

}

//render
function render(){
clearElement(listsContainer)
renderLists()
const selectedList = lists.find(list => list.id ===selectedListId )
if (selectedListId == null){
    listDisplayContainer.style.display = "none"

} else {

    listDisplayContainer.style.display = ""
    listTitleElement.innerText = selectedList.name
    renderTaskCount(selectedList)
    clearElement(taskContainer)
    renderTasks(selectedList)
}

}

function renderTasks (selectedList){
    selectedList.tasks.forEach( task =>{
        const taskElement = document.importNode(taskTemplate.content, true)
        const checkBox = taskElement.querySelector("input")
        checkBox.id = task.id
        checkBox.checked = task.complete
        const label = taskElement.querySelector("label")
        label.htmlFor = task.id
        label.append(task.name)
        taskContainer.appendChild(taskElement)

    })
}

function renderTaskCount(selectedList){
    const incompleteTaskCount = selectedList.tasks.filter(task => 
        !task.complete).length
        const taskString = incompleteTaskCount <=  1 ? "task" : "tasks"
        listCountElement.innerText = `${incompleteTaskCount} ${taskString} remaining`

    }

function renderLists(){
    lists.forEach(list =>{
        const listElement = document.createElement("li")
        listElement.dataset.listId = list.id
        listElement.classList.add("list-name")
        listElement.innerText =list.name
        if (list.id == selectedListId) {
            listElement.classList.add("active-list")
        }
        listsContainer.appendChild(listElement)
        }) 

        // // alternatively, using for loop
// for(i=0; i<lists.length; i++){
//     const listElement = document.createElement("li")
//     listElement.classList.add("list-name")
//     listElement.innerText =lists[i]
//     listsContainer.appendChild(listElement)
//     console.log(lists[i] + " is your name")

// }

        
}





function clearElement (element){
while (element.firstChild ){
    element.removeChild(element.firstChild)
}


}

render ()