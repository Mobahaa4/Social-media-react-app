import axios from 'axios'
import React, { useContext, useRef, useState } from 'react'
import { authContext } from '../Context/AuthContextProvider'

import PostCard from '../post/PostCard';
import PostLoading from '../post/PostLoading';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { CiImageOn } from "react-icons/ci";

import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    useDisclosure,
} from "@heroui/react";
import { toast } from 'react-toastify';
import { Helmet } from 'react-helmet';
import CommentData from '../CommentData/CommentData';
import { Comment } from 'react-loader-spinner';
import CommentPost from '../post/CommentPost';




export default function Home() {

    const{token} = useContext(authContext)
    const {isOpen, onOpen, onOpenChange} = useDisclosure();
    const imageInput = useRef(null)
    const postBodyInput = useRef(null)
    const [imageUrl, setimageUrl] = useState(null)
    const queruClient = useQueryClient()

    

    // const [posts, setposts] = useState(null)
    // const [Loading, setLoading] = useState(true)

    // async function getAllPosts(){

    // try {
    //     let {data} = await axios.get("https://linked-posts.routemisr.com/posts?limit=50",{
    //         headers : {
    //             token : token
    //         }
    //     })
        
    //     setPosts(data.posts)                                               (Any commented code is the the code without useQuery but that doesn't mean it is not true)
    //     setLoading(false)                        

    // } 

    // catch (error) {
    //     console.log(error)
    // }

    // }
    // useEffect( function() {
    //     getAllPosts()
    // }, [] )
    
    async function getAllPosts(){


        return axios.get("https://route-posts.routemisr.com/posts" , {                //the function must return a promise
            headers : {
                //token : token
                Authorization : `Bearer ${token}`
            },
            params : {
                sort : "-createdAt"
            }
        })
    }


    
    
    function handlePreview(){
        const imageFile = imageInput.current.files[0]
        const imagePath = URL.createObjectURL(imageFile)
        setimageUrl(imagePath)
    }
    
    const {data, isLoading, isError, refetch }=useQuery({
        queryFn : getAllPosts,   
        queryKey : ["posts"]
    })

    console.log(data)
    
    if(isLoading){
        return <PostLoading/>
    }
    
    if(isError){
        return <h1>There is an Error</h1>
    }
    
    async function createPost(){

        const formData = new FormData()

        if(imageInput.current.files){
            formData.append("image" , imageInput.current.files[0])
        }

        if(postBodyInput.current.value){
            formData.append("body" , postBodyInput.current.value)
        }

        const {data} =  await axios.post("https://route-posts.routemisr.com/posts", formData ,{
            headers : {
                Authorization : `Bearer ${token}`
            }
        });
        console.log(data)

        if(data.message === "post created successfully"){
            clearImage()
            postBodyInput.current.value = ""
            toast("Post is Created",{
                position : "top-right"
            })
            onOpenChange(false)
            queruClient.invalidateQueries(["posts"]) 
            // refetch() (both are true)
        }
        
    }

    function clearImage(){
        setimageUrl(null)
        imageInput.current.value = ""
    }
    

    return (
        <>

        <Helmet>
            <title> Home Page </title>
        </Helmet>


        <Button className='w-9/12 mx-auto block ' onPress={onOpen}>What is in your Mind</Button>
            <Modal isOpen={isOpen}  onOpenChange={onOpenChange}>
                <ModalContent>
                {(onClose) => (
                    <>
                    <ModalHeader className="flex flex-col gap-1">Create your post</ModalHeader>
                    <ModalBody className='my-2'>

                        <textarea ref={postBodyInput} rows={6} placeholder='Write your post' className='shadow border-1 p-3 rounded-xl'/>

                        <input ref={imageInput} onChange={handlePreview} type="file" id='image' className='hidden' />
                        <label htmlFor='image' className='flex gap-2 p-1.5 items-center w-fit bg-gray-200 rounded-2xl cursor-pointer'>
                            <CiImageOn/>
                            <p>Upload photo</p>
                        </label>
                        <div className="relative">
                            {imageUrl &&<>
                                <img src={imageUrl} alt="" className='rounded-xl'/>
                                <Button className='bg-red-600 absolute text-white top-1.5 right-1.5' onClick={clearImage}>X</Button>
                            </>}
                        </div>



                    </ModalBody>
                    <ModalFooter>
                        <Button color="danger" variant="light" onPress={onClose}>
                        Close
                        </Button>
                        <Button color="primary" onClick={createPost}>
                        Post
                        </Button>
                    </ModalFooter>
                    </>
                )}
                </ModalContent>
            </Modal>


        {/* { Loading ? <PostLoading/> : posts.map( (post) =>  <PostCard key={post._id} post={post} commentlimit={2}/> ) }*/}
        {data.data.data.posts.map(  (post) =>  <PostCard key={post._id} post={post} commentlimit={2}/> )}
        
        


        </>
            )


}

