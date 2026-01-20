import { TasksProvider } from './context/TasksContext'
import Todo from './components/Todo'

const App = () => {
  return (
    <TasksProvider>
      <Todo />
    </TasksProvider>
  )
}

export default App
