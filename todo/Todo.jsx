import { useState } from 'react'

function Todo() {
  let [taskList, setTaskList] = useState([])
  let [task, setTask] = useState('')
  let [editIndex, setEditIndex] = useState(null)

  let handleChange = (e) => {
    setTask(e.target.value)
  }

  let handleClick = () => {
    let arr = [...taskList]
    arr.push(task)
    setTaskList(arr)
    setTask("")
  }

  let handleUpdate = () => {
    let arr = [...taskList]
    arr[editIndex] = task
    setTaskList(arr)
    setTask("")
  }

  let handleDelete = (index) => {
    let arr = [...taskList]
    arr.splice(index, 1)
    setTaskList(arr)
  }

  let handleEdit = (index) => {
    setTask(taskList[index])
    setEditIndex(index)
  }

  return (
    <>
      <input onChange={handleChange} type="text" value={task} />
      <button onClick={handleClick}>Submit</button>
      <button onClick={handleUpdate}>Update</button>

      <ol>
        {taskList.map((item, index) => (
          <li key={index}>
            {item}
            <button onClick={() => handleEdit(index)}>Edit</button>
            <button onClick={() => handleDelete(index)}>Delete</button>
          </li>
        ))}
      </ol>
    </>
  )
}

export default Todo
