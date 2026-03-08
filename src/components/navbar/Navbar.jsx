import React, { useContext } from 'react'
import { ContextCounter } from '../Context/CounterContext'
import {Navbar, NavbarBrand, NavbarContent, NavbarItem, Button} from "@heroui/react";
import { Link, useNavigate } from 'react-router-dom';
import { authContext } from '../Context/AuthContextProvider';


// "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiNjk4ZGJkMzczYmY5NzM3MTE3NjRjMzQ0IiwiaWF0IjoxNzcwOTE2NjQzfQ.QqjyLLqnivUryVNLYAC8TbFtYunfWby-NIO8FOdc7zU"

export default function MyNavbar() {
    let Count = useContext(ContextCounter)
    let {token, setToken} = useContext(authContext)
    let nav = useNavigate()
    function handleLogout(){
        localStorage.removeItem("token")
        setToken(null)
        nav('./Login')
    }
    return (
    <Navbar className='bg-slate-900'>
    <NavbarBrand>
        <p className="font-bold text-inherit text-white">LinkedPosts</p>
    </NavbarBrand>
    <NavbarContent className="hidden sm:flex gap-4" justify="center">
        {token ? 
        <>
        <NavbarItem>
            <Link color="foreground" className='text-blue-400' to={"/home"}>
                Home
            </Link>
        </NavbarItem>

        <NavbarItem isActive>
            <Link aria-current="page" className='text-blue-400' to={"/Profiles"}>
                Profiles
            </Link>
        </NavbarItem>
        </> : ""}

    </NavbarContent>
    <NavbarContent justify="end">

        {token ?  

        <NavbarItem className="hidden lg:flex">
            <Button onClick={handleLogout} className='text-blue-400 bg-transparent'  >Logout</Button>
        </NavbarItem> : 

        <>
        <NavbarItem className="hidden lg:flex">
            <Link to={"/Login"} className='text-blue-400 hover:opacity-70 transition duration-500' >Login</Link>
        </NavbarItem>

        <NavbarItem>
        <Button as={Link} color="primary" to={"/Signup"} className='text-blue-400 bg-transparent'  variant="flat">
            Sign Up
        </Button>
        </NavbarItem>
        </>
        }
    </NavbarContent>
    </Navbar>
    )
}
