import axios from 'axios'
import React, { useContext } from 'react'
import { Helmet } from 'react-helmet'
import { authContext } from '../Context/AuthContextProvider'
import { useQuery } from '@tanstack/react-query'
import PostLoading from '../post/PostLoading'
export default function Profiles() {
    const {token} = useContext(authContext)
    async function getProfile () {
        return axios.get("https://route-posts.routemisr.com/users/profile-data",{
            headers : {
                Authorization : `Bearer ${token}`
            }
        }) 
    }

    const {data, isLoading} = useQuery({
        queryFn : getProfile,
        queryKey : ["profileData"]
    })

    if(isLoading){
        return <PostLoading/>
    }
    
    const createdDate = new Date(data.data.data.user.createdAt).toLocaleString("en-us",{
        year : "numeric",
        month : "short",
        day : "2-digit"
    })

    const birthDate = new Date(data.data.data.user.dateOfBirth).toLocaleString("en-us",{
        year : "numeric",
        month : "short",
        day : "2-digit"
    })
    


    return (
    <>
        
        <Helmet>
            <title> Profile Page </title>
        </Helmet>


        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-800 flex items-center justify-center p-6 rounded-2xl">
            <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl p-8">
                
                <div className="flex items-center gap-6 mb-8">
                <div>
                    <h2 className="text-3xl font-bold text-gray-800">{data.data.data.user.name}</h2>
                    <p className="text-indigo-600 font-medium">
                    Frontend Developer
                    </p>
                </div>
                </div>


                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                

                <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                    Email
                    </label>
                    <div className="bg-gray-100 rounded-lg px-4 py-3 text-gray-800 shadow-sm">
                        {data.data.data.user.email}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                    username
                    </label>
                    <div className="bg-gray-100 rounded-lg px-4 py-3 text-gray-800 shadow-sm">
                        {data.data.data.user.username}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                    CreatedAt
                    </label>
                    <div className="bg-gray-100 rounded-lg px-4 py-3 text-gray-800 shadow-sm">
                        {createdDate}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                    Gender
                    </label>
                    <div className="bg-gray-100 rounded-lg px-4 py-3 text-gray-800 shadow-sm">
                        {data.data.data.user.gender}
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                    Date of Birth
                    </label>
                    <div className="bg-gray-100 rounded-lg px-4 py-3 text-gray-800 shadow-sm">
                        {birthDate}
                    </div>
                </div>

                </div>

            </div>
        </div>

    </>
    )
}
