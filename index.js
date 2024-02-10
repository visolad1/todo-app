const todosElement = document.getElementById('todos');
const createTodoInput = document.getElementById('createTodoInput')
const createTodoBtn = document.getElementById('createTodoBtn')
const base_url = 'http://localhost:3002/todos'
let todosData = [];

// const interfaceColors = [
//     {
//         // primary_red: "#FF0000",
//         // darker_red: "#800000",
//         // lighter_red: "#FF4500"
//     }
// ]



function changeInterfaceColor(color, darker, lighter) {
    document.documentElement.style.setProperty(`--primary-color`, color);
    document.documentElement.style.setProperty(`--primary-color-darker`, darker);
    document.documentElement.style.setProperty(`--primary-color-lighter`, lighter);

}

const getRandomId = () => {
    const array = new Uint32Array(1);
    window.crypto.getRandomValues(array);
    return `${array[0]}`;
}

const postOptions = (todo) => {
    return {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(todo)
    }
};


async function getData(url) {
    const res = await fetch(url);
    const data = await res.json();
    return data;
}

async function getTodos() {
    return todosData = await getData(base_url);
}

function createTodo(id, title, completed) {
    const todo = document.createElement('div');
    todo.classList.add('todo')
    todo.classList.add('todo')
    todo.id = id;

    const titleElement = document.createElement('h3');
    titleElement.textContent = title;

    const wrapper = document.createElement('div')
    wrapper.classList.add('btn-inout-wrapper')
    const deleteBtn = document.createElement('button')
    deleteBtn.classList.add('delete-btn')
    deleteBtn.textContent = 'del'

    const checkBox = document.createElement('input');
    checkBox.type = 'checkbox';
    checkBox.checked = completed;
    checkBox.classList.add('checkbox')

    if (completed) {
        checkBox.disabled = true
        todo.classList.add('completed')
    }

    wrapper.appendChild(deleteBtn)
    wrapper.appendChild(checkBox)

    todo.appendChild(titleElement);
    todo.appendChild(wrapper);
    return todo;
}

async function addTodo(todo) {
    const options = postOptions(todo)
    const res = await fetch(base_url, options)
    const status = await res.status
    return status
}


const isInTodos = (title) => {
    return todosData.some((e) => e.title === title)
}

async function changeCheckboxState(id) {
    fetch(`${base_url}/${id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            completed: true
        })
    })
}


async function deleteTodo(id) {
    fetch(`${base_url}/${id}`, {
        method: 'DELETE'
    }).then(() => {
        location.reload()
    })
}


createTodoBtn.addEventListener('click', async (e) => {
    e.preventDefault()
    let title = createTodoInput.value;
    let completed = false;
    let id = getRandomId();
    if (title) {
        if (isInTodos(title)) {
            let addOneMoreTime = confirm("You already have this todo. \nDo you want add it one more time?")
            if (addOneMoreTime) {
                await addTodo({ id, title, completed })
                location.reload();
                createTodoInput.value = ''
            }
        } else {
            await addTodo({ id, title, completed })
            location.reload();
            createTodoInput.value = ''
        }
    } else {
        alert('Please type something you should do')
    }
})


async function main() {
    const todos = await getTodos()
    for (let item of todos) {
        const todo = createTodo(item.id, item.title, item.completed)
        todosElement.appendChild(todo)
    }

    const todosHtml = await document.getElementsByClassName('todo')

    for (let todo of todosHtml) {
        const todosCheckbox = todo.getElementsByClassName('checkbox')[0]
        const deleteBtn = todo.getElementsByClassName('delete-btn')[0]

        todosCheckbox.addEventListener('click', async () => {
            changeCheckboxState(todo.id)
            todo.classList.add('completed')
            todosCheckbox.disabled = true
        })

        deleteBtn.addEventListener('click', async () => {
            await deleteTodo(todo.id)
        })
    }
}


main()