import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '../navbar/Navbar'



export default function Layout() {


    return<>
    <Navbar/>
    <div className='bg-gray-400'>
        <div className='max-w-5xl mx-auto p-5 '>       {/*by this way any child will be rendered in this style*/}
            <Outlet/>
        </div>
    </div>



    </>
}
