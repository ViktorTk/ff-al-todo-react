import { memo, useContext, useMemo } from 'react'
import { TasksContext } from '../../context/TasksContext'

const TodoInfo = (props) => {
  const { styles } = props

  const { tasks, deleteAllTasks } = useContext(TasksContext)

  const total = tasks.length
  const hasTasks = total > 0
  const done = useMemo(() => {
    return tasks.filter(({ isDone }) => isDone).length
  }, [tasks])

  return (
    <div className={styles['info']}>
      <div className={styles['totalTasks']}>
        Done <span>{done}</span> from <span>{total}</span>
      </div>
      {hasTasks && (
        <button
          className={styles['deleteAllButton']}
          type="button"
          onClick={deleteAllTasks}
        >
          Delete all
        </button>
      )}
    </div>
  )
}

export default memo(TodoInfo)
