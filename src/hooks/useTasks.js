import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import taskAPI from '../api/taskAPI'

const useTasks = () => {
  const [tasks, setTasks] = useState([])
  const [newTaskTitle, setNewTaskTitle] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

  const newTaskInputRef = useRef(null)

  const deleteAllTasks = useCallback(() => {
    const isConfirmed = confirm('Are you sure you want to delete all?')

    if (isConfirmed) {
      taskAPI.deleteAll(tasks).then(() => setTasks([]))
    }
  }, [tasks])

  const deleteTask = useCallback(
    (taskId) => {
      taskAPI.delete(taskId).then(() => {
        setTasks(tasks.filter((task) => task.id !== taskId))
      })
    },
    [tasks],
  )

  const toggleTaskComplete = useCallback(
    (taskId, isDone) => {
      taskAPI.toggleComplete(taskId, isDone).then(() => {
        setTasks(
          tasks.map((task) => {
            if (task.id === taskId) {
              return { ...task, isDone }
            }
            return task
          }),
        )
      })
    },
    [tasks],
  )

  const addTask = useCallback((title) => {
    const newTask = {
      // id: crypto?.randomUUID() ?? Date.now().toString(), // генерация id - теперь на стороне сервера
      title,
      isDone: false,
    }

    taskAPI.add(newTask).then((addedTask) => {
      // setTasks([...tasks, newTask]) // или для использования прошлого значения есть вариант через коллбек
      setTasks((prevTasks) => [...prevTasks, addedTask])
      setNewTaskTitle('')
      setSearchQuery('')

      newTaskInputRef.current.focus()
    })
  }, [])

  useEffect(() => {
    newTaskInputRef.current.focus()

    taskAPI
      .getAll()
      // .then((tasks) => setTasks(tasks)) // или сокращенный вариант - сразу передать setTasks по ссылке
      .then(setTasks)
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
  }
}

export default useTasks
