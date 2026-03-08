import React, { useContext } from "react";
import {
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    Avatar,
    Button,
    Image,
} from "@heroui/react";
import { AiFillLike } from "react-icons/ai";
import { FaComment, FaShare } from "react-icons/fa";
import CommentPost from "../CommentData/CommentData";
import { Link } from "react-router-dom";
import { useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from 'react-toastify';
import axios from "axios";
import {Dropdown, DropdownTrigger, DropdownMenu, DropdownItem} from "@heroui/react";
import { BsThreeDots } from "react-icons/bs";
import { authContext } from "../Context/AuthContextProvider";
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    useDisclosure
} from "@heroui/react";

import { useState } from "react";
import { CiImageOn } from "react-icons/ci";
import { func } from "prop-types";

export default function PostCard({ post }) {        


    const CommentInput = useRef(null)
    const postTextInput = useRef(null)
    const postImageInput = useRef(null)
    const queryClient = useQueryClient()
    const {userId, token} = useContext(authContext)
    const {isOpen, onOpen, onOpenChange} = useDisclosure();
    const [imageUrl, setimageUrl] = useState(post.image)


    async function createComment() {

        const CommentData = {
            content : CommentInput.current.value
        }
        
        return await axios.post(`https://route-posts.routemisr.com/posts/${post._id}/comments`, CommentData, {
            headers:{
                Authorization: `Bearer ${token}`
            }
        })
            
    }
    

    const {data, isPending, mutate} = useMutation({
        mutationFn : createComment,

        onSuccess : function (data){
            queryClient.invalidateQueries(["postData", post._id])
            toast("Comment is added",{
                position : "top-right",
            });
        },
        onError : function (error){
            console.log("onError", error)
            toast("Comment is not added",{
                position : "top-right"
            });
        },

        onSettled : function(){
            CommentInput.current.value = ""
        }
    

    })
    


    async function deletePost(){
        const {data} = await axios.delete(`https://route-posts.routemisr.com/posts/${post._id}`, {
            headers:{
                Authorization: `Bearer ${token}`
            }
        })
        toast("Post is deleted",{
                position : "top-right",
        });
        queryClient.invalidateQueries(["posts"])
        
    }
    
    function getPostImage (){
        const imagePath = URL.createObjectURL(imageUrl)
        setimageUrl(imagePath)
    }
    
    function clearImagePreview (){
        setimageUrl(null)
        postImageInput.current.value = ""
    }

    function handleNewPreview(){
        const imagePath = URL.createObjectURL(postImageInput.current.files[0])
        setimageUrl(imagePath)
    }
    async function updatePost (){

        const newFormData = new FormData()

        if(postImageInput.current.files){
            newFormData.append("image" , postImageInput.current.files[0])
        }

        if(postTextInput.current.value){
            newFormData.append("body" , postTextInput.current.value)
        }
        

        const {data} = await axios.put(`https://route-posts.routemisr.com/posts/${post._id}`, newFormData ,{
            headers : {
                Authorization: `Bearer ${token}`
            }
        })
        
        onOpenChange(false)
        toast(`${data.message}`,{
            position : "top-right"
        })
        queryClient.invalidateQueries(["postData", post._id])
    }
    

    return (
        <>
        <Card className="max-w-3xl my-5 mx-auto">
            <CardHeader className="justify-between">
            <div className="flex gap-5">
                <Avatar isBordered radius="full" size="md" src={post.user.photo} />
                <div className="flex flex-col gap-1 items-start justify-center">
                <h4 className="text-small font-semibold leading-none text-default-600">
                    {post.user.name}
                </h4>
                <Link to={`/PostData/${post._id}`}>
                    <h5 className="text-small tracking-tight text-default-400">
                    {new Date(post.createdAt).toLocaleString("en-us", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "numeric",
                        minute: "2-digit",
                    })}
                    </h5>
                </Link>
                </div>
            </div>
            {userId === post.user._id ? <Dropdown>
                <DropdownTrigger>
                    <Button variant="light"> <BsThreeDots/> </Button>
                </DropdownTrigger>
                <DropdownMenu aria-label="Static Actions">
                    <DropdownItem onPress={onOpen} key="edit">Edit Post</DropdownItem>
                    <DropdownItem key="delete" className="text-danger" color="danger" onClick={deletePost}>
                    Delete Post
                    </DropdownItem>
                </DropdownMenu>
            </Dropdown> : ""}


        <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
            <ModalContent>
            {(onClose) => (
                <>
                <ModalHeader className="flex flex-col gap-1">Post Edit</ModalHeader>
                <ModalBody>

                    <textarea ref={postTextInput} defaultValue={post.body} rows={6} className='shadow border-1 p-3 rounded-xl'></textarea>

                    <input ref={postImageInput} onChange={handleNewPreview} type="file" id='image' className='hidden' />
                    <label htmlFor='image' className='flex gap-2 p-1.5 items-center w-fit bg-gray-200 rounded-2xl cursor-pointer'>
                        <CiImageOn/>
                        <p>Upload photo</p>
                    </label>

                    <div className="relative">
                        {imageUrl &&<>
                            <img src={imageUrl} alt="" className='rounded-xl'/>
                            <Button className='bg-red-600 absolute text-white top-1.5 right-1.5' onClick={clearImagePreview}>X</Button>
                        </>}
                    </div>



                </ModalBody>
                <ModalFooter>
                    <Button color="danger" variant="light" onPress={onClose}>
                    Close
                    </Button>
                    <Button color="primary" onPress={onClose} onClick={updatePost}>
                    Edit
                    </Button>
                </ModalFooter>
                </>
            )}
            </ModalContent>
        </Modal>





                    
            </CardHeader>
            <CardBody className="px-3 py-0 text-small">
            <p>{post.body}</p>
            {post.image && <Image alt={post.body} src={post.image} />}
            </CardBody>
            <CardFooter className="block">
            {" "}
            {/* has flex by default */}
                <div className="actions flex justify-between items-center">
                    <div className="flex items-center gap-1">
                    <AiFillLike />
                    <p>like</p>
                    </div>

                    <div className="flex items-center gap-1">
                    <FaComment />
                    <p>Comment</p>
                    </div>

                    <div className="flex items-center gap-1">
                    <FaShare />
                    <p>Share</p>
                    </div>
                </div>

                <div className="flex gap-2 w-full my-2">
                    <input type="text" ref={CommentInput}  className="w-full p-2 border-1 rounded-2xl" placeholder="Enter your comment" />
                    <Button onClick = {mutate}  className="bg-sky-400 text-white p-2"> { isPending ? "Loading" : "Comment" }  </Button>
                    
                </div>


                <div className="comments">
                    <CommentPost id={post._id} commentlimit={4}/>
                </div>
            </CardFooter>
        </Card>
        </>
    );
}
