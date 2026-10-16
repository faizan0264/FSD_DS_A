import React, { useEffect, useState } from 'react'

const App = () => {
  const [formdata,setformdata]=useState({
    name:"",
    email:"",
    password:""
  })
  useEffect(()=>{
       console.log("form data update", formdata)
  },[formdata]);

  const handlechange = (e)=>{
      setformdata({
       ...formdata,
       [e.target.name]:e.target.value, 
      })
  }

  const handlesubmit=()=>{
    e.preventDefault();
    alert("Registration Succcessfully");
    console.log(formdata);
  }
  return (
    <div>
      <form action="">
        <input type="text"  name='name' placeholder='Enter Namr' value={} onChange={handlechange}/>
        <br />
        <input type="text" name="email" id="" placeholder='Enter Email' value={} onChange={handlechange} />
        <br />
        <input type="password" name='password' placeholder='Enter password' value={} onChange={handlechange} />
        <br />
        <button type='submit'>Registration</button>
      </form>
    </div>
  )
}

export default App