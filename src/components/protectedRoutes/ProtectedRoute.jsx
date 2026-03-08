import React, { useContext } from 'react'
import { authContext } from '../Context/AuthContextProvider'
import { Navigate } from 'react-router-dom'

export default function ProtectedRoute({children}) {
    let {token} = useContext(authContext)

    if (!token){
        return <Navigate to={"/Login"}/>
    }
        return children

}
