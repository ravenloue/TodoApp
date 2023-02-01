// First Card HTML Elements
const nameCard = document.getElementById('nameList') as HTMLElement;
const nameForm = document.getElementById('listNameForm') as HTMLFormElement;
const list = document.getElementById("list") as HTMLElement;
const listHeader = document.getElementById('listHeader') as HTMLHeadingElement;
const listName = document.getElementById('listName') as HTMLInputElement;

// List Naming event listener
nameForm.addEventListener('submit', (evt) => {
    evt.preventDefault();

    // Takes the user submitted name and applies it the list heading
    listHeader.innerText = listName.value+":";
    nameCard.classList.add('hidden');
    list.classList.remove('hidden');
    //list.classList.add('overflow');

    // Resets the value to empty upon submission 
    listName.value = '';

} );

// Task Classes

class todoItem {
    constructor(
        readonly taskName: string,
        readonly taskDesc: string,
        readonly taskTime: number,
        public id: string,
    ){};
};

class taskTemplate {
    constructor(readonly container: HTMLUListElement){};

    renderItem(task: todoItem){
        const li = document.createElement('li');
        const h6 = document.createElement('h6');
        const p = document.createElement('p');

        li.id = task.id;
        li.innerHTML += `<input type="checkbox" class="checkBox">`;

        h6.innerText = task.taskName;
        li.append(h6);
        p.innerHTML=`${task.taskDesc}<br>Expected Completion Time: ${task.taskTime} hrs`;
        li.append(p);
        li.innerHTML +=`<button class="button-74" type="button">X</button>`;

        this.container.append(li);
        this.container.innerHTML += `<br>`;
    }
}

// Second Card HTML Elements
const ul = document.getElementById('taskList') as HTMLUListElement;
const task = new taskTemplate(ul);

const taskForm = document.getElementById('taskInputForm') as HTMLFormElement;
const taskName = document.getElementById('taskName') as HTMLInputElement;
const taskDesc = document.getElementById('taskDesc') as HTMLInputElement;
const taskTime = document.getElementById('taskTime') as HTMLInputElement;
const clearBtn = document.getElementById('clearList') as HTMLButtonElement;


// Array for storing list items
let todos: todoItem[] = [];
let todoRef = localStorage.getItem('todos');
// Variable to track ids for generating new items
let liCounter = 0;

// Utilizes the local storage to save todo list information
let addToLocalStorage= (item: todoItem[]) => {
    localStorage.setItem('todos', JSON.stringify(todos));
}

// Checks the local storage for content and renders it to the list
if(todoRef){
    ul.innerHTML = '';
    todos = JSON.parse(todoRef);

    // renders array item and tracks the count
    todos.forEach((item:todoItem) =>{
        // re-assigns id to each item as it counts the list
        item.id = 'li'+liCounter;
        task.renderItem(item);
        liCounter++;
    })
    console.log(liCounter);
}

// Adds a new item to the task list
taskForm.addEventListener('submit', (evt) => {
    // prevents the button from refreshing the page
    evt.preventDefault(); 

    // verifies that the user has filled out all three boxes
    if(taskName.value.length === 0){
        alert("Please Enter a Task Name");
    }else if(taskDesc.value.length === 0){
        alert("Please Enter the Task Details");
    }else if(Number.isNaN(taskTime.valueAsNumber)){
        alert("Please Enter an Amount of Time in Hours for Task Completion ");
    }else{
        // assigns an id to the attributes
        let tag = 'li'+liCounter;
        let item = new todoItem(taskName.value, taskDesc.value, taskTime.valueAsNumber, tag);
        
        todos.push(item);
        addToLocalStorage(todos);
        task.renderItem(item);
        liCounter++;
        taskName.value = '';
        taskDesc.value = '';
        taskTime.value = '';
        ul.scrollTop = ul.scrollHeight;
    }    
} )

let checked: boolean = false;
// listens for checked or delete events on the unordered list items
ul.addEventListener('click', (evt)=>{
    
    // toggles the li class list to include 'clicked'
    const toggle = (checked:boolean) =>{
        if(evt.target instanceof Element){
            if(checked){
                evt.target.parentElement.classList.remove('clicked');                
            } else{
                evt.target.parentElement.classList.add('clicked');       
            }
        }   
    }
    
    // Determines which action to take based on the section clicked
    if(evt.target instanceof Element){
        let type = evt.target.getAttribute('type');

        // if the item clicked is the checkbox, toggle strike-through
        if(type === 'checkbox'){
            if(evt.target.hasAttribute('checked')){
                checked = true;
                toggle(checked);
                evt.target.toggleAttribute('checked');
            }else{
                checked = false;
                toggle(checked);
                evt.target.toggleAttribute('checked');
            }
        }

        // if the item clicked is the button, delte item from list and repopulate page
        if(type === 'button'){
            
            // locate the id of the li element
            let id = evt.target.parentElement.getAttribute('id');
            
            // create a new array excluding the element
            todos = todos.filter((item)=>{return item.id != id;});
            
            // updates storage information
            localStorage.clear();
            addToLocalStorage(todos);

            // re-renders list giving the items new ids
            ul.innerHTML = '';
            liCounter = 0;
            todos.forEach((item:todoItem)=>{
                item.id = 'li'+liCounter;
                task.renderItem(item);
                liCounter++;
            });
        }
    }
})    

// Resets the list to blank and removes the content from local storage
clearBtn.addEventListener('click',(evt) =>{
    ul.innerHTML = '';
    todos = [];
    liCounter = 0;
    localStorage.clear();
})

