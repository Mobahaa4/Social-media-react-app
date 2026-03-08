import React, { useContext, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from "zod";
import axios from 'axios';
import { Oval } from 'react-loader-spinner';
import { useNavigate } from 'react-router-dom';
import { authContext } from '../Context/AuthContextProvider';

let signUpSchema = z.object({
    email : z.email("invalid email"),
    password : z.string("plz enter your password").regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/,"Write another password")

})
export default function Login() {
    let nav = useNavigate()
    // const [userName, setuserName] = useState("")

    // function handleSubmit(e){
    //     e.preventDefault()    //the form default behaviur is th reload with any submit so we prevent it
    // }

    // function handleChange(e){
    //     setuserName(e.target.value)
    // }
    

    let {handleSubmit, register, formState} = useForm({
        defaultValues : {
            email : "",
            password : ""
        },
        resolver : zodResolver(signUpSchema)
    })

    console.log(formState.errors)

    let {setToken} = useContext(authContext)

    const [errorMsg, seterrorMsg] = useState(null)
    const [sucessMsg, setsucessMsg] = useState(null)
    const [Loading, setLoading] = useState(null)


async function myHandleSubmit(values){
    try {
        setLoading(true)
        const {data} = await axios.post("https://route-posts.routemisr.com/users/signin", values)  
        
        console.log(data)
        setsucessMsg(data.message)
        setToken(data.data.token)
        localStorage.setItem("token", data.data.token)


        setTimeout(() => {
            setsucessMsg(null)
        }, 700);

        setTimeout(() => {
            nav("/home")
        }, 1500);
    } catch (error) {
        seterrorMsg(error.response.data.error)
        
    }

    }

    return <>

    <div className="min-h-screen max-w-5xl flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 p-5 rounded-2xl">

        <div className="w-9/12  bg-white shadow-2xl rounded-2xl p-8">

            <h1 className="text-4xl font-bold animate-pulse text-center text-slate-800 mb-8">
            Login
            </h1>

            {(errorMsg && (
            <p className="bg-red-500 text-white text-center text-sm p-3 mb-4 rounded-lg">
                {errorMsg}
            </p>
            )) ||
            (sucessMsg && (
                <p className="bg-emerald-500 text-white text-center text-sm p-3 mb-4 rounded-lg">
                {sucessMsg}
                </p>
            ))}

            <form
            onSubmit={handleSubmit(myHandleSubmit)}
            autoComplete="off"
            className='py-3'
            >

            <div className="flex flex-col">
                <label htmlFor="mail" className="text-sm font-semibold text-slate-600 mb-1">
                Email
                </label>

                <input
                {...register("email")}
                type="email"
                id="mail"
                placeholder="Enter your email"
                className="border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none py-3 px-3 text-md rounded-lg transition"
                />

                {formState.errors.email && (
                <p className="text-red-500 text-sm mt-1">
                    {formState.errors.email?.message}
                </p>
                )}
            </div>

            <div className="flex flex-col">
                <label htmlFor="pass" className="text-sm font-semibold text-slate-600 mb-1">
                Password
                </label>

                <input
                {...register("password")}
                type="password"
                id="pass"
                placeholder="Enter your password"
                className="border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none py-3 px-3 text-md rounded-lg transition"
                />

                {formState.errors.password && (
                <p className="text-red-500 text-sm mt-1">
                    {formState.errors.password?.message}
                </p>
                )}
            </div>

            {Loading ? (
                <button
                disabled
                className="w-full mt-4 bg-blue-300 p-3 rounded-lg flex justify-center items-center"
                >
                <Oval
                    visible={true}
                    height="28"
                    width="28"
                    color="white"
                    ariaLabel="oval-loading"
                />
                </button>
            ) : (
                <button className="w-full mt-4 bg-blue-600 hover:bg-blue-700 transition p-3 rounded-lg text-md font-semibold text-white shadow-md">
                Login
                </button>
            )}
            </form>
        </div>
    </div>

</>

}
