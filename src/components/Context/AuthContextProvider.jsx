import React, { createContext } from 'react'
import { useState } from 'react'
import { useEffect } from 'react'
import { jwtDecode } from "jwt-decode";


export let authContext = createContext()

export default function AuthContextProvider({children}) {
    const [token, setToken] = useState(null)
    const [userId, setuserId] = useState(null)
    
    useEffect(function(){
        let tokenFromStorage = localStorage.getItem("token")
        if(tokenFromStorage != null){
            setToken(tokenFromStorage)
            const tokenAfterDecoded = jwtDecode(tokenFromStorage)
            setuserId(tokenAfterDecoded.user)
            

        }
    }, [])

    return (
    <>
        <authContext.Provider value={ {token, userId, setToken} } >
            {children}
        </authContext.Provider>
    </>
    )
}
