
export default function TodoReducer(state, action) {

    let {type} = action
    if(type == 'addTodo') {
        return addTodo(state,action)
    }
    else if(type == 'initData') {
        return setTodos(state,action)
    }
    else if(type == 'changeStatus') {
        return changeStatus(state,action)
    }
    else if(type == 'delete') {
        return deleteTodo(state,action)
    }
    else if(type == 'edit') {
        return editTodo(state,action)
    }
    else if(type == 'changePoint') {
        return changePoint(state,action)
    }
    else {
        return state
    }
}

function addTodo(state,action) {

    return [
        ...state,
        action.data
    ]
}

function setTodos(state,action) {
    return action.data
}

function changeStatus(state,action) {

    let findIndex = findIndexMethod(state,action.data.id)
    let newData = [...state];
    newData[findIndex].isDone = action.data.isDone
    return newData
}

function deleteTodo(state,action) {

    return state.filter(todo => todo.id != action.id)
}

function editTodo(state,action) {

    let data = action.payload
    let findIndex = findIndexMethod(state,data.id)
    let newData = [...state];
    newData[findIndex].title = data.title
    return newData
}

function changePoint(state,action) {

    let findIndex = findIndexMethod(state,action.data.id)
    let newData = [...state];
    newData[findIndex].isPointed = action.data.isPointed
    return newData
}

function findIndexMethod(list,id) {
    return list.findIndex(todo => todo.id == id)
}