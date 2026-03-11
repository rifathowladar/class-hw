import Navbar from './component/Navbar'

function App() {
  let hadleClick =(nam) => {
    console.log("oeoeo "+ nam);
  }
  return (
    <>
      <Navbar tag="h1" hadleclick={() =>hadleClick("rf")} classh={"rd"} text={"gfgfrthg"} />
      
    </>
  )
}

export default App

///--------------------///

import React from 'react'

function Navbar(props) {
  let {text,tag,classh,hadleclick} = props
  return (
    <>
        <props.tag onClick={hadleclick} className={classh}>{text}</props.tag>
        
    </>
  )
}

export default Navbar