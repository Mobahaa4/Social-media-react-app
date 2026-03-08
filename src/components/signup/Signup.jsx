import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from "zod";
import axios from 'axios';
import { Oval } from 'react-loader-spinner';
import { useNavigate } from 'react-router-dom';

let signUpSchema = z.object({
    name : z.string("plz enter your name").min(3, "Min 3 letters").max(20,"Max 20 letters"),
    email : z.email("invalid email"),
    password : z.string("plz enter your password").regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/,"Write another password"),
    rePassword : z.string("Confirm your password").regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/, "password and repassword are not the same"),
    dateOfBirth : z.string("Submit your date of birth"),
    gender : z.enum(["male", "female"],"Choose Your gender" )
}).refine(function(value){
    return value.password === value.rePassword
},{
    error : "password and repassword are not the same",
    path : ["rePassword"]
})
export default function Signup() {
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
            name : "",
            email : "",
            password : "",
            rePassword : "",
            dateOfBirth : "",
            gender : ""
        },
        resolver : zodResolver(signUpSchema)
    })

    console.log(formState.errors)

    const [errorMsg, seterrorMsg] = useState(null)
    const [sucessMsg, setsucessMsg] = useState(null)
    const [Loading, setLoading] = useState(null)


async function myHandleSubmit(values){
    try {
        setLoading(true)
        const {data} = await axios.post("https://route-posts.routemisr.com/users/signup", values)
        
        console.log(data)
        setsucessMsg(data.message)

        setTimeout(() => {
            setsucessMsg(null)
        }, 700);
        setTimeout(() => {
            nav("/Login")
        }, 1500);
    } catch (error) {
        seterrorMsg(error.response.data.error)
        
    }

    }

    return <>

<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 p-4 rounded-2xl">

    <div className="w-full max-w-lg bg-white shadow-2xl rounded-2xl p-8">

        <h1 className="text-4xl font-bold text-center text-slate-800 mb-8 animate-pulse">
        Sign Up
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
        className="p-3"
        >

        <div className="flex flex-col">
                <label htmlFor="name" className="text-sm font-semibold text-slate-600 mb-1">
                Name
                </label>

                <input
                {...register("name")}
                type="text"
                id="name"
                placeholder="Enter your name"
                className="border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none py-3 px-3 rounded-lg transition"
                />

                {formState.errors.name && (
                <p className="text-red-500 text-sm mt-1">
                    {formState.errors.name?.message}
                </p>
                )}
            </div>

            <div className="flex flex-col">
                <label htmlFor="mail" className="text-sm font-semibold text-slate-600 mb-1">
                Email
                </label>

                <input
                {...register("email")}
                type="email"
                id="mail"
                placeholder="Enter your email"
                className="border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none py-3 px-3 rounded-lg transition"
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
                className="border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none py-3 px-3 rounded-lg transition"
                />

                {formState.errors.password && (
                <p className="text-red-500 text-sm mt-1">
                    {formState.errors.password?.message}
                </p>
                )}
            </div>

            <div className="flex flex-col">
                <label htmlFor="repass" className="text-sm font-semibold text-slate-600 mb-1">
                Confirm Password
                </label>

                <input
                {...register("rePassword")}
                type="password"
                id="repass"
                placeholder="Confirm your password"
                className="border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none py-3 px-3 rounded-lg transition"
                />

                {formState.errors.rePassword && (
                <p className="text-red-500 text-sm mt-1">
                    {formState.errors.rePassword?.message}
                </p>
                )}
            </div>

            <div className="flex flex-col">
                <label htmlFor="birth" className="text-sm font-semibold text-slate-600 mb-1">
                Date of Birth
                </label>

                <input
                {...register("dateOfBirth")}
                type="date"
                id="birth"
                className="border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none py-3 px-3 rounded-lg transition"
                />

                {formState.errors.dateOfBirth && (
                <p className="text-red-500 text-sm mt-1">
                    {formState.errors.dateOfBirth?.message}
                </p>
                )}
            </div>

            <div>
                <p className="text-sm font-semibold text-slate-600 mb-2">Gender</p>

                <div className="flex gap-6">
                <label className="flex items-center gap-2">
                    <input
                    {...register("gender")}
                    name="gender"
                    value="male"
                    type="radio"
                    className="accent-blue-600"
                    />
                    Male
                </label>

                <label className="flex items-center gap-2">
                    <input
                    {...register("gender")}
                    name="gender"
                    value="female"
                    type="radio"
                    className="accent-blue-600"
                    />
                    Female
                </label>
                </div>

                {formState.errors.gender && (
                <p className="text-red-500 text-sm mt-1">
                    {formState.errors.gender?.message}
                </p>
                )}
            </div>

            {Loading ? (
                <button
                disabled
                className="w-full mt-4 bg-blue-300 p-3 rounded-lg flex justify-center items-center"
                >
                <Oval visible={true} height="28" width="28" color="white" />
                </button>
            ) : (
                <button className="w-full mt-4 bg-blue-600 hover:bg-blue-700 transition p-3 rounded-lg text-md font-semibold text-white shadow-md">
                Sign Up Now
                </button>
            )}

            </form>
        </div>
    </div>
    
    </>
}
