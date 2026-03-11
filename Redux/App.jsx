import { useDispatch, useSelector } from 'react-redux'
import { addTodo, deleteTodo, updateTodo, setTask, setUindex, setEbtn } from './todoSlice'

const App = () => {

  const dispatch = useDispatch()

  const taskList = useSelector((state)=>state.todo.value.arr)
  const task = useSelector((state)=>state.todo.task)
  const uindex = useSelector((state)=>state.todo.uindex)
  const Ebtn = useSelector((state)=>state.todo.Ebtn)

  const handleSubmit = ()=>{
    dispatch(addTodo(task))
    dispatch(setTask(""))
  }

  const handleDelete =(index)=>{
    dispatch(deleteTodo(index))
  }

  const handleEdit =(item,index)=>{
    dispatch(setTask(item))
    dispatch(setUindex(index))
    dispatch(setEbtn(false))
  }

  const handleUpdate = ()=>{
    dispatch(updateTodo({
      index: uindex,
      item: task
    }))
    dispatch(setEbtn(true))
    dispatch(setTask(""))
  }

  return (
    <>
      <input
        value={task}
        onChange={(e)=>dispatch(setTask(e.target.value))}
        type='text'
      />

      {Ebtn ?
      <button onClick={handleSubmit}>Submit</button>
      :
      <button onClick={handleUpdate}>Update</button>
      }

      <ol>
        {taskList.map((item,index)=>(
          <li>
            {item}
            <button onClick={()=>handleDelete(index)}>Delete</button>
            <button onClick={()=>handleEdit(item,index)}>Edit</button>
          </li>
        ))}
      </ol>
    </>
  )
}

export default App