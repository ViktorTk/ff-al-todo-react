import Router from './routing'
import TasksPage from '../pages/TasksPage'
import TaskPage from '../pages/TaskPage'
import './styles'

const App = () => {
  const routes = {
    '/': TasksPage,
    '/tasks/:id': TaskPage,
    '*': () => <div>404 Page not found</div>,
  }

  return (
    <Router routes={routes} />

    // <TasksProvider>
    //   <Todo />
    // </TasksProvider>
  )
}

export default App
