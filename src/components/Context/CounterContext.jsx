import React, { createContext } from 'react'
import { useState } from 'react'

export let ContextCounter = createContext()

export default function CounterContext({children}) {

    const [Counter, setCounter] = useState(null)
    function Increment(){
        setCounter(Counter + 1)
    }

    return (
        <>
        <ContextCounter.Provider value={ { Counter , Increment }  }>

            {children}
        
        </ContextCounter.Provider>
        
        </>
    )
}

