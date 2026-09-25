import React, { useState } from 'react'

const Changr = () => {
    const[height,setHeight]=useState(100);
    const[width,setWidth]=useState(100);
    function rowp(){
        setHeight(height+1);
    }
    function rowm(){
        setHeight(height-1);
    }
    function colp(){
        setWidth(width+1);
    }
    function colm(){
        setWidth(width-1);
    }
  return (
    <div>
        <h3>Image Changer</h3>
        <br />
        <img src="src/assets/cat.jpg" alt="" height={height} width={width}/>
        <br />
        <button onClick={rowp}>row+</button>
        <button onClick={rowm}>row-</button>
        <button onClick={colp}>col+</button>
        <button onClick={colm}>col-</button>
    </div>
  )
}

export default Changr