import React, { createContext } from 'react'
import { useContext } from 'react'
import { useContext,createContext} from 'react'

function mycontext() {
  const myname = createContext('arjun');
  const value = useContext(myname);
  return (
    <div>
      <h1>value frrom context is : {value}</h1>
    </div>
  )
}