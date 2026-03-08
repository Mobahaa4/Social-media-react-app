import React from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Layout from './components/layout/Layout'
import Login from './components/login/Login'
import Signup from './components/signup/Signup'
import Home from './components/Home/Home'
import CounterContext from './components/Context/CounterContext'
import {HeroUIProvider} from "@heroui/react";
import AuthContextProvider from './components/Context/AuthContextProvider'
import Profiles from './components/Profiles/Profiles'
import ProtectedRoute from './components/protectedRoutes/ProtectedRoute'
import AuthRoute from './components/Authroute/AuthRoute'
import PostData from './components/PostData/PostData'
import {QueryClient, QueryClientProvider} from "@tanstack/react-query"
import { ToastContainer } from 'react-toastify'
import { Offline, Online } from "react-detect-offline";


export default function App() {
  
let client = new QueryClient()

  let router = createBrowserRouter([
    {path :"", element : <Layout/>, children:[
      {path : "home", element : <ProtectedRoute> <Home/> </ProtectedRoute>},
      {path :"Login", element : <AuthRoute> <Login/> </AuthRoute>},
      {path :"Signup", element :  <AuthRoute> <Signup/> </AuthRoute>},
      {path : "Profiles", element : <ProtectedRoute> <Profiles/> </ProtectedRoute>},
      {path : "PostData/:PostId", element : <ProtectedRoute> <PostData/> </ProtectedRoute>}
    ]}
  ])


  return <>

<QueryClientProvider client={client}>

    <HeroUIProvider>

      <AuthContextProvider>

          <CounterContext>

            <RouterProvider router={ router }/>
            <ToastContainer/>

            <Offline>
              <p className='bg-black fixed w-full z-50 text-white text-center text-2xl p-5 top-1/2'>You are Offline</p>
            </Offline>

          </CounterContext>

      </AuthContextProvider>
      
    </HeroUIProvider>

</QueryClientProvider>

  </>
  
}
