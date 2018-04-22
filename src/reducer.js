import {
  getTodos,
  createTodo,
  updateTodo,
  destroyTodo
} from './lib/todoServices'
import { createActions, handleAction } from 'redux-actions'
import reduceReducers from 'reduce-reducers'

const initState = {
  todos: [],
  currentTodo: '',
  isLoading: true,
  message: ''
}

const UPDATE_CURRENT = 'UPDATE_CURRENT'
const ADD_TODO = 'ADD_TODO'
const LOAD_TODOS = 'LOAD_TODOS'
const REPLACE_TODO = 'REPLACE_TODO'
const REMOVE_TODO = 'REMOVE_TODO'
const SHOW_LOADER = 'SHOW_LOADER'
const HIDE_LOADER = 'HIDE_LOADER'

const fixCase = str => {
  return str.split('').reduce((acc, letter, idx) => {
    return idx === 0 ? letter.toUpperCase() : `${acc}${letter.toLowerCase()}`
  }, '')
}

export const {
  updateCurrent,
  loadTodos,
  addTodo,
  replaceTodo,
  removeTodo,
  showLoader,
  hideLoader
} = createActions(
  {
    UPDATE_CURRENT: fixCase,
    SHOW_LOADER: () => true,
    HIDE_LOADER: () => false
  },
  LOAD_TODOS,
  ADD_TODO,
  REPLACE_TODO,
  REMOVE_TODO
)

export const fetchTodos = () => {
  return dispatch => {
    dispatch(showLoader())
    getTodos().then(todos => {
      dispatch(loadTodos(todos))
      dispatch(hideLoader())
    })
  }
}

export const saveTodo = name => {
  return dispatch => {
    dispatch(showLoader())
    createTodo(name).then(res => {
      dispatch(addTodo(res))
      dispatch(hideLoader())
    })
  }
}

export const toggleTodo = id => {
  return (dispatch, getState) => {
    dispatch(showLoader())
    const { todos } = getState()
    const todo = todos.find(t => t.id === id)
    const toggled = { ...todo, isComplete: !todo.isComplete }
    updateTodo(toggled).then(res => {
      dispatch(replaceTodo(res))
      dispatch(hideLoader())
    })
  }
}

export const deleteTodo = id => {
  return dispatch => {
    dispatch(showLoader())
    destroyTodo(id).then(() => {
      dispatch(removeTodo(id))
      dispatch(hideLoader())
    })
  }
}

export const getVisibleTodos = (todos, filter) => {
  switch (filter) {
    case 'active':
      return todos.filter(t => !t.isComplete)
    case 'completed':
      return todos.filter(t => t.isComplete)
    default:
      return todos
  }
}

const addTodoReducer = handleAction(
  ADD_TODO,
  (state, action) => {
    return {
      ...state,
      currentTodo: '',
      todos: state.todos.concat(action.payload)
    }
  },
  initState
)

const loadTodosReducer = handleAction(
  LOAD_TODOS,
  (state, action) => {
    return { ...state, todos: action.payload }
  },
  initState
)

const updateCurrentReducer = handleAction(
  UPDATE_CURRENT,
  (state, action) => {
    return { ...state, currentTodo: action.payload }
  },
  initState
)

const replaceTodoReducer = handleAction(
  REPLACE_TODO,
  (state, action) => {
    return {
      ...state,
      todos: state.todos.map(
        t => (t.id === action.payload.id ? action.payload : t)
      )
    }
  },
  initState
)

const removeTodoReducer = handleAction(
  REMOVE_TODO,
  (state, action) => {
    return {
      ...state,
      todos: state.todos.filter(t => t.id !== action.payload)
    }
  },
  initState
)

const showLoaderReducer = handleAction(
  SHOW_LOADER,
  (state, action) => {
    return { ...state, isLoading: action.payload }
  },
  initState
)

const hideLoaderReducer = handleAction(
  HIDE_LOADER,
  (state, action) => {
    return { ...state, isLoading: action.payload }
  },
  initState
)

export default reduceReducers(
  addTodoReducer,
  loadTodosReducer,
  updateCurrentReducer,
  replaceTodoReducer,
  removeTodoReducer,
  showLoaderReducer,
  hideLoaderReducer
)
