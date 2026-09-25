import React,{useState} from 'react'

const Counter = () => {
    const [count , setCount] = useState(0);
    function inc(){
          if(count == 10){
            alert("This is maximum number");
          }
          setCount(count+1);
    }
    function dec(){
         if(count == 0){
            alert("This is minimum number");
          }
           setCount(count-1);
    }
  return (
    <div>
      <h3> Counter App</h3>
      <br/>
      <button onClick={inc}>+</button>
      <span>{count}</span>
      <button onClick={dec}>-</button>
    </div>
  )
}

export default Counter