import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useReducer,
} from 'react'
import taskAPI from '@/shared/api/tasks'

const tasksReducer = (state, action) => {
  switch (action.type) {
    case 'SET_ALL': {
      return Array.isArray(action.tasks) ? action.tasks : state
    }
    case 'ADD': {
      return [...state, action.task]
    }
    case 'TOGGLE_COMPLETE': {
      const { id, isDone } = action

      return state.map((task) => (task.id === id ? { ...task, isDone } : task))
    }
    case 'DELETE': {
      const { id } = action

      return state.filter((task) => task.id !== id)
    }
    case 'DELETE_ALL': {
      return []
    }
    default: {
      return state
    }
  }
}

const useTasks = () => {
  const [tasks, dispatch] = useReducer(tasksReducer, [])
  const [newTaskTitle, setNewTaskTitle] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [disappearingTaskId, setDisappearingTaskId] = useState(null)
  const [appearingTaskId, setAppearingTaskId] = useState(null)

  const newTaskInputRef = useRef(null)

  const deleteAllTasks = useCallback(() => {
    const isConfirmed = confirm('Are you sure you want to delete all?')

    if (isConfirmed) {
      taskAPI.deleteAll(tasks).then(() => dispatch({ type: 'DELETE_ALL' }))
    }
  }, [tasks])

  const deleteTask = useCallback((taskId) => {
    taskAPI.delete(taskId).then(() => {
      setDisappearingTaskId(taskId)
      setTimeout(() => {
        // setTasks(tasks.filter((task) => task.id !== taskId)) // логика под работу с reducer
        dispatch({ type: 'DELETE', id: taskId })
        setDisappearingTaskId(null)
      }, 400)
    })
  }, [])

  const toggleTaskComplete = useCallback((taskId, isDone) => {
    taskAPI.toggleComplete(taskId, isDone).then(() => {
      dispatch({ type: 'TOGGLE_COMPLETE', id: taskId, isDone })
    })
  }, [])

  const addTask = useCallback((title) => {
    const newTask = {
      // id: crypto?.randomUUID() ?? Date.now().toString(), // генерация id - теперь на стороне сервера
      title,
      isDone: false,
    }

    taskAPI.add(newTask).then((addedTask) => {
      // setTasks([...tasks, newTask]) // или для использования прошлого значения есть вариант через коллбек
      // setTasks((prevTasks) => [...prevTasks, addedTask])
      dispatch({ type: 'ADD', task: addedTask })
      setNewTaskTitle('')
      setSearchQuery('')

      newTaskInputRef.current.focus()

      setAppearingTaskId(addedTask.id)
      setTimeout(() => {
        setAppearingTaskId(null)
      }, 400)
    })
  }, [])

  useEffect(() => {
    newTaskInputRef.current.focus()

    taskAPI
      .getAll()
      // .then((tasks) => setTasks(tasks)) // или сокращенный вариант - сразу передать setTasks по ссылке
      .then((serverTasks) => dispatch({ type: 'SET_ALL', tasks: serverTasks }))
  }, [])

  const filteredTasks = useMemo(() => {
    const clearSearchQuery = searchQuery.trim().toLowerCase()

    return clearSearchQuery.length > 0
      ? tasks.filter(({ title }) =>
          title.toLowerCase().includes(clearSearchQuery),
        )
      : null
  }, [searchQuery, tasks])

  return {
    tasks,
    filteredTasks,
    deleteTask,
    deleteAllTasks,
    toggleTaskComplete,
    newTaskTitle,
    setNewTaskTitle,
    searchQuery,
    setSearchQuery,
    newTaskInputRef,
    addTask,
    disappearingTaskId,
    appearingTaskId,
  }
}

export default useTasks
