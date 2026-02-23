import { useState } from 'react'

function Footer() {
  let [task,setTask] = useState("")
  let [taskList,setTaskList] = useState([])
  let [upindex, setUpindex] = useState("")
  let [btnEdit,setBtnEdit] = useState(false)

  let handleChange = (e)=>{
    setTask(e.target.value);
  }
  let handleSubmit = ()=>{
    if(!task.trim()) return
    let arr = [...taskList]
    arr.push(task)
    setTaskList(arr)
    setTask("")
  }
  let handleDelete = (index)=>{
    let arr = [...taskList]
    arr.splice(index,1)
    setTaskList(arr)
  }
  let handleEdit = (item,index)=>{
    setTask(item)
    setUpindex(index)
    setBtnEdit(true)
  }
  let handleUpdate =()=>{
    if(!task.trim()) return
    let arr = [...taskList]
    arr[upindex] = task
    setTaskList(arr)
    setTask("")
    setBtnEdit(false)
  }
  return (
    <>
      <input onChange={handleChange} value={task} type='text'/>
      {btnEdit ?
      <button onClick={handleUpdate}>Update</button>
      :
      <button onClick={handleSubmit}>Submit</button>
      }
      
      <ol>
        {taskList.map((item,index)=>(
          <li>{item}
          <button onClick={()=>handleDelete(index)}>Delet</button>
          <button onClick={()=>handleEdit(item,index)}>Edit</button>
          </li>
        ))}
      </ol>
    </>
  )
}

export default Footer
