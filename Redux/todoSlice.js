import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: {
    arr: []
  },
  task: "",
  uindex: "",
  Ebtn: true
}

export const todoSlice = createSlice({
  name: 'todo',
  initialState,
  reducers: {

    addTodo: (state,action)=>{
      if(!state.task.trim()) return
      state.value.arr.push(action.payload)
    },

    deleteTodo: (state,action)=>{
      state.value.arr.splice(action.payload,1)
    },

    updateTodo: (state,action)=>{
      if(!state.task.trim()) return
      state.value.arr[action.payload.index] = action.payload.item
    },

    setTask: (state,action)=>{
      state.task = action.payload
    },

    setUindex: (state,action)=>{
      state.uindex = action.payload
    },

    setEbtn: (state,action)=>{
      state.Ebtn = action.payload
    }

  },
})

export const { 
  addTodo, 
  deleteTodo, 
  updateTodo,
  setTask,
  setUindex,
  setEbtn
} = todoSlice.actions

export default todoSlice.reducer